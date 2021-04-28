  
// reactstrap components

import { Button, Card, CardBody, CardText, CardTitle, CardImg } from 'reactstrap';
import { NavLink } from "react-router-dom";

import mainLogo from '../assets/img/trace.png';
import traceExt from '../assets/img/trace-ext.png';
import landingImg from '../assets/img/Landing.jpg';

function Landing() {
  return (
    <div className="main-panel">
      <div className="content landing">
      <div className="landing-header">
        <div className="trace-logo">
          <img src={mainLogo} alt="trace-logo" width="150"></img>
        </div>
        <p>Find your digital footprint. Manage your online presence. <br/> Sync your information or work locally.</p>
        <NavLink to="/search">
          <Button
            className="start-button"
            block
            color="primary"
          >
            Get Started
          </Button>
        </NavLink>
      </div>
      {/* <div className="trace-logo">
        <img src={mainLogo} alt="trace-logo" width="200"></img>
      </div> */}
      <img src={landingImg} alt="landing-img" width="100%"></img>
      Photo by <a href="https://unsplash.com/@tma?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Tianyi Ma</a> on <a href="https://unsplash.com/s/photos/computer?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
      
      <div className="search-info heading">WHAT WE OFFER</div>

      <Card>
        <CardBody>
          <CardTitle tag="h5">Privacy</CardTitle>
          <CardText>We would never tell your secrets. We promise. ;)</CardText>
          <Button>Button</Button>
        </CardBody>
      </Card>

      <div className="search-info">TRACE offers a privacy-focused approach to manage your online presence. Use the search page to add accounts to your collection, then use the analytics page to monitor data trends on your accounts' activity.</div>
      <div className="search-info heading">Privacy</div>
      <div className="search-info">We would never tell your secrets. We promise. ;)</div>
      <div className="search-info heading">Getting Started</div>
      <div className="search-info">Start by downloading our browser extension below.</div>
      <img src={traceExt} alt="trace-ext" width="300" style={{marginBottom: 20}}></img>
      <br/>
      <a href="https://chrome.google.com/webstore/category/extensions" target="_blank" rel="noreferrer">
        <Button
          className="start-button"
          block
          color="secondary"
        >
          Chrome
        </Button>
      </a>
      <a href="https://addons.mozilla.org/en-US/firefox/extensions/" target="_blank" rel="noreferrer">
        <Button
          className="start-button"
          block
          color="secondary"
        >
          Firefox
        </Button>
      </a>
      <div className="search-info">The extension allows you to add sites manually from anywhere and includes helpful privacy tools like HaveIBeenPwnd and password generators.</div>
    </div>
  </div>
  );
}

export default Landing;