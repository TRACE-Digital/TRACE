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

// reactstrap components
import {
  Card,
  CardBody,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Row,
  Col,
} from "reactstrap";

import { ClaimedAccount, ManualAccount, ThirdPartyAccount } from "trace-search";
import { useEffect } from "react";
import PrivacyBadge from "../components/PrivacyBadge/PrivacyBadge";
import { Link } from "react-router-dom";

function Dashboard(props) {
  const [, setPlsRender] = React.useState(false);

  // Load the initial accounts that we need and
  // register for any future changes
  useEffect(() => {
    const triggerRender = () => {
      setPlsRender(prev => !prev);
    };

    const loadAccounts = async () => {
      try {
        // Load what we need from the database into memory
        await ClaimedAccount.loadAll();
        await ManualAccount.loadAll();

        setPlsRender(prev => !prev);
      } catch (e) {
        console.error("Failed to load accounts from the database!");
        console.error(e);
      }
      console.log(ThirdPartyAccount.accountCache.items);
    }

    ClaimedAccount.accountCache.events.on('change', triggerRender);
    ManualAccount.accountCache.events.on('change', triggerRender);

    loadAccounts();

    const cleanup = () => {
      ClaimedAccount.accountCache.events.removeListener('change', triggerRender);
      ManualAccount.accountCache.events.removeListener('change', triggerRender);
    };

    return cleanup;
  }, []);

  return (
    <>
      <div className="content">
        <div className="header">
          <h3 className="header-title">Claimed Accounts</h3>
          {/* {Object.values(accounts).map(account => {
            return <div key={account.id}>{account.site.name} - {account.userName}</div>
          })} */}

          <Link
            className="btn btn-primary add-site-button"
            color="primary"
            to="/search"
          >
            Add New Site
          </Link>
        </div>

        <hr></hr>

        <Row>
          { /* Combine Claimed and Manual accounts for display */
            [].concat(
              Object.values(ClaimedAccount.accounts)
            ).concat(
              Object.values(ManualAccount.accounts)
            )
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
                            <DropdownItem onClick={
                              async (e) => {
                                e.preventDefault();
                                await account.remove();
                                // TODO: Trigger rerender
                              }
                            }>
                              REMOVE
                            </DropdownItem>
                            <DropdownItem onClick={(e) => e.preventDefault()}>
                              EDIT
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
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
    </>
  );
}

export default Dashboard;
