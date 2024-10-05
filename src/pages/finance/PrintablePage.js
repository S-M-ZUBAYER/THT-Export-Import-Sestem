import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (finance) => {
  if (!finance) {
    console.error("No finance data provided");
    return;
  }

  const doc = new jsPDF();

  // Function to handle table generation
  const generateTable = (head, body, startY) => {
    doc.autoTable({
      head: [head],
      body,
      startY,
      theme: 'grid',
      styles: { fontSize: 10, textColor: [0, 0, 0] },
      headStyles: { fillColor: [204, 229, 255], textColor: [0, 0, 102] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
  };

  // Add border to the entire page
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10, "S");

  // Title and Main Information
  doc.setFontSize(20).setTextColor(0, 102, 204).setFont("helvetica", "bold");
  doc.text("Shipment and Invoice Details", 15, 20);

  doc.setFontSize(10).setTextColor(0, 0, 0);
  const mainInfo = [
    `Transport Way: ${finance.transportWay || "N/A"}`,
    `Country: ${finance.transportCountryName || "N/A"}`,
    `Invoice No: ${finance.invoiceNo || "N/A"}`,
    `Gross Weight: ${finance.grossWeight || "N/A"}`,
    `Net Weight: ${finance.netWeight || "N/A"}`,
    `Trade Exchange Rate: ${finance.tradeExchangeRate || "N/A"}`,
    `Invoice Value: ${finance.totalAmountBDT || "N/A"} TK`
  ];

  mainInfo.forEach((text, idx) => {
    doc.text(text, 15, 30 + idx * 6);
  });

  // Particular Expenses Section
  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(0, 102, 204);
  doc.text("Particular Expenses", 15, 80);

  generateTable(
    ['Date', 'Expense Name', 'Remark', 'Cost'],
    finance?.financeParticularExpenseNames?.map(expense => [
      expense.date || "N/A",
      expense.particularExpenseName || "N/A",
      expense.remark || "N/A",
      expense.particularExpenseCost || "N/A"
    ]),
    85
  );

  // Products in Boxes Section
  doc.text("Products In Boxes", 15, doc.lastAutoTable.finalY + 10);

  generateTable(
    ['Product Name', 'Model', 'Quantity', 'Pallet No', 'Truck No', 'Total Weight'],
    finance?.financeProductInBoxes?.map(product => [
      product.productName || "N/A",
      product.productModel || "N/A",
      product.quantity || "N/A",
      product.totalPallet || "N/A",
      product.truckNumber || "N/A",
      product.individualTotalBoxWeight || "N/A"
    ]),
    doc.lastAutoTable.finalY + 15
  );

  // Carrier Service Section
  doc.text("Carrier Service", 15, doc.lastAutoTable.finalY + 10);

  generateTable(
    ['S/L', 'Date', 'Container No', 'Invoice No', 'EP No', 'Fare', 'Ait/Vat', 'Total'],
    finance?.financeContainerExpenseNames?.map(container => [
      container.slNo || "N/A",
      container.date || "N/A",
      container.containerNo || "N/A",
      container.invoiceNo || "N/A",
      container.epNumber || "N/A",
      container.fareAmount || "N/A",
      container.aitVat || "N/A",
      container.individualTotalAmount || "N/A"
    ]),
    doc.lastAutoTable.finalY + 15
  );

  // Aero Ocean Freight Service Section
  doc.text("Aero Ocean Freight Service", 15, doc.lastAutoTable.finalY + 10);

  generateTable(
    ['Description', 'Amount (USD)', 'Amount (BDT)'],
    finance?.financeCharges?.map(charge => [
      charge.description || "N/A",
      charge.amountUSD || "N/A",
      charge.amountBDT || "N/A"
    ]),
    doc.lastAutoTable.finalY + 15
  );

  // Save the PDF with dynamic filename based on invoice number
  const fileName = `finance_details_${finance.invoiceNo || "unknown"}.pdf`;
  doc.save(fileName);
};
