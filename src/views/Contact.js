import BugReportForm from "components/GithubIssueForms/BugReport";
import RequestFeatureForm from "components/GithubIssueForms/RequestFeature";
import RequestWebsiteForm from "components/GithubIssueForms/RequestWebsite";
import React, { useState } from "react";

import classNames from "classnames";

// reactstrap components
import {
    Button,
    ButtonGroup,
} from "reactstrap";

function Contact() {
    const [dropdownOpen, setOpen] = useState(false);
    const [templateType, setTemplateType] = useState("request_website");
    const [showRequestFeature, setRequestFeature] = useState(false);
    const [showRequestWebsite, setRequestWebsite] = useState(true);
    const [showBugReport, setBugReport] = useState(false);
    // const [bigChartData, setbigChartData] = React.useState("rqeuest_website");

    // const setBgChartData = (name) => {
    //     setbigChartData(name);
    // };

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
                <div className="toggle-container">
                <ButtonGroup
                    className="btn-group-toggle float-right"
                    data-toggle="buttons"
                >
                    <Button
                        tag="label"
                        className={classNames("btn-simple", {
                            active: templateType === "request_website",
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={handleRequestWebsiteClick}
                    >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Website Support
                        </span>
                        <span className="d-block d-sm-none">
                            <i className="tim-icons icon-single-02" />
                        </span>
                    </Button>
                    <Button
                        color="info"
                        id="1"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                            active: templateType === "request_feature",
                        })}
                        onClick={handleRequestFeatureClick}
                    >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Feature Request
                        </span>
                        <span className="d-block d-sm-none">
                            <i className="tim-icons icon-gift-2" />
                        </span>
                    </Button>
                    <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                            active: templateType === "bug_report",
                        })}
                        onClick={handleBugReportClick}
                    >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Bug Report
                        </span>
                        <span className="d-block d-sm-none">
                            <i className="tim-icons icon-tap-02" />
                        </span>
                    </Button>
                </ButtonGroup>
                </div>

                <h3 className="header">Contact us</h3>

                <h4 className="instructions">How can we help? Please select a form that best relates to your inquiry.</h4>

                {/* <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle caret>
                    Select an Issue
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={handleRequestFeatureClick}>Request a feature</DropdownItem>
                        <DropdownItem onClick={handleRequestWebsiteClick}>Request website support</DropdownItem>
                        <DropdownItem onClick={handleBugReportClick}>Report a bug</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown> */}

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
            </div>
        </>
    );
}

export default Contact;
