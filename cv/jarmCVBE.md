# Javier Rangel Murillo

Mexico City, Mexico · [inspecjrm@gmail.com](mailto:inspecjrm@gmail.com) · [LinkedIn](https://linkedin.com/in/javierramu2004) · [GitHub](https://github.com/JavierRangel2004)

---

## Professional Summary

**Backend Engineer** with startup experience designing and owning production systems end-to-end — from distributed architecture and cloud infrastructure to payment pipelines and async workers. Specialized in **TypeScript/Node.js** and **Python**, with proven delivery on **GCP, Docker**, and event-driven systems. Sole backend author of a live legal-tech platform: 66 API routes, 11 background workers, full payments, identity verification, and video workflows.

---

## Technical Skills

| Domain | Level |
|---|---|
| Backend (Node.js, Express, APIs) | ★★★★★ |
| Programming (TypeScript, Python, SQL) | ★★★★★ |
| Cloud & Infra (GCP, Firebase, Terraform) | ★★★★☆ |
| Databases (PostgreSQL, Redis, MongoDB) | ★★★★☆ |
| Async Systems (BullMQ, Pub/Sub, Workers) | ★★★★☆ |
| DevOps (Docker, CI/CD, GitHub Actions) | ★★★★☆ |
| Integrations (PayPal, Twilio, SendGrid) | ★★★★☆ |
| Developer Tools (Linux, Git, Puppeteer) | ★★★★★ |

**Languages:** Spanish (native) · English C1 — TOEFL iBT 607

---

## Professional Experience

### LegalTec
**Founding Backend Systems Engineer** · *Oct 2025 – Mar 2026*

- Architected and shipped the entire backend platform using **Node.js, TypeScript, and Express.js** as **sole author of 91.6%** of the codebase — 66 API routes, 78+ services, 11 background workers — taking a legal-tech startup from prototype to production.
- Designed **GCP infrastructure** (Cloud Run, Pub/Sub, Tasks, KMS, Secret Manager, Firebase Auth/Firestore) with encryption at rest, enabling high-availability distributed processing of sensitive legal data.
- Built 11 specialized workers with **BullMQ + Redis** (payment retry, hold cleanup, video ETL, recording TTL, Google Meet processing, verification pipelines), eliminating synchronous bottlenecks across all async workflows.
- Delivered full platform monetization via **PayPal APIs** (Orders, Vault, Subscriptions, Webhooks) with idempotent retry logic; automated virtual appointments via **Google Workspace/Meet API** (event lifecycle, video ETL).
- Engineered **Puppeteer**-based scrapers for CURP/RENAPO and SEP Cedula Profesional validation, replacing third-party API dependencies and cutting identity verification costs to zero.
- Delivered production observability: **Prometheus** metrics, **Pino** structured logging, audit trail, circuit breakers (Opossum), rate limiting, and a 25-file **OpenAPI** documentation suite.
- Provisioned **Terraform** IaC on GCP; configured **GitHub Actions** CI/CD pipelines to Cloud Run for staging and production with zero-downtime deploys.

### Universidad Panamericana — iOS Development Lab
**Backend Lead** · *Oct 2022 – Present*

- Promoted to lead Sep 2025; mentors students on **Python**, clean architecture, and API design while guiding projects from monoliths to containerized microservices with **Docker**.
- Built and deployed production APIs with **Django** and **Flask** backing native Swift iOS apps; designed **PostgreSQL** and MongoDB schemas for performance and data security.

---

## Projects & Achievements

**Notadio** · *Express, TypeScript, Python, whisper.cpp, Ollama, FFmpeg*

- Built a **local-first transcription service** — processes audio/video with **whisper.cpp** (zero API cost) and generates AI summaries via **Ollama** using a MapReduce chunking pipeline. Speaker diarization (**pyannote**), multi-format export, live telemetry; deployed on VPS with Caddy + systemd.

**backwell-api** · *Rust, Actix-web, Django, PostgreSQL, Docker*

- Dual-language microservices system for **combinatorial schedule optimization**. **Rust/Actix-web** handles high-performance graph algorithms (petgraph) for conflict-free course scheduling; **Django/DRF** manages domain CRUD. Containerized with Docker Compose.

**Redes que Cambian** · *Django, Angular, PostgreSQL, Docker*

- Full-stack platform connecting individuals with NGOs across Mexico — volunteer coordination, project management, social-impact metrics — deployed for a live non-profit organization.

---

## Education

**Universidad Panamericana** · Mexico City, Mexico
*B.Eng. in Data Intelligence and Cybersecurity* · *Aug 2022 – Jun 2027*
