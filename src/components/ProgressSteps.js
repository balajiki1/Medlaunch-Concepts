import React from 'react';
import styles from '../styles/form.module.css';

const LABELS = [
  'DNV Quote Request',
  'Facility Details',
  'Leadership Contacts',
  'Site Information',
  'Services & Certifications',
  'Review & Submit',
];

export default function ProgressSteps({ step }) {
  return (
    <div className={styles.stepsWrap}>
      <div className={styles.stepsBar}>
        {LABELS.map((label, i) => {
          const idx = i + 1;
          const state =
            step === idx ? 'active' : step > idx ? 'done' : 'upcoming';
          return (
            <div key={label} className={styles.stepItem} data-state={state}>
              
              <div className={styles.stepLabel}>{label}</div>
              <div className={styles.stepBar} />
              
            </div>
          );
        })}
      </div>
    </div>
  );
}
