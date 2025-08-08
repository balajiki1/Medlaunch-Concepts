# QA Test Report

## ✅ Test Scenarios Executed

1. Start form → fill each step → save → reload → data persists
2. "Same as Legal Name" checkbox autofills name fields
3. Navigation between steps (Next, Previous) works correctly
4. Download PDF and CSV files on Step 6
5. "Start a New Form" resets all data and localStorage
6. Required fields trigger validation errors when left empty

---

## 🐛 Bugs Identified and Resolutions

| Bug | Description | Resolution |
|-----|-------------|------------|
| Validation not triggering on all fields | Missing `trigger()` in some steps | Ensured `useImperativeHandle` uses `trigger()` |
| Last name not retained on Step 1 revisit | `reset()` not used | Used `reset(formData)` in `useEffect` |
| "Same as Legal" not updating last name | Not split correctly | Fixed string split logic and added watch |

---

## 🧪 Tools Used

- Manual browser testing (Chrome, Safari)
- React DevTools
- Console logging
- localStorage inspection
- PDF and CSV blob downloads
