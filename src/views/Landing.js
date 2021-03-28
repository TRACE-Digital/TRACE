// reactstrap components
import { Button } from 'reactstrap';
import { NavLink } from "react-router-dom";

function Landing() {

  return (
    <div className="main-panel">
      <div className="content landing">
      <div className="search-title">
        TRACE
      </div>
      <div className="search-info">Find your digital footprint. Manage your online presence. Our service allows you to increase your social media engagement while keeping your privacy a priority. Sync your information or work locally.</div>
      <div className="search-info heading">What We Offer</div>
      <div className="search-info">TRACE offers a privacy-focused approach to manage your online presence. Use the search page to add acounts to your collection, then use the analytics page to monitor data trends on your accounts' activity.</div>
      <div className="search-info heading">Privacy</div>
      <div className="search-info">We would never tell your secrets. We promise. ;)</div>
      <div className="search-info heading">Getting Started</div>
      <div className="search-info">Click the button below to get started...</div>
      <NavLink to="/admin/dashboard">
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
