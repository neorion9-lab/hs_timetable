import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { MoreVertical, FolderOpen, Wand2 } from 'lucide-react';
import type { ClassBlock } from '../data/mockData';

const TimetableEditor = () => {
  const { groups, classBlocks, setClassBlocks } = useTimetable();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    const assignedGroup = groups.find(g => g.name === '배정 대상');
    const assignedGrades = assignedGroup ? assignedGroup.memberGradeIds : [];
    if (assignedGrades.length === 0) {
      alert('그룹 관리에서 배정 대상 학년을 먼저 설정해주세요.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        const newBlocks: ClassBlock[] = [];
        const abbr: Record<string, string> = {
          '국': '국어', '수': '수학', '통': '통합', '창': '창체',
          '영': '영어', '사': '사회', '과': '과학', '체': '체육',
          '음': '음악', '미': '미술', '실': '실과', '도': '도덕'
        };
        const days = [
          { name: 'Mon', start: 2, periods: 6 },
          { name: 'Tue', start: 8, periods: 6 },
          { name: 'Wed', start: 14, periods: 5 },
          { name: 'Thu', start: 19, periods: 6 },
          { name: 'Fri', start: 25, periods: 6 }
        ];
        let currentGrade = '';
        for (let r = 2; r < jsonData.length; r++) {
          const row = jsonData[r];
          if (!row || row.length === 0) continue;
          if (row[0]) {
            const m = row[0].toString().match(/(\d)/);
            if (m) currentGrade = `G${m[1]}`;
          }
          if (!currentGrade || !assignedGrades.includes(currentGrade)) continue;
          const classStr = row[1];
          if (!classStr || typeof classStr !== 'string' || !classStr.includes('반')) continue;
          const classNum = parseInt(classStr.replace('반', ''));
          for (const day of days) {
            for (let p = 0; p < day.periods; p++) {
              const val = row[day.start + p]?.toString().trim();
              if (val) {
                newBlocks.push({
                  block_id: `CB_EXCEL_${currentGrade}_${classNum}_${day.name}_${p + 1}`,
                  year_id: '2026',
                  subject_id: abbr[val] ?? val,
                  teacher_id: '담당',
                  room_id: `${classNum}반`,
                  group_id: currentGrade,
                  class_num: classNum,
                  day_of_week: day.name,
                  period_start: p + 1,
                  duration: 1,
                  isExternal: false,
                });
              }
            }
          }
        }
        setClassBlocks(newBlocks);
        alert(`'${file.name}' 시간표가 성공적으로 불러와졌습니다!`);
      } catch (err) {
        alert('파일 파싱 중 오류가 발생했습니다.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileUpload(file);
    };
    input.click();
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">시간표 템플릿 채우기 🪄</h1>
          <p className="page-subtitle">불러온 시간표 파일의 내용이 자동으로 배치되었습니다.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => openFilePicker()}>
            <FolderOpen size={18} /> 새 일정 불러오기
          </button>
          <button className="btn" onClick={() => openFilePicker()}>
            <Wand2 size={18} /> 자동배정하기
          </button>
        </div>
      </div>

      <div className="card glass-panel" style={{ marginTop: '20px', padding: '20px', overflowX: 'auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '50px 50px repeat(30, minmax(55px, 1fr))', 
          gap: '0',
          background: '#f1f2f6',
          padding: '15px',
          borderRadius: '16px',
          minWidth: '1700px'
        }}>
          {/* Header Row 1 */}
          <div style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px', gridColumn: '1 / span 2', gridRow: '1 / span 2', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid #dcdde1', borderBottom: '2px solid #dcdde1', background: '#dfe4ea', borderTopLeftRadius: '8px' }}>구분</div>
          {['월', '화', '수', '목', '금'].map((day, i) => (
            <div key={day} style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px', gridColumn: `${i * 6 + 3} / span 6`, gridRow: 1, borderBottom: '2px solid #dcdde1', borderRight: i < 4 ? '2px solid #dcdde1' : 'none', background: '#dfe4ea', borderTopRightRadius: i === 4 ? '8px' : '0' }}>
              {day}
            </div>
          ))}

          {/* Header Row 2 */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].flatMap((day, d_index) => 
            [1, 2, 3, 4, 5, 6].map(period => (
              <div key={`header-${day}-${period}`} style={{ fontWeight: 'bold', textAlign: 'center', padding: '5px', gridColumn: 2 + (d_index * 6) + period, gridRow: 2, borderBottom: '2px solid #dcdde1', color: '#2f3640', fontSize: '0.8rem', borderRight: period === 6 && d_index < 4 ? '2px solid #dcdde1' : 'none', background: '#dfe4ea' }}>
                {period}
              </div>
            ))
          )}

          {/* Slots per Grade and Class */}
          {(() => {
            const assignedGroup = groups.find(g => g.name === '배정 대상');
            const assignedGrades = assignedGroup ? assignedGroup.memberGradeIds : [];
            
            const classCounts: Record<string, number> = {
              G1: 7,
              G2: 6,
              G3: 8,
              G4: 6,
              G5: 8,
              G6: 7
            };

            let currentRowIdx = 3;

            return assignedGrades.length === 0 ? (
              <div style={{ gridColumn: '1 / span 32', textAlign: 'center', padding: '40px', color: '#718093' }}>
                배정 대상 학년이 없습니다. 그룹 관리에서 학년을 배정해주세요.
              </div>
            ) : assignedGrades.map((gradeId) => {
              const startRowIdx = currentRowIdx;
              const numClasses = classCounts[gradeId] || 5;
              const gradeClasses = Array.from({ length: numClasses }, (_, i) => i + 1);
              const gradeLabel = `${gradeId.replace('G', '')}학년`;
              
              currentRowIdx += numClasses;

              return (
                <React.Fragment key={gradeId}>
                  {/* Grade Header (Spanning rows) */}
                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gridColumn: 1, gridRow: `${startRowIdx} / span ${numClasses}`, borderRight: '1px solid #dcdde1', background: 'white', padding: '5px', borderBottom: '2px solid #dcdde1' }}>
                    {gradeLabel}
                  </div>

                  {/* Class Rows */}
                  {gradeClasses.map((classNum, classIdx) => {
                    const rowIdx = startRowIdx + classIdx;
                    const isLastClass = classIdx === numClasses - 1;
                    
                    return (
                      <React.Fragment key={`${gradeId}-${classNum}`}>
                        {/* Class Label */}
                        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gridColumn: 2, gridRow: rowIdx, borderRight: '2px solid #dcdde1', background: 'white', padding: '5px', borderBottom: isLastClass ? '2px solid #dcdde1' : '1px solid #eee' }}>
                          {classNum}반
                        </div>

                        {/* Day/Period Cells */}
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].flatMap((day, d_index) => 
                          [1, 2, 3, 4, 5, 6].map(period => {
                            const block = classBlocks.find(b => b.group_id === gradeId && b.class_num === classNum && b.day_of_week === day && b.period_start <= period && b.period_start + b.duration > period);
                            
                            if (block && block.period_start < period) return null;

                            const colIdx = 2 + (d_index * 6) + period;
                            const cellId = `${gradeId}-${classNum}-${day}-${period}`;
                            
                            return (
                              <div key={cellId} style={{ 
                                gridColumn: block ? `${colIdx} / span ${block.duration}` : `${colIdx} / span 1`,
                                gridRow: rowIdx,
                                background: block ? (block.isExternal ? 'var(--primary-light)' : 'var(--secondary-color)') : 'white', 
                                borderBottom: isLastClass ? '2px solid #dcdde1' : '1px solid #eee',
                                padding: '5px',
                                textAlign: 'center',
                                minHeight: '60px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                position: 'relative',
                                boxShadow: block ? 'inset 0 0 0 1px rgba(0,0,0,0.05)' : 'none',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                zIndex: block ? 5 : 1,
                                borderRight: period === 6 && d_index < 4 ? '2px solid #dcdde1' : '1px solid #eee'
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
                                  <strong style={{ fontSize: '0.85rem' }}>{block.subject_id}</strong>
                                ) : null}
                              </div>
                            )
                          })
                        )}
                      </React.Fragment>
                    )
                  })}
                </React.Fragment>
              )
            })
          })()}
        </div>
      </div>
    </div>
  );
};

export default TimetableEditor;
