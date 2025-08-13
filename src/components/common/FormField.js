import React from 'react';
import { Controller } from 'react-hook-form';
import styles from '../../styles/form.module.css';

/**
 * Reusable RHF field with plain CSS.
 * Props:
 *  - control, name, label, rules
 *  - type, placeholder, autoComplete, disabled
 *  - onValueChange: mirrors changes up (e.g., handleChange(name))
 *  - rightSlot: node rendered inside the input (e.g., icon button)
 *  - inputProps, containerClass
 */
export default function FormField({
  control,
  name,
  label,
  rules,
  type = 'text',
  placeholder,
  autoComplete,
  disabled = false,
  onValueChange,
  rightSlot,
  inputProps = {},
  containerClass = '',
}) {
  return (
    <div className={`${styles.fieldGroup} ${containerClass}`}>
      {label && (
        <label htmlFor={name} className={styles.inputLabel}>
          {label} {rules?.required && <span className={styles.req}>*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => {
          const handleChange = (e) => {
            field.onChange(e);
            if (onValueChange) onValueChange(e);
          };

          const InputTag = type === 'textarea' ? 'textarea' : 'input';

          const inputEl = (
            <InputTag
              {...field}
              id={name}
              type={type === 'textarea' ? undefined : type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              onChange={handleChange}
              {...inputProps}
            />
          );

          return (
            <>
              {rightSlot ? (
                <div className={styles.inputWithAction}>
                  {inputEl}
                  {rightSlot}
                </div>
              ) : (
                inputEl
              )}

              {error && <div className={styles.errorText}>{error.message}</div>}
            </>
          );
        }}
      />
    </div>
  );
}
