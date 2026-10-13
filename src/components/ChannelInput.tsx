import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';

interface ChannelInputProps {
  displayName: string;
  channelId: string;
  onChangeDisplayName: (text: string) => void;
  onChangeChannelId: (text: string) => void;
  onSubmit: () => void;
  onCreateChannel?: () => void;
  errorMessage?: string;
  isLoading?: boolean;
}

export const ChannelInput: React.FC<ChannelInputProps> = ({
  displayName,
  channelId,
  onChangeDisplayName,
  onChangeChannelId,
  onSubmit,
  onCreateChannel,
  errorMessage,
  isLoading = false,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Your Display Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Alex"
        placeholderTextColor="#64748b"
        value={displayName}
        onChangeText={onChangeDisplayName}
        autoCapitalize="words"
        autoCorrect={false}
      />

      <View style={styles.channelLabelRow}>
        <Text style={styles.label}>Channel ID</Text>
        {onCreateChannel ? (
          <TouchableOpacity onPress={onCreateChannel} activeOpacity={0.7}>
            <Text style={styles.generateButtonText}>✨ Generate Random</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <TextInput
        style={styles.input}
        placeholder="e.g. team-room-101"
        placeholderTextColor="#64748b"
        value={channelId}
        onChangeText={onChangeChannelId}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.joinButton, isLoading && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Join Channel"
        >
          <Text style={styles.buttonText}>{isLoading ? 'Connecting...' : 'Join Channel'}</Text>
        </TouchableOpacity>

        {onCreateChannel ? (
          <TouchableOpacity
            style={[styles.button, styles.createButton, isLoading && styles.buttonDisabled]}
            onPress={onCreateChannel}
            disabled={isLoading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Create Channel"
          >
            <Text style={styles.createButtonText}>+ Create New</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#f8fafc',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
    marginTop: 12,
    fontWeight: '500',
  },
  channelLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 12,
  },
  generateButtonText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButton: {
    backgroundColor: '#2563eb',
    flex: 1.2,
  },
  createButton: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#38bdf8',
    flex: 1,
  },
  createButtonText: {
    color: '#38bdf8',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
