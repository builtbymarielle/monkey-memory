import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <BootstrapNavbar bg="blue" variant="dark" expand="lg">
      <Container>
      {currentUser ? (
          <BootstrapNavbar.Brand as={Link} to="/">
            Monkey Memory
          </BootstrapNavbar.Brand>
        ) : (
          <BootstrapNavbar.Brand
            as="span"
            style={{
              pointerEvents: 'none',
              opacity: 1.0,
              cursor: 'not-allowed'
            }}
          >
            Monkey Memory
          </BootstrapNavbar.Brand>
        )}
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {currentUser && (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/tests">Test</Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {loading ? (
              <Nav.Link>Loading...</Nav.Link>
            ) : currentUser ? (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login"
                  className={location.pathname === '/login' ? 'active' : ''}
                >
                  Login
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/register"
                  className={location.pathname === '/register' ? 'active' : ''}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
