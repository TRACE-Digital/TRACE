import PrivacyBadge from "components/PrivacyBadge/PrivacyBadge";
import React, { useState } from "react";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import ReactCardFlip from "react-card-flip";
import { Multiselect } from 'multiselect-react-dropdown';
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
import { AutoSearchAccountAction, tags } from 'trace-search';
import fontAwesomeClasses from '../../assets/fonts/font-awesome.json';

/**
 * Displays a Card with information about the account passed in
 * @param props.account An Account object with relevant data for the account that it represents
 * @param props.page A string denoting one of three pages where this is used - "search", "dashboard", or "editor"
 * @returns
 */
const AccountCard = (props) => {
  const [isEdit, setIsEdit] = React.useState(false);
  // const [isTagEdit, setIsTagEdit] = React.useState(false);
  const [flipped, setFlipped] = useState(false);

  // const [siteName, setSiteName] = useState(props.account.site.name);
  // const [userName, setUserName] = useState(props.account.userName);
  const [url, setUrl] = useState(props.account.url);
  const [accountTags, setAccountTags] = useState(props.account.site.tags);
  const [logoClass, setLogoClass] = useState(props.account.site.logoClass);

  let logoKeyValue = Object.entries(fontAwesomeClasses).filter(([, value]) => value === props.account.site.logoClass)[0];
  let logoObj = logoKeyValue ? [{key: logoKeyValue[0], value: logoKeyValue[1]}] : [{key: "question", value: "fas fa-question fa-sm"}];
  let firstNames = "";
  let lastNames = "";
  let options = [];
  let logos = [];

  if (props.account.matchedFirstNames) {
    firstNames = props.account.matchedFirstNames.join(", ");
  }
  if (props.account.matchedLastNames) {
    lastNames = props.account.matchedLastNames.join(", ");
  }
  if (tags) {
    for (var i = 0; i < tags.length; i++) {
      options.push({ key: tags[i], id: i });
    }
  }
  if (fontAwesomeClasses) {
    for (const [key, value] of Object.entries(fontAwesomeClasses)) {
      logos.push({"key": key, "value": value});
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

  // const handleSiteName = (e) => {
  //   setSiteName(e);
  // }

  // const handleUserName = (e) => {
  //   setUserName(e);
  // }

  const handleUrl = (e) => {
    setUrl(e);
  }

  const handleTagSelect = (selectedList) => {
    setAccountTags(selectedList);
  }

  const handleTagRemove = (selectedList) => {
    setAccountTags(selectedList);
  }

  const handleLogoSelect = (selectedLogo) => {
    setLogoClass(selectedLogo[0].value);
  }

  const handleLogoRemove = () => {
    setLogoClass(props.account.site.logoClass);
  }

  async function handleSubmit(e) {
    props.account.site.url = url;
    props.account.site.tags = accountTags;
    props.account.site.logoClass = logoClass;
    props.account.site.logoColor = "white";
    await props.account.save();
  }

  const handleCancel = (e) => {
    // reset values
    console.log("cancel");
    setUrl(props.account.site.url);
    setAccountTags(props.account.site.tags);
    setLogoClass(props.account.site.logoClass);
    setIsEdit(false);
  }

  // async function handleTagSubmit(e) {
  //   console.log(accountTags);

  //   props.account.site.tags = accountTags;
  //   await props.account.save();
  // }

  return (
    <>
      {/* INFO EDIT */}
      {isEdit &&
        (<Col lg="3" key={props.account.id}>
          <Card
            className={'card-user edit-card'}
            title={props.account.reason /* Display error for FailedAccounts */}
          >
            <CardBody className="card-body">

            <IconButton onClick={handleCancel} className="cancel">
              <i className="tim-icons icon-simple-remove"></i>
            </IconButton>

              <div className="edit-info">
                <Form>
                  {/* {props.account instanceof ManualAccount && (
                  <>
                  <FormGroup>
                    <Label for="siteName">Site Name</Label>
                    <Input type="text" className="input" defaultValue={props.account.site.name} onChange={(e) => handleSiteName(`${e.target.value}`)}></Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input type="text" className="input" defaultValue={props.account.userName} onChange={(e) => handleUserName(`${e.target.value}`)}></Input>
                  </FormGroup>
                  </>
                  )} */}
                  <FormGroup>
                    <Label for="siteUrl">Site URL</Label>
                    <Input type="text" className="input" defaultValue={props.account.url} onChange={(e) => handleUrl(`${e.target.value}`)}></Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="tags">Tags (select multiple)</Label>
                    <Multiselect
                      options={tags} // Options to display in the dropdown
                      selectedValues={accountTags} // Preselected value to persist in dropdown
                      onSelect={handleTagSelect} // Function will trigger on select event
                      onRemove={handleTagRemove} // Function will trigger on remove event
                      displayValue="key" // Property name to display in the dropdown options
                      avoidHighlightFirstOption={true}
                      showCheckbox={true}
                      isObject={false}
                      closeIcon={"close"}
                      style={{ optionContainer: { background: "#27293d" }, option: { fontSize: 12 }, inputField: { color: "white" } }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="logos">Logos (select one)</Label>
                    {console.log(logos[0])}
                    <Multiselect
                      options={logos} // Options to display in the dropdown
                      selectedValues={logoObj}
                      onSelect={handleLogoSelect} // Function will trigger on select event
                      onRemove={handleLogoRemove} // Function will trigger on remove event
                      displayValue="key" // Property name to display in the dropdown options
                      avoidHighlightFirstOption={true}
                      showCheckbox={true}
                      selectionLimit={1}
                      closeIcon={"close"}
                      style={{ optionContainer: { background: "#27293d" }, searchBox: { color: "white" }, option: { fontSize: 12 }, inputField: { color: "white" } }}
                    />
                  </FormGroup>
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
        )}

      {/* NOT ON EDIT */}
      {!isEdit &&

        (<Col lg="3" key={props.account.id}>
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
                        {props.account && (
                          <>
                            <DropdownItem onClick={
                              (e) => {
                                e.stopPropagation();
                                setIsEdit(true);
                              }
                            }>
                              Edit
                          </DropdownItem>
                            <DropdownItem divider tag="li" />
                          </>
                        )}
                        <DropdownItem onClick={
                          async (e) => {
                            e.stopPropagation()
                            await props.account.remove();
                            // TODO: Trigger rerender
                          }
                        }>
                          Remove
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                )}

                {/* ICON */}
                <div className="editor">
                  {" "}
                  <i
                    className={props.account.site.logoClass || 'fas fa-question fa-sm'}
                    style={props.account.site.logoColor ? { color: props.account.site.logoColor } : null}
                  ></i>
                </div>

                <div className="editor-handle-name" style={{ fontWeight: "bold" }}>{props.account.site.name}</div>
                <div className="editor-link">
                  <a
                    href={props.account.url}
                    className="analytics-link"
                    data-site-name={props.account.site.name}
                    data-username={props.account.userName}
                    target="blank"
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

            {/* BACK OF CARD */}
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
                  <div className="tag-container">
                    {props.account.site.tags.map((tag) => {
                      return (
                        <div className="tags">
                          {tag}
                        </div>
                      );
                    })}
                  </div>
                  {/* <h5 className="tags">{props.account.site.tags}</h5> */}


                  {/* NAMES */}
                  <br />
                  <div className="additional-info">
                    {firstNames.length > 0 && props.showNames && (<p className="names">First Name(s): &nbsp; {firstNames}</p>)}
                    {lastNames.length > 0 && props.showNames && (<p className="names">Last Name(s): &nbsp; {lastNames}</p>)}
                  </div>
                  <br />

                  {/* ERROR FOR FAILED ACCOUNTS */}
                  {props.account.reason !== undefined && (
                    <div className="additional-info">
                      <br /><code>{props.account.reason}</code>
                    </div>
                  )}

                  {/* CONFIDENCE LEVEL */}
                  <br />

                  <div className="card-back-bottom">
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
                  </div>

                </CardBody>
              </Card>
            )}
          </ReactCardFlip>
        </Col>
        )}
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
