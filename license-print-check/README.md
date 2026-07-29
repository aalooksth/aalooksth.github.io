# Unified Smart Driving License Print Status Checker

A high-performance, responsive static web application hostable on **GitHub Pages** to provide unified license print status checking across Transport Management Offices (TMOs) in Nepal (Bagamati Province: **Ekantakuna**, **Thulobharyang / Kalanki**, **Chabahil**, and **Radhe Radhe / Bhaktapur**).

---

## 🚀 Pre-configured Transport Offices

1. **Ekantakuna (Lalitpur)**: `GET https://printekantakuna.bagamati.gov.np/api/api/public/{license_number}`
2. **Thulobharyang (Kalanki)**: `POST https://gbuvycslvvqaafwnugsi.supabase.co/rest/v1/rpc/search_license_public`
3. **Chabahil (Kathmandu)**: `GET https://foaajwxymscuzdluzmxp.supabase.co/rest/v1/tblLicenseRecords?select="license_no","name"&license_no=eq.{license_number}`
4. **Radhe Radhe (Bhaktapur)**: `GET https://sanjibsimdotmlicense-portal-iota.vercel.app/licenses.csv`

---

## 🔒 Exact Match Enforcement

- Enforces strict string equality matching between the searched license number and returned database records.
- Prevents partial/prefix matches (e.g. searching `01-06-0006240` will not match `01-06-00062408`).

---

## 🔗 Official Portals Included

- **Bagamati Province Driving License Portal**: [dl.bagamati.gov.np](https://dl.bagamati.gov.np)
- **Department of Transport Management (DoTM)**: [dotm.gov.np](https://www.dotm.gov.np)
- **TMO Ekantakuna Site**: [tmopl.bagamati.gov.np](https://tmopl.bagamati.gov.np)
- **TMO Kalanki / Thulobharyang Site**: [tmokalanki.github.io](https://tmokalanki.github.io/)
- **TMO Chabahil Site**: [thapasanjay23.github.io](https://thapasanjay23.github.io/)
- **TMO Radhe Radhe / Bhaktapur Site**: [tmobkt.bagamati.gov.np](https://tmobkt.bagamati.gov.np)

---

## 📋 Required Documents for Smart Card Collection

When a license card is printed and ready:
1. **Original Citizenship Certificate** (नेपाली नागरिकता)
2. **Original Revenue Payment / Trial Receipt** (राजस्व रसिद)
3. **Old License** (if renewing or adding category)

---

## 🌐 GitHub Pages Deployment

1. Commit and push contents to your GitHub Pages repository (`aloks.com.np/license-print-check`).
2. Live at: `https://aloks.com.np/license-print-check/`
