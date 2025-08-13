# QA Test Report

## 🧪 Environment
- macOS (Safari, Chrome)
- Node 20, npm 10
- Local dev (`npm start`) and GitHub Pages build

---

## ✅ Test Scenarios Executed

1. **Start → Fill → Save → Reload → Continue**
   - Form data persisted in `localStorage` and restored on refresh.
2. **Step 1 “Same as Legal”**
   - When the checkbox is **checked**, DBA is copied once from Legal Entity.
   - Unchecking does **not** auto-clear (by design).
3. **Step 3 contact checkboxes**
   - “Same as Primary” (CEO/Director/Invoice) perform a **one-time** copy from Step 1 upon click.
4. **Step 4 file upload**
   - Drag-and-drop & file picker both work; duplicates (name+size) ignored.
   - “Download CSV Template” produces a CSV with headers.
5. **Step 5**
   - Search filters services; grouped checkboxes toggle correctly.
   - Standards multi-select shows chips; remove chip works.
   - Date pickers append chips without duplicates; remove works.
6. **Step 6 Review**
   - Accordions open by default; Edit buttons navigate to the target step.
   - “Download PDF” and “Export to CSV” download files.
   - Certification checkbox gates Submit; Submit logs payload to console.
7. **Navigation**
   - Previous/Continue follow expected flow; Exit returns to start screen.
8. **Validation**
   - Required fields surface errors; email uses basic regex.

---

## 🐛 Bugs & Resolutions

| ID | Bug | Impact | Resolution |
|----|-----|--------|------------|
| B-01 | Some fields didn’t re-populate when returning to a step | Med | Added `reset(formData)` in each step on mount/prop change |
| B-02 | DBA didn’t copy full name in some cases | Low | Switched to a one-time copy on checkbox click (no live watch) |
| B-03 | Duplicated files in Step 4 on repeated uploads | Low | Deduplication by `name+size` before merging |
| B-04 | Standards dropdown closed when removing a chip | Low | Stop propagation on chip close inside control |
| B-05 | Inconsistent icon sizing in custom controls | Low | Introduced `.bigIcon` and consistent font sizing in CSS |

_All above are fixed in the current build._

---

## 🔍 Visual & Accessibility Checks

- **Labels & Required Indicators:** Present and programmatically associated.
- **Keyboard Only:** All interactive elements reachable and operable.
- **Focus States:** Browsers’ defaults preserved; critical inputs get visual focus.
- **Color Contrast:** Primary/secondary on white meets AA in typical scenarios.

---

## 📈 Performance/UX Notes

- Persistent autosave ensures no accidental loss of work.
- Minimal runtime deps; most UI is custom CSS for speed and fidelity.

---

## 🧰 Tools

- Manual browser testing (Chrome, Safari)
- React DevTools
- DevTools console + `localStorage` inspection
- Simple Blob downloads for CSV/PDF
