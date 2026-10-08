# Product Requirements Document (PRD) — Farm2Ayur

**Project Name:** Farm2Ayur  
**Stage:** Hackathon Prototype (v1.0)  
**Primary Focus:** Ayurvedic Herb Traceability, AI Leaf Identification & Cryptographic Provenance  

---

## 1. Product Overview

**Farm2Ayur** is an end-to-end digital provenance and plant identification platform designed to bring transparency, authenticity, and scientific rigor to the Ayurvedic medicinal herb supply chain. Operating under the theme *"From Soil to Synergy"*, the platform bridges classical Ayurvedic botanical knowledge with modern verification workflows, mobile AI plant recognition, and verifiable cryptographic data logging.

## 2. Problem Statement

The global resurgence in natural medicine and herbal wellness has placed unprecedented demand on Ayurvedic raw materials. However, modern herbal supply chains face structural vulnerabilities:

1. **Lack of Farm-to-Consumer Traceability:** Consumers have virtually no visibility into who harvested the plant, its geographical origin (*Desha*), or harvest season (*Ritu*).
2. **Species Substitution and Adulteration:** Non-medicinal lookalike leaves are often harvested in place of authentic botanical varieties, diminishing therapeutic potency (*Virya*) and potentially introducing toxins.
3. **Vulnerability of Paper-Based Quality Assurances:** Certificates of Analysis (COAs) and laboratory testing logs are traditionally paper-bound, prone to loss, misattribution, and unauthorized alteration.
4. **Information Disconnect:** Modern consumers lack an engaging, verified educational bridge connecting traditional Ayurvedic frameworks with modern botanical science and clinical safety warnings.

## 3. Product Vision & Goals

The vision of **Farm2Ayur** is to establish an unbroken chain of trust and authentic knowledge from the soil of the cultivator to the daily remedy of the consumer.

**Goals:**
- Transform raw botanical harvesting into an accountable, verifiable digital pipeline where every parcel carries a verifiable digital passport.
- Democratize botanical identification by placing AI-assisted computer vision into the hands of cultivators and consumers via everyday mobile cameras.
- Honor and preserve authentic Ayurvedic heritage by combining traditional understanding with modern phytochemical standards and laboratory proof.
- Provide a clear, honest, and cost-effective blueprint for supply chain transparency.

## 4. Target Users

| User Persona | Role | Primary Responsibilities & Goals |
| :--- | :--- | :--- |
| **End Consumers & Herbal Enthusiasts** | `user` / Public | Scan plants to identify herbs. Look up batch codes via QR scans to inspect harvest origin and lab purity. Chat with the Ayurvedic assistant. |
| **Herb Collectors & Harvesters** | `collector` | Register newly harvested herb batches at source. Log harvest date and GPS locations. Generate serialized batch QR codes. |
| **Quality Verifiers & Lab Analysts** | `verifier` | Review incoming raw herb batches. Validate laboratory assay findings. Submit formal verification decisions with external evidence. |
| **Platform Administrators** | `admin` | Monitor system-wide supply chain telemetry and platform health. Manage user accounts and herb catalog data. |

## 5. Core Features

- **AI Medicinal Plant Identification:** Browser-based leaf scanning to identify 5 core Ayurvedic medicinal plant classes (*Amla, Ashwagandha, Guduchi, Neem, Tulsi*).
- **Batch Lifecycle & Harvest Traceability:** Granular tracking of numbered harvest batches across 5 lifecycle stages: *Harvested, Processed, Quality Tested, In Transit, Delivered*.
- **QR-Based Instant Batch Access:** Dynamic, downloadable 2D QR codes mapped to a public tracking portal, providing instant frictionless access to crop-to-remedy data.
- **Cryptographic Tamper-Evident Ledger:** Deterministic SHA-256 cryptographic hashes that link batch events together, mathematically preventing retroactive data manipulation.
- **Human-in-the-Loop Quality Verification:** A dedicated review pipeline for authorized verifiers to approve batches and attach digital evidence (COA PDFs).
- **RAG-Based Ayurvedic Chat Assistant:** An interactive, Retrieval-Augmented Generation chatbot that searches verified internal herb records to provide contextual Ayurvedic answers.

## 6. How Farm2Ayur Works

Farm2Ayur connects multiple stakeholders through a unified, transparent supply chain lifecycle:

```mermaid
flowchart LR
    A[Farmer/Collector] -->|1. Identifies Plant| B(AI Scanner)
    B -->|2. Logs Origin| C(Batch Registration)
    C -->|3. Lab Validates| D(Quality Verification)
    D -->|4. Anchors Data| E(Traceability Ledger)
    E -->|5. Scans Package| F[Public Consumer]
```

1. **Identification:** Collectors or consumers verify the botanical authenticity of a plant leaf using the AI scanner.
2. **Registration:** Collectors register a new batch at the farm, recording GPS location, date, and weight, generating a QR code.
3. **Verification:** Lab technicians test the batch for purity and upload verification decisions and COA documents to the system.
4. **Traceability:** The system logs each lifecycle milestone (harvesting, processing, transit) and anchors the data via a cryptographic hash chain.
5. **Consumption:** Consumers scan the QR code on the final product to instantly view the entire, tamper-evident journey.

## 7. Technology Overview

Farm2Ayur is architected as a decoupled full-stack application suitable for rapid deployment:
- **Frontend:** A responsive Vite-powered web client built using semantic HTML5, modular CSS, and vanilla ES modules (ready for React migration).
- **Backend:** A high-performance Python REST API powered by FastAPI and SQLAlchemy ORM, utilizing PostgreSQL/SQLite.
- **AI Engine:** A botanical vision pipeline centered around a custom MobileNetV2 convolutional neural network (`farm2ayur-v9`) running via Keras/TensorFlow.
- **Provenance Layer:** A SHA-256 cryptographic ledger mechanism providing simulated hash-chaining verification without external blockchain gas costs.

## 8. Current Project Status

**Stage:** Hackathon Prototype (v1.0)
- **Implemented:** The core platform is fully functional. The AI scanner successfully identifies the 5 core plants (with heuristic fallbacks). JWT authentication, RBAC, batch lifecycle management, RAG chat, and the internal mock-chain cryptographic ledger are active.
- **Pending:** The system is not yet scaled for live production.

## 9. Future Scope

- **Public Blockchain Integration:** Transition from the internal mock-chain to anchoring batch data on a decentralized public blockchain network.
- **Continuous AI Learning:** Utilize human verification feedback to automatically retrain and expand the AI vision model to recognize more Ayurvedic plants.
- **IoT & Cold Chain Sensors:** Integrate automated temperature and humidity sensors during the 'In Transit' phase.
- **Formulation Traceability:** Expand traceability from single raw herbs to complex, multi-herb Ayurvedic formulations (e.g., *Chyawanprash*).
