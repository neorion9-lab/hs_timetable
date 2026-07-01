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
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <div className="glass-panel" style={{
        maxWidth: '400px',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px 30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          background: 'var(--primary-light)',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <Calendar size={36} color="var(--primary-color)" />
        </div>
        <h1 style={{ margin: '0 0 10px 0', color: 'var(--text-color)', fontSize: '1.8rem', fontWeight: '700' }}>
          시간표 도우미
        </h1>
        <p style={{ color: '#7f8fa6', fontSize: '0.95rem', marginBottom: '40px', textAlign: 'center', lineHeight: '1.5' }}>
          학교 시간표 자동 배정 및 관리 시스템입니다.<br/>교사 계정으로 로그인해 주세요.
        </p>
        
        <button 
          className="btn" 
          onClick={signInWithGoogle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            padding: '14px 20px',
            fontSize: '1rem',
            background: 'white',
            color: '#333',
            border: '1px solid #dcdde1',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
            transition: 'all 0.2s',
            fontWeight: '600'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.05)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
            e.currentTarget.style.transform = 'translateY(0)';
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
