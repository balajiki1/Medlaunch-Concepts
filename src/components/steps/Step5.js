import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../common/FormField';
import styles from '../../styles/form.module.css';

const serviceCategories = {
  'Emergency & Critical Care': [
    'Emergency Department',
    'Neonatal Intensive Care Services',
    'Pediatric Intensive Care Services',
  ],
  'Cardiac Services': ['Cardiac Catheterization Laboratory', 'Open Heart'],
  'Diagnostic Services': [
    'Magnetic Resonance Imaging (MRI)',
    'Diagnostic Radioisotope Facility',
    'Lithotripsy',
  ],
};

const standards = ['Action1', 'Action2', 'Action3'];
const tabLabels = ['All Services', 'Clinical', 'Surgical', 'Diagnostic', 'Rehabilitation', 'Specialty'];

const Step5 = forwardRef(({ formData, handleChange }, ref) => {
  const { control, getValues, trigger } = useForm({
    defaultValues: {
      strokeCertExpiry: formData.strokeCertExpiry || '',
      applicationDate: formData.applicationDate || '',
    },
    mode: 'onTouched',
  });

  const [tabIndex, setTabIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedServices, setSelectedServices] = useState(formData.services || {});
  const [otherService, setOtherService] = useState('');
  const [otherServices, setOtherServices] = useState(formData.otherServices || []);
  const [selectedStandards, setSelectedStandards] = useState(formData.selectedStandards || []);
  const [thrombolytics, setThrombolytics] = useState(formData.thrombolytics || []);
  const [thrombectomies, setThrombectomies] = useState(formData.thrombectomies || []);
  const [msOpen, setMsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      const ok = await trigger(); // no required fields atm; keep for future rules
      if (!ok) return false;

      const dates = getValues();
      // Push everything to parent only on Continue
      handleChange('services')({ target: { value: selectedServices } });
      handleChange('otherServices')({ target: { value: otherServices } });
      handleChange('selectedStandards')({ target: { value: selectedStandards } });
      handleChange('thrombolytics')({ target: { value: thrombolytics } });
      handleChange('thrombectomies')({ target: { value: thrombectomies } });
      handleChange('strokeCertExpiry')({ target: { value: dates.strokeCertExpiry || '' } });
      handleChange('applicationDate')({ target: { value: dates.applicationDate || '' } });
      return true;
    },
  }));

  const toggleService = (group, service) => {
    setSelectedServices((prev) => ({
      ...prev,
      [group]: { ...prev[group], [service]: !prev[group]?.[service] },
    }));
  };

  const addOtherService = () => {
    const v = otherService.trim();
    if (!v || otherServices.includes(v)) return;
    setOtherServices((p) => [...p, v]);
    setOtherService('');
  };
  const removeOtherService = (v) => setOtherServices((p) => p.filter((x) => x !== v));

  const toggleStandard = (std) =>
    setSelectedStandards((p) => (p.includes(std) ? p.filter((x) => x !== std) : [...p, std]));

  const addDateChip = (setter, arr, val) => {
    if (val && !arr.includes(val)) setter([...arr, val]);
  };
  const removeDateChip = (setter, arr, val) => setter(arr.filter((d) => d !== val));

  // Simple tab -> group filter mapping (adjust as your catalog grows)
  const tabFilterFn = useMemo(() => {
    const label = tabLabels[tabIndex];
    if (label === 'All Services') return () => true;
    if (label === 'Diagnostic') return (group) => /diagnostic/i.test(group);
    if (label === 'Surgical') return (group) => /cardiac/i.test(group); // proxy for surgical offerings
    if (label === 'Clinical') return (group) => /(emergency|critical|cardiac)/i.test(group);
    // For other tabs without specific mapping yet, show nothing by default:
    return () => false;
  }, [tabIndex]);

  const filteredCategories = useMemo(() => {
    const byTab = Object.entries(serviceCategories).filter(([group]) => tabFilterFn(group));
    if (!query.trim()) return Object.fromEntries(byTab);
    const q = query.toLowerCase();
    const out = {};
    byTab.forEach(([group, list]) => {
      const f = list.filter((s) => s.toLowerCase().includes(q));
      if (f.length) out[group] = f;
    });
    return out;
  }, [query, tabFilterFn]);

  const fmt = (iso) => {
    try {
      const d = new Date(iso);
      return isNaN(d.getTime())
        ? iso
        : d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className={styles.stepBox}>
      <h3 className={styles.sectionTitle}>Services &amp; Certifications</h3>

      {/* Service Offering (no outer card) */}
      <div style={{ marginBottom: 16 }}>
        <div className={styles.inputLabel} style={{ fontWeight: 600, marginBottom: 6 }}>
          Service Offering
        </div>
        <div className={styles.sectionHint} style={{ marginBottom: 12 }}>
          Primary Service offering
        </div>

        {/* Tabs */}
        <div className={styles.segTabs} style={{ marginBottom: 8 }}>
          {tabLabels.map((t, i) => (
            <button
              key={t}
              type="button"
              className={`${styles.segTab} ${i === tabIndex ? styles.segActive : ''}`}
              onClick={() => setTabIndex(i)}
              aria-pressed={i === tabIndex}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className={styles.fieldGroup} style={{ marginBottom: 12 }}>
          <div className={styles.inputWithAction}>
            <input
              type="text"
              placeholder="Search services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.input}
            />
            <span className={styles.inputIcon} aria-hidden>🔍</span>
          </div>
        </div>

        {/* Grouped checkboxes */}
        <div className={styles.serviceGrid} style={{ marginBottom: 8 }}>
          {Object.keys(filteredCategories).length === 0 && (
            <div className={styles.sectionHint}>No services found for this filter.</div>
          )}
          {Object.entries(filteredCategories).map(([group, services]) => (
            <div key={group} className={styles.serviceCard}>
              <div className={styles.serviceGroupTitle}>{group}</div>
              <div className={styles.serviceList}>
                {services.map((s) => (
                  <label key={s} className={styles.checkRow}>
                    <input
                      type="checkbox"
                      checked={!!selectedServices[group]?.[s]}
                      onChange={() => toggleService(group, s)}
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Other services */}
        <div className={styles.inlineRow} style={{ justifyContent: 'space-between', marginTop: 12 }}>
          <button type="button" className={styles.btnOutlineSmall} onClick={addOtherService}>
            + Add Other Service
          </button>
        </div>
        <div className={styles.fieldGroup}>
          <input
            type="text"
            placeholder="Specify other service"
            value={otherService}
            onChange={(e) => setOtherService(e.target.value)}
            className={styles.input}
          />
          {otherServices.length > 0 && (
            <div className={styles.chipsWrap} style={{ marginTop: 8 }}>
              {otherServices.map((srv) => (
                <span key={srv} className={styles.chip}>
                  {srv}
                  <button
                    type="button"
                    className={styles.chipClose}
                    onClick={() => removeOtherService(srv)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Standards to Apply (no outer card) */}
      <div style={{ marginBottom: 16 }}>
        <div className={styles.inputLabel} style={{ marginBottom: 6 }}>
          Standards to Apply
        </div>

        <div className={styles.multiSelectWrap}>
          <button
            type="button"
            className={styles.multiSelectControl}
            onClick={() => setMsOpen((v) => !v)}
            aria-expanded={msOpen}
            aria-haspopup="listbox"
          >
            {selectedStandards.length === 0 && (
              <span className={styles.placeholder}>Select Standards</span>
            )}
            {selectedStandards.length > 0 && (
              <div className={styles.chipsInline}>
                {selectedStandards.map((s) => (
                  <span key={s} className={styles.chipSm}>
                    {s}
                    <button
                      type="button"
                      className={styles.chipClose}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStandard(s);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <span className={`${styles.inputIcon} ${styles.inputIconBig}`} aria-hidden>▾</span>
          </button>
          {msOpen && (
            <div role="listbox" className={styles.msPanel}>
              {standards.map((s) => (
                <label key={s} className={styles.msOption}>
                  <input
                    type="checkbox"
                    checked={selectedStandards.includes(s)}
                    onChange={() => toggleStandard(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Dates row */}
        <div className={styles.grid2} style={{ marginTop: 16 }}>
          <FormField
            control={control}
            name="strokeCertExpiry"
            label="Expiration Date of Current Stroke Certification"
            type="date"
          />
          <FormField
            control={control}
            name="applicationDate"
            label="Date of Application"
            type="date"
          />
        </div>
      </div>

      {/* Thrombolytics (no outer card) */}
      <div style={{ marginBottom: 16 }}>
        <div className={styles.inputLabel} style={{ fontWeight: 600, marginBottom: 8 }}>
          Dates of last twenty-five thrombolytic administrations
        </div>
        <input
          type="date"
          className={styles.input}
          onChange={(e) => addDateChip(setThrombolytics, thrombolytics, e.target.value)}
        />
        {thrombolytics.length > 0 && (
          <div className={styles.chipsWrap} style={{ marginTop: 8 }}>
            {thrombolytics.map((d) => (
              <span key={d} className={styles.chip}>
                {fmt(d)}
                <button
                  type="button"
                  className={styles.chipClose}
                  onClick={() => removeDateChip(setThrombolytics, thrombolytics, d)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Thrombectomies (no outer card) */}
      <div>
        <div className={styles.inputLabel} style={{ fontWeight: 600, marginBottom: 8 }}>
          Dates of last fifteen thrombectomies
        </div>
        <input
          type="date"
          className={styles.input}
          onChange={(e) => addDateChip(setThrombectomies, thrombectomies, e.target.value)}
        />
        {thrombectomies.length > 0 && (
          <div className={styles.chipsWrap} style={{ marginTop: 8 }}>
            {thrombectomies.map((d) => (
              <span key={d} className={styles.chip}>
                {fmt(d)}
                <button
                  type="button"
                  className={styles.chipClose}
                  onClick={() => removeDateChip(setThrombectomies, thrombectomies, d)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default Step5;
