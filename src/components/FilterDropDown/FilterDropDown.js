import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const FilterDropDown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortMethod, setSortMethod] = useState("new")

  const toggleDropDown = () => setDropdownOpen(prevState => !prevState);

  console.log("DROPDOWN")
  const sortArray = (method) => {
    if (method === "new") { // sort by age, newest found first

    }
    else if (method === "old") {  // sort by age, oldest found first

    }
    else if (method === "az") { // sort alphabetically by site name, A-Z
      // sortMe.sort((a, b) => {
      //   return ( a.site.name.toUpperCase() < b.site.name.toUpperCase() ) ? -1 : ( a.site.name.toUpperCase() > b.site.name.toUpperCase() ) ? 1 : 0
      // })
    }
    else if (method === "za") { // sort alphabetically by site name, Z-A

    }
    else if (method === "confidence") { // sort by confidence level, highest first

    }
    else {  // invalid sort method  
      console.error(`Invalid sort method called: '${method}'`)
    }
  }

    return (
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
        <DropdownToggle caret>
          Filter
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Sort By</DropdownItem>
          <DropdownItem onClick={() => { setSortMethod("az") } }>Alphabetical A-Z</DropdownItem>
          <DropdownItem onClick={() => { setSortMethod("za") } }>Alphabetical Z-A</DropdownItem>
          <DropdownItem onClick={() => { setSortMethod("confidence") } }>Confidence</DropdownItem>
          <DropdownItem onClick={() => { setSortMethod("newest") } }>Newest</DropdownItem>
          <DropdownItem onClick={() => { setSortMethod("oldest") } }>Oldest</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
}


export default FilterDropDown;