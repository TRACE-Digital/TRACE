import React from "react";
import { useState } from 'react';

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


function sayHello(e) {
  e.target.style.background = 'green';
}


function Editor() {
  return (
    
    <>
    <div className="content">

      <div className="editor-title">
        {name}
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
        </Row>
      </div>

    </div>
    

{/*        <Row>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-instagram"></i> </div>
              <div className = "editor-handle-name"> @INSTAGRAM HANDLE</div>
              <div className = "editor-link"> www.instagram.com </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-facebook-square"></i> </div>
              <div className = "editor-handle-name"> @FACEBOOK HANDLE</div>
              <div className = "editor-link"> www.facebook.com </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-snapchat"></i> </div>
              <div className = "editor-handle-name"> @SNAPCHAT HANDLE</div>
              <div className = "editor-link"> www.snapchat.com </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-twitter-square"></i> </div>
              <div className = "editor-handle-name"> @TWITTER HANDLE</div>
              <div className = "editor-link"> www.twitter.com </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-vine"></i> </div>
              <div className = "editor-handle-name"> @VINE HANDLE</div>
              <div className = "editor-link"> www.vine.com </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-pinterest-square"></i> </div>
              <div className = "editor-handle-name"> @PINTEREST HANDLE</div>
              <div className = "editor-link"> www.pinterest.com </div>
              </CardBody>
            </Card>
          </Col>
        </Row> */}
    {/*</div>*/}
  </>
  );
}

export default Editor;
