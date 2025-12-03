import { useHotels } from "../context/HotelsContext";
import { useReservations } from "../context/ReservationsContext";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import NavbarPremium from "../components/NavbarPremium";

const DashboardHotelReservations = () => {
  const { hotels, updateHotel } = useHotels();
  const { reservations, updateReservation, deleteReservation } = useReservations();
  const { user } = useUser();

  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editRoomType, setEditRoomType] = useState("");

  const myHotels = hotels.filter(h => h.adminEmail === user.email);
  const myReservations = reservations.filter(r => myHotels.some(h => h.id === r.hotelId));

  const handleEdit = (res) => {
    setEditingId(res.id);
    setEditQuantity(res.quantity);
    setEditRoomType(res.roomType);
  };

  const handleSave = (res) => {
    const hotel = hotels.find(h => h.id === res.hotelId);
    if (!hotel) return;

    const updatedRooms = { ...hotel.rooms };
    if (res.roomType !== editRoomType) {
      updatedRooms[res.roomType] += res.quantity;
      if (updatedRooms[editRoomType] < 1) return alert("No hay disponibilidad en ese tipo de habitación");
      updatedRooms[editRoomType] -= editQuantity;
    } else {
      const diff = editQuantity - res.quantity;
      if (updatedRooms[res.roomType] < diff) return alert("No hay suficiente disponibilidad");
      updatedRooms[res.roomType] -= diff;
    }

    updateHotel(hotel.id, { ...hotel, rooms: updatedRooms });
    updateReservation(res.id, { ...res, quantity: editQuantity, roomType: editRoomType });
    setEditingId(null);
  };

  const handleCancel = (res) => {
    if (!window.confirm("¿Deseas cancelar esta reserva?")) return;
    const hotel = hotels.find(h => h.id === res.hotelId);
    if (hotel) updateHotel(hotel.id, { ...hotel, rooms: { ...hotel.rooms, [res.roomType]: hotel.rooms[res.roomType] + res.quantity }});
    deleteReservation(res.id);
  };

  const getAvailableRooms = (hotel, roomType, excludeReservationId = null) => {
    const reserved = reservations
      .filter(r => r.hotelId === hotel.id && r.roomType === roomType && r.id !== excludeReservationId)
      .reduce((acc, r) => acc + r.quantity, 0);
    return hotel.rooms[roomType] - reserved;
  };

  return (
    <>
      <NavbarPremium />
      <div className="container mt-5">
        <h2 className="mb-4">Reservas de mis Hoteles</h2>
        {myReservations.length === 0 && <p>No hay reservas.</p>}

        <div className="accordion" id="reservasAccordion">
          {myReservations.map((res, idx) => {
            const hotel = myHotels.find(h => h.id === res.hotelId);
            if (!hotel) return null;

            return (
              <div className="accordion-item mb-3 shadow-sm rounded-4" key={res.id}>
                <h2 className="accordion-header" id={`heading${idx}`}>
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${idx}`} aria-expanded="false" aria-controls={`collapse${idx}`}>
                    Reserva: {hotel.name} - {res.userId}
                  </button>
                </h2>
                <div id={`collapse${idx}`} className="accordion-collapse collapse" aria-labelledby={`heading${idx}`} data-bs-parent="#reservasAccordion">
                  <div className="accordion-body">
                    <p><strong>Usuario:</strong> {res.userId}</p>
                    <p><strong>Hotel:</strong> {hotel.name}</p>
                    <div className="mb-2">
                      <strong>Estrellas: </strong>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < hotel.stars ? "#FFD700" : "#ccc" }}>★</span>
                      ))}
                      <span className="ms-2 badge bg-info text-dark">Score: {hotel.score}</span>
                    </div>

                    {editingId === res.id ? (
                      <>
                        <div className="mb-2">
                          <label className="form-label">Tipo de habitación:</label>
                          <select className="form-select" value={editRoomType} onChange={e => setEditRoomType(e.target.value)}>
                            {["single", "twoTwin", "oneQueen"].map(type => (
                              <option key={type} value={type}>
                                {type} - Disponible: {getAvailableRooms(hotel, type, res.id)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Cantidad:</label>
                          <input type="number" className="form-control" min="1" max={getAvailableRooms(hotel, editRoomType, res.id) + res.quantity} value={editQuantity} onChange={e => setEditQuantity(Number(e.target.value))} />
                        </div>
                        <button className="btn btn-success me-2" onClick={() => handleSave(res)}>Guardar</button>
                        <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <p><strong>Habitación:</strong> {res.roomType}</p>
                        <p><strong>Cantidad:</strong> {res.quantity}</p>
                        <button className="btn btn-warning me-2" onClick={() => handleEdit(res)}>Editar</button>
                        <button className="btn btn-danger" onClick={() => handleCancel(res)}>Cancelar</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .accordion-item { transition: transform 0.3s, box-shadow 0.3s; }
        .accordion-item:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        button.btn-warning:hover { background-color:#ffc107; color:#000; }
        button.btn-danger:hover { background-color:#dc3545; color:#fff; }
        button.btn-success:hover { background-color:#198754; }
      `}</style>
    </>
  );
};

export default DashboardHotelReservations;
