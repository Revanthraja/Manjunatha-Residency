import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing } from '@/src/constants/theme';
import { Button, Card, Chip, Segmented } from '@/src/components';
import { H1, Label, Serif, Sub } from '@/src/components/Text';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { formatFloor, formatRupees } from '@/src/lib/format';
import { useVacantController } from '@/src/controllers/useVacantController';

type Props = ReturnType<typeof useVacantController>;

export function VacantView(props: Props) {
  const { loading, refreshing, refresh, fullName, units, blocks, block, setBlock, applications } = props;
  const router = useRouter();
  const pendingApplication = applications.find((a) => a.status === 'pending');

  return (
    <ScreenRoot>
      <View style={styles.top}>
        {fullName ? <Label>Welcome, {fullName.split(' ')[0]}</Label> : null}
        <H1>Houses for rent</H1>
        <Sub>{loading ? 'Loading…' : `${units.length} home${units.length === 1 ? '' : 's'} available now`}</Sub>
      </View>
      <ScreenBody onRefresh={refresh} refreshing={refreshing}>
        {blocks.length > 2 ? (
          <Segmented
            options={blocks.map((b) => ({ value: b, label: b === 'All' ? 'All' : b }))}
            value={block}
            onChange={setBlock}
          />
        ) : null}

        {units.map((u) => (
          <Card key={u.unit_id}>
            <View style={styles.between}>
              <View style={{ gap: 2 }}>
                <Label>
                  {u.building} · {formatFloor(u.floor)}
                </Label>
                <Serif style={styles.doorTitle}>House {u.unit_number}</Serif>
                <Sub>1BHK · whole house</Sub>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Serif style={styles.rent}>{formatRupees(u.rent)}</Serif>
                <Sub>per month</Sub>
              </View>
            </View>
            <Button variant="secondary" onPress={() => router.push(`/(applicant)/apply/${u.unit_id}`)}>
              {`Apply for ${u.unit_number}`}
            </Button>
          </Card>
        ))}

        {pendingApplication ? (
          <Card tint>
            <Label>Your application</Label>
            <View style={styles.between}>
              <Text style={styles.appName}>
                {pendingApplication.building_name} · House {pendingApplication.unit_number}
              </Text>
              <Chip status="unpaid" label="Pending" />
            </View>
            <Sub>The owner will call you after reviewing it.</Sub>
          </Card>
        ) : null}
      </ScreenBody>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12, gap: 4 },
  between: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  doorTitle: { fontSize: 24, marginTop: 2 },
  rent: { fontSize: 22 },
  appName: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: colors.ink, flexShrink: 1 },
});
