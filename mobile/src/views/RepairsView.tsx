import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts, spacing } from '@/src/constants/theme';
import { Button, Card, Chip, Pill } from '@/src/components';
import { Icon } from '@/src/components/Icon';
import { H1, Label, Name, Sub } from '@/src/components/Text';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { formatDate } from '@/src/lib/format';
import { useRepairsController } from '@/src/controllers/useRepairsController';

type Props = ReturnType<typeof useRepairsController>;

export function RepairsView(props: Props) {
  const { loading, refreshing, refresh, filters, filter, setFilter, counts, repairs, setStatus } = props;

  return (
    <ScreenRoot>
      <View style={styles.top}>
        <H1>Repairs</H1>
        <Sub>Both blocks</Sub>
      </View>
      <ScreenBody onRefresh={refresh} refreshing={refreshing}>
        <View style={styles.pillRow}>
          {filters.map((f) => (
            <Pill
              key={f.value}
              label={`${f.label} · ${counts[f.value]}`}
              selected={filter === f.value}
              onPress={() => setFilter(f.value)}
            />
          ))}
        </View>

        {loading ? (
          <Sub>Loading…</Sub>
        ) : repairs.length === 0 ? (
          <Sub>Nothing here.</Sub>
        ) : (
          repairs.map((r) => (
            <Card key={r.id}>
              <View style={styles.between}>
                <Label>
                  {r.building_name} · {r.unit_number}
                </Label>
                <Chip status={r.status === 'resolved' ? 'paid' : r.status === 'in_progress' ? 'in_progress' : 'partial'} label={r.status === 'resolved' ? 'Resolved' : r.status === 'in_progress' ? 'In progress' : 'Open'} />
              </View>
              <View style={styles.descRow}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Name style={styles.desc}>{r.description}</Name>
                  <Sub>
                    Raised {formatDate(r.created_at)}
                    {r.photo_path ? ' · 1 photo' : ''}
                  </Sub>
                </View>
                {r.photo_path ? (
                  <View style={styles.photoBadge}>
                    <Icon name="camera" size={22} color={colors.muted} />
                  </View>
                ) : null}
              </View>
              {r.status !== 'resolved' ? (
                <View style={styles.actions}>
                  {r.status === 'open' ? (
                    <Button variant="secondary" style={styles.actionBtn} onPress={() => setStatus(r.id, 'in_progress')}>
                      Start work
                    </Button>
                  ) : null}
                  <Button variant="neutral" style={styles.actionBtn} onPress={() => setStatus(r.id, 'resolved')}>
                    Mark fixed
                  </Button>
                </View>
              ) : null}
            </Card>
          ))
        )}
        <Sub style={styles.footNote}>Tenants see the status change as you update it.</Sub>
      </ScreenBody>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12, gap: 4 },
  pillRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  descRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  desc: { fontSize: 17 },
  photoBadge: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: colors.chipNeutralBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, height: 44 },
  footNote: { textAlign: 'center' },
});
