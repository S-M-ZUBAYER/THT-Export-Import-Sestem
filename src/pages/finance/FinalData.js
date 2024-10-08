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
      const finalData = sortedData.filter((data) => data.status === "finalData"
      )
      setFinances(finalData);
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
