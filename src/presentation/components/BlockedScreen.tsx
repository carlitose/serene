import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShieldX } from 'lucide-react-native';
import { APP_CONFIG } from '@/config/app.config';

interface Props {
  attemptedUrl: string | null;
  onGoBack: () => void;
}

export default function BlockedScreen({ attemptedUrl, onGoBack }: Props) {
  return (
    <View style={styles.container}>
      <ShieldX size={64} color={APP_CONFIG.COLORS.primary} />

      <Text style={styles.title}>Contenuto Bloccato</Text>

      <Text style={styles.message}>
        Questa sezione è stata bloccata per aiutarti a rimanere concentrato.
      </Text>

      {attemptedUrl && <Text style={styles.url}>{attemptedUrl}</Text>}

      <TouchableOpacity style={styles.button} onPress={onGoBack}>
        <Text style={styles.buttonText}>Torna ai Messaggi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: APP_CONFIG.COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  message: {
    color: APP_CONFIG.COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  url: {
    color: APP_CONFIG.COLORS.textMuted,
    fontSize: 12,
    marginBottom: 32,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: APP_CONFIG.COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: APP_CONFIG.COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
