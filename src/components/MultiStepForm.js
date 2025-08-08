// ✅ Updated MultiStepForm.js
import React, { useState, useRef, useEffect } from 'react';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import Step6 from './steps/Step6';
import {
  Typography,
  Button,
  Box,
} from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import '../App.css';

const LOCAL_STORAGE_KEY = 'dnvQuoteFormData';

function MultiStepForm() {
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
    testLastName: '',
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
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (input) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e?.target?.value ?? e;
    setFormData((prev) => ({
      ...prev,
      [input]: value,
    }));
  };

  const handleContinue = async () => {
    if (stepRef.current) {
      const valid = await stepRef.current.validateForm();
      if (valid) {
        nextStep();
      }
    }
  };

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    alert('Form saved!');
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
      `Facility Type: ${formData.facilityType}`,
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
      ['Facility Type', formData.facilityType],
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'DNV_Quote_Review.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = () => {
    if (!isCertified) return;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setStep(7);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 ref={stepRef} formData={formData} handleChange={handleChange} />;
      case 2: return <Step2 ref={stepRef} formData={formData} handleChange={handleChange} />;
      case 3: return <Step3 ref={stepRef} formData={formData} handleChange={handleChange} />;
      case 4: return <Step4 ref={stepRef} formData={formData} handleChange={handleChange} />;
      case 5: return <Step5 ref={stepRef} formData={formData} handleChange={handleChange} />;
      case 6: return (
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
          <Box textAlign="center" mt={10}>
            <Typography variant="h5" gutterBottom>🎉 Thank you for submitting the quote request!</Typography>
            <Button
  variant="contained"
  onClick={() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY); // ✅ Clear storage
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
    }); // ✅ Reset to initial state
    setStep(1);
    setIsCertified(false);
  }}
  sx={{ mt: 2 }}
>
  Start a New Form
</Button>

          </Box>
        );
    }
  };

  if (showStartScreen) {
    return (
      <div className="start-screen">
        <div className="start-card">
          <h1 className="start-title">Welcome to the DNV Health Care Form</h1>
          <p className="start-subtitle">Click below to begin your application process</p>
          <button className="start-button" onClick={() => setShowStartScreen(false)}>
            Start Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="multi-step-form-wrapper">
      <div className="form-top-bar">
        <div className="form-main-title">New DNV Quote Request</div>
        <div className="form-step-indicator">Step {step <= 6 ? step : 6} of 6</div>
      </div>

      <div className="linear-progressbar">
        {[
          'DNV Quote Request',
          'Facility Details',
          'Leadership Contacts',
          'Site Information',
          'Services & Certifications',
          'Review & Submit',
        ].map((label, index) => (
          <div
            key={index}
            className={`progress-step-linear ${step === index + 1 ? 'active' : ''} ${
              step > index + 1 ? 'completed' : ''
            }`}
          >
            <div className="progress-line" />
            <div className="progress-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="form-center-wrapper">
        <div className="form-card">
          {renderStep()}

          {step <= 6 && (
            <div
              className="navigation-buttons"
              style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}
            >
              <div>
                {step === 1 ? (
                  <button onClick={handleExit} className="btn-secondary">Exit</button>
                ) : (
                  <button onClick={prevStep} className="btn-secondary">Previous</button>
                )}
              </div>
              <div>
                {step < 6 && (
                  <button onClick={handleSave} className="btn-primary" style={{ marginRight: '10px' }}>
                    Save
                  </button>
                )}
                {step < 6 ? (
                  <button onClick={handleContinue} className="btn-primary">
                    Continue
                  </button>
                ) : (
                  <button
                    className="btn-primary"
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
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 24,
            width: 300,
            height: 350,
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
            zIndex: 1001,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ backgroundColor: '#004B8D', color: '#fff', padding: '12px', fontWeight: 'bold' }}>
            Support Chat
            <button
              onClick={() => setChatOpen(false)}
              style={{
                float: 'right',
                color: '#fff',
                background: 'none',
                border: 'none',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
          <div style={{ flex: 1, padding: '12px', fontSize: '14px' }}>
            <p>Hello 👋<br />How can we assist you today?</p>
          </div>
          <div style={{ padding: '8px', borderTop: '1px solid #ddd' }}>
            <input
              type="text"
              placeholder="Type your message..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      )}

      <button
        className="support-chat-button"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#004B8D',
          color: '#fff',
          border: 'none',
          padding: '10px 18px',
          borderRadius: '24px',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 1000
        }}
        onClick={() => setChatOpen(true)}
      >
        <SupportAgentIcon style={{ marginRight: 8 }} />
        Support Chat
      </button>
    </div>
  );
}

export default MultiStepForm;
