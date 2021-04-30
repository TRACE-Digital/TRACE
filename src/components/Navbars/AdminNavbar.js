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
import { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

import { resetDb, resetRemoteDb, setRemoteUser, destroyLocalDb } from 'trace-search';

import SyncToggle from 'components/SyncToggle/SyncToggle';

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
import { Link } from "react-router-dom";
import Auth from "@aws-amplify/auth";

function AdminNavbar(props) {
  const [collapseOpen, setcollapseOpen] = useState(false);
  const [modalSearch, setmodalSearch] = useState(false);
  const [color, setcolor] = useState("navbar-transparent");
  const [currentUsername, setCurrentUsername] = useState(null);

  const isChrome = window.navigator.userAgent.includes('Chrome');
  const isFirefox = window.navigator.userAgent.includes('Firefox');

  let extensionUrl = 'https://addons.mozilla.org/en-US/firefox/addon/trace-digital/';
  if (isChrome) extensionUrl = 'https://chrome.google.com/webstore/detail/TRACE/klhmocgplcpemcdfeefpaikihedmikgk';
  if (isFirefox) extensionUrl = 'https://addons.mozilla.org/en-US/firefox/addon/trace-digital/';

  useEffect(() => {
    window.addEventListener("resize", updateColor);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  });

  useEffect(() => {
    (async () => {
      try {
        const user = await Auth.currentUserPoolUser();
        setCurrentUsername(user.username);
      }
      catch {
        setCurrentUsername(null);
      }
    })();
  });

  const signOut = async () => {
    try {
      await Auth.signOut();
      // When a user signs out, we must clear the current local database
      await destroyLocalDb();
    } catch (error) {
      console.log('error signing out: ', error);
    }
    setCurrentUsername(null);
  }

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
                <SyncToggle />
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
                  <DropdownItem divider tag="li" />

                  <NavLink tag="li">
                    <DropdownItem className="nav-item">Settings</DropdownItem>
                  </NavLink>
                  <DropdownItem tag="li" className="">

                  </DropdownItem>
                  <DropdownItem divider tag="li" />
                  <NavLink tag="li">
                    <a href={extensionUrl} target='blank'>
                      <DropdownItem className="nav-item">
                        {window.__TRACE_EXTENSION_HOOK__ ?
                          'Extension version: ' + window.__TRACE_EXTENSION_HOOK__.getVersionStr() :
                          'Install the extension'
                        }
                      </DropdownItem>
                    </a>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item" onClick={async () => {
                      const confirmation = window.confirm('Are you sure? This action is irreversible and will delete ALL your data.');
                      if (!confirmation) {
                        return;
                      }

                      try {
                        await resetDb();
                        if (currentUsername) {
                          await setRemoteUser(await Auth.currentUserPoolUser());
                          await resetRemoteDb();
                        }
                        window.location.reload();
                      } catch (e) {
                        console.error(e);
                      }
                    }}>Delete my data</DropdownItem>
                  </NavLink>
                  <DropdownItem divider tag="li" />
                  {!currentUsername &&
                    <NavLink to="/login" tag={Link}>
                      <DropdownItem className="nav-item">Log In</DropdownItem>
                    </NavLink>}
                  {currentUsername &&
                    <NavLink onClick={() => {
                      signOut();
                      window.location.href = "/landing";
                    }} tag="li">
                    <DropdownItem className="nav-item">
                      Log Out - {currentUsername}
                    </DropdownItem>
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
