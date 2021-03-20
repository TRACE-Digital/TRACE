import React, { useState, useEffect } from 'react';
import Colors from "views/Colors.js";
import { Auth } from 'aws-amplify';
import Draggable from 'react-draggable';


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
import SiteCard from 'components/SiteCard/SiteCard';

var name = 'Isabel Battaglioli'

// var tempData = [
//   { 'title': 'Instagram', 'prettyUrl': 'www.instagram.com', 'profileUrl': 'www.instagram.com/userProfile', 'userName': '@INSTAGRAM HANDLE', 'iconClass': 'fab fa-instagram' },
//   { 'title': 'Snapchat', 'prettyUrl': 'www.snapchat.com', 'profileUrl': 'www.snapchat.com/userProfile', 'userName': '@SNAPCHAT HANDLE', 'iconClass': 'fab fa-snapchat' },
//   { 'title': 'Facebook', 'prettyUrl': 'www.facebook.com', 'profileUrl': 'www.facebook.com/userProfile', 'userName': '@FACEBOOK HANDLE', 'iconClass': 'fab fa-facebook-square' },
//   { 'title': 'Vine', 'prettyUrl': 'www.vine.com', 'profileUrl': 'www.vine.com/userProfile', 'userName': '@VINE HANDLE', 'iconClass': 'fab fa-vine' },
//   { 'title': 'Pinterest', 'prettyUrl': 'www.pinterest.com', 'profileUrl': 'www.pinterest.com/userProfile', 'userName': '@PINTEREST HANDLE', 'iconClass': 'fab fa-pinterest-square' },
//   { 'title': 'Twitter', 'prettyUrl': 'www.twitter.com', 'profileUrl': 'www.twitter.com/userProfile', 'userName': '@TWITTER HANDLE', 'iconClass': 'fab fa-twitter-square' },
//   { 'title': 'Skype', 'prettyUrl': 'www.skype.com', 'profileUrl': 'www.skype.com/userProfile', 'userName': '@SKYPE HANDLE', 'iconClass': 'fab fa-skype' },
//   { 'title': 'Apple', 'prettyUrl': 'www.apple.com', 'profileUrl': 'www.apple.com/userProfile', 'userName': '@APPLE HANDLE', 'iconClass': 'fab fa-apple' },
// ];

const tempData = [{
  "rev": "1-d3d7cff6aa0db9bc04e98d43429f17f4",
  "createdAt": "2021-03-20T19:28:46.094Z",
  "site": {
      "errorMsg": "The specified profile could not be found",
      "errorType": "message",
      "url": "https://steamcommunity.com/id/{}",
      "urlMain": "https://steamcommunity.com/",
      "username_claimed": "blue",
      "username_unclaimed": "noonewouldeverusethis7",
      "logoClass": "fa-steam",
      "tags": [
          "Gaming"
      ],
      "name": "Steam",
      "prettyUrl": "steamcommunity.com"
  },
  "userName": "test",
  "id": "searchDef/2021-03-20T19:28:40.413Z/Search #1/search/2021-03-20T19:28:40.528Z/searchResult/account/Steam/test",
  "type": "Discovered",
  "matchedFirstNames": [],
  "matchedLastNames": [],
  "actionTaken": "None"
},
{
  "rev": "1-c2116aa47305b8918ec32c2e4a00477e",
  "createdAt": "2021-03-20T19:31:49.499Z",
  "site": {
      "errorType": "status_code",
      "regexCheck": "^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$",
      "url": "https://www.github.com/{}",
      "urlMain": "https://www.github.com/",
      "username_claimed": "blue",
      "username_unclaimed": "noonewouldeverusethis7",
      "logoClass": "fa-github",
      "tags": [
          "Developers"
      ],
      "name": "GitHub",
      "prettyUrl": "www.github.com"
  },
  "userName": "isabel",
  "id": "searchDef/2021-03-20T19:31:48.549Z/Search #1/search/2021-03-20T19:31:48.671Z/searchResult/account/GitHub/isabel",
  "type": "Discovered",
  "matchedFirstNames": [
      "isabel"
  ],
  "matchedLastNames": [],
  "actionTaken": "None"
},
{
  "rev": "1-c2116aa47305b8918ec32c2e4a00477e",
  "createdAt": "2021-03-20T19:31:49.499Z",
  "site": {
      "errorType": "status_code",
      "regexCheck": "^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$",
      "url": "https://www.github.com/{}",
      "urlMain": "https://www.github.com/",
      "username_claimed": "blue",
      "username_unclaimed": "noonewouldeverusethis7",
      "logoClass": "fa-github",
      "tags": [
          "Developers"
      ],
      "name": "GitHub",
      "prettyUrl": "www.github.com"
  },
  "userName": "isabel",
  "id": "searchDef/2021-03-20T19:31:48.549Z/Search #1/search/2021-03-20T19:31:48.671Z/searchResult/account/GitHub/isabel",
  "type": "Discovered",
  "matchedFirstNames": [
      "isabel"
  ],
  "matchedLastNames": [],
  "actionTaken": "None"
},
{
  "rev": "1-1b54ec9d4d09c027f875aa0167330ddd",
  "createdAt": "2021-03-20T19:32:48.069Z",
  "site": {
      "errorType": "status_code",
      "regexCheck": "^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$",
      "url": "https://www.github.com/{}",
      "urlMain": "https://www.github.com/",
      "username_claimed": "blue",
      "username_unclaimed": "noonewouldeverusethis7",
      "logoClass": "fa-github",
      "tags": [
          "Developers"
      ],
      "name": "GitHub",
      "prettyUrl": "www.github.com"
  },
  "userName": "cohenchris",
  "id": "searchDef/2021-03-20T19:32:47.126Z/Search #2/search/2021-03-20T19:32:47.235Z/searchResult/account/GitHub/cohenchris",
  "type": "Discovered",
  "matchedFirstNames": [
      "Chris"
  ],
  "matchedLastNames": [
      "Cohen"
  ],
  "actionTaken": "None"
},
{
  "rev": "1-1b54ec9d4d09c027f875aa0167330ddd",
  "createdAt": "2021-03-20T19:32:48.069Z",
  "site": {
      "errorType": "status_code",
      "regexCheck": "^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$",
      "url": "https://www.github.com/{}",
      "urlMain": "https://www.github.com/",
      "username_claimed": "blue",
      "username_unclaimed": "noonewouldeverusethis7",
      "logoClass": "fa-github",
      "tags": [
          "Developers"
      ],
      "name": "GitHub",
      "prettyUrl": "www.github.com"
  },
  "userName": "cohenchris",
  "id": "searchDef/2021-03-20T19:32:47.126Z/Search #2/search/2021-03-20T19:32:47.235Z/searchResult/account/GitHub/cohenchris",
  "type": "Discovered",
  "matchedFirstNames": [
      "Chris"
  ],
  "matchedLastNames": [
      "Cohen"
  ],
  "actionTaken": "None"
}
]

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
        {name}<i className="tim-icons icon-pencil icon"></i>
      </div>
      <div>
       
        <Row>
          

          {tempData.map(site => (
            <Draggable grid={[4, 14 ]}>
            {/* <Col lg="3"> */}
              <SiteCard account={site} page="editor" />
              {/* <Card className="card-user">
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
              </Card> */}
            {/* </Col> */}
            </Draggable>
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
