import React, { useState } from "react";
import { Auth } from 'aws-amplify';

// reactstrap components
import { Alert, Card, CardImg, CardBody, CardTitle, Button, Form, FormGroup, Input } from 'reactstrap';
import { useHistory } from 'react-router-dom';

async function signUp(username, email, password) {
  try {
      const { user } = await Auth.signUp({
          username,
          password,
          attributes: {
              email,
          }
      });
      console.log(user);
      return null;
  } catch (error) {
      console.log('error signing up:', error);
      return error.message;
  }
}

// Use this to verify email eventually
async function confirmSignUp(username, code) {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (error) {
        console.log('error confirming sign up', error);
    }
}

async function signIn(username, password) {
    try {
        const user = await Auth.signIn(username, password);
        console.log(user)
        localStorage.setItem('user', user);
        return null;
    } catch (error) {
      Auth.error = error;
        console.log('error signing in', error.message);
        return error.message;
    }
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setisLogin] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  return (
    <div className="login">
      <Card style={{width: '30rem'}}>
          <CardImg top src={require("assets/img/header.jpg").default} alt="trace logo"/>
          <CardBody>
              <CardTitle className='welcome'>Welcome to TRACE</CardTitle>
              {error && <Alert color="danger">{error}</Alert>}
              <Form id='sign-up-form'  onSubmit={async (e) => {
                e.preventDefault();
                const localError = false;
                if (isLogin) {
                  localError = await signIn(email, password);
                } else {
                  localError = await signUp(email, email, password)
                }
                setError(localError);

                if (!localError) {
                  window.location.href = '/#/admin/dashboard';
                }
              }}>
              <FormGroup>
                  <Input
                    placeholder="Email"
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </FormGroup>
              </Form>
              <Button color="primary" block type="submit" form='sign-up-form' >{isLogin ? "Log In" : "Sign Up"}</Button>
              <br/>
              <a block href="javascript:void(0)" onClick={() => {setisLogin(!isLogin)}}>{isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}</a>

          </CardBody>
      </Card>
  </div>
  );
}

export default Login;
