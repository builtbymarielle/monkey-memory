/**
* Reset Password Page
* --------------------
* User arrives here *from the reset email link*.
* Allows them to enter and confirm a new password.
* Updates the password directly via Firebase.
*/

import React, { useState, useEffect } from 'react';
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { useSearchParams, Link } from "react-router-dom";
import { Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { auth } from "../../firebase/config"

const ResetPassword = () => {
    const [params] = useSearchParams();
    const oobCode = params.get("oobCode") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [debouncedError, setDebouncedError] = useState("");

    const [userEmail, setUserEmail] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);

    // Getting User's email to display on page
    useEffect(() => {
        if(!oobCode){
            setError("Invalid reset link.")
            return;
        }

        verifyPasswordResetCode(auth, oobCode)
            .then(email => setUserEmail(email))
            .catch(()=> setError("Invalid or expired reset link."));
    }, [oobCode])

    // add a delay when confirming passwords
    useEffect(() => {
        setDebouncedError("");

        const timer = setTimeout(() => {
            if (confirmPassword && password !== confirmPassword){
                setDebouncedError("nomatch");
            } else if ( confirmPassword && password === confirmPassword && password.length >= 6){
                setDebouncedError("match");
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [confirmPassword, password])

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setResetSuccess(false);
        setLoading(true);


        if (password !== confirmPassword){
            setLoading(false);
            setError("Passwords do not match. Please try again.");
            return;
        }
        try{
            setLoading(true);
            await verifyPasswordResetCode(auth, oobCode);
            await confirmPasswordReset(auth, oobCode, password);
            setMessage("Password has been reset! You can now log in.")
            setResetSuccess(true);
        } catch(err: any){
            if (err.code === "auth/invalid-action-code"){
                setError("Reset link invalid or expired.")
            }
            else{
                setError("Failed to reset password. Please try again.");
            }
        }

        setLoading(false);
    };

    return(
        <div className='banana-bg'>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="border-0 shadow-lg">
                        <Card.Header className="bg-yellow text-white">
                            <h3 className='text-center mb-0'>
                                New Password
                            </h3>
                        </Card.Header>
                        <Card.Body className='bg-yellow-light rounded-bottom'>
                            {userEmail && (
                                <Alert variant="info">
                                    Resetting password for <b>{userEmail}</b>
                                </Alert>
                            )}

                            {resetSuccess && (
                                <Alert variant="success" className="mt-3">
                                    Password has been reset! You can now{" "}
                                    <Link to="/login" className="text-decoration-underline fw-bold">
                                    log in
                                    </Link>.
                                </Alert>
                            )}

                            {!resetSuccess && message && (
                                <Alert variant="success" className="mt-3">
                                    {message}
                                </Alert>
                            )}

                            {error && (
                                <Alert variant='danger' className='mt-3'>
                                    {error}
                                </Alert>
                            )}
                            <Form onSubmit={handleReset}>
                                <Form.Group className='mb-3'>
                                    <Form.Label className="text-white">Enter in new password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
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

                                <Form.Group className='mb-3'>
                                    <Form.Label className="text-white">Confirm new password</Form.Label>
                                    <InputGroup className='mb-2'>
                                        <Form.Control
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
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
                                   {debouncedError === "nomatch" && (
                                        <Form.Text className="text-danger">
                                            <i className="bi bi-x"></i> Passwords do not match
                                        </Form.Text>
                                    )}
                                    {debouncedError === "match" && (
                                        <Form.Text className="text-success">
                                            <i className="bi bi-check"></i> Passwords match
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <div className='d-grid gap-2'>
                                    <Button
                                        type="submit"
                                        variant="blue"
                                        disabled={loading}
                                        size="lg"
                                    >
                                        {loading && (
                                            <span className='spinner-border spinner-border-sm me-2' />
                                        )}
                                        Reset Password
                                    </Button>
                                </div>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </div>
    )

    
}

export default ResetPassword