import React, { useCallback, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Post } from "../types";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface IProfileScreen {
  navigation: StackNavigationProp<any>;
}

const ProfileScreen: React.FC<IProfileScreen> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        const userData = await AsyncStorage.getItem("userData");
        const postsData = await AsyncStorage.getItem("posts");
        if (userData) {
          const { username, id: userId } = JSON.parse(userData);
          setUsername(username);
          if (postsData) {
            const allPosts: Post[] = JSON.parse(postsData);
            const userPosts = allPosts.filter((post) => post.userId === userId);
            setPosts(userPosts);
          }
        }
      };
      loadProfile();
    }, [])
  );

  const removePost = async (postId: string) => {
    const filteredPosts = posts.filter((post) => post.id !== postId);
    setPosts(filteredPosts);

    const postsData = await AsyncStorage.getItem("posts");
    if (postsData) {
      let allPosts: Post[] = JSON.parse(postsData);
      const updatedPosts = allPosts.filter((post) => post.id !== postId);
      await AsyncStorage.setItem("posts", JSON.stringify(updatedPosts));
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    setUsername("");
    setPosts([]);
  };

  if (!username) {
    return (
      <View style={styles.containerNotFound}>
        <Text>Войдите, чтобы увидеть профиль пользователя</Text>
      </View>
    );
  }

  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.text}>Привет, {username}</Text>
      <Button
        title="Добавить пост"
        onPress={() => navigation.navigate("AddPost")}
      />
      <Ionicons
        name="exit-outline"
        size={24}
        color="black"
        onPress={handleLogout}
        style={{ marginLeft: 10 }}
      />
    </View>
  );

  const Footer = () => (
    <View style={styles.logoutSection}>
      <Button
        title="Редактировать профиль"
        onPress={() => navigation.navigate("EditProfile")}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <View style={styles.editRemoveIcons}>
              <AntDesign
                name="edit"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
                onPress={() =>
                  navigation.navigate("EditPost", {
                    postId: item.id,
                    title: item.title,
                    content: item.content,
                  })
                }
              />
              <FontAwesome
                name="remove"
                size={24}
                color="black"
                onPress={() => removePost(item.id)}
              />
            </View>
          </View>
        )}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerNotFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    marginRight: 10,
    maxWidth: "33%",
  },
  logoutSection: {
    marginVertical: 20,
    gap: 20,
  },
  postContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 30,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    maxWidth: "75%",
  },
  editRemoveIcons: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
  },
});

export default ProfileScreen;
