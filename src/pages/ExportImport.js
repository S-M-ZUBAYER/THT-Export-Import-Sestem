import React from "react";
import { Link } from "react-router-dom";

const ExportImport = () => {
  return (
    <div className="max-h-screen mb-6">
      <h1 className="text-xl md:text-4xl mt-10 text-center font-bold text-violet-500 uppercase tracking-wide">
        Add Services
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 justify-center mt-7 mx-[35px] md:mx-3">
        {/* <Link
          to="/newproduct"
          className="btn btn-info w-60 p-2 text-white font-bold text-xl mt-4">
          New Product Add
        </Link>
        <Link
          to="/newbrand"
          className="btn btn-info w-60 p-2 text-white font-bold text-xl mt-4">
          New Brand Add
        </Link> */}
        <Link
          to="/datainput"
          className="btn btn-info w-60 p-2 text-white font-bold text-xl mt-4">
          Product Data Add
        </Link>
        <Link
          to="/transportroutes"
          className="btn btn-info w-60 p-2 text-white font-bold text-xl mt-4">
          Transport Way
        </Link>
        <Link
          to="/transportcountry"
          className="btn btn-info w-60 p-1 text-white font-bold text-xl mt-4">
          Transport Country
        </Link>
        {/* <button className="btn btn-info w-60 p-1 text-white font-bold text-xl mt-4">
          <Link to="/transportservice">Transport Service</Link>
        </button> */}
        <Link
          to="/addcharges"
          className="btn btn-info w-60 p-1 text-white font-bold text-xl mt-4">
          Add Charges
        </Link>
        <Link
          to="/accounts"
          className="btn btn-info w-60 p-1 text-white font-bold text-xl mt-4">
          Accounts
        </Link>
        <Link
          to="/productinboxes"
          className="btn btn-info w-60 p-1 text-white font-bold text-xl mt-4">
          Product In Boxes
        </Link>
        <Link
          to="/purchase"
          className="btn btn-info w-60 p-1 text-white font-bold text-xl mt-4">
          Purchase
        </Link>
        <Link
          to="/finance"
          className="btn btn-info w-60 p-1 text-white font-bold text-xl mt-4">
          Finance
        </Link>
        <Link
          to="/finaldata"
          className="btn btn-info w-60 p-1 text-white font-bold text-xl mt-4">
          Final Data
        </Link>
      </div>
    </div>
  );
};

export default ExportImport;
