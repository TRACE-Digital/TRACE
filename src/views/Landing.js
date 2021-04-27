  
// reactstrap components

import { Button } from 'reactstrap';
import { NavLink } from "react-router-dom";

import mainLogo from '../assets/img/trace.png';
import traceExt from '../assets/img/trace-ext.png';

function Landing() {
  return (
    <div className="main-panel">
      <div className="content landing">
      <div className="trace-logo">
        <img src={mainLogo} alt="trace-logo" width="700"></img>
      </div>
      <div className="search-info">Find your digital footprint. Manage your online presence. Our service allows you to increase your social media engagement while keeping your privacy a priority. Sync your information or work locally.</div>
      <div className="search-info heading">What We Offer</div>
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
      <div className="search-info">Then click the button below to get started!</div>
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
  </div>
  );
}

export default Landing;