import React, { useContext, useState } from "react";
import { Container, Form, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { loginUser } from "../services/UserService";
// import { Button } from '@mui/material';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    // loginUser({email,password}).then((data)=>{
    //     // console.log(data)
    //     userContext.doLogin(data);
    //     navigate("/home")
    //     toast.success("Logged In Successfully")
    // }).catch((error)=>{
    //         // console.log(error)
    //         if(error && error.response && error.response.data)
    //         toast.error(error.response.data.message)
    //     else
    //     toast.error("error while login")
    // })

    loginUser({ email, password })
      .then((data) => {
        userContext.doLogin(data);
        navigate("/home");
        toast.success("Logged In Successfully");
      })
      .catch((response) => {
        if (response && response.response && response.response.data)
          toast.error(response.response.data.message);
        else {
          toast.error("error occured");
        }
      });
    // Add your login logic here
  };

  return (
    !userContext.isLogin && (
      <Container className="mt-2 jsc" style={{flexDirection:"column"}}>
        <Container className="text-center mt-4 mb-2 d-flex align-items-center justify-content-center">
          <img src="../../download.png" height={60} alt="" />
          <h3 className="my-5 fw-bold">SHOPEASE</h3>
        </Container>
        <Card
          className="shadow  w-25 mb-5 jsc"
          style={{ border: "0px", borderRadius: "5px" }}
        >
          <Container>
            <Container className="text-center mt-4 mb-2">
              <img src="../../user.jpg" height={60} alt="" />
              <h4 className="my-3 fw-bold">Sign In</h4>
            </Container>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Container className="text-center">
                <Button className="my-3" variant="success" type="submit">
                  Login
                </Button>
                <Button className="my-3 mx-3" variant="secondary" type="submit">
                  Forget Password
                </Button>
                {/* <Button className='my-3' variant="contained" color='success' type="submit">
                                Login
                            </Button>
                            <Button className='my-3 mx-3' variant="contained" color='primary' type="submit">
                                Forget Password
                            </Button> */}
              </Container>
            </Form>
          </Container>
        </Card>
        <p>© 2023 Shopease | All Rights Reserved</p>
      </Container>
    )
  );
}

export default Login;
