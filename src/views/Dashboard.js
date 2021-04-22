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

import { ThirdPartyAccount, ClaimedAccount, ManualAccount } from "trace-search";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import AccountCardList from "components/AccountCardList/AccountCardList";

function Dashboard(props) {
  const [showPopup, togglePopup] = React.useState(false);

  const handleAddClick = () => {
    togglePopup(!showPopup);
  }
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

  // Combine Claimed and Manual accounts for display
  const accountsToRender = [].concat(
    Object.values(ClaimedAccount.accounts)
  ).concat(
    Object.values(ManualAccount.accounts)
  );

  return (
    <>
    <div className={showPopup ? "content blur" : "content"}>
      <div className="header">
        <h3 className="header-title">Claimed Accounts</h3>
        <Link
          className="btn btn-primary add-site-button"
          color="primary"
          onClick={handleAddClick}
        >
          Add New Site
        </Link>
      </div>

      <hr></hr>

      <div>
          <AccountCardList
            headerText="Your Accounts"
            accounts={accountsToRender}
            selectable={true}
            actionable={false}
            flippable={true}
            showNames={true}
            showTripleDot={true}
          />
      </div>
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
