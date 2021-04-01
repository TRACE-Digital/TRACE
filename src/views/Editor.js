import React, { useState, useEffect } from "react";
import Colors from "views/Colors.js";
import { ThirdPartyAccount, accounts, AccountType } from "trace-search";
import SiteCard from "components/SiteCard/SiteCard";
import { EditText, EditTextarea } from 'react-edit-text';
import {GridContextProvider, GridDropZone, GridItem, swap} from "react-grid-dnd";
import { Link } from "react-router-dom";
import {Row, Col} from "reactstrap";

var name = "Isabel Battaglioli";


const Editor = () => {
  const [claimedAccounts, setClaimedAccounts] = useState({});
  const[title, setTitle] = useState("Enter Title");
  const [isOpen, setIsOpen] = useState(false);
  const [colorScheme, setColorScheme] = useState([{
    "titleColor":"#FFFFFF",
    "backgroundColor":"#1E1D2A",
    "siteColor":"#26283A",
    "iconColor":"Default"
  }])

  const [heightSize, setHeightSize] = useState("");

  const togglePopup = (e) => {
    if (e.target.className === "tim-icons icon-pencil icon"){
      setIsOpen(!isOpen);
    }
  }

  function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    const items = Array.from(Object.values(claimedAccounts));
    console.log(items);
    const nextState = swap(items, sourceIndex, targetIndex);
    setClaimedAccounts(nextState);
  }

  function handleLanguage(colorChoice){
    const updated = [...colorChoice];
    setColorScheme([...updated]);
  }

  const handleAddClick = () => {
    setIsOpen(!isOpen);
  }

  function keyDown(e){
    console.log(e);
  }

  function updateTitle(e){
    setTitle(e.target.value);
  }

  useEffect(() => {
    async function isLoggedIn () {
      if (!(localStorage.getItem('user'))) {
        window.location.href = '/login';
      }
    }
    isLoggedIn();
    console.log(name.length);
  }, []);

  /**
   * Monitor for new claimed accounts. Every time the accounts array is updated, re-render to show the proper tiles.
   */
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        // Load all accounts from the database into memory
        await ThirdPartyAccount.loadAll();
        // setPlsRender((current) => !current);
      } catch (e) {
        console.error("Failed to load accounts from the database!");
        console.error(e);
        return {};
      }
      return accounts;
    };

    loadAccounts().then(() => {
      setClaimedAccounts(accounts);
      setHeightSize(Array.from(Object.values(accounts)).length);
    });

  }, [accounts]);

  return (
    <>
    {isOpen ?  <Colors onSelectLanguage={handleLanguage} closePopup={handleAddClick} />  : null}
      <div onClick={togglePopup} className={isOpen ? `content blur` : `content`}>
        <div className={`editor-background`} style={{ backgroundColor: `${colorScheme[0].backgroundColor}` }}>

        <div className={"editor-title"} style={{ color: `${colorScheme[0].titleColor}` }}>
          {/* <EditText name="textbox1" defaultValue="Isabel Battaglioli"/> */}
    
          <input
            className="editor-input"
            type="text"
            value={title}
            maxLength={30}
            onChange={updateTitle}
            style={{color:`${colorScheme[0].titleColor}`, backgroundColor:`${colorScheme[0].backgroundColor}`, border:"none", outline: "none"}}
          />
          {/* <i className="tim-icons icon-pencil icon" style={{color:"white", margin:"5px"}}></i> */}
          <Link
            className="btn btn-primary editor-button"
            color="primary"
            onClick={handleAddClick}
          >
            Edit Page
          </Link>
        
          
        </div>
          <GridContextProvider onChange={onChange}>
            <GridDropZone
              id="items"
              boxesPerRow={4}
              rowHeight={330}
              style={{ height: `${(heightSize/4) * 330}px`}}> 
              {Object.values(claimedAccounts).map(item => (
                <GridItem className="boxes" key={item.id}> 
                  <div
                    style={{
                    width: "100%",
                    height: "100%",
                    }}>
                      {<SiteCard  editorColor={colorScheme[0].siteColor} account={item} page="editor"/>}
                  </div>
              </GridItem>
              ))}
            </GridDropZone>
          </GridContextProvider>
        </div>
      </div>
    </>
  );
};

export default Editor;
