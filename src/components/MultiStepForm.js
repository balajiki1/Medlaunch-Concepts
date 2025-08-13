import React, { useState, useRef, useEffect } from 'react';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import Step6 from './steps/Step6';
import ProgressSteps from './ProgressSteps';
import styles from '../styles/form.module.css';

const LOCAL_STORAGE_KEY = 'dnvQuoteFormData';

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [isCertified, setIsCertified] = useState(false);
  const stepRef = useRef();

  const [formData, setFormData] = useState({
    legalEntityName: '',
    doingBusinessAs: '',
    sameAsLegal: false,
    firstName: '',
    lastName: '',
    primaryContactTitle: '',
    primaryContactPhone: '',
    cellPhone: '',
    primaryContactEmail: '',
    facilityType: '',

    ceoFirstName: '',
    ceoLastName: '',
    ceoPhone: '',
    ceoEmail: '',

    directorFirstName: '',
    directorLastName: '',
    directorPhone: '',
    directorEmail: '',

    invoiceFirstName: '',
    invoiceLastName: '',
    invoicePhone: '',
    invoiceEmail: '',
    invoiceStreetAddress: '',
    invoiceCity: '',
    invoiceState: '',
    invoiceZipCode: '',

    sameAsCEO: false,
    sameAsDirector: false,
    sameAsInvoice: false,

    multipleLocations: 'single',
    uploadedFiles: [],
    services: {},
    otherServices: [],
    selectedStandards: [],
    strokeCertExpiry: '',
    applicationDate: '',
    thrombolytics: [],
    thrombectomies: []
  });

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const nextStep = () => setStep((s) => Math.min(6, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleChange = (input) => (e) => {
    const value =
      e?.target?.type === 'checkbox' ? e.target.checked : e?.target?.value ?? e;
    setFormData((prev) => ({ ...prev, [input]: value }));
  };

  const handleContinue = async () => {
    if (stepRef.current) {
      const valid = await stepRef.current.validateForm();
      if (valid) nextStep();
    } else {
      nextStep();
    }
  };

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    console.info('[INFO] Form saved to localStorage');
  };

  const handleExit = () => {
    setShowStartScreen(true);
    setStep(1);
  };

  const handleDownloadPDF = () => {
    const docContent = [
      `Legal Entity Name: ${formData.legalEntityName}`,
      `d/b/a Name: ${formData.doingBusinessAs}`,
      `Primary Contact: ${formData.firstName} ${formData.lastName}`,
      `Phone: ${formData.primaryContactPhone}`,
      `Email: ${formData.primaryContactEmail}`,
      `Facility Type: ${formData.facilityType}`
    ].join('\n');

    const blob = new Blob([docContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'DNV_Quote_Review.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = () => {
    const headers = ['Field', 'Value'];
    const rows = [
      ['Legal Entity Name', formData.legalEntityName],
      ['d/b/a Name', formData.doingBusinessAs],
      ['Primary Contact', `${formData.firstName} ${formData.lastName}`],
      ['Phone', formData.primaryContactPhone],
      ['Email', formData.primaryContactEmail],
      ['Facility Type', formData.facilityType]
    ];

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'DNV_Quote_Review.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Enhanced reviewer-friendly console output
  const handleSubmit = () => {
    if (!isCertified) return;

    const payload = { ...formData, submittedAt: new Date().toISOString() };

    console.groupCollapsed(
      '%cDNV Quote Submission',
      'color:#fff;background:#0d3b66;padding:2px 6px;border-radius:4px;'
    );
    console.log('Raw object →', payload);
    console.log('JSON →\n', JSON.stringify(payload, null, 2));

    // Show simple fields as a quick table
    const scalarEntries = Object.entries(payload).filter(
      ([, v]) => v == null || ['string', 'number', 'boolean'].includes(typeof v)
    );
    if (scalarEntries.length) {
      console.table(Object.fromEntries(scalarEntries));
    }

    // Also expose for easy reuse in DevTools
    window.__DNV_LAST_PAYLOAD__ = payload;
    console.info('Tip: Access last payload via window.__DNV_LAST_PAYLOAD__');
    console.groupEnd();

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setStep(7);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 ref={stepRef} formData={formData} handleChange={handleChange} />;
      case 2:
        return <Step2 ref={stepRef} formData={formData} handleChange={handleChange} />;
      case 3:
        return <Step3 ref={stepRef} formData={formData} handleChange={handleChange} />;
      case 4:
        return <Step4 ref={stepRef} formData={formData} handleChange={handleChange} />;
      case 5:
        return <Step5 ref={stepRef} formData={formData} handleChange={handleChange} />;
      case 6:
        return (
          <Step6
            ref={stepRef}
            formData={formData}
            isCertified={isCertified}
            setIsCertified={setIsCertified}
            onDownloadPDF={handleDownloadPDF}
            onDownloadCSV={handleDownloadCSV}
            goToStep={setStep}
          />
        );
      default:
        return (
          <div className={styles.thankyouBox}>
            <h3>🎉 Thank you for submitting the quote request!</h3>
            <button
              className={styles.btnPrimary}
              onClick={() => {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                setFormData({
                  legalEntityName: '',
                  doingBusinessAs: '',
                  sameAsLegal: false,
                  firstName: '',
                  lastName: '',
                  primaryContactTitle: '',
                  primaryContactPhone: '',
                  cellPhone: '',
                  primaryContactEmail: '',
                  facilityType: '',
                  ceoFirstName: '',
                  ceoLastName: '',
                  ceoPhone: '',
                  ceoEmail: '',
                  directorFirstName: '',
                  directorLastName: '',
                  directorPhone: '',
                  directorEmail: '',
                  invoiceFirstName: '',
                  invoiceLastName: '',
                  invoicePhone: '',
                  invoiceEmail: '',
                  invoiceStreetAddress: '',
                  invoiceCity: '',
                  invoiceState: '',
                  invoiceZipCode: '',
                  sameAsCEO: false,
                  sameAsDirector: false,
                  sameAsInvoice: false,
                  multipleLocations: 'single',
                  uploadedFiles: [],
                  services: {},
                  otherServices: [],
                  selectedStandards: [],
                  strokeCertExpiry: '',
                  applicationDate: '',
                  thrombolytics: [],
                  thrombectomies: []
                });
                setStep(1);
                setIsCertified(false);
              }}
            >
              Start a New Form
            </button>
          </div>
        );
    }
  };

  if (showStartScreen) {
    return (
      <div className={styles.startScreen}>
        <div className={styles.startCard}>
          <h1 className={styles.startTitle}>Welcome to the DNV Health Care Form</h1>
          <p className={styles.startSubtitle}>Click below to begin your application process</p>
          <button className={styles.startButton} onClick={() => setShowStartScreen(false)}>
            Start Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <div className={styles.mainTitle}>New DNV Quote Request</div>
        <div className={styles.stepIndicator}>Step {Math.min(step, 6)} of 6</div>
      </div>

      <ProgressSteps step={step} />

      <div className={styles.centerWrapper}>
        <div className={styles.card}>
          {renderStep()}

          {step <= 6 && (
            <div className={styles.navButtons}>
              <div>
                {step === 1 ? (
                  <button onClick={handleExit} className={styles.btnSecondary}>
                    Exit
                  </button>
                ) : (
                  <button onClick={prevStep} className={styles.btnSecondary}>
                    Previous
                  </button>
                )}
              </div>
              <div>
                {step < 6 && (
                  <button
                    onClick={handleSave}
                    className={styles.btnSecondary}
                    style={{ marginRight: '10px' }}
                  >
                    Save
                  </button>
                )}
                {step < 6 ? (
                  <button onClick={handleContinue} className={styles.btnPrimary}>
                    Continue
                  </button>
                ) : (
                  <button
                    className={`${styles.btnPrimary} ${!isCertified ? styles.btnDisabled : ''}`}
                    onClick={handleSubmit}
                    disabled={!isCertified}
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {chatOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <span>Support Chat</span>
            <button onClick={() => setChatOpen(false)} className={styles.iconButton}>
              ×
            </button>
          </div>
          <div className={styles.chatBody}>
            <p>
              Hello 👋
              <br />
              How can we assist you today?
            </p>
          </div>
          <div className={styles.chatFooter}>
            <input type="text" placeholder="Type your message..." className={styles.chatInput} />
          </div>
        </div>
      )}

      <button className={styles.chatToggle} onClick={() => setChatOpen(true)}>
        <span style={{ marginRight: 8 }}>💬</span>
        Support Chat
      </button>
    </div>
  );
}
