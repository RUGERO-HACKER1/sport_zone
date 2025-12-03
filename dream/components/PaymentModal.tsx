import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch, buildAuthHeaders } from '../lib/api';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onPaymentSuccess: (proof: string) => void;
  tournamentName: string;
  amount: string;
}

export default function PaymentModal({
  visible,
  onClose,
  onPaymentSuccess,
  tournamentName,
  amount
}: PaymentModalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Compress image
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select a screenshot of your payment');
      return;
    }

    setIsUploading(true);

    try {
      const stored = await AsyncStorage.getItem('sport-zone-auth');
      const token = stored ? JSON.parse(stored).token : null;

      if (!token) {
        Alert.alert('Error', 'You must be logged in');
        setIsUploading(false);
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('proof', {
        uri: image,
        name: 'payment_proof.jpg',
        type: 'image/jpeg',
      } as any);

      // Use fetch directly because apiFetch might not handle FormData correctly with JSON headers
      // We need to let the browser/engine set the Content-Type boundary
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/payments/upload-proof`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data', // DO NOT SET THIS MANUALLY
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Success', 'Payment proof uploaded! Admin will verify shortly.', [
          {
            text: 'OK',
            onPress: () => {
              onPaymentSuccess(data.proofUrl);
              onClose();
            }
          }
        ]);
      } else {
        throw new Error(data.message || 'Upload failed');
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Failed to upload proof');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Confirm Payment</Text>
          <Text style={styles.subtitle}>{tournamentName}</Text>
          <Text style={styles.amount}>{amount}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              1. Send {amount} to <Text style={styles.highlight}>0796216987 (RUGERO FIDELE)</Text> via Mobile Money.
            </Text>
            <Text style={styles.instructionText}>
              2. Take a screenshot of the confirmation message.
            </Text>
            <Text style={styles.instructionText}>
              3. Upload the screenshot below.
            </Text>
          </View>

          <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="cloud-upload-outline" size={50} color="#ffd700" />
                <Text style={styles.uploadText}>Tap to Upload Screenshot</Text>
              </View>
            )}
          </TouchableOpacity>

          {image && (
            <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
              <Text style={styles.changeButtonText}>Change Image</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isUploading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.payButton,
              (!image || isUploading) && styles.payButtonDisabled
            ]}
            onPress={handleUpload}
            disabled={!image || isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.payButtonText}>Submit Proof</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffd700',
    marginBottom: 5,
  },
  amount: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  instructions: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  instructionText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  highlight: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
  uploadArea: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 300,
  },
  placeholder: {
    alignItems: 'center',
  },
  uploadText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  changeButton: {
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
  },
  changeButtonText: {
    color: '#ffd700',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  payButton: {
    flex: 2,
    padding: 15,
    backgroundColor: '#ffd700',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#666',
  },
  payButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});