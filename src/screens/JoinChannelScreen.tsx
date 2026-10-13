import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationTypes';
import { AppHeader } from '../components/AppHeader';
import { ChannelInput } from '../components/ChannelInput';
import { APP_CONFIG } from '../constants/app.constants';
import { mockChannelService } from '../services/channel/MockChannelService';
import { validateAndNormalizeJoinInputs } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'JoinChannel'>;

export const JoinChannelScreen: React.FC<Props> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [channelId, setChannelId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    setErrorMessage(undefined);
    const validation = validateAndNormalizeJoinInputs({ displayName, channelId });

    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    try {
      setIsLoading(true);
      const session = await mockChannelService.joinChannel({
        displayName,
        channelId,
      });

      navigation.navigate('Call', {
        channelId: session.channelId,
        displayName: session.displayName,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to join channel';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChannel = () => {
    setErrorMessage(undefined);
    // Generate a clean human-readable random channel ID like 'room-4921'
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newChannel = `room-${randomSuffix}`;
    setChannelId(newChannel);
  };

  const handleOpenChatDirectly = () => {
    setErrorMessage(undefined);
    const validation = validateAndNormalizeJoinInputs({
      displayName: displayName || 'Guest User',
      channelId: channelId || 'demo-room',
    });

    if (validation.isValid && validation.normalizedChannelId && validation.normalizedDisplayName) {
      navigation.navigate('Chat', {
        channelId: validation.normalizedChannelId,
        displayName: validation.normalizedDisplayName,
      });
    } else {
      navigation.navigate('Chat', {
        channelId: 'demo-room',
        displayName: displayName.trim() || 'Guest User',
      });
    }
  };

  const insets = useSafeAreaInsets();

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
      <AppHeader title={APP_CONFIG.APP_NAME} subtitle="Audio & Video Calling Prototype" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>{APP_CONFIG.APP_NAME}</Text>
            <Text style={styles.heroSubtitle}>{APP_CONFIG.TAGLINE}</Text>
          </View>

          <View style={styles.noticeCard}>
            <Text style={styles.noticeBadge}>PROTOTYPE NOTICE</Text>
            <Text style={styles.noticeText}>{APP_CONFIG.PROTOTYPE_NOTICE}</Text>
          </View>

          <ChannelInput
            displayName={displayName}
            channelId={channelId}
            onChangeDisplayName={(val) => {
              setDisplayName(val);
              if (errorMessage) setErrorMessage(undefined);
            }}
            onChangeChannelId={(val) => {
              setChannelId(val);
              if (errorMessage) setErrorMessage(undefined);
            }}
            onSubmit={handleJoin}
            onCreateChannel={handleCreateChannel}
            errorMessage={errorMessage}
            isLoading={isLoading}
          />

          <View style={styles.chatShortcutContainer}>
            <Text style={styles.chatShortcutText}>Need to test messaging first?</Text>
            <TouchableOpacity
              style={styles.chatShortcutButton}
              onPress={handleOpenChatDirectly}
              activeOpacity={0.8}
            >
              <Text style={styles.chatShortcutButtonText}>💬 Open Mock Chat</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusFooter}>
            <View style={styles.statusDot} />
            <Text style={styles.statusFooterText}>
              Phase 1 Standalone Engine • RTC Ready Framework
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 18,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
  },
  noticeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#38bdf8',
  },
  noticeBadge: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  noticeText: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 17,
  },
  chatShortcutContainer: {
    marginTop: 20,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  chatShortcutText: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 10,
  },
  chatShortcutButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  chatShortcutButtonText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '600',
  },
  statusFooter: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  statusFooterText: {
    color: '#64748b',
    fontSize: 11,
  },
});
