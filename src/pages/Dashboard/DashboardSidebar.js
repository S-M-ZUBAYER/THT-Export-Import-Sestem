import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import { AiOutlineDashboard, AiOutlineExport, AiOutlineImport } from "react-icons/ai"; // Importing icons
import { MdAddToPhotos, MdAccountBalance, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaShippingFast, FaBoxOpen } from "react-icons/fa";
import { BiWorld, BiSolidPurchaseTag } from "react-icons/bi";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { FiPrinter } from "react-icons/fi";
import { FcPrint } from "react-icons/fc";
import { GiTakeMyMoney } from "react-icons/gi";
import { TbBrandElectronicArts } from "react-icons/tb";



const navLinks = [
  {
    path: "/dashboard",
    display: "Dashboard",
    icon: <AiOutlineDashboard />, // Dashboard icon
  },
  {
    path: "/newproduct",
    display: "Add New Product",
    icon: <MdOutlineProductionQuantityLimits />, // Export icon
  },
  {
    path: "/newbrand",
    display: "Add New Brand",
    icon: <TbBrandElectronicArts />, // Import icon
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
  {
    path: "/datainput",
    display: "Product Data Add",
    icon: < MdAddToPhotos />,
  },
  {
    path: "/transportroutes",
    display: "Transport Way",
    icon: <FaShippingFast />,
  },
  {
    path: "/transportcountry",
    display: "Transport Country",
    icon: <BiWorld />,
  },
  {
    path: "/addcharges",
    display: "Add Charges",
    icon: <FaMoneyBill1Wave />,
  },
  {
    path: "/accounts",
    display: "Accounts",
    icon: <MdAccountBalance />,
  },
  {
    path: "/productinboxes",
    display: "Product In Boxes",
    icon: <FaBoxOpen />,
  },
  {
    path: "/printInitialData",
    display: "Print Initial Data",
    icon: <FiPrinter />,
  },
  {
    path: "/purchase",
    display: "Purchase",
    icon: <BiSolidPurchaseTag />,
  },
  {
    path: "/finance",
    display: "Finance",
    icon: <GiTakeMyMoney />,
  },
  {
    path: "/finaldata",
    display: "Final Data",
    icon: <FcPrint />,
  },
];

const DashboardSidebar = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      <div
        className={`${open ? "w-80" : "w-16"
          } duration-300 h-screen bg-cyan-500 text-white relative`}>

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
        <div className="flex flex-col space-y-3 mt-5">
          {navLinks.map((item, index) => (
            <NavLink
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
