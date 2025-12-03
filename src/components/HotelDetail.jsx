const HotelDetail = ({ hotel }) => {
  if (!hotel) return <p>No hay hotel seleccionado.</p>;

  return (
    <div className="card shadow-lg rounded-4 p-4">
      <img src={hotel.logo || "https://via.placeholder.com/200"} className="img-fluid rounded-4 mb-3" alt={hotel.name} />
      <h3>{hotel.name}</h3>
      <p>{hotel.description}</p>
      <div>
        <span className="badge bg-primary me-2">{hotel.stars}⭐</span>
        <span className="badge bg-success">Score: {hotel.score}</span>
      </div>
      <div className="mt-3">
        <h6>Habitaciones:</h6>
        <ul>
          <li>Single: {hotel.rooms.single}</li>
          <li>Two Twin: {hotel.rooms.twoTwin}</li>
          <li>One Queen: {hotel.rooms.oneQueen}</li>
        </ul>
      </div>
    </div>
  );
};

export default HotelDetail;
