import { ArrowUpRight, Minus } from 'lucide-react';

const YearCompare = () => {
  return (
    <div className="fade-in">
      <h1 className="page-title">연도별 차이점 비교 📊</h1>
      <p className="page-subtitle">작년이랑 뭐가 달라졌을까? 한눈에 딱 보이게 짱구가 정리해 줄게!</p>

      <div className="dashboard-grid">
        <div className="card glass-panel" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#718093', marginBottom: '15px' }}>교사 충돌 수 차이</h3>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <ArrowUpRight size={45} /> 5건
          </div>
          <p style={{ marginTop: '15px', fontWeight: 600 }}>작년보다 조금 늘었어 ㅠㅠ</p>
        </div>

        <div className="card glass-panel" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#718093', marginBottom: '15px' }}>신규 외부 수업</h3>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#1dd1a1', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <ArrowUpRight size={45} /> 12차시
          </div>
          <p style={{ marginTop: '15px', fontWeight: 600 }}>AI 수업이 새로 생겼지!</p>
        </div>

        <div className="card glass-panel" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#718093', marginBottom: '15px' }}>강의실 충돌</h3>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--secondary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <Minus size={45} /> 0건
          </div>
          <p style={{ marginTop: '15px', fontWeight: 600 }}>오! 완벽해! 충돌 제로!</p>
        </div>
      </div>

      <div className="card glass-panel" style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.4rem', color: 'var(--primary-color)' }}>상세 차이 표</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f2f6' }}>
              <th style={{ padding: '20px 15px', color: '#718093' }}>구분</th>
              <th style={{ padding: '20px 15px', color: '#718093' }}>2024-2025 (작년)</th>
              <th style={{ padding: '20px 15px', color: '#718093' }}>2025-2026 (올해)</th>
              <th style={{ padding: '20px 15px', color: '#718093' }}>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f2f6', transition: 'background 0.2s' }}>
              <td style={{ padding: '20px 15px', fontWeight: 600 }}>3학년 AI 수업</td>
              <td style={{ padding: '20px 15px' }}>없음</td>
              <td style={{ padding: '20px 15px' }}>주 2시간</td>
              <td style={{ padding: '20px 15px', color: '#1dd1a1', fontWeight: 'bold' }}>신규 추가</td>
            </tr>
            <tr style={{ transition: 'background 0.2s' }}>
              <td style={{ padding: '20px 15px', fontWeight: 600 }}>체육관 사용(그룹A)</td>
              <td style={{ padding: '20px 15px' }}>월 1교시</td>
              <td style={{ padding: '20px 15px' }}>화 2교시</td>
              <td style={{ padding: '20px 15px', color: 'var(--secondary-color)', fontWeight: 'bold' }}>변경됨</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YearCompare;
