import AccountCard from 'components/AccountCard/AccountCard';
import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';

// import {
//   SearchDefinition,
//   AccountType,
//   searchResults,
//   allSites,
//   tags,
//   filterSitesByTags,
// } from "trace-search";

function AccountCardList(props) {
  const [sortMethod, setSortMethod] = useState("new");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);
  const [sortedAccounts, setSortedAccounts] = useState([]);

  const toggleSortDropdown = () => setSortDropdownOpen((prevState) => !prevState);
  const toggleActionsDropdown = () => setActionsDropdownOpen((prevState) => !prevState);

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
    setSortedAccounts(sortArray(props.accounts));
    // TODO: is this ok?
  }, [sortMethod, props.accounts]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <span style={{display: "inline", float: "right"}}>
        {/* SORT DROPDOWN */}
        <Dropdown isOpen={sortDropdownOpen} toggle={toggleSortDropdown} style={{display: "inline"}}>
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
        {/* ACTIONS */}
        <Dropdown isOpen={actionsDropdownOpen} toggle={toggleActionsDropdown} style={{display: "inline"}}>
          <DropdownToggle caret>Actions</DropdownToggle>
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
        <br/>
      </span>

      <div>
        <h2>{props.headerText} - {props.accounts.length} results</h2>
      </div>
      <Row>
        {sortedAccounts.map((account) => (
          <AccountCard account={account} page="search" />
        ))}
      </Row>
    </>
  );
}

export default AccountCardList;
