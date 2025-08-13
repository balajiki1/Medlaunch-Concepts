import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import styles from '../../styles/form.module.css';

const Step4 = forwardRef(({ formData, handleChange }, ref) => {
  const [selected, setSelected] = useState(formData.multipleLocations || 'single'); // 'single' | 'multiple'
  const [files, setFiles] = useState(formData.uploadedFiles || []);

  useEffect(() => { handleChange('multipleLocations')(selected); }, [selected]); // sync up
  useEffect(() => { handleChange('uploadedFiles')(files); }, [files]);

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      handleChange('multipleLocations')(selected);
      handleChange('uploadedFiles')(files);
      return true;
    },
  }));

  const onSelect = (opt) => setSelected(opt);

  const addFiles = (fileList) => {
    const next = [...files];
    Array.from(fileList).forEach((f) => {
      if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    });
    setFiles(next);
  };

  const onInputChange = (e) => addFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };

  const downloadTemplate = () => {
    const csv = [
      'Site Name,Street Address,City,State,ZIP',
      'Main Campus,123 Example St,Denver,CO,80202',
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DNV_Sites_Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const removeFile = (idx) => {
    const next = files.slice();
    next.splice(idx, 1);
    setFiles(next);
  };

  return (
    <div className={styles.stepBox}>
      <h3 className={styles.sectionTitle}>Do you have multiple sites or locations?</h3>

      <div className={styles.choiceGrid}>
        <button
          type="button"
          className={`${styles.choiceCard} ${selected === 'single' ? styles.choiceActive : ''}`}
          onClick={() => onSelect('single')}
          aria-pressed={selected === 'single'}
        >
          <div className={styles.choiceTitle}>Single Location</div>
          <div className={styles.choiceHint}>We operate from one facility only</div>
        </button>

        <button
          type="button"
          className={`${styles.choiceCard} ${selected === 'multiple' ? styles.choiceActive : ''}`}
          onClick={() => onSelect('multiple')}
          aria-pressed={selected === 'multiple'}
        >
          <div className={styles.choiceTitle}>Multiple Locations</div>
          <div className={styles.choiceHint}>We have multiple facilities or practice locations</div>
        </button>
      </div>

      {selected === 'multiple' && (
        <div className={styles.subCard}>
          <div className={styles.inputLabel} style={{ fontWeight: 600, marginBottom: 8 }}>
            How would you like to add your site information?
          </div>

          {/* Upload method card */}
          <div className={styles.uploadMethod}>
            <div className={styles.uploadMethodTitle}>Upload CSV / Excel</div>
            <div className={styles.uploadMethodHint}>
              Upload a spreadsheet with all site information
            </div>
          </div>

          {/* Dropzone */}
          <div
            className={styles.dropZone}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={onDrop}
          >
            <div className={styles.dropIcon}>☁️</div>
            <div className={styles.dropTitle}>Upload Site Information</div>
            <div className={styles.dropHint}>
              Drag and drop your CSV or Excel file here, or click to select
            </div>

            <label className={styles.btnPrimary} style={{ marginTop: 12, cursor: 'pointer' }}>
              Select file
              <input
                type="file"
                hidden
                multiple
                accept=".csv,.xls,.xlsx"
                onChange={onInputChange}
              />
            </label>

            <button type="button" className={styles.linkBtn} onClick={downloadTemplate}>
              Download CSV Template
            </button>
          </div>

          {/* Uploaded list */}
          {files.length > 0 && (
            <div className={styles.fileList}>
              <div className={styles.inputLabel} style={{ marginBottom: 8 }}>Uploaded</div>
              {files.map((f, i) => (
                <div key={`${f.name}-${f.size}-${i}`} className={styles.fileItem}>
                  <span className={styles.fileIcon}>📄</span>
                  <span className={styles.fileName}>{f.name}</span>
                  <span className={styles.fileSize}>{(f.size / 1024).toFixed(1)} KB</span>

                  {/* NEW: round close icon button (SVG) */}
                  <button
                    type="button"
                    className={styles.fileRemove}
                    aria-label={`Remove ${f.name}`}
                    onClick={() => removeFile(i)}
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default Step4;
