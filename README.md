# translr — AI Text Translator

A fast, no-frills web app for translating English text into 40+ languages, powered by [Groq](https://groq.com)'s LPU inference and Llama 3.3 70B. Paste text directly or upload a `.txt` file — get a clean translation back in seconds.

![Node](https://img.shields.io/badge/node-%3E%3D18-339933)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- Translate pasted text or uploaded `.txt` files
- 40+ target languages
- Copy or download the translated output
- Dark, distraction-free interface
- Lightweight Express backend — your API key never touches the browser

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no framework, no build step)
- **Backend:** Node.js + Express
- **AI Inference:** [Groq API](https://console.groq.com) running `llama-3.3-70b-versatile`

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- A free Groq API key — get one at [console.groq.com](https://console.groq.com)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/translator-app.git
   cd translator-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment variables

   Copy the example file and add your real key:
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and replace the placeholder:
   ```
   GROQ_API_KEY=your_actual_groq_key_here
   ```

4. Start the server
   ```bash
   node server.js
   ```

5. Open your browser to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
translator-app/
├── server.js          # Express backend — handles Groq API calls
├── package.json
├── .env.example        # Template for required environment variables
├── .gitignore
└── public/
    ├── index.html       # Markup
    ├── style.css        # Styling
    └── app.js            # Frontend logic (tabs, upload, translate, copy/download)
```

## How It Works

1. User pastes text or uploads a `.txt` file in the browser
2. Frontend sends the content to the Express backend (`/translate` or `/translate-file`)
3. Backend calls the Groq API with the text and target language
4. Translated text is returned and displayed, with options to copy or download

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com | Yes |

## Known Limitations

- Only `.txt` file uploads are supported (no PDF parsing yet)
- Long documents may exceed the model's output token limit (4096 tokens)
- Groq's free tier has daily rate limits — see [Groq's rate limit docs](https://console.groq.com/docs/rate-limits) for current numbers

## License

MIT — free to use, modify, and distribute.

## Acknowledgments

Built with [Groq](https://groq.com)'s ultra-fast inference API.
# translr — AI Text Translator

A fast, no-frills web app for translating English text into 40+ languages, powered by [Groq](https://groq.com)'s LPU inference and Llama 3.3 70B. Paste text directly or upload a `.txt` file — get a clean translation back in seconds.

![Node](https://img.shields.io/badge/node-%3E%3D18-339933)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- Translate pasted text or uploaded `.txt` files
- 40+ target languages
- Copy or download the translated output
- Dark, distraction-free interface
- Lightweight Express backend — your API key never touches the browser

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no framework, no build step)
- **Backend:** Node.js + Express
- **AI Inference:** [Groq API](https://console.groq.com) running `llama-3.3-70b-versatile`

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- A free Groq API key — get one at [console.groq.com](https://console.groq.com)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/translator-app.git
   cd translator-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment variables

   Copy the example file and add your real key:
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and replace the placeholder:
   ```
   GROQ_API_KEY=your_actual_groq_key_here
   ```

4. Start the server
   ```bash
   node server.js
   ```

5. Open your browser to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
translator-app/
├── server.js          # Express backend — handles Groq API calls
├── package.json
├── .env.example        # Template for required environment variables
├── .gitignore
└── public/
    ├── index.html       # Markup
    ├── style.css        # Styling
    └── app.js            # Frontend logic (tabs, upload, translate, copy/download)
```

## How It Works

1. User pastes text or uploads a `.txt` file in the browser
2. Frontend sends the content to the Express backend (`/translate` or `/translate-file`)
3. Backend calls the Groq API with the text and target language
4. Translated text is returned and displayed, with options to copy or download

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com | Yes |

## Known Limitations

- Only `.txt` file uploads are supported (no PDF parsing yet)
- Long documents may exceed the model's output token limit (4096 tokens)
- Groq's free tier has daily rate limits — see [Groq's rate limit docs](https://console.groq.com/docs/rate-limits) for current numbers

## License

MIT — free to use, modify, and distribute.

## Acknowledgments

Built with [Groq](https://groq.com)'s ultra-fast inference API.
