import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateInitialPDF = (dataArray, remark) => {
    const doc = new jsPDF();

    // Add border to the entire page
    doc.rect(
        5,
        5,
        doc.internal.pageSize.width - 15,
        doc.internal.pageSize.height - 15,
        "S"
    );

    // Set the font and size for the title
    doc.setFontSize(45); // Adjusted size for "Mark" heading
    doc.text("Mark", 78, 30);

    // Add the remark section below the "Mark" heading
    doc.setFontSize(20); // Font size for remark
    doc.text("Remark:", 10, 45);
    doc.setFontSize(16); // Font size for the remark content
    const remarkLines = doc.splitTextToSize(remark, 190); // Adjust width as needed
    doc.text(remarkLines, 10, 55); // Display the remark below the "Mark" heading

    // Display Product Name and Truck Number as headings
    const firstProduct = dataArray[0]; // Assuming truck number and product name are the same for all
    doc.setFontSize(38);
    const productNameLines = doc.splitTextToSize(
        `Product Name: ${firstProduct.productName}`,
        250
    );
    doc.text(productNameLines, 7, 90); // Product Name

    doc.setFontSize(40);
    doc.text(`Truck Number: ${firstProduct.truckNumber}`, 7, 120); // Truck Number (Heading)

    // Set font smaller for total details text
    doc.setFontSize(30);

    // Preparing the table data
    const tableData = dataArray.map((product) => [
        product.productModel,
        product.splitQuantitySingleProduct,
        `${product.totalBox} boxes`,
        product.totalPallet,
        product.truckNumber, // Truck Number in the table
    ]);

    // Define the columns and column headers, including Truck Number
    const columns = ["Model", "Split Quantity", "Total Box", "Pallet", "Truck Number"];

    // Generate a single table with all product details, including truck number
    doc.autoTable({
        head: [columns],
        body: tableData,
        startY: 140, // Adjust the Y position based on content above
        styles: {
            fontSize: 10, // Reduced font size for table content
            halign: "center",
            cellPadding: 2, // Reducing padding to make the content fit
            valign: "middle",
        },
        theme: "grid", // Makes the table look cleaner
        tableWidth: 'auto', // Automatically adjust column widths based on content
    });

    // Save the PDF file using the first product ID as the reference
    doc.save(`product_details_${firstProduct.id}.pdf`);
};
