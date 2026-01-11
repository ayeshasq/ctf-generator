# 🛡️ AI CTF Challenge Generator

Generate dynamic **Capture-The-Flag (CTF)** cybersecurity challenges using a modern web UI and a serverless backend.

🌐 **Live Demo:** https://ctf-generator.vercel.app

---

## 🚀 Overview

The **AI CTF Challenge Generator** is a full-stack web application that dynamically generates cybersecurity CTF challenges across multiple domains such as **Web Exploitation, Cryptography, Forensics, OSINT, and Network Analysis**.

The platform is designed for:

- 🎓 Cybersecurity students  
- 🏁 CTF practice & learning  
- 🧪 Hands-on security training  
- 💼 Portfolio demonstration  

Users can generate challenges, analyze detailed storylines and artifacts, and submit flags in a realistic **CTF-style workflow**.

---

## ✨ Features

- 🎯 Dynamic challenge generation (via API)
- 🧠 Multiple categories & difficulty levels
- 🚩 Interactive flag submission system
- 📊 Automatic scoring based on difficulty
- 🔢 Attempt limits with challenge locking
- 💡 Progressive hints system
- 🎨 Modern responsive UI (React)
- ☁️ Serverless backend (Vercel API Routes)

---

## 🧩 Challenge Categories

- 🕷️ **Web Exploitation**
- 🔐 **Cryptography**
- 🔍 **Forensics**
- 🌐 **Network Analysis**
- 🧠 **OSINT**
- 🎲 **Randomized Challenges**

Each category includes **Easy / Medium / Hard** challenges with:

- 📖 Detailed storyline  
- 🎯 Clear mission objective  
- 📋 Step-by-step guidance  
- 📦 Simulated artifacts (logs, JS files, configs, hashes, memory dumps)  
- 🚩 CTF-style flags  
- 📚 Source attribution (TryHackMe, OWASP, DFIR labs)

---

## 🛠️ Tech Stack

### Frontend
- React (CDN-based)
- JavaScript (ES6)
- HTML5
- CSS / Tailwind-style utility classes

### Backend
- Vercel Serverless Functions
- Node.js
- REST API (`/api/generate`)

---


---

## ⚙️ How It Works

1. User selects **Category** and **Difficulty**
2. Frontend calls `/api/generate`
3. Backend returns a structured CTF challenge:
   - Story
   - Mission
   - Steps
   - Artifacts
   - Flag
4. User analyzes the challenge
5. Flag submission is validated
6. Score and attempts are tracked in real time

---

## 🧪 Example Challenge Structure

Each challenge includes:

- 📖 **Story** – realistic attack scenario  
- 🎯 **Mission** – what the user must achieve  
- 📋 **Step-by-step guide** – clear learning path  
- 📦 **Provided artifact** – logs, JS, hashes, memory, etc.  
- 🚩 **Flag** – CTF-style solution  
- 📚 **Source attribution** – inspired by trusted platforms  

---

## 🔒 Disclaimer

This project is for **educational purposes only**.  
All challenges are **simulated** and **do not target real systems**.

---

## 🧠 Inspiration & Learning Sources

- TryHackMe
- OWASP Top 10
- Hack The Box (conceptual)
- SANS DFIR Labs
- Real-world security incidents

---

## 📌 Future Enhancements

- 🌍 Global leaderboard
- 👤 User authentication
- 🏆 Achievements & badges
- 📈 Analytics dashboard
- 🧩 Custom challenge builder
- 🤖 AI-powered challenge variations

---

