import React from 'react';

function HomeHeader() {
  return (
    <header>
      {/* Mobile image: visible on small screens */}
      <img
        className="block sm:hidden w-full h-[80vh] object-cover"
        src="/mobile.jpg"
        alt="Mobile view"
      />

      {/* Desktop image: visible on larger screens */}
      <img
        className="hidden sm:block w-full h-[80vh] object-cover"
        src="/desktop.jpg"
        alt="Desktop view"
      />
    </header>
  );
}

export default HomeHeader;
