import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  // redirect to /login if user is not signed in
  if(!currentUser){
    return(<Navigate to="/login" replace />)
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center">
            <h1 className="display-4 mb-4">Are you Smarter Than a Monkey?</h1>
            <p className="lead mb-4">
              Click the squares in order according to their numbers. Let's see if you have a better memory than a monkey!
            </p>
            
            <div className="mt-4">
              {currentUser ? (
                <Link to="/test" className="btn btn-success btn-lg">
                  Start Test
                </Link>
              ) : (
                <Link to="/login" className="btn btn-primary btn-lg">
                  Sign Up to Get Started
                </Link>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;