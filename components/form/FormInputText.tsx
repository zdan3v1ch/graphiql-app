'use client';

import { HTMLInputTypeAttribute } from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import TextField from '@mui/material/TextField';

interface Props<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  margin?: 'none' | 'normal' | 'dense';
}

const FormInputText = <T extends FieldValues>({
  name,
  control,
  label,
  type,
  rules,
  required,
  disabled,
  size,
  margin,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, ...props }, fieldState: { error } }) => (
        <TextField
          helperText={error ? error.message : ' '}
          error={!!error}
          size={size}
          margin={margin}
          required={required}
          onChange={onChange}
          fullWidth
          label={label}
          variant="outlined"
          type={type ?? 'text'}
          sx={{ mb: 2 }}
          data-testid={name}
          slotProps={{ input: { disabled }, inputLabel: { shrink: true } }}
          {...props}
        />
      )}
    />
  );
};

export default FormInputText;
