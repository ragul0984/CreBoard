'use client';
import { useEffect } from 'react';
import { useStore } from '../src/store';

export default function StoreInitializer() {
  const initializeStore = useStore(s => s.initializeStore);
  
  useEffect(() => {
    console.log('🚀 StoreInitializer mounted');
    initializeStore();
  }, [initializeStore]);

  return null;
}
