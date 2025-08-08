// src/components/steps/Step5.js
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';

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
  const { control, trigger, getValues } = useForm({
    defaultValues: formData,
    mode: 'onTouched',
  });

  const [tabIndex, setTabIndex] = useState(0);
  const [selectedServices, setSelectedServices] = useState(formData.services || {});
  const [otherService, setOtherService] = useState('');
  const [otherServices, setOtherServices] = useState(formData.otherServices || []);
  const [selectedStandards, setSelectedStandards] = useState(formData.selectedStandards || []);
  const [thrombolytics, setThrombolytics] = useState(formData.thrombolytics || []);
  const [thrombectomies, setThrombectomies] = useState(formData.thrombectomies || []);

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      const isValid = await trigger();
      if (isValid) {
        const values = getValues();
        handleChange('services')({ target: { value: selectedServices } });
        handleChange('otherServices')({ target: { value: otherServices } });
        handleChange('selectedStandards')({ target: { value: selectedStandards } });
        handleChange('thrombolytics')({ target: { value: thrombolytics } });
        handleChange('thrombectomies')({ target: { value: thrombectomies } });
        Object.entries(values).forEach(([key, value]) => {
          if (!['services', 'otherServices', 'selectedStandards', 'thrombolytics', 'thrombectomies'].includes(key)) {
            handleChange(key)({ target: { value, type: typeof value === 'boolean' ? 'checkbox' : 'text' } });
          }
        });
      }
      return isValid;
    },
  }));

  const handleCheckboxChange = (group, service) => {
    setSelectedServices((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [service]: !prev[group]?.[service],
      },
    }));
  };

  const handleAddOtherService = () => {
    if (otherService.trim()) {
      setOtherServices((prev) => [...prev, otherService.trim()]);
      setOtherService('');
    }
  };

  const handleAddDateChip = (setter, list, value) => {
    if (value && !list.includes(value)) {
      setter([...list, value]);
    }
  };

  const handleDeleteChip = (setter, list, value) => {
    setter(list.filter((v) => v !== value));
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Primary Contact Information
      </Typography>
      <Typography variant="body2" mb={2}>
        Primary contact receives all DNV Healthcare official communications
      </Typography>

      <Tabs value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)} sx={{ mb: 2 }}>
        {tabLabels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      <Grid container spacing={2}>
        {Object.entries(serviceCategories).map(([group, services]) => (
          <Grid item xs={12} md={6} key={group}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                {group}
              </Typography>
              <FormGroup>
                {services.map((service) => (
                  <FormControlLabel
                    key={service}
                    control={
                      <Checkbox
                        checked={!!selectedServices[group]?.[service]}
                        onChange={() => handleCheckboxChange(group, service)}
                      />
                    }
                    label={service}
                  />
                ))}
              </FormGroup>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={3}>
        <Button variant="outlined" onClick={handleAddOtherService} sx={{ mb: 1 }}>
          + Add Other Service
        </Button>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {otherServices.map((srv, index) => (
            <Chip
              key={index}
              label={srv}
              onDelete={() => setOtherServices((prev) => prev.filter((item) => item !== srv))}
              sx={{ backgroundColor: '#004B8D', color: 'white' }}
            />
          ))}
        </Box>
        <TextField
          label="Specify other service"
          value={otherService}
          onChange={(e) => setOtherService(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
      </Box>

      <Box mt={4}>
        <InputLabel id="standards-label">Standards to Apply</InputLabel>
        <Select
          labelId="standards-label"
          multiple
          value={selectedStandards}
          onChange={(e) => setSelectedStandards(e.target.value)}
          input={<OutlinedInput />}
          fullWidth
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  sx={{ backgroundColor: '#004B8D', color: 'white' }}
                />
              ))}
            </Box>
          )}
        >
          {standards.map((std) => (
            <MenuItem key={std} value={std}>
              {std}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="strokeCertExpiry"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Expiration Date of Current Stroke Certification"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="applicationDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Date of Application"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      <Box mt={4}>
        <Typography variant="subtitle1">
          Dates of last twenty-five thrombolytic administrations
        </Typography>
        <TextField
          type="date"
          onChange={(e) => handleAddDateChip(setThrombolytics, thrombolytics, e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
          {thrombolytics.map((date) => (
            <Chip
              key={date}
              label={dayjs(date).format('MM/DD/YYYY')}
              onDelete={() => handleDeleteChip(setThrombolytics, thrombolytics, date)}
              sx={{ backgroundColor: '#004B8D', color: 'white' }}
            />
          ))}
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="subtitle1">Dates of last fifteen thrombectomies</Typography>
        <TextField
          type="date"
          onChange={(e) => handleAddDateChip(setThrombectomies, thrombectomies, e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
          {thrombectomies.map((date) => (
            <Chip
              key={date}
              label={dayjs(date).format('MM/DD/YYYY')}
              onDelete={() => handleDeleteChip(setThrombectomies, thrombectomies, date)}
              sx={{ backgroundColor: '#004B8D', color: 'white' }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
});

export default Step5;
