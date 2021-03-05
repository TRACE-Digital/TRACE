import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// reactstrap components
import { Row, Col, Card, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from "reactstrap";

import { SearchDefinition, AccountType, searchResults, allSites, tags, filterSitesByTags } from 'trace-search';

const testSiteNames = [
  'GitHub',
  'Reddit',
  'Apple Discussions',
  'Facebook',
  'BitBucket',
  'GitLab',
  'npm',
  'Wikipedia',
  'Gravatar',
  'HackerNews',
  'Keybase'
];

function SearchComponent() {
  const [isVisible, setVisible] = useState(false);
  const [keywordsEntered, setKeywordsEntered] = useState(false);
  const [tagsEntered, setTagsEntered] = useState(false);
  const [userNames, setUserNames] = useState([]);
  const [resultIds, setResultsIds] = useState([]);
  const [progress, setProgress] = useState(-1);
  const [categories, setCategories] = useState(tags.slice());
  const history = useHistory();

  const handleRefineClick = () => {
    setVisible(!isVisible);
  }

  const handleCancelClick = () => {
    // refresh window
    window.location.reload();
    console.log("Cancel search");
  }

  const selectAll = () => {
    setCategories(tags.slice());
  }

  const unselectAll = () => {
    setCategories([]);
  }

  function keyPress(e) {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      if (!userNames.includes(e.target.value) && e.target.value != '') {
        console.log(e.target.value);
        userNames.push(e.target.value);
        console.log(userNames);
        setUserNames([...userNames]);
        setKeywordsEntered(false);
      }
      document.getElementById('search-bar').value = '';
    }
    else if (e.keyCode === 8 && e.target.value === '') {
      console.log("BACKSPACEEEE");
      userNames.splice(userNames.length - 1, 1);
      setUserNames([...userNames]);
      console.log(userNames);
    }
  }

  async function submitSearch(e) {
    if (userNames.length === 0) {
      setKeywordsEntered(true);
      console.log("no keywords entered");
    } 
    else if (categories.length === 0){
      setTagsEntered(true);
      console.log("no tags entered");
    }else {
      console.log("Submit Searches");

      // Clear old results
      setResultsIds([]);
      setProgress(0);

      // TODO: This should eventually move to SearchDefinition and
      // shouldn't be this terribly confusing and inefficient
      const testSites = testSiteNames.map(name => allSites[name]);
      const taggedSites = filterSitesByTags(testSites, categories);
      const taggedSiteNames = taggedSites.map(site => site.name);

      console.log(taggedSiteNames);

      const searchDef = new SearchDefinition(undefined, taggedSiteNames);
      searchDef.userNames = userNames;
      await searchDef.save();

      const search = await searchDef.new();

      search.events.on('result', (id) => {
        setResultsIds(prev => prev.concat([id]));
        setProgress(search.progress);
      });

      await search.start();
    }
  }

  function deleteEntry(e) {
    userNames.splice(userNames.indexOf(e), 1);
    setUserNames([...userNames]);
    console.log(userNames);
  }

  function typing() {
    setKeywordsEntered(false);
  }

  function handleClickCheckbox(e) {
    console.log(e.target.value);

    if (categories.includes(e.target.value)) {
      console.log("ITS IN THERE");
      categories.splice(categories.indexOf(e.target.value), 1);
      setCategories([...categories]);
      console.log(categories);
    }
    else {
      setTagsEntered(false);
      categories.push(e.target.value);
      setCategories([...categories]);
      console.log(categories);
    }
  }

  async function claimAccount(account) {
    console.log(account);
    try {
        await account.claim();
        alert("Account successfully claimed!");
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteAccount(account) {
    try {
        await account.reject();
        alert("Account successfully removed!");
    } catch (e) {
      console.error(e);
    }
  }

  // TODO: This should really move to a component
  const discoveredHTML = [];
  const unregisteredHTML = [];
  for (const resultId of resultIds) {
    const account = searchResults[resultId];
    const isUnregistered = account.type === AccountType.UNREGISTERED;

    const htmlForDisplay = (
      <Col lg="3" key={account.id}>
        <Card className="card-user">
          <CardBody>
            <div class="card-details">
              <div className="editor"> <i className={account.site.logoClass != "fa-question-circle" ? "fab "+account.site.logoClass : "fas "+account.site.logoClass}></i></div>
              <div className="editor-handle-name">
                  @{account.userName}
              </div>
              <div className="editor-link">
                <a href={account.site.url.replace("{}", account.userName)} target="blank">
                  {account.site.prettyUrl || account.site.urlMain || account.site.url}
                </a>
              </div>
              {isUnregistered ? <div></div> :
                <div className="test" style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
                  {/* <button onClick={account.claim.bind(account)}>✔️</button> */}
                  <Button onClick={() => claimAccount(account)} className="claim-button">
                    <i className="tim-icons icon-check-2" />
                  </Button>
                  &nbsp;
                  <Button onClick={() => deleteAccount(account)} className="claim-button">
                    <i className="tim-icons icon-simple-remove" />
                  </Button>
                </div>
              }
            </div>
          </CardBody>
        </Card>
      </Col>
    );

    if (isUnregistered) {
      unregisteredHTML.push(htmlForDisplay);
    } else {
      discoveredHTML.push(htmlForDisplay);
    }
  }

  return (
    <div className="content">
      <div className="search-title">
        TRACE
      </div>
      <div className="search-info">Find your digital footprint. Manage your online presence. Our service allows you to increase your social media engagement while keeping your privacy a priority. Sync your information or work locally.</div>

      <div className="one">
        <div className="three">{userNames.map(item => <div className="entered">
          <i className="icon fas fa-times" onClick={() => deleteEntry(item)}></i>
          {item}
        </div>)}
        </div>
        <div className="two">
          <input
            id="search-bar"
            className="two-search"
            placeholder="enter keyword"
            onKeyDown={keyPress}
            onChange={typing}>
          </input>
        </div>
        <div className="four">
          <i onClick={submitSearch} className="fas fa-search"></i>
        </div>
      </div>

      <div className="refine-search"><span className="the-text refine" onClick={handleRefineClick}>refine search</span></div>
      <div className="refine-search"><span className="the-text cancel" onClick={handleCancelClick}>cancel</span></div>

      <div className={isVisible ? "dropdownVis" : "dropdownNotVis"} >
        <Row>
          {tags.map(tag => (
            <Col lg="3" key={tag}>
              <input
                type="checkbox"
                value={tag}
                onClick={handleClickCheckbox}
                defaultChecked={true}
                checked={categories.includes(tag) ? true : false}
              />
              <span className="checkbox-name">{tag}</span>
            </Col>
          ))}
        </Row>
        <Button className="categories-button" onClick={selectAll}>Select All</Button>
        <Button className="categories-button" onClick={unselectAll}>Unselect All</Button>
      </div>
      <div className={keywordsEntered ? "error-message-visible" : (tagsEntered ? "error-message-visible" : "error-not-visible")}>
        {keywordsEntered ? "please enter at least one keyword" : (tagsEntered ? "please enter at least one tag" : "")}
      </div>

      {progress >= 0 ?
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div>{progress}%</div>
          <div style={{ width: `${progress}%`, backgroundColor: '#5e72e4', borderRadius: 50 }}>&nbsp;</div>
        </div>
        :
        <div></div>
      }

      <hr></hr>

      <div>
        {resultIds.length > 0 ? <div><h2>Discovered Accounts</h2></div> : <div></div>}
        <Row>
          {discoveredHTML}
        </Row>
      </div>

      <div>
        {resultIds.length > 0 ? <div><h2>Unregistered Accounts</h2></div> : <div></div>}
        <Row>
          {unregisteredHTML}
        </Row>
      </div>

    </div >
  );
}

export default SearchComponent;

// got visiblity toggle from https://stackoverflow.com/questions/42630473/react-toggle-class-onclick
