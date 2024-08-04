import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFireBase } from "../context/FireBase";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';


export default function RegisterPage() {
    const { signUpUserWithEmailAndPassword, isLoggedIn } = useFireBase();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { showAlert } = useAlert();


    useEffect(() => {
        if (isLoggedIn) {
            try {
                showAlert('Registered successfully!', 'success');
                setTimeout(() => {
                    navigate('/');
                }, 500); // Delay to ensure alert is shown
            } catch (error) {
                showAlert('Failed to Register. Please try again.', 'danger');
            }
        }
    }, [])


    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await signUpUserWithEmailAndPassword(email, password);
            setEmail("");
            setPassword("");
            showAlert('Registered successfully!', 'success');
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (error) {
            showAlert('Failed to Register. Please try again.', 'danger');
        }
    }

    return (
        <div className="container mt-5">
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create Account
                </Button>
            </Form>
        </div>
    );
}
