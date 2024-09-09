import React, { useState } from "react";
import { Link } from "react-router-dom";

const ExpensesForm = ({ expenses, onExpenseSave, onTotalCostChange }) => {
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [dates, setDates] = useState({});

  const handleCheckboxChange = (event) => {
    const expenseId = event.target.value;
    const isChecked = event.target.checked;

    setSelectedExpenses((prevState) => {
      if (isChecked) {
        return [...prevState, expenseId];
      } else {
        return prevState.filter((id) => id !== expenseId);
      }
    });
  };

  const handleRemarkChange = (event, expenseId) => {
    setRemarks({ ...remarks, [expenseId]: event.target.value });
  };

  const handleDateChange = (event, expenseId) => {
    setDates({ ...dates, [expenseId]: event.target.value });
  };

  const handleSave = () => {
    const selectedExpenseData = selectedExpenses.map((id) => {
      const expense = expenses.find((expense) => expense.id === Number(id));
      return {
        id: expense.id,
        particularExpenseName: expense.particularExpenseName,
        particularExpenseCost: expense.particularExpenseCost,
        remark: remarks[id] || "",
        date: dates[id] || "",
      };
    });
    onExpenseSave(selectedExpenseData);
    // console.log(selectedExpenseData);
  };

  const totalCost = selectedExpenses
    .reduce((total, id) => {
      const expense = expenses.find((expense) => expense.id === Number(id));
      return total + parseFloat(expense.particularExpenseCost);
    }, 0)
    .toFixed(2);
  onTotalCostChange(totalCost);

  return (
    <div className="p-4">
      <div className=" overflow-x-auto add__scrollbar">
        {expenses.map((expense) => (
          <div key={expense.id} className="mb-4 flex items-center gap-3">
            <label className="mb-2 flex items-center font-bold">
              <input
                type="checkbox"
                value={expense.id}
                checked={selectedExpenses.includes(String(expense.id))}
                onChange={handleCheckboxChange}
                className="mr-2 checkbox checkbox-info"
              />
              {expense.particularExpenseName}
            </label>
            <input
              type="text"
              className="border p-1 mb-2 mr-2"
              placeholder="Cost"
              readOnly
              value={expense.particularExpenseCost}
            />
            <input
              type="text"
              className="border p-1 mb-2  mr-2"
              placeholder="Remark"
              value={remarks[expense.id] || ""}
              onChange={(e) => handleRemarkChange(e, expense.id)}
            />
            <input
              type="date"
              className="border p-1"
              value={dates[expense.id] || ""}
              onChange={(e) => handleDateChange(e, expense.id)}
            />
          </div>
        ))}
      </div>
      {/* button */}
      <div className="my-6 flex justify-end">
        <Link
          to="/exportimport"
          className="rounded-md bg-sky-800 text-white px-4 py-2 mx-2">
          Back
        </Link>
        <button
          className="rounded-md bg-blue-500 text-white px-4 py-2 mr-2"
          onClick={handleSave}>
          Save
        </button>
      </div>
      <div className="font-bold text-2xl text-center text-sky-400">
        Total Cost(TK): {totalCost}
      </div>
    </div>
  );
};

export default ExpensesForm;
