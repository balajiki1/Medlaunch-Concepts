// src/components/steps/Step4.js

import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import { useForm } from 'react-hook-form';

const Step4 = forwardRef(({ formData, handleChange }, ref) => {
  const {
    trigger,
    getValues,
    setValue,
  } = useForm({
    defaultValues: formData,
    mode: 'onTouched',
  });

  const [selectedOption, setSelectedOption] = useState(formData.multipleLocations || 'single');
  const [uploadedFiles, setUploadedFiles] = useState(formData.uploadedFiles || []);

  useEffect(() => {
    setValue('multipleLocations', selectedOption);
  }, [selectedOption, setValue]);

  useEffect(() => {
    setValue('uploadedFiles', uploadedFiles);
  }, [uploadedFiles, setValue]);

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      const isValid = await trigger();
      if (isValid) {
        const values = getValues();
        Object.entries(values).forEach(([key, value]) => {
          handleChange(key)({ target: { value, type: typeof value === 'boolean' ? 'checkbox' : 'text' } });
        });
      }
      return isValid;
    }
  }));

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);

    // Avoid duplicate files based on name + size
    const filteredNewFiles = newFiles.filter((file) =>
      !uploadedFiles.some((existingFile) => (
        existingFile.name === file.name && existingFile.size === file.size
      ))
    );

    const updatedFiles = [...uploadedFiles, ...filteredNewFiles];

    setUploadedFiles(updatedFiles);
    handleChange('uploadedFiles')({ target: { value: updatedFiles } });
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Do you have multiple sites or locations?
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Paper
            variant="outlined"
            sx={{
              padding: 2,
              borderColor: selectedOption === 'single' ? 'primary.main' : 'grey.300',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedOption('single')}
          >
            <Typography variant="subtitle1">Single Location</Typography>
            <Typography variant="body2" color="textSecondary">
              You operate from one facility only.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            variant="outlined"
            sx={{
              padding: 2,
              borderColor: selectedOption === 'multiple' ? 'primary.main' : 'grey.300',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedOption('multiple')}
          >
            <Typography variant="subtitle1">Multiple Locations</Typography>
            <Typography variant="body2" color="textSecondary">
              You have multiple facilities or practice locations.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {selectedOption === 'multiple' && (
        <Box border={1} borderColor="grey.300" borderRadius={2} p={3} sx={{ backgroundColor: '#f9f9f9' }}>
          <Typography variant="subtitle1" gutterBottom>
            How would you like to add your site information?
          </Typography>
          <Typography variant="body2" gutterBottom>
            Upload a spreadsheet with all sites information
          </Typography>

          <Box
            mt={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
            border="2px dashed #ccc"
            borderRadius={2}
            sx={{ backgroundColor: '#fff' }}
          >
            <CloudUploadIcon fontSize="large" color="action" />
            <Typography mt={1}>Upload Site Information</Typography>
            <Button variant="contained" component="label" sx={{ mt: 2 }}>
              Select Files
              <input
                type="file"
                hidden
                multiple
                accept=".csv, .xls, .xlsx, .pdf" // optional: restrict file types
                onChange={handleFileUpload}
              />
            </Button>
            <Typography variant="body2" mt={2} color="primary" sx={{ cursor: 'pointer' }}>
              Download CSV Template
            </Typography>
          </Box>

          {/* Uploaded File List */}
          {uploadedFiles.length > 0 && (
            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>Uploaded Files:</Typography>
              <List dense>
                {uploadedFiles.map((file, index) => (
                  <ListItem key={`${file.name}-${index}`}>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(1)} KB`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
});

export default Step4;
