import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { message, Modal, Form, Button, Input } from "antd";
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
  const [registerInput, setRegisterInput] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    lastName: "",
  });
  const [registerModalOpen, setRegisterModalOpen] = useState(false);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || null;
    const isAdmin = user?.role === "admin";
    setAdmin(isAdmin);
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

  function handleChangeRegister(e){

    setRegisterInput({
      ...registerInput,
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

  async function handleRegisterSubmit(e){
    e.preventDefault();
    if(registerInput.email === "" || registerInput.password === "" || registerInput.name === "" || registerInput.lastName === ""){
      message.error("Por favor llene todos los campos");
    }else if(registerInput.password !== registerInput.passwordConfirm){
      message.error("Las contraseñas no coinciden");
    }else if (registerInput.email.indexOf("@") === -1){
      message.error("El email no es válido");
    }else{
      try{
        const response = await axios.post(`${baseURL}/user`, {
          email: registerInput.email,
          password: registerInput.password,
          name: registerInput.name,
          lastName: registerInput.lastName
        });
        console.log(response)
        const config = {
            top: 100,
            duration: 2,
            maxCount: 1,
            content: "Usuario creado con éxito"
        };
          setRegisterModalOpen(false);
          message.success(config);
      }catch(error){
        setRegisterModalOpen(false);
        const config = {
            top: 100,
            duration: 2,
            maxCount: 1,
            content: error.response.data.message
        };
        message.error(config);
      }
    }
  }


  return (
    <>
      <div className="container-fluid px-4" style={{backgroundColor: "#212529"}}>
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
              <Nav.Link href="/" className="text-white" style={{ fontSize: "1rem" }}>Inicio</Nav.Link>
              <Nav.Link href="/cart" className="text-white" style={{ fontSize: "1rem" }}>Carrito</Nav.Link>
              {admin && <Nav.Link href="/admin" className="text-white" style={{ fontSize: "1rem" }}>Admin</Nav.Link>}
              {!isLogged && <Nav.Link onClick={() => setLoginModalOpen(true)}  className="text-white" style={{ fontSize: "1rem" }}>Login</Nav.Link>}
              {!isLogged && <Nav.Link onClick={() => setRegisterModalOpen(true)} className="text-white" style={{ fontSize: "1rem" }}>Registrarse</Nav.Link>}
              {isLogged && <Nav.Link onClick={(e) => handleLogout(e)} className="text-white" style={{ fontSize: "1rem" }}>Logout</Nav.Link>}
            </Nav>
          </Navbar>
        </div>
      </div>
      
      <Modal
        title="Login"
        visible={loginModalOpen}
        onOk={() => setLoginModalOpen(false)}
        onCancel={() => setLoginModalOpen(false)}
        footer={null}
      >
        <Form>
          <Form.Item label="Email">
            <Input name="email" value={loginInput.email} onChange={(e) => handleChange(e)} />
          </Form.Item>
          <Form.Item label="Contraseña">
            <Input.Password name="password" value={loginInput.password} onChange={(e) => handleChange(e)} />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              onClick={(e) => handleLoginSubmit(e)} 
            >
              Ingresar
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Registrarse"
        visible={registerModalOpen}
        onOk={() => setRegisterModalOpen(false)}
        onCancel={() => setRegisterModalOpen(false)}
        footer={null}
      >
        <Form>
          <Form.Item label="Email">
            <Input name="email" value={registerInput.email} onChange={(e) => handleChangeRegister(e)} />
          </Form.Item>
          <Form.Item label="Contraseña">
            <Input.Password name="password" value={registerInput.password} onChange={(e) => handleChangeRegister(e)} />
          </Form.Item>
          <Form.Item label="Confirmar contraseña">
            <Input.Password name="passwordConfirm" value={registerInput.passwordConfirm} onChange={(e) => handleChangeRegister(e)} />
          </Form.Item>
          <Form.Item label="Nombre">
            <Input name="name" value={registerInput.name} onChange={(e) => handleChangeRegister(e)} />
          </Form.Item>
          <Form.Item label="Apellido">
            <Input name="lastName" value={registerInput.lastName} onChange={(e) => handleChangeRegister(e)} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={(e) => handleRegisterSubmit(e)}
            >
              Registrarse
            </Button>
          </Form.Item>
        </Form>
      </Modal>      
    </>
  );
}
