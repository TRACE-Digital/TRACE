import React, { useState, useEffect, useRef } from "react";
import Colors from "views/Colors.js";
import { ProfilePage, ThirdPartyAccount } from "trace-search";
import SiteCard from "components/SiteCard/SiteCard";
import classNames from "classnames";
import { GridContextProvider, GridDropZone, GridItem, swap } from "react-grid-dnd";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Link } from "react-router-dom";

import { Button, ButtonGroup } from "reactstrap";
import { Auth, nav } from 'aws-amplify';
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Col,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavLink,
  Row,
} from "reactstrap";

import NotificationAlert from "react-notification-alert";


const Editor = () => {
  const notificationAlertRef = useRef(null);
  const toast = (message, type) => {
    var options = {};
    options = {
      place: "bc",
      message: (<span>{message}</span>),
      type: type,
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  }

  /**
   * Initialize constants
   */
  const [myProfile, setProfileData] = useState(null);
  const [title, setTitle] = useState("Enter Title");
  const [isOpen, setIsOpen] = useState(false);
  const [heightSize, setHeightSize] = useState("");
  const [, setPlsRender] = useState(false);
  const [showBlockTheme, setBlockFeature] = useState(true); // SET TO WHATEVER THEY SET IT AS PREVIOUSLY
  const [showListTheme, setListFeature] = useState(false);
  const [titleLength, setTitleLength] = useState(title.length+1);
  const [hasPublished, setHasPublished] = useState(false);
  const [backgroundColor, setBackGroundColor] = useState("#1E1D2A");
  const [iconColor, setIconColor] = useState("Default");
  const [siteColor, setSiteColor] = useState("#26283A");
  const [titleColor, setTitleColor] = useState("#FFFFFF");


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

  function handleBlock(){
    setBlockFeature(true);
    myProfile.layoutType = "block";
    saveData();
    setPlsRender(prev => !prev);
  }

  function handleList(){
    setBlockFeature(false);
    myProfile.layoutType = "list";
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
    saveData();
    setBackGroundColor(myProfile.colorScheme.backgroundColor);
    setIconColor(myProfile.colorScheme.iconColor);
    setSiteColor(myProfile.colorScheme.siteColor);
    setTitleColor(myProfile.colorScheme.titleColor);
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
    setPlsRender(prev => !prev);
  }

  /**
   * Function called when title is edited and saves
   */
  function updateTitle(e) {
    if (e.target.value === "") {
      setTitle("");
      setTitleLength(2);
      myProfile.title = "";
    }
    else {
      if ((e.target.value.length+1) < 24){
        setTitleLength(e.target.value.length+1);
      }
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
   * TODO: This should be removed once sync is reliable
   *
   * Queries CouchDB to see if the current user has a published page and
   * updates the value of published accordingly. If they do have a
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
            myProfile.published = (data.page_is_published === "yes");
            myProfile.hasPassword = (data.password_required === "yes");
            myProfile.customPath = String(data.customurl);
            myProfile.save();
          }).then(() => {
            setPlsRender(prev => !prev);
          });
      });
    }
  }, [myProfile]);

  /* Calls the API to publish the user's page */
  const publishPublicPage = (e, quiet = false) => {
    Auth.currentUserInfo().then(async (value) => {

      const matomoPageUrl = `https://public.tracedigital.tk/a-${value.attributes.sub}`;
      const matomoIngestUrl = new URL('https://data.tracedigital.tk');
      matomoIngestUrl.searchParams.set('idsite', myProfile.matomoSiteId || 1);
      matomoIngestUrl.searchParams.set('action_name', 'view');
      matomoIngestUrl.searchParams.set('url', matomoPageUrl);
      matomoIngestUrl.searchParams.set('apiv', '1');
      matomoIngestUrl.searchParams.set('rec', '1');

      const matomoSiteTemplate = new URL(matomoIngestUrl.toString());
      matomoSiteTemplate.searchParams.set('action_name', 'click');
      matomoSiteTemplate.searchParams.set('url', `${matomoSiteTemplate.searchParams.get('url', matomoPageUrl)}/SITE_NAME/USER_NAME`);

      let url = 'https://public.tracedigital.tk/update?username=' + value.attributes.sub;
      let csslink = 'https://tracedigital.tk/static/css/main.2e0404d2.chunk.css';
      let fetchbody = `
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
  <link href="${csslink}" rel="stylesheet">
  <link rel="icon" type="image/png" href="https://tracedigital.tk/favicon.png">
  <title>${myProfile.title.replace('</title>', '')}</title>
</head>
<body style='background-color: ${backgroundColor}; padding: 10px;'}>
  ${renderBaseContent()}
  <script src="https://unpkg.com/axios@0.21.1/dist/axios.min.js" async></script>
  <script>
    /**
     * Check if the DNT flag is set in the user's browser.
     *
     * Based on https://github.com/VarunBatraIT/is-doNotTrack/blob/918eb0a3ad295774867c4aea3d3d3672ed7e47a7/src/index.ts
     */
    function doNotTrackEnabled() {
        if (
            window.doNotTrack ||
            navigator.doNotTrack ||
            navigator.msDoNotTrack ||
            'msTrackingProtectionEnabled' in window.external
        ) {
            if (
                window.doNotTrack === '1' ||
                window.navigator.doNotTrack === 'yes' ||
                window.navigator.doNotTrack === '1' ||
                window.navigator.msDoNotTrack === '1' ||
                (
                    'msTrackingProtectionEnabled' in window.external &&
                    window.external.msTrackingProtectionEnabled()
                )
            ) {
                return true;
            }
        }
        return false;
    }

    const dnt = doNotTrackEnabled();

    console.log('Script loaded!');
    console.log('DNT: ' + doNotTrackEnabled());

    // Ignore DNT so we have data for the demo
    const isDemo = new Date() < new Date("2021-05-01");
    if (dnt && isDemo) {
      console.log('Ignoring DNT for demonstration');
    }

    if (isDemo || !dnt) {
      setTimeout(function() {
        axios.get('${matomoIngestUrl.toString()}&rand=' + Math.random().toString(36).substr(2))
        .then(function(resp) {
          console.log('Recorded page visit');
          console.log(resp);
        })
        .catch(function(e) {
          console.error(e);
        });
      }, 2000);

      const links = document.getElementsByClassName('analytics-link');
      for (let i = 0; i < links.length; i++) {
        const elem = links.item(i);
        const siteName = elem.getAttribute('data-site-name');
        const userName = elem.getAttribute('data-username');

        const apiUrl = '${matomoSiteTemplate.toString()}'.replace('SITE_NAME', siteName).replace('USER_NAME', userName);

        elem.addEventListener('click', function() {
          axios.get(apiUrl + '&rand=' + Math.random().toString(36).substr(2))
          .then(function(resp) {
            console.log('Recorded link click for ' + siteName + '/' + userName);
            console.log(resp);
          })
          .catch(function(e) {
            console.error(e);
          });
        });
      }
    } else {
      console.log('Honoring DNT. No TRACE analytics data recorded');
    }
  </script>
</body>
</html>
`;

    // const preview = window.open('', `Preview - ${myProfile.title}`);
    // preview.document.write(fetchbody);

      let response = await fetch(url, {
        method: 'PUT',
        body: fetchbody
      });

      if (response.status > 202) {
        const message = 'Oops, something went wrong! Please try again.';

        if (quiet) {
          console.warn(message);
        } else {
          toast(message, "warning")
        }
      } else {
        myProfile.published = true;
        await myProfile.save();
        setPlsRender(prev => !prev);

        const message = "Profile page published!";
        if (quiet) {
          console.log(message);
        } else {
          toast(message, "success")
        }
      }
    });
  }

  const unpublishPublicPage = (e) => {
    Auth.currentUserInfo().then(async (value) => {

      let url = 'https://public.tracedigital.tk/unpublish?username=' + value.attributes.sub;

      let response = await fetch(url, {
        method: 'GET'
      });

      if (response.status === 200) {
        toast("Your page has been unpublished!", "info");
        myProfile.published = false;
        myProfile.hasPassword = false;
        await myProfile.save();
        setPlsRender(prev => !prev);
      } else {
        toast("Oops, something went wrong! Please try again.", "danger")
      }
    });
  }

  const goToPublicPage = (e) => {
    if (myProfile.published) {
      Auth.currentUserInfo().then((value) => {
        window.open('https://public.tracedigital.tk/get'
          + '?username='
          + value.attributes.sub, '_blank');
      });
    } else {
      toast('Please publish your page before navigating to it.', "warning")
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

        toast('Your new password has been set!', "success");

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

      toast('Your password has been removed!', "success");

      myProfile.hasPassword = false;
      await myProfile.save();
      setPlsRender(prev => !prev);
    });
  }

  const addCustomURL = (e) => {
    if (myProfile.published) {
      Auth.currentUserInfo().then((value) => {
        let customurl = window.prompt("What do you want the last part of your new URL to be?");

        if (customurl !== null) {
          let url = 'https://public.tracedigital.tk/custom/create?username='
            + value.attributes.sub
            + '&customurl='
            + customurl;

          fetch(url, {
            method: 'PUT'
          }).then(async (value) => {
            if (value.status === 401) {
              toast('Sorry, this URL is already taken. Please choose a new one.', "warning");
            } else if (value.status < 203) {
              toast('Your custom URL has been created!', "success");
              toast('You can visit your page at https://public.tracedigital.tk/u/' + customurl, "info");
              myProfile.customPath = customurl;
              await myProfile.save();
              setPlsRender(prev => !prev);
            } else {
              toast('Oops, something went wrong! Please try again.', "danger")
            }
          });
        }
      });
    } else {
      toast("Please publish your page before customizing your URL.", "warning")
    }
  }

  const goToCustomUrl = (e) => {
    if (myProfile.published) {
      if (myProfile.hasCustomPath) {
        let url_ending = myProfile.customPath;
        window.open('https://public.tracedigital.tk/u/' + url_ending, '_blank');
      } else {
        toast('Please create a custom URL before navigating to it.', "warning");
      }
    } else {
      toast('Please publish your page before navigating to it.', "warning");
    }
  }

  const deleteCustomUrl = (e) => {
    Auth.currentUserInfo().then(async (value) => {
      let url = 'https://76gjqug5j8.execute-api.us-east-2.amazonaws.com/prod/custom/delete?username=' + value.attributes.sub;

      let response = await fetch(url, {
        method: 'DELETE'
      });

      if (response.status === 200) {
        toast('Your custom URL has been deleted!', "success");
        myProfile.customPath = 'null';

        await myProfile.save();
        setPlsRender(prev => !prev);
      } else {
        toast("Oops, something went wrong! Please try again.", "danger")
      }
    });
  }

  /**
   * Monitors for the profile page sites
   */
  useEffect(() => {
    const triggerRender = () => {
      setPlsRender(prev => !prev);
    }

    const loadProfile = async () => {
      const results = await ProfilePage.loadAll();
      if (results.length === 0) {
        const page = new ProfilePage();
        results.push(page);
      }
      else {
        setBackGroundColor(results[0].colorScheme.backgroundColor);
        setIconColor(results[0].colorScheme.iconColor);
        setSiteColor(results[0].colorScheme.siteColor);
        setTitleColor(results[0].colorScheme.titleColor);
        setTitle(results[0].title);
      }
      setProfileData(results[0]);
      setHeightSize(results[0].accounts.length); 
      
      if (results[0].layoutType == undefined){
        results[0].layoutType = "block";
        setBlockFeature(true);
      }
      else if (results[0].layoutType == "block"){
        setBlockFeature(true);
      }
      else{
        setBlockFeature(false);
      }

      setHeightSize(8); // temp for now
      // saveData();
    };

    loadProfile();
    ThirdPartyAccount.accountCache.events.on('change', triggerRender)
    return () => { ThirdPartyAccount.accountCache.events.removeListener('change', triggerRender) }
  }, []);

  /** Monitor for removed accounts. TODO: This is not ideal since we're doing it every render. */
  useEffect(() => {
    if (!myProfile) {
      return;
    }

    console.debug(`Checking profile page for deleted accounts`);

    let accountRemoved = false;
    for (const account of myProfile.accounts) {
      if (!ThirdPartyAccount.accountCache.has(account.id)) {
        myProfile.removeAccount(account.id);
        accountRemoved = true;
      }
    }

    if (accountRemoved) {
      if (myProfile.published) {
        console.log(`Republishing ${myProfile.title}`)
        publishPublicPage(null, true);
      }
    }
  });

  /** Make this a function so that publish always sees the latest changes without needing a re-render. */
  const renderBaseContent = () => {
    if (myProfile && !showBlockTheme) {
      return renderToStaticMarkup(
        <>
          <div className={`editor-background`} style={{ backgroundColor: `${backgroundColor}` }}>
            <div className={"editor-title"} style={{ color: `${titleColor}`, justifyContent: 'center', textAlign: 'center' }}>
              <h1 style={{ paddingTop: '20px' }}>{title}</h1>
            </div>
            {myProfile.accounts.map(item => (
              <div className="siteTd" style={{ backgroundColor: `${siteColor}`, border:`${siteColor}`, "justify-content":"center", "max-width": "550px", "border-radius": "15px", "margin-left": "calc(50% - 250px)" }}>    
                <Row style={{ "white-space":"nowrap","margin-right":"10px", "margin-top":"20px" }}>
                  <Col className="colors" lg="8" style={{display:"inline-block","text-align": "right", "max-width":"120px"}}>
                    <div className="colorsListView">
                    <i className={item.site.logoClass}
                        style={{"font-size":"50px", "margin-left":"40px", color: (iconColor === "Default") ? item.site.logoColor || null : iconColor}}
                    ></i>
                    </div>
                  </Col>
                  <Col lg="8" style={{display:"inline-block","margin-top":"10px", "font-weight":"600", "text-align": "left", "margin-right":"40px"}}>
                    <div style={{display:"inline-block","font-size":"20px"}}>{item.site.name}:</div>
                    <div style={{display:"inline-block","margin-left":"5px","font-size":"20px", "font-weight":"400"}}>
                      <a href={item.site.url.replace("{}", item.userName)} target="blank" >
                        {item.site.prettyUrl ||
                        item.site.urlMain ||
                        item.site.url}
                      </a>
                    </div>
                  </Col>     
                </Row>
              </div>
            ))}
          </div>
        </>
      );
    } else {
      return renderToStaticMarkup(
        <>
        <div className={`editor-background`} style={{ backgroundColor: `${backgroundColor}` }}>
          <div className={"editor-title"} style={{ color: `${titleColor}` }}>
            <h1 style={{ paddingTop: '20px' }}>{title}</h1>
          </div>
          <div>
            <Row>
              {myProfile &&
                myProfile.accounts.map(item => (
                  <Col lg="3">
                    <SiteCard editorColor={siteColor} iconColor={iconColor} account={item} page="editor" />
                  </Col>
                ))}
            </Row>
          </div>
          </div>
        </>
      );
    }
  }

  let editorContent = (
    <>
      <div className="react-notification-alert-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      {isOpen ? <Colors onSelectLanguage={handleLanguage} closePopup={handleAddClick} onUpdatePage={updatePage} page={myProfile} /> : null}
      <div className={isOpen ? `content blur` : `content`}>
        <div className={`editor-background`} style={{ backgroundColor: `${backgroundColor}` }}>
          <div className={"editor-title"} style={{ color: `${titleColor}` }}>
          <table style={{width: "100%"}}>
            <tr>
                <td>
                  <input
                    className="editor-input"
                    type="text"
                    value={title}
                    maxLength={titleLength}
                    onChange={updateTitle}
                    style={{width:"100%", color: `${titleColor}`, backgroundColor: `${backgroundColor}`, border: "none", outline: "none" }}
                  />
                  </td>
                  <td>
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
                          {myProfile && myProfile.published && <div>
                            <NavLink tag="li">
                              <DropdownItem className="nav-item" onClick={unpublishPublicPage} style={{color: "black"}}>Unpublish Page</DropdownItem>
                            </NavLink>
                            <DropdownItem divider tag="li" />
                            <NavLink tag="li">
                              <DropdownItem className="nav-item" onClick={goToPublicPage} style={{color: "black"}}>Go To Page</DropdownItem>
                            </NavLink>
                            <DropdownItem divider tag="li" />
                            {myProfile && !myProfile.hasPassword &&
                              <NavLink tag="li"><DropdownItem className="nav-item" onClick={addPublicPagePassword} style={{color: "black"}}>Add Password</DropdownItem></NavLink>
                            } {myProfile && myProfile.hasPassword &&
                              <div>
                                <NavLink tag="li"><DropdownItem className="nav-item" onClick={addPublicPagePassword} style={{color: "black"}}>Change Password</DropdownItem></NavLink>
                                <NavLink tag="li"><DropdownItem className="nav-item" onClick={removePublicPagePassword} style={{color: "black"}}>Remove Password</DropdownItem></NavLink>
                              </div>
                            }
                            <DropdownItem divider tag="li" />
                            {myProfile && (myProfile.customPath == 'null') &&
                            <NavLink tag="li">
                              <DropdownItem className="nav-item" onClick={addCustomURL} style={{color: "black"}}>Customize URL</DropdownItem>
                            </NavLink>
                            } {myProfile && (myProfile.customPath != 'null') &&
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
                </td>
                <td>
                          <ButtonGroup
                          
                              className="btn-group-toggle"
                              data-toggle="buttons"
                          >
                              <Button
                                  tag="label"
                                  className={classNames("btn btn-primary")}
                                  color="info"
                                  id="0"
                                  onClick={handleList}
                                  style={{height:"auto", "padding-top": "10px", "padding-bottom": "10px"}}
                                  size="sm"
                                  
                              >
                                  <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                      List View
                                  </span>
                                  <span className="d-block d-sm-none">
                                      <i className="tim-icons icon-single-02" />
                                  </span>
                              </Button>
                              <Button
                                  color="info"
                                  id="1"
                                  style={{height:"auto", "padding-top": "10px", "padding-bottom": "10px"}}
                                  size="sm"
                                  tag="label"
                                  onClick={handleBlock}
                                  className={classNames("btn btn-primary")}
                              >
                                  <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                      Block View
                                  </span>
                                  <span className="d-block d-sm-none">
                                      <i className="tim-icons icon-gift-2" />
                                  </span>
                              </Button>
                          </ButtonGroup>
       
                    </td>
            </tr>
          </table>
          </div>
          {myProfile &&
            (showBlockTheme ? 
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
                      {<SiteCard editorColor={siteColor} iconColor={iconColor} account={item} page="editor" />}
                    </div>
                  </GridItem>
                ))}
              </GridDropZone>
            </GridContextProvider>
            : 

            <GridContextProvider onChange={onChange}>
             
                <GridDropZone
                  id="items"
                  boxesPerRow={1}
                  rowHeight={90}
                  style={{"margin-top":"20px","user-select":"none", height: `${(heightSize / 3) * 270}px`, display:"flex", "justify-content":"center"}}>
                    
                    {myProfile.accounts.map(item => (
                      <GridItem style={{"width":"auto"}} key={item.id}>
                   
                          <div className="siteTd" style={{ backgroundColor: `${siteColor}`, border:`${siteColor}` }}>
                         
                          <Row style={{ "white-space":"nowrap","margin-right":"10px"}}>
                            
                            <Col className="colors" lg="8" style={{display:"inline-block","text-align": "right", "max-width":"120px"}}>
                              <div className="colorsListView">
                              <i className={item.site.logoClass}
                                 style={{"font-size":"50px", "margin-left":"40px", color: (iconColor === "Default") ? item.site.logoColor || null : iconColor}}
                              ></i>
                              </div>
                            </Col>
                            <Col lg="8" style={{display:"inline-block","margin-top":"10px", "font-weight":"600", "text-align": "left", "margin-right":"40px"}}>
                            
                              <div style={{display:"inline-block","font-size":"20px"}}>{item.site.name}:</div>
                              <div style={{display:"inline-block","margin-left":"5px","font-size":"20px", "font-weight":"400"}}>

                                <a href={item.site.url.replace("{}", item.userName)} target="blank" >
                                  {item.site.prettyUrl ||
                                  item.site.urlMain ||
                                  item.site.url}
                                </a>

                              </div>
                            </Col>     

                         </Row>
                        </div>

                 
                    </GridItem>
                  ))}
                </GridDropZone>
             
              </GridContextProvider>
   
            )}
        </div>
      </div>
    </>
  );

  return editorContent;
};

export default Editor;
