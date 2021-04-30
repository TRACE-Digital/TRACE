import React, { useState, useEffect, Fragment } from "react";
import History from "components/History/History";

// reactstrap components
import classNames from "classnames";

import {
  Search,
  SearchDefinition,
  SearchState,
  ThirdPartyAccount,
  supportedSites,
  tags,
  filterSitesByTags,
} from "trace-search";
import { Button, ButtonGroup, Row, Col } from "reactstrap";
import AccountCardList from "components/AccountCardList/AccountCardList.js";

import mainLogo from '../assets/img/trace.png';

function SearchComponent() {
  const [currentSearch, setCurrentSearch] = useState(null);
  const [userNames, setUserNames] = useState([]);
  const [firstNames, setFirstNames] = useState([]);
  const [lastNames, setLastNames] = useState([]);
  const [selectedTags, setSelectedTags] = useState(tags.slice());
  const [progress, setProgress] = useState(-1);
  const [activeTab, setActiveTab] = useState("discovered");
  const [showRefine, setShowRefine] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [, setPlsRender] = useState(false);
  const [error, setError] = useState('');

  const showResume = [SearchState.PAUSED].includes(currentSearch?.state);
  const showCancel = [SearchState.IN_PROGRESS, SearchState.PAUSED].includes(currentSearch?.state);
  const showPause = [SearchState.IN_PROGRESS].includes(currentSearch?.state);
  const showClear = [SearchState.PAUSED, SearchState.COMPLETED, SearchState.CANCELLED, SearchState.FAILED].includes(currentSearch?.state);
  const showSearchIcon = currentSearch === null || [SearchState.CREATED, SearchState.COMPLETED, SearchState.FAILED].includes(currentSearch?.state);

  // Load the search from the ID in the URL
  useEffect(() => {
    let idToRestore;
    if (window.location.hash && window.location.hash.startsWith('#search')) {
      idToRestore= window.location.hash.substr(1);
    } else {
      idToRestore = localStorage.getItem('traceLastSelectedSearchId');
    }

    const search = Search.cache.get(idToRestore);
    if (idToRestore && search) {
      setCurrentSearch(search);
    }
  }, []);

  // Register for changes to any search results
  // Results get updated as they are claimed/rejected
  // This catches those changes and forces a re-render
  useEffect(() => {
    const triggerRender = () => {
      setProgress(currentSearch?.progress || -1);
      setPlsRender(prev => !prev);
    };

    ThirdPartyAccount.resultCache.events.on('change', triggerRender);
    SearchDefinition.cache.events.on('change', triggerRender);
    Search.cache.events.on('change', triggerRender);

    const cleanup = () => {
      ThirdPartyAccount.resultCache.events.removeListener('change', triggerRender);
      SearchDefinition.cache.events.removeListener('change', triggerRender);
      Search.cache.events.removeListener('change', triggerRender);
    };

    localStorage.setItem('traceLastSelectedSearchId', currentSearch?.id);

    return cleanup;
  }, [currentSearch]);

  const handleRefineClick = () => {
    setShowRefine(!showRefine);
  };

  const handleHistoryClick = () => {
    setShowHistory(!showHistory);
  };

  const handleCancelClick = async () => {
    await currentSearch.cancel();
    setPlsRender(prev => !prev);
  };

  const handleResumeClick = async () => {
    await currentSearch.resume();
    setPlsRender(prev => !prev);
  };

  const handlePauseClick = async () => {
    await currentSearch.pause();
    setPlsRender(prev => !prev);
  };

  /**
   * Clears the current search and returns
   * a new `Search` based on the same definition
   * (if a definition is present).
   */
  const handleClearClick = async () => {
    setProgress(-1);
    if (currentSearch) {
      const searchDef = new SearchDefinition();
      const search = await searchDef.new();
      handleNewSearch(search);
      setSelectedTags(tags.slice());
      return search;
    }
  };

  const handleNewSearch = (search) => {
    setCurrentSearch(search);
    setProgress(search.progress);
    setUserNames(search.definition.userNames.slice());
    setFirstNames(search.definition.firstNames.slice());
    setLastNames(search.definition.lastNames.slice());
    setSelectedTags(search.definition.tags.slice());
  }

  const selectAllTags = () => {
    setSelectedTags(tags.slice());
  };

  const deselectAllTags = () => {
    setSelectedTags([]);
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
    userName = userName || '';
    userName = userName.trim();
    if (!userNames.includes(userName) && userName.length > 0) {
      userNames.push(userName.trim());
      setUserNames([...userNames]);
    }
    document.getElementById("search-bar").value = "";
  }

  function keyPress(e) {
    if (e.keyCode === 32) {
      // SPACE
      addUserName(e.target.value);
      e.preventDefault();
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
    setError('');

    if (userNames.length === 0) {
      setError('please enter at least one user name');
    } else if (selectedTags.length === 0) {
      setError('please select at least one tag');
    } else {

      if (currentSearch) {
        if (currentSearch.state === SearchState.IN_PROGRESS) {
          await currentSearch.cancel();
        }
      }

      const searchDef = new SearchDefinition();
      const search = await searchDef.new();

      const taggedSites = filterSitesByTags(supportedSites, selectedTags);

      searchDef.includedSites = taggedSites;
      searchDef.userNames = userNames;
      searchDef.firstNames = firstNames;
      searchDef.lastNames = lastNames;
      searchDef.tags = selectedTags;

      await searchDef.save();

      handleNewSearch(search);
      console.log(search);

      await search.start();

      setProgress(search.progress);
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
    setError('');
  }

  function handleClickCheckbox(e) {
    if (selectedTags.includes(e.target.value)) {
      selectedTags.splice(selectedTags.indexOf(e.target.value), 1);
      setSelectedTags([...selectedTags]);
    } else {
      setError('');
      selectedTags.push(e.target.value);
      setSelectedTags([...selectedTags]);
    }
  }

  return (
    // TITLE AND SEARCH BAR
    <div className="content">
      {currentSearch === null && (
        <>
          <div className="trace-logo">
            <img src={mainLogo} alt="trace-logo" width="700"></img>
          </div>
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
          {/* SEARCH */}
          {showSearchIcon && (
            <i
              className="tim-icons icon-zoom-split"
              onClick={submitSearch}
              title="Search"
            />
          )}
          {/* RESUME */}
          {showResume && (
            <>
              &nbsp; &nbsp;
              <i
                className="tim-icons icon-triangle-right-17"
                onClick={handleResumeClick}
                title="Resume"
              />
            </>
          )}
          {/* PAUSE */}
          {showPause && (
            <>
              &nbsp; &nbsp;
              <i
                className="tim-icons icon-button-pause"
                onClick={handlePauseClick}
                title="Pause"
              />
            </>
          )}
          {/* CANCEL */}
          {showCancel && (
            <>
              &nbsp; &nbsp;
              <i
                className="tim-icons icon-simple-remove"
                onClick={handleCancelClick}
                title="Cancel"
              />
            </>
          )}
          {/* CLEAR */}
          {showClear && (
            <>
              &nbsp; &nbsp;
              <i
                className="tim-icons icon-simple-add"
                onClick={handleClearClick}
                title="New Search"
              />
            </>
          )}
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

      {/* REFINE SEARCH */}
      <div className={showRefine ? "dropdownVis" : "dropdownNotVis"}>
        {/* Search categories section of refine dropdown goes here */}
        <h1>CATEGORIES</h1>
        <Row>
          {tags.map((tag) => (
            <Col lg="3" key={tag}>
              <input
                type="checkbox"
                value={tag}
                onChange={handleClickCheckbox}
                checked={selectedTags.includes(tag)}
              />
              <span className="checkbox-name">{tag}</span>
            </Col>
          ))}
        </Row>
        <Button className="categories-button" onClick={selectAllTags}>
          Select All
        </Button>
        <Button className="categories-button" onClick={deselectAllTags}>
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
      {showHistory && (
        <History
          initialMax={3}
          currentSearchId={currentSearch?.id}
          onSelect={(search) => handleNewSearch(search)}
        />
      )}

      <div className={error ? "error-message-visible" : "error-not-visible"}>
        {error}
      </div>

      {currentSearch && currentSearch.state !== SearchState.CREATED && (
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
                  Discovered ({currentSearch?.registeredResults?.length || 0})
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
                  Unregistered ({currentSearch?.unregisteredResults?.length || 0})
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
                  Inconclusive ({currentSearch?.inconclusiveResults?.length || 0})
                </span>
                <span className="d-block d-sm-none">
                  <i className="tim-icons icon-tap-02" />
                </span>
              </Button>
              <Button
                color="info"
                id="2"
                size="md"
                tag="label"
                className={classNames("btn-simple", {
                  active: activeTab === "evaluated",
                })}
                onClick={() => setActiveTab("evaluated")}
              >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                  Evaluated ({currentSearch?.evaluatedResults?.length || 0})
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
          {activeTab === "evaluated" && (
            <AccountCardList
              headerText="Claimed/Rejected Accounts"
              accounts={currentSearch?.evaluatedResults}
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
