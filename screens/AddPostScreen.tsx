import React, { useState } from "react";
import { StyleSheet, Alert, TextInput, Button, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface IHomeScreen {
  navigation: StackNavigationProp<any>;
}

const AddPostScreen: React.FC<IHomeScreen> = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Ошибка", "Требуется разрешение на доступ к галерее");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const savePost = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (!userDataString) {
        Alert.alert(
          "Ошибка",
          "Необходимо войти в систему для добавления поста"
        );
        return;
      }
      const userData = JSON.parse(userDataString);
      const userId = userData.id;

      const newPost = {
        id: uuid.v4(),
        userId,
        title,
        content,
        imageUri,
      };

      const existingPostsString = await AsyncStorage.getItem("posts");
      const existingPosts = existingPostsString
        ? JSON.parse(existingPostsString)
        : [];
      existingPosts.push(newPost);

      await AsyncStorage.setItem("posts", JSON.stringify(existingPosts));
      Alert.alert("Успешно", "Пост добавлен");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить пост");
    }
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
      <Button title="Выбрать картинку" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TextInput
        placeholder="Заголовок поста"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Контент поста"
        value={content}
        onChangeText={setContent}
        style={[styles.input, styles.contentInput]}
      />
      <Button title="Сохранить пост" onPress={savePost} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginVertical: 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  contentInput: {
    height: 100,
    textAlignVertical: "top",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginVertical: 15,
    alignSelf: "center",
  },
  arrowBack: {
    marginBottom: 20,
  },
});

export default AddPostScreen;
