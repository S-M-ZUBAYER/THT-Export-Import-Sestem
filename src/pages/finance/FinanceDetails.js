import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../components/context/authContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const FinanceDetails = () => {

    const { financeDetailsData, setFinanceDetailsData } = useContext(UserContext);
    const [invoiceValue, setInvoiceValue] = useState(0);
    console.log(financeDetailsData, "finalData");

    const handleToReject = () => {
        const confirmReject = window.confirm("Are you sure Do you want to reject this export information?");
        // Fetch purchase details using the invoice number
        if (confirmReject) {
            axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase')
                .then(response => {
                    console.log(response.data);

                    // Find the purchase matching the invoice number from financeDetailsData
                    const finalPurchases = response.data.find(
                        (purchase) => purchase.invoiceNo === financeDetailsData.invoiceNo
                    );

                    if (!finalPurchases) {
                        toast.error('No purchase found for this invoice number!');
                        return;
                    }

                    // Create rejected data with the updated status
                    let rejectedData = {
                        ...finalPurchases, // Copy all properties of finalPurchases
                        status: "purchase" // Update the status to "purchase"
                    };

                    console.log(rejectedData, "rejected data"); // Debugging output

                    // Update the purchase data by making a PUT request
                    axios.put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase', rejectedData)
                        .then(() => {
                            toast.warn('Data rejected from finance successfully!');

                            // After successful PUT, delete the finance entry
                            return axios.delete(`https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance/${financeDetailsData.id}`);
                        })
                        .then(() => {
                            toast.warn('Finance data deleted successfully!');
                        })
                        .catch(error => {
                            console.error('Error during rejection process:', error);
                            toast.error('Failed to reject data or delete finance data!');
                        });
                })
                .catch(error => {
                    console.error('Error fetching purchase data:', error);
                    toast.error('Failed to fetch purchase data!');
                });
        }

    };




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

        // Create a copy of financeDetailsData with updated fields
        let AcceptedData = {
            ...financeDetailsData, // Copy all properties of financeDetailsData
            status: "finance",
            finalStatus: "done",
            tradeExchangeRate: dollarExchangeRate,
            // Rename fields
            financeContainerExpenseNames: financeDetailsData.containerExpenseNames,
            financeParticularExpenseNames: financeDetailsData.particularExpenseNames,
            financeProductInBoxes: financeDetailsData.purchaseProductInBoxes,
            financeCharges: financeDetailsData.chargesList
        };

        // Remove old fields
        delete AcceptedData.containerExpenseNames;
        delete AcceptedData.particularExpenseNames;
        delete AcceptedData.purchaseProductInBoxes;
        delete AcceptedData.chargesList;

        console.log(AcceptedData, "AcceptedData");

        // Save updated finance data to the API
        axios.post('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', AcceptedData)
            .then(response => {
                toast.success('Accepted by finance successfully!');

                // Fetch the purchase data
                return axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase');
            })
            .then(response => {
                console.log(response.data);

                // Find the purchase matching the invoice number
                const deletePurchases = response.data.find(
                    (purchase) => purchase.invoiceNo === AcceptedData.invoiceNo
                );

                if (!deletePurchases) {
                    toast.error('No purchase found for this invoice number!');
                    return;
                }

                // Delete the purchase entry
                return axios.delete(`https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase/${deletePurchases.id}`);
            })
            .then(() => {
                toast.warn('Purchase data deleted successfully!');
            })
            .catch(error => {
                console.error('Error during the update process:', error);
                toast.error('Failed to accept by finance or delete purchase!');
            });
    };



    const handleToTradePay = () => {
        console.log("TradePay", financeDetailsData.tradeExpanseStatus);
        if (financeDetailsData.tradeExpanseStatus) {
            toast.warn("Already Paid Trade Payment");
            return;
        }
        // Basic trade pay data
        let tradePayData = {
            ...financeDetailsData, // Copy all properties of financeDetailsData
            status: "finance",
            tradeExpanseStatus: true,
        };


        if (financeDetailsData.seaExpanseStatus && financeDetailsData.carrierExpanseStatus) {
            // Final trade pay data when both conditions are true
            let finalTradePayData = {
                ...financeDetailsData, // Copy all properties of financeDetailsData
                status: "finance",
                finalStatus: "Complete",
                tradeExpanseStatus: true,
            };

            // Save the updated data to the API
            axios
                .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', finalTradePayData)
                .then(response => {
                    toast.success('Trade by finance successfully!');
                    setFinanceDetailsData(finalTradePayData);
                })
                .catch(error => {
                    toast.error('Error occurred while processing the trade.');
                    console.error(error);
                });
        } else if (financeDetailsData.seaExpanseStatus || financeDetailsData.carrierExpanseStatus) {
            // Save the updated data to the API when one of the conditions is true
            axios
                .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', tradePayData)
                .then(response => {
                    toast.success('Trade by finance successfully!');
                    setFinanceDetailsData(tradePayData);
                })
                .catch(error => {
                    toast.error('Error occurred while processing the trade.');
                    console.error(error);
                });
        }
        else {
            // If neither of the conditions is true, create a new entry via POST
            axios
                .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', tradePayData)
                .then(response => {
                    toast.success('Trade by finance successfully!');
                    setFinanceDetailsData(tradePayData);
                })
                .catch(error => {
                    toast.error('Error occurred while processing the trade.');
                    console.error(error);
                });
        }
    };



    const handleToShippingPay = () => {
        console.log("ShippingPay")
        if (financeDetailsData.seaExpanseStatus) {
            toast.warn("Already Paid Sea Payment");
            return;
        }
        let ShippingPayData = {
            ...financeDetailsData, // Copy all properties of financeDetailsData
            seaExpanseStatus: true,
        };


        if (financeDetailsData.tradeExpanseStatus && financeDetailsData.carrierExpanseStatus) {

            // Final trade pay data when both conditions are true
            let finalShippingPayData = {
                ...financeDetailsData, // Copy all properties of financeDetailsData
                status: "finance",
                finalStatus: "Complete",
                seaExpanseStatus: true,
            };


            // Save the updated data to the API
            axios
                .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', finalShippingPayData)
                .then(response => {
                    toast.success('Sea Cost pay by finance successfully!');
                    setFinanceDetailsData(finalShippingPayData);
                })
                .catch(error => {
                    toast.error('Error occurred while processing the trade.');
                    console.error(error);
                });
        } else if (financeDetailsData.tradeExpanseStatus || financeDetailsData.carrierExpanseStatus) {
            // Save the updated data to the API when one of the conditions is true
            axios
                .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', ShippingPayData)
                .then(response => {
                    toast.success('Sea Cost pay by finance successfully!');
                    setFinanceDetailsData(ShippingPayData);
                })
                .catch(error => {
                    toast.error('Error occurred while processing the trade.');
                    console.error(error);
                });
        }

    }
    const handleToContainerPay = () => {
        console.log(financeDetailsData.carrierExpanseStatus, "ContainerPay", financeDetailsData)
        if (financeDetailsData.carrierExpanseStatus) {
            toast.warn("Already Paid Container Payment");
            return;
        }
        let containerPayData = {
            ...financeDetailsData,
            carrierExpanseStatus: true,
        }

        if (financeDetailsData.seaExpanseStatus && financeDetailsData.tradeExpanseStatus) {
            // Final trade pay data when both conditions are true
            let finalCarrierPayData = {
                ...financeDetailsData, // Copy all properties of financeDetailsData
                status: "finance",
                finalStatus: "Complete",
                carrierExpanseStatus: true,

            };

            // Save the updated data to the API
            axios
                .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', finalCarrierPayData)
                .then(response => {
                    toast.success('Carrier pay by finance successfully!');
                    setFinanceDetailsData(finalCarrierPayData);
                })
                .catch(error => {
                    toast.error('Error occurred while processing the trade.');
                    console.error(error);
                });
        } else if (financeDetailsData.seaExpanseStatus || financeDetailsData.tradeExpanseStatus) {
            // Save the updated data to the API when one of the conditions is true
            axios
                .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', containerPayData)
                .then(response => {
                    toast.success('Carrier pay by finance successfully!');
                    setFinanceDetailsData(containerPayData);
                })
                .catch(error => {
                    toast.error('Error occurred while processing the trade.');
                    console.error(error);
                });
        }

    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
                <h1 className="text-xl font-bold mb-4">Shipment and Invoice Details</h1>

                {/* General Information */}
                <div className="space-y-4">
                    <div><strong>Transport Way:</strong> {financeDetailsData.transportWay}</div>
                    <div><strong>Country:</strong> {financeDetailsData.transportCountryName}</div>
                    <div><strong>Invoice No:</strong> {financeDetailsData.invoiceNo}</div>
                    <div><strong>EP No:</strong> {financeDetailsData.epNo}</div>
                    <div><strong>Gross Weight:</strong> {financeDetailsData.grossWeight}</div>
                    <div><strong>Total Box Weight:</strong> {financeDetailsData.allTotalBoxWeight}</div>
                    <div><strong>Net Weight:</strong> {financeDetailsData.netWeight}</div>
                    <div><strong>Truck No:</strong> {financeDetailsData.truckNo}</div>
                </div>

                {/* Particular Expense Names */}
                <h3 className="text-xl font-bold mb-4 text-center underline">Particular Expenses</h3>
                <table className="min-w-full bg-white mb-6">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">Date</th>
                            <th className="py-2 px-4">Expense Name</th>
                            <th className="py-2 px-4">Remark</th>
                            <th className="py-2 px-4">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {financeDetailsData.financeParticularExpenseNames.map((expense, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-4">{expense.date}</td>
                                <td className="py-2 px-4">{expense.particularExpenseName}</td>
                                <td className="py-2 px-4">{expense.remark}</td>
                                <td className="py-2 px-4">{expense.particularExpenseCost}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-semibold text-gray-700">
                            <td colSpan="3" className="py-2 px-4 text-left">Total Amount</td>
                            <td className="py-2 px-4">{financeDetailsData.totalCost}</td>
                        </tr>
                    </tfoot>
                </table>
                <div className="text-right mb-5">
                    {
                        financeDetailsData.tradeExpanseStatus ?
                            <button className="bg-green-500 text-white px-4 py-2 rounded">Paid</button>
                            :
                            <button onClick={handleToTradePay} className="bg-blue-500 text-white px-4 py-2 rounded">Trade Pay</button>
                    }
                </div>
                {/* Purchase Product in Boxes */}
                <h3 className="text-xl font-bold mb-4 text-center underline">Products In Boxes</h3>
                <table className="min-w-full bg-white mb-6">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">Product Name</th>
                            <th className="py-2 px-4">Model</th>
                            <th className="py-2 px-4">Quantity</th>
                            <th className="py-2 px-4">Truck No</th>
                            <th className="py-2 px-4">Pallet No</th>
                            <th className="py-2 px-4">Total Box</th>
                            <th className="py-2 px-4">Box weight</th>
                            <th className="py-2 px-4">Total weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {financeDetailsData.financeProductInBoxes.map((product, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-4">{product.productName}</td>
                                <td className="py-2 px-4">{product.productModel}</td>
                                <td className="py-2 px-4">{product.quantity}</td>
                                <td className="py-2 px-4">{product.truckNumber}</td>
                                <td className="py-2 px-4">{product.totalPallet}</td>
                                <td className="py-2 px-4">{product.totalBox}</td>
                                <td className="py-2 px-4">{product.weightPerBox}</td>
                                <td className="py-2 px-4">{product.individualTotalBoxWeight}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Container Expense Names */}
                <h3 className="text-xl font-bold mb-4 text-center underline"><span>{financeDetailsData?.containerServiceProvider}</span> CARRIER SERVICE</h3>
                <table className="min-w-full bg-white mb-6 shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-left text-gray-700 font-semibold">
                            <th className="py-2 px-4">S/L No</th>
                            <th className="py-2 px-4">Date</th>
                            <th className="py-2 px-4">Container No</th>
                            <th className="py-2 px-4">Container T/S</th>
                            <th className="py-2 px-4">Invoice No</th>
                            <th className="py-2 px-4">EP NO</th>
                            <th className="py-2 px-4">Fare Amount</th>
                            <th className="py-2 px-4">Ait/Vat 5%</th>
                            <th className="py-2 px-4">Total Amount/TK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {financeDetailsData.financeContainerExpenseNames.map((container, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100">
                                <td className="py-2 px-4">{container.slNo}</td>
                                <td className="py-2 px-4">{container.date}</td>
                                <td className="py-2 px-4">{container.containerNo}</td>
                                <td className="py-2 px-4">{container.containerTypeSize}</td>
                                <td className="py-2 px-4">{container.invoiceNo}</td>
                                <td className="py-2 px-4">{container.epNumber}</td>
                                <td className="py-2 px-4">{container.fareAmount}</td>
                                <td className="py-2 px-4">{container.aitVat}</td>
                                <td className="py-2 px-4">{container.individualTotalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-semibold text-gray-700">
                            <td colSpan="6" className="py-2 px-4 text-left">Gross Total Amount</td>
                            <td className="py-2 px-4">{financeDetailsData.totalFareAmount}</td>
                            <td className="py-2 px-4">{financeDetailsData.totalAitVat}</td>
                            <td className="py-2 px-4">{financeDetailsData.totalCarrierAmount}</td>
                        </tr>
                    </tfoot>
                </table>
                <div className="text-right mb-5">
                    {
                        financeDetailsData.carrierExpanseStatus ?
                            <button className="bg-green-500 text-white px-4 py-2 rounded">Paid</button>
                            :
                            <button onClick={handleToContainerPay} className="bg-blue-500 text-white px-4 py-2 rounded">Container Pay</button>
                    }
                </div>


                {/* Ocean info */}
                <h3 className="text-xl font-bold mb-4 text-center underline"><span>{financeDetailsData.seaServiceProvider}</span> FREIGHT SERVICE</h3>
                <div className="space-y-4">
                    <div><strong>Shipper:</strong> {financeDetailsData.shipper}</div>
                    <div><strong>B/L No:</strong> {financeDetailsData.blNo}</div>
                    <div><strong>Container No:</strong> {financeDetailsData.containerNo}</div>
                    <div><strong>Destination:</strong> {financeDetailsData.destination}</div>
                    <div><strong>VSL/VOY:</strong> {financeDetailsData.vslVoy}</div>
                    <div><strong>ETD CGP:</strong> {financeDetailsData.etd}</div>
                    <div><strong>Sea Exchange Rate:</strong> {financeDetailsData.exchangeRate}</div>
                </div>
                <table class="min-w-full border-collapse border border-gray-300 shadow-lg my-5">
                    <thead class="bg-blue-100">
                        <tr>
                            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount (USD)</th>
                            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount (TK)</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {financeDetailsData.financeCharges.length > 0 && financeDetailsData.financeCharges.map((charge, index) => (
                            <tr key={charge.id} class={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                                <td class="border border-gray-300 px-6 py-4 text-sm text-gray-900">{charge.id}</td>
                                <td class="border border-gray-300 px-6 py-4 text-sm text-gray-900">{charge.description}</td>
                                <td class="border border-gray-300 px-6 py-4 text-sm text-gray-900">{charge.amountUSD}</td>
                                <td class="border border-gray-300 px-6 py-4 text-sm text-gray-900">{charge.amountBDT}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr class="bg-blue-100 font-semibold text-gray-700">
                            <td colspan="2" class="border border-gray-300 px-6 py-4 text-left">Total</td>
                            <td class="border border-gray-300 px-6 py-4">{financeDetailsData.totalAmountUSD} USD</td>
                            <td class="border border-gray-300 px-6 py-4">{financeDetailsData.totalAmountBDT} TK</td>
                        </tr>
                    </tfoot>
                </table>
                <div className="text-right mb-10">
                    {
                        financeDetailsData.seaExpanseStatus ?
                            <button className="bg-green-500 text-white px-4 py-2 rounded">Paid</button>
                            :
                            <button onClick={handleToShippingPay} className="bg-blue-500 text-white px-4 py-2 rounded">Shipping Pay</button>
                    }

                </div>

                {/* Payment Options */}
                <div className="flex justify-end mb-4">
                    <button onClick={handleToReject} className="bg-red-500 text-white px-4 py-2 rounded mr-5">Reject</button>
                    <button onClick={handleToUpdate} className="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>
                </div>

                {/* Dollar Exchange Rate Modal */}
                {
                    isModalOpen && (
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
                    )
                }
            </div>
        </div>

    );
};

export default FinanceDetails;
