import express from "express";
import cors from "cors";
import "dotenv/config";
import flashcardsRouter from "./routes/flashcards.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/flashcards", flashcardsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FlashMind backend running on http://localhost:${PORT}`);
});
