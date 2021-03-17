import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


const FilterDropDown = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropDown = () => setDropdownOpen(prevState => !prevState);
  
    return (
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
        <DropdownToggle caret>
          Dropdown
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Sort By</DropdownItem>
          <DropdownItem onClick={() => { sortAlphabetical(true) } }>Alphabetical A-Z</DropdownItem>
          <DropdownItem onClick={() => { sortAlphabetical(false) } }>Alphabetical Z-A</DropdownItem>
          <DropdownItem onClick={() => { sortConfidence() } }>Confidence</DropdownItem>
          <DropdownItem onClick={() => { sortAge(true) } }>Newest</DropdownItem>
          <DropdownItem onClick={() => { sortAge(false) } }>Oldest</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
}

const sortAlphabetical = (normal) => {
    if (normal) {  // sort array from A-Z
        console.log("sortAlphabetical")
    }
    else {  // sort array from Z-A
        console.log("sortAlphabetical reverse")
    }
}

const sortConfidence = () => {
    // Sort array by highest confidence level
    console.log("sortConfidence")
}

const sortAge = (newest) => {
    if (newest) {
        // Sort array by newest found
        console.log("sortAge")
    }
    else {
        // Sort array by oldest found
        console.log("sortAge oldest")
    }
}

export default FilterDropDown;