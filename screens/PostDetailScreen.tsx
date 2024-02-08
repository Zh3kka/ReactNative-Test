import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Post, RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PostDetailScreen"
>;

type PostDetailScreenProps = {
  route: RouteProp<RootStackParamList, "PostDetailScreen">;
  navigation: ProfileScreenNavigationProp;
};

const PostDetailScreen: React.FC<PostDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      const postsJson = await AsyncStorage.getItem("posts");
      if (postsJson) {
        const posts: Post[] = JSON.parse(postsJson);
        const foundPost = posts.find((p) => p.id === postId);
        if (foundPost) {
          setPost(foundPost);
        }
      }
    };

    loadPost();
  }, [postId]);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Пост не найден.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView>
        <AntDesign
          name="arrowleft"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
          style={styles.arrowBack}
        />
        {post.imageUri && (
          <Image source={{ uri: post.imageUri }} style={styles.image} />
        )}
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postContent}>{post.content}</Text>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  postContent: {
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  arrowBack: {
    marginBottom: 20,
  },
});

export default PostDetailScreen;
