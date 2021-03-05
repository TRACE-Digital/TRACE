import React, { useState } from "react";
import { Auth } from 'aws-amplify';


// reactstrap components
import { Card, CardImg, CardBody, CardTitle, Button, Form, FormGroup, Input } from 'reactstrap';

async function signUp(email, username, password) {
  try {
      const { user } = await Auth.signUp({
          username,
          password,
          attributes: {
              email,          // optional
              // other custom attributes
          }
      });
      console.log(user);
  } catch (error) {
      console.log('error signing up:', error);
  }
}

function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login">
      <Card style={{width: '20rem'}}>
          <CardImg top src="assets/img/trace-logo" alt="trace logo"/>
          <CardBody>
              <CardTitle>Welcome to TRACE</CardTitle>
              <Form id='sign-up-form' onSubmit={(e) => {signUp(email, username, password);
              e.preventDefault();
            }}>
              <FormGroup>
                  <label>Email</label>
                  <Input
                    placeholder="Email"
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Username</label>
                  <Input
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Password</label>
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </FormGroup>
              </Form>
              <Button color="primary" type="submit" form='sign-up-form' >Sign Up</Button>
          </CardBody>
      </Card>
  </div>
  );
}

export default Login;
