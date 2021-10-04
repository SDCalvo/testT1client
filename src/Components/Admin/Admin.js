import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Modal } from 'antd';
import { Table, Spinner } from 'react-bootstrap';

export default function Admin() {

    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editInput, setEditInput] = useState({});
    const [addInput, setAddInput] = useState({});	

    useEffect(() => {
        fetchProducts();
        fetchSales();
    }, []);
    
    async function fetchProducts() {
        try{
            setLoading(true);
            const response = await axios.get(process.env.REACT_APP_DB_URL + '/products');
            setProducts(response.data);
            setLoading(false);
        } catch(error) {
            console.log(error);
            message.error('Error cargando productos, intente de nuevo');
        }
    }

    async function fetchSales() {
        try{
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user.token;
            const headers = {
                'Content-Type': 'application/json',
                'x-access-token': token
            };
            const response = await axios.get(process.env.REACT_APP_DB_URL + '/sales', { headers });
            const sales = response.data.data;
            const sortedSales = sales.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setSales(sortedSales);
            setLoading(false);
        } catch(error) {
            console.log(error);
            message.error('Error cargando ventas, intente de nuevo');
        }
    }

    function handleOpnEditModal(id){
        setEditModalOpen(true);
        const product = products.find(product => product._id === id);
        setEditInput(product);
    }

    async function editProduct() {
        try{
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user.token;
            const header = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            };
            const response = await axios.patch(process.env.REACT_APP_DB_URL + '/products/' + editInput._id, editInput, header);
            setLoading(false);
            message.success('Producto editado con éxito');
            setEditModalOpen(false);
            fetchProducts();
        } catch(error) {
            console.log(error);
            message.error('Error editando producto, intente de nuevo');
        }
    }

    async function deleteProduct(id) {
        try{
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user.token;
            const header = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            };
            const response = await axios.delete(process.env.REACT_APP_DB_URL + '/products/' + id, header);
            setLoading(false);
            message.success('Producto eliminado con éxito');
            fetchProducts();
        } catch(error) {
            console.log(error);
            message.error('Error eliminando producto, intente de nuevo');
        }
    }
    
    async function addProduct() {
        try{
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user.token;
            const header = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            };
            const response = await axios.post(process.env.REACT_APP_DB_URL + '/products', addInput, header);
            setLoading(false);
            message.success('Producto agregado con éxito');
            setAddModalOpen(false);
            fetchProducts();
        } catch(error) {
            console.log(error);
            message.error('Error agregando producto, intente de nuevo');
        }
    }
    
    return (
    <>
        <div className="container my-5">
            <div className="row">
                <div className="col-12 my-5">
                    <h1 className="fw-bold textShadow text-success">Administración de productos</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Table responsive striped bordered hover className="bg-light">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Descripción</th>
                                <th>Stock</th>
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
                                    products.map((product, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="align-middle">
                                                    <img src={product.img} alt={product.name} width="100" />
                                                </td>
                                                <td className="align-middle">{product.name}</td>
                                                <td className="align-middle">${product.price}</td>
                                                <td className="align-middle">{product.description}</td>
                                                <td className="align-middle">{product.stock}</td>
                                                <td className="align-middle">
                                                    <button 
                                                        className="btn btn-primary mx-2" 
                                                        onClick={() => handleOpnEditModal(product._id)}
                                                    >Editar</button>
                                                    <button 
                                                        className="btn btn-danger"
                                                        onClick={() => deleteProduct(product._id)}
                                                    >Borrar</button>                                                    
                                                </td>
                                            </tr>
                                        )
                                    })
                            }
                        </tbody>
                    </Table>
                </div>
                <div className="col-12">
                    <button
                        className="btn btn-primary"
                        onClick={() => setAddModalOpen(true)}
                    >Agregar producto</button>
                </div>
                <div className="col-12 my-5">
                    <h2 className="fw-bold textShadow text-success">Ventas</h2>
                    <Table responsive striped bordered hover className="bg-light">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Fecha</th>
                                <th>Método de pago</th>
                                <th>Observaciones</th>
                                <th>Productos</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ?
                                    <tr>
                                        <td colSpan="4">
                                            <Spinner animation="border" variant="primary" />
                                        </td>
                                    </tr>
                                :
                                    sales.map((sale, index) => {
                                        const date = new Date(sale.createdAt);
                                        const formatedDate = date.toLocaleDateString();
                                        return (
                                            <tr key={index}>
                                                <td className="align-middle">{index + 1}</td>
                                                <td className="align-middle">{formatedDate}</td>
                                                <td className="align-middle">{sale.paymentMethod}</td>
                                                <td className="align-middle">{sale.observation}</td>
                                                <td className="align-middle">
                                                    {
                                                        sale.detail.map((detail, index) => {
                                                            console.log("detail: ", detail);
                                                            return (
                                                                <div key={index} className='bg-primary rounded my-1 text-light'>
                                                                    <p className="m-0">Nombre: {detail.product.name}</p>
                                                                    <p className="m-0">${detail.product.price}</p>
                                                                    <p className="m-0">Cantidad: {detail.quantity}</p>    
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </td>
                                                <td className="align-middle">${sale.total}</td>
                                            </tr>
                                        )
                                    })
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
        <Modal
            title="Editar producto"
            visible={editModalOpen}
            onOk={() => setEditModalOpen(false)}
            onCancel={() => setEditModalOpen(false)}
            footer={null}
        >
            <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input type="text" className="form-control" id="name" placeholder="Nombre" value={editInput.name} onChange={(e) => setEditInput({...editInput, name: e.target.value})} />
            </div>
            <div className="form-group">
                <label htmlFor="price">Precio</label>
                <input type="number" className="form-control" id="price" placeholder="Precio" value={editInput.price} onChange={(e) => setEditInput({...editInput, price: e.target.value})} />
            </div>
            <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <input type="text" className="form-control" id="description" placeholder="Descripción" value={editInput.description} onChange={(e) => setEditInput({...editInput, description: e.target.value})} />
            </div>
            <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input type="number" className="form-control" id="stock" placeholder="Stock" value={editInput.stock} onChange={(e) => setEditInput({...editInput, stock: e.target.value})} />
            </div>
            <div className="form-group">
                <label htmlFor="image">Imagen</label>
                <input type="text" className="form-control" id="image" placeholder="URL de la Imagen" value={editInput.img} onChange={(e) => setEditInput({...editInput, img: e.target.value})} />
            </div>
            <button className="btn btn-primary my-2" onClick={editProduct}>Editar</button>
        </Modal>
        <Modal
            title="Agregar producto"
            visible={addModalOpen}
            onOk={() => setAddModalOpen(false)}
            onCancel={() => setAddModalOpen(false)}
            footer={null}
        >
            <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input type="text" className="form-control" id="name" placeholder="Nombre" value={addInput.name} onChange={(e) => setAddInput({...addInput, name: e.target.value})} />
            </div>
            <div className="form-group">
                <label htmlFor="price">Precio</label>
                <input type="number" className="form-control" id="price" placeholder="Precio" value={addInput.price} onChange={(e) => setAddInput({...addInput, price: e.target.value})} />
            </div>
            <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <input type="text" className="form-control" id="description" placeholder="Descripción" value={addInput.description} onChange={(e) => setAddInput({...addInput, description: e.target.value})} />
            </div>
            <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input type="number" className="form-control" id="stock" placeholder="Stock" value={addInput.stock} onChange={(e) => setAddInput({...addInput, stock: e.target.value})} />
            </div>
            <div className="form-group">
                <label htmlFor="image">Imagen</label>
                <input type="text" className="form-control" id="image" placeholder="URL de la Imagen" value={addInput.img} onChange={(e) => setAddInput({...addInput, img: e.target.value})} />
            </div>
            <button className="btn btn-primary my-2" onClick={addProduct}>Agregar</button>
        </Modal>
    </>
    )
}
