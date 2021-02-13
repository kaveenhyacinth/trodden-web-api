const mongoose = require("mongoose");

mongoose
  .connect(process.env.URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("🟢 [database] DB connected"))
  .catch((err) => console.log("🔴 DB connection faild", err));