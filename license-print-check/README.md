# Nepal Smart Driving License Print & Collection Status Checker

An independent civic web utility to check Smart Driving License print and collection status across Transport Management Offices (TMOs) in Bagamati Province, Nepal (**Ekantakuna**, **Thulobharyang / Kalanki**, **Chabahil**, and **Radhe Radhe / Bhaktapur**).

**Live App:** [https://aloks.com.np/license-print-check/](https://aloks.com.np/license-print-check/)

---

## 🚀 Pre-configured Transport Offices & APIs

1. **TMO Ekantakuna (Lalitpur)**:
   - Primary: `GET https://printekantakuna.bagamati.gov.np/api/api/public/{license_number}` (License & Applicant Details)
   - Secondary: `GET https://printekantakuna.bagamati.gov.np/api/api/public/request/{license_number}` (RECEIVED ID / Request Tracking)
2. **TMO Thulobharyang (Kalanki)**:
   - RPC: `POST https://gbuvycslvvqaafwnugsi.supabase.co/rest/v1/rpc/search_license_public`
3. **TMO Chabahil (Kathmandu)**:
   - REST: `GET https://foaajwxymscuzdluzmxp.supabase.co/rest/v1/tblLicenseRecords`
4. **TMO Radhe Radhe (Bhaktapur)**:
   - CSV: `GET https://sanjibsimdotmlicense-portal-iota.vercel.app/licenses.csv`

---

## ✨ Features & Architecture

- **Exact License Format & Input Helper**: Enforces 12-character format (`XX-XX-XXXXXXXX`) with auto-hyphenation and cursor position preservation while editing/deleting.
- **Floating Bookmarklet & Native Web Share**: 
  - On Desktop: Draggable pill pre-titled with the applicant's name (e.g. `📌 ALOK SHRESTHA (01-06-00062402) - License Status`).
  - On Mobile: Triggers native OS Web Share API sheet to share direct search links.
- **Dual-Language Support**: Complete English (`en`) and Nepali (`ne`) localization.
- **Auto OS System Theme & Manual Toggle**: Follows device `prefers-color-scheme` with live switching and `localStorage` preference overrides.
- **AEO / SEO & LLM Ready**: Comprehensive meta tags, structured JSON-LD data, `robots.txt`, `sitemap.xml`, and `llms.txt`.

---

## 🔒 Privacy, Security & Architecture

- **100% Client-Side Static Execution**: Hosted on GitHub Pages with **zero backend servers or databases**.
- **No Data Retention or Logging**: Submitted license numbers are processed strictly inside the browser memory. No query logs, personal identifiers, or analytics tracking of search queries exist.
- **Direct Public API Calls**: Requests (`fetch()`) are dispatched straight from the user's browser to official public endpoints maintained by the respective Transport Management Offices (`bagamati.gov.np`).
- **Stateless `&format=json` Parameter**: The `&format=json` URL feature is a pure client-side UI transform module in `app.js` designed for screen readers and AI agents to parse structured status JSON. It does not transmit or record data to any third party.

---

## 🔗 Official TMO Portals & Resources

- **Bagamati Province License Portal**: [dl.bagamati.gov.np](https://dl.bagamati.gov.np)
- **DoTM Official Site**: [dotm.gov.np](https://www.dotm.gov.np)
- **TMO Ekantakuna Portal**: [printekantakuna.bagamati.gov.np](https://printekantakuna.bagamati.gov.np)
- **TMO Kalanki Portal**: [tmokalanki.bagamati.gov.np](https://tmokalanki.bagamati.gov.np/pages/searchList/)

---

## 📋 Required Documents for Smart Card Collection

When your license card status shows **Printed & Ready**:
1. **Original Citizenship Certificate** (नेपाली नागरिकता)
2. **Original Revenue Payment / Trial Receipt** (राजस्व रसिद)
3. **RECEIVED ID / Box Code** (if registered at Ekantakuna or Kalanki)
4. **Old License** (if renewing or adding category)

---

## ⚠️ Disclaimer

This website is an **independent civic web utility** developed for public convenience. It is **not affiliated with or an official representative of the Department of Transport Management (DoTM)** or any government authority. Data is queried live from public office endpoints.
