import React from "react";
import {useState, useEffect} from "react";
import { Button, Modal, message} from 'antd';
import {Spinner, Card, Carousel} from 'react-bootstrap';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import './HulkShop.css'

export default function HulkShop() {

    const [products, setProducts] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [product, setProduct] = useState({
        productId: '',
        quantity: 0
    });

    const history = useHistory();

    async function fetchProducts() {
        setLoading(true);
        const response = await axios.get(process.env.REACT_APP_DB_URL + '/products');
        //sort response by createdAt
        const sortedProducts = response.data.sort((a, b) => (a.createdAt > b.createdAt) ? -1 : 1);
        const latestProducts = sortedProducts.slice(0, 4);
        setProducts(sortedProducts);
        setLatestProducts(latestProducts);
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
        
        if(product.stock < product.quantity){
            message.error('No hay suficiente stock');
            return;
        }
        if(product.quantity <= 0){
            message.error('La cantidad debe ser mayor a 0');
            return;
        }
        
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
            history.push('/cart');
        } catch (error) {
            message.error(`Error al añadir producto al carrito`);
            console.log(error);
        }
    }

    return (
    <>    
        <div className="container my-5">
            <div className="row">
                <div className="col-12">
                    <h1 className="fw-bold text-success">Hulk Store</h1>
                </div>
                <div className="col-12">
                    <h3 className="text-dark">Ultimos productos</h3>
                    <Carousel autoplay className="bg-dark rounded border mb-5">
                        {latestProducts.map(product => (
                            <Carousel.Item key={product._id}>
                                <img
                                    className="d-block m-auto hulkCarouselImg"
                                    src={product.img}
                                    alt="First slide"
                                />
                                <Carousel.Caption className="bg-light rounded border">
                                    <h3 className="text-success">{product.name}</h3>
                                    <p className="text-dark">{product.description}</p>
                                    {product.stock > 0 ? (
                                        <Button className="btn-success" onClick={() => handleOpenBuyModal(product)}>Comprar</Button>
                                    ) : (
                                        <Button className="btn-success" disabled>Comprar</Button>
                                    )}
                                </Carousel.Caption>
                            </Carousel.Item>

                        ))}
                    </Carousel>
                </div>
                <div className="col-12">
                    <h3>Todos nuestros productos</h3>
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
                                        style={{ width: '18rem', height: '27rem' }}
                                        className="text-center hulkCard"
                                        text="dark"
                                        bg="light"
                                        border='success'
                                    >
                                        <Card.Img variant="top" src={product.img} style={{ objectFit: 'scale-down', width: '18rem', height: '10rem', padding:'10px' }} />
                                        <Card.Body className="hide">
                                            <Card.Title className="bg-success rounded p-1 text-light">{product.name}</Card.Title>
                                            <Card.Text>
                                                {product.description}
                                            </Card.Text>
                                            <Card.Text>
                                                Precio: ${product.price}
                                            </Card.Text>
                                            <Card.Text>
                                                Stock: {product.stock}
                                            </Card.Text>
                                            {product.stock > 0 ?
                                            <>
                                                <Card.Text className="text-success fw-bold">
                                                    Producto disponible
                                                </Card.Text>
                                                <Button
                                                    type="ghost" 
                                                    onClick={() => handleOpenBuyModal(product)}
                                                >Comprar</Button>
                                            </>
                                            :
                                            <>
                                                <Card.Text className="text-danger fw-bold">
                                                    Producto agotado
                                                </Card.Text>
                                                <Button
                                                    type="ghost"
                                                    disabled
                                                >Comprar</Button>
                                            </>}
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