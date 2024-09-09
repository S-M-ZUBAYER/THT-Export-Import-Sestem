import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

const ProductBoxes = () => {
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState([]);
  const [boxProducts, setBoxProducts] = useState([]);
  const navigate = useNavigate();

  // For multiple product add
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductModels, setSelectedProductModels] = useState({});
  const [selectedProductPallet, setSelectedProductPallet] = useState("");
  const [inputValues, setInputValues] = useState({});
  const [perBoxProducts, setPerBoxProducts] = useState(0);
  const [resultsValues, setResultsValues] = useState(0);
  const [totalBox, setTotalBox] = useState(0);
  const [sessionData, setSessionData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const componentPDF = useRef();

  useEffect(() => {
    fetchProducts();
    fetchAccounts();
    fetchBoxProducts();
  }, []);

  // Fetch functions
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/products"
      );
      setAccounts(response?.data);
    } catch (error) {
      toast.error("Error getting data from server!");
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts"
      );
      setAccount(response?.data);
    } catch (error) {
      toast.error("Error getting data from server!");
    }
  };

  const fetchBoxProducts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes"
      );
      setBoxProducts(response?.data);
    } catch (error) {
      toast.error("Error getting data from server!");
    }
  };

  // Get unique product names
  const products = Array.from(new Set(accounts?.map((p) => p.productName)) || []);

  // Filter models based on selected product name
  const filteredProductModels = accounts
    .filter((p) => p.productName === selectedProductName)
    .map((p) => p.productModel);

  // Handle changes in product model checkboxes
  const handleProductModelCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedProductModels((prev) => ({
      ...prev,
      [value]: checked,
    }));
    setErrorMessage("");
  };

  // Handle input value changes with debounce
  const handleInputValueChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;

    setInputValues((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const debouncedInputValueChange = debounce(handleInputValueChange, 300);

  // Automatically calculate on input change
  // useEffect(() => {
  //   // Calculate perBoxProducts
  //   const perBox = Object.values(inputValues)
  //     .filter((val, idx) => Object.keys(selectedProductModels)[idx] && selectedProductModels[Object.keys(selectedProductModels)[idx]])
  //     .reduce((acc, val) => acc + val, 0);
  //   setPerBoxProducts(perBox);

  //   // Calculate resultsValues
  //   const quantity = Object.values(inputValues).reduce((acc, val) => acc + val, 0);
  //   setResultsValues(quantity);

  //   // Calculate totalBox
  //   if (perBox > 0) {
  //     const boxes = Math.ceil(quantity / perBox);
  //     setTotalBox(boxes);
  //   } else {
  //     setTotalBox(0);
  //   }
  // }, [inputValues, selectedProductModels]);

  useEffect(() => {
    // Calculate perBoxProducts based on selected models
    const perBox = Object.keys(selectedProductModels)
      .filter(model => selectedProductModels[model])
      .reduce((acc, model) => acc + (inputValues[`perBox_${model}`] || 0), 0);
    setPerBoxProducts(perBox);

    // Calculate resultsValues based on selected models
    const quantity = Object.keys(selectedProductModels)
      .filter(model => selectedProductModels[model])
      .reduce((acc, model) => acc + (inputValues[`quantity_${model}`] || 0), 0);
    setResultsValues(quantity);

    // Calculate totalBox based on the product quantity and per box quantity
    if (perBox > 0) {
      const boxes = Math.ceil(quantity / perBox);
      setTotalBox(boxes);
    } else {
      setTotalBox(0);
    }
  }, [inputValues, selectedProductModels]);


  // Handle pallet input change
  const handlePalletInputChange = (e) => {
    setSelectedProductPallet(e.target.value);
    setErrorMessage("");
  };

  // Handle truck number input change
  const handleTruckNumberInputChange = (e) => {
    setTruckNumber(e.target.value);
    setErrorMessage("");
  };

  // Handle product name change
  const handleNameInputChange = (e) => {
    setSelectedProductName(e.target.value);
    setSelectedProductModels({});
    setInputValues({});
    setPerBoxProducts(0);
    setResultsValues(0);
    setTotalBox(0);
    setErrorMessage("");
  };

  // Handle form submission to add products to sessionData
  const handleInstantStore = (e) => {
    e.preventDefault();

    if (!selectedProductName) {
      setErrorMessage("Please select a product name.");
      return;
    }

    if (!selectedProductPallet) {
      setErrorMessage("Please enter a pallet number.");
      return;
    }

    if (!truckNumber) {
      setErrorMessage("Please enter a truck number.");
      return;
    }

    if (Object.keys(selectedProductModels).length === 0) {
      setErrorMessage("Please select at least one product model.");
      return;
    }

    const selectedModels = Object.keys(selectedProductModels).filter(
      (model) => selectedProductModels[model]
    );

    const splitProductsBox = selectedModels.map((model) => ({
      productModel: model,
      perBox: inputValues[`perBox_${model}`] || 0,
    }));

    const splitQuantitySingleProduct = selectedModels.map((model) => ({
      productModel: model,
      quantity: inputValues[`quantity_${model}`] || 0,
    }));

    const newData = {
      productName: selectedProductName,
      productModel: selectedModels,
      quantity: resultsValues,
      splitProductsBox,
      splitQuantitySingleProduct,
      productPerBox: perBoxProducts,
      totalBox,
      totalPallet: selectedProductPallet,
      truckNumber,
    };

    setSessionData((prevData) => [...prevData, newData]);
    setErrorMessage("");

    // Reset form fields
    setSelectedProductName("");
    setSelectedProductModels({});
    setInputValues({});
    setPerBoxProducts(0);
    setResultsValues(0);
    setTotalBox(0);
    setSelectedProductPallet("");
    setTruckNumber("");
  };

  // Handle form submission to send data to server
  const formSubmit = async (e) => {
    e.preventDefault();

    if (sessionData.length === 0) {
      toast.error("No products to save.", {
        position: "top-center",
      });
      return;
    }

    try {
      // Prepare data for server
      const preparedData = sessionData.map((item) => ({
        ...item,
        productModel: JSON.stringify(item.productModel),
        splitProductsBox: JSON.stringify(item.splitProductsBox),
        splitQuantitySingleProduct: JSON.stringify(item.splitQuantitySingleProduct),
      }));

      // Send each product entry to the server
      for (const item of preparedData) {
        const { productModel, splitQuantitySingleProduct } = item;
        const models = JSON.parse(productModel);
        const quantities = JSON.parse(splitQuantitySingleProduct);

        const productData = models.map((model, index) => ({
          productModel: model,
          productQuantity: quantities[index]?.quantity || 0,
        }));

        // Post product in boxes
        const response = await axios.post(
          "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes",
          item,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status !== 201) {
          throw new Error("Network response was not ok");
        }

        // Patch office accounts
        for (const entry of productData) {
          await axios.patch(
            "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts/sub",
            entry
          );
        }
      }

      toast.success("Successfully uploaded to server", {
        position: "top-center",
      });
      navigate("/exportimport");
    } catch (error) {
      toast.error("Network Error. Please try again later", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      {/* Form Design for Products Boxes */}
      <div className="mt-5 lg:flex justify-center items-center mb-4">
        <form className="card shadow-xl mt-5 p-3" onSubmit={handleInstantStore}>
          <h2 className="text-4xl font-bold text-violet-500 text-center mt-3">
            Products Listed For Export
          </h2>
          <div className="lg:flex justify-between items-center">
            <div className="form-control card-body">
              <div className="w-full">
                {/* Products Add */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Product Name */}
                    <div className="mt-2 md:mt-0">
                      <label className="text-lg font-semibold mb-3">
                        Product Name
                      </label>
                      <div className="input-group">
                        <select
                          className="select select-secondary w-full focus:outline-none"
                          value={selectedProductName}
                          name="productName"
                          required
                          onChange={handleNameInputChange}
                        >
                          <option value="" className="mt-2">
                            Pick product Name
                          </option>
                          {products.map((productName, index) => (
                            <option key={index} value={productName}>
                              {productName}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errorMessage && (
                        <p className="text-red-500">{errorMessage}</p>
                      )}
                    </div>

                    {/* Product Model */}
                    <div className="w-full mx-[2px]">
                      <label className="text-lg font-semibold">
                        Select Models:
                      </label>
                      <div className="w-full">
                        {filteredProductModels.map((productModel, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              className="mr-[4px] my-[3px] checkbox checkbox-xs checkbox-info"
                              type="checkbox"
                              value={productModel}
                              checked={selectedProductModels[productModel] || false}
                              onChange={handleProductModelCheckboxChange}
                            />
                            <span>{productModel}</span>

                            {selectedProductModels[productModel] && (
                              <>
                                <input
                                  type="number"
                                  min="0"
                                  name={`perBox_${productModel}`}
                                  required
                                  onWheel={(e) => e.target.blur()}
                                  onChange={debouncedInputValueChange}
                                  placeholder="Per Box"
                                  className="w-[100px] ml-2 my-[3px] p-[6px] border border-b-blue-500 focus:outline-none"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  name={`quantity_${productModel}`}
                                  required
                                  onWheel={(e) => e.target.blur()}
                                  onChange={debouncedInputValueChange}
                                  placeholder="Product Quantity"
                                  className="w-[170px] mx-[18px] my-[3px] p-[6px] border border-b-blue-500 focus:outline-none"
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product Per Box */}
                    <div>
                      <label
                        className="text-lg font-semibold"
                        htmlFor="productPerBox">
                        Product Per Box
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        placeholder="Data coming from Per Box Total Sum"
                        type="number"
                        name="productPerBox"
                        required
                        readOnly
                        value={perBoxProducts}
                      />
                    </div>

                    {/* Total Box */}
                    <div>
                      <label
                        className="text-lg font-semibold"
                        htmlFor="boxQuantity">
                        How Many Boxes
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        type="number"
                        min="0"
                        readOnly
                        required
                        name="boxQuantity"
                        value={totalBox}
                      />
                    </div>

                    {/* Product Quantity */}
                    <div>
                      <label
                        className="text-lg font-semibold"
                        htmlFor="productQuantity">
                        Product Quantity
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        placeholder="Total product"
                        type="number"
                        min="0"
                        required
                        readOnly
                        value={resultsValues}
                        name="quantityProduct"
                      />
                    </div>

                    {/* Pallet */}
                    <div className="">
                      <label
                        className="text-lg font-semibold"
                        htmlFor="pallet">
                        Pallet Number
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        placeholder="Enter Pallet Number"
                        type="text"
                        name="pallet"
                        required
                        onChange={handlePalletInputChange}
                      />
                      {errorMessage && (
                        <p className="text-red-500">{errorMessage}</p>
                      )}
                    </div>

                    {/* Truck Number */}
                    <div className="">
                      <label
                        className="text-lg font-semibold"
                        htmlFor="truckNumber">
                        Truck Number
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        placeholder="Enter Truck Number"
                        type="text"
                        name="truckNumber"
                        required
                        onChange={handleTruckNumberInputChange}
                      />
                      {errorMessage && (
                        <p className="text-red-500">{errorMessage}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-end items-center mx-7 py-5">
            <Link
              to="/exportimport"
              className="btn btn-info font-bold px-6 py-1 text-purple-950 hover:text-purple-800 mr-6">
              Back
            </Link>
            <button
              className="btn btn-info font-bold px-6 py-1 text-purple-950 hover:text-purple-800 mr-6 mt-3 md:my-0"
              type="submit">
              Add Products
            </button>
          </div>
        </form>
      </div>

      {/* Instant Save Data */}
      <div className="my-7">
        <h1 className="text-center font-bold text-2xl text-info shadow-lg rounded p-2">
          Temporary List for Export Products
        </h1>

        <div
          className="overflow-x-auto add__scrollbar"
          ref={componentPDF}
          style={{ width: "100%" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Model</th>
                <th>Split Product</th>
                <th>Split Quantity</th>
                <th>Product Per Box</th>
                <th>Total Box</th>
                <th>Quantity</th>
                <th>Pallet</th>
                <th>Truck NO.</th>
              </tr>
            </thead>
            <tbody>
              {sessionData.map((item, index) => {
                const model = item.productModel.join(", ");
                const splitProducts = item.splitProductsBox
                  .map((box) => box.productModel)
                  .join(", ");
                const splitQuantities = item.splitQuantitySingleProduct
                  .map((quan) => quan.quantity)
                  .join(", ");
                return (
                  <tr className="hover cursor-pointer" key={index}>
                    <td>{item.productName}</td>
                    <td>{model}</td>
                    <td>{splitProducts}</td>
                    <td>{splitQuantities}</td>
                    <td>{item.productPerBox}</td>
                    <td>{item.totalBox}</td>
                    <td>{item.quantity}</td>
                    <td>{item.totalPallet}</td>
                    <td>{item.truckNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Save Button Below the Table */}
        {sessionData.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              className="btn btn-info font-bold px-6 py-2 text-purple-950 hover:text-purple-800"
              onClick={formSubmit}>
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBoxes;
