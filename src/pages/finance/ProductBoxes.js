import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

const ProductBoxes = () => {
  const [account, setAccount] = useState([]);
  const navigate = useNavigate();

  // For multiple product add
  const [selectedProductName, setSelectedProductName] = useState("");
  // const [selectedProductModels, setSelectedProductModels] = useState("");
  const [selectedProductPallet, setSelectedProductPallet] = useState("");
  const [inputValues, setInputValues] = useState({});
  const [allProducts, setAllProducts] = useState("")
  const [allPerBoxQuantity, setAllPerBoxQuantity] = useState("")
  const [perBoxProducts, setPerBoxProducts] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [totalBox, setTotalBox] = useState(0);
  const [allModelQuantity, setAllModelQuantity] = useState("");
  const [sessionData, setSessionData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const componentPDF = useRef();

  const [allDataProducts, setAllDataProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // State for selected date
  const [dates, setDates] = useState([]); // State for unique dates
  const [selectedProductModels, setSelectedProductModels] = useState({});
  // const [inputValues, setInputValues] = useState({});
  const [modelData, setModelData] = useState({});
  const [modelList, setModelList] = useState([]); // Keep this as an array of model strings

  useEffect(() => {
    // fetchProducts();
    fetchAccounts();
    // fetchBoxProducts();
  }, []);

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








  // Handle form submission to send data to server
  const formSubmit = async (e) => {
    e.preventDefault();

    // Check if productList is empty
    if (productList.length === 0) {
      toast.error("No products to save.", {
        position: "top-center",
      });
      return;
    }

    try {
      // Iterate over productList to send each product to the API
      for (const product of productList) {

        const productData = {
          productName: product.productName,
          productModel: product.productModels,
          quantity: product.productQuantity,
          splitProductsBox: product.perBoxProducts,
          splitQuantitySingleProduct: product.modelQuantity,
          productPerBox: product.productQuantity,
          totalBox: product.totalBox,
          totalPallet: product.palletNo,
          truckNumber: product.truckNumber,
        };

        // Send the data to the product API
        const response = await fetch('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        // Handle response
        if (!response.ok) {
          console.error('Failed to save product:', response.status, response.statusText);
          throw new Error(`Failed to save product. Status code: ${response.status}`);
        }

        const result = await response.json();
        console.log('Product saved successfully:', result);

        // Prepare the data for the second API
        const productReduceData = {
          productName: product.productName,
          productModel: product.productModels,
          productBrand: product.productBrand,
          productQuantity: product.productQuantity,
          date: product.date
        };
        console.log(productReduceData, "reduce");
        // Split productModels if there are multiple values
        // Split productModels and modelQuantity if there are multiple values
        const productModels = product.productModels.split(',').map(model => model.trim());
        const productQuantities = product.modelQuantity.split(',').map(quantity => quantity.trim());

        // Ensure both arrays have the same length
        if (productModels.length !== productQuantities.length) {
          throw new Error("Mismatch between number of product models and quantities");
        }

        // Patch office accounts for each product model and quantity pair
        for (let i = 0; i < productModels.length; i++) {
          const updateData = {
            ...productReduceData,
            productModel: productModels[i],
            productQuantity: productQuantities[i]  // Use the corresponding quantity
          };

          try {
            await axios.patch(
              "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts/sub",
              updateData
            );
            console.log('Office account updated successfully:', updateData);
          } catch (patchError) {
            console.error('Failed to patch office account:', patchError);
            throw patchError;  // Rethrow to catch in the outer try-catch block
          }
        }
      }

      // Success toast and navigation
      toast.success("Successfully uploaded to server", {
        position: "top-center",
      });
      navigate("/exportimport");

    } catch (error) {
      console.error('Error occurred:', error);
      toast.error("Network Error. Please try again later", {
        position: "top-center",
      });
    }
  };


  useEffect(() => {
    setLoading(true);
    fetchAllDataProducts();
  }, []);

  // Fetch products from the server
  const fetchAllDataProducts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts"
      );
      const data = response?.data || [];
      const sortedData = data.sort((a, b) => b.id - a.id);
      setAllDataProducts(sortedData);
      setFilteredProducts(sortedData);

      // Extract unique dates from the products
      const uniqueDates = [...new Set(data.map(product => product.date))];
      setDates(uniqueDates);
      setLoading(false);
    } catch (error) {
      toast.error("Error getting products from server!", {
        position: "top-center",
      });
    }
  };

  // Handle date selection change
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);

    // Filter products based on the selected date
    const filtered = selectedDate
      ? allDataProducts.filter((product) => product.date === selectedDate)
      : [];

    setFilteredProducts(filtered);
  };

  const handleToProductAdd = (e) => {
    e.preventDefault();


    // Create the product object
    const productData = {
      productName: selectedProductName,
      productModels: allProducts,
      modelQuantity: allModelQuantity,
      perBoxProducts: allPerBoxQuantity,
      totalPerBoxProduct: perBoxProducts,
      productQuantity,
      totalBox,
      palletNo: selectedProductPallet,
      truckNumber
    };

    // Append the new product object to the array
    setProductList((prevProductList) => [...prevProductList, productData]);
    setSelectedProductName("")
    setAllProducts("")
    setAllPerBoxQuantity("")
    setAllModelQuantity("")
    setSelectedProductModels("")
    setPerBoxProducts(0)
    setProductQuantity(0)
    setTotalBox(0)
    setSelectedProductPallet("");
    setTruckNumber("")


    // return;
  };



  const handleNameInputChange = (e) => {
    const productName = e.target.value;

    const models = filteredProducts
      .filter(product => product.productName === productName)
      .map(product => ({
        modelNo: product.productModel,
        quantity: product.productQuantity // Assuming `productQuantity` exists
      })); // Create an array of objects with model and quantity

    setModelList(models);
    // Set the modelList to be the array of model strings
    setSelectedProductName(productName);

    // Reset input fields and values
    setSelectedProductModels({});
    setModelData({});
    setInputValues({});
  };


  const handleProductModelCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setSelectedProductModels((prev) => ({
      ...prev,
      [value]: checked, // Track whether each model is checked or not
    }));

    if (!checked) {
      setModelData((prev) => ({
        ...prev,
        [value]: { perBox: "", quantity: "" }, // Clear data when unchecked
      }));
    }
  };


  const handlePerBoxValueChange = (e, model) => {
    const { value } = e.target;

    // Update state and run calculation after the state is updated
    setModelData((prev) => {
      const updatedModelData = {
        ...prev,
        [model?.modelNo]: {
          ...prev[model?.modelNo],
          perBox: value,
        },
      };

      // Trigger calculation with the latest state
      calculationPart(updatedModelData);
      return updatedModelData;
    });
  };

  const handleQuantityValueChange = (e, model) => {
    const { value } = e.target;
    if (value > model?.quantity) {
      toast.warn("You can't export no more than production quantity");
      return;
    }

    // Update state and run calculation after the state is updated
    setModelData((prev) => {
      const updatedModelData = {
        ...prev,
        [model?.modelNo]: {
          ...prev[model?.modelNo],
          quantity: value,
        },
      };

      // Trigger calculation with the latest state
      calculationPart(updatedModelData);
      return updatedModelData;
    });
  };

  const calculationPart = (updatedModelData) => {
    // Use updatedModelData in place of modelData for accurate calculations

    const TotalProduct = Object.keys(selectedProductModels) // Get all the model keys
      .filter(model => selectedProductModels[model]) // Filter only the checked models
      .join(', ');
    setAllProducts(TotalProduct);

    const splitQuantity = Object.keys(updatedModelData) // Get all the model keys
      .filter(model => selectedProductModels[model]) // Filter only the checked models
      .map(model => updatedModelData[model]?.quantity) // Get the quantity for each checked model
      .filter(quantity => quantity !== undefined) // Ensure we only take models that have quantities
      .join(', '); // Join them into a string separated by commas

    setAllModelQuantity(splitQuantity); // Set the state with the resulting string

    const splitPerBox = Object.keys(updatedModelData) // Get all the model keys
      .filter(model => selectedProductModels[model]) // Filter only the checked models
      .map(model => updatedModelData[model]?.perBox) // Get the quantity for each checked model
      .filter(perBox => perBox !== undefined) // Ensure we only take models that have quantities
      .join(', '); // Join them into a string separated by commas

    setAllPerBoxQuantity(splitPerBox); // Set the state with the resulting string

    const productPerBox = Object.values(updatedModelData) // Get all the values from the updated modelData object
      .reduce((sum, model) => sum + (parseInt(model.perBox) || 0), 0);
    setPerBoxProducts(productPerBox);

    const totalBox = Object.values(updatedModelData) // Get all the values from the updated modelData object
      .map(model => Math.ceil((parseInt(model.quantity) || 0) / (parseInt(model.perBox) || 1))) // Calculate ceiling of quantity/perBox for each model
      .reduce((max, current) => Math.max(max, current), 0); // Find the largest result

    setTotalBox(totalBox); // Set the totalBox with the largest value

    const totalQuantity = Object.values(updatedModelData) // Get all the values from the updated modelData object
      .reduce((sum, model) => sum + (parseInt(model.quantity) || 0), 0);
    setProductQuantity(totalQuantity);
  };





  return (
    <div>
      {/* Form Design for Products Boxes */}
      <div className="mt-5 lg:flex justify-center items-center mb-4">
        <form className="card shadow-xl mt-5 p-3"  >
          <div className="flex justify-between items-center bg-slate-500 p-3 rounded-lg my-6">
            <h2 className="text-4xl font-bold text-info">
              Products Listed For Export
            </h2>
            <div className="flex space-x-4">
              <select
                className="p-2 rounded-lg border border-gray-300"
                value={selectedDate}
                onChange={handleDateChange} // Update selected date on change
              >
                <option value="">Select Date</option>
                {dates?.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
                          value={selectedProductName || ""}
                          name="productName"
                          required
                          onChange={handleNameInputChange}
                        >
                          <option value="" className="mt-2">Pick product Name</option>
                          {filteredProducts?.map((product, index) => (
                            <option key={index} value={product.productName}>
                              {product?.productName}
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

                      <div className="flex flex-col space-y-4">
                        {Array.isArray(modelList) && modelList.map((model, index) => (
                          <div key={index} className="flex items-center justify-between w-full bg-gray-100 p-2 rounded-md">
                            {/* Checkbox for each model */}
                            <div className="flex items-center space-x-2">
                              <input
                                className="checkbox checkbox-xs checkbox-info"
                                type="checkbox"
                                value={model?.modelNo}
                                checked={!!selectedProductModels[model?.modelNo]} // Check if the model is selected
                                onChange={handleProductModelCheckboxChange}
                              />
                              {/* Display model name */}
                              <label className="text-sm font-semibold">{model?.modelNo}</label>
                            </div>

                            {selectedProductModels[model?.modelNo] && (
                              <div className="flex items-center space-x-4">
                                {/* Input for perBox */}
                                <input
                                  type="number"
                                  min="0"
                                  value={modelData[model?.modelNo]?.perBox || ""}
                                  onChange={(e) => handlePerBoxValueChange(e, model,)}
                                  placeholder="Per Box"
                                  className="w-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                />

                                {/* Input for quantity */}
                                <input
                                  type="number"
                                  min="0"
                                  value={modelData[model?.modelNo]?.quantity || ""}
                                  onChange={(e) => handleQuantityValueChange(e, model)}
                                  placeholder="Product Quantity"
                                  className="w-[170px] p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                />
                              </div>
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
                        value={productQuantity}
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
                        value={selectedProductPallet}
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
                        Courier Number
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        placeholder="Enter Truck Number"
                        type="text"
                        name="truckNumber"
                        value={truckNumber}
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
              type="submit" onClick={handleToProductAdd}>
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
              {productList.map((item, index) => {
                return (
                  <tr className="hover cursor-pointer" key={index}>
                    <td>{item?.productName}</td>
                    <td>{item?.productModels}</td>
                    <td>{item?.perBoxProducts}</td>
                    <td>{item?.modelQuantity}</td>
                    <td>{item?.totalPerBoxProduct}</td>
                    <td>{item.totalBox}</td>
                    <td>{item.productQuantity}</td>
                    <td>{item.palletNo}</td>
                    <td>{item.truckNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Save Button Below the Table */}
        {productList.length > 0 && (
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
