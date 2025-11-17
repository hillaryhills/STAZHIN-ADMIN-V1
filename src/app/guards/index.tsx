import { useEffect, useRef, useState, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Loader from '../../components/ui/loader/Loader';

interface CheckAuthGuardProps {
  children: ReactNode;
}

const CheckAuthGuard: React.FC<CheckAuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialized = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);

  const PUBLIC_ROUTES: string[] = ['/auth/login'];

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  const initialize = async () => {
    if (initialized.current) return;
    initialized.current = true;

    const token = Cookies.get('token');

    if (isPublicRoute && token) {
      navigate('/dashboard', { replace: true });
      return;
    }

    if (!isPublicRoute && !token) {
      navigate(`/auth/login?redirect=${location.pathname}`, { replace: true });
      return;
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    initialized.current = false;
    initialize();
  }, [location.pathname]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default CheckAuthGuard;
