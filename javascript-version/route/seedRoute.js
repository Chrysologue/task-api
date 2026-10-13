import express from "express";
const router = express();
import createTable from "../seed/creadTable.js";

router.get("/seed", async (req, res) => {
  try {
    await createTable();
    return res.status(200).json({ message: "Tables are successfully created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
