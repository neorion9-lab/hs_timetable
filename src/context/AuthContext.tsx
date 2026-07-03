import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  type User, 
  signInWithPopup, 
  signInWithRedirect,
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  getRedirectResult
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect result error:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        alert('팝업이 차단되었거나 카카오톡/연수원 내부 브라우저입니다.\\n\\n오류가 반복될 경우, 화면 우측 상단(또는 하단)의 메뉴(⋮)를 눌러 [다른 브라우저로 열기(크롬, 사파리 등)]를 선택해주세요.\\n\\n확인을 누르시면 리다이렉트 로그인을 시도합니다.');
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
      } else {
        console.error('Login Error:', error);
        alert(`로그인 실패: ${error.message}`);
      }
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
