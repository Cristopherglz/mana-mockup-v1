interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-3 border-mana-beige border-t-mana-green rounded-full animate-spin`}
        style={{ borderWidth: '3px' }}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mana-cream">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-mana-beige border-t-mana-green rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-heading font-bold text-mana-green">M</span>
        </div>
      </div>
      <p className="mt-4 text-mana-green-dark font-medium animate-pulse">
        Cargando...
      </p>
    </div>
  );
}
