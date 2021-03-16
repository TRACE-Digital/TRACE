import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Card, CardBody, Button, Col } from "reactstrap";
import {
  SearchDefinition,
  AccountType,
  searchResults,
  allSites,
  tags,
  filterSitesByTags,
  Site,
} from "trace-search";

const SiteCard = (props) => {
  const [flipped, setFlipped] = useState(false);

  const account = props.account;
  const isUnregistered = account.type === AccountType.UNREGISTERED;

  let firstNames = ""
  let lastNames = ""
  if (account.matchedFirstNames) {
      firstNames = account.matchedFirstNames.join(", ")
  }
  if (account.matchedLastNames) {
    lastNames = account.matchedLastNames.join(", ")
  }

  console.log("SITE CARD")
  console.log(account)

  const handleCardHover = () => {
    setFlipped(!flipped);
  }; // onHover flipper handler for ReactCardFlip

  /**
   * Claim account for the current user
   */
  const claimAccount = async () => {
    //   async function claimAccount(account) {
    try {
      await account.claim();
      alert("Account successfully claimed!");
    } catch (e) {
      alert("Account has already been claimed!");
      console.error(e);
    }
  };

  /**
   * Remove account for current user (from current screen)
   */
  const deleteAccount = async () => {
    //   async function deleteAccount(account) {
    try {
      await account.reject();
      alert("Account successfully removed!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Col lg="3" key={account.id}>
      <ReactCardFlip
        isFlipped={flipped}
        flipSpeedBackToFront=".5"
        flipSpeedFrontToBack=".5"
        className="card-user"
      >
        {/* FRONT OF CARD */}
        <Card className="card-user" onClick={() => setFlipped(!flipped)}>
            <CardBody>
            <div class="card-details">
                {/* ICON */}
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

                {/* USERNAME */}
                <div className="editor-handle-name">@{account.userName}</div>

                {/* SITE URL */}
                <div className="editor-link">
                <a
                    href={account.site.url.replace("{}", account.userName)}
                    target="blank"
                >
                    {account.site.prettyUrl ||
                    account.site.urlMain ||
                    account.site.url}
                </a>
                </div>

                {/* CLAIM BUTTONS (IF APPLICABLE) */}
                {isUnregistered ? (
                <div></div>
                ) : (
                <div
                    className="test"
                    style={{ position: "absolute", bottom: "20px", right: "20px" }}
                >
                    <Button
                    onClick={() => claimAccount(account)}
                    className="claim-button"
                    >
                    <i className="tim-icons icon-check-2" />
                    </Button>
                    &nbsp;
                    <Button
                    onClick={() => deleteAccount(account)}
                    className="claim-button"
                    >
                    <i className="tim-icons icon-simple-remove" />
                    </Button>
                </div>
                )}

            </div>
            </CardBody>
        </Card>

        {/* BACK OF CARD */}
        <Card className="card-user" onClick={() => setFlipped(!flipped)}>
            <CardBody>
            <h3>More Information...</h3>
            <div className="editor-names">First names found: {firstNames}</div>
            <div className="editor-names">Last names found: {lastNames}</div>
            {/* TODO:               
                - Privacy rating
                -  */}
            
            </CardBody>
        </Card>
      </ReactCardFlip>
    </Col>
  );
};

export default SiteCard;
