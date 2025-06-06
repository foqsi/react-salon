'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function FadeInRight({
  children,
  delay = 0,
  margin = '-10% 0px',
}: {
  children: React.ReactNode;
  delay?: number;
  margin?: string;
}) {
  const { ref, inView } = useInView({
    rootMargin: margin,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
