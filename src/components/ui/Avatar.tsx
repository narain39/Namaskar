import type { UserStatus } from '../../types';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  status?: UserStatus;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs', status: 'w-2 h-2' },
  sm: { container: 'w-8 h-8', text: 'text-sm', status: 'w-2.5 h-2.5' },
  md: { container: 'w-10 h-10', text: 'text-base', status: 'w-3 h-3' },
  lg: { container: 'w-12 h-12', text: 'text-lg', status: 'w-3.5 h-3.5' },
  xl: { container: 'w-16 h-16', text: 'text-xl', status: 'w-4 h-4' },
};

const statusColors: Record<UserStatus, string> = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  offline: 'bg-slate-500',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-red-600',
    'bg-orange-600',
    'bg-amber-600',
    'bg-yellow-600',
    'bg-lime-600',
    'bg-green-600',
    'bg-emerald-600',
    'bg-teal-600',
    'bg-cyan-600',
    'bg-sky-600',
    'bg-blue-600',
    'bg-indigo-600',
    'bg-violet-600',
    'bg-purple-600',
    'bg-fuchsia-600',
    'bg-pink-600',
    'bg-rose-600',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

export function Avatar({ src, name, size = 'md', status, className = '' }: AvatarProps) {
  const styles = sizeStyles[size];

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${styles.container} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`
            ${styles.container}
            ${getColorFromName(name)}
            rounded-full
            flex items-center justify-center
            ${styles.text}
            font-medium text-white
          `}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${styles.status}
            ${statusColors[status]}
            rounded-full
            ring-2 ring-slate-900
          `}
        />
      )}
    </div>
  );
}
