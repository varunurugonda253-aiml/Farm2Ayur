# 🌿 Farm2Ayur — Product Requirements Document

> **"From Soil to Synergy"** — An end-to-end digital provenance, AI plant identification, and cryptographic transparency platform for the Ayurvedic medicinal herb supply chain.

---

### 📋 Project Metadata

| Attribute | Details | Attribute | Details |
| :--- | :--- | :--- | :--- |
| **Product Name** | **Farm2Ayur** | **Current Stage** | 🟡 Prototype (v1.0) |
| **Domain** | Ayurvedic Traceability & AgTech | **Core Tech** | FastAPI · Vite · MobileNetV2 · SHA-256 · Web3 |
| **Target Users** | Harvesters, Verifiers, Consumers, Admins | **Integrity Model** | Local Hash-Chain Ledger + Polygon Amoy Testnet |

---

## 1. Product Overview

**Farm2Ayur** is a digital provenance and plant identification platform designed to bring transparency, authenticity, and accountability to the Ayurvedic medicinal herb supply chain.

The platform combines AI-assisted plant identification, digital batch management, quality verification, QR-based tracking, and cryptographic integrity checks. Its backend provides APIs for these capabilities, while several frontend interfaces still use demonstration data and require integration with live backend services.

Farm2Ayur also demonstrates blockchain-based batch integrity verification through the HerbTrace smart contract deployed on Polygon Amoy Testnet.

---

## 2. Problem Statement

The growing demand for natural wellness products exposes critical challenges in traditional herbal supply chains:

| # | Challenge | Supply Chain Impact |
| :-: | :--- | :--- |
| **1** | **No Farm-to-Consumer Traceability** | Consumers lack visibility into grower identity, geographical origin (*Desha*), and harvest season (*Ritu*). |
| **2** | **Species Substitution & Adulteration** | Incorrect plant identification can affect raw-material quality and potentially introduce unsafe substitutions. |
| **3** | **Vulnerable Paper-Based Assurances** | Certificates of Analysis (COAs) and other documents may be lost, misplaced, or modified without an effective integrity check. |
| **4** | **Consumer Information Disconnect** | Buyers lack convenient access to batch history, verification status, and contextual Ayurvedic information. |

---

## 3. Product Vision & Goals

> ### 🎯 Product Vision
> To establish a trustworthy and traceable journey from the soil of the cultivator to the daily remedy of the consumer.

### Key Goals

- **Verifiable Provenance:** Maintain digital batch records that connect herb collection, processing, and verification information.
- **Democratized AI Vision:** Support plant identification for five configured medicinal plant classes using MobileNetV2.
- **Heritage & Scientific Rigor:** Connect available Ayurvedic knowledge and verification evidence with digital batch records.
- **Practical Transparency:** Detect changes to recorded data using SHA-256 integrity checks and demonstrate blockchain anchoring on a public test network.
- **Connected Experience:** Integrate frontend interfaces with live backend APIs to provide a complete user journey.

---

## 4. Target Users

| Persona | Role Key | Primary Goals & Responsibilities |
| :--- | :--- | :--- |
| **👤 End Consumer & Enthusiast** | `user` / Public | Access available plant information, scan batch QR codes, and inspect public traceability details. |
| **🧑‍🌾 Herb Harvester & Collector** | `collector` | Register herb batches, record available collection information, and generate batch QR codes. |
| **🔬 Quality Verifier & Lab Analyst** | `verifier` | Review batch information, record verification decisions, and work with associated evidence. |
| **🛡️ Platform Administrator** | `admin` | Manage authorized platform operations and access restricted administrative functions. |

---

## 5. Core Features

| 🌿 **AI Plant Identification** | 📦 **Batch Lifecycle Tracking** |
| :--- | :--- |
| MobileNetV2-based backend identification for five configured species: *Amla, Ashwagandha, Guduchi, Neem,* and *Tulsi*. A filename-based fallback exists when model inference is unavailable. | Backend APIs support batch registration, retrieval, status updates, event records, and QR generation. The intended lifecycle includes *Harvested, Processed, Quality Tested, In Transit,* and *Delivered*. |
| **Status:** ⚠️ Backend implemented; frontend integration pending | **Status:** ⚠️ Backend implemented; complete workflow integration pending |

| 📱 **QR-Based Instant Access** | 🔗 **Tamper-Evident Ledger** |
| :--- | :--- |
| Backend support generates downloadable QR codes and provides batch lookup. The complete frontend tracking journey still needs to use live backend data instead of demonstration records. | SHA-256 hashing, a local hash-chain ledger, and integrity-verification endpoints detect inconsistencies. Approved batch records can also be anchored to the HerbTrace smart contract on Polygon Amoy Testnet. |
| **Status:** ⚠️ Backend implemented; frontend integration pending | **Status:** ✅ Local ledger implemented; testnet anchoring demonstrated |

| 🧪 **Quality & COA Verification** | 💬 **Ayurvedic Knowledge Assistant** |
| :--- | :--- |
| Backend verification workflows record approval decisions and can trigger blockchain anchoring. An upload API exists, but the complete verifier interface and COA workflow are not yet confirmed as integrated. | A basic backend assistant uses keyword matching and templated responses from available herb records and knowledge documents. A full vector-based or generative RAG implementation is not currently established. |
| **Status:** ⚠️ Backend capabilities available; complete workflow pending | **Status:** ⚠️ Basic backend implemented; frontend integration pending |

---

## 6. How Farm2Ayur Works

Farm2Ayur is designed to connect herb collectors, verifiers, and consumers through a structured traceability workflow.

```mermaid
flowchart LR
    A[🧑‍🌾 Harvester / Collector] -->|1. Identifies Plant| B(🌿 AI Leaf Scanner)
    B -->|2. Registers Batch| C(📋 Batch Registration)
    C -->|3. Reviews Evidence| D(🔬 Quality Verification)
    D -->|4. Records Integrity Reference| E(🔗 Traceability Ledger)
    E -->|5. Scans QR Code| F[👤 Consumer Verification]
```

1. **Identification:** The backend supports image-based identification of five configured medicinal plant classes.
2. **Registration:** Collectors can register batches and generate batch-specific QR codes through backend APIs.
3. **Verification:** Authorized users can record verification decisions and work with associated batch evidence.
4. **Traceability:** The local ledger supports SHA-256 hash-chain checks, and approved batch records can be anchored to Polygon Amoy Testnet. The current workflow does not independently anchor every lifecycle milestone.
5. **Consumer Access:** Consumers can use a batch code or QR reference to access available public tracking information.

**Integration Note:** Several frontend components currently use hardcoded demonstration data. Connecting the complete journey to live backend APIs remains a key development milestone.

---

## 7. Technology Overview

Farm2Ayur uses a decoupled frontend and backend architecture with a local integrity ledger and optional external blockchain integration.

| Subsystem | Technology Stack | Purpose & Implementation |
| :--- | :--- | :--- |
| **Frontend** | Vite · Vanilla HTML5 / CSS / JavaScript ES Modules | Browser-based interfaces for scanning, batch information, and user interactions. Live API integration remains incomplete in several areas. |
| **Backend API** | Python · FastAPI · SQLAlchemy | REST APIs for authentication, batch operations, uploads, scanning, verification, and the knowledge assistant. |
| **Database** | SQLite / PostgreSQL | Structured persistence for application records, including batches, events, and verification data. |
| **AI Vision Engine** | TensorFlow / Keras · MobileNetV2 | 224×224 image-classification pipeline for five configured plant species, with a filename-based fallback. |
| **Integrity Layer** | SHA-256 Hash Chaining | Local hash-chain ledger and integrity-verification operations. |
| **Blockchain Layer** | Web3.py · HerbTrace Smart Contract | Anchoring and verification of batch integrity references on Polygon Amoy Testnet, with mock-chain fallback support. |

**Blockchain Deployment:** Polygon Amoy Testnet · Chain ID `80002`

**Contract Address:** `0x69ce77ef7Fb9AbC100D5FAd402EC24E87434bC6b`

**Contract Explorer:** https://amoy.polygonscan.com/address/0x69ce77ef7Fb9AbC100D5FAd402EC24E87434bC6b

**Example Transaction:** https://amoy.polygonscan.com/tx/0xaaf79278cd3343d0145b45967e6e716a5abf965bdf8b1a3cb8e929323ff11cd3

---

## 8. Current Project Status

| Capability Area | Implementation Details | Status |
| :--- | :--- | :---: |
| **AI Plant Identification** | Backend MobileNetV2 pipeline for five configured species with a fallback mechanism | ⚠️ Backend implemented |
| **User & Access Control** | JWT authentication and role-aware backend access controls | ✅ Backend implemented |
| **Batch Lifecycle Tracking** | Batch creation, retrieval, event records, status operations, and QR generation | ⚠️ Backend implemented; integration pending |
| **Quality & COA Management** | Verification-decision workflows and document-upload endpoint | ⚠️ Backend capabilities available; complete workflow pending |
| **Cryptographic Provenance** | SHA-256 local hash-chain ledger and integrity-verification endpoints | ✅ Implemented |
| **Blockchain Anchoring** | HerbTrace contract deployed on Polygon Amoy; successful anchoring demonstration | ✅ Testnet demonstrated |
| **Blockchain Fallback** | Local mock-chain records can be created when real blockchain anchoring is unavailable or disabled | ✅ Implemented |
| **Ayurvedic Knowledge Assistant** | Keyword-based matching and templated responses using available knowledge records | ⚠️ Basic backend implemented |
| **Frontend–Backend Integration** | Several inspected frontend modules still use hardcoded demonstration data | 🔵 In Progress |
| **Maps & Geographic Visualization** | Map-based presentation of collection and traceability information | 🔵 Planned |
| **AI-Assisted Certification** | Additional AI support for the evidence and certification workflow | 🔵 Planned |
| **Multi-Herb Formulations** | Traceability for composite formulations such as *Chyawanprash* | 🔵 Planned |
| **Production Blockchain Deployment** | Evaluation of production-network deployment and operations | 🔵 Planned |

**Status Clarification:** Backend implementation, successful testnet demonstration, frontend integration, and production readiness are separate milestones. A blockchain mock record is not equivalent to a real on-chain transaction, and a successful hash check does not independently prove that the original real-world information is truthful.

---

## 9. Future Scope

- **🔵 Frontend–Backend Integration:** Connect the scanner, authentication, batch tracking, QR lookup, verification, and integrity-status interfaces to live APIs.
- **🔵 Maps & Geographic Traceability:** Add map-based visualization when collection-location data and access requirements are defined.
- **🔵 AI-Assisted Certification:** Explore AI support for reviewing evidence while retaining explicit, authorized verification decisions.
- **🔵 Continuous Model Expansion:** Expand plant classes and evaluate model accuracy, confidence handling, and controlled retraining.
- **🔵 Advanced Ayurvedic Assistant:** Evaluate improved retrieval methods and additional validated knowledge sources.
- **🔵 IoT & Cold Chain Integration:** Explore temperature and humidity monitoring during transportation.
- **🔵 Milestone-Level Blockchain Anchoring:** Evaluate whether each lifecycle transition should receive an independent integrity reference.
- **🔵 Production Blockchain Deployment:** Assess network costs, security, monitoring, and operational requirements beyond testnet.
- **🔵 Formulation Traceability:** Extend the system from individual herbs to composite, multi-ingredient Ayurvedic formulations.

