# Frontend Multi-Step Form Application

A 6-step quote request form built with React, React Hook Form, and a lightweight CSS module layer. It mirrors the provided Figma design (layout, spacing, and interactions), persists progress to `localStorage`, and produces a reviewable JSON payload at submission.

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run (Create React App)
```bash
npm install
npm start
```
The app runs at **http://localhost:3000**.

> If you’re using Yarn:
> ```bash
> yarn
> yarn start
> ```

---

## 🌐 Live Demo

- **GitHub Pages:** https://balajiki1.github.io/Medlaunch-Concepts/  
  Deployed with GitHub Pages.

---

## 🛠️ Tech Stack

- **React** (function components + hooks)
- **React Hook Form** (per-step validation & control)
- **CSS Modules** (`styles/form.module.css`)
- **Material UI** (only in select places if needed; most UI is custom CSS)
- **JavaScript (ES202x)**, **HTML5/CSS3**

---

## 🧩 Project Structure

```
public/
  favicon.ico
  index.html
  logo.svg
  logo192.png
  logo512.png
  manifest.json

src/
  components/
    MultiStepForm.js
    ProgressSteps.js
    common/
      FormField.js            # Reusable field component used across steps
    steps/
      Step1.js
      Step2.js
      Step3.js
      Step4.js
      Step5.js
      Step6.js
  styles/
    form.module.css
  App.js
  App.css
  index.js
```

---

## 🧠 How It Works

- **Centralized State:** `MultiStepForm.js` stores all fields (`formData`) and passes values + `handleChange` to each step.
- **Per-Step Validation:** Each step exposes `validateForm()` via `useImperativeHandle`. The parent calls it on **Continue**.
- **Autosave:** `localStorage` mirrors `formData` on each change (key: `dnvQuoteFormData`), restoring on reload.
- **Reusability:** A shared `<FormField />` wrapper (React Hook Form + label + error) is used across steps.
- **Step Highlights**
  - **Step 1:** Legal entity & primary contact. “Same as Legal” checkbox copies Legal Entity → DBA (one-time copy on click).
  - **Step 2:** Facility type (radio list) styled to match Figma.
  - **Step 3:** CEO, Director of Quality, and Invoicing Contact. “Same as Primary” checkboxes do one-time copy on click. Billing address with state dropdown.
  - **Step 4:** Single vs Multiple Locations; drag-and-drop CSV/XLSX; “Download CSV Template”.
  - **Step 5:** Services & Certifications with search, grouped checkboxes, multi-select standards, and date chips for thrombolytics/thrombectomies.
  - **Step 6:** Review accordion (Edit buttons jump back to steps), **Download PDF/CSV**, certification checkbox, and **Submit**.
- **Submission Payload:** On Step 6 → **Submit Application**, we log a single object to the console:
  ```js
  console.log('SUBMISSION_PAYLOAD', { ...formData, submittedAt: new Date().toISOString() });
  ```
  Also mirrored (for convenience) as:
  ```js
  window.__DNV_LAST_PAYLOAD__ = { ...formData, submittedAt: new Date().toISOString() };
  ```

---

## 📦 Scripts

```bash
npm start        # dev server (CRA)
npm run build    # production build
```

> For GitHub Pages: set "homepage" in `package.json` and use your usual `gh-pages` deployment scripts (already set up in the demo repo).

---

## 📌 Assumptions

- Display name (“Katherine Martinez”) is static per design.
- No backend—data persists only in `localStorage`.
- Email validation is a basic regex; phone number formatting is not enforced.
- PDF export is plain text via Blob for simplicity (no styled PDF engine).

---

## ⚠️ Known Limitations

- **PDF** is text-only; no advanced layout.
- **Support Chat** is non-functional (UI only).
- **Email verification** is a stub; no API call is made.

---

## 🧩 Troubleshooting

- **Logo / Favicon not showing:**  
  Ensure assets are in `/public` and referenced correctly in `public/index.html`.  
  Example:
  ```html
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <link rel="icon" type="image/svg+xml" href="%PUBLIC_URL%/logo.svg" />
  <link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/logo192.png" />
  ```
- **Payload not visible:**  
  Open DevTools → Console. Search for `SUBMISSION_PAYLOAD`. You can also inspect `window.__DNV_LAST_PAYLOAD__`.

---

## ✅ Design Parity

- Spacing, grid, labels, hint text, chip styles, and button placement follow the provided Figma screens as closely as possible while using semantic HTML and accessible labeling.
