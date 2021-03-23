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
import React, { useState } from "react";
// nodejs library that concatenates classes

// reactstrap components
import { Row } from "reactstrap";

import { ThirdPartyAccount, accounts, AccountType } from "trace-search";
import { useEffect } from "react";
import PrivacyBadge from "../components/PrivacyBadge/PrivacyBadge";
import { Link } from "react-router-dom";
import SiteCard from "components/SiteCard/SiteCard";

const Dashboard = (props) => {
  const [bigChartData, setbigChartData] = useState("data1");

  const [claimedAccounts, setClaimedAccounts] = useState({});

  const setBgChartData = (name) => {
    setbigChartData(name);
  };

  /**
   * Monitor for new claimed accounts. Every time the accounts array is updated, re-render to show the proper tiles.
   */
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        // Load all accounts from the database into memory
        await ThirdPartyAccount.loadAll();
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

    console.log(accounts)
  }, [accounts]);


  return (
    <div className="content">
      <div className="header">
        <h3 className="header-title">Claimed Accounts</h3>

        <Link
          className="btn btn-primary add-site-button"
          color="primary"
          to="/admin/search"
        >
          Add New Site
        </Link>
      </div>

      <hr></hr>

      <Row>
        {Object.values(claimedAccounts).map((acc) => (
          <SiteCard account={acc} page="dashboard" />
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
