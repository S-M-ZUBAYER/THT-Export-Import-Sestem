import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { generateInitialPDF } from './PrintFunctionForInitialData';

const PrintingExInitialData = () => {
    const [boxData, setBoxData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [remark, setRemark] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [mark, setMark] = useState('');
    const [receiptNumber, setReceiptNumber] = useState('');
    const [totalPallet, setTotalPallet] = useState('');
    const [totalBoxPallet, setTotalBoxPallet] = useState('');
    const [language, setLanguage] = useState("EN");
    const [location, setLocation] = useState("China");
    const [company, setCompany] = useState("");


    console.log(mark, receiptNumber, totalPallet, totalBoxPallet, language, location, company, "check");


    useEffect(() => {
        fetchBoxData();
    }, []);

    const fetchBoxData = async () => {
        try {
            const response = await axios.get(
                "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes"
            );
            const sortedData = response?.data.sort((a, b) => b.id - a.id); // Sort data by descending order
            console.log(sortedData, "productInBox");
            setBoxData(sortedData);
            setFilteredData(sortedData);
            setLoading(false);
        } catch (error) {
            toast.error("Error from server to get data!!");
        }
    };

    // Handle input change and filter products
    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchValue(value);

        const filteredProducts = boxData.filter((account) =>
            account.productName.toLowerCase().includes(value) ||
            account.truckNumber.toLowerCase().includes(value) ||
            account.productModel.toLowerCase().includes(value) ||
            account.totalPallet.toLowerCase().includes(value) ||
            account.date.toLowerCase().includes(value)
        );

        setFilteredData(filteredProducts);
        console.log(value, filteredProducts);
    };

    // Handle selecting/deselecting items
    const handleCheckboxChange = (product) => {
        if (selectedItems.some(item => item.id === product.id)) {
            // Deselect the item
            setSelectedItems(selectedItems.filter(item => item.id !== product.id));
        } else {
            // Select the item (add full product data)
            setSelectedItems([...selectedItems, product]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(filteredData); // Select all filtered data
        } else {
            setSelectedItems([]); // Deselect all
        }
    };
    const handlePrint = (selectedItems) => {
        // generatePDF(finances[currentPage]);
        generateInitialPDF(selectedItems, remark);
    };

    return (
        <div className="w-full lg:w-3/4 mx-auto">
            <div className="flex justify-between items-center my-6 bg-slate-500 p-3 rounded-lg">
                <h1 className="text-3xl text-info font-bold uppercase">
                    Select the Product
                </h1>
                <input
                    type="text"
                    placeholder="Search date, model, pallet no, truck no"
                    className="border border-gray-300 p-2 rounded-md focus:outline-none"
                    value={searchValue}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="overflow-x-auto add__scrollbar">
                {loading ? (
                    <div className="text-center">
                        <ClipLoader color={"#36d7b7"} loading={loading} size={50} />
                        <p className="font-extralight text-xl text-green-400">
                            Please wait ....
                        </p>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="sticky top-0 bg-gray-200"> <input
                                    className="mr-1"
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                                /> Select All</th>
                                <th className="sticky top-0 bg-gray-200">ID</th>
                                <th className="sticky top-0 bg-gray-200">Date</th>
                                <th className="sticky top-0 bg-gray-200">Product Name</th>
                                <th className="sticky top-0 bg-gray-200">Product Model</th>
                                <th className="sticky top-0 bg-gray-200">splitQuantity</th>
                                <th className="sticky top-0 bg-gray-200">Quantity</th>
                                <th className="sticky top-0 bg-gray-200">Pallet No.</th>
                                <th className="sticky top-0 bg-gray-200">Truck No.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((product) => (
                                <tr className="hover cursor-pointer" key={product.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-info"
                                            checked={selectedItems.some(item => item.id === product.id)}
                                            onChange={() => handleCheckboxChange(product)}
                                        />
                                    </td>
                                    <td>{product.id}</td>
                                    <td>{product.date}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.productModel}</td>
                                    <td>{product.splitQuantitySingleProduct}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.totalPallet}</td>
                                    <td>{product.truckNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="grid grid-cols-2 gap-10 mt-20">
                <div className="">
                    <label className="text-lg font-bold text-purple-950 mb-2" htmlFor="languageSelect">
                        Select Language
                    </label>
                    <select
                        id="languageSelect"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="EN">English</option>
                        <option value="CN">Chinese</option>
                    </select>
                </div>

                {/* Location Select Field */}
                <div className="">
                    <label className="text-lg font-bold text-purple-950 mb-2" htmlFor="locationSelect">
                        Select Location
                    </label>
                    <select
                        id="locationSelect"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        <option value="China">China</option>
                        <option value="Philippines">Philippines</option>
                    </select>
                </div>
            </div>

            {
                location === "Philippines" && <div className="flex flex-col">
                    <label className="text-lg font-bold text-purple-950 mb-2" htmlFor="remarkInput">
                        Company Name
                    </label>
                    <input
                        id="CountryInput"
                        type="text"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="Enter Company Name..."
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                    />
                </div>
            }

            <div className="flex flex-col">
                <label className="text-lg font-bold text-purple-950 mb-2" htmlFor="remarkInput">
                    Add Remark
                </label>
                <input
                    id="remarkInput"
                    type="text"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter your remark..."
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                />
            </div>
            {/* Mark Text Area */}
            <div className="flex flex-col">
                <label className="text-lg font-bold text-purple-950 mb-2" htmlFor="markInput">
                    Add Mark
                </label>
                <textarea
                    id="markInput"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none h-24"
                    placeholder="Type your mark here..."
                    value={mark}
                    onChange={(e) => setMark(e.target.value)}
                />
            </div>
            {/* Total Pallet No Input */}
            <div className="flex flex-col">
                <label className="text-lg font-bold text-purple-950 mb-2" htmlFor="totalPallet">
                    Total Pallet No
                </label>
                <input
                    id="totalPallet"
                    type="number"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter total pallet number..."
                    value={totalPallet}
                    onChange={(e) => setTotalPallet(e.target.value)}
                />
            </div>
            {/* Total Box in a Pallet Input */}
            <div className="flex flex-col">
                <label className="text-lg font-bold text-purple-950 mb-2" htmlFor="totalBoxPallet">
                    Total Box in a Pallet
                </label>
                <input
                    id="totalBoxPallet"
                    type="number"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter total boxes in a pallet..."
                    value={totalBoxPallet}
                    onChange={(e) => setTotalBoxPallet(e.target.value)}
                />
            </div>

            {/* Receipt Number Input */}
            {
                location === "Philippines" && <div className="flex flex-col">
                    <label className="text-lg font-bold text-purple-950 mb-2" htmlFor="receiptNumber">
                        Receipt Number
                    </label>
                    <input
                        id="receiptNumber"
                        type="text"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="Enter receipt number..."
                        value={receiptNumber}
                        onChange={(e) => setReceiptNumber(e.target.value)}
                    />
                </div>
            }

            <div className="flex justify-end my-5">
                <button
                    className="btn-info font-bold px-[20px] py-[3px] mt-4 rounded-lg text-purple-950 hover:text-amber-500 "
                    onClick={() => handlePrint(selectedItems)}>
                    Print
                </button>
            </div>

        </div>
    );
};

export default PrintingExInitialData;
