const express = require("express");
const cors = require('cors');
const app = express();
app.use(express.json());
const port = 3005;
app.use(cors());

const { readProducts, writeProducts, readReviews, writeReviews } = require('./file');
const products = [];
const review = [];

app.post("/products", (req, res) => {
    let product_id;
    if (products.length == 0) {
        product_id = 1;
    } else {
        product_id = products[products.length - 1].id + 1;
    }
    const new_product = {
        id: product_id,
        name: req.body.name,
        description: req.body.description,
        averageRating: 0
    }
    products.push(new_product);
    writeProducts(products);
    res.status(201).json({ message: "Product added successfully" });
});

app.post("/reviews", (req, res) => {
    let review_id;
    if (review.length == 0) {
        review_id = 1;
    } else {
        review_id = review[review.length - 1].id + 1;
    }
    const new_review = {
        id: review_id,
        product_id: req.body.product_id,
        timestamp: req.body.timestamp,
        rating: req.body.rating,
        message: req.body.message
    }
    review.push(new_review);
    writeReviews(review);
    res.status(201).json({ message: "Review added successfully" });
});

app.get("/products", (req, res) => {
    const products = readProducts();
    const reviews = readReviews();

    // Calculate average rating for each product
    const productsWithRatings = products.map((product) => {
        const productReviews = reviews.filter((review) => review.product_id === product.id);

        const averageRating =
            productReviews.length > 0
                ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
                : 0;

        return { ...product, averageRating: parseFloat(averageRating.toFixed(2)) };
    });

    // Sorting logic (if "sortBy=rating" is passed as a query parameter)
    if (req.query.sortBy === "rating") {
        productsWithRatings.sort((a, b) => b.averageRating - a.averageRating);
    }

    res.json(productsWithRatings);
});

app.get("/reviews", (req, res) => {
    const reviews = readReviews();

    // Sorting logic based on query parameter
    if (req.query.sortBy === "rating") {
        reviews.sort((a, b) => b.rating - a.rating); // Sort by rating (highest first)
    } else {
        reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by recent timestamp (newest first)
    }

    res.json(reviews);
});

app.listen(port, () => {
    console.log("Server Running....");
});