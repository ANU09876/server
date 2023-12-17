// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/testingdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
const enrollmentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  selectedBatch: String,
  enrollmentDate: { type: Date, index: true },
  fees: Number, // Corrected field name
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema, 'enrollments', {
  bufferCommands: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/create', async (req, res) => {
  console.log('Api started');
  const { name, age, selectedBatch, fees } = req.body;

  console.log(req.body);

  // Basic server-side validation
  if (age < 18 || age > 65) {
    return res.status(400).json({ error: 'Age must be between 18 and 65.' });
  }

  // Simulate storing data in the database
  // You'd normally use a database like MongoDB, MySQL, etc.
  const enrollmentData = new Enrollment({
    name,
    age,
    selectedBatch,
    fees, // Corrected field name
    enrollmentDate: new Date(),
  });

  // Simulate calling the payment function
  const savedEnrollment = await enrollmentData.save();
  const paymentResponse = CompletePayment(savedEnrollment);

  // Handle the payment response and return it to the frontend
  if (paymentResponse.success) {
    return res.status(200).json({ message: 'Enrollment successful!', paymentResponse });
  } else {
    return res.status(500).json({ error: 'Payment failed.', paymentResponse });
  }
});

// Mock payment function
function CompletePayment(userDetails) {
  // Your payment logic goes here (mocked for this example)
  return { success: true, transactionId: '123456' };
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
