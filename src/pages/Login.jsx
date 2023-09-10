import React, { useContext, useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { loginUser } from '../services/UserService';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate=useNavigate()
const userContext=useContext(UserContext)
    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser({email,password}).then(data=>{
            console.log(data)
            userContext.doLogin(data);
            navigate("/home")
            toast.success("Logged In Successfully")
        },error=>{
            console.log(error)
        })
        // Add your login logic here
    };

    return (
        <Container className="mt-5">
            <Card className='shadow border-0'>
                <Container>

                    <h2 className='text-center my-3'>Login Here</h2>
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
                        <Container className='text-center'>
                            <Button className='my-3' variant="success" type="submit">
                                Login
                            </Button>
                            <Button className='my-3 mx-3' variant="primary" type="submit">
                                Forget Password
                            </Button>
                        </Container>
                    </Form>
                </Container>
            </Card >
        </Container>
    );
}

export default Login;
