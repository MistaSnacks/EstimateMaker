interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  useImage?: boolean;
}

export function Logo({ size = 'md', showText = true, useImage = false }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-24',
    md: 'h-12 w-40',
    lg: 'h-16 w-52',
  };

  const fontSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // If using image and it exists, show the full logo image (no separate text)
  if (useImage) {
    return (
      <div className="flex items-center">
        <img 
          src="/evergreen-logo.png" 
          alt="Evergreen Millwork Logo" 
          className="h-12 w-auto object-contain"
          style={{ maxHeight: size === 'sm' ? '32px' : size === 'lg' ? '64px' : '48px' }}
          onError={(e) => {
            // Hide the broken image and show nothing - CSS fallback will be used instead
            (e.target as HTMLImageElement).style.display = 'none';
            console.log('Logo image not found at /evergreen-logo.png - please add your logo to the public folder');
          }}
        />
      </div>
    );
  }

  // CSS fallback version
  return (
    <div className={`flex items-center gap-3 ${sizeClasses[size]}`}>
      {/* Green Circle with E */}
      <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-xl md:text-2xl">E</span>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className={`${fontSize[size]} font-bold leading-tight text-brand-green`}>
            EVERGREEN
          </div>
          <div className={`${fontSize[size]} font-bold leading-tight text-black`} style={{ fontSize: '0.9em' }}>
            MILLWORK
          </div>
        </div>
      )}
    </div>
  );
}
