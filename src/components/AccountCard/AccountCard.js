import PrivacyBadge from "components/PrivacyBadge/PrivacyBadge";
import React, { useState } from "react";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import ReactCardFlip from "react-card-flip";
import { Multiselect } from 'multiselect-react-dropdown';
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
import { ManualAccount, tags } from 'trace-search';
// import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons";

/**
 * Displays a Card with information about the account passed in
 * @param props.account An Account object with relevant data for the account that it represents
 * @param props.page A string denoting one of three pages where this is used - "search", "dashboard", or "editor"
 * @returns
 */
const AccountCard = (props) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [flipped, setFlipped] = useState(false);

  const [siteName, setSiteName] = useState(props.account.site.name);
  const [userName, setUserName] = useState(props.account.userName);
  const [url, setUrl] = useState(props.account.url);
  const [accountTags, setAccountTags] = useState(props.account.site.tags);

  let firstNames = "";
  let lastNames = "";
  let options = [];

  if (props.account.matchedFirstNames) {
    firstNames = props.account.matchedFirstNames.join(", ");
  }
  if (props.account.matchedLastNames) {
    lastNames = props.account.matchedLastNames.join(", ");
  }
  if (tags) {
    for (var i = 0; i < tags.length; i++) {
      options.push({key: tags[i], id: i});
    }
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

  const handleSiteName = (e) => {
    setSiteName(e);
  }

  const handleUserName = (e) => {
    setUserName(e);
  }

  const handleUrl = (e) => {
    setUrl(e);
  }

  const handleSelect = (selectedList) => {
    setAccountTags(selectedList);
  }

  const handleRemove = (selectedList) => {
    setAccountTags(selectedList);
  }

  const handleSubmit = (e) => {
    // Save to database
    console.log(siteName);
    console.log(userName);
    console.log(url);
    console.log(accountTags);
  }

  return (
    <>
      {isEdit ?
        <Col lg="3" key={props.account.id}>
          <Card
            className={'card-user edit-card'}
            title={props.account.reason /* Display error for FailedAccounts */}
          >
            <CardBody className="card-body">

              <div className="edit-info">
                <Form>
                  <FormGroup>
                    <Label for="siteName">Site Name</Label>
                    <Input type="text" className="input" defaultValue={props.account.site.name} onChange={(e) => handleSiteName(`${e.target.value}`)}></Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input type="text" className="input" defaultValue={props.account.userName} onChange={(e) => handleUserName(`${e.target.value}`)}></Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="siteUrl">Site URL</Label>
                    <Input type="text" className="input" defaultValue={props.account.url} onChange={(e) => handleUrl(`${e.target.value}`)}></Input>
                  </FormGroup>
                  <Label for="tags">Tags</Label>
                  <Multiselect
                    options={tags} // Options to display in the dropdown
                    selectedValues={props.account.site.tags} // Preselected value to persist in dropdown
                    onSelect={handleSelect} // Function will trigger on select event
                    onRemove={handleRemove} // Function will trigger on remove event
                    displayValue="key" // Property name to display in the dropdown options
                    avoidHighlightFirstOption={true}
                    showCheckbox={true}
                    isObject={false}
                    style={{optionContainer: {background: "#27293d"}, option: {fontSize: 12}}}
                  />
                </Form>
              </div>

              <div className="save-button">
                <Button onClick={(e) => {
                  setIsEdit(false);
                  handleSubmit();
                }}>
                  Save
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>

        :

        // IF NOT EDIT
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
                        {props.account && (
                          <>
                            <DropdownItem divider tag="li" />
                            <DropdownItem onClick={
                              (e) => {
                                e.stopPropagation();
                                setIsEdit(true);
                              }
                            }>
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
                    className={
                      props.account.site.logoClass !== "fa-question-circle"
                        ? "fab " + props.account.site.logoClass
                        : "fas " + props.account.site.logoClass
                    }
                  ></i>
                </div>

                <div className="editor-handle-name" style={{ fontWeight: "bold" }}>{props.account.site.name}</div>
                <div className="editor-link">
                  <a href={props.account.url} target="blank">@{props.account.userName}</a>
                </div>

                {props.actionable && (
                  <div className="test">
                    <Button
                      onClick={(e) => { e.stopPropagation(); claimAccount(props.account); }}
                      className="claim-button"
                    >
                      <i className="tim-icons icon-check-2" />
                    </Button>
                  &nbsp;
                    <Button
                      onClick={(e) => { e.stopPropagation(); rejectAccount(props.account); }}
                      className="claim-button"
                    >
                      <i className="tim-icons icon-simple-remove" />
                    </Button>
                  </div>
                )}
                {props.flippable && (
                  <div className="flip-button">
                    <IconButton onClick={(e) => { e.stopPropagation(); setFlipped(true) }}>
                      <i className="tim-icons icon-refresh-01" style={{ color: "#DDDDDD", transform: "scaleX(-1)" }}></i>
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

                  {/* CONFIDENCE LEVEL */}
                  {props.account.confidence > 0 && (
                    <div className="additional-info">
                      Confidence Level: {props.account.confidence}
                    </div>
                  )}

                  {/* PRIVACY RATING */}
                  <div className="additional-info">
                    Privacy Rating - {" "}
                    <PrivacyBadge account={props.account} service={props.account.site.name}></PrivacyBadge>
                    <br />
                  </div>

                  {/* FIRST NAMES */}
                  {firstNames.length > 0 && props.showNames && (
                    <div className="additional-info">
                      First Name(s) Found  - {firstNames}
                      <br />
                    </div>
                  )}

                  {/* LAST NAMES */}
                  {lastNames.length > 0 && props.showNames && (
                    <div className="additional-info">
                      Last Name(s) Found - {lastNames}
                      <br />
                    </div>
                  )}

                  {/* TAGS (CATEGORIES) */}
                  <div className="additional-info">
                    Tags - {accountTags.join(", ")}
                    <br />
                  </div>

                  {/* ERROR FOR FAILED ACCOUNTS */}
                  {props.account.reason !== undefined && (
                    <div className="additional-info">
                      <br /><code>{props.account.reason}</code>
                    </div>
                  )}

                  <div className="flip-button">
                    <IconButton onClick={(e) => { e.stopPropagation(); setFlipped(false) }}>
                      <i className="tim-icons icon-refresh-01" style={{ color: "#DDDDDD", transform: "scaleX(-1)" }}></i>
                    </IconButton>
                  </div>
                </CardBody>
              </Card>
            )}
          </ReactCardFlip>
        </Col>
      }
    </>
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
