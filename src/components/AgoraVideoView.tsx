import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RtcSurfaceView } from 'react-native-agora';
import { VideoPlaceholder } from './VideoPlaceholder';

interface AgoraVideoViewProps {
  uid: number; // 0 for local user, remoteUid for remote participant
  isLocal?: boolean;
  isVideoOff?: boolean;
  isAgoraActive: boolean;
  fallbackLabel: string;
  statusInfo?: string;
}

export const AgoraVideoView: React.FC<AgoraVideoViewProps> = ({
  uid,
  isLocal = false,
  isVideoOff = false,
  isAgoraActive,
  fallbackLabel,
  statusInfo,
}) => {
  // If Agora is active and video is not muted, render hardware RtcSurfaceView
  if (isAgoraActive && !isVideoOff) {
    return (
      <View style={[styles.container, isLocal ? styles.localContainer : styles.remoteContainer]}>
        <RtcSurfaceView
          style={styles.surfaceView}
          canvas={{ uid }}
        />
      </View>
    );
  }

  // Fallback to placeholder view
  return (
    <VideoPlaceholder
      label={fallbackLabel}
      isLocal={isLocal}
      isVideoOff={isVideoOff}
      statusInfo={statusInfo}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1e293b',
    overflow: 'hidden',
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
    borderColor: '#38bdf8',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8,
  },
  surfaceView: {
    width: '100%',
    height: '100%',
  },
});
