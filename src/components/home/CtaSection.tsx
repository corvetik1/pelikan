'use client';

import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/redux/api';
import EditableField from '@/components/admin/EditableField';
import EditableParagraph from '@/components/admin/EditableParagraph';
import { useIsAdmin } from '@/context/AuthContext';

export default function CtaSection(): React.JSX.Element {
  const { data: settings } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const isAdmin: boolean = useIsAdmin();
  const priceUrl: string = typeof settings?.priceListUrl === 'string' && settings.priceListUrl.length > 0
    ? settings.priceListUrl
    : '#';
  const hasPriceUrl: boolean = priceUrl !== '#';
  const title: string = (settings?.ctaTitle ?? '').trim().length > 0
    ? String(settings?.ctaTitle)
    : 'Станьте нашим партнёром';
  const subtitle: string = (settings?.ctaSubtitle ?? '').trim().length > 0
    ? String(settings?.ctaSubtitle)
    : 'Предлагаем выгодные условия сотрудничества для ресторанов, магазинов и оптовых покупателей';

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        color: '#fff',
        background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        {isAdmin ? (
          <EditableField
            value={title}
            typographyProps={{ variant: 'h4', component: 'h2', sx: { mb: 2, fontWeight: 700 } }}
            onSave={async (v: string): Promise<void> => {
              await updateSettings({ ctaTitle: v });
            }}
          />
        ) : (
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 700 }}>
            {title}
          </Typography>
        )}

        {isAdmin ? (
          <EditableParagraph
            value={subtitle}
            typographyProps={{ variant: 'h6', sx: { mb: 4, opacity: 0.9 } }}
            onSave={async (v: string): Promise<void> => {
              await updateSettings({ ctaSubtitle: v });
            }}
          />
        ) : (
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            {subtitle}
          </Typography>
        )}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Button href="/b2b" variant="contained" size="large">
            Для B2B клиентов
          </Button>
          <Button
            href={hasPriceUrl ? priceUrl : undefined}
            variant="outlined"
            size="large"
            color="inherit"
            disabled={!hasPriceUrl}
            aria-label={hasPriceUrl ? 'Скачать прайс-лист' : 'Прайс-лист недоступен'}
            title={hasPriceUrl ? 'Скачать прайс-лист' : 'Прайс-лист недоступен'}
          >
            Скачать прайс-лист
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
