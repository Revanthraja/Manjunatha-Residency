import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '@/src/constants/theme';
import { Button, Card, Chip, Field } from '@/src/components';
import { Icon } from '@/src/components/Icon';
import { H1, Label, Name, Sub } from '@/src/components/Text';
import { ScreenBody, ScreenRoot } from '@/src/components/Screen';
import { formatDate } from '@/src/lib/format';
import { BillStatus } from '@/src/constants/theme';
import { useRaiseRepairController } from '@/src/controllers/useRaiseRepairController';

type Props = ReturnType<typeof useRaiseRepairController>;

function statusChip(status: string): { s: BillStatus; label: string } {
  if (status === 'resolved') return { s: 'unpaid', label: 'Fixed' };
  if (status === 'in_progress') return { s: 'in_progress', label: 'In progress' };
  return { s: 'partial', label: 'Open' };
}

export function RaiseRepairView(props: Props) {
  const { loading, myRepairs, description, setDescription, image, addPhoto, submitting, error, submit } = props;

  return (
    <ScreenRoot>
      <View style={styles.top}>
        <H1>Repairs</H1>
        <Sub>Tell us what needs fixing.</Sub>
      </View>
      <ScreenBody>
        <Card>
          <Field
            label="What’s wrong?"
            value={description}
            onChangeText={setDescription}
            placeholder="For example: bathroom tap is leaking"
            multiline
            numberOfLines={4}
            style={styles.textarea}
          />
          <Pressable style={styles.drop} onPress={addPhoto}>
            <Icon name="camera" size={22} color={colors.mutedStrong} />
            <Text style={styles.dropText}>{image ? 'Photo added · tap to replace' : 'Add a photo'}</Text>
          </Pressable>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button onPress={submit} loading={submitting}>
            Send request
          </Button>
        </Card>

        <Label>Your requests</Label>
        <View style={styles.list}>
          {loading ? (
            <Sub style={{ padding: 16 }}>Loading…</Sub>
          ) : myRepairs.length === 0 ? (
            <Sub style={{ padding: 16 }}>Nothing raised yet.</Sub>
          ) : (
            myRepairs.map((r, i) => {
              const chip = statusChip(r.status);
              return (
                <View key={r.id} style={[styles.row, i > 0 && styles.divider]}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Name numberOfLines={1}>{r.description}</Name>
                    <Sub>
                      Raised {formatDate(r.created_at)}
                      {r.resolved_at ? ` · fixed ${formatDate(r.resolved_at)}` : ''}
                    </Sub>
                  </View>
                  <Chip status={chip.s} label={chip.label} />
                </View>
              );
            })
          )}
        </View>
      </ScreenBody>
    </ScreenRoot>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12, gap: 4 },
  textarea: { height: 104, paddingTop: 12, textAlignVertical: 'top' },
  drop: {
    height: 64,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    backgroundColor: '#FBF9F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  dropText: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.mutedStrong },
  error: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.overdueFg },
  list: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, minHeight: 44 },
  divider: { borderTopWidth: 1, borderTopColor: colors.divider },
});
