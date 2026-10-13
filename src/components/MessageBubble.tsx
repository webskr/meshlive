import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '../types/chat.types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { senderName, text, timestamp, isOutgoing } = message;

  return (
    <View
      style={[
        styles.container,
        isOutgoing ? styles.outgoingContainer : styles.incomingContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOutgoing ? styles.outgoingBubble : styles.incomingBubble,
        ]}
      >
        <Text style={[styles.sender, isOutgoing ? styles.outgoingSender : styles.incomingSender]}>
          {senderName} {isOutgoing ? '(You)' : ''}
        </Text>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    width: '100%',
    flexDirection: 'row',
  },
  outgoingContainer: {
    justifyContent: 'flex-end',
  },
  incomingContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  outgoingBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 2,
  },
  incomingBubble: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderBottomLeftRadius: 2,
  },
  sender: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
  },
  outgoingSender: {
    color: '#93c5fd',
  },
  incomingSender: {
    color: '#38bdf8',
  },
  text: {
    color: '#f8fafc',
    fontSize: 14,
    lineHeight: 19,
  },
  timestamp: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
