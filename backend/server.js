const express = require("express");
const { errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const PORT = process.env.PORT || 6000;
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/balance", require("./routes/balanceRoutes"));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
