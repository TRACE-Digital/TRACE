/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

import { clearDb, setupReplication, teardownReplication } from 'trace-search';

// reactstrap components
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
  NavbarToggler,
  ModalHeader,
} from "reactstrap";
import ToggleButton from 'react-toggle-button';
import { Link } from "react-router-dom";

import { Auth } from 'aws-amplify';

async function signOut() {
  console.log('before')
  console.log(await Auth.currentAuthenticatedUser())
  try {
    const currentUser = Auth.userPool.getCurrentUser();
    await currentUser.signOut();
    console.log('after');
    console.log(await Auth.currentAuthenticatedUser());
    localStorage.removeItem('user');
    window.location.href = '/#/login';
    } catch (error) {
      console.log('error signing out: ', error);
      localStorage.removeItem('user');
      window.location.href = '/#/login';
    }
}

function AdminNavbar(props) {
  const [collapseOpen, setcollapseOpen] = React.useState(false);
  const [modalSearch, setmodalSearch] = React.useState(false);
  const [color, setcolor] = React.useState("navbar-transparent");
  const [isLoggedIn, setIsLoggedIn] = React.useState((localStorage.getItem('user')));
  const [replicate, setReplicate] = React.useState(false);

  // Setup replication
  React.useEffect(() => {
    async function handleReplication() {
      if (replicate) {
        try {
          const obj = await setupReplication();
          const replicator = obj.TODO_replication;

          replicator.on('error', (e) => {
            alert(`Replication error!\n\n${e}`);
            console.error(e);
            setReplicate(false);
          });
        } catch(e) {
          alert(`Replication error!\n\n${e}`);
          console.error(e);
          setReplicate(false);
          return;
        }
      } else {
        try {
          await teardownReplication();
        } catch (e) {
          console.error(e);
          return;
        }
      }
    }
    handleReplication();
  }, [replicate]);

  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  });
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setcolor("bg-white");
    } else {
      setcolor("navbar-transparent");
    }
  };
  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setcolor("navbar-transparent");
    } else {
      setcolor("bg-white");
    }
    setcollapseOpen(!collapseOpen);
  };
  // this function is to open the Search modal
  const toggleModalSearch = () => {
    setmodalSearch(!modalSearch);
  };
  return (
    <>
      <Navbar className={classNames("navbar-absolute", color)} expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div
              className={classNames("navbar-toggle d-inline", {
                toggled: props.sidebarOpened,
              })}
            >
              <NavbarToggler onClick={props.toggleSidebar}>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </NavbarToggler>
            </div>
            <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
              {props.brandText}
            </NavbarBrand>
          </div>
          <NavbarToggler onClick={toggleCollapse}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav>
                <div style={{ textAlign: 'center' }}>
                  Sync
                <ToggleButton
                    inactiveLabel={<span>Off</span>}
                    activeLabel={<span>On</span>}
                    value={replicate || false}
                    onToggle={() => setReplicate(prev => !prev) }
                  />
                </div>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  nav
                  onClick={async (e) => { e.preventDefault() }}
                >
                  <div className="photo">
                    <i className="tim-icons icon-single-02" />
                  </div>
                  <b className="caret d-none d-lg-block d-xl-block" />
                  <p className="d-lg-none"></p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">Profile</DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">Settings</DropdownItem>
                  </NavLink>
                  <DropdownItem tag="li" className="">

                  </DropdownItem>
                  <DropdownItem divider tag="li" />
                  <NavLink tag="li">
                    <DropdownItem className="nav-item" onClick={async () => {
                      try {
                        await clearDb();
                        window.location.reload();
                      } catch (e) {
                        console.error(e);
                      }
                    }}>Delete my data</DropdownItem>
                  </NavLink>
                  <DropdownItem divider tag="li" />
                  {!isLoggedIn &&
                  <NavLink to="/login" tag={Link}>
                    <DropdownItem className="nav-item">Log In</DropdownItem>
                  </NavLink>}
                  {isLoggedIn &&
                  <NavLink onClick={() => {
                    signOut();
                    setIsLoggedIn(!isLoggedIn);
                    }} tag="li">)
                    <DropdownItem className="nav-item">Log Out</DropdownItem>
                  </NavLink>}
                </DropdownMenu>
              </UncontrolledDropdown>
              <li className="separator d-lg-none" />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      <Modal
        modalClassName="modal-search"
        isOpen={modalSearch}
        toggle={toggleModalSearch}
      >
        <ModalHeader>
          <Input placeholder="SEARCH" type="text" />
          <button
            aria-label="Close"
            className="close"
            onClick={toggleModalSearch}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </ModalHeader>
      </Modal>
    </>
  );
}

export default AdminNavbar;
