'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Add, ArrowDropDown, ArrowDropUp, Delete } from '@mui/icons-material';

import { Namespaces } from '@/app/i18n/data/i18n.enum';

import styles from './TextVariablesInput.module.css';

interface Props {
  title: string;
  disabled?: boolean;
  variables: [string, string][];
  onVariablesChange: (variables: [string, string][]) => void;
}

const TextVariablesInput: React.FC<Props> = ({
  title,
  disabled,
  variables,
  onVariablesChange,
}) => {
  const { t } = useTranslation(Namespaces.CLIENTS);
  const [isVisible, setIsVisible] = useState<boolean>(!!variables.length);

  const addVariable = () => {
    const newVariables: [string, string][] = [...variables, ['', '']];

    onVariablesChange(newVariables);
  };
  const onChangeVisible = () => {
    setIsVisible((isVisible) => !isVisible);
  };

  const changeVariable = (index: number, key: string, value: string) => {
    const newVariables: [string, string][] = [
      ...variables.slice(0, index),
      [key, value],
      ...variables.slice(index + 1),
    ];

    onVariablesChange(newVariables);
  };
  const deleteVariable = (index: number) => {
    const newVariables: [string, string][] = [
      ...variables.slice(0, index),
      ...variables.slice(index + 1),
    ];

    onVariablesChange(newVariables);
  };

  return (
    <Stack spacing={2}>
      <Box display="flex" gap={1} alignItems="center">
        <Typography component="h2" variant="h5">
          {t(title)}
        </Typography>
        <IconButton onClick={onChangeVisible}>
          {isVisible ? <ArrowDropUp /> : <ArrowDropDown />}
        </IconButton>
      </Box>
      {isVisible && (
        <Box className={`${styles.inputContainer} flow`}>
          {!!variables.length &&
            variables.map(([key, value], index) => (
              <Box className={styles.inputRow} key={index}>
                <TextField
                  className={styles.inputRow__name}
                  value={key}
                  variant="outlined"
                  disabled={disabled}
                  onChange={(event) => {
                    changeVariable(index, event.target.value, value);
                  }}
                />
                <TextField
                  className={styles.inputRow__value}
                  value={value}
                  variant="outlined"
                  disabled={disabled}
                  onChange={(event) => {
                    changeVariable(index, key, event.target.value);
                  }}
                />
                <IconButton
                  className={styles.inputRow__button}
                  disabled={disabled}
                  onClick={() => {
                    deleteVariable(index);
                  }}
                  sx={{ flexShrink: 0 }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}
          <div>
            <Button
              disabled={disabled}
              variant="outlined"
              startIcon={<Add />}
              onClick={() => {
                addVariable();
              }}
            >
              {t(`${title}Add`)}
            </Button>
          </div>
        </Box>
      )}
    </Stack>
  );
};

export default TextVariablesInput;
