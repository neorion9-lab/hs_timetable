
import { useTimetable } from '../context/TimetableContext';
import { Sparkles, CalendarPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const Dashboard = () => {
  const { academicYears, groups, setClassBlocks } = useTimetable();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

          const newBlocks: any[] = [];
          
          let currentGrade = "";
          for(let r = 2; r < jsonData.length; r++) {
            const row = jsonData[r];
            if (!row || row.length === 0) continue;
            
            // Check grade string
            if (row[0]) {
              const match = row[0].toString().match(/(\d)/);
              if (match) currentGrade = `G${match[1]}`;
            }
            if (!currentGrade || !assignedGrades.includes(currentGrade)) continue;
            
            const classStr = row[1];
            if (!classStr || typeof classStr !== 'string' || !classStr.includes('반')) continue;
            const classNum = parseInt(classStr.replace('반', ''));
            
            const days = [
              { name: 'Mon', start: 2, periods: 6 },
              { name: 'Tue', start: 8, periods: 6 },
              { name: 'Wed', start: 14, periods: 5 },
              { name: 'Thu', start: 19, periods: 6 },
              { name: 'Fri', start: 25, periods: 6 }
            ];
            
            for(const day of days) {
              for(let p = 0; p < day.periods; p++) {
                const colIdx = day.start + p;
                let val = row[colIdx];
                if (val) {
                  val = val.toString().trim();
                  let fullName = val;
                  if (val === '국') fullName = '국어';
                  if (val === '수') fullName = '수학';
                  if (val === '통') fullName = '통합';
                  if (val === '창') fullName = '창체';
                  if (val === '영') fullName = '영어';
                  if (val === '사') fullName = '사회';
                  if (val === '과') fullName = '과학';
                  if (val === '체') fullName = '체육';
                  if (val === '음') fullName = '음악';
                  if (val === '미') fullName = '미술';
                  if (val === '실') fullName = '실과';
                  if (val === '도') fullName = '도덕';
                  
                  newBlocks.push({
                     block_id: `CB_EXCEL_${currentGrade}_${classNum}_${day.name}_${p+1}`,
                     year_id: "2026",
                     subject_id: fullName,
                     teacher_id: "담당",
                     room_id: `${classNum}반`,
                     group_id: currentGrade,
                     class_num: classNum,
                     day_of_week: day.name,
                     period_start: p+1,
                     duration: 1,
                     isExternal: false
                  });
                }
              }
            }
          }

          setClassBlocks(newBlocks);
          alert(`'${file.name}' 시간표 파일이 성공적으로 파싱되어 반영되었습니다!`);
          navigate('/editor');

        } catch (error) {
          console.error("Excel parse error", error);
          alert("엑셀 파일을 파싱하는 중 오류가 발생했습니다.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fade-in">
      <h1 className="page-title" style={{ marginBottom: 'var(--spacing-sm)' }}>
        <img src="/logo.jpeg" alt="시수마법사" className="dashboard-logo" />
      </h1>
      <p className="page-subtitle">시수 마법사와 함께 편리하게 시간표를 관리하세요.</p>

      <div className="dashboard-grid">
        <div className="product-mockup-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <CalendarPlus size={24} color="var(--ink)" />
            <h2 style={{ margin: 0 }}>시간표 만들기</h2>
          </div>
          <p style={{ fontSize: '1.2rem', color: 'var(--ink)' }}><strong>{academicYears[0].label}</strong></p>
          <p>{academicYears[0].startDate} ~ {academicYears[0].endDate}</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".xlsx,.xls,.csv,.json"
            onChange={handleFileChange} 
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn" style={{ flex: 1, fontSize: '16px', fontWeight: 'bold' }} onClick={handleUploadClick}>
              <Sparkles size={20} /> 시간표 불러오기
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '16px', fontWeight: 'bold' }} onClick={() => navigate('/groups')}>
              <Users size={20} /> 시간표 배정하기
            </button>
          </div>
        </div>

        <div className="product-mockup-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Users size={24} color="var(--ink)" />
            <h2 style={{ margin: 0 }}>학년 그룹 현황</h2>
          </div>
          <p>현재 <strong>{groups.length}개</strong>의 그룹이 생성되어 있어요!</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '15px', marginBottom: '20px' }}>
            {groups.map(g => (
              <span key={g.group_id} style={{ background: 'var(--surface-strong)', color: 'var(--ink)', padding: '6px 14px', borderRadius: 'var(--rounded-pill)', fontSize: '0.9rem', fontWeight: 600 }}>
                {g.name}
              </span>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/groups')}>
            그룹 관리하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
