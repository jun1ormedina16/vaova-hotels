import { useHotels } from "../context/HotelsContext";
import { useReservations } from "../context/ReservationsContext";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import NavbarPremium from "../components/NavbarPremium";

const DashboardHotel = () => {
  const { hotels } = useHotels();
  const { reservations } = useReservations();
  const { user } = useUser();

  const [showReservations, setShowReservations] = useState(false);

  // Filtrar los hoteles administrados por el usuario
  const myHotels = hotels.filter(h => h.adminEmail === user.email);

  // Filtrar las reservas de los hoteles del usuario
  const myReservations = reservations.filter(r =>
    myHotels.some(h => h.id === r.hotelId)
  );

  return (
    <>
      <NavbarPremium />

      <div className="container mt-5">
        <button className="btn btn-primary mb-4" onClick={() => setShowReservations(prev => !prev)}>
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
                      <ul className="list-unstyled mb-0">
                        <li>Single: {hotel.rooms.single > 0 ? hotel.rooms.single : "No disponible"}</li>
                        <li>Two Twin: {hotel.rooms.twoTwin > 0 ? hotel.rooms.twoTwin : "No disponible"}</li>
                        <li>One Queen: {hotel.rooms.oneQueen > 0 ? hotel.rooms.oneQueen : "No disponible"}</li>
                      </ul>
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
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${idx}`} aria-expanded="false" aria-controls={`collapse${idx}`}>
                        Reserva: {hotel.name} - {res.userId}
                      </button>
                    </h2>
                    <div id={`collapse${idx}`} className="accordion-collapse collapse" aria-labelledby={`heading${idx}`} data-bs-parent="#reservasAccordion">
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
