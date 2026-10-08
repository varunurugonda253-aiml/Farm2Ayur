# 🌿 Farm2Ayur — Product Requirements Document

> **"From Soil to Synergy"** — An end-to-end digital provenance, AI plant identification, and cryptographic transparency platform for the Ayurvedic medicinal herb supply chain.

---

### 📋 Project Metadata

| Attribute | Details | Attribute | Details |
| :--- | :--- | :--- | :--- |
| **Product Name** | **Farm2Ayur** | **Current Stage** | 🟡 Prototype (v1.0) |
| **Domain** | Ayurvedic Traceability & AgTech | **Core Tech** | FastAPI · Vite · MobileNetV2 · SHA-256 Ledger |
| **Target Users** | Harvesters, Verifiers, Consumers, Admins | **Integrity Model** | Hash-Chained Event Ledger (Internal Mock-Chain) |

---

## 1. Product Overview

**Farm2Ayur** is an end-to-end digital provenance and plant identification platform designed to bring transparency, authenticity, and scientific rigor to the Ayurvedic medicinal herb supply chain. 

Bridging classical Ayurvedic botanical wisdom with modern digital verification, the platform empowers harvesters with mobile AI leaf recognition, provides lab analysts with a formal verification portal, and gives consumers an instant, tamper-evident record of their herbal remedies.

---

## 2. Problem Statement

The global surge in natural wellness has accelerated demand for Ayurvedic raw materials, exposing critical vulnerabilities in traditional herbal supply chains:

| # | Challenge | Supply Chain Impact |
| :-: | :--- | :--- |
| **1** | **No Farm-to-Consumer Traceability** | Consumers lack visibility into grower identity, geographical origin (*Desha*), and harvest season (*Ritu*). |
| **2** | **Species Substitution & Adulteration** | Lookalike weeds harvested in place of genuine herbs degrade therapeutic potency (*Virya*) and risk toxicity. |
| **3** | **Vulnerable Paper-Based Assurances** | Physical Certificates of Analysis (COAs) are easily lost, misplaced, or illicitly modified without detection. |
| **4** | **Consumer Information Disconnect** | Buyers lack verified, contextual educational resources connecting classical Ayurvedic principles with modern safety data. |

---

## 3. Product Vision & Goals

> ### 🎯 Product Vision
> To establish an unbroken chain of trust and authentic botanical knowledge from the soil of the cultivator to the daily remedy of the consumer.

### Key Goals
- **Verifiable Provenance:** Transform raw botanical harvesting into an accountable pipeline where every parcel carries a verifiable digital passport.
- **Democratized AI Vision:** Put instant botanical identification into the hands of harvesters and consumers via standard mobile browser cameras.
- **Heritage & Scientific Rigor:** Combine traditional Ayurvedic parameters (*Rasa, Guna, Virya, Vipaka*) with modern laboratory assay proof.
- **Practical Transparency:** Deliver tamper-evident data integrity through lightweight cryptographic chaining without prohibitive transaction costs.

---

## 4. Target Users

| Persona | Role Key | Primary Goals & Responsibilities |
| :--- | :--- | :--- |
| **👤 End Consumer & Enthusiast** | `user` / Public | Scan plants for identification, scan product QR codes to inspect origin and lab purity, and query the Ayurvedic assistant. |
| **🧑‍🌾 Herb Harvester & Collector** | `collector` | Register new herb harvests at source, log GPS coordinates and timestamps, and generate serialized batch QR codes. |
| **🔬 Quality Verifier & Lab Analyst** | `verifier` | Review incoming batches, validate physical/chemical laboratory findings, and issue approval decisions with COA evidence. |
| **🛡️ Platform Administrator** | `admin` | Monitor system-wide supply chain telemetry, oversee platform health, and manage user accounts and botanical catalogs. |

---

## 5. Core Features

| 🌿 **AI Plant Identification** | 📦 **Batch Lifecycle Tracking** |
| :--- | :--- |
| Browser-based leaf image scanning powered by MobileNetV2 to identify 5 core Ayurvedic species (*Amla, Ashwagandha, Guduchi, Neem, Tulsi*) with confidence scoring. | Granular milestone tracking across 5 distinct lifecycle stages: *Harvested*, *Processed*, *Quality Tested*, *In Transit*, and *Delivered*. |
| **Status:** ✅ Implemented | **Status:** ✅ Implemented |

| 📱 **QR-Based Instant Access** | 🔗 **Tamper-Evident Ledger** |
| :--- | :--- |
| Serialized, downloadable 2D QR codes that route directly to public verification pages, giving instant crop-to-remedy visibility. | Deterministic SHA-256 cryptographic hash chaining linking batch events to mathematically prevent retroactive alteration. |
| **Status:** ✅ Implemented | **Status:** ✅ Implemented |

| 🧪 **Quality & COA Verification** | 💬 **RAG Ayurvedic Assistant** |
| :--- | :--- |
| Dedicated review interface for authorized verifiers to approve batches and attach digital Certificate of Analysis (COA) PDFs. | Interactive AI chat grounded in verified internal herb records to answer botanical and Ayurvedic queries with safety context. |
| **Status:** ✅ Implemented | **Status:** ✅ Implemented |

---

## 6. How Farm2Ayur Works

Farm2Ayur unifies all stakeholders across an unbroken, multi-stage verification journey:

```mermaid
flowchart LR
    A[🧑‍🌾 Harvester / Collector] -->|1. Identifies Plant| B(🌿 AI Leaf Scanner)
    B -->|2. Logs Origin & GPS| C(📋 Batch Registration)
    C -->|3. Lab Tests Purity| D(🔬 Quality Verification)
    D -->|4. Hashes Milestone| E(🔗 Traceability Ledger)
    E -->|5. Scans QR Code| F[👤 Consumer Verification]
```

1. **Identification:** Harvesters or consumers verify botanical authenticity of a plant leaf using the AI scanner.
2. **Registration:** Harvesters register a new batch at the farm, recording GPS location, timestamp, and quantity to generate a serialized QR code.
3. **Verification:** Lab analysts test the batch for purity and upload formal verification decisions with COA documentation.
4. **Traceability:** The system logs each lifecycle transition and anchors event records using cryptographic SHA-256 hash chaining.
5. **Consumption:** Consumers scan the package QR code to inspect the complete, tamper-evident farm-to-shelf journey.

---

## 7. Technology Overview

Farm2Ayur is architected as a lightweight, decoupled full-stack application:

| Subsystem | Technology Stack | Purpose & Implementation |
| :--- | :--- | :--- |
| **Frontend** | Vite · Vanilla HTML5 / CSS / ES Modules | Responsive, accessible client interface ready for React component migration. |
| **Backend API** | Python 3 · FastAPI · SQLAlchemy | High-performance asynchronous REST API handling authentication, batch workflows, and business logic. |
| **Database** | SQLite / PostgreSQL | Relational persistence for user accounts, batch logs, verifications, and botanical datasets. |
| **AI Vision Engine** | TensorFlow / Keras · MobileNetV2 (`farm2ayur-v9`) | 224×224 leaf classification pipeline with heuristic fallback mechanism for 5 plant species. |
| **Provenance Layer** | SHA-256 Hash Chaining (Internal Mock-Chain) | Lightweight zero-gas event ledger linking block hashes to ensure data tamper-evidence. |

---

## 8. Current Project Status

| Capability Area | Implementation Details | Status |
| :--- | :--- | :---: |
| **AI Plant Identification** | 5 core species classified via MobileNetV2 with confidence metrics and heuristic fallback | ✅ Implemented |
| **User & Access Control** | JWT-based authentication with role-based access control (`user`, `collector`, `verifier`, `admin`) | ✅ Implemented |
| **Batch Lifecycle Tracking** | Full CRUD, 5 lifecycle stages, GPS coordinates, timestamps, and serialized QR generation | ✅ Implemented |
| **Quality & COA Management** | Verifier review interface with status transitions and file/PDF evidence attachment | ✅ Implemented |
| **Cryptographic Provenance** | SHA-256 hash-chained event records providing auditability without gas overhead | ✅ Implemented |
| **RAG Knowledge Assistant** | Interactive chat assistant querying internal herb profiles and classical parameters | ✅ Implemented |
| **Public Blockchain Anchor** | External decentralization to public network | 🔵 Planned |
| **Multi-Herb Formulations** | Complex formulation tracking (*e.g., Chyawanprash*) | 🔵 Planned |

---

## 9. Future Scope

- **🔵 Public Blockchain Anchoring:** Transition from the internal hash-chained mock-ledger to periodic anchoring on a decentralized public blockchain network.
- **🔵 Continuous Model Expansion:** Expand the AI vision pipeline to recognize additional Ayurvedic plant species and integrate automated retraining from verifier feedback.
- **🔵 IoT & Cold Chain Integration:** Connect environmental sensors (temperature, humidity) for automated telemetry during the *In Transit* phase.
- **🔵 Formulation Traceability:** Scale provenance tracking from single raw herbs to composite, multi-ingredient classical Ayurvedic formulations.
