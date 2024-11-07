import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ExpensesForm from './PurchaseCalculation';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PurchaseFinance = () => {
    const navigate = useNavigate();
    const [traderServiceProvider, setTraderServiceProvider] = useState("");
    const [serviceProviders, setServiceProviders] = useState("");

    const [grossWeight, setGrossWeight] = useState(0);
    const [netWeight, setNetWeight] = useState(0);
    const [savedExpenses, setSavedExpenses] = useState([]);
    // calculation purchase state
    const [containerServiceProvider, setContainerServiceProvider] = useState("");

    const [charges, setCharges] = useState([]);
    const [shipCostTK, setShipCostTK] = useState(0);
    const [totalCost, setTotalCost] = useState(0.00);
    const [shipCostUSD, setShipCostUSD] = useState(0);
    const [totalFareAmount, setTotalFareAmount] = useState(0);
    const [totalAitVat, setTotalAitVat] = useState(0);
    const [totalCarrierAmount, setTotalCarrierAmount] = useState(0);
    const [selectedExpensesList, setSelectedExpensesList] = useState([]);
    const [finalIpNo, setFinalIpNo] = useState("");
    const [finalInvoiceNo, setFinalInvoiceNo] = useState("");
    const [finalTruckNo, setFinalTruckNo] = useState("");
    const [finalTransportPort, setFinalTransportPort] = useState("");
    const [finalTransportCountry, setFinalTransportCountry] = useState("");

    const [searchValue, setSearchValue] = useState('');
    const [rows, setRows] = useState([
        { slNo: 1, date: "", containerNo: "", containerTypeSize: "", invoiceNo: "", epNumber: "", fareAmount: 0, aitVat: 0, individualTotalAmount: 0 }
    ]);
    const [formData, setFormData] = useState({
        shipper: "THT-Space Electrical Company Ltd.",
        blNo: "",
        containerNo: "",
        destination: "",
        vslVoy: "",
        etd: "",
        eta: "",
        exchangeRate: "", // Default Exchange Rate USD to BDT
        charges: [
            { description: "", amountUSD: 0, amountBDT: 0 },
        ],
    });
    // loader css style
    const override = {
        display: "block",
        margin: "25px auto",
    };


    useEffect(() => {
        // geeting charges api call
        fetchCharges();
        // fetch trade service data
        fetchTradeServiceProvider();
    }, []);


    const [selectedItem, setSelectedItem] = useState(null); // Store a single product ID
    const [selectedProduct, setSelectedProduct] = useState(null); // Store a single product object

    const handleCheckboxChange = (product) => {
        if (selectedItem === product?.id) {
            // Deselect the product if it's already selected
            setSelectedItem(null);
            setSelectedProduct(null);
        } else {
            // Select the new product, replacing any previous selection
            setSelectedItem(product?.id);
            setSelectedProduct(product);
        }
    };



    const [financePurchaseLoading, setFinancePurchaseLoading] = useState(true);
    const [financePurchases, setFinancePurchases] = useState([]);
    const [filteredFinancePurchases, setFilteredFinancePurchases] = useState([]);

    // Fetch data from API
    useEffect(() => {
        setFinancePurchaseLoading(true); // Start loading before making the request
        axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase')
            .then(response => {
                const sortedData = response?.data.sort((a, b) => b.id - a.id);
                const finalPurchases = sortedData.filter(purchase => purchase.status === "initialPurchase");
                setFinancePurchases(finalPurchases);
                setFilteredFinancePurchases(finalPurchases);
            })
            .catch(error => {
                console.error('Failed to fetch data!');
            })
            .finally(() => {
                setFinancePurchaseLoading(false); // Ensure loading is stopped after both success or failure
            });
    }, []);


    const fetchTradeServiceProvider = async () => {
        try {
            const response = await axios.get(
                "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/trade_service"
            );
            setServiceProviders(response.data);
        } catch (error) {
            console.error("Failed to fetch data");
        }
    };
    const fetchCharges = async () => {
        try {
            const response = await axios.get(
                "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/addcharges"
            );
            setCharges(response?.data);
        } catch (error) {
            console.error("Error from server to get data!!");
        }
    };
    const handleExpenseSave = (selectedExpenseData) => {

        setSavedExpenses(selectedExpenseData);
    };

    const handleTotalCostChange = (newTotalCost) => {
        setTotalCost(newTotalCost);
    };
    useEffect(() => {
        setFinalIpNo(selectedProduct?.epNo)
        setFinalInvoiceNo(selectedProduct?.invoiceNo)
        setFinalTruckNo(selectedProduct?.truckNo)
        setFinalTransportPort(selectedProduct?.transportPort)
        setFinalTransportCountry(selectedProduct?.transportCountryName)
        setFormData((prevFormData) => ({
            ...prevFormData,
            containerNo: selectedProduct?.truckNo
        }));
        // setRows((prevRow) => ({
        //     ...prevRow,
        //     containerNo: selectedProduct?.truckNo,
        //     epNumber: selectedProduct?.epNo,
        //     invoiceNo: selectedProduct?.invoiceNo,

        // }));
    }, [selectedProduct])
    const updateProductInfo = {
        ...selectedProduct,
        traderServiceProvider: traderServiceProvider,
        netWeight: parseFloat(netWeight),
        grossWeight: parseFloat(grossWeight),
        containerExpenseNames: rows,
        containerServiceProvider: containerServiceProvider,
        seaServiceProvider: formData?.seaServiceProvider,
        shipper: formData?.shipper,
        blNo: formData?.blNo,
        containerNo: formData?.containerNo,
        destination: formData?.destination,
        vslVoy: formData?.vslVoy,
        etd: formData?.etd,
        eta: formData?.eta,
        exchangeRate: formData?.exchangeRate,
        chargesList: formData?.charges,
        particularExpenseNames: savedExpenses,
        totalAmountBDT: parseFloat(shipCostTK),
        totalCost: totalCost,
        totalAmountUSD: parseFloat(shipCostUSD),
        totalFareAmount: parseFloat(totalFareAmount),
        totalAitVat: parseFloat(totalAitVat),
        totalCarrierAmount: parseFloat(totalCarrierAmount),
        status: "purchase"
    }

    const handleNetWeight = (event) => {
        setNetWeight(event.target.value);
    };
    const handleGrossWeight = (event) => {
        setGrossWeight(event.target.value);
    };
    // Handle input change and filter products
    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase(); // Use the current input value
        setSearchValue(value);

        // Use `value` directly in the filter instead of `searchValue`
        console.log(financePurchases, value);
        // return;

        const filteredProducts = financePurchases.filter((account) =>
            account.epNo.toLowerCase().includes(value) ||
            account.truckNo.toLowerCase().includes(value) ||
            account.invoiceNo.toLowerCase().includes(value) ||
            account.transportCountryName.toLowerCase().includes(value) ||
            account.transportPort.toLowerCase().includes(value) ||
            account.date.toLowerCase().includes(value)
        );

        setFilteredFinancePurchases(filteredProducts);
    };



    // Data send to server
    const handleToFinalSave = (e) => {
        e.preventDefault();
        const confirmPurchase = window.confirm(
            "Are you sure, you want to confirm these data as Final Export?"
        );
        if (confirmPurchase) {

            console.log(updateProductInfo, "purchase info");

            axios
                .put(
                    "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase",
                    updateProductInfo,
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

                    // Navigate to final purchase page after the operation is complete
                    navigate("/finalExport");
                })
                .catch((err) => {
                    toast.error("This error coming from server please try again later!!", {
                        position: "top-center",
                    });
                });
        }
    };


    return (
        <div className="mb-6">
            {/* top form select and checkbox design */}
            <div className="">
                <h1 className="flex justify-center items-center text-4xl my-4 uppercase text-cyan-600 font-bold">
                    Shipment Finance Details Add
                </h1>
                <p className="text-red-600 text-sm text-center font-medium">
                    ** Please Fill up this form carefully & check all fields. You can't modify it later. **
                </p>
                {/* Table data get from accounts input database */}
                <div className="w-full lg:w-3/4 mx-auto">
                    <div className="flex justify-between items-center my-6 bg-slate-500 p-3 rounded-lg">
                        <h1 className="text-3xl text-info font-bold uppercase">
                            Select The Export Initial Data
                        </h1>
                        <input
                            type="text"
                            placeholder="Search InvoiceNo, EpNo, truck no"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none"
                            value={searchValue}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="overflow-x-auto add__scrollbar">
                        {financePurchaseLoading ? (
                            <div className="">
                                <ClipLoader
                                    color={"#36d7b7"}
                                    loading={financePurchaseLoading}
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
                                        <th className="sticky top-0 bg-gray-200">Serial No</th>
                                        <th className="sticky top-0 bg-gray-200">Date</th>
                                        <th className="sticky top-0 bg-gray-200">Invoice No.</th>
                                        <th className="sticky top-0 bg-gray-200">EP No.</th>
                                        <th className="sticky top-0 bg-gray-200">Container No</th>
                                        <th className="sticky top-0 bg-gray-200">Country Name</th>
                                        <th className="sticky top-0 bg-gray-200">Port Name</th>
                                        {/* <th className="sticky top-0 bg-gray-200">Action</th> */}
                                    </tr>
                                </thead>
                                {/* <tbody>
                                    {filteredData?.map((product, index) => {
                                        return (
                                            <tr className={`hover cursor-pointer`} key={product.id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-info"
                                                        name="product"
                                                        value={product.id}
                                                        checked={selectedItems.includes(product.id)}
                                                        onChange={() => handleCheckboxChange(product)}
                                                    />
                                                </td>
                                                <td>{index + 1}</td>
                                                <td>{product.date}</td>
                                                <td>{product.productName}</td>
                                                <td>{product.productModel}</td>
                                                <td>{product.quantity}</td>
                                                <td>{product.totalPallet}</td>
                                                <td>{product.truckNumber}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody> */}
                                <tbody>
                                    {filteredFinancePurchases?.map((product, index) => {
                                        return (
                                            <tr className={`hover cursor-pointer`} key={product.id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-info"
                                                        name="product"
                                                        value={product.id}
                                                        checked={selectedItem === product.id} // Check if the selected item matches the current product ID
                                                        onChange={() => handleCheckboxChange(product)}
                                                    />
                                                </td>

                                                <td>{index + 1}</td>
                                                <td>{product.date}</td>
                                                <td>{product.invoiceNo}</td>
                                                <td>{product.epNo}</td>
                                                <td>{product.truckNo}</td>
                                                <td>{product.transportCountryName}</td>
                                                <td>{product.transportPort}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            {/* Trade Service Provider */}
            <h1 className="text-3xl underline font-bold mt-10 mb-6 text-center text-gray-800">Trade Overseas Service Details Form</h1>
            <div className="">
                <div>
                    <label
                        className="lebel-text text-lg font-semibold"
                        htmlFor="traderServiceProvider">
                        Trade Service Provider
                    </label>
                    <select
                        className="w-full border-[1px] border-info rounded-md p-3 mt-3 bg-transparent"
                        name="traderServiceProvider"
                        value={traderServiceProvider}
                        onChange={(e) => setTraderServiceProvider(e.target.value)}
                        required
                        aria-required
                    >
                        <option value="" disabled>
                            Select Trade Service Provider
                        </option>
                        {
                            serviceProviders && serviceProviders.map(provider => <option value={provider.name}>{provider.name}</option>)
                        }
                        {/* Add more options as needed */}
                    </select>

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                {/* Net Weight */}
                <div className="">
                    <label className="text-lg font-semibold" htmlFor="netWeight">
                        Net Weight
                    </label>
                    <div className="mt-3">
                        <input
                            type="number"
                            className="input input-info w-full"
                            id="netWeight"
                            value={netWeight}
                            name="netWeight"
                            required
                            placeholder="Enter or pick netWeight"
                            list="netWeight" // Associate the input with the datalist for filtering
                            onChange={handleNetWeight}
                        />
                    </div>
                </div>

                {/* Gross Weight */}
                <div className="">
                    <label className="text-lg font-semibold" htmlFor="grossWeight">
                        Gross Weight
                    </label>
                    <div className="mt-3">
                        <input
                            type="number"
                            className="input input-info w-full"
                            id="grossWeight"
                            value={grossWeight}
                            name="grossWeight"
                            required
                            placeholder="Enter or pick grossWeight"
                            list="grossWeight" // Associate the input with the datalist for filtering
                            onChange={handleGrossWeight}
                        />
                    </div>
                </div>
            </div>



            {/* checking element for calculation */}
            <ExpensesForm
                rows={rows}
                setRows={setRows}
                containerServiceProvider={containerServiceProvider}
                setContainerServiceProvider={setContainerServiceProvider}
                formData={formData}
                setFormData={setFormData}
                expenses={charges}
                onExpenseSave={handleExpenseSave}
                onTotalCostChange={handleTotalCostChange}
                shipCostTK={shipCostTK}
                setShipCostTK={setShipCostTK}
                shipCostUSD={shipCostUSD}
                setShipCostUSD={setShipCostUSD}
                totalFareAmount={totalFareAmount}
                setTotalFareAmount={setTotalFareAmount}
                totalAitVat={totalAitVat}
                setTotalAitVat={setTotalAitVat}
                totalCarrierAmount={totalCarrierAmount}
                setTotalCarrierAmount={setTotalCarrierAmount}
                selectedExpensesList={selectedExpensesList}
                setSelectedExpensesList={setSelectedExpensesList}
                handleToFinalSave={handleToFinalSave}
                ipNo={finalIpNo}
                invoiceNo={finalInvoiceNo}
                truckNo={finalTruckNo}
                transportPort={finalTransportPort}
                transportCountry={finalTransportCountry}
            />
        </div>
    );
};

export default PurchaseFinance;