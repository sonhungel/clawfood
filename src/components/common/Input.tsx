import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
}

export default function Input({ icon = false, className = '', ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
      )}
      <input
        className={`w-full px-4 py-3 ${icon ? 'pl-10' : ''} border border-gray-200 rounded-xl 
                    text-sm text-text-primary bg-white
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                    placeholder:text-text-muted transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  );
}
