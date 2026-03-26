import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScanResultContent } from '../components/ScanResultContent';
import type { RootStackParamList } from '../navigation/types';
import type { DocumentInputSource } from '../services/recognition';
import { useSessionScans } from '../session/SessionScanContext';
import { MIN_TOUCH_TARGET } from '../theme/accessibility';
import { DOCUMENT_TYPE_LABELS } from '../types/document';
import { confirmDestructive } from '../ui/confirmDestructive';

type Props = NativeStackScreenProps<RootStackParamList, 'HistoryDetail'>;

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
  meta: { fontSize: 13, color: '#64748b', marginBottom: 8 },
  typeLine: { fontSize: 16, marginBottom: 12 },
  bold: { fontWeight: '700' },
  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtnLabel: { fontSize: 16, color: '#b91c1c', fontWeight: '600' },
  deleteFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  deleteFooterLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#b91c1c',
  },
  missing: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  missingTitle: { fontSize: 18, fontWeight: '600', color: '#0f172a' },
  missingText: { fontSize: 15, lineHeight: 22, color: '#475569' },
  backLink: { marginTop: 8, alignSelf: 'flex-start' },
  backLinkLabel: { fontSize: 16, color: '#2563eb', fontWeight: '600' },
});
