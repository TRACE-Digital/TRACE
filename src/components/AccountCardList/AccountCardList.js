import AccountCard from 'components/AccountCard/AccountCard';
import { rejectAccount } from 'components/AccountCard/AccountCard';
import { claimAccount } from 'components/AccountCard/AccountCard';
import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';

function AccountCardList(props) {
  const [sortMethod, setSortMethod] = useState("new");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);
  const [sortedAccounts, setSortedAccounts] = useState([]);
  const [selection, setSelection] = useState([]);

  const toggleSortDropdown = () => setSortDropdownOpen((prevState) => !prevState);
  const toggleActionsDropdown = () => setActionsDropdownOpen((prevState) => !prevState);

  const selectAll = () => setSelection(props.accounts.map(account => account.id));
  const deselectAll = () => setSelection([]);

  const claimSelected = async () => {
    let count = 0;
    const selectedAccounts = props.accounts.filter(account => selection.includes(account.id));
    for (const account of selectedAccounts) {
      const result = await claimAccount(account, true);
      if (result) {
        count++;
      }
    }
    alert(`Claimed ${count} accounts`);
    return count;
  };

  const rejectSelected = async () => {
    let count = 0;
    const selectedAccounts = props.accounts.filter(account => selection.includes(account.id));
    for (const account of selectedAccounts) {
      const result = await rejectAccount(account, true);
      if (result) {
        count++;
      }
    }
    alert(`Rejected ${count} accounts`);
    return count;
  };

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
        <Dropdown isOpen={sortDropdownOpen} toggle={toggleSortDropdown} style={{display: "inline", marginRight: "10px"}}>
          <DropdownToggle caret>Sort By
            <b className="caret d-none d-lg-block d-xl-block" style={{marginLeft: "-15px", marginTop: "-11px"}} />
          </DropdownToggle>
          <DropdownMenu style={{marginTop: "15px"}}>
            <DropdownItem onClick={() => setSortMethod("az")}>
              Alphabetical A-Z
            </DropdownItem>
            <DropdownItem divider tag="li" />
            <DropdownItem onClick={() => setSortMethod("za")}>
              Alphabetical Z-A
            </DropdownItem>
            <DropdownItem divider tag="li" />
            <DropdownItem onClick={() => setSortMethod("confidence")}>
              Confidence
            </DropdownItem>
            <DropdownItem divider tag="li" />
            <DropdownItem onClick={() => setSortMethod("new")}>
              Newest
            </DropdownItem>
            <DropdownItem divider tag="li" />
            <DropdownItem onClick={() => setSortMethod("old")}>
              Oldest
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/* ACTIONS */}
        {props.actionable && (
        <Dropdown isOpen={actionsDropdownOpen} toggle={toggleActionsDropdown} style={{display: "inline"}}>
          <DropdownToggle caret>Actions
            <b className="caret d-none d-lg-block d-xl-block" style={{marginLeft: "-15px", marginTop: "-11px"}} />
          </DropdownToggle>
          <DropdownMenu style={{marginTop: "15px", fontWeight: "normal"}}>
            <DropdownItem onClick={() => selectAll()}>
              Select All
            </DropdownItem>
            <DropdownItem divider tag="li" />
            <DropdownItem onClick={() => deselectAll()}>
              Deselect All
            </DropdownItem>
            <DropdownItem divider tag="li" />
            <DropdownItem onClick={() => claimSelected()}>
              Claim Selected
            </DropdownItem>
            <DropdownItem divider tag="li" />
            <DropdownItem onClick={() => rejectSelected()}>
              Reject Selected
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        )}
        <br/>
      </span>

      <div>
        <h2>{props.headerText} - {props.accounts.length} result{(props.accounts.length === 1) ? '': 's'}</h2>
      </div>
      <Row>
        {sortedAccounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            page="search"
            selectable={props.selectable}
            actionable={props.actionable}
            flippable={props.flippable}
            showNames={props.showNames}
            showTripleDot={props.showTripleDot}
            selected={selection.includes(account.id)}
            onSelected={() => setSelection(prev => prev.concat(account.id))}
					  onDeselected={() => setSelection(prev => prev.filter(id => id !== account.id))}
          />
        ))}
      </Row>
    </>
  );
}

AccountCardList.defaultProps = {
  accounts: [],
  accountIds: [],
}

export default AccountCardList;
