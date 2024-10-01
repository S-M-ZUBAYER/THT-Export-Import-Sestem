
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { ClipLoader } from "react-spinners";

// // loader css style
// const override = {
//   display: "block",
//   margin: "25px auto",
// };

// const Finance = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [boxData, setBoxData] = useState([]);
//   const [totalBox, setTotalBox] = useState([]);
//   const [totalQuantity, setTotalQuantity] = useState([]);
//   const [selectedBEDate, setSelectedBEDate] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [exim, setExim] = useState("");
//   const [beNumber, setBENumber] = useState("");
//   const [totalNetWeight, setTotalNetWeight] = useState(0);
//   const [palletRemarks, setPalletRemarks] = useState("Pallet");
//   const [loading, setLoading] = useState(true);
//   const [totalPalletCount, setTotalPalletCount] = useState(0);
//   const [financeData, setFinanceData] = useState({});

//   const navigate = useNavigate();

//   useEffect(() => {
//     setLoading(true);
//     fetchExpenses();
//   }, []);

//   // Fetch data from the API
//   const fetchExpenses = async () => {
//     try {
//       const response = await axios.get(
//         "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase"
//       );
//       const sortedData = response?.data.sort((a, b) => b.id - a.id);
//       console.log(sortedData, "expenses");

//       setExpenses(sortedData);
//       setLoading(false);
//     } catch (error) {
//       toast.error("Error from server to get data!!");
//     }
//   };

//   // Fetch data from API
//   useEffect(() => {
//     axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase')
//       .then(response => {
//         const finalPurchases = response.data.filter((purchase) => purchase.status === "purchase"
//         )
//         setFinalPurchases(finalPurchases);
//         setFilteredPurchases(finalPurchases);
//       }
//       )
//       .catch(error => toast.error('Failed to fetch data!'));
//   }, []);

//   const handleEXIMChange = (e) => {
//     setExim(e.target.value);
//   };

//   const handleBENumberChange = (e) => {
//     setBENumber(e.target.value);
//   };

//   const handletotalNetWeightChange = (e) => {
//     setTotalNetWeight(e.target.value);
//   };

//   const handleRowClick = (rowData) => {
//     setFormData(rowData);
//     const matchingPallets = rowData.purchaseProductInBoxes.map(
//       (box) => box.totalPallet
//     );
//     const totalPalletCount = matchingPallets.length;
//     setTotalPalletCount(totalPalletCount);

//     const productNameArray = rowData.purchaseProductInBoxes.map(
//       (item) => item.productName
//     );
//     const productModelArray = rowData.purchaseProductInBoxes.map((item) =>
//       item.productModel.split(",").join(", ")
//     );
//     const totalBoxAndQuantity = () => {
//       let sum = 0;
//       let sum2 = 0;
//       rowData.purchaseProductInBoxes.forEach((item) => {
//         sum += item.totalBox;
//         sum2 += item.quantity;
//       });
//       setTotalBox(sum);
//       setTotalQuantity(sum2)
//     };
//     totalBoxAndQuantity();
//     console.log(totalBox, totalQuantity);

//     setFormData((prevData) => ({
//       ...prevData,
//       productName: JSON.stringify(productNameArray),
//       productModel: JSON.stringify(productModelArray),
//     }));
//   };

//   const handleInputChange = (e) => {
//     console.log("click");

//     const { name, value } = e.target;
//     console.log(name, value)
//     if (name === "ipNo") {
//       setFormData({ ...formData, epNO: value });
//     }
//     else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleAddNewData = () => {
//     console.log(formData);
//     const data = {
//       selectedBEDate,
//       epNo: formData.ipNo,
//       exim,
//       beNumber,
//       totalNetWeight: parseFloat(totalNetWeight),
//       totalPalletQuantity: parseFloat(totalPalletCount),
//       palletRemarks,
//       totalBox: totalBox,
//       totalQuantity: totalQuantity
//     };
//     // setFormData((prevData) => ({
//     //   ...prevData,
//     //   ...data,
//     // }));
//     setFormData((prevData) => {
//       const { purchaseProductInBoxes, ...rest } = prevData; // Destructure and remove purchaseProductInBoxes
//       return {
//         ...rest,  // Spread the rest of the data (without purchaseProductInBoxes)
//         ...data,  // Add the new data
//       };
//     });
//     // setFinanceData({ ...formData, ...data })
//     toast.success("Successfully data merged. Save Now", {
//       position: "top-center",
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log(formData, "formdata");
//     // console.log(financeData, "financedata");


//     axios
//       .post(
//         "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance",
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       .then((res) => {
//         toast.success("Successfully Uploaded to server", {
//           position: "top-center",
//         });
//         navigate("/finaldata");
//       })
//       .catch((err) =>
//         toast.error("This error coming from server please try again later!!", {
//           position: "top-center",
//         })
//       );
//   };

//   return (
//     <div>
//       <h1 className="flex justify-center items-center text-4xl my-4 uppercase text-info font-bold">
//         Finance
//       </h1>
//       <p className="text-red-600 text-sm text-center font-medium">
//         ** Please Fill up this form carefully. You can't modify it later **
//       </p>
//       <div>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-6 mx-4">
//             {/* B/E Number */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="beNumber">
//                 B/E Number
//               </label>
//               <input
//                 className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
//                 placeholder="Enter B/E Number"
//                 type="text"
//                 required
//                 name="beNumber"
//                 onChange={handleBENumberChange}
//               />
//             </div>
//             {/* B/E Date */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="bedate">
//                 B/E Date
//               </label>
//               <input
//                 type="date"
//                 onChange={(e) => setSelectedBEDate(e.target.value)}
//                 className="border rounded-xl w-60 p-[13px] lg:p-[13px] mt-1 text-gray-700 leading-tight"
//                 required
//               />
//             </div>
//             {/* Export/Import */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="exim">
//                 Export/Import
//               </label>
//               <select
//                 className="select border-2 border-gray-100 w-full"
//                 id="exim"
//                 name="exim"
//                 required
//                 onChange={handleEXIMChange}
//               >
//                 <option value="">--Select Type --</option>
//                 <option value="export">Export</option>
//                 <option value="import">Import</option>
//               </select>
//             </div>
//             {/* Invoice No */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="invoiceNo">
//                 Invoice Number
//               </label>
//               <input
//                 className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
//                 placeholder="Invoice Number"
//                 type="text"
//                 name="invoiceNo"
//                 value={formData.invoiceNo || ""}
//                 onChange={handleInputChange}
//               />
//             </div>
//             {/* EP Number */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="ipNo">
//                 EP Number
//               </label>
//               <input
//                 className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
//                 placeholder="Enter IP Number"
//                 type="text"
//                 name="ipNo"
//                 value={formData.ipNo || ""}
//                 onChange={handleInputChange}
//               />
//             </div>
//             {/* Truck No */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="ipNo">
//                 Truck No
//               </label>
//               <input
//                 className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
//                 placeholder="Enter Truck Number"
//                 type="text"
//                 name="truckNo"
//                 value={formData.truckNo || ""}
//                 onChange={handleInputChange}
//               />
//             </div>


//             {/* Total Expenses */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="total">
//                 Total Expenses
//               </label>
//               <input
//                 className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
//                 placeholder="Total Expenses"
//                 type="text"
//                 name="total"
//                 readOnly
//                 value={formData.total || ""}
//                 onChange={handleInputChange}
//               />
//             </div>


//             {/* Particular Expenses cost */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="totalCost">
//                 Particular Expenses cost
//               </label>
//               <input
//                 className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
//                 type="text"
//                 readOnly
//                 name="totalCost"
//                 value={formData.totalCost || ""}
//                 onChange={handleInputChange}
//               />
//             </div>
//             {/* Product Name */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="productName">
//                 Product Name
//               </label>
//               <textarea
//                 className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
//                 readOnly
//                 name="productName"
//                 value={formData.productName || ""}
//                 onChange={handleInputChange}
//               />
//             </div>
//             {/* Product Model */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="productModel">
//                 Product Model
//               </label>
//               <textarea
//                 className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
//                 readOnly
//                 name="productModel"
//                 value={formData.productModel || ""}
//                 onChange={handleInputChange}
//               />
//             </div>
//             {/* Total Net Weight */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="totalNetWeight">
//                 Net Weight
//               </label>
//               <input
//                 className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
//                 placeholder="Enter Total Net Weight"
//                 type="text"
//                 required
//                 onChange={handletotalNetWeightChange}
//               />
//             </div>
//             {/* Total Pallet Quantity */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="totalPallet">
//                 Total Pallet Quantity
//               </label>
//               <input
//                 className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
//                 type="text"
//                 value={totalPalletCount}
//                 readOnly
//                 name="totalPallet"
//                 onChange={handleInputChange}
//               />
//             </div>
//             {/* Pallet Remarks */}
//             <div>
//               <label className="text-lg font-semibold" htmlFor="palletRemarks">
//                 Pallet Remarks
//               </label>
//               <input
//                 className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
//                 placeholder="Remarks..."
//                 type="text"
//                 value={palletRemarks}
//                 onChange={(e) => setPalletRemarks(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="flex justify-center items-center my-3">
//             <button
//               type="button"
//               className="text-lg btn btn-outline btn-info"
//               onClick={handleAddNewData}
//             >
//               Merge Data
//             </button>
//             <button
//               type="submit"
//               className="text-lg btn btn-outline btn-warning mx-3"
//             >
//               Save Now
//             </button>
//           </div>
//         </form>
//       </div>

//       <h2 className="text-center my-6 text-3xl font-bold text-warning">
//         Last Expenses Data
//       </h2>
//       {/* Expenses table */}
//       <div className="container mx-auto px-4">
//         {loading ? (
//           <ClipLoader color="#36d7b7" size={80} cssOverride={override} />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white border border-gray-300">
//               <thead>
//                 <tr className="text-center">
//                   <th className="py-2 border-b">ID</th>
//                   <th className="py-2 border-b">Invoice Number</th>
//                   <th className="py-2 border-b">Total</th>
//                   <th className="py-2 border-b">Particular Expenses</th>
//                   <th className="py-2 border-b">EP Number</th>
//                   <th className="py-2 border-b">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {expenses.length > 0 ? (
//                   expenses.map((expense) => (
//                     <tr
//                       key={expense.id}
//                       className="text-center hover:bg-gray-100"
//                     >
//                       <td className="py-2 border-b">{expense.id}</td>
//                       <td className="py-2 border-b">{expense.invoiceNo}</td>
//                       <td className="py-2 border-b">{expense.total}</td>
//                       <td className="py-2 border-b">{expense.totalCost}</td>
//                       <td className="py-2 border-b">{expense.ipNo}</td>
//                       <td className="py-2 border-b">
//                         <button
//                           className="text-sm text-white py-1 px-2 bg-blue-500 hover:bg-blue-600 rounded-md"
//                           onClick={() => handleRowClick(expense)}
//                         >
//                           Select
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="text-center py-4">
//                       No data found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Finance;
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../../components/context/authContext';

const Finance = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const { financeDetailsData, setFinanceDetailsData } = useContext(UserContext)
  console.log(financeDetailsData, "financeDetails");

  // Fetch data from API
  useEffect(() => {
    axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase')
      .then(response => {
        const finalPurchases = response.data.filter((purchase) => purchase.status === "finalPurchase");
        setPurchases(finalPurchases);
        setFilteredPurchases(finalPurchases);
      })
      .catch(error => toast.error('Failed to fetch data!'));
  }, []);

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
          Shipment Details Show And Update
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
          <table className="min-w-full bg-white">
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
                        to={`/purchase-details/${purchase.id}`}
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
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
