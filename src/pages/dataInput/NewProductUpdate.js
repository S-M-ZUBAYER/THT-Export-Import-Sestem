import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const NewProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    productName: "",
  });

  useEffect(() => {
    axios
      .get(
        `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newproduct/${id}`
      )
      .then((res) => {
        setFormData(res?.data);
        setLoading(false)
      })
      .catch((error) =>
        console.error("Error coming from server please try again later", {
          position: "top-center",
        })
      );
    setLoading(false);
  }, [id]);

  // update data submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newproduct`,
        formData
      )
      .then((res) => {
        toast.success("Successfully Data Updated!!", {
          position: "top-center",
        });
        navigate("/newproduct");
      })
      .catch((error) =>
        toast.error("Something went wrong try again later", {
          position: "top-center",
        })
      );
  };

  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-violet-500 text-center mt-5">
        Product Update Form
      </h1>
      <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-[70%]">
          <div className="mt-8">
            <div className="mt-3">
              <label className="text-lg font-semibold" htmlFor="productName">
                Product Name
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                type="text"
                name="productName"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productName: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mt-5 flex justify-end gap-y-4">
              <Link to="/newproduct" className="btn btn-info px-10 mx-5">
                Back
              </Link>
              <button
                className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black"
                type="submit">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductUpdate;
