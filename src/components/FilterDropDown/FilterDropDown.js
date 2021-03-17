import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


const FilterDropDown = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropDown = () => setDropdownOpen(prevState => !prevState);

    const sortMe = props.array
  
const sortAlphabetical = (normal) => {
  if (normal) {  // sort array from A-Z
      console.log("sortAlphabetical")
      sortMe.sort((a, b) => {
        return ( a.site.name.toUpperCase() < b.site.name.toUpperCase() ) ? -1 : ( a.site.name.toUpperCase() > b.site.name.toUpperCase() ) ? 1 : 0
      })

      console.log(sortMe)
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


    return (
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
        <DropdownToggle caret>
          Filter
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


export default FilterDropDown;