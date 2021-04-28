import React, { useState, useEffect } from "react";
import Colors from "views/Colors.js";
import { ThirdPartyAccount, accounts, AccountType, ProfilePage, pages } from "trace-search";
import SiteCard from "components/SiteCard/SiteCard";
import { GridContextProvider, GridDropZone, GridItem, swap } from "react-grid-dnd";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { Auth, nav } from 'aws-amplify';
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
  NavbarToggler,
  ModalHeader,
} from "reactstrap";



const Editor = () => {

  /**
   * Initialize constants
   */
  const [claimedAccounts, setClaimedAccounts] = useState({});
  const [myProfile, setProfileData] = useState(null);
  const [title, setTitle] = useState("Enter Title");
  const [isOpen, setIsOpen] = useState(false);
  const [heightSize, setHeightSize] = useState("");
  const [, setPlsRender] = useState(false);
  const [hasPublished, setHasPublished] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [customUrl, setCustomUrl] = useState(null);
  const [colorScheme, setColorScheme] = useState([{
    "titleColor": "#FFFFFF",
    "backgroundColor": "#1E1D2A",
    "siteColor": "#26283A",
    "iconColor": "Default"
  }])

  /**
   * Function is called when there is a change on the site grid and updates the order
   */
  function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    const items = myProfile.accounts;
    const nextState = swap(items, sourceIndex, targetIndex);
    myProfile.accounts = nextState;
    saveData();
    setPlsRender(prev => !prev);
  }

  /**
   * Function saves the data to backend
   */
  async function saveData() {
    if (myProfile != null) {
      await myProfile.save();
    }
  }

  /**
   * Function handles any updating of the color choices from the popup and saves data
   */
  function handleLanguage(colorChoice) {
    const updated = [...colorChoice];
    setColorScheme([...updated]);
    myProfile.colorScheme.titleColor = colorScheme[0].titleColor;
    myProfile.colorScheme.backgroundColor = colorScheme[0].backgroundColor;
    myProfile.colorScheme.siteColor = colorScheme[0].siteColor;
    myProfile.colorScheme.iconColor = colorScheme[0].iconColor;
    console.log(myProfile.colorScheme.iconColor);
    saveData();
    setPlsRender(prev => !prev);

  }

  const updatePage = () => {
    saveData();
    setPlsRender(prev => !prev);
  }

  /**
   * Function called when the add button is clicked for a site
   */
  const handleAddClick = () => {
    setIsOpen(!isOpen);
    saveData();
  }

  /**
   * Function called when title is edited and saves
   */
  function updateTitle(e) {
    if (e.target.value == "") {
      setTitle("");
      myProfile.title = "";
    }
    else {
      setTitle(e.target.value);
      myProfile.title = e.target.value;
    }
    saveData();
    setPlsRender(prev => !prev);
  }

  /**
   * Monitors for user login before accessing profile page
   */
  useEffect(() => {
    async function isLoggedIn() {
      try {
        await Auth.currentUserPoolUser();
      }
      catch {
        window.location.href = '/login';
      }
    }
    isLoggedIn();
  }, []);

  /**
   * Monitors for user login before accessing profile page
   */
  useEffect(() => {
    async function isLoggedIn() {
      try {
        await Auth.currentUserPoolUser();
      }
      catch {
        window.location.href = '/login';
      }
    }
    isLoggedIn();
  }, []);

  /**
   * Queries CouchDB to see if the current user has a published page and
   * updates the value of hasPublished accordingly. If they do have a
   * public page, it also queries whether they have a password.
   */
   useEffect(() => {
     if (myProfile != null) {
      Auth.currentUserInfo().then( async (value) => {
        let url = 'https://public.tracedigital.tk/status?username='
          + value.attributes.sub;

        fetch(url, { method: 'GET' })
          .then(response => response.json())
          .then(data => {
            myProfile.hasPublished = (data.page_is_published == "yes");
            myProfile.hasPassword = (data.password_required == "yes");
            myProfile.customURL = String(data.customurl);
            myProfile.save();
          }).then(() => {
            setPlsRender(prev => !prev);
          });
      });
    }
  }, [myProfile]);

  /* Calls the API to publish the user's page */
  const publishPublicPage = (e) => {
    Auth.currentUserInfo().then(async (value) => {

      let url = 'https://public.tracedigital.tk/update?username=' + value.attributes.sub;
      let csslink = 'https://tracedigital.tk/static/css/main.2e0404d2.chunk.css';
      let fetchbody = '<!DOCTYPE html><html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet"><link href="'
        + csslink
        + '" rel="stylesheet"></head><body>'
        + renderToStaticMarkup(baseContent)
        + '</body></html>';

      let response = await fetch(url, {
        method: 'PUT',
        body: fetchbody
      });

      if (response.status > 202) {
        alert('Opps, something went wront! Please try again.')
      } else {
        alert("Your page has been published!");

        myProfile.hasPublished = true;
        await myProfile.save();
        setPlsRender(prev => !prev);
      }
    });
  }

  const unpublishPublicPage = (e) => {
    Auth.currentUserInfo().then(async (value) => {

      let url = 'https://public.tracedigital.tk/unpublish?username=' + value.attributes.sub;

      let response = await fetch(url, {
        method: 'GET'
      });

      if (response.status == 200) {
        alert("Your page has been unpublished!");
        myProfile.hasPublished = false;
        myProfile.hasPassword = false;
        await myProfile.save();
        setPlsRender(prev => !prev);
      } else {
        alert("Oops, something went wrong! Please try again.")
      }
    });
  }

  const goToPublicPage = (e) => {
    if (myProfile.hasPublished) {
      Auth.currentUserInfo().then((value) => {
        window.open('https://public.tracedigital.tk/get'
          + '?username='
          + value.attributes.sub, '_blank');
      });
    } else {
      alert('Please publish your page before navigating to it.')
    }
  }

  const addPublicPagePassword = (e) => {
    Auth.currentUserInfo().then( async (value) => {
      let newpassword = window.prompt("What do you want your new password to be?");

      if (newpassword != null) {
        let url = 'https://public.tracedigital.tk/createpassword?username='
          + value.attributes.sub
          + '&password=' + newpassword;
        fetch(url, {
          method: 'PUT'
        });

        alert('Your new password has been set!');

        myProfile.hasPassword = true;
        await myProfile.save();
        setPlsRender(prev => !prev);
      }
    });
  }

  const removePublicPagePassword = (e) => {
    Auth.currentUserInfo().then( async (value) => {
      let url = 'https://public.tracedigital.tk/removepassword?username='
        + value.attributes.sub;
      fetch(url, {
        method: 'DELETE'
      });

      alert('Your password has been removed!');

      myProfile.hasPassword = false;
      await myProfile.save();
      setPlsRender(prev => !prev);
    });
  }

  const addCustomURL = (e) => {
    if (myProfile.hasPublished) {
      Auth.currentUserInfo().then((value) => {
        let customurl = window.prompt("What do you want the last part of your new URL to be?");

        if (customurl != null) {
          let url = 'https://public.tracedigital.tk/custom/create?username='
            + value.attributes.sub
            + '&customurl='
            + customurl;

          fetch(url, {
            method: 'PUT'
          }).then(async (value) => {
            if (value.status == 401) {
              alert('Sorry, this URL is already taken. Please choose a new one.');
            } else if (value.status < 203) {
              alert('Your custom URL has been created!');
              alert('You can visit your page at https://public.tracedigital.tk/u/' + customurl);
              myProfile.hasCustomURL = true;
              myProfile.customURL = customurl;
              await myProfile.save;
              setPlsRender(prev => !prev);
            } else {
              alert('Oops, something went wrong! Please try again.')
            }
          });
        }
      });
    } else {
      alert("Please publish your page before customizing your URL.")
    }
  }

  const goToCustomUrl = (e) => {
    if (myProfile.hasPublished) {
      if (myProfile.customURL != null) {
        let url_ending = myProfile.customURL;
        window.open('https://public.tracedigital.tk/u/' + url_ending, '_blank');
      } else {
        alert('Please create a custom URL before navigating to it.');
      }
    } else {
      alert('Please publish your page before navigating to it.');
    }
  }

  const deleteCustomUrl = (e) => {
    if (myProfile.hasPublished) {
      if (myProfile.customURL != null) {
        let url_ending = myProfile.customURL;
        window.open('https://public.tracedigital.tk/u/' + url_ending, '_blank');
      } else {
        alert('Please create a custom URL before navigating to it.');
      }
    } else {
      alert('Please publish your page before navigating to it.');
    }
  }

  /**
   * Monitors for the profile page sites
   */
  useEffect(() => {

    const loadProfile = async () => {
      const results = await ProfilePage.loadAll();
      if (results.length === 0) {
        const page = new ProfilePage();
        results.push(page);
      }
      else {
        colorScheme[0].backgroundColor = results[0].colorScheme.backgroundColor;
        colorScheme[0].titleColor = results[0].colorScheme.titleColor;
        colorScheme[0].siteColor = results[0].colorScheme.siteColor;
        colorScheme[0].iconColor = results[0].colorScheme.iconColor;
        setTitle(results[0].title);
      }
      setProfileData(results[0]);
      setHeightSize(8); // temp for now
      // saveData();

    };
    loadProfile();

  }, [colorScheme]);

  let baseContent = (
    <>
    <div className={`editor-background`} style={{ backgroundColor: `${colorScheme[0].backgroundColor}` }}>
      <div className={"editor-title"} style={{ color: `${colorScheme[0].titleColor}` }}>
        <input
          className="editor-input"
          type="text"
          value={title}
          maxLength={30}
          onChange={updateTitle}
          style={{ color: `${colorScheme[0].titleColor}`, backgroundColor: `${colorScheme[0].backgroundColor}`, border: "none", outline: "none" }}
        />
      </div>
      <div>
        <Row>
      {myProfile &&
            myProfile.accounts.map(item => (
              <Col lg="3">
                <SiteCard editorColor={colorScheme[0].siteColor} account={item} page="editor" />
              </Col>
            ))}
            </Row>
            </div>
            </div>
      </>
  );

  let editorContent = (
    <>
      {isOpen ? <Colors onSelectLanguage={handleLanguage} closePopup={handleAddClick} onUpdatePage={updatePage} page={myProfile} /> : null}
      <div className={isOpen ? `content blur` : `content`}>
        <div className={`editor-background`} style={{ backgroundColor: `${colorScheme[0].backgroundColor}` }}>
          <div className={"editor-title"} style={{ color: `${colorScheme[0].titleColor}` }}>

            <input
              className="editor-input"
              type="text"
              value={title}
              maxLength={30}
              onChange={updateTitle}
              style={{width:"600px", color: `${colorScheme[0].titleColor}`, backgroundColor: `${colorScheme[0].backgroundColor}`, border: "none", outline: "none" }}
            />

          <Link style={{display: "inline-block", float: "right"}}
              className="btn btn-primary editor-button"
              color="primary"
              onClick={handleAddClick}
            >
              Edit Page
          </Link>

          <UncontrolledDropdown style={{display: "inline-block", float: "right"}}>
            <DropdownToggle className="btn btn-primary public-options-button">
              Page Options
            </DropdownToggle>
            <DropdownMenu className="dropdown-navbar" right tag="ul" style={{marginRight: "10px"}}>
              <NavLink tag="li">
                <DropdownItem className="nav-item" onClick={publishPublicPage} style={{color: "black"}}>Publish Page</DropdownItem>
              </NavLink>
              {((myProfile != null) && (myProfile.hasPublished)) && <div>
                <NavLink tag="li">
                  <DropdownItem className="nav-item" onClick={unpublishPublicPage} style={{color: "black"}}>Unpublish Page</DropdownItem>
                </NavLink>
                <DropdownItem divider tag="li" />
                <NavLink tag="li">
                  <DropdownItem className="nav-item" onClick={goToPublicPage} style={{color: "black"}}>Go To Page</DropdownItem>
                </NavLink>
                <DropdownItem divider tag="li" />
                {((myProfile == null) || (!myProfile.hasPassword)) &&
                  <NavLink tag="li"><DropdownItem className="nav-item" onClick={addPublicPagePassword} style={{color: "black"}}>Add Password</DropdownItem></NavLink>
                } {((myProfile != null) && (myProfile.hasPassword)) &&
                  <div>
                    <NavLink tag="li"><DropdownItem className="nav-item" onClick={addPublicPagePassword} style={{color: "black"}}>Change Password</DropdownItem></NavLink>
                    <NavLink tag="li"><DropdownItem className="nav-item" onClick={removePublicPagePassword} style={{color: "black"}}>Remove Password</DropdownItem></NavLink>
                  </div>
                }
                <DropdownItem divider tag="li" />
                { ((myProfile == null) || (myProfile.customURL == 'null')) &&
                <NavLink tag="li">
                  <DropdownItem className="nav-item" onClick={addCustomURL} style={{color: "black"}}>Customize URL</DropdownItem>
                </NavLink>
                } {((myProfile != null) && (myProfile.customURL != 'null')) &&
                  <div>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item" onClick={addCustomURL} style={{color: "black"}}>Edit Custom URL</DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item" onClick={goToCustomUrl} style={{color: "black"}}>Go To Custom URL</DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item" onClick={deleteCustomUrl} style={{color: "black"}}>Delete Custom URL</DropdownItem>
                    </NavLink>
                  </div>
                }
              </div>}
            </DropdownMenu>
          </UncontrolledDropdown>

          </div>
          {myProfile &&
            <GridContextProvider onChange={onChange}>
              <GridDropZone
                id="items"
                boxesPerRow={4}
                rowHeight={330}
                style={{ height: `${(heightSize / 3) * 330}px` }}>
                {myProfile.accounts.map(item => (
                  <GridItem className="boxes" key={item.id}>
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                      }}>
                      {<SiteCard editorColor={colorScheme[0].siteColor} iconColor={colorScheme[0].iconColor} account={item} page="editor" />}
                    </div>
                  </GridItem>
                ))}
              </GridDropZone>
            </GridContextProvider>}
        </div>
      </div>
        <div>
            <a href="http://www.facebook.com" target="_blank">
                <img src="https://facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png?w=512&h=512" alt="Facebook Logo" className="share-button" style={{width: "80px", marginLeft: "calc((110% - 440px)/2)"}}/>
            </a>
            <a href="http://www.twitter.com" target="_blank">
                <img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-512.png" alt="Twitter Logo" className="share-button" style={{width: "80px", marginLeft: "40px"}}/>
            </a>
            <a href="http://www.reddit.com" target="_blank">
                <img src="https://cdn3.iconfinder.com/data/icons/2018-social-media-logotypes/1000/2018_social_media_popular_app_logo_reddit-512.png" alt="Reddit Logo" className="share-button" style={{width: "80px", marginLeft: "40px"}}/>
            </a>
            <a href="http://www.linkedin.com" target="_blank">
                <img src="https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-linkedin-circle-512.png" alt="LinkedIn Logo" className="share-button" style={{width: "80px", marginLeft: "40px"}}/>
            </a>
        </div>
    </>
  );

  return editorContent;
};

export default Editor;
