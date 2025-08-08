import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

const Step2 = forwardRef(({ formData, handleChange }, ref) => {
  const [error, setError] = React.useState(false);

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
    <Box sx={{ maxWidth: '800px', mx: 'auto', px: 4, py: 5 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Facility Details
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 4 }} error={error}>
        <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
          Facility and Organization Type *
        </FormLabel>
        <RadioGroup
          name="facilityType"
          value={formData.facilityType}
          onChange={handleChange('facilityType')}
        >
          <FormControlLabel
            value="Inpatient Acute Care"
            control={<Radio />}
            label="Inpatient Acute Care"
          />
          <FormControlLabel
            value="Long-Term Acute Care"
            control={<Radio />}
            label="Long-Term Acute Care"
          />
          <FormControlLabel
            value="Critical Access"
            control={<Radio />}
            label="Critical Access"
          />
          <FormControlLabel
            value="Children's"
            control={<Radio />}
            label="Children's"
          />
          <FormControlLabel
            value="Non-Hospital/Free-Standing Psychiatric"
            control={<Radio />}
            label="Non-Hospital/Free-Standing Psychiatric"
          />
          <FormControlLabel
            value="Other"
            control={<Radio />}
            label="Other"
          />
        </RadioGroup>
        {error && (
          <Typography color="error" mt={1} variant="caption">
            Please select a facility type.
          </Typography>
        )}
      </FormControl>
    </Box>
  );
});

export default Step2;
