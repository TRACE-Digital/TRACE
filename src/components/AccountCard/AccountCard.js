import PrivacyBadge from "components/PrivacyBadge/PrivacyBadge";
import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Card, CardBody, Button, Col } from "reactstrap";
import { IconButton } from "@material-ui/core";

/**
 * Displays a Card with information about the account passed in
 * @param props.account An Account object with relevant data for the account that it represents
 * @param props.page A string denoting one of three pages where this is used - "search", "dashboard", or "editor"
 * @returns
 */
const AccountCard = (props) => {
  const [flipped, setFlipped] = useState(false);
  let firstNames = "";
  let lastNames = "";
  let tags = "";
  if (props.account.matchedFirstNames) {
    firstNames = props.account.matchedFirstNames.join(", ");
  }
  if (props.account.matchedLastNames) {
    lastNames = props.account.matchedLastNames.join(", ");
  }
  if (props.account.site.tags) {
    tags = props.account.site.tags.join(", ")
  }

  const handleClick = () => {
    if (!props.selectable) {
      return;
    }
    if (props.selected) {
      props.onDeselected();
    } else {
      props.onSelected();
    }
  }

  return (
    <Col lg="3" key={props.account.id}>
      <ReactCardFlip
        isFlipped={props.flippable && flipped}
        flipSpeedBackToFront=".8"
        flipSpeedFrontToBack="1"
      >
        {/* FRONT OF CARD */}
        <Card
          className={'card-user site-card ' + (props.selected ? 'selected-site-card' : '')}
          onClick={handleClick}
        >
          <CardBody className="card-body">
            {/* ICON */}
            <div className="editor">
              {" "}
              <i
                className={
                  props.account.site.logoClass !== "fa-question-circle"
                    ? "fab " + props.account.site.logoClass
                    : "fas " + props.account.site.logoClass
                }
              ></i>
            </div>

            <div className="editor-handle-name" style={{fontWeight: "bold"}}>{props.account.site.name}</div>
            <div className="editor-handle-name">@{props.account.userName}</div>
            <div className="editor-link">
              <a
                href={props.account.site.url.replace("{}", props.account.userName)}
                target="blank"
              >
                {props.account.site.prettyUrl ||
                  props.account.site.urlMain ||
                  props.account.site.url}
              </a>
            </div>

            {props.actionable && (
              <div className="test">
                <Button
                  onClick={(e) => {e.stopPropagation(); claimAccount(props.account);}}
                  className="claim-button"
                >
                  <i className="tim-icons icon-check-2" />
                </Button>
                &nbsp;
                <Button
                  onClick={(e) => {e.stopPropagation(); rejectAccount(props.account);}}
                  className="claim-button"
                >
                  <i className="tim-icons icon-simple-remove" />
                </Button>
              </div>
            )}
            {props.flippable && (
            <div className="flip-button">
              <IconButton onClick={(e) => {e.stopPropagation(); setFlipped(true)}}>
                <i className="tim-icons icon-refresh-01" style={{color: "#DDDDDD", transform: "scaleX(-1)"}}></i>
              </IconButton>
            </div>)}

          </CardBody>
        </Card>

        {props.flippable && (
        <Card
          className={'card-user site-card ' + (props.selected ? 'selected-site-card' : '')}
          onClick={handleClick}
        >
          <CardBody className="card-body">
            <h3>More on {props.account.site.name}...</h3>

            {/* TAGS (CATEGORIES) */}
            <div className="additional-info">
              TAGS - {tags}
              <br/>
            </div>

            {/* PRIVACY RATING FROM HIBP */}
            <div className="additional-info">
              PRIVACY RATING - {" "}
              <PrivacyBadge service={props.account.site.name}></PrivacyBadge>
              <br/>
            </div>

            {/* FIRST NAMES */}
            {firstNames.length !== 0 && props.showNames && (
              <div className="additional-info">
                FIRST NAME(S) FOUND - {firstNames}
                <br/>
              </div>
            )}

            {/* LAST NAMES */}
            {lastNames.length !== 0 && props.showNames && (
              <div className="additional-info">
                LAST NAME(S) FOUND - {lastNames}
                <br/>
              </div>
            )}

            {/* CONFIDENCE LEVEL */}
            {/* {!isUnregistered && (
              <div className="additional-info">
                Confidence Level: {props.account.confidence}
              </div>
            )} */}

            <div className="flip-button">
              <IconButton onClick={(e) => {e.stopPropagation(); setFlipped(false)}}>
                <i className="tim-icons icon-refresh-01" style={{color: "#DDDDDD", transform: "scaleX(-1)"}}></i>
              </IconButton>
            </div>
          </CardBody>
        </Card>
        )}
      </ReactCardFlip>
    </Col>
  );
};

AccountCard.defaultProps = {
  actionable: true,
  selectable: true,
  flippable: true,
  showNames: true,
  selected: false,
  onSelect: () => {},
  onDeselect: () => {},
  onPlzRemove: () => {},
}

/**
   * Claim account for the current user
   */
export const claimAccount = async (account, quiet) => {
  quiet = quiet !== undefined ? quiet : false;
  try {
    await account.claim();
    !quiet && alert("Account successfully claimed!");
    return true;
  } catch (e) {
    !quiet && alert("Account has already been claimed!");
    console.error(e);
    return false;
  }
};

/**
 * Reject account for current user (from current screen)
 */
export const rejectAccount = async (account, quiet) => {
  console.log(account);
  quiet = quiet !== undefined ? quiet : false;
  try {
    await account.reject();
    !quiet && alert("Account successfully rejected!");
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default AccountCard;
