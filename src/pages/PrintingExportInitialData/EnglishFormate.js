import React from 'react';

const EnglishFormate = ({ finalData, handlePrint, closeModal }) => {

    const marks = finalData?.mark?.split(",") || [];
    const totalQuantity = finalData?.printData?.reduce((acc, data) => {
        return acc + (data?.quantity || 0);
    }, 0);
    const totalBoxes = finalData?.printData?.reduce((acc, data) => {
        return acc + (data?.totalBox || 0);
    }, 0);


    return (

        <div className="bg-white p-6 rounded-lg shadow-lg ">
            <div id="pdf-content" className="space-y-4 ">
                <div className="border-4 p-3 mx-8 border-slate-800  min-h-[800px] ">

                    <h1 className="text-3xl font-bold text-center underline">Mark</h1>
                    <h2 className="text-xl ml-1 mb-4">
                        {marks.map((mark, index) => (
                            <p key={index}>
                                {index + 1}. {mark.trim()}
                            </p>
                        ))}
                    </h2>

                    <div className="flex justify-start items-center mb-1">
                        <h3 className="text-2xl ml-1 font-semibold">Product Name:</h3>
                        <p className="text-xl ml-1">{finalData?.printData?.map(product => product.productName).join('+ ')}</p>
                    </div>

                    <div className="flex justify-start items-center mb-1">
                        <h3 className="text-2xl ml-1 font-semibold">Pallet Total Boxes:</h3>
                        <p className="text-xl ml-1">{totalBoxes} boxes</p>
                    </div>
                    <div className="flex justify-start items-center mb-1">
                        <h3 className="text-2xl ml-1 font-semibold">Receipt Number:</h3>
                        <p className="text-xl ml-1">{finalData?.receiptNumber}</p>
                    </div>

                    <div className="flex justify-start items-center mb-1">
                        <h3 className="text-2xl ml-1 font-semibold">Quantity:</h3>
                        <p className="text-xl ml-1">{totalQuantity} Pieces</p>
                    </div>



                    <div className="flex justify-center items-center">
                        <h3 className="text-2xl ml-1 mr-2">{finalData?.company}</h3>
                        <p className="text-xl ml-1">Company</p>
                    </div>

                    <h3 className="text-2xl ml-1 text-center">Made in Bangladesh</h3>

                    <div className="flex justify-center items-center">
                        <h3 className="text-2xl ml-1 font-semibold">Pallet No:</h3>
                        <p className="text-xl ml-1">{finalData?.printData[0]?.totalPallet}</p>
                    </div>
                    <table className="w-full border-collapse mt-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-4 py-2">Model</th>
                                <th className="border px-4 py-2">Date</th>
                                <th className="border px-4 py-2">Pallet Total Box</th>
                                <th className="border px-4 py-2">Pallet No</th>
                                <th className="border px-4 py-2">Remark</th>
                            </tr>

                        </thead>
                        <tbody>
                            {finalData?.printData?.map((product, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{product?.productModel}</td>
                                    <td className="border px-4 py-2">{product?.date}</td>
                                    <td className="border px-4 py-2">{product?.totalBox} boxes</td>
                                    <td className="border px-4 py-2">{product?.totalPallet}</td>
                                    <td className="border px-4 py-2">{finalData?.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            <div className="flex justify-between mt-4">
                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition" onClick={handlePrint}>
                    Print PDF
                </button>
                <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition" onClick={closeModal}>
                    Close
                </button>
            </div>
        </div>

    );
};

export default EnglishFormate