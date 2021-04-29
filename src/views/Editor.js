import React, { useState, useEffect } from "react";
import Colors from "views/Colors.js";
import { ProfilePage, ThirdPartyAccount } from "trace-search";
import SiteCard from "components/SiteCard/SiteCard";
import { GridContextProvider, GridDropZone, GridItem, swap } from "react-grid-dnd";
import { Link } from "react-router-dom";
import { Auth } from 'aws-amplify';
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



const Editor = () => {

  /**
   * Initialize constants
   */
  const [myProfile, setProfileData] = useState(null);
  const [title, setTitle] = useState("Enter Title");
  const [isOpen, setIsOpen] = useState(false);
  const [heightSize, setHeightSize] = useState("");
  const [, setPlsRender] = useState(false);
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
    if (e.target.value === "") {
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
            console.log(`customPath before status: ${myProfile.customPath}`);
            console.log(myProfile);
            myProfile.published = (data.page_is_published === "yes");
            myProfile.hasPassword = (data.password_required === "yes");
            myProfile.customPath = String(data.customurl);
            console.log(`customPath from status: ${myProfile.customPath}`);
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
<body>
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

      const tellEm = quiet ? console.warn : alert;
      if (response.status > 202) {
        tellEm('Oops, something went wrong! Please try again.')
      } else {
        myProfile.published = true;
        await myProfile.save();
        setPlsRender(prev => !prev);

        tellEm("Your page has been published!");
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
        alert("Your page has been unpublished!");
        myProfile.published = false;
        myProfile.hasPassword = false;
        await myProfile.save();
        setPlsRender(prev => !prev);
      } else {
        alert("Oops, something went wrong! Please try again.")
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
              alert('Sorry, this URL is already taken. Please choose a new one.');
            } else if (value.status < 203) {
              alert('Your custom URL has been created!');
              alert('You can visit your page at https://public.tracedigital.tk/u/' + customurl);
              myProfile.customPath = customurl;
              await myProfile.save();
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
    if (myProfile.published) {
      if (myProfile.hasCustomPath) {
        let url_ending = myProfile.customPath;
        window.open('https://public.tracedigital.tk/u/' + url_ending, '_blank');
      } else {
        alert('Please create a custom URL before navigating to it.');
      }
    } else {
      alert('Please publish your page before navigating to it.');
    }
  }

  const deleteCustomUrl = (e) => {
    Auth.currentUserInfo().then(async (value) => {
      let url = 'https://76gjqug5j8.execute-api.us-east-2.amazonaws.com/prod/custom/delete?username=' + value.attributes.sub;

      let response = await fetch(url, {
        method: 'DELETE'
      });

      if (response.status === 200) {
        alert("Your custom URL has been deleted!");
        myProfile.customPath = null;
        await myProfile.save();
        setPlsRender(prev => !prev);
      } else {
        alert("Oops, something went wrong! Please try again.")
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

    ThirdPartyAccount.accountCache.events.on('change', triggerRender)
    return () => { ThirdPartyAccount.accountCache.events.removeListener('change', triggerRender) }
  }, [colorScheme]);

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
    return renderToStaticMarkup(
      <>
      <div className={`editor-background`} style={{ backgroundColor: `${colorScheme[0].backgroundColor}` }}>
        <div className={"editor-title"} style={{ color: `${colorScheme[0].titleColor}` }}>
          <h1 style={{ paddingTop: '20px' }}>{title}</h1>
        </div>
        <div>
          <Row>
            {myProfile &&
              myProfile.accounts.map(item => (
                <Col lg="3">
                  <SiteCard editorColor={colorScheme[0].siteColor} iconColor={colorScheme[0].iconColor} account={item} page="editor" />
                </Col>
              ))}
          </Row>
        </div>
      </div>
      </>
    );
  }

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
                {myProfile && !myProfile.hasCustomPath &&
                <NavLink tag="li">
                  <DropdownItem className="nav-item" onClick={addCustomURL} style={{color: "black"}}>Customize URL</DropdownItem>
                </NavLink>
                } {myProfile && myProfile.hasCustomPath &&
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
    </>
  );

  return editorContent;
};

export default Editor;
