import BugReportForm from "components/GithubIssueForms/BugReport";
import RequestFeatureForm from "components/GithubIssueForms/RequestFeature";
import RequestWebsiteForm from "components/GithubIssueForms/RequestWebsite";
import React, { useState } from "react";

// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Row, Col, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

function Contact() {
  const [dropdownOpen, setOpen] = useState(false);
  const [templateType, setTemplateType] = useState("request_website");
  const [showRequestFeature, setRequestFeature] = useState(false);
  const [showRequestWebsite, setRequestWebsite] = useState(true);
  const [showBugReport, setBugReport] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const handleRequestFeatureClick = () => {
      setRequestFeature(true);
      setRequestWebsite(false);
      setBugReport(false);
      setTemplateType("request_feature");
  }

  const handleRequestWebsiteClick = () => {
      setRequestWebsite(true);
      setRequestFeature(false);
      setBugReport(false);
      setTemplateType("request_website");
  }

  const handleBugReportClick = () => {
      setBugReport(true);
      setRequestFeature(false);
      setRequestWebsite(false);
      setTemplateType("bug_report");
  }

  return (
    <>
      <div className="content">
        <h3 className="header-title">Contact us</h3>

        <br></br>
        <br></br>
        <br></br>

        <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>
            Select an Issue
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={handleRequestFeatureClick}>Request a feature</DropdownItem>
                <DropdownItem onClick={handleRequestWebsiteClick}>Request website support</DropdownItem>
                <DropdownItem onClick={handleBugReportClick}>Report a bug</DropdownItem>
            </DropdownMenu>
        </ButtonDropdown>

        <br></br>
        <br></br>

        <div className="request-form-container">
            {showRequestWebsite ?  
                <RequestWebsiteForm
                    text='Website request form' 
                />  
                : null  
            }
        </div>

        <div className="request-form-container">
            {showRequestFeature ?  
                <RequestFeatureForm
                    text='Feature request form' 
                />  
                : null  
            }
        </div>

        <div className="request-form-container">
            {showBugReport ?  
                <BugReportForm
                    text='Bug report form' 
                />  
                : null  
            }
        </div>
        
        <br></br>
        <br></br>

        <h3 className="header-title">Meet the developers</h3>

        <br></br>
        <br></br>
        <br></br>
        
      </div>
    </>
  );
}

export default Contact;
