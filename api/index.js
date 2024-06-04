const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Transaction = require('./models/transaction.js'); // Assuming the model is in the correct path
require('dotenv').config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
    });

app.get('/api/test', (req, res) => {
    res.json({ body: 'test ok3' });
});

app.post('/api/transaction', async (req, res) => {
    const { name, description, datetime, price } = req.body;
    console.log('Received request:', req.body);

    try {
        const transaction = new Transaction({ name, description, datetime, price });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error saving transaction:', error.message);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/transactions', async (req, res) =>{
    const transactions = await Transaction.find();
    res.json(transactions);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
