import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { ClipLoader } from "react-spinners";

// loader css style
const override = {
  display: "block",
  margin: "25px auto",
};

const Accounts = () => {
  const [serverData, setServerData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  const [formData, setFormData] = useState([
    {
      productName: "",
      productBrand: "",
      productModel: "",
      productQuantity: 0,
      date: "",
    },
  ]);

  const navigate = useNavigate();


  useEffect(() => {
    setLoading(true);
    fetchProducts();
    fetchAccounts();
  }, []);

  // Data fetch from products API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/products"
      );
      setServerData(response?.data);
    } catch (error) {
      toast.error("Error from server to get data!!");
    }
  };

  // Data fetch from office_accounts API
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts"
      );
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      setAccounts(sortedData);
      setFilteredAccounts(sortedData); // Set filtered accounts to full list initially
      setLoading(false);
    } catch (error) {
      toast.error("Error getting accounts from server!", {
        position: "top-center",
      });
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const formSubmit = (e) => {
    e.preventDefault();

    const { productModel, productQuantity, date } = formData;

    // Check if the productModel exists in accounts
    const existingModel = accounts.find(
      (account) => {
        console.log(account, "account");

        return account.productModel === productModel && account.date === date
      }
    );

    if (existingModel) {
      toast.warn("You Can't add same model number in same date you need to edit please..");
      return;
    }

    axios
      .post(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts",
        formData
      )
      .then((res) => {
        toast.success(
          "Successfully File added to server & check below table",
          {
            position: "top-center",
          }
        );
        // console.log(res);
        navigate("/exportimport");
      })
      .catch((err) =>
        toast.error("Error coming from server please try again later", {
          position: "top-center",
        })
      );
  };

  // account delete from server and also frontend
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure, you want to delete this Product Data?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts/${id}`
        );
        toast.warn("Data successfully Deleted!!", { position: "top-center" });
        fetchAccounts();
      } catch (error) {
        toast.error("You can't delete now. Please try again later!", {
          position: "top-center",
        });
      }
    }
  };

  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter accounts based on search term
    const filteredAccounts = accounts.filter((account) =>
      account.productName.toLowerCase().includes(value) ||
      account.productBrand.toLowerCase().includes(value) ||
      account.productModel.toLowerCase().includes(value) ||
      account.date.includes(value) // Direct comparison for date strings in 'YYYY-MM-DD' format
    );
    setFilteredAccounts(filteredAccounts);
  };


  return (
    <>
      <div>
        <h1 className="flex justify-center items-center text-3xl my-4 uppercase text-info font-bold">
          Production Quantities
        </h1>
        <div className="mt-3 lg:flex justify-center items-center">
          <form
            className="lg:w-[800px] bg-base-100 shadow-xl mt-3"
            onSubmit={formSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-6">
              {/* product name */}
              <div className="form-control">
                <label className="text-center mb-3">
                  <span className="lebel-text text-lg font-semibold">
                    Product Name
                  </span>
                </label>
                <select
                  className="select select-info w-full max-w-xs"
                  id="selectOption"
                  value={formData.productName}
                  name="productName"
                  required
                  aria-required
                  onChange={handleChange}>
                  <option value="">---- Pick product Name ----</option>
                  {/* {serverData?.map((product, index) => (
                    <option key={index}>{product.productName}</option>
                  ))} */}
                  {Array.from(
                    new Set(serverData?.map((product) => product.productName))
                  ).map((productName, index) => (
                    <option key={index}>{productName}</option>
                  ))}
                </select>
              </div>

              {/* product Brand */}
              <div className="form-control">
                <label className="text-center mb-3">
                  <span className="lebel-text text-lg font-semibold">
                    Product Brand
                  </span>
                </label>
                <select
                  className="select select-info w-full max-w-xs"
                  id="selectOption"
                  value={formData.productBrand || ""}
                  name="productBrand"
                  required
                  aria-required
                  onChange={handleChange}
                  disabled={!formData.productName}>
                  <option value="">---- Pick product Brand ----</option>
                  {/* {serverData
                    ?.filter(
                      (product) => product.productName === formData.productName
                    )
                    .map((product, index) => (
                      <option key={index}>{product.productBrand}</option>
                    ))} */}
                  {Array.from(
                    new Set(
                      serverData
                        ?.filter(
                          (product) =>
                            product.productName === formData.productName
                        )
                        .map((product) => product.productBrand)
                    )
                  ).map((productBrand, index) => (
                    <option key={index}>{productBrand}</option>
                  ))}
                </select>
              </div>

              {/* product Model */}
              <div className="form-control">
                <label className="text-center mb-3">
                  <span className="lebel-text text-lg font-semibold">
                    Product Model
                  </span>
                </label>
                <select
                  className="select select-info w-full max-w-xs"
                  id="selectOption"
                  value={formData.productModel || ""}
                  name="productModel"
                  required
                  aria-required
                  onChange={handleChange}
                  disabled={!formData.productBrand}>
                  <option value="">---- Pick product Model ----</option>
                  {serverData
                    ?.filter(
                      (product) =>
                        product.productName === formData.productName &&
                        product.productBrand === formData.productBrand
                    )
                    .map((product, index) => (
                      <option key={index}>{product.productModel}</option>
                    ))}
                </select>
              </div>

              {/* product Quantity */}
              <div className="form-control">
                <label className="text-center mb-3">
                  <span className="lebel-text text-lg font-semibold text-center">
                    Product Quantity
                  </span>
                </label>
                <input
                  className="input input-bordered rounded-md join-item select-info"
                  placeholder="Quantity of Product"
                  type="number"
                  name="productQuantity"
                  min="0"
                  required
                  aria-required
                  onWheel={(e) => e.target.blur()}
                  value={formData.productQuantity || ""}
                  onChange={handleChange}
                />
              </div>

              {/* date field */}
              <div className="form-control lg:pr-2 text-center flex flex-col justify-center items-center">
                <label className="text-center mb-2">
                  <span className="lebel-text text-lg font-semibold">Export Date</span>
                </label>
                <input
                  type="date"
                  onChange={handleChange}
                  name="date"
                  required
                  aria-required
                  value={formData?.date}
                  className="border-2 select-info rounded-md text-lg p-[6px]"
                />
              </div>
            </div>
            <div className="mt-4 mr-7 flex justify-end">
              <Link
                to="/exportimport"
                className="btn btn-info px-10 mx-5  mb-4">
                Back
              </Link>
              <button
                className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black mb-4"
                type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table data get from accouts input database */}
      <div className="mb-6 w-full lg:w-3/4 mx-auto">
        <div className="flex justify-between items-center bg-slate-500 p-3 rounded-lg my-6">
          <h1 className="text-3xl text-info font-bold uppercase">
            Production Quantities Data Table
          </h1>
          <input
            type="text"
            placeholder="Search..."
            className="p-2 rounded-lg border border-gray-300"
            value={searchTerm} // Assuming searchTerm is part of your state
            onChange={handleSearch} // Assuming handleSearch is defined to handle input changes
          />
        </div>

        <div className="overflow-x-auto add__scrollbar">
          {loading ? (
            <div className="">
              <ClipLoader
                color={"#36d7b7"}
                loading={loading}
                size={50}
                cssOverride={override}
              />
              <p className="text-center font-extralight text-xl text-green-400">
                Please wait ....
              </p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th className="sticky top-0 bg-gray-200">ID</th>
                  <th className="sticky top-0 bg-gray-200">Product Name</th>
                  <th className="sticky top-0 bg-gray-200">Product Brand</th>
                  <th className="sticky top-0 bg-gray-200">Product Model</th>
                  <th className="sticky top-0 bg-gray-200">Quantity</th>
                  <th className="sticky top-0 bg-gray-200">Export Date</th>
                  <th className="sticky top-0 bg-gray-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts?.map((product) => (
                  <tr className="hover cursor-pointer" key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.productName}</td>
                    <td>{product.productBrand}</td>
                    <td>{product.productModel}</td>
                    <td>{product.productQuantity}</td>
                    <td>{product.date}</td>
                    <td className="flex justify-around items-center">
                      <Link to={`/accounts/${product.id}`}>
                        <AiOutlineEdit className="w-6 h-6 text-purple-600" />
                      </Link>
                      <button onClick={() => handleDelete(product.id)}>
                        <AiOutlineDelete className="w-6 h-6 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Accounts;
