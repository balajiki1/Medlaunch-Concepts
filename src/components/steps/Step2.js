import React, { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../../styles/form.module.css';

const OPTIONS = [
  'Short-Term Acute Care',
  'Long-Term Acute Care',
  'Critical Access',
  "Children's",
  'Free-Standing Psychiatric',
  'Other',
];

const Step2 = forwardRef(({ formData, handleChange }, ref) => {
  const [error, setError] = useState(false);

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      if (!formData.facilityType) {
        setError(true);
        return false;
      }
      setError(false);
      return true;
    },
  }));

  return (
    <div className={styles.stepBox}>
      {/* Page section header */}
      <h3 className={styles.sectionTitle}> Facility and Organization Type</h3>

      {/* Card section title (matches Figma wording) */}
    <br></br>

      {/* Radio legend */}
      <div className={styles.fieldGroup} style={{ marginBottom: 12 }}>
        <label className={styles.inputLabel}>
          Facility Type <span className={styles.req}>*</span>
        </label>
        <div className={styles.radioGroup}>
          {OPTIONS.map((label) => (
            <label key={label} className={styles.radioItem}>
              <input
                type="radio"
                name="facilityType"
                value={label}
                checked={formData.facilityType === label}
                onChange={handleChange('facilityType')}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        {error && <div className={styles.errorText}>Please select a facility type.</div>}
      </div>
    </div>
  );
});

export default Step2;
