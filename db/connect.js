const mongoose = require("mongoose");

mongoose
  .connect(process.env.URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`🟢 [database] DB connected in ${process.env.NODE_ENV} mode`))
  .catch((err) => console.log(`🔴 DB connection faild" in ${process.env.NODE_ENV} mode\n`, err));