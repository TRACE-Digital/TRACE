import React, { useState, useEffect } from 'react';
import Colors from "views/Colors.js";
import { Auth } from 'aws-amplify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
      "logoClass": "fa-apple",
      "tags": [
          "Developers"
      ],
      "name": "Apple",
      "prettyUrl": "www.apple.com"
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
      "logoClass": "fa-reddit",
      "tags": [
          "Developers"
      ],
      "name": "Reddit",
      "prettyUrl": "www.reddit.com"
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
      "logoClass": "fa-instagram",
      "tags": [
          "Developers"
      ],
      "name": "Instagram",
      "prettyUrl": "www.instagram.com"
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
]

function Editor() {


const [isOpen, setIsOpen] = useState(false);
const [characters, updateCharacters] = useState(tempData);
const [colorScheme, setColorScheme] = useState("Default");

function handleOnDragEnd(result) {
  if (!result.destination) return;
  console.log(characters)
  const items = Array.from(characters);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);
  updateCharacters(items);
}

const togglePopup = (e) => {
  if (e.target.className === "tim-icons icon-pencil icon"){
    setIsOpen(!isOpen);
  }

}

function handleLanguage(colorChoice){
  setColorScheme(colorChoice);
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
    {isOpen ?  <Colors onSelectLanguage={handleLanguage}/>  : null}
    <div onClick={togglePopup} className={isOpen ? `content blur ${colorScheme}` : `content ${colorScheme}`}>
      <div className={`editor-background ${colorScheme}`}>

      <div className={`editor-title ${colorScheme}`}>
        {name}<i className="tim-icons icon-pencil icon"></i>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
  
        <Droppable droppableId="characters">
          {(provided) => (

          <ul {...provided.droppableProps} ref={provided.innerRef} className ="editor-blocks">
              <Row>
              {characters.map((item, index) => {
                  
                  return (
                    <Col lg="3">
                    <Draggable key={item.site.name} draggableId={item.site.name} index={index}>
                      {(provided) => (
                        <li className = "idk" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            {<SiteCard account={item} page="editor"/>}
                        </li>
                      )}
                    </Draggable>
                    </Col>
                  );
                  
                })}
                
                {provided.placeholder}
                </Row>
          </ul>
  
          )}
        </Droppable>
      
      </DragDropContext>

      </div>
    </div>
    {/* <div className={isOpen ? `content blur ${colorScheme}` : `content ${colorScheme}`}  >{isOpen ?  <Colors onSelectLanguage={handleLanguage}/>  : null}  </div> */}
    </>
  );
}


export default Editor;
