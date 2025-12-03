import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const NavbarPremium = () => {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="shadow-lg" style={{ background: "linear-gradient(90deg, #4e54c8, #8f94fb)", padding: "0.8rem 2rem" }}>
      <Container fluid>
        <Navbar.Brand onClick={() => navigate('/')} className="fw-bold text-white fs-4" style={{ cursor: 'pointer' }}>
          HotelApp
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-user"
              className="d-flex align-items-center shadow-sm border-0 rounded-pill"
              style={{ background: "rgba(255,255,255,0.25)", color: "white", backdropFilter: "blur(8px)", fontWeight: "600", transition: "0.3s" }}
            >
              <FaUserCircle size={28} className="me-2" color="#fff" />
              {user?.name || 'Usuario'}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: "150px", zIndex: 1050 }}>
              <Dropdown.Item className="text-danger" onClick={handleLogout}>
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarPremium;
