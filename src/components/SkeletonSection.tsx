import React from 'react'
import { Stack, Skeleton } from '@mui/material'

interface SkeletonSectionProps {
  lines?: number
  variant?: 'text' | 'rectangular' | 'rounded'
}

const SkeletonSection: React.FC<SkeletonSectionProps> = ({ lines = 5, variant = 'text' }) => {
  return (
    <Stack spacing={1.2}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant={variant} height={variant === 'text' ? 16 : 38} animation="wave" />
      ))}
    </Stack>
  )
}

export default SkeletonSection
