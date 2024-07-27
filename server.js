const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://nanicherry2312:90534Thani12345@cluster0.hse5iwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('OfficeTransaction', transactionSchema);

// Routes
app.get('/transactions', async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json(transactions);
});

app.post('/transactions', async (req, res) => {
  const { type, amount, description } = req.body;
  const newTransaction = new Transaction({ type, amount, description });
  await newTransaction.save();
  res.json(newTransaction);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
