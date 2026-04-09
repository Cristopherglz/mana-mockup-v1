import { useState, useCallback } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useStore } from '@/store';
import type { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: 'icon' | 'full';
  className?: string;
  label?: string;
}

export function AddToCartButton({ product, quantity = 1, variant = 'icon', className = '', label }: AddToCartButtonProps) {
  const [state, setState] = useState<'idle' | 'added'>('idle');
  const { addToCart } = useStore();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state === 'added') return;
    
    addToCart(product, quantity);
    setState('added');
    
    setTimeout(() => {
      setState('idle');
    }, 1800);
  }, [addToCart, product, quantity, state]);

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          state === 'added'
            ? 'bg-mana-green text-white scale-110'
            : 'bg-white text-mana-green hover:bg-mana-green hover:text-white'
        } ${className}`}
      >
        {state === 'added' ? (
          <div className="relative">
            <Check className="w-5 h-5 animate-scale-in" />
            <Sparkles className="w-3 h-3 absolute -top-2 -right-2 text-yellow-300 animate-fade-in" />
            <Sparkles className="w-2 h-2 absolute -bottom-1 -left-2 text-yellow-300 animate-fade-in" style={{ animationDelay: '0.1s' }} />
          </div>
        ) : (
          <span className="text-xl leading-none">+</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`btn-primary flex items-center justify-center gap-2 transition-all duration-300 ${
        state === 'added' ? '!bg-green-600' : ''
      } ${className}`}
    >
      {state === 'added' ? (
        <>
          <Check className="w-5 h-5 animate-scale-in" />
          <span>¡Agregado!</span>
          <Sparkles className="w-4 h-4 text-yellow-300 animate-fade-in" />
        </>
      ) : (
        <>
          <span className="text-lg leading-none">+</span>
          <span>{label || 'Agregar al Carrito'}</span>
        </>
      )}
    </button>
  );
}
