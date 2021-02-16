const express = require("express");
const router = express.Router();

const {
  getMemosController,
  getMemoByUserController,
  createMemoController,
  updateMemoController,
  deleteMemoController,
} = require("../controllers/memory.controller");

router.get("/", getMemosController);
router.get("/:userId", getMemoByUserController);
router.post("/post", createMemoController);
router.put("/update", updateMemoController);
router.delete("/delete", deleteMemoController);

module.exports = router;
