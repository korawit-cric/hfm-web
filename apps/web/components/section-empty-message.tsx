type Props = {
  children: React.ReactNode;
  /** Default matches FAQ / ranking empty copy on light backgrounds. */
  tone?: 'medium' | 'dark';
};

const TONE_CLASS = {
  medium: 'text-medium-gray',
  dark: 'text-dark-gray',
} as const;

export function SectionEmptyMessage({ children, tone = 'medium' }: Props) {
  return (
    <p className={`${TONE_CLASS[tone]} text-center text-sm`}>{children}</p>
  );
}
