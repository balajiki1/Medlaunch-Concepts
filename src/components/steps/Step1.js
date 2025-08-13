import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormField from '../common/FormField';
import styles from '../../styles/form.module.css';

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

  // keep local form in sync with parent on mount/prop change
  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      const ok = await trigger();
      if (!ok) return false;

      const values = getValues();
      Object.entries(values).forEach(([k, v]) =>
        handleChange(k)({
          target: { type: typeof v === 'boolean' ? 'checkbox' : 'text', checked: v, value: v },
        })
      );
      return true;
    },
  }));

  return (
    <div className={styles.stepBox}>
      <h3 className={styles.sectionTitle}>Identify Healthcare Organization</h3>

      <FormField
        control={control}
        name="legalEntityName"
        label="Legal Entity Name"
        rules={{ required: 'Legal Entity Name is required' }}
        autoComplete="organization"
        onValueChange={handleChange('legalEntityName')}
      />

      <FormField
        control={control}
        name="doingBusinessAs"
        label="Doing Business As (d/b/a) Name"
        rules={{ required: 'd/b/a Name is required' }}
        onValueChange={handleChange('doingBusinessAs')}
      />

      {/* One-time copy from Legal into DBA */}
      <label className={styles.checkboxRow} aria-label="Same as Legal Entity Name">
        <Controller
          name="sameAsLegal"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={!!field.value}
              onChange={(e) => {
                const checked = e.target.checked;
                field.onChange(checked);
                // sync checkbox to parent
                handleChange('sameAsLegal')({ target: { type: 'checkbox', checked } });

                if (checked) {
                  const legal = getValues('legalEntityName') || '';
                  setValue('doingBusinessAs', legal, { shouldValidate: true, shouldDirty: true });
                  // sync DBA to parent immediately
                  handleChange('doingBusinessAs')({ target: { value: legal } });
                }
              }}
            />
          )}
        />
        <span>Same as Legal Entity Name</span>
      </label>

      <hr className={styles.divider} />

      <h3 className={styles.sectionTitle}>Primary Contact Information</h3>
      <p className={styles.sectionHint}>
        Primary contact receives all DNV Healthcare official communications
      </p>

      <div className={styles.grid2}>
        <FormField
          control={control}
          name="firstName"
          label="First Name"
          rules={{ required: 'First Name is required' }}
          autoComplete="given-name"
          onValueChange={handleChange('firstName')}
        />
        <FormField
          control={control}
          name="lastName"
          label="Last Name"
          rules={{ required: 'Last Name is required' }}
          autoComplete="family-name"
          onValueChange={handleChange('lastName')}
        />
      </div>

      <FormField
        control={control}
        name="primaryContactTitle"
        label="Title"
        rules={{ required: 'Title is required' }}
        autoComplete="organization-title"
        onValueChange={handleChange('primaryContactTitle')}
      />

      <div className={styles.grid2}>
        <FormField
          control={control}
          name="primaryContactPhone"
          label="Work Phone"
          type="tel"
          rules={{ required: 'Work Phone is required' }}
          autoComplete="tel"
          onValueChange={handleChange('primaryContactPhone')}
        />
        <FormField
          control={control}
          name="cellPhone"
          label="Cell Phone"
          type="tel"
          autoComplete="tel-national"
          onValueChange={handleChange('cellPhone')}
        />
      </div>

      {/* Email with right-slot refresh icon */}
      <FormField
        control={control}
        name="primaryContactEmail"
        label="Email"
        type="email"
        rules={{
          required: 'Email is required',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
        }}
        autoComplete="email"
        onValueChange={handleChange('primaryContactEmail')}
        rightSlot={
          <button
            type="button"
            className={styles.iconBtn}
            title="Refresh"
            aria-label="Refresh email"
            onClick={() => {
              const current = getValues('primaryContactEmail') || '';
              setValue('primaryContactEmail', current, { shouldValidate: true, shouldDirty: true });
              handleChange('primaryContactEmail')({ target: { value: current } });
            }}
          >
            ↻
          </button>
        }
      />

      {/* Verification row */}
      <div className={`${styles.inlineRow} ${styles.verifyRow}`}>
        <button type="button" className={styles.btnOutlineSmall}>Send Verification Email</button>
        <span className={styles.badgeWarn}>Not verified</span>
      </div>
    </div>
  );
});

export default Step1;
