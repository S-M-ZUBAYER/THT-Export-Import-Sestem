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
    doc.setFontSize(35); // Adjusted size for "Mark" heading
    doc.text("Mark", 78, 30);


    doc.setFontSize(26); // Font size for the remark content
    const remarkLines = doc.splitTextToSize(remark, 190); // Adjust width as needed
    doc.text(remarkLines, 10, 45); // Display the remark below the "Mark" heading

    // Display Product Name and Truck Number as headings
    const firstProduct = dataArray[0]; // Assuming truck number and product name are the same for all
    doc.setFontSize(30);
    const productNameLines = doc.splitTextToSize(
        `Product Name: ${firstProduct.productName}`,
        240
    );
    doc.text(productNameLines, 7, 85); // Product Name

    doc.setFontSize(30);
    doc.text(`Truck Number: ${firstProduct.totalPallet}`, 7, 100); // Truck Number (Heading)

    doc.setFontSize(20);
    doc.text(`Made in Bangladesh`, 70, 123); // Truck Number (Heading)

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
    const columns = ["Model", "Split Quantity", "Total Box", "Pallet No", "Truck No"];

    // Generate a single table with all product details, including truck number
    doc.autoTable({
        head: [columns],
        body: tableData,
        startY: 130, // Adjust the Y position based on content above
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
