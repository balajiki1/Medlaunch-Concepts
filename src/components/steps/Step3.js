import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormField from '../common/FormField';
import styles from '../../styles/form.module.css';

const STATES = [
  { v: '', n: 'Select State' },
  { v: 'AL', n: 'Alabama' }, { v: 'AK', n: 'Alaska' }, { v: 'AZ', n: 'Arizona' },
  { v: 'CA', n: 'California' }, { v: 'CO', n: 'Colorado' }, { v: 'CT', n: 'Connecticut' },
  { v: 'FL', n: 'Florida' }, { v: 'GA', n: 'Georgia' }, { v: 'IL', n: 'Illinois' },
  { v: 'MA', n: 'Massachusetts' }, { v: 'NY', n: 'New York' }, { v: 'TX', n: 'Texas' },
];

const Step3 = forwardRef(({ formData, handleChange }, ref) => {
  const {
    control, trigger, getValues, setValue, reset,
    formState: { errors },
  } = useForm({ defaultValues: formData, mode: 'onTouched' });

  useEffect(() => { reset(formData); }, [formData, reset]);

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      const ok = await trigger();
      if (!ok) return false;

      // push all values to parent only on Continue
      const values = getValues();
      Object.entries(values).forEach(([k, v]) =>
        handleChange(k)({
          target: { type: typeof v === 'boolean' ? 'checkbox' : 'text', checked: v, value: v },
        })
      );
      return true;
    },
  }));

  // Copy from Step 1 primary contact into a specific group (local only)
  const copyPrimaryTo = (prefix) => {
    const { firstName, lastName, primaryContactPhone, primaryContactEmail } = formData;
    const payload = {
      [`${prefix}FirstName`]: firstName || '',
      [`${prefix}LastName`]: lastName || '',
      [`${prefix}Phone`]: primaryContactPhone || '',
      [`${prefix}Email`]: primaryContactEmail || '',
    };
    Object.entries(payload).forEach(([k, v]) => {
      setValue(k, v, { shouldValidate: true, shouldDirty: true });
    });
  };

  // Clear a specific group (local only)
  const clearContact = (prefix) => {
    const payload = {
      [`${prefix}FirstName`]: '',
      [`${prefix}LastName`]: '',
      [`${prefix}Phone`]: '',
      [`${prefix}Email`]: '',
    };
    Object.entries(payload).forEach(([k, v]) => {
      setValue(k, v, { shouldValidate: true, shouldDirty: true });
    });
  };

  const SubCard = ({ title, children }) => (
    <div className={styles.subCard}>
      <div className={styles.inputLabel} style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div className={styles.stepBox}>
      <h3 className={styles.sectionTitle}>Contact Information</h3>

      {/* CEO */}
      <SubCard title="Chief Executive Officer (CEO)">
        <label className={styles.checkboxRow} style={{ marginTop: 0 }}>
          <Controller
            name="sameAsCEO"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => {
                  const checked = e.target.checked;
                  field.onChange(checked);
                  if (checked) copyPrimaryTo('ceo');
                  else clearContact('ceo');
                }}
              />
            )}
          />
          <span className={styles.sectionHint} style={{ margin: 0 }}>
            Same as Primary Contact entered in Step 1
          </span>
        </label>

        <div className={styles.grid2}>
          <FormField
            control={control}
            name="ceoFirstName"
            label="First Name"
            rules={{ required: 'First name is required' }}
            autoComplete="given-name"
          />
          <FormField
            control={control}
            name="ceoLastName"
            label="Last Name"
            rules={{ required: 'Last name is required' }}
            autoComplete="family-name"
          />
        </div>
        <FormField
          control={control}
          name="ceoPhone"
          label="Phone"
          type="tel"
          rules={{ required: 'Phone is required' }}
          autoComplete="tel"
        />
        <FormField
          control={control}
          name="ceoEmail"
          label="Email"
          type="email"
          rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } }}
          autoComplete="email"
        />
      </SubCard>

      {/* Director of Quality */}
      <SubCard title="Director of Quality">
        <label className={styles.checkboxRow} style={{ marginTop: 0 }}>
          <Controller
            name="sameAsDirector"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => {
                  const checked = e.target.checked;
                  field.onChange(checked);
                  if (checked) copyPrimaryTo('director');
                  else clearContact('director');
                }}
              />
            )}
          />
          <span className={styles.sectionHint} style={{ margin: 0 }}>
            Same as Primary Contact entered in Step 1
          </span>
        </label>

        <div className={styles.grid2}>
          <FormField
            control={control}
            name="directorFirstName"
            label="First Name"
            autoComplete="given-name"
          />
          <FormField
            control={control}
            name="directorLastName"
            label="Last Name"
            autoComplete="family-name"
          />
        </div>
        <FormField
          control={control}
          name="directorPhone"
          label="Phone"
          type="tel"
          autoComplete="tel"
        />
        <FormField
          control={control}
          name="directorEmail"
          label="Email"
          type="email"
          rules={{ pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } }}
          autoComplete="email"
        />
      </SubCard>

      {/* Invoicing Contact */}
      <SubCard title="Invoicing Contact">
        <label className={styles.checkboxRow} style={{ marginTop: 0 }}>
          <Controller
            name="sameAsInvoice"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => {
                  const checked = e.target.checked;
                  field.onChange(checked);
                  if (checked) copyPrimaryTo('invoice');
                  else clearContact('invoice');
                }}
              />
            )}
          />
          <span className={styles.sectionHint} style={{ margin: 0 }}>
            Same as Primary Contact entered in Step 1
          </span>
        </label>

        <div className={styles.grid2}>
          <FormField
            control={control}
            name="invoiceFirstName"
            label="First Name"
            rules={{ required: 'First name is required' }}
            autoComplete="given-name"
          />
          <FormField
            control={control}
            name="invoiceLastName"
            label="Last Name"
            rules={{ required: 'Last name is required' }}
            autoComplete="family-name"
          />
        </div>
        <FormField
          control={control}
          name="invoicePhone"
          label="Phone"
          type="tel"
          rules={{ required: 'Phone is required' }}
          autoComplete="tel"
        />
        <FormField
          control={control}
          name="invoiceEmail"
          label="Email"
          type="email"
          rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } }}
          autoComplete="email"
        />
      </SubCard>

      {/* Billing Address */}
      <SubCard title="Billing Address">
        <FormField
          control={control}
          name="invoiceStreetAddress"
          label="Street Address"
          rules={{ required: 'Street address is required' }}
          autoComplete="street-address"
        />

        <div className={styles.grid2} style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          {/* City */}
          <FormField
            control={control}
            name="invoiceCity"
            label="City"
            rules={{ required: 'City is required' }}
          />

          {/* State (native select) */}
          <div className={styles.fieldGroup}>
            <label htmlFor="invoiceState" className={styles.inputLabel}>
              State <span className={styles.req}>*</span>
            </label>
            <Controller
              name="invoiceState"
              control={control}
              rules={{ required: 'State is required' }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <select
                    {...field}
                    id="invoiceState"
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                  >
                    {STATES.map((s) => (
                      <option key={s.v} value={s.v} disabled={s.v === ''}>
                        {s.n}
                      </option>
                    ))}
                  </select>
                  {error && <div className={styles.errorText}>{error.message}</div>}
                </>
              )}
            />
          </div>

          {/* ZIP */}
          <FormField
            control={control}
            name="invoiceZipCode"
            label="ZIP Code"
            rules={{ required: 'ZIP Code is required' }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        </div>
      </SubCard>
    </div>
  );
});

export default Step3;
