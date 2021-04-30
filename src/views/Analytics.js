/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useState, } from "react";
import { ProfilePage } from 'trace-search';
import Graph from "components/Graph/Graph.js";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Auth from "@aws-amplify/auth";
import { Link } from "react-router-dom";

function Analytics(props) {
  const [page, setPage] = useState(null);

  useEffect(() => {
    (async () => {
      const results = await ProfilePage.loadAll();
      if (results.length > 0) {
        setPage(results[0]);
      } else {
        setPage(null);
      }
    })();
  }, []);

  useEffect(() => {
    async function isLoggedIn() {
      try {
        await Auth.currentUserPoolUser();
      }
      catch {
        window.location.href = '/login';
      }
    }
    isLoggedIn();
  }, []);

  return (
    <>
      <div className="content">
        {!page &&
        <h3>You haven't created a profile page yet! Check out the <Link to="/profile-editor">editor</Link> first.</h3>
        }
        {page && !page.published &&
        <>
          <h3>Great! You've created a profile page.</h3>
          <h3>It's not yet published though. Head back over to the <Link to="/profile-editor">editor</Link> to publish it.</h3>
        </>
        }
        {page && page.published &&
        <Row>
          <Col lg="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Public Profile</h5>
                    <CardTitle tag="h2" style={{opacity: "0"}}>placeholder</CardTitle>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <GraphControl
                  dataLabel="Visitors"
                  idSite="1"
                  pageUrl=""
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        }
        <Row>
          {/* Map here */}
          {page && page.published && page.accounts.map((account) => (
             <Col lg="4" key={account.id}>
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-single-02" style={{paddingRight: "5px"}}/>
                    {account.site.name} -
                    <a href={account.url}> @{account.userName}</a>
                    <br/>
                    <h4 style={{opacity: "0"}}>placeholder</h4>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <GraphControl
                    dataLabel="Clicks"
                    idSite="1"
                    pageUrl={`${account.site.name}/${account.userName}`}
                  />
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

function GraphControl(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const [selectedInterval, setSelectedInterval] = useState("1 Year");

  return(
    <>
      <div className="chart-area" >
        <Graph
          dataLabel={props.dataLabel}
          idSite={props.idSite}
          pageUrl={props.pageUrl}
          interval={selectedInterval}
        />
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} style={{display: "inline", marginRight: "10px", paddingTop: "10px"}}>
          <DropdownToggle caret>{selectedInterval}
            <b className="caret d-none d-lg-block d-xl-block" style={{marginLeft: "-15px", marginTop: "-11px"}} />
          </DropdownToggle>
          <DropdownMenu style={{marginTop: "15px"}}>
            <DropdownItem onClick={() => setSelectedInterval("1 Week")}>
              1 Week
            </DropdownItem>
            <DropdownItem divider tag="li" />
            <DropdownItem onClick={() => setSelectedInterval("1 Month")}>
              1 Month
            </DropdownItem>
            <DropdownItem divider tag="li" />
            <DropdownItem onClick={() => setSelectedInterval("6 Months")}>
              6 Months
            </DropdownItem>
            <DropdownItem divider tag="li" />
            <DropdownItem onClick={() => setSelectedInterval("1 Year")}>
              1 Year
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

    </>
  );
}

export default Analytics;
