'use client';

import { useState } from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { IconButton, InputAdornment } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';

interface Props<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  margin?: 'none' | 'normal' | 'dense';
}

const FormInputPassword = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  required,
  disabled,
  size,
  margin,
}: Props<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPasswordClick = () => setShowPassword((show) => !show);

  const handleShowPasswordMouseDown = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

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
          type={showPassword ? 'text' : 'password'}
          sx={{ mb: 2 }}
          data-testid={name}
          slotProps={{
            input: {
              disabled,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleShowPasswordClick}
                    onMouseDown={handleShowPasswordMouseDown}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            },
            inputLabel: { shrink: true },
          }}
          {...props}
        />
      )}
    />
  );
};

export default FormInputPassword;
