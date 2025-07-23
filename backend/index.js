const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const setupSocketIO = require("./socket/socket");

dotenv.config();
const app = express();
const server = http.createServer(app);


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Error:", err));


app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());


app.use("/api/user", require("./routes/auth"));

setupSocketIO(server);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
