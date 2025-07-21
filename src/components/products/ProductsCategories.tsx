import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import EditableField from '@/components/admin/EditableField';
import EditableImage from '@/components/admin/EditableImage';
import { useIsAdmin } from '@/context/AuthContext';
import { useUpdateCategoryFieldMutation } from '@/redux/adminApi';
import type { Category } from '@/types/category';

interface ProductsCategoriesProps {
  categories: Category[];
}

export default function ProductsCategories({ categories }: ProductsCategoriesProps) {
  const prefersReduced = useReducedMotion();
  const isAdmin = useIsAdmin();
  const [updateCategoryField] = useUpdateCategoryFieldMutation();
  return (
    <Box display="grid" paddingY={4} gap={4} sx={{ gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
      {categories.map((cat, idx) => (
        <Box key={cat.slug}>
          <motion.div
            custom={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
              visible: (i: number) => ({
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: i * 0.07 },
              }),
            }}
          >
          <Card sx={{ height: '100%' }}>
            {isAdmin ? (
              <EditableImage
                src={cat.img}
                alt={cat.title}
                width={400}
                height={180}
                onSave={(url) => updateCategoryField({ id: cat.slug, patch: { img: url } })}
                style={{ height: 180, objectFit: 'cover', width: '100%' }}
              />
            ) : (
              <CardActionArea component={Link} href={`/products/${cat.slug}`} sx={{ height: '100%' }}>
                <img src={cat.img} alt={cat.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              </CardActionArea>
            )}
              <CardContent>
                {isAdmin ? (
                    <EditableField
                      value={cat.title}
                      typographyProps={{ component: 'h2', variant: 'h6', align: 'center' }}
                      onSave={(v) => updateCategoryField({ id: cat.slug, patch: { title: v } })}
                    />
                  ) : (
                    <Typography component="h2" variant="h6" align="center">
                      {cat.title}
                    </Typography>
                  )}
              </CardContent>

          </Card>
                  </motion.div>
        </Box>
      ))}
    </Box>
  );
}
