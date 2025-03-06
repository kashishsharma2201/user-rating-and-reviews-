const fs = require("fs");
const path = require("path");

// Define file paths
const productsFile = path.join(__dirname, "products.json");
const reviewsFile = path.join(__dirname, "reviews.json");

// Function to read JSON files
const readFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([])); // Create an empty file if not exists
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

// Function to write data to JSON files
const writeFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Export functions for products and reviews
module.exports = {
    readProducts: () => readFile(productsFile),
    writeProducts: (data) => writeFile(productsFile, data),
    readReviews: () => readFile(reviewsFile),
    writeReviews: (data) => writeFile(reviewsFile, data),
};