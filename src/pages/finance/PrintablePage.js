import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (finance) => {
  console.log(finance, "finance");

  const productNameParse = JSON.parse(finance?.productName);
  const uniqueProducts = Array.from(new Set(productNameParse));
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

  // Title and Main Information
  doc.setFontSize(55);
  doc.text("Mark", 78, 30);

  const productNameLines = doc.splitTextToSize(
    `Product Name: ${uniqueProducts}`,
    250
  );
  doc.setFontSize(38);
  doc.text(productNameLines, 7, 60);

  doc.setFontSize(40);
  doc.text(`Total Box: ${finance.totalBox} boxes`, 7, 115);

  doc.setFontSize(30);
  doc.text(`Made in ${finance.transportCountryName}`, 62, 140);

  doc.setFontSize(60);
  doc.text(`Pallet: ${finance.totalPalletQuantity}`, 65, 175);

  // Table Header
  let columnWidths = [40, 30, 30, 35, 45]; // Default column widths

  productModelParse.forEach((model, index) => {
    const totalBox = finance.financeProductInBoxes[index]?.totalBox || 0;
    const contentLength = {
      model: model.length,
      totalBox: totalBox.toString().length + 7, // " boxes" appended
    };

    contentLength.model > columnWidths[0] && (columnWidths[0] = contentLength.model);
    contentLength.totalBox > columnWidths[4] && (columnWidths[4] = contentLength.totalBox);
  });

  // Table for product details
  doc.autoTable({
    head: [["Model", "Date", "Quantity", "Pallet", "Truck"]],
    startY: 200,
    styles: {
      halign: "center",
      fontSize: 12,
    },
    columnStyles: {
      0: { cellWidth: columnWidths[0] },
      1: { cellWidth: columnWidths[1] },
      2: { cellWidth: columnWidths[2] },
      3: { cellWidth: columnWidths[3] },
      4: { cellWidth: columnWidths[4] },
    },
  });

  // Loop to add multiple rows for each product model
  finance.financeProductInBoxes.forEach((product, index) => {
    const dateString = finance.selectedBEDate;
    const dateObj = new Date(dateString);
    const localDate = dateObj.toLocaleDateString();
    const totalBox = product.totalBox;

    doc.autoTable({
      body: [
        [
          product.productModel,
          localDate,
          product.quantity,
          finance.totalPalletQuantity,
          product.truckNumber,
        ],
      ],
      startY: doc.lastAutoTable.finalY + 10, // Adjust position
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

  // Save the generated PDF with a filename based on the invoice number
  doc.save(`finance_details_${finance.invoiceNo}.pdf`);
};
