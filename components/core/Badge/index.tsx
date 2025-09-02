import { useSettings } from '@/components/core/hooks/useSettings';

export const badgeStatusMap: Record<'success' | 'failed' | 'pending' | 'cancelled', { bg: string; textColor: string }> =
  {
    success: { bg: 'success-bg', textColor: 'text-success' },
    failed: { bg: 'failed-bg', textColor: 'text-error' },
    pending: { bg: 'pending-bg', textColor: 'text-notice' },
    cancelled: { bg: 'failed-bg', textColor: 'text-error' },
  };

export interface IBadge {
  status: keyof typeof badgeStatusMap;
  children?: React.ReactNode;
}

export const Badge = ({ status, children }: IBadge) => {
  const {
    settings: { dictionary },
  } = useSettings();

  const statusDictionary = dictionary.status;

  return (
    <span
      className={`px-2 py-1 rounded font-semibold ${badgeStatusMap[status].bg} ${badgeStatusMap[status].textColor}`}
    >
      {children || statusDictionary[status]}
    </span>
  );
};
