# 🌿 Farm2Ayur

### From Farm to Ayurveda — Verified, Traceable & Trusted

Farm2Ayur is a technology-driven platform connecting **medicinal plant farmers with the Ayurvedic ecosystem**. It aims to improve trust and transparency by combining **AI-based medicinal plant identification, location-based farm information, and blockchain-backed traceability**.

---

## 🎯 Project Overview

Medicinal plants often pass through multiple stages before reaching Ayurvedic businesses and consumers. During this journey, it can be difficult to verify the **origin, authenticity, quality, and handling history** of the plants.

Farm2Ayur addresses this gap by creating a transparent digital journey from **farmer → medicinal plant → verification → Ayurvedic ecosystem**, helping build trust between stakeholders.

---

## ✨ Key Features

- 🌱 **Medicinal Plant Identification** — AI/ML-based identification of medicinal plants from images.
- 🤖 **AI-Powered Verification** — Supports plant verification workflows and aims to improve identification confidence.
- 📍 **Farm & Location Mapping** — Connects medicinal plants with their source location. *(Integration remains in progress.)*
- 🔗 **Blockchain Traceability** — Anchors a batch identifier and cryptographic data hash to the HerbTrace smart contract on Polygon Amoy and supports checking whether the anchored data has changed.
- 🧾 **Digital Certification** — AI-based certification functionality is planned and remains in progress.
- 👨‍🌾 **Farmer Information** — Supports source and cultivation details in the traceability workflow.
- 🌿 **Farm-to-Ayurveda Tracking** — Aims to improve transparency across the supply chain as the remaining modules are integrated.

---

## 🛠️ Technology Stack

| **Layer** | **Technologies** |
|---|---|
| 🎨 Frontend | HTML, CSS, JavaScript, Vite |
| 🤖 AI / ML | Python, Machine Learning / Computer Vision, medicinal-plant dataset |
| ⚙️ Backend | Python, FastAPI, Uvicorn |
| 🗄️ Database & Integrity | Application database, structured batch records, SHA-256 hashing |
| 📍 Maps | Mapping and geolocation services *(integration in progress)* |
| 🔗 Blockchain | Solidity, Hardhat, HerbTrace smart contract, Polygon Amoy testnet |
| 🧰 Development | Git, GitHub, VS Code |

> The technology stack will continue to evolve as the remaining modules are integrated.

---

## 🔄 How Farm2Ayur Works

```text
👨‍🌾 Farmer
     ↓
🌱 Medicinal Plant / Batch
     ↓
🤖 AI Identification & Verification
     ↓
📍 Source / Farm Location
     ↓
🧾 Certification Workflow
     ↓
🔗 Blockchain Hash Anchor
     ↓
🌿 Ayurvedic Ecosystem
```

This represents the intended end-to-end journey. Blockchain anchoring and hash verification have been demonstrated for a test batch; the complete frontend-connected journey and remaining modules are still being integrated.

---

## 🔗 Blockchain Traceability

Farm2Ayur's **HerbTrace smart contract** has been deployed to the Polygon Amoy testnet. Backend integration has been manually demonstrated by anchoring a batch hash and verifying that the on-chain hash matches the local batch data.

The blockchain stores the batch identifier and a cryptographic hash, **not the full batch record**. The backend uses the hash to check whether the anchored data has changed.

> **Important:** Polygon Amoy is a test network. Mock/local anchoring may also be used in development, so check the API response and network details to distinguish a local record from a confirmed on-chain transaction.

---

## 👥 Team

| **Team Member** | **Role** |
|---|---|
| **Anudeep. Y** | AI/ML & Project Development |
| **N. Narasimha Rao** | Frontend Development |
| **K. Karthik Varma** | Backend & Database |
| **U. Varshitha** | Blockchain Development |
| **U. Varun** | UI/UX & Documentation |
| **K. Venkat** | Cybersecurity & Blockchain |

> Team roles are divided according to the major components of the Farm2Ayur system.

---

## 🚀 Project Status

Farm2Ayur is currently under active development.

### ✅ Completed / Demonstrated

- Frontend foundation
- Medicinal-plant dataset and ongoing AI/ML model development
- Backend batch and verification workflows
- SHA-256-based batch integrity checking
- HerbTrace smart contract deployed to Polygon Amoy
- Backend blockchain anchoring and on-chain hash verification demonstrated for a test batch
- Automated contract and backend tests reported, alongside a manual testnet demonstration

### 🚧 Remaining / In Progress

- 📍 Complete and integrate the maps and location module
- 🧾 Complete AI-based certification functionality
- 🔌 Finish frontend–backend integration and test the complete user journey through the UI
- 🔄 Complete and validate end-to-end traceability across all project modules
- 🤖 Continue validating and integrating AI/ML predictions with the application

> **Testing note:** Automated tests and a manual testnet demonstration are different types of evidence. The complete application flow should be tested again after frontend–backend integration.

---

## 🌍 Vision

**Farm2Ayur aims to make the medicinal plant supply chain more transparent, verifiable and trustworthy — starting from the farmer and extending to the Ayurvedic ecosystem.**

---

## 📌 Project

**Farm2Ayur**  
Built for innovation in **AI, Agriculture, Ayurveda & Blockchain**.

---

## 💻 Run Farm2Ayur Locally

Run the backend and frontend in **separate terminals**. You need Python, Node.js, and npm installed.

### 1. Clone the Repository

```bash
git clone https://github.com/varunurugonda253-aiml/Farm2Ayur.git
cd Farm2Ayur
```

### 2. Start the Backend (FastAPI)

Navigate to the backend directory containing `requirements.txt` and the `app/` package. In the common repository layout:

```bash
cd backend
```

Create and activate a Python virtual environment.

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**

```bat
python -m venv .venv
.venv\Scripts\activate.bat
```

**macOS / Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies and start the API:

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Open the API documentation:

**http://127.0.0.1:8000/docs**

If `requirements.txt` or `app/main.py` is not located directly inside `backend/`, navigate to the directory where those files actually exist before running the commands.

Configure the required database and blockchain settings in a local `.env` file if your setup requires them. Real Polygon Amoy transactions require valid chain configuration and testnet funds.

**Never commit `.env` files, private keys, keystore files, or credentials to GitHub.**

### 3. Start the Frontend (Vite)

Open a **second terminal** at the repository root — the directory containing `package.json`.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal. It is commonly:

**http://localhost:5173**

### 4. Local Run Checklist

- Backend API documentation opens at `http://127.0.0.1:8000/docs`.
- Frontend opens at the URL shown by Vite.
- Backend environment variables and database configuration are set correctly.
- Blockchain testing uses the intended mode: mock/local or real Polygon Amoy.
