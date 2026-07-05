import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) => {
  const CardComponent = onClick ? motion.div : 'div';

  const baseStyles = 'bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-glass-light dark:shadow-glass-dark p-6 overflow-hidden';
  const hoverStyles = hoverEffect
    ? 'cursor-pointer hover:shadow-lg dark:hover:shadow-2xl hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 transform hover:-translate-y-0.5'
    : '';

  const motionProps = onClick
    ? {
        whileHover: { y: -2 },
        whileTap: { scale: 0.99 },
        onClick,
      }
    : {};

  return (
    <CardComponent
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
