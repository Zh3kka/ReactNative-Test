import { View, Text, Alert, TextInput, Button, StyleSheet } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";

interface ILoginScreen {
  navigation: StackNavigationProp<any>;
}

const LoginScreen: React.FC<ILoginScreen> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const { username: savedUsername, password: savedPassword } =
          JSON.parse(userData);
        if (username === savedUsername && password === savedPassword) {
          Alert.alert("Вход", "Вы успешно вошли");
          navigation.navigate("Profile");
        } else {
          Alert.alert("Ошибка", "Неверное имя пользователя или пароль!");
        }
      } else {
        Alert.alert("Ошибка", "Пользователь не найден");
      }
      setUsername("");
      setPassword("");
    } catch (error) {
      Alert.alert("Ошибка", "Произошла ошибка при входе");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "80%" }}>
        <TextInput
          placeholder="Имя пользователя"
          onChangeText={setUsername}
          value={username}
          style={styles.input}
        />
        <TextInput
          placeholder="Пароль"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
          style={styles.input}
        />
        <Button title="Войти" onPress={handleLogin} />
        <View style={styles.footer}>
          <Text>Нет аккаунта? </Text>
          <Button
            title="Регистрация"
            onPress={() => navigation.navigate("Register")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default LoginScreen;
