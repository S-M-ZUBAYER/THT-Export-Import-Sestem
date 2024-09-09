import React from "react";
import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className="max-h-screen mb-6">
      <h1 className="text-xl md:text-4xl mt-10 text-center font-bold text-violet-500 uppercase tracking-wide">
        Add Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 justify-center mt-7 mx-[35px] md:mx-3">
        <Link
          to="/newproduct"
          className="btn btn-info w-60 p-2 text-white font-bold text-xl mt-4">
          New Product Add
        </Link>
        <Link
          to="/newbrand"
          className="btn btn-info w-60 p-2 text-white font-bold text-xl mt-4">
          New Brand Add
        </Link>
      </div>
    </div>
  );
};

export default Admin;
