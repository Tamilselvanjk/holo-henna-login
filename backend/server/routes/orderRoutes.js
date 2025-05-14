const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/create', async (req, res) => {
    try {
        const order = new Order({
            user: req.user._id, // Add user reference
            products: req.body.products,
            totalAmount: req.body.totalAmount
        });
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
