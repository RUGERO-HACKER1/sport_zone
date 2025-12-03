import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_DATA: 'user-data',
  TOURNAMENTS: 'tournaments-data',
  MESSAGES: 'chat-messages',
  SETTINGS: 'app-settings',
};

export const storage = {
  // User data
  async saveUserData(userData: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  },

  async getUserData() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.log('Error getting user data:', error);
      return null;
    }
  },

  // Tournaments
  async saveTournaments(tournaments: any[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
    } catch (error) {
      console.log('Error saving tournaments:', error);
    }
  },

  async getTournaments() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.log('Error getting tournaments:', error);
      return null;
    }
  },

  // Messages
  async saveMessages(messages: any[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.log('Error saving messages:', error);
    }
  },

  async getMessages() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.log('Error getting messages:', error);
      return [];
    }
  },

  // Clear all data
  async clearAll() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.log('Error clearing storage:', error);
    }
  },
};