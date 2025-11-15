/**
 * Forgot Password Page
 * ---------------------
 * Allows the user to request a password reset email.
 * User enters their email, and Firebase sends a reset link.
 * Implements a 30-second cooldown to prevent spamming.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useCooldown } from '../../hooks/useCooldown';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Use the object-style cooldown hook
  const { cooldown, startCooldown } = useCooldown(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submitting if cooldown is active
    if (cooldown > 0) return;

    try {
      setMessage('');
      setError('');
      setLoading(true);

      await resetPassword(email);

      setMessage(
        "If an account with that email exists, a password reset email has been sent."
      );

      startCooldown();
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='banana-bg'>
      <Row className='justify-content-center'>
        <Col md={6}>
          <Card className='shadow-lg border-0'>
            <Card.Header className='bg-yellow text-white'>
              <h3 className='text-center mb-0'>Reset Password</h3>
            </Card.Header>
            <Card.Body className='bg-yellow-light rounded-bottom'>
              {message && (
                <Alert variant='success' className='mt-3'>
                  {message}
                </Alert>
              )}

              {error && (
                <Alert variant='danger' className='mt-3'>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                  <Form.Label className='text-white'>Email</Form.Label>
                  <Form.Control
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder='Enter email'
                    className='custom-input'
                  />
                </Form.Group>

                <Button
                  type='submit'
                  variant='blue'
                  disabled={loading || cooldown > 0}
                  className='w-100'
                  size='lg'
                >
                  {loading && <span className='spinner-border spinner-border-sm me-2' />}
                  {cooldown > 0 ? `Please wait ${cooldown}s` : 'Send Password Reset Email'}
                </Button>

                <p className='text-center mt-3 text-white'>
                  <Button
                    variant='link-white-underline'
                    className='p-0'
                    onClick={() => navigate('/login')}
                  >
                    Back to Login
                  </Button>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;