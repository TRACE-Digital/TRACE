import PrivacyBadge from "components/PrivacyBadge/PrivacyBadge";
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

  console.log(account.site.name);

  let firstNames = "";
  let lastNames = "";
  if (account.matchedFirstNames) {
    firstNames = account.matchedFirstNames.join(", ");
  }
  if (account.matchedLastNames) {
    lastNames = account.matchedLastNames.join(", ");
  }

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
        isFlipped={false}
        flipSpeedBackToFront=".8"
        flipSpeedFrontToBack="1"
      >
        {/* FRONT OF CARD */}
        <Card
          className="card-user"
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
        >
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
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                  }}
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
        <Card
          className="card-user"
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
        >
          <CardBody>
            <h3>More Information...</h3>
            <div className="additional-info">
              Privacy Rating: <PrivacyBadge service={account.site.name}></PrivacyBadge>
            </div>
            {firstNames.length != 0 && (
              <div className="additional-info">
                First names found: {firstNames}
              </div>
            )}
            {lastNames.length != 0 && (
              <div className="additional-info">
                Last names found: {lastNames}
              </div>
            )}
            {/* REMOVE THIS LATER - SORT */}
            {!isUnregistered && (
              <div className="additional-info">
                Confidence Level: {account.confidence}
              </div>
            )}
          </CardBody>
        </Card>
      </ReactCardFlip>
    </Col>
  );
};

export default SiteCard;
