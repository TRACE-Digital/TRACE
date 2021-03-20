import React, { useEffect, useState } from "react";

// reactstrap components
import { Row, Col, Button } from "reactstrap";
import SiteCard from "../components/SiteCard/SiteCard.js";

import {
  SearchDefinition,
  AccountType,
  searchResults,
  allSites,
  tags,
  filterSitesByTags,
} from "trace-search";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortMethod, setSortMethod] = useState("new");
  const [discoveredSites, setDiscoveredSites] = useState([]);
  const [unregisteredSites, setUnregisteredSites] = useState([]);

  let discovered = [];
  let unregistered = [];

  const toggleDropDown = () => setDropdownOpen((prevState) => !prevState);

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

  function keyPress(e) {
    console.log("testing!");
    if (e.keyCode === 13) {
      if (!userNames.includes(e.target.value) && e.target.value !== "") {
        userNames.push(e.target.value);
        setUserNames([...userNames]);
        setKeywordsEntered(false);
      }
      document.getElementById("search-bar").value = "";
    } else if (e.keyCode === 8 && e.target.value === "") {
      userNames.splice(userNames.length - 1, 1);
      setUserNames([...userNames]);
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

      // Clear old results
      setResultsIds([]);
      setProgress(0);

      // TODO: This should eventually move to SearchDefinition and
      // shouldn't be this terribly confusing and inefficient
      const testSites = testSiteNames.map((name) => allSites[name]);
      const taggedSites = filterSitesByTags(testSites, categories);
      const taggedSiteNames = taggedSites.map((site) => site.name);

      const searchDef = new SearchDefinition(undefined, taggedSiteNames);
      searchDef.userNames = userNames;
      searchDef.firstNames = firstNames;
      searchDef.lastNames = lastNames;

      await searchDef.save();

      const search = await searchDef.new();

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

  /**
   * This useEffect monitors sortMethod, which changes whenever a new sort method is selected.
   * It also monitors the resultIds array, which changes every time a new result is added.
   *
   * If either of these things happen, the displayed data is re-sorted and re-rendered with the current sortMethod.
   */
  useEffect(() => {
    // Sort an array passed in
    const sortArray = (array) => {
      let sorted = [...array];

      if (sortMethod === "new") {
        // sort by age, newest found first
        // this happens by default
      } else if (sortMethod === "old") {
        // sort by age, oldest found first
        // since array is sorted by new by default, just reverse the array
        sorted.reverse();
      } else if (sortMethod === "az") {
        // sort alphabetically by site name, A-Z
        sorted.sort((a, b) => {
          return a.site.name.toUpperCase() < b.site.name.toUpperCase()
            ? -1
            : a.site.name.toUpperCase() > b.site.name.toUpperCase()
            ? 1
            : 0;
        });
      } else if (sortMethod === "za") {
        // sort alphabetically by site name, Z-A
        sorted.sort((a, b) => {
          return a.site.name.toUpperCase() > b.site.name.toUpperCase()
            ? -1
            : a.site.name.toUpperCase() < b.site.name.toUpperCase()
            ? 1
            : 0;
        });
      } else if (sortMethod === "confidence") {
        // sort by confidence level, highest first
        sorted.sort((a, b) => {
          return a.confidence < b.confidence
            ? -1
            : a.confidence > b.confidence
            ? 1
            : 0;
        });
      } else {
        // invalid sort method
        console.error(`Invalid sort method called: '${sortMethod}'`);
      }

      return sorted;
    };

    // Re-sort discovered and unregistered arrays based on sortMethod
    setDiscoveredSites(sortArray(discovered));
    setUnregisteredSites(sortArray(unregistered));
    // TODO: is this ok?
  }, [sortMethod, resultIds]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className="search-title">TRACE</div>
      <div className="search-info">
        Find your digital footprint. Manage your online presence. Our service
        allows you to increase your social media engagement while keeping your
        privacy a priority. Sync your information or work locally.
      </div>

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

      {progress >= 0 ? (
        <div style={{ width: "100%", textAlign: "center" }}>
          <div>{progress}%</div>
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: "#5e72e4",
              borderRadius: 50,
            }}
          >
            &nbsp;
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <hr></hr>

      {/* FILTER DROPDOWN */}
      {resultIds.length > 0 && (
        <div>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
            <DropdownToggle caret>Sort By</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setSortMethod("az")}>
                <strong>Alphabetical A-Z</strong>
              </DropdownItem>
              <DropdownItem onClick={() => setSortMethod("za")}>
                <strong>Alphabetical Z-A</strong>
              </DropdownItem>
              <DropdownItem onClick={() => setSortMethod("confidence")}>
              <strong>Confidence</strong>
              </DropdownItem>
              <DropdownItem onClick={() => setSortMethod("new")}>
              <strong>Newest</strong>
              </DropdownItem>
              <DropdownItem onClick={() => setSortMethod("old")}>
              <strong>Oldest</strong>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <hr></hr>
        </div>
      )}

      <div>
        {resultIds.length > 0 && (
          <div>
            <h2>Discovered Accounts</h2>
          </div>
        )}
        <Row>
          {discoveredSites.map((account) => (
            <SiteCard account={account} page="search" />
          ))}
        </Row>
      </div>

      <div>
        {resultIds.length > 0 && (
          <div>
            <h2>Unregistered Accounts</h2>
          </div>
        )}
        <Row>
          {unregisteredSites.map((account) => (
            <SiteCard account={account}></SiteCard>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default SearchComponent;

// got visibility toggle from https://stackoverflow.com/questions/42630473/react-toggle-class-onclick
