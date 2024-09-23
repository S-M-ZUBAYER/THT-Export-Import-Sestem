import React, { useState } from "react";

const CarrierTableData = ({ rows, setRows }) => {
    // Initial state to hold rows of data
    // const [rows, setRows] = useState([
    //     { slNo: 1, date: "", containerNo: "", containerTypeSize: "", invoiceNo: "", IPNumber: "", fareAmount: 0, AitVat: 0, totalAmount: 0 }
    // ]);

    // Function to add a new row
    const addRow = (e) => {
        e.preventDefault();
        const newRow = {
            slNo: rows.length + 1,
            date: "",
            containerNo: "",
            containerTypeSize: "",
            invoiceNo: "",
            IPNumber: "",
            fareAmount: 0,
            AitVat: 0,
            totalAmount: 0,
        };
        setRows([...rows, newRow]);
    };

    // Function to handle input change and update the state
    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;

        // Calculate the VAT (5%) and total amount dynamically
        if (field === "fareAmount") {
            const fareAmount = parseFloat(value) || 0;
            const vat = fareAmount * 0.05; // Assuming VAT is 5%
            const totalAmount = fareAmount + vat;
            updatedRows[index]["AitVat"] = vat.toFixed(2);
            updatedRows[index]["totalAmount"] = totalAmount.toFixed(2);
        }

        setRows(updatedRows);
    };

    // Calculate total fare, vat, and total amount across all rows
    const calculateGrandTotal = (field) => {
        return rows.reduce((acc, row) => acc + parseFloat(row[field] || 0), 0).toFixed(2);
    };

    return (
        <div className="p-4">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">S/L No</th>
                        <th className="border border-gray-300 p-2">Date</th>
                        <th className="border border-gray-300 p-2">Container No</th>
                        <th className="border border-gray-300 p-2">Container Type/Size</th>
                        <th className="border border-gray-300 p-2">Invoice No</th>
                        <th className="border border-gray-300 p-2">IP Number</th>
                        <th className="border border-gray-300 p-2">Fare Amount</th>
                        <th className="border border-gray-300 p-2">AIT/VAT (5%)</th>
                        <th className="border border-gray-300 p-2">Total Amount/Taka</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2 text-center">{row.slNo}</td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.date}
                                    onChange={(e) => handleInputChange(index, "date", e.target.value)}
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.containerNo}
                                    onChange={(e) => handleInputChange(index, "containerNo", e.target.value)}
                                    placeholder="Container No"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.containerTypeSize}
                                    onChange={(e) => handleInputChange(index, "containerTypeSize", e.target.value)}
                                    placeholder="Container Type/Size"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.invoiceNo}
                                    onChange={(e) => handleInputChange(index, "invoiceNo", e.target.value)}
                                    placeholder="Invoice No"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.IPNumber}
                                    onChange={(e) => handleInputChange(index, "IPNumber", e.target.value)}
                                    placeholder="IP Number"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.fareAmount}
                                    onChange={(e) => handleInputChange(index, "fareAmount", e.target.value)}
                                    placeholder="Fare Amount"
                                />
                            </td>
                            <td className="border border-gray-300 p-2 text-right">{row.AitVat}</td>
                            <td className="border border-gray-300 p-2 text-right">{row.totalAmount}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100">
                        <td className="border border-gray-300 p-2 text-center" colSpan={6}>Gross Total Amount</td>
                        <td className="border border-gray-300 p-2 text-right">
                            {calculateGrandTotal("fareAmount")}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                            {calculateGrandTotal("AitVat")}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                            {calculateGrandTotal("totalAmount")}
                        </td>
                    </tr>
                </tfoot>
            </table>

            <button
                className="mt-4 p-2 bg-blue-500 text-white rounded"
                onClick={addRow}
            >
                Add New Row
            </button>
        </div>
    );
};

export default CarrierTableData;
