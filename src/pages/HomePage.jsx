import { useEffect, useState } from "react";
import { useFireBase } from "../context/FireBase";
import BookCard from "../components/BookCard";
import Alert from 'react-bootstrap/Alert';
import { useAlert } from "../context/AlertContext";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function HomePage() {
    const { listAllBooks } = useFireBase();
    const [books, setBooks] = useState([]);
    const { alert, hideAlert } = useAlert();

    useEffect(() => {
        listAllBooks()
            .then((books) => {
                // Log the total number of books fetched
                console.log("Total Books Fetched:", books.docs.length);
                setBooks(books.docs);
            })
            .catch(error => {
                console.error("Failed to fetch books:", error);
            });
    }, [listAllBooks]);

    // Determine the number of columns based on the number of books
    const numColumns = Math.min(books.length, 4); // You can adjust this limit if needed

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
            <Row xs={1} sm={2} md={2} lg={numColumns} className="g-4">
                {books.map((book) => (
                    <Col key={book.id}>
                        <BookCard
                            id={book.id}
                            {...book.data()}
                            link={`/book/view/${book.id}`}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
}
