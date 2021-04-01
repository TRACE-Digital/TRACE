import React, { useState } from "react";

// reactstrap components
import classNames from "classnames";

import {
  SearchDefinition,
  AccountType,
  searchResults,
  SearchState,
  supportedSites,
  tags,
  filterSitesByTags,
} from "trace-search";
import {
  Button,
  ButtonGroup,
  Row,
  Col,
} from "reactstrap";
import AccountCardList from "components/AccountCardList/AccountCardList.js";

const testSiteNames = [
  "GitHub",
  "Reddit",
  "Apple Discussions",
  "Facebook",
  "BitBucket",
  "GitLab",
  "npm",
  "Wikipedia",
  "TripAdvisor",
  "HackerNews",
  "Steam",
  "Keybase",
  "last.fm",
  "Twitch",
];

function SearchComponent() {
  const [isVisible, setVisible] = useState(false);
  const [keywordsEntered, setKeywordsEntered] = useState(false);
  const [tagsEntered, setTagsEntered] = useState(false);
  const [userNames, setUserNames] = useState([]);
  const [firstNames, setFirstNames] = useState([]);
  const [lastNames, setLastNames] = useState([]);
  const [resultIds, setResultsIds] = useState([]);
  const [progress, setProgress] = useState(-1);
  const [categories, setCategories] = useState(tags.slice());
  const [activeTab, setActiveTab] = useState("discovered");
  const [currentSearch, setCurrentSearch] = useState(null);

  let discovered = [];
  let unregistered = [];

  const handleRefineClick = () => {
    setVisible(!isVisible);
  };

  const handleCancelClick = () => {
    // refresh window
    window.location.reload();
  };

  const selectAll = () => {
    setCategories(tags.slice());
    setTagsEntered(false);
  };

  const unselectAll = () => {
    setCategories([]);
  };

  // Function to handle keypresses for first and last name refine search functionality
  function nameKeyPress(e) {
    if (e.keyCode === 13) {
      // keycode for Enter
      if (e.target.id === "firstName") {
        // Handle enter for firstName input
        if (!firstNames.includes(e.target.value) && e.target.value !== "") {
          firstNames.push(e.target.value);
          setFirstNames([...firstNames]);
        }
        e.target.value = "";
      } else if (e.target.id === "lastName") {
        // Handle enter for last name input
        if (!lastNames.includes(e.target.value) && e.target.value !== "") {
          lastNames.push(e.target.value);
          setLastNames([...lastNames]);
        }
        e.target.value = "";
      }
    }
  }

  function addUserName(userName) {
    if (!userNames.includes(userName) && userName !== "") {
      userNames.push(userName.trim());
      setUserNames([...userNames]);
      setKeywordsEntered(false);
    }
    document.getElementById("search-bar").value = "";
  }

  function keyPress(e) {
    if (e.keyCode === 32) { // SPACE
      addUserName(e.target.value);
    } else if (e.keyCode === 8 && e.target.value === "") { // BACKSPACE
      userNames.splice(userNames.length - 1, 1);
      setUserNames([...userNames]);
    } else if (e.keyCode === 13) { // ENTER
      addUserName(e.target.value);
      submitSearch(e);
    }
  }

  async function submitSearch(e) {
    if (userNames.length === 0) {
      setKeywordsEntered(true);
      console.log("no keywords entered");
    } else if (categories.length === 0) {
      setTagsEntered(true);
      console.log("no tags entered");
    } else {
      console.log("Submit Searches");

      let searchDef;
      if (currentSearch) {
        searchDef = currentSearch.definition;
      } else {
        searchDef = new SearchDefinition(undefined, []);
      }

      // TODO: This should eventually move to SearchDefinition and
      // shouldn't be this terribly confusing and inefficient
      const testSites = testSiteNames.map((name) => supportedSites[name]);
      const taggedSites = filterSitesByTags(testSites, categories);

      searchDef.includedSites = taggedSites;
      searchDef.userNames = userNames;
      searchDef.firstNames = firstNames;
      searchDef.lastNames = lastNames;

      await searchDef.save();

      const search = await searchDef.new()
      setCurrentSearch(search);

      // Clear old results
      setResultsIds([]);
      setProgress(0);

      // Register for notification of new results
      search.events.on("result", (id) => {
        setResultsIds((prev) => prev.concat([id]));
        setProgress(search.progress);
      });

      await search.start();
    }
  }

  function deleteEntry(e) {
    userNames.splice(userNames.indexOf(e), 1);
    setUserNames([...userNames]);
  }

  function deleteNameEntry(entry, type) {
    if (type === "first") {
      firstNames.splice(firstNames.indexOf(entry), 1);
      setFirstNames([...firstNames]);
    } else if (type === "last") {
      lastNames.splice(lastNames.indexOf(entry), 1);
      setLastNames([...lastNames]);
    } else {
      console.error("Invalid deleteNameEntry entry type!");
    }
  }

  function typing() {
    setKeywordsEntered(false);
  }

  function handleClickCheckbox(e) {
    if (categories.includes(e.target.value)) {
      categories.splice(categories.indexOf(e.target.value), 1);
      setCategories([...categories]);
    } else {
      setTagsEntered(false);
      categories.push(e.target.value);
      setCategories([...categories]);
    }
  }


  // Add accounts to discovered/unregistered arrays in order to render later
  for (const resultId of resultIds) {
    const account = searchResults[resultId];

    if (account.type === AccountType.UNREGISTERED) {
      unregistered.push(account);
    } else {
      discovered.push(account);
    }
  }

  return (
    // TITLE AND SEARCH BAR
    <div className="content">
    {currentSearch === null && (
      <>
      <div className="search-title">TRACE</div>
      <div className="search-info">
        Find your digital footprint. Manage your online presence. Our service
        allows you to increase your social media engagement while keeping your
        privacy a priority. Sync your information or work locally.
      </div>
      </>
    )}

      <div className="one">
        <div className="three">
          {userNames.map((item) => (
            <div className="entered" key={item}>
              <i
                className="icon fas fa-times"
                onClick={() => deleteEntry(item)}
              ></i>
              {item}
            </div>
          ))}
        </div>
        <div className="two">
          <input
            id="search-bar"
            className="two-search"
            placeholder="enter keyword"
            onKeyDown={keyPress}
            onChange={typing}
          ></input>
        </div>
        <div className="four">
          <i onClick={submitSearch} className="fas fa-search"></i>
        </div>
      </div>

      {/* REFINE AND CANCEL BUTTONS */}

      <div className="refine-search">
        <span className="the-text refine" onClick={handleRefineClick}>
          refine search
        </span>
      </div>
      <div className="refine-search">
        <span className="the-text cancel" onClick={handleCancelClick}>
          cancel
        </span>
      </div>

      {/* REFINE SEARCH */}
      <div className={isVisible ? "dropdownVis" : "dropdownNotVis"}>
        {/* Search categories section of refine dropdown goes here */}
        <h1>CATEGORIES</h1>
        <Row>
          {tags.map((tag) => (
            <Col lg="3" key={tag}>
              <input
                type="checkbox"
                value={tag}
                onChange={handleClickCheckbox}
                checked={categories.includes(tag)}
              />
              <span className="checkbox-name">{tag}</span>
            </Col>
          ))}
        </Row>
        <Button className="categories-button" onClick={selectAll}>
          Select All
        </Button>
        <Button className="categories-button" onClick={unselectAll}>
          Deselect All
        </Button>

        <br />
        <br />
        <br />
        <h1>NAMES</h1>
        {/* First Name section for refine search dropdown goes here*/}
        <h6>Enter First Names / Nicknames:</h6>
        {/* Text box input */}
        <Row className="name" id="firstName">
          <div className="nameEntryInput" id="firstName">
            <input
              id="firstName"
              placeholder="first name/nickname"
              onKeyDown={nameKeyPress}
            ></input>
          </div>
          {/* Currently entered firstNames */}
          <Col className="nameList">
            {firstNames.map((item) => (
              <div className="entered" key={item}>
                <i
                  className="icon fas fa-times"
                  onClick={() => deleteNameEntry(item, "first")}
                ></i>
                {item}
              </div>
            ))}
          </Col>
        </Row>
        <br />

        {/* Last Name section for refine search dropdown goes here */}
        <h6>Enter Last Names / Maiden Names:</h6>
        {/* Text box input */}
        <Row className="name" id="lastName">
          <div className="nameEntryInput" id="lastName">
            <input
              id="lastName"
              placeholder="last name/maiden name"
              onKeyDown={nameKeyPress}
            ></input>
          </div>
          {/* Currently entered lastNames */}
          <Col className="nameList">
            {lastNames.map((item) => (
              <div className="entered" key={item}>
                <i
                  className="icon fas fa-times"
                  onClick={() => deleteNameEntry(item, "last")}
                ></i>
                {item}
              </div>
            ))}
          </Col>
        </Row>
        <br />
      </div>

      <div
        className={
          keywordsEntered
            ? "error-message-visible"
            : tagsEntered
            ? "error-message-visible"
            : "error-not-visible"
        }
      >
        {keywordsEntered
          ? "please enter at least one keyword"
          : tagsEntered
          ? "please enter at least one tag"
          : ""}
      </div>

      {(progress >= 0 ) && (
        <div style={{ width: "100%", textAlign: "center" }}>
          <div>{progress}%</div>
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: "#1d8cf8", // $info
              background: "linear-gradient(to right, #1d8cf8, #3358f4)",
              borderRadius: 50,
            }}
          >
            &nbsp;
          </div>
        </div>
      )}

      <br/>

      {currentSearch && currentSearch.state !== SearchState.CREATED && (
      <>
      <div style={{textAlign: "center"}}>

        <ButtonGroup
          className="btn-group-toggle"
          data-toggle="buttons"
        >
          <Button
            tag="label"
            className={classNames("btn-simple", {
              active: activeTab === "discovered",
            })}
            color="info"
            id="0"
            size="md"
            onClick={() => setActiveTab("discovered")}
          >
            <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
              Discovered
            </span>
            <span className="d-block d-sm-none">
              <i className="tim-icons icon-single-02" />
            </span>
          </Button>
          <Button
            color="info"
            id="1"
            size="md"
            tag="label"
            className={classNames("btn-simple", {
              active: activeTab === "unregistered",
            })}
            onClick={() => setActiveTab("unregistered")}
          >
            <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
              Unregistered
            </span>
            <span className="d-block d-sm-none">
              <i className="tim-icons icon-gift-2" />
            </span>
          </Button>
          <Button
            color="info"
            id="2"
            size="md"
            tag="label"
            className={classNames("btn-simple", {
              active: activeTab === "inconclusive",
            })}
            onClick={() => setActiveTab("inconclusive")}
          >
            <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
              Inconclusive
            </span>
            <span className="d-block d-sm-none">
              <i className="tim-icons icon-tap-02" />
            </span>
          </Button>
        </ButtonGroup>
        <br/>
        <br/>
      </div>

      {(activeTab === "discovered") &&
        <AccountCardList
          headerText="Discovered Accounts"
          accounts={discovered}
        />
      }
      {(activeTab === "unregistered") &&
        <AccountCardList
          headerText="Unregistered Accounts"
          accounts={unregistered}
        />
      }
      {(activeTab === "inconclusive") &&
        <AccountCardList
          headerText="Inconclusive Accounts"
          accounts={[]} /* TODO */
        />
      }
      </>
      )}
    </div>
  );
}

export default SearchComponent;

// got visibility toggle from https://stackoverflow.com/questions/42630473/react-toggle-class-onclick
