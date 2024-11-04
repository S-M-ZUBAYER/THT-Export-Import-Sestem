import axios from 'axios';
import React, { useEffect, useState } from 'react';

const MalaysiaFormate = ({ finalData, handlePrint, closeModal }) => {
    const [productNameFormate, setProductNameFormate] = useState([]);
    // Fetch user data from API
    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const response = await axios.get(
                    "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newproduct"
                );
                setProductNameFormate(response.data);
            } catch (error) {
                console.error("Failed to fetch users");
            }
        };
        fetchProductList();
    }, []);

    const marks = finalData?.mark ? finalData?.mark?.split(",") || [] : [];

    const totalQuantity = finalData?.printData?.reduce((acc, data) => {
        return acc + (data?.quantity || 0);
    }, 0);

    const totalBoxes = finalData?.printData?.reduce((acc, data) => {
        return acc + (data?.totalBox || 0);
    }, 0);


    const productNames = () => {
        console.log("click");

        return finalData?.printData
            ?.map(product => {
                const matchedProduct = productNameFormate?.find(
                    item => item.productName === product.productName
                );
                console.log(matchedProduct, "match");

                return matchedProduct ? matchedProduct.malaysiaName : product.productName;
            })
            .join(' + ');
    };


    return (

        <div className="bg-white p-6 rounded-lg shadow-lg ">
            <div id="pdf-content" className="space-y-4 ">
                <div className="border-4 p-3 mx-8 border-slate-800  min-h-[800px] ">

                    <h1 className="text-4xl font-medium text-center mb-6">MARKS & NOTES</h1>
                    <h1 className="text-4xl font-medium text-center mb-6">唛头</h1>
                    <h2 className="text-xl ml-1 mb-6 mt-6">
                        {marks.map((mark, index) => (
                            <p key={index}>
                                {index + 1}. {mark.trim()}
                            </p>
                        ))}
                    </h2>

                    <div className="flex justify-start items-center mb-4">
                        <h3 className="text-xl ml-1   mr-2">品名:</h3>
                        <p className="text-xl ml-1">{productNames()}</p>
                    </div>

                    <div className="flex justify-start items-center mb-4">
                        <h3 className="text-xl ml-1    mr-2">每托盘箱数:  </h3>
                        <p className="text-xl ml-1">{totalBoxes} 箱</p>
                    </div>
                    <div className="flex justify-start items-center mb-4">
                        <h3 className="text-xl ml-1    mr-2">入库单号:  </h3>
                        <p className="text-xl ml-1">{finalData?.receiptNumber}</p>
                    </div>

                    <div className="flex justify-start items-center mb-6">
                        <h3 className="text-xl ml-1    mr-2">数量:  </h3>
                        <p className="text-xl ml-1">{totalQuantity} 台</p>
                    </div>



                    <div className="flex justify-center items-center mb-2">
                        <h3 className="text-xl ml-1 mr-2">{finalData?.company}</h3>
                        <p className="text-xl ml-1">Company</p>
                    </div>

                    <h3 className="text-2xl font-semibold ml-1 text-center">Made in Bangladesh</h3>

                    <div className="flex justify-center items-center mt-4 mb-2">
                        <h3 className="text-4xl ml-1 font-medium">托盘号/</h3>
                        <p className="text-4xl ml-1">{finalData?.printData[0]?.totalPallet}</p>
                    </div>
                    <table className="w-full border-collapse mt-4">
                        <thead>
                            {
                                finalData?.language === "EN" ? <tr className="bg-gray-200">
                                    <th className="border-x-2 border-gray-300 px-4 py-2 w-32">Model</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2 w-32">Date</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2 w-24">Pallet Total Box</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2">Pallet No</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2">Total Pallet No</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2">Remark</th>
                                </tr> : <tr className="bg-gray-200">
                                    <th className="border-x-2 border-gray-300 px-4 py-2 w-32">型号</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2 w-32">日期</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2 w-24">托盘总箱数</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2 w-24">托盘号</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2 w-24">总卡板</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2 w-24">备注</th>
                                </tr>
                            }

                        </thead>
                        <tbody>
                            {finalData?.printData?.map((product, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{product?.productModel}</td>
                                    <td className="border px-4 py-2">{product?.date}</td>
                                    <td className="border px-4 py-2">{product?.totalBox} 箱</td>
                                    <td className="border px-4 py-2">{product?.totalPallet}</td>
                                    <td className="border px-4 py-2">{finalData?.totalPalletNo}</td>
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

export default MalaysiaFormate