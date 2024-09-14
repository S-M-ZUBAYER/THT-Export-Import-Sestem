import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/purchase.css";
// import { AiOutlineDelete } from "react-icons/ai";
import ExpensesForm from "./PurchaseCalculation";
import { ClipLoader } from "react-spinners";

// loader css style
const override = {
  display: "block",
  margin: "25px auto",
};

const Purchase = () => {
  const [transportPath, setTransportPath] = useState([]);
  const [transportCountry, setTransportCountry] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [charges, setCharges] = useState([]);
  const [boxData, setBoxData] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [transportWay, setTransportWay] = useState("");
  const [transportCountryName, setTransportCountryName] = useState("");
  const [selectedTransportCountryPort, setSelectedTransportCountryPort] =
    useState("");
  const [filteredTruckNumbers, setFilteredTruckNumbers] = useState([]);
  const [finances, setFinances] = useState([]);

  // const [productChecks, setProductChecks] = useState([]);
  const [savedExpenses, setSavedExpenses] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [total, setTotal] = useState("");
  const [ipNo, setIpNo] = useState("");
  const [truckNo, setTruckNo] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  // const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // const filteredTruckNumbersRef = useRef([]);

  const navigate = useNavigate();

  const productData = JSON.stringify(selectedItems);

  // data get from office_accounts API
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts"
      );
      // data see in table descending order
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      setAccounts(sortedData);
      console.log(sortedData, "OfficeAccount");

      setLoading(false);
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  const fetchCharges = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/addcharges"
      );
      console.log(response?.data, "Charge");
      setCharges(response?.data);
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  const fetchBoxData = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes"
      );
      // data see in table descending order
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      // const data = JSON.parse(sortedData);
      console.log(sortedData, "productInBox");

      setBoxData(sortedData);
      setFilteredData(sortedData);
      setLoading(false);
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  const fetchTransportCountry = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/transport_country"
      );
      setTransportCountry(response?.data);
      console.log(response?.data, "transportCountry");
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  const fetchTransportRoute = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/transport"
      );
      setTransportPath(response?.data);
      console.log(response?.data, "transport");
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  const fetchPurchase = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance"
      );
      setPurchase(response?.data);
      console.log(response?.data, "finance");
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  const fetchFinance = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance"
      );
      setFinances(response?.data);
      console.log(response?.data, "Finance2");
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  useEffect(() => {
    setLoading(true);
    //   getting transport data from server
    fetchTransportRoute();
    //   getting transport country data from server
    fetchTransportCountry();
    //   getting accounts data from office_accounts server
    fetchAccounts();
    // geeting charges api call
    fetchCharges();
    // fetch box data
    fetchBoxData();
    // fetch finance data
    fetchFinance();
    // fetch purchase data
    fetchPurchase();
  }, []);

  // useEffect(() => {
  // hide table data if it's selected works it
  // console.log(boxData, "Box data");

  // if (boxData?.length > 0 && purchase?.length >= 0) {

  // setFilteredData(boxData);
  // const api2Ids = purchase?.map((item) => item?.officeAccount).flat();
  // const api2IdsPasrse = api2Ids?.map((a) => JSON.parse(a)).flat();
  // const filteredBoxData = boxData?.filter(
  //   (item) => !api2IdsPasrse.includes(item.id)
  // );

  // setFilteredData(filteredBoxData);
  // }

  // hide truck number if truck number selected
  //   if (boxData.length > 0 && finances.length >= 0) {
  //     const productInBoxData = boxData;
  //     const financeApiData = finances;

  //     const productInBoxTruckNumbers = productInBoxData.map(
  //       (item) => item.truckNumber
  //     );
  //     // console.log(productInBoxTruckNumbers);
  //     const financeTruckNumbers = financeApiData?.map((item) => item.truckNo);
  //     // console.log(financeTruckNumbers);
  //     const commonTruckNumbers = productInBoxTruckNumbers?.filter((truckNo) =>
  //       financeTruckNumbers?.includes(truckNo)
  //     );
  //     // console.log(commonTruckNumbers);
  //     const filteredTruckNumbers = productInBoxTruckNumbers?.filter(
  //       (truckNo) => !commonTruckNumbers?.includes(truckNo)
  //     );
  //     setFilteredTruckNumbers(filteredTruckNumbers);
  //   }
  // }, [boxData, purchase, finances]);




  const handleCheckboxChange = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleTransportWay = (event) => {
    setTransportWay(event.target.value);
  };

  const handleTransportCountryName = (event) => {
    setTransportCountryName(event.target.value);
  };

  const handleTransportCountryPort = (event) => {
    setSelectedTransportCountryPort(event.target.value);
  };

  const handleTruckNo = (event) => {
    setTruckNo(event.target.value);
  };


  const handleExpenseSave = (selectedExpenseData) => {
    setSavedExpenses(selectedExpenseData);
  };

  const handleTotalCostChange = (newTotalCost) => {
    setTotalCost(newTotalCost);
  };

  // data send to server
  const formSubmit = (e) => {
    const newEx = parseFloat(totalCost) + parseFloat(total);
    e.preventDefault();
    const data = {
      transportWay: transportWay, // id pass
      transportCountryName: transportCountryName, // id pass
      transportCountryPort: selectedTransportCountryPort, // id pass
      officeAccount: productData, //id pass
      particularExpenseNames: savedExpenses,
      totalCost: totalCost,
      invoiceNo: invoiceNo,
      total: newEx,
      ipNo: ipNo,
      truckNo: truckNo,
    };
    // console.log(data);
    axios
      .post(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase",
        data,
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
        navigate("/finance");
        // console.log(res);
      })
      .catch((err) =>
        toast.error("This error coming from server please try again later!!", {
          position: "top-center",
        })
      );
  };
  const [searchValue, setSearchValue] = useState('');

  // Handle input change and filter products
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase(); // Use the current input value
    setSearchValue(value);

    // Use `value` directly in the filter instead of `searchValue`
    const filteredProducts = boxData.filter((account) =>
      account.productName.toLowerCase().includes(value) ||
      account.truckNumber.toLowerCase().includes(value) ||
      account.productModel.toLowerCase().includes(value) ||
      account.totalPallet.toLowerCase().includes(value)
    );

    setFilteredData(filteredProducts);
    console.log(value, filteredProducts);
  };




  return (
    <>
      <div className="mb-6">
        {/* top form select and checkbox design */}
        <div className="">
          <h1 className="flex justify-center items-center text-4xl my-4 uppercase text-info font-bold">
            Shipment Details Add
          </h1>
          <p className="text-red-600 text-sm text-center font-medium">
            ** Please Fillup this from carefully & check all fields You can't
            modified it **
          </p>

          {/* Table data get from accouts input database */}
          <div className="w-full lg:w-3/4 mx-auto">
            <div className="flex justify-between items-center my-6 bg-slate-500 p-3 rounded-lg">
              <h1 className="text-3xl text-info font-bold uppercase">
                Select the Product
              </h1>
              <input
                type="text"
                placeholder="Search model, pallet no, truck no"
                className="border border-gray-300 p-2 rounded-md focus:outline-none"
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>

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
                      <th className="sticky top-0 bg-gray-200">Select</th>
                      <th className="sticky top-0 bg-gray-200">ID</th>
                      <th className="sticky top-0 bg-gray-200">Product Name</th>
                      <th className="sticky top-0 bg-gray-200">
                        Product Model
                      </th>
                      <th className="sticky top-0 bg-gray-200">Quantity</th>
                      <th className="sticky top-0 bg-gray-200">Pallet No.</th>
                      <th className="sticky top-0 bg-gray-200">Truck No.</th>
                      {/* <th className="sticky top-0 bg-gray-200">Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData?.map((product) => {
                      // const jsonStr = product.productModel.replace(
                      //   /^"|"$/g,
                      //   ""
                      // );
                      // const data = JSON.parse(jsonStr);
                      // const result = data.join(",");
                      return (
                        <tr className={`hover cursor-pointer`} key={product.id}>
                          <td>
                            <input
                              type="checkbox"
                              className="checkbox checkbox-info"
                              name="product"
                              value={product.id}
                              checked={selectedItems.includes(product.id)}
                              onChange={() => handleCheckboxChange(product.id)}
                            // onClick={() => handleProductCheck(product)}
                            />
                          </td>
                          <td>{product.id}</td>
                          <td>{product.productName}</td>
                          <td>{product.productModel}</td>
                          <td>{product.quantity}</td>
                          <td>{product.totalPallet}</td>
                          <td>{product.truckNumber}</td>
                          {/* <td>
                            <button onClick={() => handleDelete(product?.id)}>
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

          {/* form for details add */}
          <div className="mt-4 lg:flex justify-center items-center w-full lg:w-3/4 mx-auto">
            <form
              className="bg-base-100 rounded-lg shadow-xl my-5 p-[12px]"
              onSubmit={formSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Shipment Way */}
                <div className="">
                  <label className="mb-[10px] lebel-text text-lg font-semibold">
                    Shipment Way
                  </label>
                  <div className="mt-3">
                    <select
                      className="select select-info w-full"
                      id="selectOption"
                      value={transportWay}
                      name="transportWay"
                      required
                      aria-required
                      onChange={handleTransportWay}>
                      <option value="">---- Pick Transport Way ----</option>
                      {transportPath?.map((product, index) => (
                        <option value={product.id} key={index}>
                          {product.transportWay}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Shipment Country */}
                <div className="">
                  <label className="mb-[10px] lebel-text text-lg font-semibold">
                    Shipment Country
                  </label>
                  <div className="mt-3">
                    <select
                      className="select select-info w-full"
                      id="selectOption"
                      required
                      aria-required
                      value={transportCountryName}
                      name="transportCountryName"
                      onChange={handleTransportCountryName}>
                      <option value="">---- Pick Shipment Country ----</option>
                      {/* {transportCountry?.map((product, index) => (
                        <option value={product.id} key={index}>
                          {product.countryName}
                        </option>
                      ))} */}
                      {Array.from(
                        new Set(
                          transportCountry?.map(
                            (product) => product.countryName
                          )
                        )
                      ).map((countryName, index) => (
                        <option key={index}>{countryName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* shipment port */}
                <div className="">
                  <label className="mb-[10px] lebel-text text-lg font-semibold">
                    Shipment Port
                  </label>
                  <div className="mt-3">
                    <select
                      className="select select-info w-full"
                      id="selectOption"
                      required
                      aria-required
                      value={selectedTransportCountryPort}
                      name="transportCountryPort"
                      disabled={!transportCountryName}
                      onChange={handleTransportCountryPort}>
                      <option value="">---- Pick Shipment Port ----</option>
                      {/* {transportCountry.map((port, index) => (
                        <option key={index} value={port.countryPort}>
                          {port.countryPort}
                        </option>
                      ))} */}
                      {transportCountry
                        ?.filter(
                          (port) =>
                            port.countryName.toLowerCase() ===
                            transportCountryName.toLowerCase()
                        )
                        .map((port, index) => (
                          <option key={index} value={port.id}>
                            {port.countryPort}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Invoice No. */}
                <div className="">
                  <div>
                    <label
                      className="lebel-text text-lg font-semibold"
                      htmlFor="invoiceno">
                      Invoice No.
                    </label>
                    <input
                      className="w-full border-[1px] border-info rounded-md p-3 mt-3 bg-transparent"
                      placeholder="Invoice No"
                      type="text"
                      name="invoiceno"
                      value={invoiceNo}
                      required
                      aria-required
                      onChange={(e) => setInvoiceNo(e.target.value)}
                    />
                  </div>
                </div>

                {/* IP No. */}
                <div className="">
                  <div>
                    <label className="text-lg font-semibold" htmlFor="ipNo">
                      EP No.
                    </label>
                    <input
                      className="w-full border-[1px] border-info rounded-md p-3 mt-3 bg-transparent"
                      placeholder="EP No."
                      type="text"
                      name="ipNo"
                      required
                      aria-required
                      value={ipNo}
                      onChange={(e) => setIpNo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Total Expense */}
                <div className="">
                  <div>
                    <label className="text-lg font-semibold" htmlFor="ipNo">
                      Expense
                    </label>
                    <input
                      className="w-full border-[1px] border-info rounded-md p-3 mt-3 bg-transparent"
                      placeholder="Expense"
                      type="number"
                      name="total"
                      min={0}
                      value={total}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => setTotal(e.target.value)}
                    />
                  </div>
                </div>

                {/* Truck No. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="ipNo">
                    Truck No. (nedd to select multiple)
                  </label>
                  <div className="mt-3">
                    <select
                      className="select select-info w-full"
                      id="selectOption"
                      value={truckNo}
                      name="truckNo"
                      required
                      aria-required
                      onChange={handleTruckNo}>
                      <option value="">---- Pick Truck No. ----</option>

                      {/* filter truck number If any truck number save then hide automatically */}
                      {filteredTruckNumbers
                        ?.sort((a, b) => b.truckNumber - a.truckNumber)
                        ?.map((data, index) => (
                          <option value={data.truckNumber} key={index}>
                            {data}
                          </option>
                        ))}
                      {/* check truck number not use it */}

                    </select>
                  </div>
                </div>


              </div>

              {/* checking element for calculation */}
              <ExpensesForm
                expenses={charges}
                onExpenseSave={handleExpenseSave}
                onTotalCostChange={handleTotalCostChange}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Purchase;
