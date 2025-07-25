
// Design Tokens & Color Palette
export const COLORS = {
  light: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#1A202C',
    textSecondary: '#4B5563',
    border: '#E5E7EB',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    secondary: '#64748B',
    accent: '#F59E42',
    status: {
      todo: '#F3F4F6', // gray-100
      inProgress: '#FEF3C7', // yellow-100
      done: '#D1FAE5', // green-100
    },
    statusText: {
      todo: '#374151',
      inProgress: '#B45309',
      done: '#065F46',
    },
    selectBg: '#F3F4F6',
    selectText: '#1A202C',
  },
  dark: {
    background: '#111827',
    surface: '#1F2937',
    text: '#F3F4F6',
    textSecondary: '#9CA3AF',
    border: '#374151',
    primary: '#60A5FA',
    primaryHover: '#3B82F6',
    secondary: '#94A3B8',
    accent: '#FBBF24',
    status: {
      todo: '#374151', // gray-700
      inProgress: '#F59E42', // orange-400
      done: '#10B981', // green-500
    },
    statusText: {
      todo: '#F3F4F6',
      inProgress: '#78350F',
      done: '#D1FAE5',
    },
    selectBg: '#1F2937',
    selectText: '#F3F4F6',
  },
};

export const mockTeamMembers = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
