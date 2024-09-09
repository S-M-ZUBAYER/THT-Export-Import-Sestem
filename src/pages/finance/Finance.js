import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ClipLoader } from "react-spinners";

// loader css style
const override = {
  display: "block",
  margin: "25px auto",
};

const Finance = () => {
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [boxData, setBoxData] = useState([]);
  const [selectedBEDate, setSelectedBEDate] = useState(null);
  const [formData, setFormData] = useState({});
  const [exim, setExim] = useState("");
  const [beNumber, setBENumber] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState(0);
  // const [totalPalletQuantity, setTotalPalletQuantity] = useState(0);
  const [palletRemarks, setPalletRemarks] = useState("Pallet");
  const [loading, setLoading] = useState(true);
  const [totalPalletCount, setTotalPalletCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    //   getting expenses data from office_accounts server
    fetchExpenses();
    fetchAccounts();
    fetchBoxData();
  }, []);

  // Data fetch from server
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase"
      );
      // data see in table descending order
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      // const data = JSON.parse(sortedData);
      setExpenses(sortedData);
      setLoading(false);
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  // Data fetch from server
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts"
      );
      setAccounts(response?.data);
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  // Data fetch from server
  const fetchBoxData = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes"
      );
      setBoxData(response?.data);
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  const handleEXIMChange = (e) => {
    setExim(e.target.value);
  };

  const handleBENumberChange = (e) => {
    setBENumber(e.target.value);
  };

  const handletotalNetWeightChange = (e) => {
    setTotalNetWeight(e.target.value);
  };

  // const handleTotalPalletQuantityChange = (e) => {
  //   setTotalPalletQuantity(e.target.value);
  // };

  const handleRowClick = (rowData) => {
    const officeAccountIds = JSON.parse(rowData.officeAccount);

    setFormData(rowData);
    // console.log(rowData);
    // setFormData({ parseFloat(rowData.total), parseFloat(rowData.totalCost), ...rowData });
    const truckNumber = rowData?.truckNo;
    // console.log(truckNumber);
    const matchingExpenses = boxData.filter(
      (expense) =>
        expense.truckNumber.toLowerCase() === truckNumber.toLowerCase()
    );
    const matchingPallets = matchingExpenses.map(
      (expense) => expense.totalPallet
    );
    const totalPalletCount = matchingPallets.length;
    setTotalPalletCount(totalPalletCount);

    // product matches with id and get name and model
    const matchedProducts = boxData?.filter((item) =>
      officeAccountIds.includes(item.id)
    );
    // console.log(matchedProducts);

    const productNameArray = matchedProducts?.map((item) => item.productName);
    const totalBoxArray = matchedProducts?.map((item) => item.totalBox);
    const quantityArray = matchedProducts?.map((item) => item.quantity);
    const productModelArray = matchedProducts.map((item) => {
      const jsonStr = item.productModel.replace(/^"|"$/g, "");
      const data = JSON.parse(jsonStr);
      const result = data.join(",");
      return result;
    });
    // console.log(productModelArray);

    // Set the productName and productModel arrays in the formData state
    setFormData((prevData) => ({
      ...prevData,
      productName: JSON.stringify(productNameArray),
      totalBox: JSON.stringify(totalBoxArray),
      totalQuantity: JSON.stringify(quantityArray),
      productModel: JSON.stringify(productModelArray),
    }));
  };
  // console.log(formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // // map and extract from array
  // const matchedIds = expenses?.map((ex) => ex.officeAccount);

  // // array stringify for filtered
  // const formattedIds = matchedIds.map((idString) => JSON.parse(idString));

  // // match the seleted id with accounts and filter out seleted products name
  // const matchedProducts = accounts.filter((account) =>
  //   formattedIds.some((item) => item.includes(account.id))
  // );

  // merge data old and new data set to formData
  const handleAddNewData = () => {
    const data = {
      selectedBEDate: selectedBEDate,
      exim: exim,
      beNumber: beNumber,
      totalNetWeight: parseFloat(totalNetWeight),
      totalPalletQuantity: parseFloat(totalPalletCount),
      palletRemarks: palletRemarks,
    };
    setFormData((prevData) => ({
      ...prevData, // Retain previous data
      ...data, // Add new fields
    }));
    toast.success("Successfully data merged. Save Now", {
      position: "top-center",
    });
  };

  // data save and send to server
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send formData to your API for saving
    axios
      .post(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success("Successfully Uploaded to server", {
          position: "top-center",
        });
        navigate("/finaldata");
        // console.log(res);
      })
      .catch((err) =>
        toast.error("This error coming from server please try again later!!", {
          position: "top-center",
        })
      );

    // toast.success("Data successfully Saved!!", { position: "top-center" });
    // console.log(formData);
    // navigate("/exportimport");
  };

  // product delete from server and also frontend
  // const handleDelete = async (id) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure, you want to delete this Product Data?"
  //   );
  //   if (confirmDelete) {
  //     try {
  //       await axios.delete(
  //         `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase/${id}`
  //       );
  //       toast.warn("Data successfully Deleted!!", { position: "top-center" });
  //       fetchExpenses();
  //     } catch (error) {
  //       toast.error("You can't delete now. Please try again later!", {
  //         position: "top-center",
  //       });
  //     }
  //   }
  // };

  return (
    <div>
      <h1 className="flex justify-center items-center text-4xl my-4 uppercase text-info font-bold">
        Finance
      </h1>
      <p className="text-red-600 text-sm text-center font-medium">
        ** Please Fillup this from carefully You can't modified it **
      </p>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-6 mx-4">
            {/*B/E Date  */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                B/E Date
              </label>
              <input
                type="date"
                onChange={(e) => setSelectedBEDate(e.target.value)}
                className="border rounded-xl w-60 p-[13px] lg:p-[13px] mt-1 text-gray-700 leading-tight"
                required
              />
            </div>
            {/*  Export/Import*/}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                Export/Import
              </label>
              <select
                className="select border-2 border-gray-100 w-full"
                id="selectOption"
                name="exim"
                required
                aria-required
                onChange={handleEXIMChange}>
                <option value="">--Select Type --</option>
                <option value="export">Export</option>
                <option value="import">Import</option>
              </select>
              {/* <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                placeholder="Export/Import"
                type="text"
                required
                name="exim"
                onChange={handleEXIMChange}
              /> */}
            </div>
            {/*  Invoice No */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                Invoice Number
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                placeholder="Invoice Number"
                type="text"
                readOnly
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleInputChange}
              />
            </div>
            {/*  Total USD */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                Total Expenses
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                placeholder="Total Expenses"
                type="text"
                name="total"
                readOnly
                value={formData.total}
                onChange={handleInputChange}
              />
            </div>
            {/*  B/E Number */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                B/E Number
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                placeholder="Enter B/E Number"
                type="text"
                required
                name="beNumber"
                onChange={handleBENumberChange}
              />
            </div>
            {/*  IP Number */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                IP Number
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                placeholder="Enter IP Number"
                type="text"
                readOnly
                name="ipNo"
                value={formData.ipNo}
                onChange={handleInputChange}
              />
            </div>
            {/*  Particular Expenses cost */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                Particular Expenses cost
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                placeholder="Product Name come API"
                type="text"
                readOnly
                name="totalCost"
                value={formData.totalCost}
                onChange={handleInputChange}
              />
            </div>
            {/*  Product Name */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                Product Name
              </label>
              <textarea
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                placeholder="Product Name come API"
                type="text"
                required
                readOnly
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
              />
            </div>
            {/*  Product Model */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productModel">
                Product Model
              </label>
              <textarea
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                placeholder="Product Model come API"
                type="text"
                required
                readOnly
                name="productModel"
                value={formData.productModel}
                onChange={handleInputChange}
              />
            </div>
            {/*  Total Net Weight */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productWeight">
                Net Weight
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                placeholder="Enter Total Weight"
                type="text"
                required
                name="totalNetWeight"
                onChange={handletotalNetWeightChange}
              />
            </div>
            {/*  Pallet Quantity */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                Pallet Quantity
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                placeholder="Enter Total Pallet Quantity"
                type="number"
                required
                readOnly
                aria-readonly
                value={totalPalletCount}
                // name="totalPalletQuantity"
                // onChange={handleTotalPalletQuantityChange}
              />
            </div>
            {/*  Truck No */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                Truck No
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                type="text"
                readOnly
                name="truckNo"
                value={formData.truckNo}
                onChange={handleInputChange}
              />
            </div>
            {/*  Remarks for Pallet */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                Pallet Remarks
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                placeholder="Pallet Remarks"
                type="text"
                required
                name="palletRemarks"
                value="Pallet"
                onChange={(e) => setPalletRemarks(e.target.value)}
              />
            </div>
            {/*  Expenses Data list */}
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                Expenses List
              </label>
              <ol
                type="1"
                className="max-h-[100px] max-w-[450px] overflow-y-auto">
                {formData.particularExpenseNames?.map((p) => (
                  <p key={p.id}>
                    {p.particularExpenseName}-{p.particularExpenseCost}-{p.date}
                    -{p.remark}
                  </p>
                ))}
              </ol>
              {/* <textarea
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                type="text"
                name="particularExpenseNames"
                value={formData.particularExpenseNames?.map(
                  (p) => p.particularExpenseName
                )}
              /> */}
            </div>
          </div>
          <div className="mt-3 mr-7 flex justify-end gap-y-4">
            <Link to="/exportimport" className="btn btn-info px-10 mx-5">
              Back
            </Link>
            <p
              className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black mb-6 mr-5"
              onClick={handleAddNewData}>
              Merge Data
            </p>
            <button
              className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black mb-6"
              type="submit">
              Save
            </button>
          </div>
        </form>

        {/* Table data get from accouts input database */}
        <div>
          <h1 className="text-center my-6 text-3xl text-info font-bold bg-slate-500 p-3 rounded-lg uppercase">
            Export Products Details
          </h1>
          <div className="overflow-x-auto add__scrollbar">
            {loading ? (
              <div className="">
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
                    <th className="sticky top-0 bg-gray-200">ID</th>
                    <th className="sticky top-0 bg-gray-200">Invoice No</th>
                    <th className="sticky top-0 bg-gray-200">IP No</th>
                    <th className="sticky top-0 bg-gray-200">
                      Total <span className="text-red-600">(TK)</span>
                    </th>
                    <th className="sticky top-0 bg-gray-200">
                      Expenses <span className="text-blue-600">(TK)</span>
                    </th>
                    <th className="sticky top-0 bg-gray-200">Expenses List</th>
                    <th className="sticky top-0 bg-gray-200">Products Name</th>
                    <th className="sticky top-0 bg-gray-200">Products Model</th>
                    {/* <th className="sticky top-0 bg-gray-200">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {expenses?.map((expense) => {
                    const officeID = expense?.officeAccount;
                    // console.log(officeID);
                    const matchedProducts = boxData?.filter((data) =>
                      officeID?.includes(data.id)
                    );
                    const uniqueProductNames = [
                      ...new Set(matchedProducts.map((p) => p.productName)),
                    ];
                    // const matchedProducts = accounts?.filter((account) => {
                    //   for (const id of officeID) {
                    //     if (account.id === id) {
                    //       return true;
                    //     }
                    //   }
                    //   return false;
                    // });
                    // console.log(matchedProducts);
                    return (
                      <tr
                        className={`hover cursor-pointer text-[13px]`}
                        key={expense.id}
                        onClick={() => handleRowClick(expense)}>
                        <td>{expense.id}</td>
                        <td>{expense.invoiceNo}</td>
                        <td>{expense.ipNo}</td>
                        <td>{expense.total}</td>
                        <td>{expense.totalCost}</td>
                        <td>
                          <ul>
                            {expense.particularExpenseNames.map((ex) => (
                              <li key={ex.expenseId}>
                                {ex.particularExpenseName}-
                                {ex.particularExpenseCost}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>{uniqueProductNames.join(",")}</td>
                        <td>
                          {matchedProducts
                            ?.map((p) => {
                              const jsonStr = p.productModel.replace(
                                /^"|"$/g,
                                ""
                              );
                              const data = JSON.parse(jsonStr);
                              const result = data.join(",");
                              return result;
                            })
                            .join(",")}
                        </td>
                        {/* <td>
                        <button onClick={() => handleDelete(expense?.id)}>
                          <AiOutlineDelete className="w-6 h-6 text-red-600" />
                        </button>
                      </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
