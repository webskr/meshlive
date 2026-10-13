import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CallActions, CallSessionState } from '../types/call.types';

interface CallControlsProps {
  state: CallSessionState;
  actions: CallActions;
}

export const CallControls: React.FC<CallControlsProps> = ({ state, actions }) => {
  const { status, media } = state;

  return (
    <View style={styles.container}>
      {/* Simulation triggers when Idle */}
      {status === 'Idle' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={actions.startCall}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Start Call"
          >
            <Text style={styles.primaryButtonText}>📞 Start Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.simulationButton]}
            onPress={actions.simulateIncomingCall}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Simulate Incoming Call"
          >
            <Text style={styles.simulationButtonText}>📲 Simulate Incoming Call</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Actions when Calling or Connecting */}
      {(status === 'Calling' || status === 'Connecting') && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.button, styles.endButton]}
            onPress={actions.endCall}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Cancel Call"
          >
            <Text style={styles.buttonText}>✕ Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Error status actions */}
      {status === 'Error' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={actions.resetCall}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Retry"
          >
            <Text style={styles.primaryButtonText}>↺ Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Incoming Call response actions */}
      {status === 'Incoming Call' && (
        <View style={styles.incomingRow}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={actions.acceptCall}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Accept Call"
          >
            <Text style={styles.buttonText}>✓ Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={actions.rejectCall}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Reject Call"
          >
            <Text style={styles.buttonText}>✕ Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Active Call Controls */}
      {status === 'Connected' && (
        <View style={styles.activeControlsRow}>
          <TouchableOpacity
            style={[styles.circleButton, media.isMuted && styles.activeCircleButton]}
            onPress={actions.toggleMute}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={media.isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            <Text style={styles.circleButtonText}>{media.isMuted ? '🔇' : '🎙️'}</Text>
            <Text style={styles.circleLabel}>{media.isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleButton, media.isCameraOff && styles.activeCircleButton]}
            onPress={actions.toggleCamera}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={media.isCameraOff ? 'Turn camera on' : 'Turn camera off'}
          >
            <Text style={styles.circleButtonText}>{media.isCameraOff ? '🚫' : '📹'}</Text>
            <Text style={styles.circleLabel}>{media.isCameraOff ? 'Cam On' : 'Cam Off'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleButton, styles.endCircleButton]}
            onPress={actions.endCall}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="End Call"
          >
            <Text style={styles.circleButtonText}>🔴</Text>
            <Text style={styles.circleLabel}>End</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Ended status actions */}
      {status === 'Ended' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={actions.resetCall}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Call Again"
          >
            <Text style={styles.primaryButtonText}>↺ Call Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  incomingRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'center',
  },
  activeControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    flex: 1,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  simulationButton: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#38bdf8',
    flex: 1,
  },
  simulationButtonText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  acceptButton: {
    backgroundColor: '#16a34a',
    flex: 1,
  },
  rejectButton: {
    backgroundColor: '#dc2626',
    flex: 1,
  },
  endButton: {
    backgroundColor: '#dc2626',
    flex: 1,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  circleButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeCircleButton: {
    backgroundColor: '#b91c1c',
    borderColor: '#ef4444',
  },
  endCircleButton: {
    backgroundColor: '#dc2626',
    borderColor: '#ef4444',
  },
  circleButtonText: {
    fontSize: 22,
  },
  circleLabel: {
    color: '#cbd5e1',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
});
