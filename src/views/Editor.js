import React, { useState, useEffect } from "react";
import Colors from "views/Colors.js";
import { Auth } from "aws-amplify";
import { ThirdPartyAccount, accounts, AccountType } from "trace-search";
import SiteCard from "components/SiteCard/SiteCard";

// reactstrap components
import {
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";

var name = "Isabel Battaglioli";

const Editor = () => {
  const [claimedAccounts, setClaimedAccounts] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = (e) => {
    if (e.target.className === "tim-icons icon-pencil icon") {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(false);
    }
  };

  /**
   * If user is not logged in, redirect to login page.
   */
  useEffect(() => {
   async function isLoggedIn () {
    if (!(localStorage.getItem('user'))) {
      window.location.href = '/#/login';
    }
   }
   isLoggedIn();
  }, []);

  /**
   * Monitor for new claimed accounts. Every time the accounts array is updated, re-render to show the proper tiles.
   */
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        // Load all accounts from the database into memory
        await ThirdPartyAccount.loadAll();
        // setPlsRender((current) => !current);
      } catch (e) {
        console.error("Failed to load accounts from the database!");
        console.error(e);
        return {};
      }
      return accounts;
    };

    loadAccounts().then(() => {
      setClaimedAccounts(accounts);
    });

  }, [accounts]);

  return (
    <>
      <div
        onClick={togglePopup}
        className={isOpen ? "content blur" : "content"}
      >
        <div className="editor-title">
          {name}
          <i class="tim-icons icon-pencil icon"></i>
        </div>
        <div>
          <Row>
            {Object.values(claimedAccounts).map((acc) => (
              <SiteCard account={acc} page="editor" />
            ))}
            <Col lg="3">
              <a id="new" href="#new">
                <Card className="card-user add-to-edit">
                  <CardBody>
                    <div className="edit-text">
                      <span className="icon">
                        <i class="fas fa-plus"></i>
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </a>
            </Col>
          </Row>
        </div>
      </div>
      <div className="content">{isOpen ? <Colors /> : null} </div>
    </>
  );
};

export default Editor;
