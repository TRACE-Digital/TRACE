import React, { useState, useEffect } from 'react';
import Colors from "views/Colors.js";

// reactstrap components
import {
  Card,
  CardBody,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Row,
  Col,
} from "reactstrap";

var name = 'Isabel Battaglioli'

var tempData = [
  { 'title': 'Instagram', 'prettyUrl': 'www.instagram.com', 'profileUrl': 'www.instagram.com/userProfile', 'userName': '@INSTAGRAM HANDLE', 'iconClass': 'fab fa-instagram' },
  { 'title': 'Snapchat', 'prettyUrl': 'www.snapchat.com', 'profileUrl': 'www.snapchat.com/userProfile', 'userName': '@SNAPCHAT HANDLE', 'iconClass': 'fab fa-snapchat' },
  { 'title': 'Facebook', 'prettyUrl': 'www.facebook.com', 'profileUrl': 'www.facebook.com/userProfile', 'userName': '@FACEBOOK HANDLE', 'iconClass': 'fab fa-facebook-square' },
  { 'title': 'Vine', 'prettyUrl': 'www.vine.com', 'profileUrl': 'www.vine.com/userProfile', 'userName': '@VINE HANDLE', 'iconClass': 'fab fa-vine' },
  { 'title': 'Pinterest', 'prettyUrl': 'www.pinterest.com', 'profileUrl': 'www.pinterest.com/userProfile', 'userName': '@PINTEREST HANDLE', 'iconClass': 'fab fa-pinterest-square' },
  { 'title': 'Twitter', 'prettyUrl': 'www.twitter.com', 'profileUrl': 'www.twitter.com/userProfile', 'userName': '@TWITTER HANDLE', 'iconClass': 'fab fa-twitter-square' },
  { 'title': 'Skype', 'prettyUrl': 'www.skype.com', 'profileUrl': 'www.skype.com/userProfile', 'userName': '@SKYPE HANDLE', 'iconClass': 'fab fa-skype' },
  { 'title': 'Apple', 'prettyUrl': 'www.apple.com', 'profileUrl': 'www.apple.com/userProfile', 'userName': '@APPLE HANDLE', 'iconClass': 'fab fa-apple' },
];

function Editor() {

const [isOpen, setIsOpen] = useState(false);

const togglePopup = (e) => {
  if (e.target.className === "tim-icons icon-pencil icon"){
    setIsOpen(!isOpen);
  }
  else {
    setIsOpen(false);
  }
}

useEffect(() => {
 async function isLoggedIn () {
  if (!(localStorage.getItem('user'))) {
    window.location.href = '/#/login';
  }
 }
 isLoggedIn();
}, []);

  return (

    <>
    <div onClick={togglePopup} className={isOpen ? "content blur" : "content"}>

      <div className="editor-title">
        {name}<i class="tim-icons icon-pencil icon"></i>
      </div>
      <div>
        <Row>
          {tempData.map(site => (
            <Col lg="3">

              <Card className="card-user">
                <CardBody>
                  <div>

                  <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon dot"
                    color="link"
                    type="button"
                  >
                  <i class="fas fa-ellipsis-h"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-right">
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      REMOVE
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                    <div className = "editor"> <i className={site.iconClass}></i></div>
                    <div className = "editor-handle-name"> {site.userName}</div>
                    <div className = "editor-link"> {site.prettyUrl} </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
          <Col lg="3">
            <a id="new" href="#new">
              <Card className="card-user add-to-edit">
                  <CardBody>
                    <div className= "edit-text">
                    <span className="icon">
                      <i class="fas fa-plus"></i>
                    </span>
                    </div>
                  </CardBody>
                </Card>
            </a>
          </Col>
        </Row>
      </div>
    </div>
    <div className="content">{isOpen ?  <Colors/>  : null}  </div>
    </>
  );
}

export default Editor;
