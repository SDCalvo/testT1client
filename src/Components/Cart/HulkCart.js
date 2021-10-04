import React from 'react';
import {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Spinner, Form } from 'react-bootstrap';
import { message, Button } from 'antd';
import axios from 'axios';


export default function HulkCart() {

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [buyInput, setBuyInput] = useState({
        paymentMethod: 'Efectivo',
        address: '',
        observation: '',
    });

    const history = useHistory();

    async function getCart() {
        try{
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user.token;
            const headers = {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
            const response = await axios.get(process.env.REACT_APP_DB_URL + '/cart', {headers});
            //calculate total for each product
            console.log("response.data: ", response.data);
            for(let i = 0; i < response.data.cartDetail.length; i++){
                response.data.cartDetail[i].total = response.data.cartDetail[i].product.price * response.data.cartDetail[i].quantity;
            }
            //Calculate total for all products
            let total = 0;
            for(let i = 0; i < response.data.cartDetail.length; i++){
                total += response.data.cartDetail[i].total;
            }
            setTotal(total);
            setCart(response.data.cartDetail);
            setLoading(false);
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCart();
    }, []);

    async function deleteProduct(id) {
        try{
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user.token;
            const headers = {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
            const response = await axios.delete(process.env.REACT_APP_DB_URL + '/cart/' + id, {headers});
            message.success('Producto eliminado del carrito');
            getCart();
        } catch(error) {
            console.log(error);
            message.error('Error al eliminar el producto');
        }
    }

    async function handleBuy() {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const headers = {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
        if(!buyInput.paymentMethod){
            message.error('Por favor seleccione un método de pago');
            return;
        }
        if(!buyInput.address){
            message.error('Por favor ingrese una dirección');
            return;
        }
        const data = {
            paymentMethod: buyInput.paymentMethod,
            address: buyInput.address,
            observation: buyInput.observation
        }
        try{
            await axios.post(process.env.REACT_APP_DB_URL + '/sales', data, {headers});
            message.success('Compra realizada con éxito');
            history.push('/');
        } catch(error) {
            console.log(error);
            message.error('Error al realizar la compra, inténtelo de nuevo');
        }
    }


    return(
        <div className="container my-5">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="fw-bold textShadow text-success">Carrito</h1>
                </div>
                {cart.length > 0 ? <>
                    <div className="col-md-12">
                    <Table striped bordered hover className="bg-light">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ?
                                <tr>
                                    <td colSpan="6">
                                        <Spinner animation="border" variant="primary" />
                                    </td>
                                </tr>
                                :
                                cart.map((item, index) => {
                                    return(
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.product.name}</td>
                                            <td>${item.product.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.total}</td>
                                            <td>
                                                <Button 
                                                    type="primary"
                                                    onClick={() => deleteProduct(item._id)}
                                                >Eliminar</Button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </Table>
                </div>
                <div className="col-md-12">
                    <h3 className="text-center">Total: ${total}</h3>
                </div>
                <div className="col-md-12">
                    <Button type="primary" onClick={() => history.push('/')}>Seguir comprando</Button>
                </div>
                <div className="col-md-12 border my-5 bg-light rounded p-4">
                    <h4 className="text-center">Confirmar compra</h4>
                    <Form>
                        <Form.Group className="text-dark rounded p-2 my-2" controlId="formPaymentMethod">
                            <Form.Label className="mb-3 fw-bold">Forma de pago</Form.Label>
                            <Form.Control 
                                as="select"
                                onChange={(e) => setBuyInput({...buyInput, paymentMethod: e.target.value})}
                            >
                                <option>Efectivo</option>
                                <option>Tarjeta de crédito</option>
                                <option>Tarjeta de débito</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="text-dark rounded p-2 my-2" controlId="formAddress">
                            <Form.Label className="mb-3 fw-bold">Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Dirección"
                                onChange={(e) => setBuyInput({...buyInput, address: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="text-dark rounded p-2 my-2" controlId="observation">
                            <Form.Label className="mb-3 fw-bold">Observación</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder="Observación"
                                onChange={(e) => setBuyInput({...buyInput, observation: e.target.value})}
                            />
                        </Form.Group>
                        <Button 
                            type="primary" 
                            className="mt-3"
                            onClick={handleBuy}
                        >
                            Comprar
                        </Button>
                    </Form>                   
                </div> </>
                :
                <div 
                    className="col-md-12"
                    style={{
                        height: '69vh'
                    }}
                >
                    <h3 className="text-center p-5 border rounded bg-light">No hay productos en el carrito</h3>
                </div>    
            }
            </div>
        </div>
    );
}
