'use client';

import { useEffect } from 'react';
import { getNombreAmigableBanco } from '@/utils/bankValidator';

export default function DynamicTitle() {
  useEffect(() => {
    const banco = localStorage.getItem('bankSelct');
    if (banco) {
      document.title = getNombreAmigableBanco(banco);
    } else {
      document.title = 'Banco';
    }
  }, []);
  
  return null;
}
