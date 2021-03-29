import React, { useState, useEffect } from "react";
import Colors from "views/Colors.js";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Auth } from "aws-amplify";
import { ThirdPartyAccount, accounts, AccountType } from "trace-search";
import SiteCard from "components/SiteCard/SiteCard";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap
} from "react-grid-dnd";

// reactstrap components
import {
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";

var name = "Isabel Battaglioli";

const Editor = () => {
  const [claimedAccounts, setClaimedAccounts] = useState({});
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
    console.log(colorScheme[0].titleColor);
    console.log(colorScheme[0].siteColor);
    console.log(colorScheme[0].backgroundColor);
    console.log(colorScheme[0].iconColor);
    console.log(colorScheme[0]);
  }

  useEffect(() => {
    async function isLoggedIn () {
      if (!(localStorage.getItem('user'))) {
        window.location.href = '/login';
      }
    }
    isLoggedIn();
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
    {isOpen ?  <Colors onSelectLanguage={handleLanguage}/>  : null}
      <div onClick={togglePopup} className={isOpen ? `content blur` : `content`}>
        <div className={`editor-background`} style={{ backgroundColor: `${colorScheme[0].backgroundColor}` }}>

        <div className={"editor-title"} style={{ color: `${colorScheme[0].titleColor}` }}>
          {name}<i className="tim-icons icon-pencil icon"></i>
        </div>
          <GridContextProvider onChange={onChange}>
            <GridDropZone
              id="items"
              boxesPerRow={4}
              rowHeight={330}
              style={{ height: `${(heightSize/4) * 330}px`}} 
            > 
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
