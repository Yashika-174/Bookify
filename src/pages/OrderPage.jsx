import { useEffect, useState } from "react";
import { useFireBase } from "../context/FireBase";
import BookCard from "../components/BookCard";
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function Order() {
    const { fetchMyBooks, user, isLoggedIn } = useFireBase();
    const [books, setBooks] = useState([]);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            fetchMyBooks(user.uid)
                .then((books) => {
                    setBooks(books.docs);
                })
                .catch((error) => {
                    console.error("Failed to fetch books:", error);
                    setAlert({ variant: 'danger', message: 'Failed to fetch books.' });
                });
        }
    }, [isLoggedIn, fetchMyBooks, user]);

    if (!isLoggedIn) {
        return (
            <div className="container mt-5">
                <h1>Please Login</h1>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            {alert && (
                <Alert variant={alert.variant} dismissible onClose={() => setAlert(null)}>
                    {alert.message}
                </Alert>
            )}
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {books.map((book) => (
                    <Col key={book.id}>
                        <BookCard
                            id={book.id}
                            {...book.data()}
                            link={`/book/orders/${book.id}`}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
}
