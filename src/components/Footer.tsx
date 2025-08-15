"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useGetSettingsQuery, useSubscribeNewsletterMutation } from '@/redux/api';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import LinkIcon from '@mui/icons-material/Link';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PublicIcon from '@mui/icons-material/Public';
import type { ContactItem, SocialLink } from '@/types/settings';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Footer(): React.JSX.Element {
  const { data: settings } = useGetSettingsQuery();
  const socials: SocialLink[] = settings?.socials ?? [];
  const contacts: ContactItem[] = settings?.contacts ?? [];
  const year = new Date().getFullYear();
  const [email, setEmail] = React.useState<string>('');
  const [emailError, setEmailError] = React.useState<string>('');
  const [snackOpen, setSnackOpen] = React.useState<boolean>(false);
  const [subscribe, { isLoading: isSubscribing }] = useSubscribeNewsletterMutation();

  const validateEmail = (val: string): boolean => {
    // Simple RFC5322-like check; server validates strictly as well
    const ok = /.+@.+\..+/.test(val);
    setEmailError(ok ? '' : 'Введите корректный email');
    return ok;
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    subscribe({ email })
      .unwrap()
      .then(() => {
        setSnackOpen(true);
        setEmail('');
      })
      .catch(() => {
        setEmailError('Не удалось оформить подписку');
      });
  };
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Box display="flex" flexWrap="wrap" gap={4}>
          <Box sx={{ flexBasis: { xs: '100%', sm: '50%', md: '25%' }, flexGrow: 1, minWidth: 200 }}>
            <Typography variant="h6" gutterBottom>
              Компания
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/about">О нас</Link>
              <Link href="/about/history">История</Link>
              <Link href="/careers">Карьера</Link>
              <Link href="/contacts">Контакты</Link>
            </Box>
          </Box>
          <Box sx={{ flexBasis: { xs: '100%', sm: '50%', md: '25%' }, flexGrow: 1, minWidth: 200 }}>
            <Typography variant="h6" gutterBottom>
              Продукция
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/products">Каталог</Link>
              <Link href="/products/new">Новинки</Link>
              <Link href="/certificates">Сертификаты</Link>
            </Box>
          </Box>
          <Box sx={{ flexBasis: { xs: '100%', sm: '50%', md: '25%' }, flexGrow: 1, minWidth: 200 }}>
            <Typography variant="h6" gutterBottom>
              Покупателям
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/locations">Где купить</Link>
              <Link href="/recipes">Рецепты</Link>
              <Link href="/faq">FAQ</Link>
            </Box>
          </Box>
          <Box sx={{ flexBasis: { xs: '100%', sm: '50%', md: '25%' }, flexGrow: 1, minWidth: 200 }}>
            <Typography variant="h6" gutterBottom>
              B2B
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/b2b/retail">Для ритейла</Link>
              <Link href="/b2b/horeca">Для HoReCa</Link>
              <Link href="/b2b/prices">Прайс-листы</Link>
            </Box>
          </Box>
        </Box>

        {/* Контакты и соцсети */}
        {(contacts.length > 0 || socials.length > 0) && (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {contacts.length > 0 && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap flexWrap="wrap" alignItems="center">
                {contacts.map((c) => {
                  const key = `contact_${c.id}`;
                  const icon = c.type === 'phone' ? <PhoneIcon fontSize="small" />
                    : c.type === 'email' ? <EmailIcon fontSize="small" />
                    : c.type === 'address' ? <PlaceIcon fontSize="small" />
                    : <LinkIcon fontSize="small" />;
                  const label = c.label ?? '';
                  if (c.type === 'phone') {
                    const href = `tel:${c.value}`;
                    return (
                      <Stack key={key} direction="row" spacing={1} alignItems="center">
                        {icon}
                        <MuiLink href={href} underline="hover" color="inherit" aria-label={`Телефон ${label || c.value}`}>
                          {label || c.value}
                        </MuiLink>
                      </Stack>
                    );
                  }
                  if (c.type === 'email') {
                    const href = `mailto:${c.value}`;
                    return (
                      <Stack key={key} direction="row" spacing={1} alignItems="center">
                        {icon}
                        <MuiLink href={href} underline="hover" color="inherit" aria-label={`Email ${label || c.value}`}>
                          {label || c.value}
                        </MuiLink>
                      </Stack>
                    );
                  }
                  if (c.type === 'link') {
                    const href = c.value;
                    return (
                      <Stack key={key} direction="row" spacing={1} alignItems="center">
                        {icon}
                        <MuiLink href={href} underline="hover" color="inherit" target="_blank" rel="noopener noreferrer" aria-label={`Ссылка ${label || href}`}>
                          {label || href}
                        </MuiLink>
                      </Stack>
                    );
                  }
                  // address
                  return (
                    <Stack key={key} direction="row" spacing={1} alignItems="center">
                      {icon}
                      <Typography variant="body2">{label ? `${label}: ` : ''}{c.value}</Typography>
                    </Stack>
                  );
                })}
              </Stack>
            )}

            {socials.length > 0 && (
              <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" alignItems="center">
                {socials.map((s) => {
                  const n = s.icon?.toLowerCase() || s.name.toLowerCase();
                  let SocialIcon: React.ReactElement = <PublicIcon fontSize="small" />;
                  if (n.includes('insta')) SocialIcon = <InstagramIcon fontSize="small" />;
                  else if (n.includes('face') || n === 'fb') SocialIcon = <FacebookIcon fontSize="small" />;
                  else if (n.includes('you')) SocialIcon = <YouTubeIcon fontSize="small" />;
                  else if (n.includes('tg') || n.includes('tele')) SocialIcon = <TelegramIcon fontSize="small" />;
                  else if (n.includes('twit') || n === 'x') SocialIcon = <TwitterIcon fontSize="small" />;
                  return (
                    <Stack key={s.id} direction="row" spacing={1} alignItems="center">
                      {SocialIcon}
                      <MuiLink href={s.url} target="_blank" rel="noopener noreferrer" underline="hover" color="inherit" aria-label={s.name}>
                        {s.name}
                      </MuiLink>
                    </Stack>
                  );
                })}
              </Stack>
            )}
          </Box>
        )}

        {/* Подписка на новости */}
        <Box component="section" aria-label="Подписка на новости" sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Подписка на новости
          </Typography>
          <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              type="email"
              label="Ваш email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              onBlur={() => validateEmail(email)}
              error={Boolean(emailError)}
              helperText={emailError || 'Мы отправим письмо для подтверждения'}
              required
              size="small"
            />
            <Button type="submit" variant="contained" disabled={isSubscribing} sx={{ minWidth: 160 }}>
              Подписаться
            </Button>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © {year} Бухта пеликанов. Все права защищены.
        </Typography>
      </Container>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Спасибо за подписку! Мы отправили письмо для подтверждения.
        </Alert>
      </Snackbar>
    </Box>
  );
}
