import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logDOM } from '@testing-library/react';
import FinalPurchaseModal from './FinalPurchaseModal';



const FinalPurchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch data from API
    useEffect(() => {
        axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase')
            .then(response => {
                console.log(response.data);

                const finalPurchases = response.data.filter((purchase) => purchase.status === "purchase"
                )
                setPurchases(finalPurchases);
                setFilteredPurchases(finalPurchases);
            }
            )
            .catch(error => toast.error('Failed to fetch data!'));
    }, []);

    const openModal = (purchase) => {
        setSelectedPurchase(purchase);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPurchase(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedPurchase((prevState) => ({
            ...prevState,
            [name]: value,
            status: "finalPurchase"
        }));
    };

    const handleSave = () => {

        setSelectedPurchase((prevState) => {
            const updatedPurchase = { ...prevState, status: "finalPurchase" };
            return updatedPurchase;
        });
        const updatedPurchase = { ...selectedPurchase, status: "finalPurchase" };
        const updatedFinance = {
            ...selectedPurchase,
            status: "finalPurchase",
            financeContainerExpenseNames: selectedPurchase.containerExpenseNames,
            financeParticularExpenseNames: selectedPurchase.particularExpenseNames,
            financeProductInBoxes: selectedPurchase.purchaseProductInBoxes,
            financeCharges: selectedPurchase.chargesList
        };


        delete updatedFinance.containerExpenseNames;
        delete updatedFinance.particularExpenseNames;
        delete updatedFinance.purchaseProductInBoxes;
        delete updatedFinance.chargesList;




        // Now save to the API (you can do this after ensuring the state is correct)
        axios.put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase', updatedPurchase)
            .then(response => {
                toast.success('Data saved successfully!');
                closeModal();
            })
            .catch(error => toast.error('Failed to save data!'));

        // Now save to the API (you can do this after ensuring the state is correct)
        axios.post('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', updatedFinance)
            .then(response => {
                toast.success('Data saved successfully!');
                closeModal();
            })
            .catch(error => toast.error('Failed to save data!'));

    };


    const [searchValue, setSearchValue] = useState('');


    // Handle input change and filter products
    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase(); // Use the current input value
        setSearchValue(value);
        console.log(purchases, "purchases");

        // Use `value` directly in the filter instead of `searchValue`
        const filteredProducts = purchases.filter((account) =>
            account.transportWay.toLowerCase().includes(value) ||
            account.truckNo.toLowerCase().includes(value) ||
            account.transportCountry.toLowerCase().includes(value) ||
            account.date.toLowerCase().includes(value) ||
            account.invoiceNo.toLowerCase().includes(value) ||
            account.EpNo.toLowerCase().includes(value)
        );
        console.log(filteredProducts, "filteredProducts");

        setFilteredPurchases(filteredProducts);
    };
    console.log(purchases, "purchases");


    return (
        <div className="container mx-auto px-4">
            <div className="">
                <h1 className="flex justify-center items-center text-4xl my-4 uppercase text-info font-bold">
                    Shipment Details Show And Update
                </h1>
                <p className="text-red-600 text-sm text-center font-medium">
                    ** Please Fillup this form carefully & check all fields. You can't modify it later. **
                </p>

                {/* Table data fetched from accounts input database */}
                <div className="w-full lg:w-3/4 mx-auto">
                    <div className="flex justify-between items-center my-6 bg-slate-500 p-3 rounded-lg">
                        <h1 className="text-3xl text-info font-bold uppercase">
                            Select the Product
                        </h1>
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
                                            <button
                                                onClick={() => openModal(purchase)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                                            >
                                                Details
                                            </button>
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

                    {/* Modal for Editing Purchase Details */}
                    {/* {isModalOpen && selectedPurchase && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                                <h2 className="text-xl font-bold mb-4">Edit Purchase Details</h2>

                                <div className="mb-4">
                                    <label className="block font-medium">Transport Way</label>
                                    <input
                                        type="text"
                                        name="transportWay"
                                        value={selectedPurchase.transportWay}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block font-medium">Country</label>
                                    <input
                                        type="text"
                                        name="transportCountryName"
                                        value={selectedPurchase.transportCountryName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block font-medium">Invoice No</label>
                                    <input
                                        type="text"
                                        name="invoiceNo"
                                        value={selectedPurchase.invoiceNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block font-medium">Total Cost</label>
                                    <input
                                        type="text"
                                        name="totalCost"
                                        value={selectedPurchase.totalCost}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={closeModal}
                                        className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )} */}
                    {/* Modal Component */}
                    <FinalPurchaseModal
                        isOpen={isModalOpen}
                        selectedPurchase={selectedPurchase}
                        handleChange={handleChange}
                        handleSave={handleSave}
                        closeModal={closeModal}
                    />
                </div>
            </div>
        </div>

    );
};

export default FinalPurchase;

