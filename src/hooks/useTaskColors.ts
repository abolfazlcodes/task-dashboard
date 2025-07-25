import { Task } from '@/types';
import { useTheme } from './useTheme';
import { COLORS } from '@/constants';

export function useTaskColors(task: Task) {
  const theme = useTheme();
  // Color palettes for tags/categories
  const tagPalette =
    theme === 'dark'
      ? [
          '#60A5FA',
          '#FBBF24',
          '#10B981',
          '#F472B6',
          '#A78BFA',
          '#F59E42',
          '#F87171',
          '#34D399',
          '#818CF8',
          '#F472B6',
        ]
      : [
          '#2563EB',
          '#F59E42',
          '#22C55E',
          '#EC4899',
          '#8B5CF6',
          '#FBBF24',
          '#EF4444',
          '#10B981',
          '#6366F1',
          '#F472B6',
        ];
  const tagTextPalette =
    theme === 'dark'
      ? [
          '#1E293B',
          '#78350F',
          '#064E3B',
          '#831843',
          '#312E81',
          '#78350F',
          '#7F1D1D',
          '#064E3B',
          '#1E293B',
          '#831843',
        ]
      : [
          '#FFFFFF',
          '#78350F',
          '#065F46',
          '#831843',
          '#312E81',
          '#78350F',
          '#7F1D1D',
          '#065F46',
          '#312E81',
          '#831843',
        ];

  const priorityBg =
    COLORS[theme].status[task.priority as keyof (typeof COLORS)[typeof theme]['status']] ||
    '#E5E7EB';
  const priorityText =
    COLORS[theme].statusText[task.priority as keyof (typeof COLORS)[typeof theme]['statusText']] ||
    '#374151';

  const glowShadow =
    task.priority === 'high'
      ? '0 0 4px 1px rgba(239,68,68,0.4)'
      : task.priority === 'medium'
        ? '0 0 8px 2px rgba(251,191,36,0.4)'
        : '0 0 8px 2px rgba(34,197,94,0.4)';

  return { tagPalette, tagTextPalette, priorityBg, priorityText, glowShadow };
}
