interface BadgeProps {
  label: string;
  bgColor: string;
  textColor: string;
  title?: string;
  className?: string;
}

function Badge({ label, bgColor, textColor, title, className }: BadgeProps) {
  return (
    <span
      title={title}
      className={`px-2 py-1 rounded font-semibold ${className || ''}`}
      style={{ background: bgColor, color: textColor }}
    >
      {label}
    </span>
  );
}
export default Badge;
