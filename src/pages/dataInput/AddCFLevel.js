import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // For notifications
import { ClipLoader } from "react-spinners";

const AddCFLevel = () => {
    const [cfLevel, setCfLevel] = useState(""); // For the input field to add C&F Level
    const [cfLevels, setCfLevels] = useState([]); // To store the levels fetched from API
    const [loading, setLoading] = useState(false); // Loading state for GET request
    const [adding, setAdding] = useState(false); // Loading state for POST request

    // Fetch C&F Levels on component mount
    useEffect(() => {
        const fetchCFLevels = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase_account"
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
        if (!cfLevel) {
            toast.error("Please enter a C&F Level!");
            return;
        }

        setAdding(true);
        try {
            const payload = {
                id: 1,
                transportWayId: "",
                transportCountryId: "",
                addChargesId: cfLevel,
                officeAccountId: ""
            };
            await axios.put(
                "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase_account",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success("C&F Level added successfully!");
            setCfLevel(""); // Clear input
            setCfLevels([{
                id: 1,
                transportWayId: "",
                transportCountryId: "",
                addChargesId: cfLevel,
                officeAccountId: ""
            }])
            setAdding(false);
        } catch (error) {
            toast.error("Failed to add C&F Level");
            setAdding(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-4 text-center">Add C&F Commission Level</h1>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Add C&F Commission Level</label>
                <input
                    type="text"
                    value={cfLevel}
                    onChange={(e) => setCfLevel(e.target.value)}
                    placeholder="Enter C&F Level"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                    onClick={() => setCfLevel("")}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                    Cancel
                </button>
            </div>

            {/* Display fetched C&F Levels */}
            <div className="mt-6">
                <h2 className="text-lg font-bold mb-4">Existing C&F Commission Level</h2>
                {loading ? (
                    <div>
                        <ClipLoader
                            color={"#36d7b7"}
                            loading={loading}
                            size={50}
                        // cssOverride={override}
                        />
                        <p className="text-center font-extralight text-xl text-green-400">
                            Please wait ....
                        </p>
                    </div>
                ) : (
                    <ul className="list-disc pl-6">
                        {cfLevels.map((level) => (
                            <li key={level.id}>
                                <strong>Charge:</strong> {level.addChargesId}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AddCFLevel;
