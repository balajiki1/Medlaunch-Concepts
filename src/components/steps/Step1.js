// File: src/components/steps/Step1.js

import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';

const Step1 = forwardRef(({ formData, handleChange }, ref) => {
  const {
    control,
    trigger,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
    mode: 'onTouched',
  });

  const sameAsLegal = useWatch({ control, name: 'sameAsLegal' });
  const legalEntityName = useWatch({ control, name: 'legalEntityName' });

  // Sync formData from parent into this step
  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  // Auto-fill first and last name from legal entity name
  useEffect(() => {
    if (sameAsLegal && legalEntityName) {
      const names = legalEntityName.trim().split(' ');
      setValue('firstName', names[0] || '');
      setValue('lastName', names.slice(1).join(' ') || '');
    }
  }, [sameAsLegal, legalEntityName, setValue]);

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      const result = await trigger();
      if (result) {
        const values = getValues();
        Object.entries(values).forEach(([key, value]) => {
          handleChange(key)({
            target: {
              type: typeof value === 'boolean' ? 'checkbox' : 'text',
              checked: value,
              value,
            },
          });
        });
        return true;
      }
      return false;
    },
  }));

  const inputStyle = {
    height: '48px',
    padding: '8px 16px',
    fontSize: '14px',
  };

  const renderField = (label, name, isRequired, type = 'text') => (
    <>
      <InputLabel shrink htmlFor={name}>
        {label} {isRequired && '*'}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        rules={
          isRequired
            ? {
                required: `${label} is required`,
                ...(type === 'email' && {
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Enter a valid email address',
                  },
                }),
              }
            : {}
        }
        render={({ field }) => (
          <TextField
            {...field}
            id={name}
            fullWidth
            type={type}
            inputProps={{ style: inputStyle }}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            sx={{ mb: 4 }}
          />
        )}
      />
    </>
  );

  return (
    <Box sx={{ px: 4, py: 5, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Identify Healthcare Organization
      </Typography>

      {renderField('Legal Entity Name', 'legalEntityName', true)}
      {renderField('Doing Business As (d/b/a) Name', 'doingBusinessAs', true)}

      <FormControlLabel
        sx={{ mb: 4 }}
        control={
          <Controller
            name="sameAsLegal"
            control={control}
            render={({ field }) => <Checkbox {...field} checked={field.value} />}
          />
        }
        label="Same as Legal Entity Name"
      />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" fontWeight={600} mb={0.5}>
        Primary Contact Information
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Primary contact receives all DNV Healthcare official communications
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {renderField('First Name', 'firstName', true)}
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderField('Last Name', 'testLastName', true)}
        </Grid>
        <Grid item xs={12}>
          {renderField('Title', 'primaryContactTitle', true)}
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderField('Work Phone', 'primaryContactPhone', true)}
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderField('Cell Phone', 'cellPhone', false)}
        </Grid>
        <Grid item xs={12}>
          {renderField('Email', 'primaryContactEmail', true, 'email')}
        </Grid>
        <Grid item xs={12} display="flex" alignItems="center" gap={2}>
          <Button variant="outlined">Send Verification Email</Button>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              backgroundColor: '#fff7e6',
              color: '#cc8b00',
              borderRadius: '12px',
              padding: '4px 12px',
              fontWeight: 500,
            }}
          >
            Not verified
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
});

export default Step1;
