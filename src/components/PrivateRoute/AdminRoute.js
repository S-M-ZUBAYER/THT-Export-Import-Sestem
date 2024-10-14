import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const AdminRoute = () => {
  const location = useLocation();
  const foundUser = JSON.parse(localStorage.getItem("user")); // Get userId from localStore


  // // loader css style
  // const override = {
  //   display: "block",
  //   margin: "25px auto",
  // };


  // useEffect(() => {
  //   // Fetch the user data if userId exists
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/users/${foundUser}`
  //       );

  //       // Check if the fetched user is admin
  //       if (response.status === 200) {
  //         if (response.data?.isAdmin) {
  //           setIsAdmin(true); // Set admin status if true
  //         }
  //       }
  //     } catch (error) {
  //       toast.error("Failed to fetch user information");
  //     } finally {
  //       setLoading(false); // Stop loading after the request
  //     }
  //   };

  //   if (foundUser) {
  //     fetchUser();
  //   } else {
  //     setLoading(false); // Stop loading if no userId found
  //   }
  // }, [foundUser]);

  // Show a loading state while fetching the user data
  // if (loading) {
  //   return <div className="">
  //     <ClipLoader
  //       color={"#36d7b7"}
  //       loading={loading}
  //       size={50}
  //       cssOverride={override}
  //     />
  //     <p className="text-center font-extralight text-xl text-green-400">
  //       Please wait ....
  //     </p>
  //   </div>; // Replace with a spinner or loader component if desired
  // }

  // If no userId is found, or user is not admin, redirect to home
  if (!foundUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  else if (foundUser.admin) {
    // If user is an admin, allow access to the protected route
    return <Outlet />;
  }
  else {
    toast.error("You don't have permission to access this route");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

};

export default AdminRoute;
