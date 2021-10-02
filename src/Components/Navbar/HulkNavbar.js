import React from "react";
import { Navbar, Nav, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios";

export default function HulkNavbar() {
  const [admin, setAdmin] = useState(
      JSON.parse(localStorage.getItem("user")) || null
  );
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setAdmin(JSON.parse(localStorage.getItem("user")) || null);
    if (admin) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [admin]);


  function handleChange(e){

    setLoginInput({
      ...loginInput,
      [e.target.name]: e.target.value
    })
  }

  //create base URL with axios
  const baseURL = process.env.REACT_APP_DB_URL;

  async function handleLoginSubmit(e){
    e.preventDefault();
    if(loginInput.email === "" || loginInput.password === ""){
      message.error("Por favor llene todos los campos");
    }else{
      try{
        const response = await axios.post(`${baseURL}/user/login`, {
          email: loginInput.email,
          password: loginInput.password
        });
        console.log(response)
        if(response.status === 200){
          setAdmin(response.data.role === "admin" ? true : false);
          const user = {
            id: response.data.id,
            email: response.data.email,
            role: response.data.role,
            token: response.data.token
          }
          localStorage.setItem("user", JSON.stringify(user));
          setIsLogged(true);
          setLoginModalOpen(false);
          message.success("Bienvenido");
        }
      }catch(error){
        message.error("Usuario o contraseña incorrectos");
        console.log("error: ", error);
      }
    }
  }

  function handleLogout(e){
    e.preventDefault();
    localStorage.removeItem("user");
    setAdmin(false);
    setIsLogged(false);
    message.success("Sesión cerrada");
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <Navbar bg="dark" variant="dark" className="d-flex justify-content-between">
            <Navbar.Brand href="#home">
              <img
                  alt="Hulk logo"
                  src='https://www.logolynx.com/images/logolynx/79/798eb16216073012f2690e0423445ac0.jpeg'
                  width="40"
                  height="40"
                  className="d-inline-block align-top border rounded"
              />
            </Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="/">Inicio</Nav.Link>
              <Nav.Link href="/cart">Carrito</Nav.Link>
              {admin && <Nav.Link href="/admin">Admin</Nav.Link>}
              {!isLogged && <Nav.Link onClick={() => setLoginModalOpen(true)} >Login</Nav.Link>}
              {isLogged && <Nav.Link onClick={(e) => handleLogout(e)}>Logout</Nav.Link>}
            </Nav>
          </Navbar>
        </div>
      </div>
      <Modal show={loginModalOpen}>
        <Modal.Header>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email</label>
              <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Ingrese su email"
                  name="email"
                  onChange={(e) => handleChange(e)}
                  value={loginInput.email}
              />
              <small id="emailHelp" className="form-text text-muted">
                Nunca compartiremos su email con nadie más.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  onChange={(e) => handleChange(e)}
                  value={loginInput.password}
              />
            </div>
            <button type="submit" className="btn btn-primary my-2" onClick={(e) => handleLoginSubmit(e)}>
              Submit
            </button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setLoginModalOpen(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
