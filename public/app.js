let currentOutput = "";
let uploadedFile = null;
let activeTab = "paste";

// ── Tab switching ────────────────────────────────────────────────────────────

function switchTab(tab) {
  activeTab = tab;
  document.getElementById("tabPaste").classList.toggle("active", tab === "paste");
  document.getElementById("tabUpload").classList.toggle("active", tab === "upload");
  document.getElementById("pasteArea").style.display = tab === "paste" ? "flex" : "none";
  document.getElementById("uploadArea").style.display = tab === "upload" ? "block" : "none";

  // Fix: pasteArea is flex column to fill panel
  if (tab === "paste") {
    document.getElementById("pasteArea").style.flexDirection = "column";
    document.getElementById("pasteArea").style.flex = "1";
  }
}

// ── Char count ───────────────────────────────────────────────────────────────

function updateCharCount() {
  const len = document.getElementById("inputText").value.length;
  document.getElementById("charCount").textContent = len.toLocaleString() + " chars";
}

// ── Clear ────────────────────────────────────────────────────────────────────

function clearInput() {
  document.getElementById("inputText").value = "";
  updateCharCount();
  resetOutput();
}

function clearFile() {
  uploadedFile = null;
  document.getElementById("fileInput").value = "";
  document.getElementById("fileInfo").style.display = "none";
  document.getElementById("dropZone").style.display = "flex";
  resetOutput();
}

function resetOutput() {
  currentOutput = "";
  document.getElementById("placeholder").style.display = "flex";
  document.getElementById("outputText").style.display = "none";
  document.getElementById("outputText").textContent = "";
  document.getElementById("loadingState").style.display = "none";
  document.getElementById("outputLangLabel").textContent = "Translation";
}

// ── File handling ─────────────────────────────────────────────────────────────

function onDragOver(e) {
  e.preventDefault();
  document.getElementById("dropZone").classList.add("drag-over");
}

function onDragLeave(e) {
  document.getElementById("dropZone").classList.remove("drag-over");
}

function onDrop(e) {
  e.preventDefault();
  onDragLeave(e);
  const file = e.dataTransfer.files[0];
  if (file) setFile(file);
}

function handleFileInput(e) {
  const file = e.target.files[0];
  if (file) setFile(file);
}

function setFile(file) {
  if (!file.name.endsWith(".txt")) {
    showToast("Only .txt files are supported");
    return;
  }
  uploadedFile = file;
  document.getElementById("fileName").textContent = file.name;
  document.getElementById("fileInfo").style.display = "flex";
  document.getElementById("dropZone").style.display = "none";
}

// ── Translate ─────────────────────────────────────────────────────────────────

async function runTranslate() {
  const lang = document.getElementById("targetLang").value;
  if (!lang) { showToast("Select a target language first"); return; }

  const isUpload = activeTab === "upload";

  if (isUpload && !uploadedFile) {
    showToast("Upload a .txt file first");
    return;
  }

  if (!isUpload) {
    const text = document.getElementById("inputText").value.trim();
    if (!text) { showToast("Enter some text to translate"); return; }
  }

  setLoading(true);
  document.getElementById("outputLangLabel").textContent = lang;

  try {
    let response;

    if (isUpload) {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("targetLanguage", lang);
      response = await fetch("/translate-file", { method: "POST", body: formData });
    } else {
      const text = document.getElementById("inputText").value.trim();
      response = await fetch("/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage: lang }),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      showToast("Error: " + (data.error || "Something went wrong"));
      setLoading(false);
      return;
    }

    currentOutput = data.translation || "";
    showOutput(currentOutput);
  } catch (err) {
    showToast("Network error — is the server running?");
    console.error(err);
  }

  setLoading(false);
}

function showOutput(text) {
  document.getElementById("placeholder").style.display = "none";
  document.getElementById("loadingState").style.display = "none";
  const el = document.getElementById("outputText");
  el.textContent = text;
  el.style.display = "block";
}

function setLoading(on) {
  document.getElementById("translateBtn").disabled = on;
  document.getElementById("placeholder").style.display = on ? "none" : (currentOutput ? "none" : "flex");
  document.getElementById("loadingState").style.display = on ? "flex" : "none";
  if (!on && currentOutput) showOutput(currentOutput);
}

// ── Copy & Download ──────────────────────────────────────────────────────────

function copyOutput() {
  if (!currentOutput) { showToast("Nothing to copy yet"); return; }
  navigator.clipboard.writeText(currentOutput).then(() => showToast("Copied to clipboard"));
}

function downloadOutput() {
  if (!currentOutput) { showToast("Nothing to download yet"); return; }
  const lang = document.getElementById("targetLang").value || "translation";
  const blob = new Blob([currentOutput], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `translation-${lang.toLowerCase().replace(/\s+/g, "-")}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── Toast ────────────────────────────────────────────────────────────────────

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(t._timer);
  t._timer = setTimeout(() => (t.style.display = "none"), 2800);
}

// ── Init ─────────────────────────────────────────────────────────────────────
switchTab("paste");
