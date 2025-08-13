import React, { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../../styles/form.module.css';

const fmt = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
};

const pickSelectedServices = (servicesObj) => {
  const out = [];
  Object.entries(servicesObj || {}).forEach(([, map]) => {
    Object.entries(map || {}).forEach(([name, val]) => {
      if (val) out.push(name);
    });
  });
  return out;
};

const InfoRow = ({ label, value }) => (
  <div className={styles.infoRow}>
    <div className={styles.infoLabel}>{label}:</div>
    <div className={styles.infoValue}>{value || '—'}</div>
  </div>
);

const ContactCard = ({ title, contact, onEdit }) => (
  <div className={styles.contactCard}>
    <div className={styles.contactHead}>
      <div className={styles.contactTitle}>{title}</div>
      <button type="button" className={styles.linkWhite} onClick={onEdit} aria-label={`Edit ${title}`}>
        Edit
      </button>
    </div>
    {contact.name && <InfoRow label="Name" value={contact.name} />}
    {contact.title && <InfoRow label="Title" value={contact.title} />}
    {contact.phone && <InfoRow label="Phone" value={contact.phone} />}
    {contact.email && <InfoRow label="Email" value={contact.email} />}
    {contact.address && <InfoRow label="Address" value={contact.address} />}
  </div>
);

const Section = ({ title, children, defaultOpen = true, onEdit }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.reviewSection}>
      <button
        type="button"
        className={styles.reviewHeader}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.reviewTitle}>{title}</span>
        <div className={styles.reviewActions}>
          <button type="button" className={styles.linkWhite} onClick={(e)=>{e.stopPropagation(); onEdit?.();}}>
            Edit
          </button>
          <span className={styles.caret} aria-hidden>{open ? '▾' : '▸'}</span>
        </div>
      </button>
      {open && <div className={styles.reviewBody}>{children}</div>}
    </div>
  );
};

const Step6 = forwardRef(
  ({ formData, isCertified, setIsCertified, onDownloadPDF, onDownloadCSV, goToStep }, ref) => {
    useImperativeHandle(ref, () => ({
      validateForm: async () => true, // nothing to validate on review
    }));

    const selectedServiceNames = pickSelectedServices(formData.services);
    const allServices = [...selectedServiceNames, ...(formData.otherServices || [])];

    const street = formData.invoiceStreetAddress || formData.invoiceStreet || '';
    const zip = formData.invoiceZipCode || formData.invoiceZip || '';

    return (
      <div className={styles.stepBox}>
        <h3 className={styles.sectionTitle}>Hospital Information</h3>

        <Section title="Basic Information" onEdit={() => goToStep?.(1)}>
          <InfoRow label="Legal Entity Name" value={formData.legalEntityName} />
          <InfoRow label="d/b/a Name" value={formData.doingBusinessAs} />
          <div className={styles.blockHead}>Primary Contact</div>
          <div className={styles.blockBox}>
            <InfoRow label="Name" value={`${formData.firstName || ''} ${formData.lastName || ''}`.trim()} />
            <InfoRow label="Title" value={formData.primaryContactTitle} />
            <InfoRow
              label="Phone"
              value={`Work: ${formData.primaryContactPhone || '—'} | Cell: ${formData.cellPhone || '—'}`}
            />
            <InfoRow label="Email" value={formData.primaryContactEmail} />
          </div>
        </Section>

        <Section title="Facility Details" onEdit={() => goToStep?.(2)}>
          <InfoRow label="Facility Type" value={formData.facilityType} />
        </Section>

        <Section title="Leadership Contacts" onEdit={() => goToStep?.(3)}>
          <ContactCard
            title="CEO"
            contact={{
              name: `${formData.ceoFirstName || ''} ${formData.ceoLastName || ''}`.trim(),
              phone: formData.ceoPhone,
              email: formData.ceoEmail,
            }}
            onEdit={() => goToStep?.(3)}
          />
          <ContactCard
            title="Director of Quality"
            contact={{
              name: `${formData.directorFirstName || ''} ${formData.directorLastName || ''}`.trim(),
              phone: formData.directorPhone,
              email: formData.directorEmail,
            }}
            onEdit={() => goToStep?.(3)}
          />
          <ContactCard
            title="Invoicing Contact"
            contact={{
              name: `${formData.invoiceFirstName || ''} ${formData.invoiceLastName || ''}`.trim(),
              phone: formData.invoicePhone,
              email: formData.invoiceEmail,
              address: [street, formData.invoiceCity, formData.invoiceState, zip]
                .filter(Boolean)
                .join(', '),
            }}
            onEdit={() => goToStep?.(3)}
          />
        </Section>

        <Section title="Site Information" onEdit={() => goToStep?.(4)}>
          <InfoRow
            label="Site Configuration"
            value={formData.multipleLocations === 'multiple' ? 'Multiple Locations' : 'Single Location'}
          />
          {(formData.uploadedFiles || []).length > 0 && (
            <>
              <div className={styles.blockHead}>Uploaded</div>
              <div className={styles.fileList}>
                {(formData.uploadedFiles || []).map((f, i) => (
                  <div key={`${f.name || 'file'}-${i}`} className={styles.fileItem}>
                    <span className={styles.fileIcon}>📄</span>
                    <span className={styles.fileName}>{f.name || `File ${i + 1}`}</span>
                    {typeof f.size === 'number' && (
                      <span className={styles.fileSize}>{(f.size / 1024).toFixed(1)} KB</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </Section>

        <Section title="Services & Certifications" onEdit={() => goToStep?.(5)}>
          <div className={styles.blockHead}>Services Provided</div>
          <div className={styles.chipsWrap}>
            {allServices.length === 0 && <span className={styles.muted}>No services selected.</span>}
            {allServices.map((s, i) => (
              <span key={`${s}-${i}`} className={styles.chip}>{s}</span>
            ))}
          </div>

          <div className={styles.blockHead} style={{ marginTop: 12 }}>Standards to Apply</div>
          <div className={styles.chipsWrap}>
            {(formData.selectedStandards || []).length === 0 && (
              <span className={styles.muted}>No standards selected.</span>
            )}
            {(formData.selectedStandards || []).map((s) => (
              <span key={s} className={styles.chipSm}>{s}</span>
            ))}
          </div>

          <div className={styles.grid2} style={{ marginTop: 12 }}>
            <InfoRow label="Date of Application" value={fmt(formData.applicationDate)} />
            <InfoRow label="Expiration Date of Current Stroke Certification" value={fmt(formData.strokeCertExpiry)} />
          </div>

          <div className={styles.blockHead} style={{ marginTop: 12 }}>
            Dates of last twenty-five thrombolytic administrations
          </div>
          <div className={styles.chipsWrap}>
            {(formData.thrombolytics || []).map((d) => (
              <span key={d} className={styles.chip}>{fmt(d)}</span>
            ))}
            {(formData.thrombolytics || []).length === 0 && <span className={styles.muted}>—</span>}
          </div>

          <div className={styles.blockHead} style={{ marginTop: 12 }}>
            Dates of last fifteen thrombectomies
          </div>
          <div className={styles.chipsWrap}>
            {(formData.thrombectomies || []).map((d) => (
              <span key={d} className={styles.chip}>{fmt(d)}</span>
            ))}
            {(formData.thrombectomies || []).length === 0 && <span className={styles.muted}>—</span>}
          </div>
        </Section>

        {/* Ready to Submit */}
        <div className={styles.readyBox}>
          <div className={styles.inputLabel} style={{ fontWeight: 700, marginBottom: 8 }}>
            Ready to Submit?
          </div>

          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={!!isCertified}
              onChange={(e) => setIsCertified?.(e.target.checked)}
            />
            <span>
              I certify that all information provided is accurate and complete to the best of my
              knowledge
            </span>
          </label>

          <div className={styles.muted} style={{ marginTop: 6 }}>
            By submitting this form, you agree to our terms and conditions. DNV will review your
            application and contact you within 2–3 business days.
          </div>

          <div className={styles.inlineRow} style={{ marginTop: 12, flexWrap: 'wrap' }}>
            <button type="button" className={styles.btnOutline} onClick={onDownloadPDF}>
              Download as PDF
            </button>
            <button type="button" className={styles.btnOutline} onClick={onDownloadCSV}>
              Export to CSV
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default Step6;
