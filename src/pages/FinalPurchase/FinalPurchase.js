import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const FinalPurchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch data from API
    useEffect(() => {
        axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase')
            .then(response => setPurchases(response.data))
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
        setSelectedPurchase({
            ...selectedPurchase,
            [name]: value,
        });
    };

    const handleSave = () => {
        // Save the updated data to the finance API
        axios.post('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', selectedPurchase)
            .then(response => {
                toast.success('Data saved successfully!');
                closeModal();
            })
            .catch(error => toast.error('Failed to save data!'));
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Purchases</h1>
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
                    {purchases.map((purchase) => (
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
                    ))}
                </tbody>
            </table>

            {isModalOpen && selectedPurchase && (
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
            )}
        </div>
    );
};

export default FinalPurchase;
