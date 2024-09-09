import React from "react";
import Routers from "../../routers/Routers";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Layout = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto flex-grow">
          <Routers />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
