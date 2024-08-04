import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFireBase } from "../context/FireBase";
import { useNavigate } from 'react-router-dom';
import { useAlert } from "../context/AlertContext";

export default function ListingPage() {
    const [name, setName] = useState("");
    const [isbnNumber, setIsbnNumber] = useState("");
    const [price, setPrice] = useState("");
    const [coverPic, setCoverPic] = useState(null);
    const { handleCreateNewListing } = useFireBase();
    const { showAlert } = useAlert(); // Hook for showing alerts
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await handleCreateNewListing(name, isbnNumber, price, coverPic);
            showAlert('Listing created successfully!', 'success');
            // Delay redirection to ensure alert is displayed
            setTimeout(() => navigate('/'), 500);
        } catch (error) {
            console.error("Error creating listing:", error);
            showAlert('Failed to create listing. Please try again.', 'danger');
        }
    }

    return (
        <div className="container mt-5">
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enter Book Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Book Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>ISBN</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="ISBN Number"
                        value={isbnNumber}
                        onChange={(event) => setIsbnNumber(event.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPrice">
                    <Form.Label>Enter Price</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Price"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCoverPhoto">
                    <Form.Label>Cover Pic</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(event) => setCoverPic(event.target.files[0])}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create
                </Button>
            </Form>
        </div>
    );
}
