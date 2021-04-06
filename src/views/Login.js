import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

// reactstrap components
import { Alert, Card, CardImg, CardBody, CardTitle, Button, Form, FormGroup, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactCardFlip from 'react-card-flip';

async function signUp(username, email, password) {
  try {
    await Auth.signUp({
      username,
      password,
      attributes: {
        email,
      },
    });
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
    return null;
  } catch (error) {
    Auth.error = error;
    console.log('error signing in', error.message);
    return error.message;
  }
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(window.location.href.includes('login'));

  const welcomeElement = (
    <>
      <CardTitle className="welcome">Welcome to TRACE!</CardTitle>
      {error && <Alert color="danger">{error}</Alert>}
    </>
  );
  const loginFields = (
    <>
      <FormGroup>
        <Input placeholder="Email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
      </FormGroup>
      <FormGroup>
        <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </FormGroup>
    </>
  );

  return (
    <ReactCardFlip isFlipped={!isLogin} flipDirection="horizontal">
      <div className="login">
        {/* Log In */}
        <Card style={{ width: '30rem' }}>
          <CardImg top src={require('assets/img/header.jpg').default} alt="trace logo" />
          <CardBody>
            {welcomeElement}
            <Form
              id="sign-in-form"
              onSubmit={async e => {
                e.preventDefault();
                let localError = false;
                localError = await signIn(email, password);
                setError(localError);
                if (!localError) {
                  window.location.href = '/dashboard';
                }
              }}
            >
              {loginFields}
            </Form>
            <Button color="primary" block type="submit" form="sign-in-form">
              Log In
            </Button>
            <br />
            <Link
              color="primary"
              to="#"
              onClick={e => {
                e.preventDefault();
                setIsLogin(false);
              }}
            >
              Don't have an account? Sign Up
            </Link>
          </CardBody>
        </Card>
      </div>
      {/* Sign Up */}
      <div className="login">
        <Card style={{ width: '30rem' }}>
          <CardImg top src={require('assets/img/header.jpg').default} alt="trace logo" />
          <CardBody>
            {welcomeElement}
            <Form
              id="sign-up-form"
              onSubmit={async e => {
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
              }}
            >
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
            <Button color="primary" block type="submit" form="sign-up-form">
              Sign Up
            </Button>
            <br />
            <Link
              color="primary"
              to="#"
              onClick={e => {
                e.preventDefault();
                setIsLogin(true);
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
