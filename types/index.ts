export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  imageUri?: string;
}

export type RootStackParamList = {
  Main: undefined;
  AddPost: undefined;
  PostDetailScreen: { postId: string };
  EditPost: undefined;
  EditProfile: undefined;
  Login: undefined;
  Register: undefined;
};

