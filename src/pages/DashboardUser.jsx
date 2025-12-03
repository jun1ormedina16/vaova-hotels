import { useReservations } from "../context/ReservationsContext";
import { useHotels } from "../context/HotelsContext";
import { useUser } from "../context/UserContext";
import { useState, useEffect } from "react";
import NavbarPremium from "../components/NavbarPremium";

const DashboardUser = () => {
  const { reservations, addReservation, updateReservation } = useReservations();
  const { hotels, updateHotel } = useHotels();
  const { user } = useUser();

  const [showReservations, setShowReservations] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editRoomType, setEditRoomType] = useState("single");

  const userReservations = reservations.filter(r => r.userId === user.email);
  const activeHotels = hotels.filter(h => h.rooms.single > 0 || h.rooms.twoTwin > 0 || h.rooms.oneQueen > 0);

  // Editar reserva
  const handleEdit = (res) => {
    setEditingId(res.id);
    setEditQuantity(res.quantity);
    setEditRoomType(res.roomType);
  };

  const handleSave = (res) => {
    const hotel = hotels.find(h => h.id === res.hotelId);
    if (!hotel) return;

    const reserved = reservations
      .filter(r => r.hotelId === hotel.id && r.roomType === editRoomType && r.id !== res.id)
      .reduce((acc, r) => acc + r.quantity, 0);

    const available = hotel.rooms[editRoomType] - reserved;
    if (editQuantity > available + res.quantity) return alert("No hay suficiente disponibilidad");

    // Ajustar inventario
    const updatedRooms = { ...hotel.rooms };
    updatedRooms[res.roomType] += res.quantity; // Reponer la antigua reserva
    updatedRooms[editRoomType] -= editQuantity; // Descontar la nueva

    updateHotel(hotel.id, { ...hotel, rooms: updatedRooms });
    updateReservation(res.id, { ...res, roomType: editRoomType, quantity: editQuantity });

    setEditingId(null);
    alert("Reserva actualizada correctamente");
  };

  // Reservar habitación
  const handleReserve = (hotel, roomType) => {
    const reserved = reservations
      .filter(r => r.hotelId === hotel.id && r.roomType === roomType)
      .reduce((acc, r) => acc + r.quantity, 0);

    const available = hotel.rooms[roomType] - reserved;
    if (available < 1) return alert("No hay habitaciones disponibles");

    addReservation({
      id: Date.now().toString(),
      hotelId: hotel.id,
      userId: user.email,
      roomType,
      quantity: 1,
    });

    const updatedRooms = { ...hotel.rooms };
    updatedRooms[roomType] -= 1;
    updateHotel(hotel.id, { ...hotel, rooms: updatedRooms });

    alert(`Reserva realizada en ${hotel.name} (${roomType})`);
  };

  return (
    <>
      <NavbarPremium />

      <div className="container mt-5">
        <button className="btn btn-primary mb-4" onClick={() => setShowReservations(prev => !prev)}>
          {showReservations ? "Regresar al Dashboard" : `Ver Mis Reservas (${userReservations.length})`}
        </button>

        {!showReservations && (
          <>
            <h2 className="mb-4">Hoteles Disponibles</h2>
            <div className="row g-4">
              {activeHotels.length === 0 && <p>No hay hoteles disponibles.</p>}
              {activeHotels.map(hotel => (
                <div key={hotel.id} className="col-md-6 col-lg-4">
                  <div className="card hotel-card h-100 shadow-sm">
                    {hotel.logo && <img src={hotel.logo} alt={hotel.name} className="card-img-top hotel-img" />}
                    <div className="card-body">
                      <h5 className="card-title">{hotel.name}</h5>
                      <p className="card-text">{hotel.description}</p>
                      <div className="mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: i < hotel.stars ? "#FFD700" : "#ccc" }}>★</span>
                        ))}
                        <span className="ms-2 badge bg-info text-dark">Score: {hotel.score}</span>
                      </div>
                      <ul className="list-unstyled mb-3">
                        <li>Single: {hotel.rooms.single > 0 ? hotel.rooms.single : "No disponible"}</li>
                        <li>Two Twin: {hotel.rooms.twoTwin > 0 ? hotel.rooms.twoTwin : "No disponible"}</li>
                        <li>One Queen: {hotel.rooms.oneQueen > 0 ? hotel.rooms.oneQueen : "No disponible"}</li>
                      </ul>
                      <div className="d-flex gap-2 flex-wrap">
                        {hotel.rooms.single > 0 && <button className="btn btn-sm btn-primary" onClick={() => handleReserve(hotel, "single")}>Reservar Single</button>}
                        {hotel.rooms.twoTwin > 0 && <button className="btn btn-sm btn-primary" onClick={() => handleReserve(hotel, "twoTwin")}>Reservar Two Twin</button>}
                        {hotel.rooms.oneQueen > 0 && <button className="btn btn-sm btn-primary" onClick={() => handleReserve(hotel, "oneQueen")}>Reservar One Queen</button>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showReservations && (
          <>
            <h2 className="mb-4">Mis Reservas</h2>
            {userReservations.length === 0 && <p>No tienes reservas.</p>}

            <div className="row g-4">
              {userReservations.map(res => {
                const hotel = hotels.find(h => h.id === res.hotelId);
                if (!hotel) return null;

                return (
                  <div key={res.id} className="col-md-6">
                    <div className="card reservation-card h-100 shadow-sm p-3">
                      {hotel.logo && <img src={hotel.logo} alt={hotel.name} className="card-img-top mb-3 rounded reservation-img" />}
                      <h5>{hotel.name}</h5>

                      {editingId === res.id ? (
                        <>
                          <div className="mb-2">
                            <label className="form-label">Tipo de habitación:</label>
                            <select className="form-select" value={editRoomType} onChange={e => setEditRoomType(e.target.value)}>
                              {["single", "twoTwin", "oneQueen"].map(type => (
                                <option key={type} value={type}>
                                  {type} - Disponible: {hotel.rooms[type] - reservations.filter(r => r.hotelId === hotel.id && r.roomType === type && r.id !== res.id).reduce((acc, r) => acc + r.quantity,0)}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mb-2">
                            <label className="form-label">Cantidad:</label>
                            <input type="number" className="form-control"
                              min="1"
                              max={hotel.rooms[editRoomType] - reservations.filter(r => r.hotelId === hotel.id && r.roomType === editRoomType && r.id !== res.id).reduce((acc, r) => acc + r.quantity,0) + res.quantity}
                              value={editQuantity}
                              onChange={e => setEditQuantity(Number(e.target.value))}
                            />
                          </div>

                          <button className="btn btn-success me-2" onClick={() => handleSave(res)}>Guardar</button>
                          <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <p><strong>Habitación:</strong> {res.roomType}</p>
                          <p><strong>Cantidad:</strong> {res.quantity}</p>
                          <button className="btn btn-warning me-2" onClick={() => handleEdit(res)}>Editar</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <style>{`
        .hotel-card, .reservation-card {
          border-radius: 20px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .hotel-card:hover, .reservation-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .hotel-img, .reservation-img {
          height: 200px;
          object-fit: cover;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }
        button.btn-warning:hover { background-color:#ffc107; color:#000; }
        button.btn-success:hover { background-color:#198754; }
        button.btn-secondary:hover { background-color:#6c757d; color:#fff; }
      `}</style>
    </>
  );
};

export default DashboardUser;
