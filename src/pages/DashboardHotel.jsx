import { useHotels } from "../context/HotelsContext";
import { useReservations } from "../context/ReservationsContext";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import NavbarPremium from "../components/NavbarPremium";

const DashboardHotel = () => {
  const { hotels, addHotel, updateHotel, deleteHotel } = useHotels();
  const { reservations } = useReservations();
  const { user } = useUser();

  const [showReservations, setShowReservations] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [hotelForm, setHotelForm] = useState({
    name: "",
    description: "",
    country: "",
    state: "",
    city: "",
    stars: 3,
    score: 0,
    rooms: { single: 0, twoTwin: 0, oneQueen: 0 },
    images: [],
  });

  const myHotels = hotels.filter(h => h.adminEmail === user.email);
  const myReservations = reservations.filter(r =>
    myHotels.some(h => h.id === r.hotelId)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in hotelForm.rooms) {
      setHotelForm(prev => ({
        ...prev,
        rooms: { ...prev.rooms, [name]: Number(value) }
      }));
    } else {
      setHotelForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setHotelForm(prev => ({ ...prev, images: urls }));
  };

  const handleSaveHotel = () => {
    if (editingHotelId) {
      updateHotel(editingHotelId, { ...hotelForm, adminEmail: user.email });
      setEditingHotelId(null);
    } else {
      addHotel({ ...hotelForm, id: Date.now().toString(), adminEmail: user.email });
    }
    setHotelForm({
      name: "",
      description: "",
      country: "",
      state: "",
      city: "",
      stars: 3,
      score: 0,
      rooms: { single: 0, twoTwin: 0, oneQueen: 0 },
      images: [],
    });
  };

  const handleEditHotel = (hotel) => {
    setEditingHotelId(hotel.id);
    setHotelForm({ ...hotel });
  };

  const handleDeleteHotel = (id) => {
    if (!window.confirm("¿Deseas eliminar este hotel?")) return;
    deleteHotel(id);
  };

  return (
    <>
      <NavbarPremium />

      <div className="container mt-5">
        <div className="mb-4">
          <h2>{editingHotelId ? "Editar Hotel" : "Agregar Hotel"}</h2>
          <div className="card p-3 mb-4 shadow-sm">
            <div className="mb-2">
              <label className="form-label">Nombre:</label>
              <input type="text" className="form-control" name="name" value={hotelForm.name} onChange={handleInputChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">Descripción:</label>
              <textarea className="form-control" name="description" value={hotelForm.description} onChange={handleInputChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">País:</label>
              <input type="text" className="form-control" name="country" value={hotelForm.country} onChange={handleInputChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">Departamento/Estado:</label>
              <input type="text" className="form-control" name="state" value={hotelForm.state} onChange={handleInputChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">Ciudad:</label>
              <input type="text" className="form-control" name="city" value={hotelForm.city} onChange={handleInputChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">Estrellas (3-5):</label>
              <input type="number" min="3" max="5" className="form-control" name="stars" value={hotelForm.stars} onChange={handleInputChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">Score:</label>
              <input type="number" min="0" max="100" className="form-control" name="score" value={hotelForm.score} onChange={handleInputChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">Habitaciones:</label>
              <div className="d-flex gap-2">
                <input type="number" min="0" className="form-control" name="single" value={hotelForm.rooms.single} onChange={handleInputChange} placeholder="Single" />
                <input type="number" min="0" className="form-control" name="twoTwin" value={hotelForm.rooms.twoTwin} onChange={handleInputChange} placeholder="Two Twin" />
                <input type="number" min="0" className="form-control" name="oneQueen" value={hotelForm.rooms.oneQueen} onChange={handleInputChange} placeholder="One Queen" />
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label">Imágenes:</label>
              <input type="file" multiple accept="image/*" className="form-control" onChange={handleImagesChange} />
            </div>
            <button className="btn btn-success mt-2" onClick={handleSaveHotel}>
              {editingHotelId ? "Guardar Cambios" : "Agregar Hotel"}
            </button>
          </div>
        </div>

        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowReservations(prev => !prev)}
        >
          {showReservations ? "Regresar al Dashboard" : `Ver Reservas (${myReservations.length})`}
        </button>

        {!showReservations && (
          <>
            <h2 className="mb-4">Mis Hoteles</h2>
            <div className="row g-4">
              {myHotels.length === 0 && <p>No tienes hoteles registrados.</p>}
              {myHotels.map(hotel => (
                <div key={hotel.id} className="col-md-6 col-lg-4">
                  <div className="card hotel-card h-100 shadow-sm">
                    {hotel.images && hotel.images.length > 0 && (
                      <img src={hotel.images[0]} alt={hotel.name} className="card-img-top hotel-img" />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{hotel.name}</h5>
                      <p className="card-text">{hotel.description}</p>
                      <div className="mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: i < hotel.stars ? "#FFD700" : "#ccc" }}>★</span>
                        ))}
                        <span className="ms-2 badge bg-info text-dark">Score: {hotel.score}</span>
                      </div>
                      <ul className="list-unstyled mb-2">
                        <li>Single: {hotel.rooms.single > 0 ? hotel.rooms.single : "No disponible"}</li>
                        <li>Two Twin: {hotel.rooms.twoTwin > 0 ? hotel.rooms.twoTwin : "No disponible"}</li>
                        <li>One Queen: {hotel.rooms.oneQueen > 0 ? hotel.rooms.oneQueen : "No disponible"}</li>
                      </ul>
                      <div className="d-flex gap-2">
                        <button className="btn btn-warning btn-sm" onClick={() => handleEditHotel(hotel)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteHotel(hotel.id)}>Eliminar</button>
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
            <h2 className="mb-4">Reservas de mis Hoteles</h2>
            {myReservations.length === 0 && <p>No hay reservas.</p>}
            <div className="accordion" id="reservasAccordion">
              {myReservations.map((res, idx) => {
                const hotel = myHotels.find(h => h.id === res.hotelId);
                if (!hotel) return null;

                return (
                  <div className="accordion-item mb-3 shadow-sm rounded-4" key={res.id}>
                    <h2 className="accordion-header" id={`heading${idx}`}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${idx}`}
                        aria-expanded="false"
                        aria-controls={`collapse${idx}`}
                      >
                        Reserva: {hotel.name} - {res.userId}
                      </button>
                    </h2>
                    <div
                      id={`collapse${idx}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading${idx}`}
                      data-bs-parent="#reservasAccordion"
                    >
                      <div className="accordion-body">
                        <p><strong>Usuario:</strong> {res.userId}</p>
                        <p><strong>Hotel:</strong> {hotel.name}</p>
                        <p><strong>Habitación:</strong> {res.roomType}</p>
                        <p><strong>Cantidad:</strong> {res.quantity}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <style>{`
        .hotel-card {
          border-radius: 20px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .hotel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .hotel-img {
          height: 200px;
          object-fit: cover;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }
      `}</style>
    </>
  );
};

export default DashboardHotel;
