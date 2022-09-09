import React, { useEffect, useState } from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  NavLinkLogoText,
  NavUserName,
} from "./NavbarElements";
import { useAuth } from "../Auth";
import { Link, useNavigate } from "react-router-dom";
import useWindowSize from "./../../Utils/useWindowSize";
import About from "./../../Pages/About";

const Navbar = () => {
  const size = useWindowSize();
  const auth = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };
  const [showSlideMenu, setShowSlideMenu] = useState(false);
  useEffect(() => {
    setShowSlideMenu(false);
  }, [size]);
  return (
    <>
      <Nav>
        <NavLinkLogoText to="/">E-Library</NavLinkLogoText>
        <Bars onClick={() => setShowSlideMenu(!showSlideMenu)} />
        <NavMenu>
          {JSON.parse(sessionStorage.getItem("user"))?.Role === 0 && (
            <NavLink to="/ManageUsers">Manage Users</NavLink>
          )}
          {JSON.parse(sessionStorage.getItem("user"))?.Role === 1 && (
            <NavLink to="/ManageBooks">Manage Books</NavLink>
          )}
          <NavLink to="/about">About</NavLink>
        </NavMenu>
        <NavBtn>
          <NavUserName>
            Welcome {JSON.parse(sessionStorage.getItem("user"))?.FirstName}!
          </NavUserName>
          <NavBtnLink onClick={handleLogout}>Logout</NavBtnLink>
        </NavBtn>
      </Nav>
      {showSlideMenu && (
        <aside
          className="w-64  drop-shadow-lg rounded-md"
          aria-label="Sidebar"
          style={{ position: "absolute" }}
        >
          <div className="overflow-y-auto py-4 px-3 bg-gray-100 rounded dark:bg-gray-800">
            <ul className="space-y-2">
              <li style={{ textAlign: "center" }}>
                <NavUserName>
                  Welcome{" "}
                  {JSON.parse(sessionStorage.getItem("user"))?.FirstName}!
                </NavUserName>
              </li>
              <li style={{ textAlign: "center" }}>
                <NavBtnLink onClick={handleLogout}>Logout</NavBtnLink>
              </li>
              <li>
                <Link
                  onClick={() => setShowSlideMenu(false)}
                  to="/"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 hover:bg-blue-500 hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-6 h-6 text-black transition duration-75 group-hover:text-gray-900 "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Dashboard
                  </span>
                </Link>
              </li>
              {JSON.parse(sessionStorage.getItem("user"))?.Role === 1 && (
                <li>
                  <Link
                    onClick={() => setShowSlideMenu(false)}
                    to="/ManageBooks"
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      className="flex-shrink-0 w-6 h-6 text-black transition duration-75 group-hover:text-gray-900 "
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 5.234s-2.25-.527-4.5 0c-2.25.528-4.5 2.11-4.5 2.11V20s2.25-1.582 4.5-2.11c2.25-.527 4.5 0 4.5 0V5.235zM3 5.234s2.25-.527 4.5 0c2.25.528 4.5 2.11 4.5 2.11V20s-2.25-1.582-4.5-2.11c-2.25-.527-4.5 0-4.5 0V5.235z"
                        stroke="#000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Manage Books
                    </span>
                  </Link>
                </li>
              )}
              {JSON.parse(sessionStorage.getItem("user"))?.Role === 0 && (
                <li>
                  <Link
                    onClick={() => setShowSlideMenu(false)}
                    to="/ManageUsers"
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 w-6 h-6 text-black transition duration-75 group-hover:text-gray-900 "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Manage Users
                    </span>
                  </Link>
                </li>
              )}
              <li>
                <Link
                  onClick={() => setShowSlideMenu(false)}
                  to="/about"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white dark:hover:bg-gray-700 hover:bg-blue-500 hover:text-white group-hover:fill-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="flex-shrink-0 w-6 h-6 text-black transition duration-75 group-hover:text-gray-900 "
                    fill="currentColor"
                    space="preserve"
                  >
                    <g data-name="26.Information">
                      <path d="M12 24a12 12 0 1 1 12-12 12.013 12.013 0 0 1-12 12zm0-22a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2z" />
                      <path d="M15 19h-4v-8H9V9h4v8h2v2zM11 5h2v2h-2z" />
                    </g>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">About</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      )}
    </>
  );
};

export default Navbar;
