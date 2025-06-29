'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>({ name: '', email: '', message: '' });
  const [sent, setSent] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<keyof FormValues, string>>({
    name: '',
    email: '',
    message: '',
  });

  const validate = (): boolean => {
    const nextErrors: typeof errors = { name: '', email: '', message: '' };
    let valid = true;

    if (!values.name.trim()) {
      nextErrors.name = 'Укажите имя';
      valid = false;
    }
    if (!values.email.trim()) {
      nextErrors.email = 'Укажите email';
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(values.email)) {
      nextErrors.email = 'Некорректный email';
      valid = false;
    }
    if (!values.message.trim()) {
      nextErrors.message = 'Введите сообщение';
      valid = false;
    }

    setErrors(nextErrors);
    return valid;
  };

  const handleChange = (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues({ ...values, [field]: e.target.value });
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    // Здесь должна быть отправка на API /email - пока эмулируем
    console.log('Contact form submitted', values);
    setSent(true);
    setValues({ name: '', email: '', message: '' });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography component="h2" variant="h5" gutterBottom>
        Обратная связь
      </Typography>

      {sent && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSent(false)}>
          Сообщение отправлено!
        </Alert>
      )}

      <TextField
        label="Имя"
        value={values.name}
        onChange={handleChange('name')}
        error={Boolean(errors.name)}
        helperText={errors.name}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Email"
        type="email"
        value={values.email}
        onChange={handleChange('email')}
        error={Boolean(errors.email)}
        helperText={errors.email}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Сообщение"
        value={values.message}
        onChange={handleChange('message')}
        error={Boolean(errors.message)}
        helperText={errors.message}
        fullWidth
        multiline
        minRows={4}
        sx={{ mb: 2 }}
      />

      <Button type="submit" variant="contained">
        Отправить
      </Button>
    </Box>
  );
}
