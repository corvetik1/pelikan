import { Box, Typography, Stack, Link as MuiLink } from '@mui/material';
import type { CompanyInfo } from '@/data/company';

interface CompanyInfoPanelProps {
  company: CompanyInfo;
}

export default function CompanyInfoPanel({ company }: CompanyInfoPanelProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography component="h2" variant="h5" gutterBottom>
        Контактные данные
      </Typography>
      <Stack spacing={1}>
        <Typography>{company.address}</Typography>
        <Typography>
          Тел.: <MuiLink href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>{company.phone}</MuiLink>
        </Typography>
        <Typography>
          Email: <MuiLink href={`mailto:${company.email}`}>{company.email}</MuiLink>
        </Typography>
        <Typography>ИНН {company.inn}, КПП {company.kpp}, ОГРН {company.ogrn}</Typography>
      </Stack>
    </Box>
  );
}
