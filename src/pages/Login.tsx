import { useAuth } from '../context/AuthContext';
import { Calendar } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { user, signInWithGoogle } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--canvas)',
      fontFamily: "var(--font-body)",
      padding: '20px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}>
        <div className="product-mockup-card" style={{
          maxWidth: '680px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: 'var(--surface-soft)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid var(--hairline)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <Calendar size={40} color="var(--ink)" />
          </div>
          <h1 style={{ margin: '0 0 12px 0', color: 'var(--ink)', fontSize: '40px', fontWeight: '500', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
            시수마법사 🪄
          </h1>
          <p style={{ color: 'var(--body)', fontSize: '18px', marginBottom: '24px', textAlign: 'center', lineHeight: '1.6', wordBreak: 'keep-all' }}>
            며칠씩 걸리던 시간표 작업,<br/>클릭 한 번으로 끝나는 자동 배정
          </p>
          
          <button 
            onClick={signInWithGoogle}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              height: '60px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '16px',
              transition: 'all 0.2s ease',
            }}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              style={{ width: '30px', height: '30px' }} 
            />
            Google로 로그인
          </button>
          
          <div style={{
            marginTop: '24px',
            padding: '12px 24px',
            background: 'var(--surface-soft)',
            borderRadius: '100px',
            fontSize: '16px',
            fontWeight: '500',
            color: 'var(--body)',
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--hairline)',
            letterSpacing: '-0.2px'
          }}>
            ✨ 복잡한 조건도 단 1초 만에 스마트하게 배정
          </div>
          
          <img 
            src="/title11.jpeg" 
            alt="제출자 소속" 
            style={{ 
              marginTop: '24px', 
              width: '100%', 
              maxWidth: '360px', 
              borderRadius: '16px',
              objectFit: 'contain'
            }} 
          />
        </div>
      </div>
      
      <footer style={{
        textAlign: 'center',
        fontSize: '14px',
        color: '#2f3640',
        fontWeight: 'bold',
        marginTop: '16px'
      }}>
        저작권: ⓒ 2026 Hyunsil_ORION. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
