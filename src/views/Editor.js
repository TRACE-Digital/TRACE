import React, { useState, useEffect } from "react";
import Colors from "views/Colors.js";
import { ThirdPartyAccount, accounts, AccountType, ProfilePage, pages } from "trace-search";
import SiteCard from "components/SiteCard/SiteCard";
import { EditText, EditTextarea } from 'react-edit-text';
import { GridContextProvider, GridDropZone, GridItem, swap } from "react-grid-dnd";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { Auth } from 'aws-amplify';



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

  }, []);

  return (
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
              style={{ color: `${colorScheme[0].titleColor}`, backgroundColor: `${colorScheme[0].backgroundColor}`, border: "none", outline: "none" }}
            />

            <Link
              className="btn btn-primary editor-button"
              color="primary"
              onClick={handleAddClick}
            >
              Edit Page
          </Link>


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
};

export default Editor;
