import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../components/context/authContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const FinanceDetails = () => {

    const { financeDetailsData } = useContext(UserContext);
    const [invoiceValue, setInvoiceValue] = useState(0);
    console.log(financeDetailsData, "finalData");

    const handleToReject = () => {
        // Create a copy of financeDetailsData and change the status to "purchase"
        let rejectedData = {
            ...financeDetailsData, // Copy all properties of financeDetailsData
            status: "purchase"     // Update the status field to "purchase"
        };

        console.log(rejectedData, "rejected data"); // Debugging output

        // Now save the updated data to the API
        axios.put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase', rejectedData)
            .then(response => {
                toast.warn('Data rejected from finance successfully!');
            })
            .catch(error => {
                toast.error('Failed to reject from finance!');
            });
    }
    useEffect(() => {
        if (financeDetailsData.tradeExchangeRate) {
            setInvoiceValue(financeDetailsData.tradeExchangeRate * financeDetailsData.total)
        }
    }, [])

    // State to control modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State to handle the dollar exchange rate input
    const [dollarExchangeRate, setDollarExchangeRate] = useState('');

    // Function to open modal
    const handleToUpdate = () => {
        setIsModalOpen(true);
    };

    // Function to close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Function to handle update logic
    const handleUpdate = () => {
        if (!dollarExchangeRate) {
            toast.error("Please Input Exchange Rate first");
            return;
        }
        console.log('Dollar Exchange Rate:', dollarExchangeRate);


        let AcceptedData = {
            ...financeDetailsData, // Copy all properties of financeDetailsData
            status: "finance",
            finalStatus: "done",
            tradeExchangeRate: dollarExchangeRate,
            // Update the key names
            financeContainerExpenseNames: financeDetailsData.containerExpenseNames,
            financeParticularExpenseNames: financeDetailsData.particularExpenseNames,
            financeProductInBoxes: financeDetailsData.purchaseProductInBoxes,
            financeCharges: financeDetailsData.chargesList
        };

        // Remove the old keys if necessary
        delete AcceptedData.containerExpenseNames;
        delete AcceptedData.particularExpenseNames;
        delete AcceptedData.purchaseProductInBoxes;
        delete AcceptedData.chargesList;
        console.log(AcceptedData, "AcceptedData data"); // Debugging output 

        // Now save the updated data to the API
        axios.post('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', AcceptedData)
            .then(response => {
                toast.success('Accepted by finance successfully!');

                // Assuming the id is part of the AcceptedData
                const financeId = AcceptedData.id;

                // Perform the delete request after successful post
                axios.delete(`https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance/${financeId}`)
                    .then(() => {
                        toast.warn('Deleted from finance successfully!');
                        setIsModalOpen(false); // Close the modal after delete success
                    })
                    .catch(error => {
                        toast.error('Failed to delete from finance!');
                    });
            })
            .catch(error => {
                toast.error('Failed to accept by finance!');
            });


    };

    // const handleSave = () => {
    //     setSelectedPurchase((prevState) => {
    //         const updatedPurchase = { ...prevState, status: "finalPurchase" };
    //         console.log(updatedPurchase, "selectedPurchase after update");
    //         return updatedPurchase;
    //     });
    //     console.log(selectedPurchase, "selected purchase");


    //     // Now save to the API (you can do this after ensuring the state is correct)
    //     axios.put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase', selectedPurchase)
    //         .then(response => {
    //             toast.success('Data saved successfully!');
    //             closeModal();
    //         })
    //         .catch(error => toast.error('Failed to save data!'));
    // };

    const handleToTradePay = () => {
        console.log("TradePay")
        let tradePayData = {
            ...financeDetailsData, // Copy all properties of financeDetailsData
            status: "finance",
            tradeExpanseStatus: true,
        };
        // Now save the updated data to the API
        axios.post('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', tradePayData)
            .then(response => {
                toast.success('trade by finance successfully!');})
    }
    const handleToShippingPay = () => {
        console.log("ShippingPay")
        let ShippingPayData = {
            ...financeDetailsData, // Copy all properties of financeDetailsData
            seaExpanseStatus: true,
        };
        // Now save the updated data to the API
        axios.post('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', ShippingPayData)
            .then(response => {
                toast.success('ship by finance successfully!');
            })
    }
    const handleToContainerPay = () => {
        console.log("ContainerPay")
        let containerPayData = {
            ...financeDetailsData, 
            carrierExpanseStatus: true,
        };
        // Now save the updated data to the API
        axios.post('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', containerPayData)
            .then(response => {
                toast.success('carrier by finance successfully!');
            })
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
                <h1 className="text-xl font-bold mb-4">Shipment and Invoice Details</h1>
                <div className="space-y-4">
                    <div>
                        <strong>Bill No:</strong> {financeDetailsData.blNo}
                    </div>
                    <div>
                        <strong>EP Number:</strong> {financeDetailsData.epNumber}
                    </div>
                    <div>
                        <strong>Container No:</strong> {financeDetailsData.containerNo}
                    </div>
                    <div>
                        <strong>Container Type/Size:</strong> {financeDetailsData.containerTypeSize}
                    </div>
                    <div>
                        <strong>Fare Amount (USD):</strong> {financeDetailsData.fareAmount}
                    </div>
                    <div>
                        <strong>AIT/VAT (USD):</strong> {financeDetailsData.aitVat}
                    </div>
                    <div>
                        <strong>Destination:</strong> {financeDetailsData.destination}
                    </div>
                    <div>
                        <strong>Vessel/Voyage:</strong> {financeDetailsData.vslVoy}
                    </div>
                    <div>
                        <strong>Invoice No:</strong> {financeDetailsData.invoiceNo}
                    </div>
                    <div>
                        <strong>Date:</strong> {financeDetailsData.date}
                    </div>
                    <div>
                        <strong>ETD:</strong> {financeDetailsData.etd}
                    </div>
                    <div>
                        <strong>Gross Weight (kg):</strong> {financeDetailsData.grossWeight}
                    </div>
                    <div>
                        <strong>Net Weight (kg):</strong> {financeDetailsData.netWeight}
                    </div>
                </div>

                <h2 className="text-xl font-bold mt-6">Particular Charges</h2>
                <table className="table-auto w-full mt-2 border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-right">Amount (BDT)</th>
                            <th className="px-4 py-2 text-right">Amount (USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {financeDetailsData.chargesList ? (
                            financeDetailsData.chargesList.map((charge, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{charge.description}</td>
                                    <td className="px-4 py-2 text-right">{charge.amountBDT}</td>
                                    <td className="px-4 py-2 text-right">{charge.amountUSD}</td>
                                </tr>
                            ))
                        ) : (
                            financeDetailsData.financeCharges.map((charge, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{charge.description}</td>
                                    <td className="px-4 py-2 text-right">{charge.amountBDT}</td>
                                    <td className="px-4 py-2 text-right">{charge.amountUSD}</td>
                                </tr>
                            ))
                        )}

                    </tbody>
                    <button onClick={handleToTradePay} >Trade Pay</button>
                    <button onClick={handleToShippingPay} >Shipping Pay</button>
                    <button onClick={handleToContainerPay} >Container Pay</button>
                </table>

                <h2 className="text-xl font-bold mt-6">Total Amounts</h2>
                <div className="space-y-2">
                    <div>
                        <strong>Total Amount (BDT):</strong> {financeDetailsData.totalAmountBDT}
                    </div>
                    <div>
                        <strong>Total Amount (USD):</strong> {financeDetailsData.totalAmountUSD}
                    </div>
                    <div>
                        <strong>Total AIT/VAT (USD):</strong> {financeDetailsData.totalAitVat}
                    </div>
                    <div>
                        <strong>Total Carrier Amount (USD):</strong> {financeDetailsData.totalCarrierAmount}
                    </div>
                </div>

                <h2 className="text-xl font-bold mt-6">Product Details</h2>
                <div className="space-y-2">
                    <div>
                        <strong>Product Model:</strong> {financeDetailsData.productModel}
                    </div>
                    <div>
                        <strong>Product Name:</strong> {financeDetailsData.productName}
                    </div>
                    <div>
                        <strong>Total Boxes:</strong> {financeDetailsData.totalBox}
                    </div>
                    <div>
                        <strong>Weight Per Box (kg):</strong> {financeDetailsData.weightPerBox}
                    </div>
                    <div>
                        <strong>Individual Total Box Weight (kg):</strong> {financeDetailsData.individualTotalBoxWeight}
                    </div>
                    <div>
                        <strong>Total Pallet:</strong> {financeDetailsData.totalPallet}
                    </div>
                    <div>
                        <strong>Truck Number:</strong> {financeDetailsData.truckNumber}
                    </div>
                </div>

                <h2 className="text-xl font-bold mt-6">Additional Information</h2>
                <div className="space-y-2">
                    <div>
                        <strong>Shipper:</strong> {financeDetailsData.shipper}
                    </div>
                    <div>
                        <strong>Transport Way:</strong> {financeDetailsData.transportWay}
                    </div>
                    <div>
                        <strong>Transport Country:</strong> {financeDetailsData.transportCountry}
                    </div>
                    <div>
                        <strong>Transport Port:</strong> {financeDetailsData.transportPort}
                    </div>
                    <div>
                        <strong>Service Provider:</strong> {financeDetailsData.serviceProvider}
                    </div>
                </div>
                {
                    financeDetailsData.tradeExchangeRate != 0 &&
                    <>
                        <div>
                            <strong>Trade Exchange Rate:</strong> {financeDetailsData.tradeExchangeRate}
                        </div>
                        <div>
                            <strong>Invoice Value:</strong> {invoiceValue}
                        </div>
                    </>
                }
                {
                    financeDetailsData.tradeExchangeRate ? "" :
                        <div className="flex justify-end">
                            <button className="bg-red-400 mr-10 px-3 py-1" onClick={handleToReject}>Reject</button>
                            <button className="bg-green-500  px-3 py-1" onClick={handleToUpdate}>Update</button>
                        </div>
                }


            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        {/* Modal Header */}
                        <h2 className="text-xl font-semibold mb-4">Update Dollar Exchange Rate</h2>

                        {/* Input Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dollar Exchange Rate
                            </label>
                            <input
                                type="number"
                                className="border border-gray-300 p-2 rounded w-full"
                                placeholder="Enter Dollar Exchange Rate"
                                value={dollarExchangeRate}
                                onChange={(e) => setDollarExchangeRate(e.target.value)}
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="flex justify-end space-x-4">
                            {/* Close button */}
                            <button
                                className="bg-gray-400 text-white py-2 px-4 rounded"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>

                            {/* Update button */}
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceDetails;
