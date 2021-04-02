import React, { useState, useEffect, Fragment } from "react";
import History from "components/History/History";

// reactstrap components
import classNames from "classnames";

import {
  SearchDefinition,
  SearchState,
  ThirdPartyAccount,
  supportedSites,
  tags,
  filterSitesByTags,
} from "trace-search";
import { Button, ButtonGroup, Row, Col } from "reactstrap";
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
  const [progress, setProgress] = useState(-1);
  const [categories, setCategories] = useState(tags.slice());
  const [dropdownOpen, setDropdownOpen] = useState(false); // used for filter
  const [sortMethod, setSortMethod] = useState("new"); // used for filter
  const [discoveredSites, setDiscoveredSites] = useState([]); // used for filter
  const [unregisteredSites, setUnregisteredSites] = useState([]); // used for filter
  const [activeTab, setActiveTab] = useState("discovered");
  const [currentSearch, setCurrentSearch] = useState(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [, setPlsRender] = React.useState(false);

  // Register for changes to any search results
  // Results get updated as they are claimed/rejected
  // This catches those changes and forces a rerender
  useEffect(() => {
    const triggerRender = () => {
      setPlsRender((prev) => !prev);
    };

    // This may cause a few extra rerenders since it's results for all searches,
    // but the user is not likely to have many searches running at once
    ThirdPartyAccount.resultCache.events.on("change", triggerRender);

    const cleanup = () => {
      ThirdPartyAccount.resultCache.events.removeListener(
        "change",
        triggerRender
      );
    };

    return cleanup;
  }, []);

  // Subscribe to results from our search
  useEffect(() => {
    if (currentSearch === null) {
      return;
    }

    const handle = (id) => {
      // We don't care about the resultIds since
      // this triggers a rerender
      setProgress(search.progress);
    };

    // Preserve the state of currentSearch
    const search = currentSearch;
    // Register for notification of new results
    search.events.on("result", handle);

    const cleanup = () => {
      search.events.removeListener("result", handle);
    };

    return cleanup;
  }, [currentSearch]);

  const handleRefineClick = () => {
    setVisible(!isVisible);
  };

  const handleHistoryClick = () => {
    setHistoryVisible(!historyVisible);
  };

  const handleCancelClick = async () => {
    await currentSearch.cancel();
    // TODO: await handleClearClick() ??
  };

  /**
   * Clears the current search and returns
   * a new `Search` based on the same definition
   * (if a definition is present).
   */
  const handleClearClick = async () => {
    // Clear old results
    setProgress(-1);
    if (currentSearch) {
      const search = await currentSearch.definition.new();
      setCurrentSearch(search);
      return search;
    }
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
    if (e.keyCode === 32) {
      // SPACE
      addUserName(e.target.value);
    } else if (e.keyCode === 8 && e.target.value === "") {
      // BACKSPACE
      userNames.splice(userNames.length - 1, 1);
      setUserNames([...userNames]);
    } else if (e.keyCode === 13) {
      // ENTER
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
      let search;
      if (currentSearch) {
        searchDef = currentSearch.definition;
        search = await handleClearClick();
      } else {
        searchDef = new SearchDefinition(undefined, []);
        search = await searchDef.new();
        setCurrentSearch(search);
      }

      // Tags can be passed into the SearchDefinition constructor
      // but they will apply to all supportedSites
      // Calculate this on our own since we want to limit the search to just test sites
      const testSites = testSiteNames.map((name) => supportedSites[name]);
      const taggedSites = filterSitesByTags(testSites, categories);

      searchDef.includedSites = taggedSites;
      searchDef.userNames = userNames;
      searchDef.firstNames = firstNames;
      searchDef.lastNames = lastNames;

      await searchDef.save();

      console.log(search);
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

  return (
    // TITLE AND SEARCH BAR
    <div className="content">
      {currentSearch === null && (
        <>
          <div className="search-title">TRACE</div>
          <div className="search-info">
            Find your digital footprint. Manage your online presence. Our
            service allows you to increase your social media engagement while
            keeping your privacy a priority. Sync your information or work
            locally.
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
          />
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
        <span className="the-text refine" onClick={handleHistoryClick}>
          history
        </span>
      </div>
      <div className="refine-search">
        {progress > 0 && progress < 100 && (
          <span className="the-text cancel" onClick={handleCancelClick}>
            cancel
          </span>
        )}
        {progress === 100 && (
          <span className="the-text cancel" onClick={handleClearClick}>
            clear
          </span>
        )}
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

      {/* HISTORY */}
      {historyVisible && <History initialMax={3} onSelect={ (search) => setCurrentSearch(search) }/>}

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

      {progress >= 0 && (
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

      <br />

      {currentSearch && currentSearch.state !== SearchState.CREATED && (
        <>
          <div style={{ textAlign: "center" }}>
            <ButtonGroup className="btn-group-toggle" data-toggle="buttons">
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
            <br />
            <br />
          </div>

          {activeTab === "discovered" && (
            <AccountCardList
              headerText="Discovered Accounts"
              accounts={currentSearch?.registeredResults}
              selectable={true}
              actionable={true}
              flippable={true}
              showNames={true}
              showTripleDot={false}
            />
          )}
          {activeTab === "unregistered" && (
            <AccountCardList
              headerText="Unregistered Accounts"
              accounts={currentSearch?.unregisteredResults}
              selectable={true}
              actionable={true}
              flippable={true}
              showNames={true}
              showTripleDot={false}
            />
          )}
          {activeTab === "inconclusive" && (
            <AccountCardList
              headerText="Inconclusive Accounts"
              accounts={currentSearch?.inconclusiveResults}
              selectable={true}
              actionable={true}
              flippable={true}
              showNames={true}
              showTripleDot={false}
            />
          )}
        </>
      )}
    </div>
  );
}

export default SearchComponent;

// got visibility toggle from https://stackoverflow.com/questions/42630473/react-toggle-class-onclick
