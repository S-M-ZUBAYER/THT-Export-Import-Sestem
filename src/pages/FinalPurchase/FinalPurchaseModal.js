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
                        <label className="block font-medium">Total Cost</label>
                        <input
                            type="text"
                            name="totalCost"
                            value={selectedPurchase.totalCost}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
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
                        <label className="block font-medium">Total Amount (BDT)</label>
                        <input
                            type="text"
                            name="totalAmountBDT"
                            value={selectedPurchase.totalAmountBDT}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Total Amount (USD)</label>
                        <input
                            type="text"
                            name="totalAmountUSD"
                            value={selectedPurchase.totalAmountUSD}
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
                        <label className="block font-medium">Exchange Rate</label>
                        <input
                            type="text"
                            name="exchangeRate"
                            value={selectedPurchase.exchangeRate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                </div>

                {/* Purchase Product in Boxes */}
                <h3 className="text-xl font-bold mb-4">Products In Boxes</h3>
                <table className="min-w-full bg-white mb-6">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">Product Name</th>
                            <th className="py-2 px-4">Model</th>
                            <th className="py-2 px-4">Quantity</th>
                            <th className="py-2 px-4">Truck No</th>
                            <th className="py-2 px-4">Total Box</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedPurchase.purchaseProductInBoxes.map((product, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-4">{product.productName}</td>
                                <td className="py-2 px-4">{product.productModel}</td>
                                <td className="py-2 px-4">{product.quantity}</td>
                                <td className="py-2 px-4">{product.truckNumber}</td>
                                <td className="py-2 px-4">{product.totalBox}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Particular Expense Names */}
                <h3 className="text-xl font-bold mb-4">Particular Expenses</h3>
                <table className="min-w-full bg-white mb-6">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">Expense Name</th>
                            <th className="py-2 px-4">Cost</th>
                            <th className="py-2 px-4">Remark</th>
                            <th className="py-2 px-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedPurchase.particularExpenseNames.map((expense, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-4">{expense.particularExpenseName}</td>
                                <td className="py-2 px-4">{expense.particularExpenseCost}</td>
                                <td className="py-2 px-4">{expense.remark}</td>
                                <td className="py-2 px-4">{expense.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Container Expense Names */}
                <h3 className="text-xl font-bold mb-4">Container Expenses</h3>
                <table className="min-w-full bg-white mb-6">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">Container No</th>
                            <th className="py-2 px-4">Size</th>
                            <th className="py-2 px-4">Fare Amount</th>
                            <th className="py-2 px-4">Ait/Vat</th>
                            <th className="py-2 px-4">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedPurchase.containerExpenseNames.map((container, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-4">{container.containerNo}</td>
                                <td className="py-2 px-4">{container.containerTypeSize}</td>
                                <td className="py-2 px-4">{container.fareAmount}</td>
                                <td className="py-2 px-4">{container.aitVat}</td>
                                <td className="py-2 px-4">{container.individualTotalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
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
