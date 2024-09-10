import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";

const Export = () => {
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    const storeData = localStorage?.getItem("formData");
    if (storeData) {
      setLocalData(JSON.parse(storeData));
    }
  }, []);

  if (!localData) {
    return toast.error("Data is empty");
  }

  const handleDelete = (index) => {
    localStorage.removeItem("formData");
  };

  // console.log(localData);
  return (
    <div>
      <h1 className="text-center text-3xl my-5 text-info font-bold">
        All Products Data
      </h1>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Product Brand</th>
              <th>Product Model</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Transport</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localData?.map((data, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{data.productName}</td>
                <td>{data.productBrand}</td>
                <td>{data.productModel}</td>
                <td>{index + 205}</td>
                <td>Date</td>
                <td>Transport VIA</td>
                <td>
                  <div className="flex justify-around items-center">
                    <Link to="">
                      <AiFillEdit className="w-6 h-6" />
                    </Link>
                    <button onClick={() => handleDelete(index)}>
                      <AiFillDelete className="text-error w-6 h-6 hover:text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Product Brand</th>
              <th>Product Model</th>
              <th>Quantity</th>
              <th>Transport</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-5 flex items-center justify-center">
        <button className="btn btn-info btn-sm">
          <Link to="/exportimport">Back to Home</Link>
        </button>
      </div>
    </div>
  );
};

export default Export;
