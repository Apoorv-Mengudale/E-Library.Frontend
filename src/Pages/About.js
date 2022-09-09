import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Components/Auth";
const About = () => {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  const auth = useAuth();
  let _headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth.user.Token,
    },
  };
  useEffect(() => {
    // axios.get("/Users", _headers).then((res) => {
    //   console.log(res);
    // });
  }, []);
  return (
    <>
      <div>About</div>
    </>
  );
};

export default About;
