import CompanyInfoPanel from '@/components/contacts/CompanyInfoPanel';
import ContactForm from '@/components/contacts/ContactForm';
import ContactMapClient from '@/components/contacts/ContactMapClient';
import { company } from '@/data/company';
import { Box } from '@mui/material';
import type { Metadata } from 'next';

export const revalidate = 300; // ISR 5 min

export const metadata: Metadata = {
  title: 'Контакты',
};

export default function ContactsPage() {
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <CompanyInfoPanel company={company} />
      <ContactForm />
      <ContactMapClient company={company} />
    </Box>
  );
}
