import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MultipleImageUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [uploading, setUploading] = useState(false);

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
            formData.append(`files`, file); // 'files' should match API expectations
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

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Upload Multiple Images</h2>
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
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload Images"}
            </button>
        </div>
    );
};

export default MultipleImageUpload;
