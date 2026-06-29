import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { Play, MoreVertical } from 'lucide-react';

const TimetableEditor = () => {
  const { groups, classBlocks, setClassBlocks } = useTimetable();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleAutoFill = () => {
    const newBlocks = [
      {
        block_id: "CB_AUTO_1",
        year_id: "2026",
        subject_id: "국어 (불러옴)",
        teacher_id: "T101",
        room_id: "R101",
        group_id: "GRP_A",
        day_of_week: "Mon",
        period_start: 3,
        duration: 1,
        isExternal: false,
      },
      {
        block_id: "CB_AUTO_2",
        year_id: "2026",
        subject_id: "수학 (불러옴)",
        teacher_id: "T102",
        room_id: "R102",
        group_id: "GRP_A",
        day_of_week: "Wed",
        period_start: 2,
        duration: 2,
        isExternal: false,
      },
      {
        block_id: "CB_AUTO_3",
        year_id: "2026",
        subject_id: "영어 (불러옴)",
        teacher_id: "T103",
        room_id: "R103",
        group_id: "GRP_B",
        day_of_week: "Tue",
        period_start: 1,
        duration: 2,
        isExternal: false,
      },
      {
        block_id: "CB_AUTO_4",
        year_id: "2026",
        subject_id: "과학 (불러옴)",
        teacher_id: "T104",
        room_id: "R104",
        group_id: "GRP_B",
        day_of_week: "Thu",
        period_start: 4,
        duration: 1,
        isExternal: true,
      }
    ];
    
    setClassBlocks(prev => {
      const existingIds = prev.map(b => b.block_id);
      const toAdd = newBlocks.filter(b => !existingIds.includes(b.block_id));
      return [...prev, ...toAdd];
    });
    
    alert('시간표 불러오기에서 가져온 과목들이 자동으로 채워졌습니다!');
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">시간표 템플릿 채우기 🪄</h1>
          <p className="page-subtitle">템플릿을 적용하여 시간표를 자동으로 배정합니다.</p>
        </div>
        <button className="btn" onClick={handleAutoFill}>
          <Play size={18} /> 자동 채우기
        </button>
      </div>

      <div className="card glass-panel" style={{ marginTop: '20px', padding: '20px', overflowX: 'auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '80px repeat(30, minmax(55px, 1fr))', 
          gap: '4px',
          background: '#f1f2f6',
          padding: '15px',
          borderRadius: '16px',
          minWidth: '1700px'
        }}>
          {/* Header Row 1 */}
          <div style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px', gridColumn: 1, gridRow: '1 / span 2', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid #dcdde1' }}>그룹</div>
          {['월', '화', '수', '목', '금'].map((day, i) => (
            <div key={day} style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px', gridColumn: `${i * 6 + 2} / span 6`, gridRow: 1, borderBottom: '2px solid #dcdde1', borderRight: i < 4 ? '2px solid #dcdde1' : 'none' }}>
              {day}
            </div>
          ))}

          {/* Header Row 2 */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].flatMap((day, d_index) => 
            [1, 2, 3, 4, 5, 6].map(period => (
              <div key={`header-${day}-${period}`} style={{ fontWeight: 'bold', textAlign: 'center', padding: '5px', gridColumn: 1 + (d_index * 6) + period, gridRow: 2, borderBottom: '2px solid #dcdde1', color: '#718093', fontSize: '0.8rem', borderRight: period === 6 && d_index < 4 ? '2px solid #dcdde1' : 'none' }}>
                {period}
              </div>
            ))
          )}

          {/* Slots per Group */}
          {groups.map((group, g_index) => {
            const rowIdx = g_index + 3;
            
            return (
              <React.Fragment key={group.group_id}>
                {/* Group Header */}
                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gridColumn: 1, gridRow: rowIdx, borderRight: '2px solid #dcdde1', background: 'white', borderRadius: '8px', padding: '5px', margin: '2px 0' }}>
                  {group.name}
                </div>

                {/* Day/Period Cells */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].flatMap((day, d_index) => 
                  [1, 2, 3, 4, 5, 6].map(period => {
                    const block = classBlocks.find(b => b.group_id === group.group_id && b.day_of_week === day && b.period_start <= period && b.period_start + b.duration > period);
                    
                    if (block && block.period_start < period) return null;

                    const colIdx = 1 + (d_index * 6) + period;
                    const cellId = `${group.group_id}-${day}-${period}`;
                    
                    return (
                      <div key={cellId} style={{ 
                        gridColumn: block ? `${colIdx} / span ${block.duration}` : `${colIdx} / span 1`,
                        gridRow: rowIdx,
                        background: block ? (block.isExternal ? 'var(--primary-light)' : 'var(--secondary-color)') : 'white', 
                        border: '1px dashed #dcdde1',
                        borderRadius: '8px',
                        padding: '5px',
                        textAlign: 'center',
                        minHeight: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: block ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        zIndex: block ? 5 : 1,
                        margin: '2px 0',
                        borderRight: period === 6 && d_index < 4 ? '2px solid #dcdde1' : '1px dashed #dcdde1'
                      }}
                      onClick={() => {
                        if (activeDropdown) {
                          setActiveDropdown(null);
                        } else {
                          alert(`해당 항목은 ${block ? block.subject_id : '빈칸'} 입니다.`);
                        }
                      }}
                      >
                        <button 
                          style={{ position: 'absolute', top: '2px', right: '2px', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setActiveDropdown(activeDropdown === cellId ? null : cellId); 
                          }}
                        >
                          <MoreVertical size={14} color="#718093" />
                        </button>
                        
                        {activeDropdown === cellId && (
                          <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '2px',
                            background: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                            padding: '5px',
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '90px'
                          }}>
                            <button style={{ padding: '6px', textAlign: 'left', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontSize: '0.8rem', color: '#2f3640' }} onClick={(e) => { e.stopPropagation(); alert('과목 추가'); setActiveDropdown(null); }}>과목 추가</button>
                            <button style={{ padding: '6px', textAlign: 'left', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontSize: '0.8rem', color: '#2f3640' }} onClick={(e) => { e.stopPropagation(); alert('과목 변경'); setActiveDropdown(null); }}>과목 변경</button>
                            <button style={{ padding: '6px', textAlign: 'left', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontSize: '0.8rem', color: '#d63031' }} onClick={(e) => { e.stopPropagation(); alert('과목 삭제'); setActiveDropdown(null); }}>과목 삭제</button>
                          </div>
                        )}
                        {block ? (
                          <>
                            <strong style={{ fontSize: '0.85rem' }}>{block.subject_id}</strong>
                            <span style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.6)' }}>교사: {block.teacher_id}</span>
                            {block.isExternal && <span style={{ fontSize: '0.65rem', color: '#d63031', marginTop: '2px', fontWeight: 'bold' }}>외부 강사</span>}
                          </>
                        ) : (
                          <span style={{ color: '#bdc3c7', fontSize: '0.8rem' }}>비었음</span>
                        )}
                      </div>
                    )
                  })
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default TimetableEditor;
