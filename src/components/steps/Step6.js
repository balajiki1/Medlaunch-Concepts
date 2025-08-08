// ✅ src/components/steps/Step6.js
import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';

const InfoRow = ({ label, value }) => (
  <Box display="flex" mb={0.5}>
    <Typography fontWeight="bold" width="180px">{label}:</Typography>
    <Typography>{value}</Typography>
  </Box>
);

const ContactCard = ({ title, contact, onEdit }) => (
  <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography fontWeight="bold" gutterBottom>{title}</Typography>
      <IconButton size="small" color="primary" onClick={onEdit}>
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
    {contact.name && <InfoRow label="Name" value={contact.name} />}
    {contact.title && <InfoRow label="Title" value={contact.title} />}
    {contact.phone && <InfoRow label="Phone" value={contact.phone} />}
    {contact.email && <InfoRow label="Email" value={contact.email} />}
    {contact.address && <InfoRow label="Address" value={contact.address} />}
  </Paper>
);

const Step6 = forwardRef(({ formData, isCertified, setIsCertified, onDownloadPDF, onDownloadCSV, goToStep }, ref) => {
  useImperativeHandle(ref, () => ({
    validateForm: async () => true,
  }));

  const renderChips = (items) => (
    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
      {items.map((item, index) => (
        <Chip
          key={index}
          label={dayjs(item).isValid() ? dayjs(item).format('MM/DD/YYYY') : item}
          sx={{ backgroundColor: '#004B8D', color: 'white' }}
        />
      ))}
    </Box>
  );

  const renderAccordion = (title, content, stepNum) => (
    <Accordion defaultExpanded sx={{ borderRadius: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
        sx={{ bgcolor: '#004B8D', color: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Typography>{title}</Typography>
          <IconButton size="small" color="inherit" onClick={() => goToStep(stepNum)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{content}</AccordionDetails>
    </Accordion>
  );

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>Hospital Information</Typography>

      {renderAccordion('Basic Information', (
        <>
          <InfoRow label="Legal Entity Name" value={formData.legalEntityName} />
          <InfoRow label="d/b/a Name" value={formData.doingBusinessAs} />
          <Box mt={1}>
            <Typography fontWeight="bold">Primary Contact:</Typography>
            <Typography>
              {formData.firstName} {formData.lastName}<br />
              Work: {formData.primaryContactPhone} | Cell: {formData.cellPhone}<br />
              Email: {formData.primaryContactEmail}<br />
              Title: {formData.primaryContactTitle}
            </Typography>
          </Box>
        </>
      ), 1)}

      {renderAccordion('Facility Details', (
        <InfoRow label="Facility Type" value={formData.facilityType} />
      ), 2)}

      {renderAccordion('Leadership Contacts', (
        <>
          <ContactCard title="CEO" contact={{
            name: `${formData.ceoFirstName} ${formData.ceoLastName}`,
            phone: formData.ceoPhone,
            email: formData.ceoEmail,
          }} onEdit={() => goToStep(3)} />

          <ContactCard title="Director of Quality" contact={{
            name: `${formData.directorFirstName} ${formData.directorLastName}`,
            phone: formData.directorPhone,
            email: formData.directorEmail,
          }} onEdit={() => goToStep(3)} />

          <ContactCard title="Invoicing Contact" contact={{
            name: `${formData.invoiceFirstName} ${formData.invoiceLastName}`,
            phone: formData.invoicePhone,
            email: formData.invoiceEmail,
            address: `${formData.invoiceStreetAddress}, ${formData.invoiceCity}, ${formData.invoiceState}, ${formData.invoiceZipCode}`,
          }} onEdit={() => goToStep(3)} />
        </>
      ), 3)}

      {renderAccordion('Site Information', (
        <>
          <InfoRow label="Site Configuration" value={formData.multipleLocations === 'multiple' ? 'Multiple Locations' : 'Single Location'} />
          {formData.uploadedFiles?.map((file, index) => (
            <Typography key={index} mt={1}>{file.name}</Typography>
          ))}
        </>
      ), 4)}

      {renderAccordion('Services & Certifications', (
        <>
          <Typography fontWeight="bold">Services Provided</Typography>
          {renderChips([...Object.keys(formData.services), ...formData.otherServices])}

          <Typography fontWeight="bold" mt={2}>Standards to Apply</Typography>
          {renderChips(formData.selectedStandards)}

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Date of Application" value={formData.applicationDate} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Stroke Certification Expiry" value={formData.strokeCertExpiry} />
            </Grid>
          </Grid>

          <Typography fontWeight="bold" mt={2}>Thrombolytic Dates</Typography>
          {renderChips(formData.thrombolytics)}

          <Typography fontWeight="bold" mt={2}>Thrombectomy Dates</Typography>
          {renderChips(formData.thrombectomies)}
        </>
      ), 5)}

      <Paper variant="outlined" sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Ready to Submit?
        </Typography>
        <FormControlLabel
          control={<Checkbox checked={isCertified} onChange={(e) => setIsCertified(e.target.checked)} />}
          label="I certify that all information provided is accurate and complete to the best of my knowledge"
        />
        <Typography variant="body2" sx={{ mt: 1 }}>
          By submitting this form, you agree to our terms and conditions. DNV will review your application and contact you within 2–3 business days.
        </Typography>
        <Box display="flex" gap={2} mt={2} flexWrap="wrap">
          <Button variant="outlined" onClick={onDownloadPDF}>Download as PDF</Button>
          <Button variant="outlined" onClick={onDownloadCSV}>Export to CSV</Button>
        </Box>
      </Paper>
    </Box>
  );
});

export default Step6;
