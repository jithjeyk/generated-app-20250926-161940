import { useAuthStore } from '@/stores/authStore';
import { LoginPage } from './LoginPage';
import { DiaryPage } from '@/components/DiaryPage';
export function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <DiaryPage /> : <LoginPage />;
}