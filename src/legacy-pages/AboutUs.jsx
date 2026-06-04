import React from 'react'
import AboutUsContainer from '../components/about-us/AboutUsContainer'
import Footer from '../components/Footer'

function AboutUs() {
  return (
    <div className="mt-20 md:mt-24">
      <div className="mx-2">
        <AboutUsContainer />
      </div>
      <Footer mode="static" />
    </div>
  )
}

export default AboutUs
