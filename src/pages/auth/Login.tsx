/**
* Login Page
* -----------
* Allows users to sign in using their email and password.
*/

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { currentUser, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  
  // Clearing form
  useEffect(() => {
    formRef.current?.reset();
  }, []);


  // Helper function to format Firebase error messages into user-friendly messages
  const getErrorMessage = (error: any): string => {
    const errorCode = error?.code || '';
    const errorMessage = error?.message || '';

    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or try logging in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      default:
        // Return original message if we don't have a custom one
        return errorMessage || 'An error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');


    try {
      await login(email, password);
      navigate('/items');
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if(authLoading) return null;
  // Redirect logged-in users away from login/register pages
  if (currentUser) return <Navigate to="/" replace />;

  // If user forgot password navigate to reset password page
  const resetPassword = () => {
    navigate('/reset-password')
  }

  const registerUser = () => {
    navigate('/register')
  }


  return (
    <div className="banana-bg">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="border-0 shadow-lg">
            <Card.Header className="bg-yellow text-white">
              <h3 className="text-center mb-0">Login</h3>
            </Card.Header>
            <Card.Body className="bg-yellow-light rounded-bottom">
              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}
              <Form ref={formRef} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter email"
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Enter password"
                      className="custom-input"
                    />
                    <Button
                      variant="yellow"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={0}
                    >
                       <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="blue"
                    disabled={loading}
                    size="lg"
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm me-2" />
                    )}
                    Login
                  </Button>

                  <p className='text-center mb-2 text-white'>
                      Don't have an account? {' '}
                      <Button
                        type="button"
                        variant="link-white-underline"
                        onClick={() => registerUser()}
                        disabled={loading}
                        className="p-0 align-baseline"
                      >
                        Register Here
                      </Button>
                  </p>

                  <p className='text-center mb-0 text-white'>
                    <Button
                    type="button"
                    variant="link-white-underline"
                    onClick={resetPassword}
                    className="p-0 align-baseline">
                      Forgot Password?
                    </Button>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
