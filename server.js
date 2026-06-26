const express = require("express");
const Groq = require("groq-sdk");
const multer = require("multer");
const path = require("path");

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// ─── PUT YOUR GROQ API KEY HERE ───────────────────────────────────────────────
const GROQ_API_KEY = "your groq api key goes here.";
// ──────────────────────────────────────────────────────────────────────────────

const groq = new Groq({ apiKey: GROQ_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Translate plain text
app.post("/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ error: "Missing text or targetLanguage" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the user's text into ${targetLanguage}. 
Output ONLY the translated text. No explanations, no notes, no preamble. Just the translation.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    });

    const translation = completion.choices[0]?.message?.content || "";
    res.json({ translation });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Translate uploaded .txt file
app.post("/translate-file", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const targetLanguage = req.body.targetLanguage;
  if (!targetLanguage) return res.status(400).json({ error: "Missing targetLanguage" });

  const ext = path.extname(req.file.originalname).toLowerCase();
  if (ext !== ".txt") {
    return res.status(400).json({ error: "Only .txt files are supported for now" });
  }

  const text = req.file.buffer.toString("utf-8");
  if (!text.trim()) return res.status(400).json({ error: "File is empty" });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the user's text into ${targetLanguage}. 
Output ONLY the translated text. No explanations, no notes, no preamble. Just the translation.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    });

    const translation = completion.choices[0]?.message?.content || "";
    res.json({ translation });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Translator running at http://localhost:${PORT}`);
});
