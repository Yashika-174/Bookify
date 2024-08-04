import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useFireBase } from "../context/FireBase";
import { useAlert } from "../context/AlertContext";
import { useNavigate } from 'react-router-dom';


export default function NavBar() {
    const { isLoggedIn, signOutUser, fireBaseAuth } = useFireBase();
    const { showAlert } = useAlert();
    const navigate = useNavigate();


    async function handleSignOut() {
        try {
            await signOutUser(fireBaseAuth);
            showAlert('Successfully logged out!', 'success');
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (error) {
            showAlert('Failed to log out. Please try again.', 'danger');
        }
    }

    return (
        <Navbar bg="dark" variant="dark" sticky="top" className='mb-4'>
            <Container>
                <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/book/list">Add Listing</Nav.Link>
                    <Nav.Link href="/book/orders">Orders</Nav.Link>
                </Nav>
                <Nav>
                    {isLoggedIn ? (
                        <Nav.Link onClick={handleSignOut} >Logout</Nav.Link>
                    ) : (
                        <>
                            <Nav.Link href="/register">Register</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}
