# Javier Rangel Murillo — Work Inventory

> Personal reference: everything built, organized by category.
> Not a CV — a full accounting of repos, tech, and scale.
> Last updated: March 2026

---

## Table of Contents

1. [Production / Shipped](#1-production--shipped)
2. [Serious Personal Projects](#2-serious-personal-projects)
3. [AI & Machine Learning](#3-ai--machine-learning)
4. [Systems & Low-Level](#4-systems--low-level)
5. [Data Science & Big Data](#5-data-science--big-data)
6. [University Lab Work (UP iOS Lab)](#6-university-lab-work-up-ios-lab)
7. [Academic / Coursework](#7-academic--coursework)
8. [Tiny / Experiments](#8-tiny--experiments)
9. [CV Cross-Reference](#9-cv-cross-reference)

---

## 1. Production / Shipped

### legalTech — Legal Services Platform
**Status:** Shipped (Oct 2025 – Mar 2026)
**Repo:** `legalTech/` (monorepo: backend, frontend, mobile)

Full legal-tech platform taken from prototype to production. Three integrated apps:

- **Backend:** Node.js / TypeScript / Express — 66 API routes, 78+ services, 11 BullMQ background workers, 91.6% sole authorship. Domain-driven, dependency-injected architecture on GCP (Cloud Run, Pub/Sub, Tasks, KMS, Secret Manager, Storage). Firebase Auth + Firestore. Prometheus observability, Pino structured logging, circuit breakers (Opossum), advanced rate limiting, 25-file OpenAPI docs.
- **Frontend:** Next.js 15 / React 19 / TypeScript — SSR, appointment scheduling, lawyer profiles.
- **Mobile:** React Native / Expo — 8,826 TS/TSX lines across 89 files. Secure session lifecycle (Expo Secure Store, queued Axios interceptor, refresh token handling). Firebase Cloud Messaging push notifications. TanStack Query + Zustand + React Hook Form + Zod. Role-aware Expo Router (lawyer / client personas).

**Integrations:** PayPal (Orders, Vault, Subscriptions, Webhooks), Google Workspace/Meet API (event lifecycle, video ETL), Twilio SMS, SendGrid, RENAPO/CURP Puppeteer scrapers, SEP Cédula validation.
**Infra:** Terraform IaC on GCP, GitHub Actions CI/CD → Cloud Run (staging + production), PostgreSQL, Redis.
**Stack:** TypeScript, Node.js, Express, React Native, Expo, Next.js, Firebase, GCP, Redis, BullMQ, Terraform, Docker, Prometheus

---

### Photo Portfolio — jrmgraphy.com
**Status:** Live at [jrmgraphy.com](https://jrmgraphy.com)
**Repo:** `Photo-Portfolio/` | GitHub: `JavierRangel2004/Photo-Portfolio`

Bilingual (EN/ES) Astro static site with route-based i18n, dynamic category navigation, and lazy-loaded masonry gallery. Custom image pipeline using Sharp (optimization) and Exifr (EXIF metadata extraction) generates a JSON metadata file that drives galleries. Netlify deployment with automatic builds on push.

**Stack:** Astro, React, TypeScript, Tailwind CSS, Sharp, Exifr, Vite, Netlify

---

### oscWEBFINAL — Redes que Cambian
**Status:** Deployed for live organization
**Repo:** `oscWEBFINAL/` | GitHub: `JavierRangel2004/redes-que-cambian`

Full-stack platform connecting individuals with NGOs across Mexico. ~124 source files. Django REST Framework backend, Angular frontend, multi-container Docker Compose setup. Modules for volunteer coordination, project management, social-impact metrics, forums, and recognition systems. Includes SQL database dumps for data seeding and extensive API documentation.

**Stack:** Django REST Framework, Angular, PostgreSQL, Docker, Bootstrap, Animate.css

---

### Sustainability Certifications Platform
**Status:** Built and sold to a consultancy
**Repo:** GitHub: `JavierRangel2004/sustentabilidad` (not local)

Django/PostgreSQL API sold to a sustainability consultancy enabling companies to meet ESG standards. Integrated self-assessment tools, custom consulting workflows, and a sustainable-supplier directory.

**Stack:** Django, PostgreSQL

---

### GPSpei — Credit Card Recommendation PWA
**Status:** Active, deployed on Cloudflare
**Repo:** `GPSpei/`

Local-first PWA that analyzes merchants, available cards, cashback rates, promotions, and benefits to deterministically recommend the best credit card for each purchase in Mexico. No backend required — all logic runs client-side with IndexedDB (Dexie) persistence. Features geolocation, promotion syncing, PWA offline support, and a deterministic scoring engine.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS, Dexie (IndexedDB), Zustand, vite-plugin-pwa, Cloudflare

---

## 2. Serious Personal Projects

### Notadio — Local AI Transcription
**Status:** Active, self-hosted
**Repo:** `Notadio/` | GitHub: `JavierRangel2004/Notadio`

Local-first audio/video transcription with browser recording, optional speaker diarization (pyannote), AI meeting summarization via Ollama, and multi-format export (TXT/SRT/JSON). Processes entirely locally — no API costs. Long-form handling via MapReduce chunking pipeline; adaptive summarization fallback when LLM is unavailable. Deployed to a VPS: Caddy reverse proxy, HTTP Basic Auth, systemd service management.

**Stack:** React, Vite, Express, TypeScript, whisper.cpp, Ollama, FFmpeg, Python (diarization), Node.js 20+

---

### PhotoCat — AI Photo Categorizer
**Status:** Active
**Repo:** `PhotoCat/` | GitHub: `JavierRangel2004/PhotoCat`

Hybrid Python/Node pipeline to classify and organize large photo libraries. SigLIP2 zero-shot genre classification fused with YOLOv8 object-evidence scoring and BLIP captioning. Confidence-gated decisions (auto / review / title-inferred). Audit CSV reporting, optional XMP metadata writing, automatic genre-based directory organization. Fastify API bridge + Svelte/Vite frontend (in progress, currently Gradio UI).

**Stack:** Python, PyTorch, SigLIP2, YOLOv8, BLIP, NLTK, Node.js, Fastify, Svelte, Vite, Gradio

---

### backwell-api — Schedule Optimizer
**Status:** Completed
**Repo:** `backwell-api/`

Dual-language microservices system for combinatorial schedule generation. Rust/Actix-web handles high-performance schedule-generation algorithms (finding compatible course combinations with zero time/instructor/room conflicts using graph algorithms via petgraph). Django/DRF manages courses, professors, subjects, and classrooms. Both services containerized with Docker Compose + PostgreSQL.

**Stack:** Rust, Actix-web, petgraph, Django, DRF, PostgreSQL, Docker Compose

---

### clawBotJRM — Personal AI Telegram Bot ("Jarvis")
**Status:** Active, self-hosted
**Repo:** `clawBotJRM/`

Self-hosted Telegram bot for personal assistance. Integrates with local LLMs (Ollama) and OpenAI-compatible APIs, Firebase Firestore for persistent memory, Notion for note-taking, Blackboard LMS for class schedule scraping (Playwright, 2FA support), and web search via DuckDuckGo. Supports image analysis and voice transcription (faster-whisper). Starlette HTTP skill server, Docker/docker-compose deployment. Optional OpenClaw MCP gateway.

**Stack:** Python, python-telegram-bot, Starlette, Firebase Admin SDK, Playwright, faster-whisper, BeautifulSoup4, DDGS, Docker

---

### Wayfinder — Campus Route Planner
**Status:** Deployed at university
**Repo:** GitHub: `JavierRangel2004/Wayfinder` (not local)

CLI app for campus route planning using weighted graph structures and CSV data. Supports shortest/longest-path queries — deployed for a university to improve visitor navigation.

**Stack:** C++, Graph Algorithms, CSV

---

### discordBot
**Status:** Completed
**Repo:** `discordBot/`

Modular Discord bot with command and event handler architecture. MongoDB integration for data persistence. Handles guild management, member tracking, and full Discord intent coverage.

**Stack:** Node.js, discord.js v14, Mongoose (MongoDB), dotenv

---

### UP-APP — Moodle Scheduler
**Status:** Completed
**Repo:** `UP-APP/`

Moodle calendar scraping and course scheduling assistant. Scrapes Moodle homework/assignments via Selenium, analyzes subject compatibility, provides schedule recommendations. Admin panel (Flask-Admin), user auth (Flask-Login/Bcrypt), email + SMS notifications (Flask-Mail, Twilio), PostgreSQL/MySQL storage.

**Stack:** Python, Flask, SQLAlchemy, MySQL/PostgreSQL, Selenium, Twilio, Pandas, Flask-Admin

---

### Visionwire-Back
**Status:** Completed
**Repo:** `Visionwire-Back/`

Django REST API backend with JWT auth, DRF, PostgreSQL, Gunicorn, Docker. Minimal documentation; part of a larger Visionwire platform.

**Stack:** Django 4.2, DRF, PostgreSQL, Gunicorn, Docker

---

## 3. AI & Machine Learning

### Natural-Language-Processing-course — NLP Recommender System
**Status:** Course project (capstone shipped)
**Repo:** `Natural-Language-Processing-course/`

NLP coursework culminating in an Amazon product recommender system. Features sentiment analysis, product vectorization, Sentence Transformers embeddings, TSNE visualization, and a Streamlit web app for real-time recommendations. ~70 dependencies.

**Stack:** Python, TensorFlow/Keras, scikit-learn, NLTK, spaCy, Sentence Transformers, Streamlit, Plotly, Flask, pandas

---

### logisticsProject — Time-Series Forecasting
**Status:** Completed
**Repo:** `logisticsProject/`

Logistics/supply chain data science project implementing four forecasting models (ARIMA, Prophet/Facebook, Random Forest, XGBoost) for sales/inventory prediction. Synthetic data generation from Amazon datasets, train/test evaluation with MAE/MSE metrics, comparative model analysis.

**Stack:** Python, pandas, numpy, scikit-learn, XGBoost, Prophet, statsmodels, pmdarima, matplotlib

---

### ecuDifProyect — Neural ODEs & Numerical Methods
**Status:** Completed (academic)
**Repo:** `ecuDifProyect/`

Differential equations project comparing Euler and Runge-Kutta 4 numerical solvers against Neural ODE implementations across multiple parameter sets (w, b values). Full comparative CSV analysis and visualization.

**Stack:** Python, NumPy, neural_ode_simple (PyTorch-based), CSV analysis

---

### Artificial-Inteligence — AI Algorithms
**Status:** Coursework
**Repo:** `Artificial-Inteligence/`

AI course implementations: hill climbing, beam search, genetic algorithms, simulated annealing, neural networks. Applied to maze navigation, graph traversal, wine quality regression. Jupyter notebooks + Python scripts.

**Stack:** Python, NumPy, Matplotlib, NetworkX

---

### IA_ProyectoSegundoParcial — Maze + A\* Pathfinding
**Status:** Completed (academic)
**Repo:** `IA_ProyectoSegundoParcial/`

Maze generation via backtracking + A\* pathfinding with Manhattan heuristic. Backend with maze generation, algorithm implementation, and visualization tools.

**Stack:** Python, NumPy, Matplotlib, NetworkX, pandas

---

### photoCategorizer
**Status:** Empty/archived
**Repo:** `photoCategorizer/` (predecessor to PhotoCat)

---

## 4. Systems & Low-Level

### D-OS — RISC-V OS Kernel + DOOM
**Status:** Completed (academic)
**Repo:** `D-OS/`

Bootloader and custom OS kernel in RISC-V assembly that runs the classic DOOM video game on bare-metal. Implements kernel memory management, PCIe device enumeration, VGA driver (paging.S, vga.S), UART communication. Uses fbDOOM (framebuffer DOOM) for graphics. Runs on QEMU RISC-V emulator with a custom linker script.

**Stack:** RISC-V Assembly, GCC RISC-V toolchain, QEMU, fbDOOM

---

### compiladoresUP — Lexical Analyzer (Compiler)
**Status:** Completed (academic)
**Repo:** `compiladoresUP/`

Flex/Bison-based lexicographic analyzer (tokenizer). Recognizes formal grammar "RULE PRIORITY { IF ACTION }" pattern, whitespace-independent tokenization.

**Stack:** Flex, Bison, C/C++, LaTeX

---

### arqCompAsmProject — x86 ATM Simulator
**Status:** Completed (academic)
**Repo:** `arqCompAsmProject/`

Complete ATM banking system in pure x86 assembly for DOS. PIN authentication with 3-attempt limit and account locking, balance inquiry, deposits, withdrawals, transaction validation. Uses INT 21h DOS API, BIOS interrupts, state machine architecture.

**Stack:** x86 Assembly, DOS/real-mode, INT 21h

---

### ProyectoFinal — C++ Library Manager
**Status:** Completed (academic)
**Repo:** `ProyectoFinal/`

C++ command-line library management system with CRUD operations and persistent binary file storage. OOP-based (Library class, file I/O).

**Stack:** C++, Binary file I/O, Visual Studio

---

## 5. Data Science & Big Data

### DatosMasivos — Distributed Big Data Systems
**Status:** Coursework (large-scale)
**Repo:** `DatosMasivos/`

Big Data and distributed systems coursework covering: Apache Kafka consumers (dashboard & alert apps), HDFS labs with replication analysis, OLAP with ClickHouse, data lakehouse patterns, FP-Growth/Apriori market basket analysis, Spotify listening history analysis, and PySpark processing. Containerized with Docker Compose.

**Stack:** Python, Apache Kafka, HDFS, ClickHouse, Parquet, Docker, PySpark, Flask, Jupyter

---

### MexicoHotels-Data — Hotel Market Analytics
**Status:** Completed
**Repo:** `MexicoHotels-Data/`

Hotel market data analysis for Mexico City and Yucatan regions. Analyzes ADR, RevPAR, occupancy, supply, revenue, demand — weekly breakdowns and trend comparisons against prior years. 100+ Python scripts generating Plotly visualizations organized by metric and region.

**Stack:** Python, Pandas, Plotly, CSV

---

### MLCourseUP — ML Regression
**Status:** Coursework
**Repo:** `MLCourseUP/`

Boston housing dataset OLS regression analysis. Feature selection, statistical significance testing, exploratory data analysis.

**Stack:** Python, scikit-learn, pandas, statsmodels, Plotly, Seaborn

---

### BusinessDataScience / Data-scienceBusiness
**Status:** Coursework
**Repos:** `BusinessDataScience/`, `Data-scienceBusiness/`

Business data science ML coursework. Regression, logistic regression, classification with IRIS dataset. Multiple Jupyter notebooks with analysis utilities.

**Stack:** Python, pandas, scikit-learn, Matplotlib, Seaborn

---

## 6. University Lab Work (UP iOS Lab)

### branch_ios — SmartUP-API
**Status:** Production-ready
**Repo:** `branch_ios/`

Comprehensive Flask REST API for iOS development. ~34 Python files. User auth, admin interface, email notifications, web scraping (Selenium, BeautifulSoup4), QR code generation, network analysis (NetworkX), health monitoring, JWT, Docker Compose deployment.

**Stack:** Flask, Flask-Bcrypt, Flask-SQLAlchemy, MySQL/PostgreSQL, JWT, Docker, Selenium, NetworkX, QR codes

---

### upocket-apiC
**Status:** Completed
**Repo:** `upocket-apiC/`

Flask REST API that retrieves and transforms student schedule data from an external API. Provides endpoints for raw schedules and color-coded event objects by subject. Containerized with Docker.

**Stack:** Python, Flask, Requests, Docker

---

### IOS-SocialMeida
**Status:** Completed (educational)
**Repo:** `IOS-SocialMeida/`

Social media backend for iOS apps. Flask REST API with JWT auth, SQLAlchemy ORM, PostgreSQL, Gunicorn.

**Stack:** Flask, Flask-SQLAlchemy, JWT, PostgreSQL, Gunicorn

---

### classtime-matcher
**Status:** Completed
**Repo:** `classtime-matcher/`

Python utility for schedule parsing and compatibility matching. Custom Enum classes for time representations, CSV-based schedule comparison.

**Stack:** Python, Enum, CSV

---

### uspaces — Node.js/TypeScript Workshop Materials
**Status:** Active (teaching)
**Repo:** `uspaces/`

Workshop curriculum for students: Git basics, TypeScript async patterns, HTTP/REST concepts, NestJS fundamentals. Includes pedagogical guides and a NestJS skeleton project.

**Stack:** TypeScript, Node.js, NestJS, Markdown

---

### Visionwire-Back
*(See Section 2)*

---

## 7. Academic / Coursework

### DB_Avanzadas — Database Replication
**Status:** Completed (academic)
**Repo:** `DB_Avanzadas/`

Docker Compose setup demonstrating database replication concepts. PostgreSQL/MySQL replication with SQL initialization scripts and PDF documentation (replication strategy + schema design).

**Stack:** Docker, Docker Compose, PostgreSQL/MySQL, SQL

---

### Pok-Hub
**Status:** Completed (learning)
**Repo:** `Pok-Hub/`

Python web app analyzing Pokémon data from PokéAPI. Features Pokémon registration, CSV persistence, stat visualization (Plotly bar graphs), and comparison functionality.

**Stack:** Flask, Python, Pandas, Plotly, Requests

---

### POKEDEX
**Status:** Completed (JS kata)
**Repo:** `POKEDEX/`

Vanilla JS Pokémon search app using PokéAPI. Displays stats, types, images. 4th JavaScript kata.

**Stack:** Vanilla JavaScript, HTML5, CSS3, PokéAPI

---

### Front_Workshop — JRMGraphy (old portfolio)
**Status:** Archived (replaced by Photo-Portfolio)
**Repo:** `Front_Workshop/`

Original Jekyll-based photography portfolio (JRMGraphy). Bootstrap 5, infinite scroll galleries, modal image viewers, Google Apps Script contact form. Replaced by the Astro-based Photo-Portfolio.

**Stack:** Jekyll, Bootstrap 5, Ruby Gems, JavaScript, HTML/CSS, Netlify

---

### Photography-Portfolio
**Status:** Archived (early prototype)
**Repo:** `Photography-Portfolio/`

Very early static HTML/CSS photography portfolio (pre-Jekyll). Original prototype, now superseded by Front_Workshop → Photo-Portfolio.

**Stack:** HTML, CSS

---

## 8. Tiny / Experiments

| Repo | Description | Stack |
|------|-------------|-------|
| `Django_WorkSpace` | Django polls tutorial | Django, SQLite |
| `Back_Workshop` | Backend starter template | Python |
| `DBs` | Datasets (Harry Potter chars, CDMX Metro, carpetas 2022) | CSV, Jupyter |
| `ecuDifProyect` | See Section 3 | Python |
| `testingPy` | Small Python testing scripts | Python |
| `git_2`, `hola`, `mi_entorno` | Throwaway experiments | Various |
| `whisper.cpp` | whisper.cpp local clone/build | C++ |
| `ProgramaTesting` | C++ binary data testing | C++ |

---

## 9. CV Cross-Reference

### Currently in CV ✓

| CV Entry | Repo |
|----------|------|
| LegalTec — Founding Backend & Mobile Engineer | `legalTech/` |
| UP iOS Lab — Backend Development Lead | `branch_ios/`, `uspaces/`, etc. |
| UP iOS Lab — Backend Developer | `IOS-SocialMeida/`, `upocket-apiC/`, etc. |
| Notadio | `Notadio/` |
| PhotoCat | `PhotoCat/` |
| Redes que Cambian | `oscWEBFINAL/` |
| Sustainability Certifications Platform | (on GitHub, not local) |
| Photo Portfolio | `Photo-Portfolio/` |
| Wayfinder | (on GitHub, not local) |

---

### Candidates to Add to CV

These are strong enough to be listed but currently absent:

#### **backwell-api** ⭐ Recommended
- Dual-language microservices: Rust (Actix-web + petgraph graph algorithms) + Django
- Combinatorial schedule optimization — finds conflict-free class combinations
- Fully containerized, production-ready architecture
- Shows Rust + systems-level thinking, rare at this level

#### **GPSpei** ⭐ Recommended
- Deployed PWA with deterministic recommendation engine
- Local-first architecture (no backend), IndexedDB, offline-capable
- Real product: helps Mexican users pick optimal credit cards
- Shows product engineering + frontend depth

#### **clawBotJRM** — Worth mentioning
- Complex multi-service AI system: Telegram + Ollama/LLMs + Firebase + Playwright + voice transcription
- Shows LLM integration, web scraping, async bot architecture

#### **D-OS** — Optional (impressive, very niche)
- RISC-V OS kernel in assembly that runs DOOM
- Very high systems programming complexity
- Best for roles with low-level/embedded interest

#### **DatosMasivos** — Optional (academia, but strong)
- Kafka, HDFS, ClickHouse, PySpark, Docker
- Shows distributed systems knowledge beyond web dev

#### **logisticsProject** — Optional (data science angle)
- 4 forecasting models: ARIMA, Prophet, XGBoost, Random Forest
- Good if targeting data-engineering or ML roles

---

### Skills Gap: What the CV Doesn't Mention

Based on actual usage across repos:

- **Rust** (backwell-api) — not in CV at all
- **PySpark / Apache Kafka / HDFS / ClickHouse** (DatosMasivos)
- **Svelte** (PhotoCat frontend migration)
- **Jekyll** (Front_Workshop)
- **NetworkX** (branch_ios, AI coursework)
- **Neural ODEs / RK4** (ecuDifProyect)
- **RISC-V / x86 Assembly** (D-OS, arqCompAsmProject)
- **Flex / Bison** (compiladoresUP)
- **Streamlit** (NLP recommender)
- **XGBoost / Prophet / ARIMA** (logisticsProject)
- **Dexie / IndexedDB** (GPSpei)
