import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MultipleImageUpload = ({ financeDetailsData, setFinanceDetailsData }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    console.log(financeDetailsData, "data");


    // Handle file selection
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Get selected files as an array
        setSelectedFiles(files);

        // Create image preview URLs
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    // Handle image upload
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select images to upload.");
            return;
        }

        setUploading(true);
        const formData = new FormData();

        // Append each file to FormData
        selectedFiles.forEach((file, index) => {
            formData.append(`file`, file); // 'files' should match API expectations
        });
        try {
            const response = await axios.post(
                "https://grozziieget.zjweiting.com:3091/web-api-tht-1/fileUpload/multiple",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                console.log(response, "response");

                handleToUpdate(response.data);
                toast.success("Images uploaded successfully!");
                setSelectedFiles([]); // Clear the selected files after successful upload
                setPreviewImages([]); // Clear the preview images
            } else {
                toast.error("Failed to upload images.");
            }
        } catch (error) {
            toast.error("An error occurred during the upload.");
        } finally {
            setUploading(false);
        }
    };

    const handleToUpdate = (data) => {
        let fullFile;
        data.forEach((file, index) => {
            if (index === 0) {
                if (financeDetailsData.image) {

                    fullFile = financeDetailsData.image + "," + file;
                }
                else {
                    fullFile = file;
                }
            } else {
                fullFile = fullFile + "," + file;
            }
        });
        console.log("Concatenated filenames:", fullFile);

        // Create the updated data with the concatenated filenames
        const updateData = { ...financeDetailsData, image: fullFile };
        console.log("Updated data:", updateData);
        axios
            .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', updateData)
            .then(response => {
                toast.success('Trade by finance successfully!');
                setFinanceDetailsData(updateData);
            })
            .catch(error => {
                toast.error('Error occurred while processing the trade.');
                console.error(error);
            });
    };


    return (
        <div className="container mx-auto py-4">
            <h3 className="text-xl font-bold mb-4 text-center underline">Upload Images Related To This Export Data</h3>

            <h2 className="text-xl font-bold mb-4">Upload Multiple Images</h2>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
            />

            {/* Image previews */}
            <div className="flex gap-4 mb-4">
                {previewImages.map((img, index) => (
                    <div key={index}>
                        <img
                            src={img}
                            alt={`preview-${index}`}
                            className="w-32 h-32 object-cover border"
                        />
                    </div>
                ))}
            </div>

            {/* Upload button */}
            <button
                onClick={handleUpload}
                className={` btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black ${uploading ? "opacity-50 cursor-not-allowed " : ""
                    }`}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload Images"}
            </button>
        </div>
    );
};

export default MultipleImageUpload;