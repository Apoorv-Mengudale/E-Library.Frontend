import React, { createContext, useContext, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import { Wrapper } from "./Css/loaderElements";

const LoaderContext = createContext(null);
export const Loader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const setLoading = (value) => {
    setIsLoading(value);
  };

  return (
    <>
      <LoaderContext.Provider value={{ isLoading, setLoading }}>
        {isLoading && (
          <Wrapper>
            <PuffLoader color="#fff" />
          </Wrapper>
        )}
        {children}
      </LoaderContext.Provider>
    </>
  );
};
export const useLoader = () => {
  return useContext(LoaderContext);
};
