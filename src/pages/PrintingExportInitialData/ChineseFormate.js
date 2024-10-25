import React from 'react';

const ChineseFormate = ({ finalData, handlePrint, closeModal }) => {
    const marks = finalData?.mark?.split(",") || [];
    const totalBoxes = finalData?.printData?.reduce((acc, data) => {
        return acc + (data?.totalBox || 0);
    }, 0);

    const numberToChinese = (num) => {
        const units = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿'];
        const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

        let str = '';
        const numStr = num.toString();
        const length = numStr.length;

        for (let i = 0; i < length; i++) {
            const digit = parseInt(numStr[i]);
            const unit = units[length - i - 1];

            // Skip "零" followed by "零" or at the unit position.
            if (digit === 0) {
                if (str[str.length - 1] !== digits[0] && i < length - 1) {
                    str += digits[digit];
                }
            } else {
                str += digits[digit] + unit;
            }
        }

        // Remove redundant "一十" and replace it with "十"
        str = str.replace(/^一十/, '十');

        return str;
    };

    const productNames = () => {
        const uniqueNames = new Set();
        finalData?.printData?.forEach(product => {
            if (product.productName === "Attendance Machine") {
                uniqueNames.add("考勤机");
            } else if (product.productName === "Dot Printer") {
                uniqueNames.add("点阵打印机");
            } else {
                uniqueNames.add("热敏打印机");
            }
        });
        return Array.from(uniqueNames).join('+ ');
    };


    // Get the result of the function by calling it
    const names = productNames();

    console.log(names, names.length); // Logs the product names and their length

    if (names.length > 10) {
        console.log(names.slice(0, 10), "nesxxtt", names.slice(10, names.length));
    } else {
        console.log(names);
    }


    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-24 mb-1">
            <div id="pdf-content" className="space-y-4">
                <div className="border-4 px-3 mx-8 border-slate-800  min-h-[900px] text-black">

                    <h1 className="text-7xl font-semibold text-center  tracking-widest">唛头</h1>

                    <h2 className="text-3xl ml-1 mb-10 mt-8">
                        {marks.map((mark, index) => (
                            <p key={index}>
                                {index + 1}. {mark.trim()}
                            </p>
                        ))}
                    </h2>

                    <div className="flex justify-start  mb-10">
                        <h3 className="text-5xl ml-1 font-medium tracking-widest">品名:</h3>
                        {names.length > 10 ? (
                            <div className="">
                                <p className="text-5xl ml-1 font-medium tracking-widest">{names.slice(0, 10)}</p><br></br>
                                <p className="text-5xl ml-1 font-medium tracking-widest">{names.slice(10, names.length)}</p>
                            </div>
                        ) : (
                            <p className="text-5xl ml-1 font-medium tracking-widest">{names}</p>
                        )}
                    </div>


                    <div className="flex justify-start items-center mb-10">
                        <h3 className="text-5xl ml-1 font-medium tracking-widest">每托盘箱数:</h3>
                        <p className="text-5xl ml-1 font-medium tracking-widest">{numberToChinese(totalBoxes)}</p>
                    </div>





                    <h3 className="text-3xl ml-1 text-center font-semibold mb-10">Made in Bangladesh</h3>

                    <div className="flex justify-center items-center mb-10">
                        <h3 className="text-5xl ml-1 font-medium tracking-widest">托盘号:</h3>
                        <p className="text-5xl ml-1 font-medium t">{finalData?.printData[0]?.totalPallet}</p>
                    </div>
                    <table className="w-full border-collapse mt-12 pb-2 ">
                        <thead className='text-center'>
                            {
                                finalData?.language === "EN" ? <tr className="bg-gray-200">
                                    <th className="border-x-2 border-gray-300 px-4 py-2">Model</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2">Date</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2">Pallet Total Box</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2">Pallet No</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2">Remark</th>
                                </tr> : <tr className="bg-gray-200">
                                    <th className="border-x-2 border-gray-300 px-4 py-2">型号</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2">日期</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2">托盘总箱数</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2">托盘号</th>
                                    <th className="border-x-2 border-gray-300 px-4 py-2">备注</th>
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

export default ChineseFormate;