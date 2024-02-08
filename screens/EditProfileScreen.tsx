import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

const EditProfileScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const { username } = JSON.parse(userData);
        setUsername(username);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    const userDataString = await AsyncStorage.getItem("userData");
    let userData = userDataString ? JSON.parse(userDataString) : {};
    const updatedUserData = {
      ...userData,
      username,
    };

    await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
    Alert.alert("Профиль обновлен", "Ваши изменения были сохранены.");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <AntDesign
        name="arrowleft"
        size={24}
        color="black"
        onPress={() => navigation.goBack()}
        style={styles.arrowBack}
      />
      <Text style={styles.label}>Имя пользователя:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Введите ваше имя пользователя"
      />
      <Button title="Сохранить изменения" onPress={handleSave} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 10,
    borderRadius: 5,
  },
  arrowBack: {
    marginBottom: 20,
  },
});

export default EditProfileScreen;
