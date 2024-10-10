import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // For notifications
import { ClipLoader } from "react-spinners";
import { fill } from "lodash";

const AddCFLevel = () => {
    const [cfLevel, setCfLevel] = useState(""); // For the input field to add C&F Level
    const [serviceProvider, setServiceProvider] = useState(""); // For the input field to add C&F Level
    const [fix, setFix] = useState(""); // For the input field to add C&F Level
    const [cfLevels, setCfLevels] = useState([]); // To store the levels fetched from API
    const [loading, setLoading] = useState(false); // Loading state for GET request
    const [adding, setAdding] = useState(false); // Loading state for POST request
    const [isFix, setIsFix] = useState(false);

    // Fetch C&F Levels on component mount
    useEffect(() => {
        const fetchCFLevels = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/trade_service"
                );
                setCfLevels(response.data);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch data");
                setLoading(false);
            }
        };

        fetchCFLevels();
    }, []);

    // Handle adding new C&F Level
    const handleAddCFLevel = async () => {
        if (!cfLevel || !serviceProvider) {
            toast.error("Please enter both a Service Provider Name and a C&F Level!");
            return;
        }

        setAdding(true);

        try {
            const payload = {
                name: serviceProvider,
                status: isFix ? "fix" : "",
                level: cfLevel // Assuming cfLevel doesn't need parent()
            };

            console.log(payload);
            await axios.post(
                "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/trade_service",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("C&F Level added successfully!");

            // Clear input fields
            setCfLevel("");
            setServiceProvider("");

            // Add the new C&F level to the state
            // setCfLevels((prevCfLevels) => [
            //     ...prevCfLevels,
            //     {
            //         id: prevCfLevels.length + 1, // Assuming IDs are incremental
            //         transportWayId: "",
            //         transportCountryId: "",
            //         addChargesId: cfLevel,
            //         officeAccountId: ""
            //     }
            // ]);

            setAdding(false);
        } catch (error) {
            toast.error("Failed to add C&F Level");
            setAdding(false);
        }
    };

    const handleToCancel = () => {
        setCfLevel("");
        setServiceProvider("");
        setIsFix(false);
    }

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(null);

    // Open modal and set selected level for editing
    const openModal = (level) => {
        setSelectedLevel(level);
        setModalIsOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedLevel(null);
    };

    // Handle input change in modal
    const handleChange = (e) => {
        console.log("click");
        const { name, value } = e.target;
        setSelectedLevel({
            ...selectedLevel,
            [name]: value
        });
    };

    const handleToUpdate = async () => {
        try {
            // Make the PUT request to update the C&F level
            await axios.put(
                "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/trade_service",
                selectedLevel,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Show success notification
            toast.success("C&F Level Updated successfully!");

            // Close the modal after success
            closeModal();

            // Filter out the old level and update with the new selectedLevel in the state
            const updatedCfLevels = cfLevels.map(level =>
                level.id === selectedLevel.id ? selectedLevel : level
            );

            // Update the state with the newly updated level
            setCfLevels(updatedCfLevels);

        } catch (error) {
            // Show error notification if the update fails
            toast.error("Failed to update C&F Level");
        }
    };


    return (
        <div className="max-w-[1000mx] mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-4 text-center">Add C&F Commission Level</h1>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Service Provider Name</label>
                <input
                    type="text"
                    value={serviceProvider}
                    onChange={(e) => setServiceProvider(e.target.value)}
                    placeholder="Enter Service Provider Name"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Add C&F Commission Level</label>
                <input
                    type="number"
                    value={cfLevel}
                    onChange={(e) => setCfLevel(e.target.value)}
                    placeholder="Enter C&F Level"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">C&F Commission Type</label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="commissionType"
                            value="notFix"
                            checked={isFix === false}
                            onChange={() => setIsFix(false)}
                            className="mr-2"
                        />
                        Not Fix
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="commissionType"
                            value="fix"
                            checked={isFix === true}
                            onChange={() => setIsFix(true)}
                            className="mr-2"
                        />
                        Fix
                    </label>

                </div>
            </div>


            <div className="flex justify-between">
                <button
                    onClick={handleAddCFLevel}
                    disabled={adding}
                    className={`px-4 py-2 rounded text-white ${adding ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
                        }`}
                >
                    {adding ? "Adding..." : "Add"}
                </button>

                <button
                    onClick={handleToCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                    Cancel
                </button>
            </div>

            {/* Display fetched C&F Levels */}
            <div className="mt-6">
                <h2 className="text-lg font-bold mb-4">Existing C&F Commission Levels</h2>
                {loading ? (
                    <div className="text-center">
                        <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
                        <p className="mt-4 text-green-500 text-lg">Please wait...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left py-2 px-4 border-b font-medium text-gray-600">Service Provider</th>
                                    <th className="text-left py-2 px-4 border-b font-medium text-gray-600">Level</th>
                                    <th className="text-left py-2 px-4 border-b font-medium text-gray-600">Status</th>
                                    <th className="text-left py-2 px-4 border-b font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cfLevels.map((level, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{level.name}</td>
                                        <td className="py-2 px-4 border-b">{level.level}</td>
                                        <td className="py-2 px-4 border-b">{level.status || 'Not Fixed'}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => openModal(level)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                ✏️ Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}


                {/* Modal for editing */}
                {modalIsOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-lg font-bold mb-4">Edit C&F Commission Level</h2>
                            {selectedLevel && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold mb-2">Service Provider Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={selectedLevel.name}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold mb-2">C&F Level</label>
                                        <input
                                            type="text"
                                            name="level"
                                            value={selectedLevel.level}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold mb-2">Status</label>
                                        <select
                                            name="status"
                                            value={selectedLevel.status}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Not Fixed</option>
                                            <option value="fix">Fixed</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={closeModal}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={
                                                handleToUpdate}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCFLevel;
