// Design tokens — kept in sync with the mockups on the design canvas.
// https://claude.ai/artifact/TEs1m3UTkBzdZ2J59c48wf

export const colors = {
  paper: '#F5F1EA',
  ink: '#1F1D1A',
  teal: '#13564F',
  tealDark: '#0C3F3A',
  card: '#FFFFFF',
  border: '#E4DDD2',
  borderStrong: '#D6CEC2',
  divider: '#EFE9E0',
  muted: '#5E5850',
  mutedStrong: '#3D3934',
  placeholder: '#8A8279',
  chipNeutralBg: '#ECE6DC',
  chipNeutralFg: '#4A453F',
  doorBg: '#F0EBE3',

  paidBg: '#DCEBE7',
  paidFg: '#0E4A44',
  partialBg: '#FBE9D2',
  partialFg: '#7A4108',
  overdueBg: '#F7DCD6',
  overdueFg: '#8E2618',
  progressBg: '#E1E7F0',
  progressFg: '#2D4A70',
} as const;

export const fonts = {
  serif: 'Fraunces_600SemiBold',
  sansRegular: 'Figtree_400Regular',
  sansMedium: 'Figtree_500Medium',
  sansSemiBold: 'Figtree_600SemiBold',
  sansBold: 'Figtree_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radii = {
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
  pill: 999,
} as const;

export type BillStatus = 'paid' | 'partial' | 'unpaid' | 'overdue' | 'vacant' | 'in_progress';

export const statusStyle: Record<BillStatus, { bg: string; fg: string; label: string }> = {
  paid: { bg: colors.paidBg, fg: colors.paidFg, label: 'Paid' },
  partial: { bg: colors.partialBg, fg: colors.partialFg, label: 'Part paid' },
  unpaid: { bg: colors.chipNeutralBg, fg: colors.chipNeutralFg, label: 'Unpaid' },
  overdue: { bg: colors.overdueBg, fg: colors.overdueFg, label: 'Overdue' },
  vacant: { bg: colors.card, fg: colors.muted, label: 'Vacant' },
  in_progress: { bg: colors.progressBg, fg: colors.progressFg, label: 'In progress' },
};
