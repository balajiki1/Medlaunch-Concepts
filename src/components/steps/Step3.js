import React, { forwardRef, useEffect } from 'react';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';

const Step3 = forwardRef(({ formData, handleChange }, ref) => {
  const {
    control,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
    mode: 'onTouched',
  });

  const sameAsCEO = useWatch({ control, name: 'sameAsCEO' });
  const sameAsDirector = useWatch({ control, name: 'sameAsDirector' });
  const sameAsInvoice = useWatch({ control, name: 'sameAsInvoice' });

  useEffect(() => {
    if (sameAsCEO) {
      setValue('ceoFirstName', formData.firstName);
      setValue('ceoLastName', formData.testLastName);
      setValue('ceoPhone', formData.primaryContactPhone);
      setValue('ceoEmail', formData.primaryContactEmail);
    }
  }, [sameAsCEO]);

  useEffect(() => {
    if (sameAsDirector) {
      setValue('directorFirstName', formData.firstName);
      setValue('directorLastName', formData.testLastName);
      setValue('directorPhone', formData.primaryContactPhone);
      setValue('directorEmail', formData.primaryContactEmail);
    }
  }, [sameAsDirector]);

  useEffect(() => {
    if (sameAsInvoice) {
      setValue('invoiceFirstName', formData.firstName);
      setValue('invoiceLastName', formData.testLastName);
      setValue('invoicePhone', formData.primaryContactPhone);
      setValue('invoiceEmail', formData.primaryContactEmail);
    }
  }, [sameAsInvoice]);

  React.useImperativeHandle(ref, () => ({
    validateForm: async () => {
      const valid = await trigger();
      if (valid) {
        const values = getValues();
        Object.entries(values).forEach(([key, value]) => {
          handleChange(key)({ target: { value } });
        });
        return true;
      }
      return false;
    },
  }));

  const renderContactSection = (title, prefix, includeCheckbox = false, checkboxName = '') => (
    <Box sx={{ mb: 5 }}>
      <Typography fontWeight={600} mb={1}>{title}</Typography>
      {includeCheckbox && (
        <FormControlLabel
          control={<Controller name={checkboxName} control={control} render={({ field }) => <Checkbox {...field} />} />}
          label="Same as Primary Contact entered in Step 1"
          sx={{ mb: 2 }}
        />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <InputLabel shrink>First Name *</InputLabel>
          <Controller
            name={`${prefix}FirstName`}
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => <TextField {...field} fullWidth error={!!errors[`${prefix}FirstName`]} helperText={errors[`${prefix}FirstName`]?.message} />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel shrink>Last Name *</InputLabel>
          <Controller
            name={`${prefix}LastName`}
            control={control}
            rules={{ required: 'Last name is required' }}
            render={({ field }) => <TextField {...field} fullWidth error={!!errors[`${prefix}LastName`]} helperText={errors[`${prefix}LastName`]?.message} />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel shrink>Phone *</InputLabel>
          <Controller
            name={`${prefix}Phone`}
            control={control}
            rules={{ required: 'Phone is required' }}
            render={({ field }) => <TextField {...field} fullWidth error={!!errors[`${prefix}Phone`]} helperText={errors[`${prefix}Phone`]?.message} />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel shrink>Email *</InputLabel>
          <Controller
            name={`${prefix}Email`}
            control={control}
            rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } }}
            render={({ field }) => <TextField {...field} fullWidth error={!!errors[`${prefix}Email`]} helperText={errors[`${prefix}Email`]?.message} />}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ px: 4, py: 5, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h6" fontWeight={600} mb={2}>Leadership Contacts</Typography>

      {renderContactSection('Chief Executive Officer (CEO)', 'ceo', true, 'sameAsCEO')}
      <Divider sx={{ my: 3 }} />

      {renderContactSection('Director of Quality', 'director', true, 'sameAsDirector')}
      <Divider sx={{ my: 3 }} />

      {renderContactSection('Invoicing Contact', 'invoice', true, 'sameAsInvoice')}

      <Typography fontWeight={600} mb={2}>Billing Address</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <InputLabel shrink>Street Address *</InputLabel>
          <Controller
            name="invoiceStreet"
            control={control}
            rules={{ required: 'Street address is required' }}
            render={({ field }) => <TextField {...field} fullWidth error={!!errors.invoiceStreet} helperText={errors.invoiceStreet?.message} />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputLabel shrink>City *</InputLabel>
          <Controller
            name="invoiceCity"
            control={control}
            rules={{ required: 'City is required' }}
            render={({ field }) => <TextField {...field} fullWidth error={!!errors.invoiceCity} helperText={errors.invoiceCity?.message} />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputLabel shrink>State *</InputLabel>
          <Controller
            name="invoiceState"
            control={control}
            rules={{ required: 'State is required' }}
            render={({ field }) => (
              <Select {...field} displayEmpty fullWidth error={!!errors.invoiceState}>
                <MenuItem value="">Select State</MenuItem>
                <MenuItem value="CA">California</MenuItem>
                <MenuItem value="NY">New York</MenuItem>
                <MenuItem value="TX">Texas</MenuItem>
                {/* Add more states as needed */}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputLabel shrink>ZIP Code *</InputLabel>
          <Controller
            name="invoiceZip"
            control={control}
            rules={{ required: 'ZIP Code is required' }}
            render={({ field }) => <TextField {...field} fullWidth error={!!errors.invoiceZip} helperText={errors.invoiceZip?.message} />}
          />
        </Grid>
      </Grid>
    </Box>
  );
});

export default Step3;
