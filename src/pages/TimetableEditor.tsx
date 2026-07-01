import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { MoreVertical, FolderOpen, Wand2, Sparkles } from 'lucide-react';
import type { ClassBlock } from '../data/mockData';

const TimetableEditor = () => {
  const { groups, classBlocks, setClassBlocks } = useTimetable();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const [dropdownInfo, setDropdownInfo] = useState<{
    gradeId: string;
    classNum: number;
    day: string;
    period: number;
    block: ClassBlock | undefined;
  } | null>(null);
  // Modal state
  const [modal, setModal] = useState<{
    type: 'add' | 'change';
    gradeId: string;
    classNum: number;
    day: string;
    period: number;
    currentSubject?: string;
    blockId?: string;
  } | null>(null);
  const [inputSubject, setInputSubject] = useState('');

  // Auto-fill panel state
  const [autoFillSubject, setAutoFillSubject] = useState('');
  const [autoFillGrade, setAutoFillGrade] = useState('G1');
  const [autoFillClassCount, setAutoFillClassCount] = useState(7);
  const [autoFillHours, setAutoFillHours] = useState(1);
  const [autoFillResult, setAutoFillResult] = useState<string | null>(null);

  const DAYS: { key: string; label: string; maxPeriod: number }[] = [
    { key: 'Mon', label: '월', maxPeriod: 6 },
    { key: 'Tue', label: '화', maxPeriod: 6 },
    { key: 'Wed', label: '수', maxPeriod: 5 },
    { key: 'Thu', label: '목', maxPeriod: 6 },
    { key: 'Fri', label: '금', maxPeriod: 6 },
  ];

  const handleAutoFill = () => {
    if (!autoFillSubject.trim()) {
      setAutoFillResult('⚠️ 과목명을 입력해 주세요.');
      return;
    }
    const newBlocks: ClassBlock[] = [];
    let totalAssigned = 0;
    let skippedClasses: string[] = [];

    for (let classNum = 1; classNum <= autoFillClassCount; classNum++) {
      let assignedForClass = 0;

      outer: for (const day of DAYS) {
        for (let period = 1; period <= day.maxPeriod; period++) {
          if (assignedForClass >= autoFillHours) break outer;
          // Check if this slot is already occupied
          const occupied = [...classBlocks, ...newBlocks].some(
            b =>
              b.group_id === autoFillGrade &&
              b.class_num === classNum &&
              b.day_of_week === day.key &&
              b.period_start <= period &&
              b.period_start + b.duration > period
          );
          if (!occupied) {
            newBlocks.push({
              block_id: `CB_AUTO_${autoFillGrade}_${classNum}_${day.key}_${period}_${Date.now()}_${Math.random()}`,
              year_id: '2026',
              subject_id: autoFillSubject.trim(),
              teacher_id: '담당',
              room_id: `${classNum}반`,
              group_id: autoFillGrade,
              class_num: classNum,
              day_of_week: day.key,
              period_start: period,
              duration: 1,
              isExternal: false,
            });
            assignedForClass++;
            totalAssigned++;
          }
        }
      }

      if (assignedForClass < autoFillHours) {
        skippedClasses.push(`${classNum}반`);
      }
    }

    if (newBlocks.length === 0) {
      setAutoFillResult('❌ 배정할 수 있는 빈 슬롯이 없습니다.');
      return;
    }
    setClassBlocks(prev => [...prev, ...newBlocks]);
    const gradeLabel = autoFillGrade.replace('G', '') + '학년';
    let msg = `✅ ${gradeLabel} ${autoFillClassCount}개 학급에 "${autoFillSubject.trim()}" 총 ${totalAssigned}시간 배정 완료!`;
    if (skippedClasses.length > 0) {
      msg += ` (${skippedClasses.join(', ')} 빈 슬롯 부족으로 일부 미배정)`;
    }
    setAutoFillResult(msg);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setDropdownPos(null);
    setDropdownInfo(null);
  };

  const handleFileUpload = async (file: File) => {
    const assignedGroup = groups.find(g => g.name === '배정 대상');
    const assignedGrades = assignedGroup && assignedGroup.memberGradeIds.length > 0
      ? assignedGroup.memberGradeIds
      : ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];
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
    <>
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

      {/* Auto-fill Panel */}
      <div className="autofill-panel">
        <div className="autofill-panel-title">
          <Sparkles size={18} />
          <span>자동 과목 채우기</span>
          <span className="autofill-panel-desc">빈 시간을 찾아 선택한 학년 전 학급에 자동 배정합니다</span>
        </div>
        <div className="autofill-controls">
          <div className="autofill-field">
            <label>과목명</label>
            <input
              type="text"
              placeholder="예: 교통안전교육"
              value={autoFillSubject}
              onChange={e => setAutoFillSubject(e.target.value)}
              className="autofill-input"
            />
          </div>
          <div className="autofill-field">
            <label>학년</label>
            <select
              value={autoFillGrade}
              onChange={e => setAutoFillGrade(e.target.value)}
              className="autofill-select"
            >
              {['G1','G2','G3','G4','G5','G6'].map(g => (
                <option key={g} value={g}>{g.replace('G','')}학년</option>
              ))}
            </select>
          </div>
          <div className="autofill-field">
            <label>학급 수</label>
            <input
              type="number"
              min={1}
              max={20}
              value={autoFillClassCount}
              onChange={e => setAutoFillClassCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="autofill-input autofill-input-sm"
            />
            <span className="autofill-unit">반</span>
          </div>
          <div className="autofill-field">
            <label>반별 배정 시간</label>
            <input
              type="number"
              min={1}
              max={6}
              value={autoFillHours}
              onChange={e => setAutoFillHours(Math.max(1, parseInt(e.target.value) || 1))}
              className="autofill-input autofill-input-sm"
            />
            <span className="autofill-unit">시간</span>
          </div>
          <button className="btn autofill-btn" onClick={handleAutoFill}>
            <Sparkles size={16} /> 자동 배정
          </button>
        </div>
        {autoFillResult && (
          <div className={`autofill-result ${autoFillResult.startsWith('✅') ? 'autofill-result-ok' : 'autofill-result-err'}`}>
            {autoFillResult}
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', overflowX: 'auto' }}>
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
            const assignedGrades = assignedGroup && assignedGroup.memberGradeIds.length > 0
              ? assignedGroup.memberGradeIds
              : ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];
            
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
                              onClick={() => { if (activeDropdown) closeDropdown(); }}
                              >
                                <button 
                                  style={{ position: 'absolute', top: '2px', right: '2px', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', zIndex: 2 }}
                                  onClick={(e) => { 
                                    e.stopPropagation();
                                    if (activeDropdown === cellId) {
                                      closeDropdown();
                                    } else {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setDropdownPos({ top: rect.bottom + 4, left: rect.right - 100 });
                                      setDropdownInfo({ gradeId, classNum, day, period, block });
                                      setActiveDropdown(cellId);
                                    }
                                  }}
                                >
                                  <MoreVertical size={14} color="#718093" />
                                </button>
                                
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

    {/* Dropdown Menu (fixed positioned to avoid clipping) */}
    {activeDropdown && dropdownPos && dropdownInfo && (
      <>
        {/* Invisible overlay to close on outside click */}
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
          onClick={closeDropdown}
        />
        <div
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            background: 'white',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            borderRadius: '10px',
            padding: '6px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            minWidth: '100px',
            border: '1px solid #eee'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            style={{ padding: '7px 10px', textAlign: 'left', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontSize: '0.82rem', color: '#2f3640', borderRadius: '6px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f1f2f6')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            onClick={() => {
              closeDropdown();
              setInputSubject('');
              setModal({ type: 'add', gradeId: dropdownInfo.gradeId, classNum: dropdownInfo.classNum, day: dropdownInfo.day, period: dropdownInfo.period });
            }}
          >
            ➕ 수업 추가
          </button>
          <button
            style={{ padding: '7px 10px', textAlign: 'left', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontSize: '0.82rem', color: '#d63031', borderRadius: '6px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            onClick={() => {
              if (!dropdownInfo.block) { alert('삭제할 수업이 없습니다.'); closeDropdown(); return; }
              if (window.confirm(`[${dropdownInfo.gradeId.replace('G','')}학년 ${dropdownInfo.classNum}반] ${{ Mon:'월',Tue:'화',Wed:'수',Thu:'목',Fri:'금' }[dropdownInfo.day as 'Mon']} ${dropdownInfo.period}교시 '${dropdownInfo.block.subject_id}' 수업을 삭제하시겠습니까?`)) {
                setClassBlocks(prev => prev.filter(b => b.block_id !== dropdownInfo.block!.block_id));
              }
              closeDropdown();
            }}
          >
            🗑 수업 삭제
          </button>
          <button
            style={{ padding: '7px 10px', textAlign: 'left', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontSize: '0.82rem', color: '#2f3640', borderRadius: '6px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f1f2f6')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            onClick={() => {
              if (!dropdownInfo.block) { alert('변경할 수업이 없습니다.'); closeDropdown(); return; }
              setInputSubject(dropdownInfo.block.subject_id);
              setModal({ type: 'change', gradeId: dropdownInfo.gradeId, classNum: dropdownInfo.classNum, day: dropdownInfo.day, period: dropdownInfo.period, currentSubject: dropdownInfo.block.subject_id, blockId: dropdownInfo.block.block_id });
              closeDropdown();
            }}
          >
            ✏️ 과목 변경
          </button>
        </div>
      </>
    )}

    {/* Modal */}
    {modal && (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }} onClick={() => setModal(null)}>
        <div style={{
          background: 'white', borderRadius: '16px', padding: '32px',
          minWidth: '340px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }} onClick={e => e.stopPropagation()}>
          <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.2rem' }}>
            {modal.type === 'add' ? '수업 추가' : '과목 변경'}
          </h2>
          <p style={{ color: '#718093', fontSize: '0.9rem', marginBottom: '20px' }}>
            {modal.gradeId.replace('G','')}학년 {modal.classNum}반&nbsp;|&nbsp;
            {{Mon:'월',Tue:'화',Wed:'수',Thu:'목',Fri:'금'}[modal.day]} {modal.period}교시
            {modal.type === 'change' && ` ▸ 현재: ${modal.currentSubject}`}
          </p>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>과목명</label>
          <input
            autoFocus
            value={inputSubject}
            onChange={e => setInputSubject(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (!inputSubject.trim()) return;
                if (modal.type === 'add') {
                  setClassBlocks(prev => [...prev, {
                    block_id: `CB_MANUAL_${modal.gradeId}_${modal.classNum}_${modal.day}_${modal.period}_${Date.now()}`,
                    year_id: '2026', subject_id: inputSubject.trim(),
                    teacher_id: '담당', room_id: `${modal.classNum}반`,
                    group_id: modal.gradeId, class_num: modal.classNum,
                    day_of_week: modal.day, period_start: modal.period, duration: 1, isExternal: false
                  }]);
                } else {
                  setClassBlocks(prev => prev.map(b => b.block_id === modal.blockId ? { ...b, subject_id: inputSubject.trim() } : b));
                }
                setModal(null);
              }
            }}
            placeholder="과목명을 입력하세요"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              border: '1.5px solid #dcdde1', fontSize: '1rem',
              outline: 'none', boxSizing: 'border-box', marginBottom: '20px'
            }}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" style={{ padding: '8px 20px' }} onClick={() => setModal(null)}>취소</button>
            <button className="btn" style={{ padding: '8px 20px' }} onClick={() => {
              if (!inputSubject.trim()) return;
              if (modal.type === 'add') {
                setClassBlocks(prev => [...prev, {
                  block_id: `CB_MANUAL_${modal.gradeId}_${modal.classNum}_${modal.day}_${modal.period}_${Date.now()}`,
                  year_id: '2026', subject_id: inputSubject.trim(),
                  teacher_id: '담당', room_id: `${modal.classNum}반`,
                  group_id: modal.gradeId, class_num: modal.classNum,
                  day_of_week: modal.day, period_start: modal.period, duration: 1, isExternal: false
                }]);
              } else {
                setClassBlocks(prev => prev.map(b => b.block_id === modal.blockId ? { ...b, subject_id: inputSubject.trim() } : b));
              }
              setModal(null);
            }}>{modal.type === 'add' ? '추가' : '변경'}</button>
          </div>
        </div>
      </div>
    )}
  </>);
};

export default TimetableEditor;
