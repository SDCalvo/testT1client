import React from "react";
import {useState, useEffect} from "react";
import { Button, Space, Modal, message} from 'antd';
import {Spinner, Card} from 'react-bootstrap';
import axios from 'axios';

export default function HulkShop() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [product, setProduct] = useState({
        productId: '',
        quantity: 0
    });

    async function fetchProducts() {
        setLoading(true);
        const response = await axios.get(process.env.REACT_APP_DB_URL + '/products');
        setProducts(response.data);
        setLoading(false);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    function handleOpenBuyModal(product) {
        setProduct({...product, productId: product._id, quantity: 1});
        setShow(true);
    }

    async function handleBuy(){
        try{
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user.token;
            console.log(token)
            const headers = {
                'Content-Type': 'application/json',
                'x-access-token': token
            };
            const response = await axios.post(process.env.REACT_APP_DB_URL + '/cart', {
                productId: product.productId,
                quantity: product.quantity
            }, {headers});
            message.success(`Producto añadido al carrito`);
            setShow(false);
        } catch (error) {
            message.error(`Error al añadir al carrito`);
            console.log(error);
        }
    }

    return (
    <>    
        <div className="container my-5">
            <div className="row">
                <div className="col-12">
                    <h1>Hulk Store</h1>
                </div>
                <div className="col-12">
                    <div className='row justify-content-center align-items-center'>
                        {loading ? 
                            <Spinner 
                                animation="border" 
                                variant="primary"
                                style={{margin: 'auto'}}

                            /> :
                            products.map(product => (
                                <div className="col-md-4 my-3 d-flex justify-content-center align-items-center" key={product._id}>
                                    <Card
                                        style={{ width: '18rem' }}
                                        className="text-center"
                                        text="dark"
                                        bg="light"
                                        border='success'
                                    >
                                        <Card.Img variant="top" src={product.img} style={{ objectFit: 'scale-down', width: '18rem', height: '10rem', padding:'10px' }} />
                                        <Card.Body>
                                            <Card.Title>{product.name}</Card.Title>
                                            <Card.Text>
                                                {product.description}
                                            </Card.Text>
                                            <Card.Text>
                                                Precio: ${product.price}
                                            </Card.Text>
                                            <Button
                                                type="ghost" 
                                                onClick={() => handleOpenBuyModal(product)}
                                            >Comprar</Button>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
        <Modal
            title="Confirmar Compra"
            visible={show}
            onOk={() => setShow(false)}
            onCancel={() => setShow(false)}
            footer={[
                <Button key="back" onClick={() => setShow(false)}>
                    Cancelar
                </Button>,
                <Button key="submit" type="primary" onClick={() => handleBuy()}>
                    Confirmar
                </Button>,
            ]}
        >
            <div className="d-flex flex-column justify-content-center align-items-center text-center">
                <img className="my-2" src={product.img} alt={product.name} style={{height: '18rem'}}/>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Precio: ${product.price}</p>
                <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Cantidad" 
                    value={product.quantity}
                    onChange={(e) => {
                        setProduct({...product, quantity: parseFloat(e.target.value)})
                        console.log("product", product)
                    }}/>
            </div>
        </Modal>
    </>
    );
}