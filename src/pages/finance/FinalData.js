// import axios from "axios";
// import { toast } from "react-toastify";
// import { useState, useEffect } from "react";
// import ReactPaginate from "react-paginate";
// import { ClipLoader } from "react-spinners";
// import { useRef } from "react";
// import { generatePDF } from "./PrintablePage";
// import { addDays, format } from "date-fns";
// import { DateRangePicker } from "react-date-range";
// import { ShowDetailsModal } from "./ShowDetailsModal";

// // loader css style
// const override = {
//   display: "block",
//   margin: "25px auto",
// };

// const FinalData = () => {
//   const [finances, setFinances] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [itemsPerPage] = useState(5);
//   const componentPDF = useRef();
//   // const [showPrintable, setShowPrintable] = useState(false);
//   const [filteredData, setFilteredData] = useState([]);
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());
//   const [open, setOpen] = useState(false);
//   const [range, setRange] = useState([
//     {
//       startDate: new Date(),
//       endDate: addDays(new Date(), 7),
//       key: "selection",
//     },
//   ]);
//   const refOne = useRef([]);
//   const [selectedFinance, setSelectedFinance] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = (finance) => {
//     setSelectedFinance(finance);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedFinance(null);
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     setLoading(true);

//     fetchFinance();

//     // for date search option hide
//     document.addEventListener("keydown", hideOnEscape, true);
//     document.addEventListener("click", hideOnClickOutside, true);
//   }, []);

//   // for pagination function
//   const handlePageChange = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   // Data fetch from finance API
//   const fetchFinance = async () => {
//     try {
//       const response = await axios.get(
//         "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance"
//       );
//       const sortedData = response?.data.sort(
//         (a, b) => b.financeId - a.financeId
//       );
//       console.log(sortedData, "final data");

//       setFinances(sortedData);
//       setLoading(false);
//     } catch (error) {
//       toast.error("Error from server to get data!!");
//     }
//   };

//   // for date wise search functions start here
//   const hideOnEscape = (e) => {
//     if (e.key === "Escape") {
//       setOpen(false);
//     }
//   };

//   const hideOnClickOutside = (e) => {
//     if (refOne.current && !refOne.current.contains(e.target)) {
//       setOpen(false);
//     }
//   };

//   const handleSelect = (date) => {
//     // console.log(date);
//     const filtered = finances?.filter((product) => {
//       const productDateGet = new Date(product?.selectedBEDate);
//       const productDate = productDateGet;
//       // console.log(productDate);
//       return (
//         productDate >= date?.selection?.startDate &&
//         productDate <= date?.selection?.endDate
//       );
//     });
//     setStartDate(date.selection.startDate);
//     setEndDate(date.selection.endDate);
//     setFilteredData(filtered);
//   };
//   // console.log(finances.map((d) => d.selectedBEDate));
//   // console.log(startDate);
//   // console.log(endDate);
//   // console.log(filteredData.length);

//   const selectionRange = {
//     startDate: startDate,
//     endDate: endDate,
//     key: "selection",
//   };

//   // pagination calculation
//   const offset = currentPage * itemsPerPage;
//   // const currentData = finances.slice(offset, offset + itemsPerPage);
//   const currentData =
//     filteredData.length > 0
//       ? filteredData.slice(offset, offset + itemsPerPage)
//       : finances.slice(offset, offset + itemsPerPage);

//   // print and pdf function
//   const handlePrint = (finance) => {
//     // generatePDF(finances[currentPage]);
//     console.log(finance, "finance");
//     // return;
//     generatePDF(finance);
//   };

//   return (
//     <>
//       <div className="mb-3">
//         <h1 className="text-center my-4 text-3xl text-info font-bold bg-slate-500 p-3 rounded-lg uppercase">
//           Export Products List
//         </h1>
//         {/* search by date */}
//         <div className="mb-3 calendarWrap text-center w-3/4 mx-36">
//           <h3 className="mb-[8px] text-xl text-sky-400">Search by Date</h3>
//           <input
//             value={`${format(startDate, "MM/dd/yyyy")} to ${format(
//               endDate,
//               "MM/dd/yyyy"
//             )}`}
//             // readOnly
//             className="inputBox border-2 border-indigo-600 p-2 w-2/4 rounded text-center"
//             onClick={() => setOpen((open) => !open)}
//           />
//           <div ref={refOne} className="">
//             {open && (
//               <DateRangePicker
//                 className="flex justify-center calendarElement"
//                 onChange={handleSelect}
//                 // onChange={(item) => setRange([item.selection])}
//                 editableDateInputs={true}
//                 ranges={[selectionRange]}
//                 months={2}
//                 direction="horizontal"
//                 staticRanges={[]}
//                 inputRanges={[]}
//               />
//             )}
//           </div>
//         </div>
//         <div
//           className="overflow-x-auto mx-2 mb-2"
//           ref={componentPDF}
//           style={{ width: "100%" }}>
//           {loading ? (
//             <div className="">
//               <ClipLoader
//                 color={"#36d7b7"}
//                 loading={loading}
//                 size={50}
//                 cssOverride={override}
//               />
//               <p className="text-center font-extralight text-xl text-green-400">
//                 Please wait ....
//               </p>
//             </div>
//           ) : (
//             <table className="table">
//               <thead>
//                 <tr>
//                   {/* <th className="sticky top-0 bg-gray-200">ID</th> */}
//                   <th className="sticky top-0 bg-gray-200">BE Date</th>
//                   <th className="sticky top-0 bg-gray-200">Export/Import</th>
//                   <th className="sticky top-0 bg-gray-200">Invoice No</th>
//                   <th className="sticky top-0 bg-gray-200">
//                     Total <span className="text-red-600">(TK)</span>
//                   </th>
//                   <th className="sticky top-0 bg-gray-200">B/E No</th>
//                   <th className="sticky top-0 bg-gray-200">IP No</th>
//                   <th className="sticky top-0 bg-gray-200">Expenses List</th>
//                   <th className="sticky top-0 bg-gray-200">
//                     Total Expenses <span className="text-blue-600">(TK)</span>
//                   </th>
//                   <th className="sticky top-0 bg-gray-200">Products Name</th>

//                   <th className="sticky top-0 bg-gray-200">Net Weight</th>
//                   <th className="sticky top-0 bg-gray-200">Pallet Quantity</th>
//                   {/* <th className="sticky top-0 bg-gray-200">Remarks</th> */}
//                   <th className="sticky top-0 bg-gray-200">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentData?.map((finance) => {
//                   // const officeID = finance?.officeAccount;
//                   // console.log(officeID);
//                   // const matchedProducts = boxData?.filter((account) =>
//                   //   officeID?.includes(account.id)
//                   // );
//                   // console.log(matchedProducts);
//                   //   convert date string
//                   const dateString = finance.selectedBEDate;
//                   const dateObj = new Date(dateString);
//                   const localDate = dateObj.toLocaleDateString();
//                   const productParse = JSON.parse(finance?.productName);
//                   const pdName = productParse?.map((p) => p);
//                   let uniqueArray = Array.from(new Set(pdName));
//                   const printersString = uniqueArray.join(", ");
//                   // const productNameParse = JSON.parse(finance?.productName);
//                   // const uniqueArrayp = Array.from(new Set(productNameParse));
//                   // console.log(uniqueArrayp);
//                   return (
//                     <tr
//                       className={`hover cursor-pointer text-[12px]`}
//                       key={finance.financeId}>
//                       {/* <td>{finance.financeId}</td> */}
//                       <td>{localDate}</td>
//                       <td>{finance.exim}</td>
//                       <td>{finance.invoiceNo}</td>
//                       <td>{finance.total}</td>
//                       <td>{finance.beNumber}</td>
//                       <td>{finance.epNo}</td>
//                       <td>
//                         <ul>
//                           {finance.particularExpenseNames.map((ex) => (
//                             <li key={ex.expenseId}>
//                               {ex.particularExpenseName}-
//                               {ex.particularExpenseCost}-{ex.date}-{ex.remark}
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                       <td>{finance.totalCost}</td>
//                       <td>{printersString}</td>
//                       <td>{finance.totalNetWeight}</td>
//                       <td>{finance.totalPalletQuantity}</td>
//                       {/* <td>{finance.palletRemarks}</td> */}
//                       <td className="flex">
//                         <button
//                           onClick={() => openModal(finance)}
//                           className=" btn-accent font-bold px-[20px] py-[3px] mt-4 rounded-lg text-purple-950 hover:text-amber-500 mr-2"
//                         >
//                           Details
//                         </button>

//                         <button
//                           className="btn-info font-bold px-[20px] py-[3px] mt-4 rounded-lg text-purple-950 hover:text-amber-500"
//                           onClick={() => handlePrint(finance)}>
//                           Print
//                         </button>
//                       </td>
//                       {/* <td>
//                         <button onClick={() => handleDelete(expense?.id)}>
//                           <AiOutlineDelete className="w-6 h-6 text-red-600" />
//                         </button>
//                       </td> */}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* {currentData.length === 0 && (
//           <p className="text-center text-3xl text-red-600">
//             No products found for the selected date range
//           </p>
//         )} */}

//         {/* for pagination code */}
//         <ReactPaginate
//           previousLabel={"< Previous"}
//           nextLabel={"Next >"}
//           breakLabel={"..."}
//           // pageCount={Math.ceil(finances.length / itemsPerPage)}
//           pageCount={Math.ceil(
//             (filteredData.length > 0 ? filteredData.length : finances.length) /
//             itemsPerPage
//           )}
//           onPageChange={handlePageChange}
//           containerClassName={"pagination flex gap-2 justify-center mt-4"}
//           pageClassName={"page-item"}
//           pageLinkClassName={"page-link text-gray-800 px-2 py-2"}
//           activeClassName={"active bg-sky-300 rounded-md"}
//           className="flex items-center justify-center py-[4px]"
//         />
//         {/* <PrintableComponent finance={currentData[currentPage]} /> */}
//         {/* <button
//           className="btn-info font-bold px-7 py-2 mt-4 rounded-lg text-purple-950 hover:text-amber-500 w-1/4 mx-auto"
//           onClick={handlePrint}>
//           Print
//         </button> */}
//         {isModalOpen && (
//           <ShowDetailsModal finance={selectedFinance} onClose={closeModal} />
//         )}

//       </div>
//     </>
//   );
// };

// export default FinalData;


import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect, useContext } from "react";
import ReactPaginate from "react-paginate";
import { ClipLoader } from "react-spinners";
import { useRef } from "react";
import { generatePDF } from "./PrintablePage";
import { addDays, format } from "date-fns";
import { DateRangePicker } from "react-date-range";
import { ShowDetailsModal } from "./ShowDetailsModal";
import { Link } from "react-router-dom";
import { UserContext } from "../../components/context/authContext";

// loader css style
const override = {
  display: "block",
  margin: "25px auto",
};

const FinalData = () => {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const componentPDF = useRef();
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const refOne = useRef([]);
  const [selectedFinance, setSelectedFinance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { financeDetailsData, setFinanceDetailsData } = useContext(UserContext);

  const openModal = (finance) => {
    setSelectedFinance(finance);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFinance(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchFinance();
    // Hide date search option
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const fetchFinance = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance"
      );
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      console.log(sortedData, "final data");

      setFinances(sortedData);
      setLoading(false);
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleSelect = (date) => {
    const filtered = finances?.filter((finance) => {
      const financeDate = new Date(finance.date);
      return (
        financeDate >= date?.selection?.startDate &&
        financeDate <= date?.selection?.endDate
      );
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilteredData(filtered);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const offset = currentPage * itemsPerPage;
  const currentData =
    filteredData.length > 0
      ? filteredData.slice(offset, offset + itemsPerPage)
      : finances.slice(offset, offset + itemsPerPage);

  const handlePrint = (finance) => {
    generatePDF(finance);
  };

  return (
    <>
      <div className="mb-3">
        <h1 className="text-center my-4 text-3xl text-info font-bold bg-slate-500 p-3 rounded-lg uppercase">
          Export Products List
        </h1>

        <div className="mb-3 calendarWrap text-center w-3/4 mx-36">
          <h3 className="mb-[8px] text-xl text-sky-400">Search by Date</h3>
          <input
            value={`${format(startDate, "MM/dd/yyyy")} to ${format(
              endDate,
              "MM/dd/yyyy"
            )}`}
            className="inputBox border-2 border-indigo-600 p-2 w-2/4 rounded text-center"
            onClick={() => setOpen((open) => !open)}
          />
          <div ref={refOne} className="">
            {open && (
              <DateRangePicker
                className="flex justify-center calendarElement"
                onChange={handleSelect}
                editableDateInputs={true}
                ranges={[selectionRange]}
                months={2}
                direction="horizontal"
                staticRanges={[]}
                inputRanges={[]}
              />
            )}
          </div>
        </div>

        <div className="overflow-x-auto mx-2 mb-2" ref={componentPDF}>
          {loading ? (
            <div>
              <ClipLoader
                color={"#36d7b7"}
                loading={loading}
                size={50}
                cssOverride={override}
              />
              <p className="text-center font-extralight text-xl text-green-400">
                Please wait ....
              </p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Invoice No</th>
                  <th>Net Weight</th>
                  <th>Product Name</th>
                  <th>Charges (BDT)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData?.map((finance) => {
                  const localDate = new Date(finance.date).toLocaleDateString();
                  const productNames = finance.financeProductInBoxes.map(
                    (p) => p.productName
                  );
                  const charges = finance.financeCharges
                    .map((charge) => `${charge.description} - ${charge.amountBDT}`)
                    .join(", ");
                  return (
                    <tr key={finance.id}>
                      <td>{localDate}</td>
                      <td>{finance.invoiceNo}</td>
                      <td>{finance.netWeight}</td>
                      <td>{productNames.join(", ")}</td>
                      <td>{charges}</td>
                      <td className="flex">
                        <Link
                          onClick={() => setFinanceDetailsData(finance)}
                          to={`/purchase-details/${finance.id}`}
                          className="btn-accent font-bold px-[20px] py-[3px] mt-4 rounded-lg text-purple-950 hover:text-amber-500 mr-2"
                        >
                          Details
                        </Link>

                        <button
                          className="btn-info font-bold px-[20px] py-[3px] mt-4 rounded-lg text-purple-950 hover:text-amber-500"
                          onClick={() => handlePrint(finance)}
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <ReactPaginate
          previousLabel={"< Previous"}
          nextLabel={"Next >"}
          breakLabel={"..."}
          pageCount={Math.ceil(
            (filteredData.length > 0 ? filteredData.length : finances.length) /
            itemsPerPage
          )}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex gap-2 justify-center mt-4"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link text-gray-800 px-2 py-2"}
          activeClassName={"active bg-sky-300 rounded-md"}
          className="flex items-center justify-center py-[4px]"
        />

        {isModalOpen && (
          <ShowDetailsModal finance={selectedFinance} onClose={closeModal} />
        )}
      </div>
    </>
  );
};

export default FinalData;
