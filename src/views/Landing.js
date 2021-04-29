
// reactstrap components

import { Button, Container, Row, Col } from 'reactstrap';
import { Navbar } from 'react-bootstrap';
import { NavLink } from "react-router-dom";

import { supportedSites } from 'trace-search';

import mainLogo from '../assets/img/trace.png';
// import smallLogo from '../assets/img/fingerprint-logo.png';
import traceExtAdd from '../assets/img/trace-ext.png';
import traceExtPassword from '../assets/img/trace-ext-password.png';
import landingImg from '../assets/img/Landing.jpg';

const exampleSites = [
  "GitHub",
  "Reddit",
  "Facebook",
  "BitBucket",
  "GitLab",
  "npm",
  "Wikipedia",
  "TripAdvisor",
  "Steam",
  "Keybase",
  "last.fm",
  "Twitch",
];

function Landing() {
  const sites = exampleSites.map((name) => supportedSites[name]);

  return (
    <div className="main-panel">
      <div className="content landing">
        <div className="landing-header">
          <div className="trace-logo">
            <img src={mainLogo} alt="trace-logo" width="150"></img>
          </div>
          <p>Find your digital footprint. Manage your online presence. <br /> Sync your information or work locally.</p>
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

        <img src={landingImg} alt="landing-img" width="100%"></img>
      Photo by <a href="https://unsplash.com/@tma?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Tianyi Ma</a> on <a href="https://unsplash.com/s/photos/computer?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

        <div className="search-info content">

          <h2>HOW IT WORKS</h2>

          <Container>
            <Row>
              <Col xs="6" sm="4" className="info-card">
                <i className="tim-icons icon-laptop"></i>
                <h4 className="subtitle">Search accounts</h4>
                <p>Use the search page to look up accounts registered under your usernames.</p>
              </Col>
              <Col xs="6" sm="4" className="info-card">
                <i className="tim-icons icon-mobile"></i>
                <h4 className="subtitle">Add to dashboard</h4>
                <p>Add your accounts to the dashboard for easy access anytime, anywhere.</p>
              </Col>
              <Col sm="4" className="info-card">
                <i className="tim-icons icon-components"></i>
                <h4 className="subtitle">Monitor your data</h4>
                <p>Use the analytics page to monitor account activity and profile engagement.</p>
              </Col>
            </Row>
            <NavLink to="/search">
              <Button
                className="start-button"
                block
                color="secondary"
              >
                Learn More
               </Button>
            </NavLink>
          </Container>

        </div>

        <div className="search-info content">
          <h2>WE SUPPORT OVER 300 SITES</h2>

          <Row>
          {sites.map((site) => {
            return (
            <Col sm="4" md="3">
              <i
              className={
                site.logoClass !== "fa-question-circle"
                  ? "fab " + site.logoClass
                  : "fas " + site.logoClass
              }
              ></i>
              <h4 className="site-name">{site.name}</h4>
            </Col>
            );
          })}
          </Row>

          <NavLink to="/search">
            <Button
              className="start-button"
              block
              color="secondary"
            >
              Get Started
              </Button>
          </NavLink>
        </div>

        <div className="search-info content">
          {/* <h2>ADDITIONAL TOOLS</h2> */}

          <h4>Don't forget to install our browser extension below for full access to our search features among other privacy tools!</h4>
          <img src={traceExtAdd} alt="trace-ext-add-site" width="300" height="400" className="ext-img"></img>
          <img src={traceExtPassword} alt="trace-ext-password" width="300" height="400" className="ext-img"></img>
          <br />
          <a href="https://addons.mozilla.org/en-US/firefox/extensions/" target="_blank" rel="noreferrer">
            <Button
              className="install-button"
              block
              color="secondary"
            >
              Firefox
          </Button>
          </a>
          <a href="https://chrome.google.com/webstore/detail/trace/klhmocgplcpemcdfeefpaikihedmikgk?hl=en&authuser=2" target="_blank" rel="noreferrer">
            <Button
              className="install-button"
              block
              color="secondary"
            >
              Chrome
          </Button>
          </a>
        </div>

        <Navbar variant="dark" className="footer">
          <Row className="footer-content">
            <Col>
                <h4>Browser extensions</h4>
                <p><a href="https://addons.mozilla.org/en-US/firefox/extensions/" target="_blank" rel="noreferrer">Firefox</a></p>
                <p><a href="https://chrome.google.com/webstore/detail/trace/klhmocgplcpemcdfeefpaikihedmikgk?hl=en&authuser=2" target="_blank" rel="noreferrer">Chrome</a></p>
            </Col>
            <Col>
                <h4>Contact Us</h4>
                <p><a href="https://github.com/TRACE-Digital/TRACE/issues" target="_blank" rel="noreferrer">GitHub</a></p>
                <p><a href="mailto:demo.trace.digital@gmail.com">Email</a></p>
            </Col>
            <Col>
                <h4>Documentation</h4>
                <p><a href="https://trace-digital.github.io/TRACE-search-docs/" target="_blank" rel="noreferrer">Search</a></p>
                <p><a href="https://github.com/TRACE-Digital/TRACE-ext" target="_blank" rel="noreferrer">Extension</a></p>
            </Col>
          </Row>
        </Navbar>
      </div>
    </div>
  );
}

export default Landing;