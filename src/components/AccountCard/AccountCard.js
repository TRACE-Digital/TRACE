import PrivacyBadge from "components/PrivacyBadge/PrivacyBadge";
import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import ConfidenceMeter from "./ConfidenceMeter"
import {
  Card,
  CardBody,
  Button,
  Col,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import { IconButton } from "@material-ui/core";
import { AutoSearchAccountAction, ManualAccount } from 'trace-search';

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
          title={props.account.reason /* Display error for FailedAccounts */}
        >
          <CardBody className="card-body">

            {props.showTripleDot && (
              <div className="dashboard-parent">
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon dot"
                    color="link"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fas fa-ellipsis-h"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-right">
                    <DropdownItem onClick={
                      async (e) => {
                        e.stopPropagation()
                        await props.account.remove();
                        // TODO: Trigger rerender
                      }
                    }>
                      Remove
                  </DropdownItem>
                    {props.account instanceof ManualAccount && (
                      <>
                        <DropdownItem divider tag="li" />
                        <DropdownItem onClick={(e) => e.stopPropagation()}>
                          Edit
                    </DropdownItem>
                      </>
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            )}


            {/* ICON */}
            <div className="editor">
              {" "}
              <i
                className={props.account.site.logoClass}
                style={props.account.site.logoColor ? { color: props.account.site.logoColor } : null}
              ></i>
            </div>

            <div className="editor-handle-name" style={{ fontWeight: "bold" }}>{props.account.site.name}</div>
            <div className="editor-link">
              <a
                href={props.account.url}
                target="blank"
                className="analytics-link"
                data-site-name={props.account.site.name}
                data-username={props.account.userName}
              >
                @{props.account.userName}
              </a>
            </div>

            {props.actionable && (
              <div className="test">
                <Button
                  onClick={(e) => { e.stopPropagation(); claimAccount(props.account); }}
                  className={props.account.actionTaken === AutoSearchAccountAction.CLAIMED ? "claim-button btn-success" : "claim-button"}
                >
                  <i className="tim-icons icon-check-2" />
                </Button>
                &nbsp;
                <Button
                  onClick={(e) => { e.stopPropagation(); rejectAccount(props.account); }}
                  className={props.account.actionTaken === AutoSearchAccountAction.REJECTED ? "claim-button btn-danger" : "claim-button"}
                >
                  <i className="tim-icons icon-simple-remove" />
                </Button>
              </div>
            )}
            {props.flippable && (
              <div className="flip-button">
                <IconButton onClick={(e) => { e.stopPropagation(); setFlipped(true) }}>
                <i className="tim-icons icon-refresh-01" style={{ color: "#DDDDDD", transform: "scale(0.75) scaleX(-1)" }}></i>
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
              <h3>{props.account.site.name}</h3>
              <div className="privacyBadge" >
                <PrivacyBadge account={props.account} service={props.account.site.name} />
              </div>
              <h5 className="tags">{tags}</h5>


              {/* NAMES */}
              <br/>
              <div className="additional-info">
                {firstNames.length > 0 && props.showNames && (<p className="names">First Name(s): &nbsp; {firstNames}</p>)}
                {lastNames.length > 0 && props.showNames && (<p className="names">Last Name(s): &nbsp; {lastNames}</p>)}
              </div>
              <br/>

              {/* ERROR FOR FAILED ACCOUNTS */}
              {props.account.reason !== undefined && (
                <div className="additional-info">
                  <br /><code>{props.account.reason}</code>
                </div>
              )}

              {/* CONFIDENCE LEVEL */}
              <br />
              {props.account.confidence > 0 && (
                <div className="confidence">
                  CONFIDENCE
                  <ConfidenceMeter confidence={props.account.confidence} />
                </div>
              )}

              <div className="flip-button">
                <IconButton onClick={(e) => { e.stopPropagation(); setFlipped(false) }}>
                <i className="tim-icons icon-refresh-01" style={{ color: "#DDDDDD", transform: "scale(0.75) scaleX(-1)" }}></i>
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
  showTripleDot: true,
  selected: false,
  onSelect: () => { },
  onDeselect: () => { },
}

/**
   * Claim account for the current user
   */
export const claimAccount = async (account, quiet) => {
  quiet = quiet !== undefined ? quiet : false;
  try {
    await account.claim();
    // !quiet && alert("Account successfully claimed!");
    return true;
  } catch (e) {
    // !quiet && alert("Account has already been claimed!");
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
    // !quiet && alert("Account successfully rejected!");
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default AccountCard;
