import React, { useContext, useState } from "react";
import { json, Link, NavLink } from "react-router-dom";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import { AiOutlineDashboard, AiOutlineExport, AiOutlineImport } from "react-icons/ai"; // Importing icons
import { MdAddToPhotos, MdAccountBalance, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaShippingFast, FaBoxOpen } from "react-icons/fa";
import { BiWorld, BiSolidPurchaseTag, BiSolidPurchaseTagAlt } from "react-icons/bi";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { FiPrinter } from "react-icons/fi";
import { FcPrint } from "react-icons/fc";
import { GiTakeMyMoney } from "react-icons/gi";
import { TbBrandElectronicArts } from "react-icons/tb";





const DashboardSidebar = ({ children }) => {
  const [open, setOpen] = useState(true);
  const user = localStorage.getItem("user")

  const navLinks = [
    {
      path: "/dashboard",
      display: "Dashboard",
      icon: <AiOutlineDashboard />, // Dashboard icon
    },
    user && JSON.parse(user)?.role === "Product Manager" && {
      path: "/newproduct",
      display: "Add New Product",
      icon: <MdOutlineProductionQuantityLimits />, // Export icon
    },
    user && JSON.parse(user)?.role === "Product Manager" && {
      path: "/newbrand",
      display: "Add New Brand",
      icon: <TbBrandElectronicArts />, // Import icon
    },
    user && JSON.parse(user)?.role === "Product Manager" && {
      path: "/transportroutes",
      display: "Transport Way",
      icon: <FaShippingFast />,
    },
    user && JSON.parse(user)?.role === "Product Manager" && {
      path: "/transportcountry",
      display: "Destination Country",
      icon: <BiWorld />,
    },

    // {
    //   path: "/export",
    //   display: "Export",
    //   icon: <AiOutlineExport />, // Export icon
    // },
    // {
    //   path: "/import",
    //   display: "Import",
    //   icon: <AiOutlineImport />, // Import icon
    // },
    // Adding new links here
    user && JSON.parse(user)?.role === "Product Manager" && {
      path: "/datainput",
      display: "Product Data Entry",
      icon: < MdAddToPhotos />,
    },
    user && JSON.parse(user)?.role === "Product Manager" && {
      path: "/accounts",
      display: "Product Export Summary",
      icon: <MdAccountBalance />,
    },
    user && JSON.parse(user)?.role === "Product Manager" && {
      path: "/productinboxes",
      display: "Product Palletizing",
      icon: <FaBoxOpen />,
    },
    user && JSON.parse(user)?.role === "Product Manager" && {
      path: "/printInitialData",
      display: "Pallet info Printing",
      icon: <FiPrinter />,
    },
    user && JSON.parse(user)?.role === "Commercial Manager" && {
      path: "/AddCAndFLevel",
      display: "Add C&F Level",
      icon: <MdOutlineProductionQuantityLimits />, // Export icon
    },
    user && JSON.parse(user)?.role === "Commercial Manager" && {
      path: "/addcharges",
      display: "Add Charges",
      icon: <FaMoneyBill1Wave />,
    },
    user && JSON.parse(user)?.role === "Commercial Manager" && {
      path: "/export",
      display: "Export Initial Data Entry",
      icon: <BiSolidPurchaseTag />,
    },
    user && JSON.parse(user)?.role === "Commercial Manager" && {
      path: "/exportAndFinance",
      display: "Export Finance Data Entry",
      icon: <BiSolidPurchaseTag />,
    },
    user && JSON.parse(user)?.role === "Commercial Manager" && {
      path: "/finalExport",
      display: "Final Export Checking",
      icon: <BiSolidPurchaseTagAlt />,
    },
    user && JSON.parse(user)?.role === "Finance" && {
      path: "/finance",
      display: "Finance Checking",
      icon: <GiTakeMyMoney />,
    },
    {
      path: "/finaldata",
      display: "Final Data Display",
      icon: <FcPrint />,
    },
  ];


  return (
    <div className="flex">
      <div
        className={`${open ? "w-80" : "w-16"
          } duration-300 h-full bg-cyan-500 text-white relative`}>

        {/* Toggle Sidebar Button */}
        <button
          className={`absolute cursor-pointer rounded-full bg-cyan-500 p-2 text-white -right-3 top-9 transform transition-transform ${!open ? "rotate-180" : ""
            }`}
          onClick={() => setOpen(!open)}
        >
          {/* {open === false ? <TfiAngleRight /> : <TfiAngleLeft />} */}
          {
            open ? <TfiAngleLeft /> : <TfiAngleRight />
          }

        </button>


        {/* Navigation Links */}
        <div className="flex flex-col space-y-3 mt-5 h-screen">
          {navLinks.map((item, index) => (
            item && <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-x-4 pl-4 py-2 text-lg font-semibold rounded-md transition-all ${isActive ? "bg-cyan-800" : "hover:bg-blue-300"
                }`
              }>
              <span className="text-2xl">{item.icon}</span>
              <span className={`${!open && "hidden"} origin-left duration-300`}>
                {item.display}
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {/* <div className=" w-3/5 p-5">{children}</div> */}
    </div>
  );
};

export default DashboardSidebar;
