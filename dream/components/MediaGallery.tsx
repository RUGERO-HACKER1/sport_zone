import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
  timestamp: string;
  match: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const { colors } = useTheme();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.card,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    mediaGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 8,
    },
    mediaItem: {
      width: '33.33%',
      aspectRatio: 1,
      padding: 4,
    },
    mediaImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      backgroundColor: colors.border,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalImage: {
      width: '90%',
      height: '70%',
      borderRadius: 12,
    },
    modalContent: {
      padding: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
    },
    modalDescription: {
      fontSize: 14,
      color: '#ccc',
      marginBottom: 4,
    },
    modalTimestamp: {
      fontSize: 12,
      color: '#666',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      padding: 8,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Match Highlights</Text>
      </View>

      <ScrollView>
        <View style={styles.mediaGrid}>
          {media.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.mediaItem}
              onPress={() => setSelectedMedia(item)}
            >
              <Image
                source={{ uri: item.url }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedMedia}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMedia(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedMedia(null)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {selectedMedia && (
            <>
              <Image
                source={{ uri: selectedMedia.url }}
                style={styles.modalImage}
                resizeMode="contain"
              />
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedMedia.title}</Text>
                <Text style={styles.modalDescription}>{selectedMedia.description}</Text>
                <Text style={styles.modalTimestamp}>
                  {selectedMedia.match} • {selectedMedia.timestamp}
                </Text>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}