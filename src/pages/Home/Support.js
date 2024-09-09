import React from "react";
import Account from "../../assets/account.jpg";
import Warehouse from "../../assets/warehouse.jpg";
import Admin from "../../assets/admin.jpg";
import ParagraphModal from "./ParagraphModal";

const Support = () => {
  return (
    <div className="w-full mt-14 mb-11">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-purple-600">
          Know About Works
        </h1>
        <div className="lg:flex max-w-xl lg:max-w-7xl mx-auto gap-8 mt-12 group">
          <div className="bg-white/5 shadow-xl group-hover:blur-sm hover:!blur-none hover:translate-[1.2] p-8 rounded-xl hover:bg-lime-200 hover:scale-110 ease-in-out duration-300">
            <img
              src={Account}
              alt="Test"
              className="h-56 mx-auto rounded-lg object-cover"
            />
            <h1 className="uppercase text-xl font-bold mt-2">Accounts</h1>
            <ParagraphModal
              text={`Accounts manage financial transactions, record income, expenses,
              and assets. They provide a clear overview of a company's financial
              health. Account types include assets, liabilities, equity, income,
              and expenses. Proper accounting ensures accurate financial
              reporting, tax compliance, and informed decision-making for
              businesses and individuals.`}
            />
          </div>
          <div className="bg-white/5 shadow-xl group-hover:blur-sm hover:!blur-none hover:translate-[1.2] p-8 rounded-xl hover:bg-lime-200 hover:scale-110 ease-in-out duration-300">
            <img
              src={Warehouse}
              alt="Test"
              className="h-56 mx-auto rounded-lg object-cover"
            />
            <h1 className="uppercase text-xl font-bold mt-2">Warehouse</h1>
            <ParagraphModal
              text={`Warehouse work involves managing inventory, storing goods, and
              coordinating shipments. Workers handle receiving, picking,
              packing, and shipping products. Efficient warehouse operations
              ensure timely deliveries, minimize stockouts, and optimize space
              utilization. It's crucial for smooth supply chain management and
              customer satisfaction in various industries.`}
            />
          </div>
          <div className="bg-white/5 shadow-xl group-hover:blur-sm hover:!blur-none hover:translate-[1.2] p-8 rounded-xl hover:bg-lime-200 hover:scale-110 ease-in-out duration-300">
            <img
              src={Admin}
              alt="Test"
              className="h-56 mx-auto rounded-lg object-cover"
            />
            <h1 className="uppercase text-xl font-bold mt-2">Admin</h1>
            <ParagraphModal
              text={`An admin dashboard is a web interface that allows administrators
              to monitor and manage various aspects of a system or application.
              It provides insights into user activity, data analytics, system
              health, and configuration settings. Admin dashboards enhance
              decision-making and streamline operations, leading to improved
              efficiency and informed strategic choices.`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
