import styled from "styled-components";

export const CardWrapper = styled.div`
  overflow: hidden;
  width: 300px;
  height: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05), 0 0px 40px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
`;

export const CardHeading = styled.h1`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  color: #000;
`;

export const CardBody = styled.div`
  padding-right: 32px;
  padding-left: 32px;
`;

export const CardInput = styled.input`
  padding: 10px 10px;
  margin: 15px 0px;
  width: 100%;
  font-family: inherit;
  font-size: 14px;
  border-top: 0;
  border-right: 0;
  border-bottom: 1px solid #ddd;
  border-left: 0;
  transition: border-bottom-color 0.25s ease-in;
  background: transparent;
  color: #000;
  &:focus {
    outline: 0;
  }
  &::placeholder {
    color: #666;
    opacity: 0.7;
  }
`;

export const CardFieldset = styled.fieldset`
  position: relative;
  padding: 0;
  margin: 0;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & + & {
    margin-top: 24px;
  }

  &:nth-last-of-type(2) {
    margin-top: 32px;
  }
`;

export const CardButton = styled.button`
  padding: 10px 10px;
  margin: 15px 0px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  text-align: center;
  border: none;
  background-size: 300% 100%;
  border-radius: 5px;
  moz-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
  background-color: #5886d1;
  &:hover {
    background-position: 100% 0;
    moz-transition: all 0.4s ease-in-out;
    -o-transition: all 0.4s ease-in-out;
    -webkit-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
    background-image: linear-gradient(
      to right,
      #50aae9,
      #3366b8,
      #70aaef,
      #3f86ed
    );
    box-shadow: 0 4px 15px 0 rgba(65, 132, 234, 0.75);
  }

  &:focus {
    outline: none;
  }
`;

export const CardLink = styled.a`
  font-size: 10px;
  text-decoration: none;
  color: #777;
  cursor: pointer;
  transition: color 0.25s ease-in;
  align-self: self-end;
  &:hover {
    color: #2a5eb2;
  }
`;
