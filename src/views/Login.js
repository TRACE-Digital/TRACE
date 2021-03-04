import React, { useState } from "react";
import { Auth } from 'aws-amplify';


// reactstrap components
import { Card, CardImg, CardBody, CardTitle, Button, Form, FormGroup, Input } from 'reactstrap';

async function signUp(email, password) {
  try {
      const { user } = await Auth.signUp({
          password,
          attributes: {
              email,          // optional
              // other custom attributes
          }
      });
      console.log(user);
  } catch (error) {
      console.log('error signing up:', error);
      // put a notification here
  }
}

async function confirmSignUp(username, code) {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (error) {
        console.log('error confirming sign up', error);
    }
}

async function signIn(email, password) {
  try {
      const user = await Auth.signIn(email, password);
      console.log(user)
  } catch (error) {
      console.log('error signing in', error);
  }
}

function Login() {
  const [email, setEmail] = useState("");
  // const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setisLogin] = useState(true);
  const [verify, setVerify] = useState();

  return (
    <div className="login">
      <Card style={{width: '20rem'}}>
          <CardImg top src={require("assets/img/header.jpg").default} alt="trace logo"/>
          <CardBody>
              <CardTitle>Welcome to TRACE</CardTitle>


              <Form id='sign-up-form' onSubmit={(e) => {
                isLogin ? signIn(email, password) : signUp(email, password);
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
                {/* <FormGroup>
                  <label>Username</label>
                  <Input
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </FormGroup> */}
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
              <Button color="primary" type="submit" form='sign-up-form' >{isLogin ? "Log In" : "Sign Up"}</Button>
              <br/>
              <a href="#signup" onClick={() => {setisLogin(!isLogin)}}>{isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}</a>

          </CardBody>
      </Card>
  </div>
  );
}

export default Login;
