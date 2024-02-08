import { View, Text, Alert, TextInput, Button, StyleSheet } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import uuid from "react-native-uuid";

interface IRegisterScreen {
  navigation: StackNavigationProp<any>;
}

const RegisterScreen: React.FC<IRegisterScreen> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const userId = uuid.v1();
    const userData = JSON.stringify({ id: userId, username, password });
    await AsyncStorage.setItem("userData", userData);

    Alert.alert("Регистрация", "Вы успешно зарегистрировались");
    navigation.navigate("Login");
    setUsername("");
    setPassword("");
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
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          style={styles.input}
        />
        <Button title="Зарегистрироваться" onPress={handleRegister} />
        <View style={styles.footer}>
          <Text>Есть аккаунт? </Text>
          <Button title="Войти" onPress={() => navigation.navigate("Login")} />
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

export default RegisterScreen;
