import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationTypes';
import { AppHeader } from '../components/AppHeader';
import { AgoraVideoView } from '../components/AgoraVideoView';
import { CallControls } from '../components/CallControls';
import { useAgoraCall } from '../hooks/useAgoraCall';
import { useMockCall } from '../hooks/useMockCall';

type Props = NativeStackScreenProps<RootStackParamList, 'Call'>;

export const CallScreen: React.FC<Props> = ({ route, navigation }) => {
  const { channelId, displayName } = route.params;
  const insets = useSafeAreaInsets();
  const [useFallbackMock, setUseFallbackMock] = useState<boolean>(false);

  // Real Agora RTC Call hook
  const agoraCall = useAgoraCall({
    channelId,
    displayName,
  });

  // Mock Call fallback hook
  const mockCall = useMockCall({
    channelId,
    displayName,
    remoteParticipantName: 'Remote Peer (Mock)',
  });

  const activeCall = useFallbackMock ? mockCall : agoraCall;
  const { state, actions } = activeCall;

  const getStatusBadgeStyle = () => {
    switch (state.status) {
      case 'Connected':
        return styles.badgeConnected;
      case 'Calling':
      case 'Incoming Call':
        return styles.badgeCalling;
      case 'Ended':
        return styles.badgeEnded;
      default:
        return styles.badgeIdle;
    }
  };

  const getRemoteStatusDescription = () => {
    switch (state.status) {
      case 'Connected':
        return 'Connected in channel (Simulated)';
      case 'Calling':
        return 'Calling remote peer...';
      case 'Incoming Call':
        return 'Incoming call ringing...';
      case 'Ended':
        return 'Call ended';
      default:
        return 'Ready to start call';
    }
  };

  return (
    <View
      style={[
        styles.rootContainer,
        {
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <AppHeader
        title={`# ${channelId}`}
        subtitle={`User: ${displayName}`}
        onBack={() => {
          actions.endCall();
          navigation.goBack();
        }}
        rightActionLabel="Chat 💬"
        onRightAction={() => {
          navigation.navigate('Chat', { channelId, displayName });
        }}
      />

      <View style={styles.statusBar}>
        <View style={styles.statusInfoRow}>
          <Text style={styles.channelLabel}>
            Channel: {channelId} {state.localUid ? `(UID: ${state.localUid})` : ''}
          </Text>
          <View style={[styles.statusBadge, getStatusBadgeStyle()]}>
            <Text style={styles.statusBadgeText}>{state.status}</Text>
          </View>
        </View>

        <View style={styles.modeToggleRow}>
          <Text style={styles.engineModeText}>
            Mode: {useFallbackMock ? 'Mock Fallback' : 'Agora RTC Engine (Native)'}
          </Text>
          <TouchableOpacity
            style={styles.switchModeButton}
            onPress={() => {
              actions.endCall();
              setUseFallbackMock((prev) => !prev);
            }}
          >
            <Text style={styles.switchModeButtonText}>
              Switch to {useFallbackMock ? 'Agora RTC' : 'Mock'}
            </Text>
          </TouchableOpacity>
        </View>

        {state.errorMessage ? (
          <Text style={styles.errorBannerText}>⚠️ {state.errorMessage}</Text>
        ) : null}
      </View>

      <View style={styles.videoStage}>
        {/* Remote participant video stream */}
        <AgoraVideoView
          uid={state.remoteUid || 0}
          isLocal={false}
          isAgoraActive={state.isAgoraActive && state.remoteUid !== null}
          fallbackLabel={state.remoteParticipantName}
          statusInfo={getRemoteStatusDescription()}
        />

        {/* Local user self preview video stream */}
        <AgoraVideoView
          uid={0}
          isLocal={true}
          isVideoOff={state.media.isCameraOff}
          isAgoraActive={state.isAgoraActive}
          fallbackLabel={displayName}
          statusInfo={state.media.isMuted ? 'Mic Muted' : 'Mic On'}
        />
      </View>

      <CallControls state={state} actions={actions} />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  statusBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  statusInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  channelLabel: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  badgeIdle: {
    backgroundColor: '#475569',
  },
  badgeCalling: {
    backgroundColor: '#eab308',
  },
  badgeConnected: {
    backgroundColor: '#16a34a',
  },
  badgeEnded: {
    backgroundColor: '#dc2626',
  },
  modeToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  engineModeText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  switchModeButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  switchModeButtonText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
  },
  errorBannerText: {
    color: '#f87171',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  videoStage: {
    flex: 1,
    margin: 12,
    position: 'relative',
  },
});
