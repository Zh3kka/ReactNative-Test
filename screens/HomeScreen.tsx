import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { Post } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";

interface IHomeScreen {
  navigation: StackNavigationProp<any>;
}

const HomeScreen: React.FC<IHomeScreen> = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadPosts = async () => {
        const postsJson = await AsyncStorage.getItem("posts");
        if (postsJson) {
          setPosts(JSON.parse(postsJson));
        }
      };

      loadPosts();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.postContainer}
              onPress={() =>
                navigation.navigate("PostDetailScreen", { postId: item.id })
              }
            >
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} style={styles.image} />
              )}
              <Text style={styles.postTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text numberOfLines={3}>{item.content}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>Постов нет</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  postContainer: {
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
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    fontSize: 18,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;
