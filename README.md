# Frontend Multi-Step Form Application

## 🚀 How to Install and Run the App Locally

```bash
git clone <your-repo-url>
cd <your-project-directory>
npm install
npm run dev
```

App will be available at `http://localhost:3000`

---

## 🛠️ Tech Stack Used

- React.js
- Material UI
- React Hook Form
- Day.js
- HTML5 / CSS3
- JavaScript (ES6+)

---

## 🧠 Summary of Development Approach

This multi-step form was built using a modular structure with step-wise components and centralized state management in `MultiStepForm.js`. Data is persisted via `localStorage` to ensure form continuity, and validation is handled using `react-hook-form` per step.

Navigation and styling are aligned with the provided Figma design, including headers, input spacing, button layout, and user profile display.

---

## 📌 Assumptions Made

- The user's name ("Katherine Martinez") is static, as per design.
- Form data is stored in localStorage only (no backend API).
- Validations are limited to required fields and basic email format.
- PDF and CSV export in Step 6 assumes static structure.

---

## ⚠️ Known Issues or Limitations

- PDF export is plain text (no styled layout).
- No API for email verification (Step 1).
- Support chat is static (non-functional).
