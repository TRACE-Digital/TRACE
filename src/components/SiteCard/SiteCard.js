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
const SiteCard = (props) => {
  const [flipped, setFlipped] = useState(false);

  const account = props.account;
  const isUnregistered = account.type === AccountType.UNREGISTERED;

  const search = props.page === "search";
  const dashboard = props.page === "dashboard";
  const editor = props.page === "editor";

  if (!search && !dashboard && !editor) {
    console.warn(
      'WARNING - invalid type passed to SiteCard component. Needs to be "search", "dashboard", or "editor"'
    );
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
    tags = account.site.tags.join(", ");
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
    //<Col lg="3" key={account.id}>
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

            {/* CLAIM BUTTONS (IF APPLICABLE) - only show if you're on search page AND account is unregistered */}
            {isUnregistered || !search ? (
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

            {/* Flip Button - don't show if on the editor (but show on search and dashboard) */}
            {!editor && (
              <div className="flip-button">
                <IconButton onClick={() => setFlipped(true)}>
                  <i className="fas fa-redo" id="flip-icon"></i>
                </IconButton>
              </div>
            )}
          </CardBody>
        </Card>

        {/* BACK OF CARD - don't show if on the editor */}
        {!editor ? (
          <Card className="card-user">
            <CardBody className="card-body">
              <h3>More on {account.site.name}...</h3>

              {/* TAGS (CATEGORIES) - show on both search and dashboard */}
              <div className="additional-info">TAGS - {tags}</div>
              <br />

              {/* PRIVACY RATING FROM HIBP - show on both search and dashboard */}
              <div className="additional-info">
                PRIVACY RATING -{" "}
                <PrivacyBadge service={account.site.name}></PrivacyBadge>
              </div>
              <br />

              {/* FIRST NAMES - only for search if there are last names to display*/}
              {firstNames.length !== 0 && search && (
                <>
                  <div className="additional-info">
                    FIRST NAME(S) FOUND - {firstNames}
                  </div>
                  <br />
                </>
              )}

              {/* LAST NAMES - only for search if there are last names to display */}
              {lastNames.length !== 0 && search && (
                <>
                  <div className="additional-info">
                    LAST NAME(S) FOUND - {lastNames}
                  </div>
                  <br />
                </>
              )}

              {/* DATE CLAIMED - only for dashboard */}
              {dashboard && (
                <>
                  <div className="additional-info">
                    CLAIMED - {account.claimedAt.toUTCString()}
                  </div>
                  <br />
                </>
              )}

              <div className="flip-button">
                <IconButton onClick={() => setFlipped(false)}>
                  <i className="fas fa-redo" id="flip-icon"></i>
                </IconButton>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div />
        )}
      </ReactCardFlip>
    //</Col>
  );
};

export default SiteCard;
