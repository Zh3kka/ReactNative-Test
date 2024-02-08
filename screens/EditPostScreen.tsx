import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

const EditPostScreen = ({ navigation, route }: any) => {
  const [title, setTitle] = useState(route.params.title);
  const [content, setContent] = useState(route.params.content);
  const [imageUri, setImageUri] = useState(route.params.imageUri);
  const { postId } = route.params;

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

  const handleSave = async () => {
    const postsData = await AsyncStorage.getItem("posts");
    let posts = postsData ? JSON.parse(postsData) : [];
    const updatedPosts = posts.map((post: any) => {
      if (post.id === postId) {
        return { ...post, title, content, imageUri };
      }
      return post;
    });

    await AsyncStorage.setItem("posts", JSON.stringify(updatedPosts));
    Alert.alert("Пост обновлен", "Ваши изменения были сохранены.");
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
      <Button title="Выбрать другую картинку" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Заголовок поста"
      />
      <TextInput
        style={[styles.input, styles.content]}
        value={content}
        onChangeText={setContent}
        placeholder="Содержание поста"
        multiline
      />
      <Button title="Сохранить изменения" onPress={handleSave} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  input: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 10,
    borderRadius: 5,
  },
  content: {
    height: 150,
    textAlignVertical: "top",
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 20,
    borderWidth: 2,
  },
  arrowBack: {
    marginBottom: 20,
  },
});

export default EditPostScreen;
