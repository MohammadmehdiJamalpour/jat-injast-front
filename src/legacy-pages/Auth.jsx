import React from "react";
import AuthContainer from "../features/authentication/AuthContainer";

function auth() {
  return (
    <div className=" md:container xl:max-w-8xl flex justify-center items-center h-screen">
      <AuthContainer />
    </div>
  );
}

export default auth;
