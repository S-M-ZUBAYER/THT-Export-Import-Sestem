import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (finance) => {
  const productNameParse = JSON.parse(finance?.productName);
  const uniqueProducts = Array.from(new Set(productNameParse));
  const totalBoxParse = JSON.parse(finance?.totalBox);
  const totalBox = totalBoxParse?.reduce(
    (acc, currentValue) => acc + currentValue,
    0
  );
  const productModelParse = JSON.parse(finance.productModel);

  const doc = new jsPDF();

  // Add border to the entire page
  doc.rect(
    5,
    5,
    doc.internal.pageSize.width - 15,
    doc.internal.pageSize.height - 15,
    "S"
  );

  doc.setFontSize(55);
  doc.text("Mark", 78, 30);
  const productNameLines = doc.splitTextToSize(
    `Product Name: ${uniqueProducts}`,
    250
  );
  doc.setFontSize(38);
  doc.text(productNameLines, 7, 60);
  doc.setFontSize(40);
  doc.text(`Total Box: ${totalBox} boxes`, 7, 115);
  doc.setFontSize(30);
  doc.text(`Made in Bangladesh`, 62, 140);
  doc.setFontSize(60);
  doc.text(`Pallet: ${finance.totalPalletQuantity}`, 65, 175);
  // doc.setFontSize(16);
  // doc.text(`Date: ${localDate}`, 10, 150);

  // this code is only show for table and data not style properly
  // Generate the header
  // doc.autoTable({
  //   head: [["Model", "Date", "Total Pallet", "Pallet", "Remark"]],
  //   startY: 200,
  //   styles: {
  //     head: {
  //       fillColor: [255, 255, 255],
  //       textColor: [0, 0, 0],
  //     },
  //   },
  // });

  // If product is multiple then this
  // productModelParse.forEach((model, index) => {
  //   const dateString = finance.selectedBEDate;
  //   const dateObj = new Date(dateString);
  //   const localDate = dateObj.toLocaleDateString();

  //   const totalBox = JSON.parse(finance.totalBox)[index];

  //   doc.autoTable({
  //     // head: [["Model", "Date", "Total Pallet", "Pallet", "Remark"]],
  //     body: [
  //       [
  //         model,
  //         localDate,
  //         "20",
  //         finance.totalPalletQuantity,
  //         `${totalBox} boxes`,
  //       ],
  //     ],
  //     startY: 208 + index * 8, // Adjust the Y position based on your content above
  //     styles: {
  //       overflow: "linebreak",
  //     },
  //   });
  // });

  // this code is try style and style some fixed
  let columnWidths = [40, 30, 30, 35, 45]; // Adjust these values as needed

  // Calculate column widths based on content length
  productModelParse.forEach((model, index) => {
    const totalBox = JSON.parse(finance.totalBox)[index];
    const contentLength = {
      model: model.length,
      totalBox: totalBox.toString().length + 7, // " boxes" appended
    };

    contentLength.model > columnWidths[0] &&
      (columnWidths[0] = contentLength.model);
    contentLength.totalBox > columnWidths[4] &&
      (columnWidths[4] = contentLength.totalBox);
  });

  doc.autoTable({
    head: [["Model", "Date", "Total", "Pallet", "Remark"]],
    startY: 200,
    styles: {
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: columnWidths[0] },
      1: { cellWidth: columnWidths[1] },
      2: { cellWidth: columnWidths[2] },
      3: { cellWidth: columnWidths[3] },
      4: { cellWidth: columnWidths[4] },
    },
  });

  // If product is multiple then this
  productModelParse.forEach((model, index) => {
    const dateString = finance.selectedBEDate;
    const dateObj = new Date(dateString);
    const localDate = dateObj.toLocaleDateString();

    const totalBox = JSON.parse(finance.totalBox)[index];

    doc.autoTable({
      body: [
        [
          model,
          localDate,
          "20",
          finance.totalPalletQuantity,
          `${totalBox} boxes`,
        ],
      ],
      startY: 208 + index * 8,
      styles: {
        overflow: "linebreak",
        lineHeight: 14,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: columnWidths[0] },
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4] },
      },
    });
  });

  // Save PDF code and make file name
  doc.save(`finance_details_${finance.invoiceNo}.pdf`);
};
