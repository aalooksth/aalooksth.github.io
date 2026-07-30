# Alok Shrestha - Portfolio & Independent Civic Tools

This repository hosts the personal website and civic web utilities for **Alok Shrestha**, deployed via **GitHub Pages** at [aloks.com.np](https://aloks.com.np/).

---

## 🪪 Featured Project: Nepal Smart Driving License Print & Collection Status Checker

An independent, unified civic web utility allowing citizens across Bagamati Province, Nepal to check their Smart Driving License print, registration, and collection status in real time across multiple Transport Management Offices (TMOs).

**Live Utility:** [aloks.com.np/license-print-check/](https://aloks.com.np/license-print-check/)

### 🚀 Key Features
- **Unified Multi-Office Lookup**: Real-time status lookup across Bagamati Province TMOs (**Ekantakuna**, **Thulobharyang / Kalanki**, **Chabahil**, and **Radhe Radhe / Bhaktapur**).
- **Dual Endpoint Sync (Ekantakuna)**: Queries primary license record (`/public/{license}`) and request tracking (`/public/request/{license}`) in parallel to fetch exact **RECEIVED ID** and applicant details.
- **Smart Form Formatting**: Auto-formats input as `XX-XX-XXXXXXXX` with cursor position preservation.
- **Floating Bookmarklet & Web Share API**: One-tap share on mobile, or drag-to-bookmark link pre-titled with applicant name on desktop.
- **Bilingual & Responsive Design**: Supports English (`en`) and Nepali (`ne`), with dynamic OS theme detection (`prefers-color-scheme`) and persistent manual dark/light toggle.
- **AEO / SEO & LLM Ready**: Fully indexed with `sitemap.xml`, `robots.txt`, `llms.txt`, and structured Open Graph meta tags.

---

## 📂 Project Structure

```text
├── index.html                  # Main Portfolio Landing Page
├── css/styles.css              # Portfolio Styles & Theme Engine
├── js/script.js                # Portfolio UI & Dynamic System Theme Listener
├── license-print-check/        # Smart License Print Status Checker Tool
│   ├── index.html              # Tool Main UI
│   ├── style.css               # Tool Design System (Dark/Light & Mobile Responsive)
│   ├── app.js                  # Application Logic & Result Renderer
│   ├── config.js               # Office Registry & Endpoint Parsers
│   └── README.md               # Tool Specific Documentation
├── sitemap.xml                 # XML Sitemap for Search Indexing
├── robots.txt                  # Search & Crawler Rules
└── llms.txt                    # Concise Context for AI / LLM Agents
```

---

## ⚙️ Development & Deployment

This is a zero-dependency, vanilla HTML/CSS/JavaScript repository designed to run natively on any static host or web server.

- **Local Preview**: Open `index.html` in a web browser or use a lightweight local server (e.g. `npx serve .` or VS Code Live Server).
- **Deployment**: Automatic deployment on push to `main` via **GitHub Pages**.
