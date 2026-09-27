import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Label, Sub } from '@/src/components/Text';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { Segmented, UnitListItem, List } from '@/src/components';
import { BillStatus } from '@/src/constants/theme';
import { formatRupees } from '@/src/lib/format';
import { useUnitsController } from '@/src/controllers/useUnitsController';

type Props = ReturnType<typeof useUnitsController>;

function statusFor(u: Props['groups'][number]['units'][number]): { status: BillStatus; label?: string } {
  if (!u.current_tenancy) return { status: 'vacant' };
  const s = (u.current_tenancy.latest_bill_status ?? 'unpaid') as BillStatus;
  if (s === 'partial') return { status: 'partial' };
  return { status: (['paid', 'overdue', 'unpaid'] as string[]).includes(s) ? (s as BillStatus) : 'unpaid' };
}

export function UnitsView(props: Props) {
  const { loading, refreshing, refresh, buildings, buildingCounts, buildingId, setBuildingId, groups, counts } = props;
  const router = useRouter();

  return (
    <ScreenRoot>
      <ScreenHeader
        title="Units"
        subtitle={loading ? 'Loading…' : `${counts.total} houses · ${counts.occupied} occupied · ${counts.vacant} vacant`}
      />
      <ScreenBody onRefresh={refresh} refreshing={refreshing}>
        {buildings.length > 1 ? (
          <Segmented
            options={buildings.map((b) => ({ value: b.id, label: `${b.name} · ${buildingCounts[b.id] ?? ''}` }))}
            value={buildingId ?? buildings[0]?.id}
            onChange={setBuildingId}
          />
        ) : null}

        {groups.map((group) => (
          <View key={group.floor} style={{ gap: 8 }}>
            <Label>{group.label}</Label>
            <List>
              {group.units.map((u) => {
                const { status, label } = statusFor(u);
                return (
                  <UnitListItem
                    key={u.id}
                    door={u.unit_number}
                    name={u.current_tenancy ? u.current_tenancy.tenant.full_name : 'Vacant'}
                    sub={
                      u.current_tenancy
                        ? status === 'overdue'
                          ? 'Not paid this month'
                          : status === 'partial'
                            ? 'Part paid this month'
                            : 'This month paid'
                        : `Asking ${formatRupees(u.rent)}`
                    }
                    status={status}
                    statusLabel={label}
                    onPress={() =>
                      u.current_tenancy
                        ? router.push(`/(staff)/units/${u.id}`)
                        : router.push(`/(staff)/units/move-in?unitId=${u.id}`)
                    }
                  />
                );
              })}
            </List>
          </View>
        ))}

        {!loading && groups.length === 0 ? <Sub>No houses in this block yet.</Sub> : null}
      </ScreenBody>
    </ScreenRoot>
  );
}
