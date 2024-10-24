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


    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div id="pdf-content" className="space-y-4">
                <div className="border-4 p-3 mx-8 border-slate-800  min-h-[800px] ">

                    <h1 className="text-3xl font-bold text-center mb-2 underline">唛头</h1>
                    <h2 className="text-xl ml-1 mb-4">
                        {marks.map((mark, index) => (
                            <p key={index}>
                                {index + 1}. {mark.trim()}
                            </p>
                        ))}
                    </h2>

                    <div className="flex justify-start items-center">
                        <h3 className="text-2xl ml-1 font-semibold">品名:</h3>
                        <p className="text-xl ml-1">{finalData?.printData?.map(product => product.productName !== "Attendance Machine" ? product.productName !== "Dot Printer" ? "热敏打印机" : "点阵打印机" : "考勤机").join('+ ')}</p>
                    </div>

                    <div className="flex justify-start items-center">
                        <h3 className="text-2xl ml-1 font-semibold">每托盘箱数:</h3>
                        <p className="text-xl ml-1">{numberToChinese(totalBoxes)}</p>
                    </div>





                    <h3 className="text-2xl ml-1 text-center mt-3">Made in Bangladesh</h3>

                    <div className="flex justify-center items-center">
                        <h3 className="text-2xl ml-1 font-semibold">托盘号:</h3>
                        <p className="text-xl ml-1">{finalData?.printData[0]?.totalPallet}</p>
                    </div>
                    <table className="w-full border-collapse mt-4">
                        <thead>
                            {
                                finalData?.language === "EN" ? <tr className="bg-gray-200">
                                    <th className="border px-4 py-2">Model</th>
                                    <th className="border px-4 py-2">Date</th>
                                    <th className="border px-4 py-2">Pallet Total Box</th>
                                    <th className="border px-4 py-2">Pallet No</th>
                                    <th className="border px-4 py-2">Remark</th>
                                </tr> : <tr className="bg-gray-200">
                                    <th className="border px-4 py-2">型号</th>
                                    <th className="border px-4 py-2">日期</th>
                                    <th className="border px-4 py-2">托盘总箱数</th>
                                    <th className="border px-4 py-2">托盘号</th>
                                    <th className="border px-4 py-2">备注</th>
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