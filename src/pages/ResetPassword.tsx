
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';


const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetPassword } = useAuth();
    const [ email, setEmail ] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(email);

            setMessage("Password reset email sent! Check your inbox")
        } catch (err: any) {
            if (err.code === 'auth/user-not-found') {
                setError('No account found with that email address.');
            } else {
                console.error("Password Reset Error:", err);
                setError('Failed to send reset email. Please try again.');
            }
        }

        setLoading(false);
    }


    return (
        <div className='banana-bg'>
            <Row className="justify-content-center">
                <Col md={6}>
                <Card className='shadow-lg border-0'>
                    <Card.Header className='bg-yellow text-white'>
                        <h3 className="text-center mb-0">Reset Password</h3>
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
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter email"
                                    className='custom-input'
                                    ></Form.Control>
                            </Form.Group>

                            <Button
                                type="submit"
                                variant="blue"
                                disabled={loading}
                                className="w-100"
                                size="lg"
                            >
                                {loading && (
                                    <span className='spinner-border spinner-border-sm me-2' />
                                )}
                                Send Password Reset Email
                            </Button>

                            <p className="text-center mt-3 text-white">
                                <Button
                                    variant='link-white-underline'
                                    className='p-0'
                                    onClick={()=> navigate("/login")}
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
}

export default ResetPassword;