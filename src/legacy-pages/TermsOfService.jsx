import React from "react";
import TermsContainer from './../components/terms/TermsContainer.jsx';
import Footer from "../components/Footer";

function TermsOfService() {
  return (
    <div className="mt-20 md:mt-24">
      <div className="mx-2">
        <TermsContainer />
      </div>
      <Footer mode="static" />
    </div>
  );
}

export default TermsOfService;
