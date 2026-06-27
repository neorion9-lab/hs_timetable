import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { Play } from 'lucide-react';

const TimetableEditor = () => {
  const { groups, classBlocks } = useTimetable();
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.group_id || '');

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">시간표 템플릿 채우기 🪄</h1>
          <p className="page-subtitle">마법처럼 빈칸을 꽉꽉! 채워보자구~</p>
        </div>
        <button className="btn" onClick={() => alert('얍! 템플릿 자동 채우기 마법 발동! (MVP 가짜 기능이야 ㅎㅎ)')}>
          <Play size={18} /> 자동 채우기
        </button>
      </div>

      <div className="card glass-panel" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          {groups.map(g => (
            <button 
              key={g.group_id} 
              className={selectedGroup === g.group_id ? 'btn' : 'btn btn-secondary'}
              onClick={() => setSelectedGroup(g.group_id)}
            >
              {g.name}
            </button>
          ))}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '80px repeat(5, 1fr)', 
          gap: '10px',
          background: '#f1f2f6',
          padding: '20px',
          borderRadius: '24px'
        }}>
          {/* Header */}
          <div style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px' }}>교시</div>
          {['월', '화', '수', '목', '금'].map(day => (
            <div key={day} style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px' }}>{day}</div>
          ))}

          {/* Slots */}
          {[1, 2, 3, 4, 5, 6].map(period => (
            <React.Fragment key={period}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#718093' }}>{period}교시</div>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => {
                const block = classBlocks.find(b => b.group_id === selectedGroup && b.day_of_week === day && b.period_start <= period && b.period_start + b.duration > period);
                
                return (
                  <div key={`${period}-${day}`} style={{ 
                    background: block ? (block.isExternal ? 'var(--primary-light)' : 'var(--secondary-color)') : 'white', 
                    border: '1px dashed #dcdde1',
                    borderRadius: '16px',
                    padding: '15px',
                    textAlign: 'center',
                    minHeight: '90px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: block ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => alert(`이건 ${block ? block.subject_id : '빈칸'} 이라구!`)}
                  >
                    {block ? (
                      <>
                        <strong style={{ fontSize: '1.1rem' }}>{block.subject_id}</strong>
                        <span style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.6)' }}>교사: {block.teacher_id}</span>
                        {block.isExternal && <span style={{ fontSize: '0.75rem', color: '#d63031', marginTop: '5px', fontWeight: 'bold' }}>외부 강사</span>}
                      </>
                    ) : (
                      <span style={{ color: '#bdc3c7', fontSize: '0.9rem' }}>비었음</span>
                    )}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetableEditor;
