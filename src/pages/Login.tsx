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
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--canvas)',
      fontFamily: "var(--font-body)"
    }}>
      <div className="product-mockup-card" style={{
        maxWidth: '400px',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px 30px',
      }}>
        <div style={{
          background: 'var(--surface-soft)',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          border: '1px solid var(--hairline)'
        }}>
          <Calendar size={36} color="var(--ink)" />
        </div>
        <h1 style={{ margin: '0 0 10px 0', color: 'var(--ink)', fontSize: '24px', fontWeight: '600', fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}>
          시간표 도우미
        </h1>
        <p style={{ color: 'var(--body)', fontSize: '14px', marginBottom: '40px', textAlign: 'center', lineHeight: '1.55' }}>
          학교 시간표 자동 배정 및 관리 시스템입니다.<br/>교사 계정으로 로그인해 주세요.
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
          }}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo" 
            style={{ width: '20px', height: '20px' }} 
          />
          Google로 로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
