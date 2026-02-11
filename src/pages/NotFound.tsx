import { Home as HomeIcon } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🍜</div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
        <p className="text-text-muted mb-6">
          Oops! Trang bạn tìm không tồn tại.
        </p>
        <a href="/">
          <Button variant="primary" size="lg" icon={<HomeIcon className="w-5 h-5" />}>
            Về trang chủ
          </Button>
        </a>
      </div>
    </main>
  );
}
