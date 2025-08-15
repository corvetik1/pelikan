"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import type { SvgIconProps } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';
import FactoryIcon from '@mui/icons-material/Factory';

import EditableField from '@/components/admin/EditableField';
import EditableParagraph from '@/components/admin/EditableParagraph';
import { useIsAdmin } from '@/context/AuthContext';
import { useGetAdvantagesQuery } from '@/redux/api';
import { useUpdateAdvantageFieldMutation } from '@/redux/adminApi';
import type { Advantage, IconName } from '@/types/advantages';

const iconMap: Record<IconName, React.ComponentType<SvgIconProps>> = {
  EmojiEvents: EmojiEventsIcon,
  People: PeopleIcon,
  Verified: VerifiedIcon,
  Factory: FactoryIcon,
};

export default function AdvantagesClient({ items: initialItems }: { items: Advantage[] }): React.JSX.Element {
  const isAdmin = useIsAdmin();
  const [items, setItems] = React.useState<Advantage[]>(initialItems);
  const { data: fresh } = useGetAdvantagesQuery();
  const [updateAdvantageField] = useUpdateAdvantageFieldMutation();

  React.useEffect(() => {
    if (fresh && Array.isArray(fresh)) {
      setItems(fresh);
    }
  }, [fresh]);

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box display="flex" flexWrap="wrap" gap={4}>
          {items.map(({ id, icon, title, subtitle }) => {
            const Icon = iconMap[icon];
            return (
              <Box key={id} sx={{ flexBasis: { xs: '100%', sm: '50%', md: '25%' }, flexGrow: 1, minWidth: 200 }}>
                <Box textAlign="center" px={2}>
                  <Icon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  {isAdmin ? (
                    <EditableField
                      value={title}
                      typographyProps={{ variant: 'h6', gutterBottom: true }}
                      onSave={async (v: string) => {
                        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, title: v } : it)));
                        await updateAdvantageField({ id, patch: { title: v } });
                      }}
                    />
                  ) : (
                    <Typography variant="h6" gutterBottom>
                      {title}
                    </Typography>
                  )}

                  {isAdmin ? (
                    <EditableParagraph
                      value={subtitle}
                      typographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      onSave={async (v: string) => {
                        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, subtitle: v } : it)));
                        await updateAdvantageField({ id, patch: { subtitle: v } });
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
