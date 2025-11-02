import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  // All hooks must be called before any conditional returns
  const { currentUser, login, register, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Determine if we're in login or register mode based on URL
  const isLogin = location.pathname === '/login';

  // Reset form when switching between login and register
  useEffect(() => {
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    // Reset form validation states
    if (formRef.current) {
      formRef.current.reset();
    }
  }, [location.pathname]);

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

    // Validate passwords match when registering
    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please try again.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/items');
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    // Navigate to the opposite route
    if (isLogin) {
      navigate('/register');
    } else {
      navigate('/login');
    }
  };

  // Show nothing while checking auth state to prevent flash
  if (authLoading) {
    return null;
  }

  // Redirect logged-in users away from login/register pages
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="banana-bg">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="border-0 shadow-lg">
            <Card.Header className="bg-yellow text-white">
              <h3 className="text-center mb-0">
                {isLogin ? 'Login' : 'Register'}
              </h3>
            </Card.Header>
            <Card.Body className="bg-yellow-light rounded-bottom">
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

                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Confirm Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="Confirm password"
                        className="custom-input"
                      />
                      <Button
                        variant="yellow"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={0}
                      >
                         <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                      </Button>
                    </InputGroup>
                    {confirmPassword && password !== confirmPassword && (
                      <Form.Text className="text-danger">
                        Passwords do not match
                      </Form.Text>
                    )}
                    {confirmPassword && password === confirmPassword && password.length >= 6 && (
                      <Form.Text className="text-success">
                        ✓ Passwords match
                      </Form.Text>
                    )}
                  </Form.Group>
                )}

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
                    {isLogin ? 'Login' : 'Register'}
                  </Button>

                  <p className='text-center mb-0 text-white'>
                    { isLogin ? (
                      <>
                      Don't have an account? {' '}
                      <Button
                        type="button"
                        variant="link-white-underline"
                        onClick={toggleMode}
                        disabled={loading}
                        className="p-0 align-baseline"
                      >
                        Register Here
                      </Button>
                      </>
                    ): (
                      <>
                      Have an account? {' '}
                      <Button
                        type="button"
                        variant="link-white-underline"
                        onClick={toggleMode}
                        disabled={loading}
                        className="p-0 align-baseline"

                      >
                        Log in Here
                      </Button>
                      </>
                    )}
                  </p>

                  {/* <Button
                    type="button"
                    variant="link-white-underline"
                    onClick={toggleMode}
                    disabled={loading}
                  >
                    {isLogin ? "Don't have an account? Register Here" : 'Have an account? Log in Here'}
                  </Button> */}
                </div>

                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
