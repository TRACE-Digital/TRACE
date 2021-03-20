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
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import Popup from '../components/AddSitePopup/AddSitePopup';  

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
} from "variables/charts.js";

import { ThirdPartyAccount, accounts } from 'trace-search';
import { useEffect } from "react";
import PrivacyBadge from "../components/PrivacyBadge/PrivacyBadge";

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
        setPlsRender(current => !current);
      } catch (e) {
        console.error('Failed to load accounts from the database!');
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

          <Button
            className="add-site-button"
            block
            color="primary"
            onClick={handleAddClick}
          >
            Add New Site
          </Button>
        </div>

        <hr></hr>

        <Row>
          {Object.values(accounts).map(account => (
            <Col lg="3">

              <Card className="card-user">
                <CardBody>
                  <div>
                  <div className="dashboard-parent">
                    <div className="badge" >
                      <PrivacyBadge service={account.site.name}></PrivacyBadge>
                    </div>
                  <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon dot"
                    color="link"
                    type="button"
                  >
                  <i class="fas fa-ellipsis-h"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-right">
                    <DropdownItem
                      onClick={(e) => e.preventDefault()}
                    >
                      REMOVE
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => e.preventDefault()}
                    >
                      EDIT
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                </div>
                    <div className = "editor"> <i className={account.iconClass}></i></div>
                    <div className = "editor-handle-name">@{account.userName}</div>
                    <div className = "editor-link">
                      <a href={account.site.url.replace("{}", account.userName)} target="_blank">{account.site.prettyUrl || account.site.urlMain || account.site.url}</a>
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
                          text=''  
                          closePopup={handleAddClick}  
                />  
                : null  
        }
      </div>
    </>
  );
}

export default Dashboard;
