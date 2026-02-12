import { APP_NAME } from '../../utils/constants';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-accent-dark/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm
                            group-hover:scale-110 transition-transform">
              🍜
            </div>
            <span className="text-lg font-bold text-text-primary">
              {APP_NAME}
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
