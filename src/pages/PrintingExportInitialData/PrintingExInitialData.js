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
            account.totalPallet.toLowerCase().includes(value)
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
                    placeholder="Search model, pallet no, truck no"
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
                                <th className="sticky top-0 bg-gray-200 flex items-center">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                                    /> <p className="ml-3">Select All</p>
                                </th>
                                <th className="sticky top-0 bg-gray-200">ID</th>
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
            <div className="mt-5">
                {/* Remark Input Area */}
                <div className="flex flex-col mb-5">
                    <label className="text-lg font-bold text-purple-950 mb-2" htmlFor="remarks">
                        Add Remarks
                    </label>
                    <textarea
                        id="remarks"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none h-24"
                        placeholder="Type your remarks here..."
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                    />
                </div>
            </div>
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
