import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export const revalidate = 3600;

export default function LocationsPage(): React.JSX.Element {
  return (
    <Container sx={{ py: 6 }} maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Где купить
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Здесь будет информация о местах продаж и партнёрах. Раздел находится в разработке.
      </Typography>
    </Container>
  );
}
