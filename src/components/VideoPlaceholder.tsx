import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface VideoPlaceholderProps {
  label: string;
  isLocal?: boolean;
  isVideoOff?: boolean;
  statusInfo?: string;
}

export const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  label,
  isLocal = false,
  isVideoOff = false,
  statusInfo,
}) => {
  return (
    <View style={[styles.container, isLocal ? styles.localContainer : styles.remoteContainer]}>
      <View style={styles.content}>
        <View style={[styles.avatar, isLocal ? styles.localAvatar : styles.remoteAvatar]}>
          <Text style={styles.avatarText}>
            {label.length > 0 ? label[0].toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {label} {isLocal ? '(You)' : ''}
        </Text>
        {isVideoOff ? (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>Camera Off</Text>
          </View>
        ) : null}
        {statusInfo ? (
          <Text style={styles.statusInfo}>{statusInfo}</Text>
        ) : (
          <Text style={styles.subtext}>
            {isLocal ? 'Local Video View Area' : 'Remote Video View Area'}
          </Text>
        )}
      </View>
      <View style={styles.overlayWatermark}>
        <Text style={styles.watermarkText}>
          {isLocal ? 'MOCK LOCAL STREAM' : 'MOCK REMOTE STREAM'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#090d16',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1e293b',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteContainer: {
    flex: 1,
    width: '100%',
    minHeight: 280,
  },
  localContainer: {
    width: 130,
    height: 180,
    position: 'absolute',
    right: 16,
    bottom: 16,
    zIndex: 10,
    backgroundColor: '#111827',
    borderColor: '#38bdf8',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  avatar: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  remoteAvatar: {
    width: 72,
    height: 72,
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  localAvatar: {
    width: 44,
    height: 44,
    backgroundColor: '#1e293b',
    borderWidth: 1.5,
    borderColor: '#38bdf8',
  },
  avatarText: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '700',
  },
  label: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtext: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  statusInfo: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  tagBadge: {
    backgroundColor: '#ef444420',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  tagText: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: '600',
  },
  overlayWatermark: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0f172a99',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  watermarkText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
