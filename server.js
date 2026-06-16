require("dotenv").config();
const express = require("express");
const Groq = require("groq-sdk");
const multer = require("multer");
const path = require("path");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error("ERROR: No Groq API key set. Create a .env file with GROQ_API_KEY=your_key_here");
  console.error("Get a key at https://console.groq.com");
  process.exit(1);
}

const groq = new Groq({ apiKey: GROQ_API_KEY });
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function callGroq(text, targetLanguage) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a professional translator. Translate the user's text into ${targetLanguage}. Output ONLY the translated text. No explanations, no notes, no preamble. Just the translation.`,
      },
      { role: "user", content: text },
    ],
    temperature: 0.2,
    max_tokens: 4096,
  });
  return completion.choices[0]?.message?.content || "";
}

app.post("/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;
  if (!text || !targetLanguage) {
    return res.status(400).json({ error: "Missing text or targetLanguage" });
  }
  try {
    const translation = await callGroq(text, targetLanguage);
    console.log(`[OK] Translated to ${targetLanguage} (${text.length} chars)`);
    res.json({ translation });
  } catch (err) {
    console.error("[FAIL]", err.status, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/translate-file", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const { targetLanguage } = req.body;
  if (!targetLanguage) return res.status(400).json({ error: "Missing targetLanguage" });
  if (!req.file.originalname.endsWith(".txt")) {
    return res.status(400).json({ error: "Only .txt files are supported" });
  }
  const text = req.file.buffer.toString("utf-8").trim();
  if (!text) return res.status(400).json({ error: "File is empty" });

  try {
    const translation = await callGroq(text, targetLanguage);
    console.log(`[OK] Translated file to ${targetLanguage} (${text.length} chars)`);
    res.json({ translation });
  } catch (err) {
    console.error("[FAIL]", err.status, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Translator running at http://localhost:3000");
});
