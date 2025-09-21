// server.js
// Run: node server.js
// Requires: npm install express mongoose cors bcryptjs jsonwebtoken nodemailer stripe body-parser dotenv

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Stripe = require("stripe");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Stripe Initialization (Secret key from .env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- Models ---
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [String],
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  totalPrice: Number,
  customerName: String,
  customerEmail: String,
  customerAddress: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

// --- Middleware ---
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// --- Nodemailer setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- Routes ---

// Admin login
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH
  );
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// Admin add product
app.post("/api/admin/products", authMiddleware, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin update product
app.put("/api/admin/products/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin delete product
app.delete("/api/admin/products/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin get orders
app.get("/api/admin/orders", authMiddleware, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Public get all products
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Public get featured products
app.get("/api/products/featured", async (req, res) => {
  const featured = await Product.find({ featured: true });
  res.json(featured);
});

// Public get product by id
app.get("/api/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// Create order
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Send email notification to admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Order Received",
      text: `New order from ${order.customerName} (${order.customerEmail}).\nOrder details: ${JSON.stringify(
        order.products,
        null,
        2
      )}\nTotal Price: $${order.totalPrice}\nAddress: ${order.customerAddress}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error(error);
      else console.log("Email sent: " + info.response);
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Contact form
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: "All fields required" });

  const mailOptions = {
    from: email,
    to: process.env.ADMIN_EMAIL,
    subject: `Contact Form Message from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).json({ message: "Failed to send email" });
    res.json({ message: "Message sent successfully" });
  });
});

// Stripe payment intent
// app.post('/api/create-payment-intent', async (req, res) => {
//   const { amount } = req.body; // amount in cents
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'usd',
//     });
//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// --- Serve React frontend ---
app.use(express.static(path.join(__dirname, "../frontend/build")));

// ✅ Fixed catch-all route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
