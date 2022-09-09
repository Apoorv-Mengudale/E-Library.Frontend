import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  background: #000;
  height: 55px;
  display: flex;
  justify-content: space-around;
  padding: 0.5rem calc((100vw - 2000px) / 2);
  z-index: 10;
`;

export const NavLink = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;

  &.active {
    color: #5ac8fa;
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #fff;

  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(100%, 50%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 24px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled.a`
  border-radius: 4px;
  background: #3f83f8;
  padding: 8px 20px;
  color: #fff;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-left: 24px;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }

  @media screen and (max-width: 768px) {
    color: #fff;
    align-items: center;
    text-decoration: none;
    background: #3f83f8;
    opacity: 0.8;
    &:hover {
      transition: all 0.2s ease-in-out;
      background: #3f83f8;
      color: #fff;
      opacity: 1;
    }
  }
`;

export const NavLinkLogoText = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  font-size: 1.5em;
  &:hover {
    transition: all 0.2s ease-out;
    transform: scale(1.04);
  }
`;

export const NavUserName = styled.span`
  color: #fff;

  @media screen and (max-width: 768px) {
    color: #000;
    align-items: center;
    text-decoration: none;
  }
`;
