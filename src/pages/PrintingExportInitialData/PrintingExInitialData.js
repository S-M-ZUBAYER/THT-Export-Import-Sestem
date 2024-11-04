import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
// import { generateInitialPDF } from './PrintFunctionForInitialData';
import PrintFunctionForInitialData from './PrintFunctionForInitialData';
import { AiOutlineDelete } from 'react-icons/ai';

const PrintingExInitialData = () => {
    const [boxData, setBoxData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [remark, setRemark] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [mark, setMark] = useState('');
    const [receiptNumber, setReceiptNumber] = useState('');
    const [palletNo, setPalletNo] = useState('');
    const [totalPalletNo, setTotalPalletNo] = useState(0);
    const [totalBoxPallet, setTotalBoxPallet] = useState('');
    const [language, setLanguage] = useState("EN");
    const [location, setLocation] = useState("China");
    const [company, setCompany] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [printedData, setPrintedData] = useState({});
    const [printData, setPrintData] = useState({});





    useEffect(() => {
        fetchBoxData();
    }, []);

    const fetchBoxData = async () => {
        try {
            const response = await axios.get(
                "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes"
            );
            const sortedData = response?.data.sort((a, b) => b.id - a.id); // Sort data by descending order
            setBoxData(sortedData);
            setFilteredData(sortedData);
            setLoading(false);
        } catch (error) {
            console.error("Error from server to get data!!");
            setLoading(false);
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
    };

    // Handle selecting/deselecting items
    const handleCheckboxChange = (product) => {
        // Check if there are already selected items
        if (selectedItems.length > 0) {
            // Get the totalPallet of the first selected item
            const selectedTotalPallet = selectedItems[0]?.totalPallet;

            // If the new product's totalPallet doesn't match, don't select it
            if (product.totalPallet !== selectedTotalPallet) {
                alert("You can only select products with the same pallet number.");
                return;
            }
        }

        if (selectedItems.some(item => item.id === product.id)) {
            // Deselect the item
            const newSelectedItems = selectedItems.filter(item => item.id !== product.id);
            setSelectedItems(newSelectedItems);
            setPrintedData({ ...printedData, printData: newSelectedItems });
        } else {
            // Select the item (add full product data)
            const newSelectedItems = [...selectedItems, product];
            setSelectedItems(newSelectedItems);
            setPrintedData({ ...printedData, printData: newSelectedItems });
        }
    };


    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(filteredData); // Select all filtered data
        } else {
            setSelectedItems([]); // Deselect all
        }
    };
    // product delete from server and also frontend
    // const handleDelete = async (product) => {
    //     const confirmDelete = window.confirm(
    //         "Are you sure, you want to delete this Product Data?"
    //     );
    //     if (confirmDelete) {
    //         try {
    //             try {
    //                 await axios.delete(
    //                     `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes/${product?.id}`
    //                 );
    //                 toast.warn("Data successfully Deleted!!", { position: "top-center" });
    //                 setFilteredData(filteredData.filter(products => products.id !== product?.id))
    //             } catch (error) {
    //                 toast.error("You can't delete now. Please try again later!", {
    //                     position: "top-center",
    //                 });
    //             }
    //         } catch (error) {
    //             console.error(error);

    //         }

    //     }
    // };
    const handleDelete = async (product) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Product Data?");

        if (confirmDelete) {
            try {
                // Step 1: Fetch all products from `office_accounts` once
                const response = await axios.get(`https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts`);
                const officeAccounts = response.data;

                // Step 2: Parse quantities and models into arrays
                const quantities = product.splitQuantitySingleProduct.split(',').map(q => parseFloat(q.trim()));
                const models = product.productModel.split(',').map(m => m.trim());

                // Validation check: Quantities and models should have the same length
                if (quantities.length !== models.length) {
                    console.error("Quantities and models mismatch. Please check the data.");
                    toast.error("Quantities and models mismatch. Please check the data.");
                    return;
                }

                // Step 3: Loop through each model and update or add
                for (let i = 0; i < models.length; i++) {
                    const model = models[i];
                    const quantity = quantities[i];

                    // Find existing product matching model and product name
                    const existingProduct = officeAccounts.find(
                        item => item.productModel === model && item.productName === product.productName && item.date === product.date
                    );
                    console.log({
                        ...existingProduct,
                        productQuantity: parseFloat(existingProduct.productQuantity) + quantity,
                        usedProduct: parseFloat(existingProduct.usedProduct) - quantity
                    }, "data");

                    if (existingProduct) {
                        // Update existing product's quantity and usedProduct
                        await axios.put(
                            `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts`,
                            {
                                ...existingProduct,
                                productQuantity: parseFloat(existingProduct.productQuantity) + quantity,
                                usedProduct: parseFloat(existingProduct.usedProduct) - quantity
                            }
                        );
                        toast.success(`Updated ${model} successfully!`, { position: "top-center" });
                    } else {
                        // Create a new product entry if it doesn't exist
                        await axios.post(
                            `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts`,
                            {
                                date: product.date,
                                productModel: model,
                                productBrand: product.productBrand,
                                productName: product.productName,
                                productQuantity: quantity,
                                usedProduct: 0
                            }
                        );
                        toast.success(`Added new product for ${model}!`, { position: "top-center" });
                    }
                }

                // Step 4: Delete the product in `product_in_boxes`
                await axios.delete(
                    `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes/${product?.id}`
                );

                toast.warn("Data successfully Deleted!!", { position: "top-center" });
                setFilteredData(filteredData.filter((p) => p.id !== product?.id));

            } catch (error) {
                console.error("Error occurred:", error);
                toast.error("An error occurred. Please try again later!", { position: "top-center" });
            }
        }
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
                                <th className="sticky top-0 bg-gray-200 w-12">Serial No</th>
                                <th className="sticky top-0 bg-gray-200">Date</th>
                                <th className="sticky top-0 bg-gray-200">Product Name</th>
                                <th className="sticky top-0 bg-gray-200">Product Model</th>
                                <th className="sticky top-0 bg-gray-200">splitQuantity</th>
                                <th className="sticky top-0 bg-gray-200">Quantity</th>
                                <th className="sticky top-0 bg-gray-200">Pallet No.</th>
                                <th className="sticky top-0 bg-gray-200">Truck No.</th>
                                <th className="sticky top-0 bg-gray-200">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((product, index) => (
                                <tr className="hover cursor-pointer" key={product.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-info"
                                            checked={selectedItems.some(item => item.id === product.id)}
                                            onChange={() => handleCheckboxChange(product)}
                                        />
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{product?.date}</td>
                                    <td>{product?.productName}</td>
                                    <td>{product?.productModel}</td>
                                    <td>{product?.splitQuantitySingleProduct}</td>
                                    <td>{product?.quantity}</td>
                                    <td>{product?.totalPallet}</td>
                                    <td>{product?.truckNumber}</td>
                                    <td>
                                        <button onClick={() => handleDelete(product)}>
                                            <AiOutlineDelete className="w-6 h-6 text-red-600" />
                                        </button>
                                    </td>
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
                        <option value="MS">Malaysia</option>
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
                language === "MS" && <div className="flex flex-col">
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
                <label className="text-lg font-bold text-purple-950 mb-2" htmlFor="totalPalletNo">
                    Total Pallet Number
                </label>
                <input
                    id="totalPalletNo"
                    type="number"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter total pallet number..."
                    value={totalPalletNo}
                    onChange={(e) => setTotalPalletNo(e.target.value)}
                />
            </div>


            {/* Receipt Number Input */}
            {
                language === "MS" && <div className="flex flex-col">
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


            <PrintFunctionForInitialData
                finalData={{ ...printedData, language, mark, remark, quantity, company, receiptNumber, palletNo, totalBoxPallet, language, location, totalPalletNo }}
            ></PrintFunctionForInitialData>
        </div>
    );
};

export default PrintingExInitialData;
