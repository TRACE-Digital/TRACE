import React, { useEffect, useState } from "react";
import { Auth } from 'aws-amplify';
import { destroyLocalDb, generateEncryptionKey } from 'trace-search'

// reactstrap components
import { Alert, Card, CardImg, CardBody, CardTitle, Button, Form, FormGroup, Input } from 'reactstrap';
import { Link } from "react-router-dom";
import ReactCardFlip from "react-card-flip";

async function signUp(username, email, password) {
  try {
      await Auth.signUp({
          username,
          password,
          attributes: {
              email,
          }
      });
      // Before a user signs up, we must clear the current local database
      // We also must generate a new encryption key based off of their password
      await destroyLocalDb();
      const user = await Auth.currentUserPoolUser();
      await generateEncryptionKey(password, user.attributes.sub);
      return null;
  } catch (error) {
      console.log('error signing up:', error);
      return error.message;
  }
}

// Use this to verify email eventually
// async function confirmSignUp(username, code) {
//     try {
//       await Auth.confirmSignUp(username, code);
//     } catch (error) {
//         console.log('error confirming sign up', error);
//     }
// }

async function signIn(username, password) {
    try {
        await Auth.signIn(username, password);
        // Before a user signs in, we must clear the current local database
        // We also must generate a new encryption key based off of their password
        await destroyLocalDb();
        const user = await Auth.currentUserPoolUser();
        await generateEncryptionKey(password, user.attributes.sub);
        return null;
    } catch (error) {
      Auth.error = error;
      console.error('error signing in', error.message);
      return error.message;
    }
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(window.location.href.includes('login'));

  useEffect(() => {
    window.addEventListener('popstate', (popState) => {
      if (popState.state && typeof popState.state === 'string') {
        setIsLogin(popState.state.includes('login'));
      }
    });
  }, []);

  const welcomeElement = (
    <>
      <CardTitle className='welcome'>
        Welcome to TRACE!
      </CardTitle>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Link
          className="btn btn-primary"
          to="/search"
        >
          Continue locally without an account
        </Link>

        <div className="titled-separator" style={{ padding: '15px' }}>or</div>

      </div>
      {error && <Alert color="danger">{error}</Alert>}
    </>
  )
  const loginFields = (
    <>
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
    </>
  )

  return (
    <ReactCardFlip isFlipped={!isLogin} flipDirection="horizontal">
      <div className="login">
        {/* Log In */}
        <Card style={{width: '30rem'}}>
            <CardImg top src={require("assets/img/header.jpg").default} alt="trace logo" className="top-img"/>
            <CardBody>
                {welcomeElement}
                <Form id='sign-in-form'  onSubmit={async (e) => {
                  e.preventDefault();
                  let localError = false;
                  localError = await signIn(email, password);
                  setError(localError);
                  if (!localError) {
                    window.location.href = '/dashboard';
                  }
                }}>
                  {loginFields}
                </Form>
                <Button color="primary" block type="submit" form='sign-in-form' style={{overflow: "unset"}}>
                  Log In
                </Button>
                <br/>
                <Link
                  color="primary"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(false);
                    window.history.pushState('/signup', 'Sign Up', '/signup');
                  }}
                >
                  Don't have an account? Sign Up
                </Link>
            </CardBody>
        </Card>
        </div>
        {/* Sign Up */}
      <div className="login">
          <Card style={{width: '30rem'}}>
            <CardImg top src={require("assets/img/header.jpg").default} alt="trace logo"/>
            <CardBody>
               {welcomeElement}
                <Form id='sign-up-form'  onSubmit={async (e) => {
                  e.preventDefault();
                  let localError = false;
                    if (password === confirmPassword) {
                      localError = await signUp(email, email, password);
                    } else {
                      localError = 'Passwords do not match!';
                    }
                  setError(localError);
                  if (!localError) {
                    window.location.href = '/dashboard';
                  }
                }}>
                  {loginFields}
                  <FormGroup>
                    <Input
                      placeholder="Confirm password"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </FormGroup>
                </Form>
                <Button color="primary" block type="submit" form='sign-up-form' >
                  Sign Up
                </Button>
                <br/>
                <Link
                  color="primary"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(true);
                    window.history.pushState('/login', 'Log In', '/login');
                  }}
                >
                  Already have an account? Log In
                </Link>
            </CardBody>
        </Card>
        </div>
    </ReactCardFlip>
  );
}

export default Login;
