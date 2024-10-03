import React from 'react';

const FinalPurchaseModal = ({
    isOpen,
    selectedPurchase,
    handleChange,
    handleSave,
    closeModal,
}) => {
    if (!isOpen || !selectedPurchase) {
        return null;
    }
    console.log(selectedPurchase, "from edit page");

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-[100vh] w-full h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Edit Purchase Details</h2>

                {/* General Information */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block font-medium">Transport Way</label>
                        <input
                            type="text"
                            name="transportWay"
                            value={selectedPurchase.transportWay}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Country</label>
                        <input
                            type="text"
                            name="transportCountryName"
                            value={selectedPurchase.transportCountryName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Invoice No</label>
                        <input
                            type="text"
                            name="invoiceNo"
                            value={selectedPurchase.invoiceNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">EP No</label>
                        <input
                            type="text"
                            name="epNo"
                            value={selectedPurchase.epNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Gross Weight</label>
                        <input
                            type="text"
                            name="grossWeight"
                            value={selectedPurchase.grossWeight}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Total Box Weight</label>
                        <input
                            type="text"
                            name="allTotalBoxWeight"
                            value={selectedPurchase.allTotalBoxWeight}
                            onChange={handleChange}
                            readOnly
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Net Weight</label>
                        <input
                            type="text"
                            name="netWeight"
                            value={selectedPurchase.netWeight}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Truck No</label>
                        <input
                            type="text"
                            name="truckNo"
                            value={selectedPurchase.truckNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

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
                        {selectedPurchase.particularExpenseNames.map((expense, index) => (
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
                            <td colspan="3" className="py-2 px-4 text-left">Total Amount</td>
                            <td className="py-2 px-4">{selectedPurchase.totalCost}</td>
                        </tr>
                    </tfoot>
                </table>

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
                        {selectedPurchase.purchaseProductInBoxes.map((product, index) => (
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
                <h3 className="text-xl font-bold mb-4 text-center underline"><span>{selectedPurchase?.containerServiceProvider}</span> CARRIER SERVICE</h3>
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
                        {selectedPurchase.containerExpenseNames.map((container, index) => (
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
                            <td colspan="6" className="py-2 px-4 text-left">Gross Total Amount</td>
                            <td className="py-2 px-4">{selectedPurchase.totalFareAmount}</td>
                            <td className="py-2 px-4">{selectedPurchase.totalAitVat}</td>
                            <td className="py-2 px-4">{selectedPurchase.totalCarrierAmount}</td>
                        </tr>
                    </tfoot>
                </table>


                {/* Ocean info */}
                <h3 className="text-xl font-bold mb-4 text-center underline"><span>{selectedPurchase.seaServiceProvider}</span> FREIGHT SERVICE</h3>
                <div>
                    <label className="block font-medium">Shipper</label>
                    <input
                        type="text"
                        name="shipper"
                        value={selectedPurchase.shipper}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">B/L No </label>
                    <input
                        type="text"
                        name="blNo"
                        value={selectedPurchase.blNo}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">Container No </label>
                    <input
                        type="text"
                        name="containerNo"
                        value={selectedPurchase.containerNo}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">Destination</label>
                    <input
                        type="text"
                        name="destination"
                        value={selectedPurchase.destination}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">VSL/VOY</label>
                    <input
                        type="text"
                        name="vslVoy"
                        value={selectedPurchase.vslVoy}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">ETD CGP</label>
                    <input
                        type="text"
                        name="etd"
                        value={selectedPurchase.etd}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">Sea Exchange Rate</label>
                    <input
                        type="text"
                        name="exchangeRate"
                        value={selectedPurchase.exchangeRate}
                        onChange={handleChange}
                        readOnly
                        className="w-full px-4 py-2 border rounded"
                    />
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
                        {selectedPurchase.chargesList.length > 0 && selectedPurchase.chargesList.map((charge, index) => (
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
                            <td class="border border-gray-300 px-6 py-4">{selectedPurchase.totalAmountUSD} USD</td>
                            <td class="border border-gray-300 px-6 py-4">{selectedPurchase.totalAmountBDT} TK</td>
                        </tr>
                    </tfoot>
                </table>
                {/* Footer Actions */}
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
    );
};

export default FinalPurchaseModal;
