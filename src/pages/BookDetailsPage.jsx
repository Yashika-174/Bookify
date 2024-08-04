import { useParams, useNavigate } from 'react-router-dom';
import { useFireBase } from '../context/FireBase';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useAlert } from '../context/AlertContext';

export default function BookDetailsPage() {
    const { getBookByID, getImageURL, placeOrder, deleteBook, user } = useFireBase();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const params = useParams();
    const [data, setData] = useState(null);
    const [url, setURL] = useState(null);
    const [qty, setQty] = useState(1);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        getBookByID(params.bookId)
            .then((value) => {
                setData(value.data());
            })
            .catch((err) => {
                console.error("Failed to fetch book details:", err);
                setAlert({ variant: 'danger', message: 'Failed to fetch book details.' });
            });
    }, [params.bookId, getBookByID]);

    useEffect(() => {
        if (data) {
            const imageURL = data.imageURL;
            getImageURL(imageURL).then((url) => {
                setURL(url);
            }).catch((err) => {
                console.log(err);
                setAlert({ variant: 'danger', message: 'Failed to fetch image URL.' });
            });
        }
    }, [data, getImageURL]);

    async function handlePlaceOrder() {
        if (!user) {
            showAlert('You need to be logged in to place an order.', 'warning');
            setTimeout(() => navigate('/login'), 500); // Redirect to login page
            return;
        }

        try {
            await placeOrder(params.bookId, qty);
            showAlert('Order placed successfully!', 'success');
            setTimeout(() => navigate('/'), 500);
        } catch (error) {
            showAlert('Failed to place the order. Please try again.', 'danger');
        }
    }

    async function handleDeleteListing() {
        try {
            await deleteBook(params.bookId);
            showAlert('Listing deleted successfully!', 'success');
            setTimeout(() => navigate('/'), 500);
        } catch (error) {
            console.error("Error deleting listing:", error);
            setAlert({ variant: 'danger', message: 'Failed to delete listing.' });
        }
    }

    const isOwner = user && data && data.userID === user.uid;

    return (
        <div style={{ display: "flex", justifyContent: "center", textAlign: "center", margin: "30px" }}>
            {alert && (
                <Alert variant={alert.variant} dismissible onClose={() => setAlert(null)}>
                    {alert.message}
                </Alert>
            )}
            {data ? (
                <div className="container mt-2 center">
                    <h2>{data.name}</h2><br />
                    <img src={url} style={{ border: "1px dotted black", width: "250px", height: "250px", borderRadius: "10px" }} />
                    <div className='mt-3 mb-5'>
                        <p><b>Price:</b> &#8377;{data.price}</p>
                        <h4>Owner Details</h4>
                        <img src={data.photoURL} style={{ borderRadius: "50px" }} /><br /><br />
                        <p><b>Name:</b> {data.displayName}</p>
                        <p><b>Email:</b> {data.userEmail}</p>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label><b>Quantity</b></Form.Label>
                                <center>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter Quantity"
                                        value={qty}
                                        onChange={(event) => setQty(event.target.value)}
                                        style={{ width: "100px" }}
                                        min={1}
                                    />
                                </center>
                            </Form.Group>
                        </Form>
                        <Button variant="success" onClick={handlePlaceOrder}>Buy Now</Button>
                        {isOwner && (
                            <Button variant="danger" onClick={handleDeleteListing} style={{ marginLeft: '10px' }}>
                                Delete Listing
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <h3>Loading...</h3>
            )}
        </div>
    );
}
