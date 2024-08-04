import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFireBase } from '../context/FireBase';
import { useAlert } from '../context/AlertContext';
import Alert from 'react-bootstrap/Alert';
import { useAlert } from '../context/AlertContext';

export default function LoginPage() {
    const { signInUserWithEmailAndPassword, signInWithGoogle } = useFireBase();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { alert, hideAlert } = useAlert();



    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await signInUserWithEmailAndPassword(email, password);
            setEmail('');
            setPassword('');
            showAlert('Logged In successfully!', 'success');
            setTimeout(() => {
                navigate('/');
            }, 500); // Delay to ensure alert is shown
        } catch (error) {
            showAlert('Failed to Log In. Please try again.', 'danger');
        }
    }

    async function handleGoogleSignIn() {
        try {
            await signInWithGoogle();
            showAlert('Logged In with Google successfully!', 'success');
            setTimeout(() => {
                navigate('/');
            }, 500); // Delay to ensure alert is shown
        } catch (error) {
            showAlert('Failed to Log In with Google. Please try again.', 'danger');
        }
    }

    return (
        <div className="container mt-5">
            {alert.show && (
                <Alert
                    variant={alert.variant}
                    dismissible
                    onClose={hideAlert}
                >
                    {alert.message}
                </Alert>
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
                <h3 className="mt-3 mb-3">OR</h3>
                <Button variant="danger" onClick={handleGoogleSignIn}>
                    Sign In With Google
                </Button>
            </Form>
        </div>
    );
}
