import { useHotels } from "../context/HotelsContext";

const HotelList = ({ onEdit }) => {
  const { hotels, deleteHotel } = useHotels();

  return (
    <div className="row mt-4">
      {hotels.map(h => (
        <div className="col-md-4 mb-4" key={h.id}>
          <div className="card shadow-lg rounded-4 h-100">
            <img src={h.logo || "https://via.placeholder.com/150"} className="card-img-top rounded-top-4" alt={h.name} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{h.name}</h5>
              <p className="card-text">{h.description}</p>
              <div>
                <span className="badge bg-primary me-2">{h.stars}⭐</span>
                <span className="badge bg-success">Score: {h.score}</span>
              </div>
              <div className="mt-2">
                <strong>Habitaciones:</strong>
                <ul className="mb-2">
                  <li>Single: {h.rooms.single}</li>
                  <li>Two Twin: {h.rooms.twoTwin}</li>
                  <li>One Queen: {h.rooms.oneQueen}</li>
                </ul>
              </div>
              <div className="mt-auto d-flex justify-content-between">
                <button className="btn btn-warning btn-sm" onClick={() => onEdit(h)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteHotel(h.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelList;
