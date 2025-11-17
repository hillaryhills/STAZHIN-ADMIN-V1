import { ReactNode } from 'react';
import CheckAuthGuard from '.';

interface ProtectedRouteProps {
  element: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  return <CheckAuthGuard>{element}</CheckAuthGuard>;
};

export default ProtectedRoute;
