import type { FC } from "react";

interface LoaderProps {
  size?: number;
  color?: string;
}

const Loader: FC<LoaderProps> = ({ size = 40, color = "#00948a" }) => {
  return (
    <div
      className="
        fixed inset-0 
        z-[999999] 
        flex items-center justify-center 
        bg-black/50 
        backdrop-blur-md 
        pointer-events-auto
      "
    >
      <div
        style={{
          width: size,
          height: size,
          borderColor: `${color} transparent ${color} transparent`,
          borderWidth: 4,
        }}
        className="rounded-full border-solid animate-spin"
      />
    </div>
  );
};

export default Loader;
