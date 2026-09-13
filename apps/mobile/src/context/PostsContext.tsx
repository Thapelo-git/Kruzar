import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type UserPost = {
  id: string;
  uri: string;
  isVideo: boolean;
  caption: string;
  username: string;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  liked: boolean;
  saved: boolean;
  isLive: boolean;
  momentCount: number;
  createdAt: number;
};

type PostsContextValue = {
  userPosts: UserPost[];
  addPost: (post: Omit<UserPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'saves' | 'shares' | 'liked' | 'saved' | 'isLive' | 'momentCount'>) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
};

const PostsContext = createContext<PostsContextValue | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);

  const addPost = useCallback((post: Omit<UserPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'saves' | 'shares' | 'liked' | 'saved' | 'isLive' | 'momentCount'>) => {
    const newPost: UserPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: Date.now(),
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0,
      liked: false,
      saved: false,
      isLive: false,
      momentCount: 0,
    };
    setUserPosts((prev) => [newPost, ...prev]);
  }, []);

  const toggleLike = useCallback((id: string) => {
    setUserPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
      ),
    );
  }, []);

  const toggleSave = useCallback((id: string) => {
    setUserPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, saved: !p.saved, saves: p.saved ? p.saves - 1 : p.saves + 1 } : p,
      ),
    );
  }, []);

  return (
    <PostsContext.Provider value={{ userPosts, addPost, toggleLike, toggleSave }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used inside PostsProvider');
  return ctx;
}
