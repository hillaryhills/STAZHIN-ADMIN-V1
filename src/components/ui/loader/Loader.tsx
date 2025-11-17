import type { FC } from 'react';

interface LoaderProps {
  size?: number;       // optional size in pixels
  color?: string;      // optional color
}

const Loader: FC<LoaderProps> = ({ size = 40, color = '#4F46E5' }) => {
  return (
    <div
      style={{ width: size, height: size, borderColor: color }}
      className="border-4 border-t-transparent border-solid rounded-full animate-spin mx-auto"
    />
  );
};

export default Loader;
