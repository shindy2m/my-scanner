import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScanResultContent } from '../components/ScanResultContent';
import type { HistoryStackParamList } from '../navigation/types';
import type { DocumentInputSource } from '../services/recognition';
import { useSessionScans } from '../session/SessionScanContext';
import { MIN_TOUCH_TARGET } from '../theme/accessibility';
import { j } from '../theme/jablotron';
import { DOCUMENT_TYPE_LABELS } from '../types/document';
import { confirmDestructive } from '../ui/confirmDestructive';

type Props = NativeStackScreenProps<HistoryStackParamList, 'HistoryDetail'>;

function isImageLikeInput(
  previewUri: string | null,
  source: DocumentInputSource | null
): boolean {
  if (!previewUri) return false;
  return source === 'camera' || source === 'gallery' || source === 'file';
}

export function HistoryDetailScreen({ navigation, route }: Props) {
  const { scanId } = route.params;
  const { items, removeScan } = useSessionScans();
  const item = items.find((i) => i.id === scanId);

  const handleDelete = useCallback(() => {
    confirmDestructive(
      'Smazat sken',
      'Opravdu chcete tuto položku odebrat z historie relace?',
      () => {
        removeScan(scanId);
        navigation.goBack();
      }
    );
  }, [scanId, removeScan, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        item ? (
          <Pressable
            onPress={handleDelete}
            style={styles.headerBtn}
            accessibilityLabel="Smazat položku z historie"
            hitSlop={8}
          >
            <Text style={styles.headerBtnLabel}>Smazat</Text>
          </Pressable>
        ) : null,
    });
  }, [navigation, item, handleDelete]);

  if (!item) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>Položka není k dispozici</Text>
        <Text style={styles.missingText}>
          Mohla být smazána nebo historie byla obnovena.
        </Text>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backLink}
          accessibilityRole="button"
        >
          <Text style={styles.backLinkLabel}>Zpět na historii</Text>
        </Pressable>
      </View>
    );
  }

  const openFullImage = () => {
    if (!item.previewUri) return;
    navigation.navigate('FullImage', { uri: item.previewUri });
  };

  const beforeFields = (
    <>
      <Text style={styles.meta}>
        {new Date(item.scannedAt).toLocaleString('cs-CZ')}
      </Text>
      <Text style={styles.typeLine}>
        Typ dokumentu:{' '}
        <Text style={styles.bold}>{DOCUMENT_TYPE_LABELS[item.documentType]}</Text>
      </Text>
    </>
  );

  const deleteFooter = (
    <Pressable
      onPress={handleDelete}
      style={styles.deleteFooter}
      accessibilityRole="button"
      accessibilityLabel="Smazat položku z historie relace"
    >
      <Text style={styles.deleteFooterLabel}>Smazat z historie</Text>
    </Pressable>
  );

  return (
    <ScanResultContent
      previewUri={item.previewUri}
      onPreviewPress={
        isImageLikeInput(item.previewUri, item.inputSource)
          ? openFullImage
          : undefined
      }
      beforeStandardFields={beforeFields}
      footer={deleteFooter}
      documentType={item.documentType}
      standardFields={item.standardFields}
      transcript={item.transcript}
    />
  );
}

const styles = StyleSheet.create({
  meta: {
    fontSize: j.font.sm - 1,
    color: j.text.tertiary,
    marginBottom: j.space[2],
  },
  typeLine: { fontSize: j.font.base, marginBottom: j.space[3], color: j.text.primary },
  bold: { fontWeight: j.weight.bold },
  headerBtn: {
    paddingHorizontal: j.space[3],
    paddingVertical: j.space[2],
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtnLabel: {
    fontSize: j.font.base,
    color: j.text.negative,
    fontWeight: j.weight.semibold,
  },
  deleteFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: 14,
    paddingHorizontal: j.space[4],
    borderRadius: j.radius.xl,
    borderWidth: 2,
    borderColor: j.border.primary,
    backgroundColor: j.bg.negative,
  },
  deleteFooterLabel: {
    fontSize: j.font.lg - 1,
    fontWeight: j.weight.semibold,
    color: j.text.negative,
  },
  missing: {
    flex: 1,
    padding: j.space[6],
    justifyContent: 'center',
    gap: j.space[3],
  },
  missingTitle: {
    fontSize: j.font.lg,
    fontWeight: j.weight.semibold,
    color: j.text.primary,
  },
  missingText: {
    fontSize: j.font.sm + 1,
    lineHeight: 22,
    color: j.text.secondary,
  },
  backLink: { marginTop: j.space[2], alignSelf: 'flex-start' },
  backLinkLabel: {
    fontSize: j.font.base,
    color: j.text.link,
    fontWeight: j.weight.semibold,
  },
});
