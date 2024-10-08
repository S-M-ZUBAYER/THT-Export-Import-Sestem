import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../../components/context/authContext';
import { ClipLoader } from 'react-spinners';

const Finance = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const { financeDetailsData, setFinanceDetailsData } = useContext(UserContext);
  const [financeDataLoading, setFinanceDataLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    setFinanceDataLoading(true); // Start loading before making the request
    axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance')
      .then(response => {
        const sortedData = response?.data.sort((a, b) => b.id - a.id);
        const finance = sortedData.filter(purchase => purchase.status !== "finalData");

        setPurchases(finance);
        setFilteredPurchases(finance);
      })
      .catch(error => {
        toast.error('Failed to fetch data!');
      })
      .finally(() => {
        setFinanceDataLoading(false); // Ensure loading is stopped after both success or failure
      });
  }, []);

  // useEffect(() => {
  //   axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase')
  //     .then(response => {
  //       const finalPurchases = response.data.filter((purchase) => purchase.status === "finalPurchase");
  //       setPurchases(finalPurchases);
  //       setFilteredPurchases(finalPurchases);
  //     })
  //     .catch(error => toast.error('Failed to fetch data!'));
  // }, []);
  // loader css style
  const override = {
    display: "block",
    margin: "25px auto",
  };

  // Handle input change and filter purchases
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    const filteredProducts = purchases.filter((account) =>
      account.transportWay.toLowerCase().includes(value) ||
      account.truckNo.toLowerCase().includes(value) ||
      account.transportCountry.toLowerCase().includes(value) ||
      account.date.toLowerCase().includes(value) ||
      account.invoiceNo.toLowerCase().includes(value) ||
      account.EpNo.toLowerCase().includes(value)
    );
    setFilteredPurchases(filteredProducts);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="">
        <h1 className="flex justify-center items-center text-4xl my-4 uppercase text-info font-bold">
          Shipment Details Show And Update From Finance
        </h1>
        <p className="text-red-600 text-sm text-center font-medium">
          ** Please Fill up this form carefully & check all fields. You can't modify it later. **
        </p>

        <div className="w-full lg:w-3/4 mx-auto">
          <div className="flex justify-between items-center my-6 bg-slate-500 p-3 rounded-lg">
            <h1 className="text-3xl text-info font-bold uppercase">Select the Product</h1>
            <input
              type="text"
              placeholder="Search by date, model, pallet no, truck no"
              className="border border-gray-300 p-2 rounded-md focus:outline-none"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>

          {/* Purchases Table */}
          {financeDataLoading ? (
            <div >
              <ClipLoader
                color={"#36d7b7"}
                loading={financeDataLoading}
                size={50}
                cssOverride={override}
              />
              <p className="text-center font-extralight text-xl text-green-400">
                Please wait ....
              </p>
            </div>
          ) : <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-200 text-left">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Transport Way</th>
                <th className="py-2 px-4">Country</th>
                <th className="py-2 px-4">Invoice No</th>
                <th className="py-2 px-4">Total Cost</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b">
                    <td className="py-2 px-4">{purchase.id}</td>
                    <td className="py-2 px-4">{purchase.transportWay}</td>
                    <td className="py-2 px-4">{purchase.transportCountryName}</td>
                    <td className="py-2 px-4">{purchase.invoiceNo}</td>
                    <td className="py-2 px-4">{purchase.totalCost}</td>
                    <td className="py-2 px-4">
                      <Link
                        onClick={() => setFinanceDetailsData(purchase)}
                        to={`/finance-details/${purchase.id}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>}
        </div>
      </div>
    </div>
  );
};

export default Finance;
