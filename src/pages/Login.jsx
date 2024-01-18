import React, { useContext, useEffect, useState } from "react";
import { Container, Form, Card, Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
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

  return !userContext.isLogin ? (
    <div className=" container-fluid "style={{backgroundColor: "#C4EDDD", minHeight: "100vh"}}>
      <div className="row " style={{minHeight: "100vh"}}>
        <div
          className="w-100 col d-flex flex-column align-items-center justify-content-center "
          style={{  }}
        >
          <Container className="text-center  mb-2 d-flex align-items-center justify-content-center">
            <img className="mx-0 m-0" src="../../logo.png" width={120} alt="" />
            <h1 className="my-5 mx-0 p-0 fw-bold" style={{color:"#5B6E80"}}>MittalSteelIndustries</h1>
          </Container>
          <img src="../../home.svg" className="imgWidth" style={{maxWidth:"650px"}} alt="" />
        </div>

        <div
          className="col d-flex justify-content-center align-items-center shadow rd bg-white"
          style={{ flexDirection: "column" }}
        >
          <div
            className=" w-40 mb-5 jsc"
            // style={{ border: "0px", borderRadius: "10px" }}
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
                  <Button
                    className="my-3"
                    style={{ backgroundColor: "#38A3A5" }}
                    variant="success"
                    type="submit"
                  >
                    Login
                  </Button>
                  <Button
                    className="my-3 mx-3"
                    variant="secondary"
                    type="submit"
                  >
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
          </div>
          <p>© 2024 MittalSteelIndustries | All Rights Reserved</p>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to={"/home"} />
  );
}

export default Login;
