interface IconProps {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const Icon = ({
  name,
  size,
  width = size || 24,
  height = size || 24,
  color = 'currentColor',
  className = '',
}: IconProps) => {
  return (
    <svg width={width} height={height} fill={color} className={className} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
};

export default Icon;
