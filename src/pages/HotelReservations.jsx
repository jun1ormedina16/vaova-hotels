import { useHotels } from "../context/HotelsContext";
import { useReservations } from "../context/ReservationsContext";
import { useUser } from "../context/UserContext";
import NavbarPremium from "../components/NavbarPremium";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useState } from "react";

const HotelReservations = () => {
  const { hotels, updateHotel } = useHotels();
  const { reservations, updateReservation, deleteReservation } = useReservations();
  const { user } = useUser();
  const navigate = useNavigate();

  const myHotels = user ? hotels.filter(h => h.adminEmail === user.email) : [];
  const myReservations = reservations.filter(r => myHotels.some(h => h.id === r.hotelId));

  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editRoom, setEditRoom] = useState("");

  const handleCancel = (res) => {
    if (!window.confirm("¿Deseas cancelar esta reserva?")) return;
    const hotel = hotels.find(h => h.id === res.hotelId);
    if (hotel) {
      updateHotel(hotel.id, { ...hotel, rooms: { ...hotel.rooms, [res.roomType]: hotel.rooms[res.roomType] + res.quantity } });
    }
    deleteReservation(res.id);
  };

  const handleEdit = (res) => {
    setEditingId(res.id);
    setEditQuantity(res.quantity);
    setEditRoom(res.roomType);
  };

  const handleSave = (res) => {
    const hotel = hotels.find(h => h.id === res.hotelId);
    if (!hotel) return;

    if (editRoom === res.roomType) {
      const diff = editQuantity - res.quantity;
      if (hotel.rooms[res.roomType] < diff) return alert("No hay suficiente disponibilidad");
      updateHotel(hotel.id, { ...hotel, rooms: { ...hotel.rooms, [res.roomType]: hotel.rooms[res.roomType] - diff } });
    } else {
      updateHotel(hotel.id, { ...hotel, rooms: { ...hotel.rooms, [res.roomType]: hotel.rooms[res.roomType] + res.quantity } });
      if (hotel.rooms[editRoom] <= 0) return alert("No hay habitaciones disponibles para este tipo");
      updateHotel(hotel.id, { ...hotel, rooms: { ...hotel.rooms, [editRoom]: hotel.rooms[editRoom] - editQuantity } });
    }

    updateReservation(res.id, { ...res, quantity: editQuantity, roomType: editRoom });
    setEditingId(null);
  };

  return (
    <>
      <NavbarPremium />
      <div className="container mt-5">
        <Button variant="secondary" className="mb-4" onClick={() => navigate("/dashboard-hotel")}>
          ← Volver al Dashboard
        </Button>

        <h2 className="mb-4">Reservas de mis hoteles</h2>
        {myReservations.length === 0 && <p>No hay reservas.</p>}

        <Row className="g-4">
          {myReservations.map(res => {
            const hotel = hotels.find(h => h.id === res.hotelId);
            if (!hotel) return null;
            return (
              <Col md={6} key={res.id}>
                <Card className="p-3 shadow-sm" style={{ borderRadius: "15px" }}>
                  {hotel.logo && <Card.Img variant="top" src={hotel.logo} style={{ height: "180px", objectFit: "cover", borderRadius: "15px" }} />}
                  <Card.Body>
                    <Card.Title>{hotel.name}</Card.Title>
                    <Card.Text>
                      {editingId === res.id ? (
                        <Form className="d-flex flex-column gap-2">
                          <Form.Group>
                            <Form.Label>Tipo de habitación</Form.Label>
                            <Form.Select value={editRoom} onChange={e => setEditRoom(e.target.value)}>
                              <option value="single">Single</option>
                              <option value="twoTwin">Two Twin</option>
                              <option value="oneQueen">One Queen</option>
                            </Form.Select>
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control type="number" min={1} value={editQuantity} onChange={e => setEditQuantity(Number(e.target.value))} />
                          </Form.Group>
                          <div className="d-flex gap-2 mt-2">
                            <Button variant="success" onClick={() => handleSave(res)}>Guardar</Button>
                            <Button variant="secondary" onClick={() => setEditingId(null)}>Cancelar</Button>
                          </div>
                        </Form>
                      ) : (
                        <>
                          <p>Usuario: {res.userId}</p>
                          <p>Habitación: {res.roomType}</p>
                          <p>Cantidad: {res.quantity}</p>
                          <div className="d-flex gap-2 mt-2">
                            <Button variant="warning" onClick={() => handleEdit(res)}>Editar</Button>
                            <Button variant="danger" onClick={() => handleCancel(res)}>Cancelar</Button>
                          </div>
                        </>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );
};

export default HotelReservations;
