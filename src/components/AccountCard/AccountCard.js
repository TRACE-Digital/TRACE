import PrivacyBadge from "components/PrivacyBadge/PrivacyBadge";
import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Card, CardBody, Button, Col } from "reactstrap";
import { IconButton } from "@material-ui/core";
import { AccountType } from "trace-search";


/**
 * Displays a Card with information about the account passed in
 * @param props.account An Account object with relevant data for the account that it represents
 * @param props.page A string denoting one of three pages where this is used - "search", "dashboard", or "editor"
 * @returns
 */
const AccountCard = (props) => {
  const [flipped, setFlipped] = useState(false);

  const account = props.account;
  const isUnregistered = account.type === AccountType.UNREGISTERED;

  const search = (props.page === "search")
  const dashboard = (props.page === "dashboard")
  const editor = (props.page === "editor")

  if (!search && !dashboard && !editor) {
    console.warn('WARNING - invalid type passed to AccountCard component. Needs to be "search", "dashboard", or "editor"')
  }

  let firstNames = "";
  let lastNames = "";
  let tags = "";
  if (account.matchedFirstNames) {
    firstNames = account.matchedFirstNames.join(", ");
  }
  if (account.matchedLastNames) {
    lastNames = account.matchedLastNames.join(", ");
  }
  if (account.site.tags) {
    tags = account.site.tags.join(", ")
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
        isFlipped={flipped}
        flipSpeedBackToFront=".8"
        flipSpeedFrontToBack="1"
      >
        {/* FRONT OF CARD */}
        <Card className="card-user">
          <CardBody className="card-body">
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


            <div className="editor-handle-name" style={{fontWeight: "bold"}}>{account.site.name}</div>
            <div className="editor-handle-name">@{account.userName}</div>
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
              <div className="test">
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

            {/* Flip Button - don't show if on the editor */}
            { !editor && (
            <div className="flip-button">
              <IconButton onClick={() => setFlipped(true)}>
                <i class="tim-icons icon-refresh-01" style={{color: "#DDDDDD", transform: "scaleX(-1)"}}></i>
              </IconButton>
            </div>)}

          </CardBody>
        </Card>

        {/* BACK OF CARD - don't show if on the editor */}
        { !editor ? (
        <Card className="card-user">
          <CardBody className="card-body">
            <h3>More on {account.site.name}...</h3>

            {/* TAGS (CATEGORIES) */}
            <div className="additional-info">
              TAGS - {tags}
              <br/>
            </div>

            {/* PRIVACY RATING FROM HIBP */}
            <div className="additional-info">
              PRIVACY RATING - {" "}
              <PrivacyBadge service={account.site.name}></PrivacyBadge>
              <br/>
            </div>

            {/* FIRST NAMES */}
            {firstNames.length !== 0 && !dashboard && (
              <div className="additional-info">
                FIRST NAME(S) FOUND - {firstNames}
                <br/>
              </div>
            )}

            {/* LAST NAMES */}
            {lastNames.length !== 0 && !dashboard && (
              <div className="additional-info">
                LAST NAME(S) FOUND - {lastNames}
                <br/>
              </div>
            )}

            {/* CONFIDENCE LEVEL */}
            {/* {!isUnregistered && (
              <div className="additional-info">
                Confidence Level: {account.confidence}
              </div>
            )} */}

            <div className="flip-button">
              <IconButton onClick={() => setFlipped(false)}>
                <i class="tim-icons icon-refresh-01" style={{color: "#DDDDDD", transform: "scaleX(-1)"}}></i>
              </IconButton>
            </div>
          </CardBody>
        </Card>
        ) : <div/>}
      </ReactCardFlip>
    </Col>
  );
};

export default AccountCard;
