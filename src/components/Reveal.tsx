import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type RevealProps = { children: ReactNode; className?: string }

export function Reveal({ children, className }: RevealProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
