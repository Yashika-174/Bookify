import { useParams } from 'react-router-dom';
import { useFireBase } from '../context/FireBase';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function ViewOrderDetailPage() {
    const params = useParams();
    const { getOrders, updateOrderStatus } = useFireBase();
    const [orders, setOrders] = useState([]);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        getOrders(params.bookId)
            .then((orders) => {
                setOrders(orders.docs);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
                setAlert({ variant: 'danger', message: 'Failed to fetch orders.' });
            });
    }, [params.bookId, getOrders]);

    const handleStatusChange = async (orderId, status) => {
        try {
            await updateOrderStatus(params.bookId, orderId, status);
            setAlert({ variant: 'success', message: `Order ${status} successfully!` });

            // Re-fetch the orders to update the list
            const updatedOrders = await getOrders(params.bookId);
            setOrders(updatedOrders.docs);
        } catch (error) {
            console.error("Error updating order status:", error);
            setAlert({ variant: 'danger', message: `Failed to ${status} order.` });
        }
    };

    if (!orders || orders.length === 0) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h1>No Orders</h1>
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

            <Row xs={1} sm={2} md={2} lg={2} className="g-4">
                {orders.map((order) => {
                    const data = order.data();
                    return (
                        <Col key={order.id}>
                            <div className='p-3' style={{ background: "pink", boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px" }}>
                                <b>Ordered By: </b>{data.displayName} &nbsp;&nbsp; <b>[{data.status}]</b>
                                <br />
                                <b>Quantity: </b>{data.qty}<br />
                                <b>Email Id: </b>{data.userEmail}<br />
                                <Button variant="success" onClick={() => handleStatusChange(order.id, 'Accepted')} style={{ margin: "10px" }}>Accept</Button>
                                <Button variant="danger" onClick={() => handleStatusChange(order.id, 'Rejected')} style={{ margin: "10px" }}>Reject</Button>
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
}
