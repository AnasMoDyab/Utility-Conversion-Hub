import React from 'react'
import { motion } from 'framer-motion'

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    style={{ minHeight: '100%' }}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

export default PageTransition
