'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';
import FactoryIcon from '@mui/icons-material/Factory';
import { SvgIconProps } from '@mui/material';

interface Advantage {
  icon: React.ComponentType<SvgIconProps>;
  title: string;
  subtitle: string;
}

const items: Advantage[] = [
  {
    icon: EmojiEventsIcon,
    title: '15+ лет на рынке',
    subtitle: 'Опыт и доверие клиентов с 2009 года',
  },
  {
    icon: PeopleIcon,
    title: '500+ клиентов',
    subtitle: 'Партнёры в России и за рубежом',
  },
  {
    icon: VerifiedIcon,
    title: 'Сертификация MSC',
    subtitle: 'Международные стандарты устойчивого рыболовства',
  },
  {
    icon: FactoryIcon,
    title: 'Собственное производство',
    subtitle: 'Полный цикл — от вылова до упаковки',
  },
];

export default function Advantages() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box display="flex" flexWrap="wrap" gap={4}>
          {items.map(({ icon: Icon, title, subtitle }) => (
            <Box key={title} sx={{ flexBasis: { xs: '100%', sm: '50%', md: '25%' }, flexGrow: 1, minWidth: 200 }}>
              <Box textAlign="center" px={2}>
                <Icon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
