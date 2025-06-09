'use client'
import React, { ReactNode, useState, useEffect } from 'react';

interface FormWrapperProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

/**
 * FormWrapper component to prevent multiple form submissions
 * and handle client-side only rendering to avoid hydration errors
 */
export default function FormWrapper({ children, onSubmit, className = '' }: FormWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set mounted state on client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Call the actual submit handler
    onSubmit(e);
    
    // Reset submission state after a delay
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  // Don't render until client-side to prevent hydration errors
  if (!isMounted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
