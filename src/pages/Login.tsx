import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/items');
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

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
              <Form onSubmit={handleSubmit}>
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
                    {isLogin ? 'Login' : 'Register'}
                  </Button>

                  <Button
                    type="button"
                    variant="link-white-underline"
                    onClick={toggleMode}
                    disabled={loading}
                  >
                    {isLogin ? "Don't have an account? Register Here" : 'Log in Here'}
                  </Button>
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
