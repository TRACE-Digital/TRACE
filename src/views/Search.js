import React, { useState } from 'react';

// reactstrap components
import {Row, Col } from "reactstrap";

function Search() {
  const [isVisible, setVisible] = useState(false);
  const [searches, setSearches] = useState([]);
  const [categories, setCategories] = useState([]);
  var tempData = [
    {Category:"Social Media"},
    {Category:"Clothing"},
    {Category:"Housing"},
    {Category:"Vehicle"},
    {Category:"Pet"},
    {Category:"Insurance"},
    {Category:"Sport"},
    {Category:"Food"},
    {Category:"Medical"},
  ];

  const handleClick = () => {
    setVisible(!isVisible);
  };

  function onKeyUp(e) {
    if (e.charCode === 13) {
      if (!searches.includes(e.target.value)){
        console.log(e.target.value);
        searches.push(e.target.value);
        console.log(searches);
        setSearches([...searches]);
      }
    }
  }

  function submitSearch(e){
    //add stuff here to submit later
    console.log("Submit Searches");
  }

  function deleteEntry(e){
    searches.splice(searches.indexOf(e), 1);
    setSearches([...searches]);
    console.log(searches);
  }

  function handleClickCheckbox(e){
    console.log(e.target.value);

    if (categories.includes(e.target.value)){
      console.log("ITS IN THERE");
      categories.splice(categories.indexOf(e.target.value), 1);
      setCategories([...categories]);
      console.log(categories);
    }
    else{
      categories.push(e.target.value);
      setCategories([...categories]);
      console.log(categories);
    }
  }

  return (
    <div className="content">
      <div className="search-title">
        SEARCH
      </div>

        <div className="one">
          <div className="three">{searches.map(item => <div className="entered">
            <i className="icon fas fa-times" onClick={() => deleteEntry(item)}></i>
              {item}
            </div>)}
          </div>
          <div className="two">
            <input
              className="two-search"
              onKeyPress={onKeyUp}>
            </input>
          </div>
          <div className="four">
            <i onClick={submitSearch} class="fas fa-search"></i>
          </div>
        </div>


        <div className="refine-search" onClick={handleClick}>refine search</div>

        <div className={isVisible ? "dropdownVis": "dropdownNotVis"} >
          <Row>
            {tempData.map(site => (
               <Col lg="3">
                 <input
                    type="checkbox"
                    value={site.Category}
                    onClick={handleClickCheckbox}
                  />
                  <span className="checkbox-name">{site.Category}</span>
               </Col>
            ))}
          </Row>
        </div>
    </div>
  );
}

export default Search;

// got visiblity toggle from https://stackoverflow.com/questions/42630473/react-toggle-class-onclick
