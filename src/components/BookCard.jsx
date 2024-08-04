import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useFireBase } from '../context/FireBase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function BookCard({ name, displayName, price, imageURL, id, link }) {
    const { getImageURL } = useFireBase();
    const [url, setURL] = useState(null);
    const navigate = useNavigate();


    console.log(id);
    useEffect(() => {
        getImageURL(imageURL).then((url) => {
            setURL(url);
        }).catch((err) => {
            console.log(err);
        })
    }, [])


    const CardStyling = { boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px", height: "39rem", marginTop: "5rem", marginLeft: "1.2rem", marginBottom: "5rem", marginRight: "1.2rem", borderRadius: "10px" }

    const ImageStyling = {
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px'
    }

    { console.log(url) }

    return (<Card style={CardStyling}>
        <Card.Img variant="top" src={url} style={ImageStyling} />
        <Card.Body>
            <Card.Title>{name}</Card.Title><br />
            <Card.Text>
                <b>Sold By: </b>{displayName}<br />
                <b>Price: </b>{price}
            </Card.Text>
            <center><Button variant="primary" onClick={() => (navigate(link))}>View</Button></center>
        </Card.Body>
    </Card>)
}