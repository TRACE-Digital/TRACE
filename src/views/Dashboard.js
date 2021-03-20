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
import React from "react";
// nodejs library that concatenates classes

import Popup from '../components/AddSitePopup/AddSitePopup';  

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Row,
  Col,
} from "reactstrap";

import { ThirdPartyAccount, accounts, AccountType } from "trace-search";
import { useEffect } from "react";
import PrivacyBadge from "../components/PrivacyBadge/PrivacyBadge";
import { Link } from "react-router-dom";

function Dashboard(props) {
  const [plsRender, setPlsRender] = React.useState(false);
  const [bigChartData, setbigChartData] = React.useState("data1");
  const setBgChartData = (name) => {
    setbigChartData(name);
  };
  const [showPopup, togglePopup] = React.useState(false);

  const handleAddClick = () => {
    togglePopup(!showPopup);
  }

  useEffect(() => {
    async function loadAccounts() {
      try {
        // Load all accounts from the database into memory
        await ThirdPartyAccount.loadAll();
        setPlsRender((current) => !current);
      } catch (e) {
        console.error("Failed to load accounts from the database!");
        console.error(e);
      }
      console.log(accounts);
    }

    loadAccounts();
  }, []);

  return (
    <>
      <div className={showPopup ? "content blur" : "content"}>
        <div className="header">
          <h3 className="header-title">Claimed Accounts</h3>
          {/* {Object.values(accounts).map(account => {
            return <div key={account.id}>{account.site.name} - {account.userName}</div>
          })} */}

          <Link
            className="btn btn-primary add-site-button"
            color="primary"
            onClick={handleAddClick}
            to="/admin/search"
          >
            Add New Site
          </Link>
        </div>

        <hr></hr>

        <Row>
          {Object.values(accounts)
            .filter((account) => account.type === AccountType.CLAIMED)
            .map((account) => (
              <Col lg="3" key={account.id}>
                <Card className="card-user">
                  <CardBody>
                    <div>
                      <div className="dashboard-parent">
                        <div className="badge">
                          <PrivacyBadge
                            service={account.site.name}
                          ></PrivacyBadge>
                        </div>
                        <div>
                          <UncontrolledDropdown>
                            <DropdownToggle
                              caret
                              className="btn-icon dot"
                              color="link"
                              type="button"
                            >
                              <i className="fas fa-ellipsis-h"></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-right">
                              <DropdownItem onClick={(e) => e.preventDefault()}>
                                REMOVE
                              </DropdownItem>
                              <DropdownItem onClick={(e) => e.preventDefault()}>
                                EDIT
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      </div>
                      <div className="editor">
                        {" "}
                        <i
                          className={
                            account.site.logoClass !== "fa-question-circle"
                              ? "fab " + account.site.logoClass
                              : "fas " + account.site.logoClass
                          }
                        ></i>
                      </div>
                      <div className="editor-handle-name">
                        @{account.userName}
                      </div>
                      <div className="editor-link">
                        <a href={account.url} target="blank">
                          {account.site.prettyUrl ||
                            account.site.urlMain ||
                            account.site.url}
                        </a>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
        </Row>
      </div>
      <div className="content">
        {showPopup ?  
                <Popup
                          text='Create New Site'  
                          closePopup={handleAddClick}  
                />  
                : null  
        }
      </div>
    </>
  );
}

export default Dashboard;
