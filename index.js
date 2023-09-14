const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8081;

//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//model
const userModel = mongoose.model("user", userSchema);
//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

//sign up
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  userModel.findOne({ email: email }, (err, result) => {
    console.log(result);
    console.log(err);
    if (result) {
      res.send({ message: "Email id is already register", alert: false });
    } else {
      const data = userModel(req.body);
      const save = data.save();
      res.send({ message: "Successfully Sign Up...!", alert: true });
    }
  });
});

//api login
app.post("/login", (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  userModel.findOne({ email: email }, (err, result) => {
    if (result) {
      if (password === result.password) {
        const dataSend = {
          _id: result._id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          password: result.password,
          image: result.image,
        };
        res.send({
          message: "Login is successfully",
          alert: true,
          data: dataSend,
        });
      } else {
        res.send({
          message: "Password is invalid",
          alert: false,
        });
      }
    } else {
      //cheque email
      res.send({
        message: "Email is not available, please sign up",
        alert: false,
      });
    }
  });
});
//app.use(require("./routes/productRoute.js"));

//product section

const schemaProduct = mongoose.Schema({
  model: String,
  brand: String,
  image: String,
  price: String,
});
const productModel = mongoose.model("product", schemaProduct);

//save product in data
//api
app.post("/uploadProduct", async (req, res) => {
  // console.log(req.body)
  const data = await productModel(req.body);
  const datasave = await data.save();
  res.send({ message: "Upload successfully" });
});

app.get("/product", async (req, res) => {
  const data = await productModel.find({});
  res.send(JSON.stringify(data));
});

//server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
