import { useState, useEffect, useCallback } from 'react';
import { X, Shield, FileText, User } from 'lucide-react';

/* ──────────────────────────────────────────
   정적 본문 (마크다운 → JSX 직접 표현)
────────────────────────────────────────── */

const PRIVACY_CONTENT = (
  <div className="legal-body">
    <div className="legal-meta">
      <span>서비스명: 시수 마법사 (HS Timetable)</span>
      <span>최종 수정일: 2026년 06월 30일</span>
      <span>시행일: 2026년 07월 01일</span>
    </div>

    <h2>제1조 (목적)</h2>
    <p>본 방침은 <strong>시수 마법사</strong>(이하 "서비스")를 운영·제공하는 과정에서 이용자(교사, 행정직원 등 학교 구성원)의 개인정보를 어떻게 수집·이용·보관·파기하는지를 안내합니다. 서비스는 대한민국 「개인정보 보호법」 및 관련 법령을 준수합니다.</p>

    <h2>제2조 (수집하는 개인정보의 항목 및 수집 방법)</h2>
    <h3>1. 수집 항목</h3>
    <table>
      <thead><tr><th>구분</th><th>수집 항목</th><th>수집 목적</th></tr></thead>
      <tbody>
        <tr><td>필수</td><td>교원 이름, 역할(담임/전담/외부강사 등)</td><td>시간표 블록 배치 및 교사 충돌 확인</td></tr>
        <tr><td>선택</td><td>가용 시간대(요일·교시), 최대 수업 부하</td><td>충돌 없는 시간표 자동 생성</td></tr>
        <tr><td>자동 수집</td><td>브라우저 종류, 화면 해상도, 접속 일시, 클라이언트 IP</td><td>서비스 오류 추적 및 보안 관제</td></tr>
      </tbody>
    </table>
    <div className="legal-note">
      <strong>미성년자(학생) 관련 데이터:</strong> 본 서비스는 학생 개인을 식별하는 정보를 수집하지 않습니다. 시간표는 학년·반·교시 단위로만 처리됩니다.
    </div>
    <h3>2. 수집 방법</h3>
    <ul>
      <li>관리자가 엑셀(.xlsx/.xls/.csv) 또는 JSON 파일을 직접 업로드</li>
      <li>웹 UI(그룹 관리, 시간표 에디터)에서 직접 입력</li>
      <li>서버 접근 로그를 통한 자동 수집</li>
    </ul>

    <h2>제3조 (개인정보의 이용 목적)</h2>
    <p>수집한 개인정보는 아래 목적으로만 이용합니다.</p>
    <ol>
      <li><strong>시간표 생성·관리</strong>: 교사별 가용 시간 기반 수업 블록 배치 및 충돌 검증</li>
      <li><strong>외부강사 수업 배치</strong>: 외부강사 가용성 정보를 활용한 AI 수업 등 특수 수업 매핑</li>
      <li><strong>서비스 운영·개선</strong>: 오류 추적, 성능 최적화, 피드백 수집 설문 연동</li>
      <li><strong>보안 및 접근 제어</strong>: RBAC(역할 기반 접근 제어) 적용을 위한 역할 정보 확인</li>
    </ol>

    <h2>제4조 (개인정보의 보유·이용 기간 및 파기)</h2>
    <h3>보유 기간</h3>
    <table>
      <thead><tr><th>데이터 유형</th><th>보유 기간</th></tr></thead>
      <tbody>
        <tr><td>시간표 데이터(교사명, 역할 포함)</td><td>학사연도 종료 후 <strong>3년</strong></td></tr>
        <tr><td>서버 접근 로그</td><td><strong>6개월</strong></td></tr>
        <tr><td>피드백 설문 응답</td><td>수집 후 <strong>1년</strong></td></tr>
      </tbody>
    </table>
    <h3>파기 절차</h3>
    <ul>
      <li><strong>전자 파일</strong>: 복구 불가능한 방식으로 영구 삭제(덮어쓰기 또는 안전한 포맷)</li>
      <li><strong>출력물(인쇄본 등)</strong>: 파쇄기로 분쇄 또는 소각</li>
      <li>보유 기간 경과 시 지체 없이(30일 이내) 파기</li>
    </ul>

    <h2>제5조 (개인정보의 제3자 제공)</h2>
    <p>서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다음 경우에는 예외적으로 제공될 수 있습니다.</p>
    <ul>
      <li>이용자가 사전에 동의한 경우</li>
      <li>법령에 의거하여 수사기관 등 관계 기관이 법적 절차에 따라 요청하는 경우</li>
    </ul>

    <h2>제6조 (개인정보 처리의 위탁)</h2>
    <p>현재 서비스는 외부 업체에 개인정보 처리를 위탁하지 않습니다. 향후 위탁이 필요한 경우, 위탁 업체명 및 위탁 업무 내용을 본 방침에 공개하고 사전에 이용자에게 고지합니다.</p>

    <h2>제7조 (이용자의 권리 및 행사 방법)</h2>
    <table>
      <thead><tr><th>권리</th><th>내용</th></tr></thead>
      <tbody>
        <tr><td>열람권</td><td>자신의 개인정보 처리 현황 확인 요청</td></tr>
        <tr><td>정정·삭제권</td><td>부정확하거나 불필요한 정보 수정·삭제 요청</td></tr>
        <tr><td>처리 정지권</td><td>일정 목적에 대한 처리 중단 요청</td></tr>
      </tbody>
    </table>
    <p>권리 행사는 서비스 관리자(학교 행정실 또는 IT 담당자)에게 서면·이메일로 요청하며, <strong>10일 이내</strong> 처리합니다.</p>

    <h2>제8조 (개인정보의 안전성 확보 조치)</h2>
    <ul>
      <li><strong>접근 제어</strong>: RBAC 기반으로 역할(교장, 교감, 교사, 행정직원, 외부강사 조정팀)별 접근 권한 분리</li>
      <li><strong>전송 보안</strong>: HTTPS/TLS를 통한 암호화 전송</li>
      <li><strong>내부망 운영</strong>: 서비스는 학교 내부망에서만 접근 가능하도록 제한</li>
      <li><strong>데이터 백업</strong>: 연도별 아카이브 및 롤백 가능 구조를 통해 데이터 무결성 유지</li>
      <li><strong>접속 기록 관리</strong>: 서버 접근 로그 6개월 보관, 무단 접근 탐지</li>
    </ul>

    <h2>제9조 (쿠키 및 자동 수집 도구의 사용)</h2>
    <p>서비스는 세션 유지 및 보안 목적으로 <strong>세션 쿠키</strong>를 사용합니다.</p>
    <ul>
      <li>쿠키는 브라우저 종료 시 자동 삭제됩니다.</li>
      <li>이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있으나, 이 경우 로그인 등 일부 기능이 제한될 수 있습니다.</li>
    </ul>

    <h2>제10조 (개인정보 보호책임자)</h2>
    <table>
      <thead><tr><th>항목</th><th>내용</th></tr></thead>
      <tbody>
        <tr><td>담당자 직책</td><td>교사</td></tr>
        <tr><td>담당자</td><td>이현실</td></tr>
        <tr><td>연락 방법</td><td>개원초 교무실 02-2138-1940</td></tr>
      </tbody>
    </table>
    <p>외부 기관에 신고하려면 아래를 이용하실 수 있습니다.</p>
    <ul>
      <li>개인정보 침해신고센터: privacy.kisa.or.kr / ☎ 118</li>
      <li>개인정보 분쟁조정위원회: www.kopico.go.kr / ☎ 1833-6972</li>
    </ul>

    <h2>제11조 (방침의 변경)</h2>
    <p>본 방침은 관련 법령 개정, 서비스 기능 변경 등의 사유로 수정될 수 있습니다. 변경 시 서비스 공지 화면을 통해 <strong>7일 전</strong> 사전 고지합니다(중대한 변경의 경우 <strong>30일 전</strong>).</p>

    <div className="legal-effective">본 개인정보처리방침은 2026년 07월 01일부터 시행됩니다.</div>
  </div>
);

const TERMS_CONTENT = (
  <div className="legal-body">
    <div className="legal-meta">
      <span>서비스명: 시수 마법사 (HS Timetable)</span>
      <span>최종 수정일: 2026년 06월 30일</span>
      <span>시행일: 2026년 07월 01일</span>
    </div>

    <h2>제1조 (목적)</h2>
    <p>본 약관은 <strong>시수 마법사</strong>(이하 "서비스")의 이용 조건, 절차, 권리·의무 및 책임 사항을 규정함으로써 이용자(교사, 행정직원, 외부강사 조정팀 등 학교 구성원)와 운영자 간의 권익을 보호하고 원활한 서비스 이용을 도모하는 것을 목적으로 합니다.</p>

    <h2>제2조 (정의)</h2>
    <table>
      <thead><tr><th>용어</th><th>정의</th></tr></thead>
      <tbody>
        <tr><td><strong>서비스</strong></td><td>초등학교 1–6학년 전체 시간표를 웹 기반으로 생성·관리·비교하는 도구</td></tr>
        <tr><td><strong>이용자</strong></td><td>서비스에 접근하여 시간표를 입력·열람·편집하는 학교 구성원</td></tr>
        <tr><td><strong>관리자</strong></td><td>RBAC 권한을 설정하고 서비스 전반을 총괄하는 IT 담당자 또는 행정실장</td></tr>
        <tr><td><strong>수업 블록</strong></td><td>특정 학년·반·요일·교시에 배치된 단일 수업 단위(ClassBlock)</td></tr>
        <tr><td><strong>학년 그룹</strong></td><td>시간표 배치 편의를 위해 동적으로 구성되는 학년 묶음(GradeGroup)</td></tr>
        <tr><td><strong>외부강사 수업</strong></td><td>AI 수업 등 학교 외부 인력이 진행하는 수업(isExternal: true)</td></tr>
        <tr><td><strong>콘텐츠</strong></td><td>이용자가 업로드하거나 생성한 시간표 파일, 데이터, 설정값 일체</td></tr>
      </tbody>
    </table>

    <h2>제3조 (약관의 효력 및 변경)</h2>
    <ol>
      <li>본 약관은 서비스 초기 화면에 게시하며, 이용자가 서비스에 최초 접속함과 동시에 효력이 발생합니다.</li>
      <li>운영자는 「전자상거래 등에서의 소비자보호에 관한 법률」 등 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있습니다.</li>
      <li>약관 변경 시 적용 일자 및 변경 사유를 서비스 공지 화면에 <strong>7일 전</strong> 고지합니다. 중대한 변경의 경우 <strong>30일 전</strong> 고지합니다.</li>
      <li>변경된 약관에 동의하지 않으면 서비스 이용을 중단하고 관리자에게 계정 삭제를 요청할 수 있습니다.</li>
    </ol>

    <h2>제4조 (서비스 이용 자격)</h2>
    <ol>
      <li>서비스는 해당 학교에 소속된 구성원(교사, 행정직원, 외부강사 조정팀 등)에 한하여 이용을 허가합니다.</li>
      <li>관리자가 부여한 계정(또는 접근 권한)을 통해서만 서비스를 이용할 수 있습니다.</li>
      <li>제3자에게 계정·접근 권한을 양도하거나 대여할 수 없습니다.</li>
    </ol>

    <h2>제5조 (서비스의 제공 및 변경)</h2>
    <h3>제공 기능</h3>
    <table>
      <thead><tr><th>기능</th><th>설명</th></tr></thead>
      <tbody>
        <tr><td>시간표 불러오기</td><td>엑셀(.xlsx/.xls/.csv) 또는 JSON 파일 업로드로 수업 블록 자동 파싱</td></tr>
        <tr><td>그룹 관리</td><td>Drag-and-Drop으로 학년 그룹 생성·편집·재배치</td></tr>
        <tr><td>시간표 에디터</td><td>수업 블록 단위 수정, 충돌 확인, 외부강사 수업 매핑</td></tr>
        <tr><td>피드백 수집</td><td>설문 형식의 피드백 창구 제공</td></tr>
        <tr><td>데이터 내보내기</td><td>완성된 시간표를 파일로 저장 (추후 지원 예정)</td></tr>
      </tbody>
    </table>
    <ol>
      <li>운영자는 서비스의 기능을 변경하거나 일시 중단할 수 있으며, 이 경우 사전에 공지합니다.</li>
      <li>기술적 사유(서버 점검, 시스템 오류 등)로 인한 일시 중단에는 사전 고지가 어려울 수 있습니다.</li>
    </ol>

    <h2>제6조 (이용자의 의무)</h2>
    <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
    <ol>
      <li><strong>무단 데이터 유출</strong>: 서비스를 통해 취득한 교원 정보, 시간표 데이터 등을 무단으로 외부에 제공하거나 공유하는 행위</li>
      <li><strong>허위 데이터 입력</strong>: 시간표 운영에 혼란을 초래할 목적으로 의도적으로 잘못된 데이터를 입력하는 행위</li>
      <li><strong>무단 접근 시도</strong>: 자신에게 부여된 권한(역할) 범위를 초과하여 타인의 데이터에 접근하는 행위</li>
      <li><strong>서비스 방해</strong>: 악성 파일 업로드, 과도한 서버 요청 등 정상적인 서비스 운영을 방해하는 행위</li>
      <li><strong>권한 양도</strong>: 계정 또는 접근 권한을 제3자에게 임의로 양도·공유하는 행위</li>
    </ol>

    <h2>제7조 (운영자의 의무)</h2>
    <ol>
      <li>운영자는 서비스를 안정적으로 제공하기 위해 지속적으로 노력합니다.</li>
      <li>이용자의 개인정보를 「개인정보처리방침」에 따라 안전하게 보호합니다.</li>
      <li>이용자로부터 서비스 이용 관련 불만·불편 사항이 접수되면 신속하게 처리합니다.</li>
      <li>학교 내부망 환경에서의 RBAC 기반 접근 제어를 유지하여 무단 접근을 방지합니다.</li>
    </ol>

    <h2>제8조 (저작권 및 지식재산권)</h2>
    <ol>
      <li>서비스의 UI, 소스코드, 알고리즘, 로고 등의 지식재산권은 운영자 또는 개발자에게 귀속됩니다.</li>
      <li>이용자가 서비스에 업로드한 시간표 데이터의 소유권은 해당 학교에 귀속됩니다.</li>
      <li>운영자는 이용자가 업로드한 데이터를 서비스 제공 목적 이외에 사용하지 않습니다.</li>
      <li>서비스를 무단으로 복제·배포·상업적으로 이용하는 행위는 금지됩니다.</li>
    </ol>

    <h2>제9조 (데이터 관리 및 백업)</h2>
    <ol>
      <li>이용자는 중요한 시간표 데이터를 주기적으로 직접 백업할 것을 권장합니다.</li>
      <li>운영자는 연도별 아카이브 구조를 유지하며, 롤백 기능을 통해 데이터 복구를 지원합니다.</li>
      <li>천재지변, 서버 장애 등 불가항력적인 사유로 인한 데이터 손실에 대해 운영자의 책임은 제한될 수 있습니다.</li>
    </ol>

    <h2>제10조 (파일 업로드 규정)</h2>
    <ol>
      <li>이용자는 시간표 파일(.xlsx, .xls, .csv, .json)만 업로드할 수 있습니다.</li>
      <li>업로드 파일에 악성 코드·바이러스가 포함된 경우, 해당 이용자는 그로 인한 손해에 대해 책임을 집니다.</li>
      <li>서비스는 업로드된 파일을 파싱하여 수업 블록 데이터로 변환하며, 원본 파일은 처리 후 즉시 삭제됩니다.</li>
      <li>파일 형식이 서비스에서 정한 구조와 맞지 않는 경우 파싱이 실패할 수 있으며, 이는 이용자 책임의 범위 내에 있습니다.</li>
    </ol>

    <h2>제11조 (접근 권한 및 역할)</h2>
    <p>서비스는 아래 역할별로 차등 접근 권한(RBAC)을 적용합니다.</p>
    <table>
      <thead><tr><th>역할</th><th>주요 권한</th></tr></thead>
      <tbody>
        <tr><td><strong>관리자(IT/행정실장)</strong></td><td>전체 데이터 열람·수정, 사용자 계정 관리, 시스템 설정</td></tr>
        <tr><td><strong>교사(담임/전담)</strong></td><td>소속 학년 시간표 열람 및 수정 요청</td></tr>
        <tr><td><strong>행정직원</strong></td><td>전체 시간표 열람</td></tr>
        <tr><td><strong>외부강사 조정팀</strong></td><td>외부강사 수업 블록 열람 및 가용 시간 입력</td></tr>
      </tbody>
    </table>
    <p>관리자에 의해 부여된 권한 범위를 초과한 접근 시도는 즉시 차단되며, 보안 로그에 기록됩니다.</p>

    <h2>제12조 (면책 조항)</h2>
    <ol>
      <li>운영자는 다음 경우에 대해 책임을 지지 않습니다.
        <ul>
          <li>이용자의 귀책 사유로 인한 서비스 이용 장애</li>
          <li>제3자의 해킹·침해로 인한 데이터 손상 (단, 운영자의 관리 소홀이 없는 경우)</li>
          <li>이용자가 서비스를 통해 기대하는 특정 성과(충돌 없는 시간표 자동 생성 등)의 미달성</li>
          <li>천재지변, 정전 등 불가항력적 사유</li>
        </ul>
      </li>
      <li>서비스의 자동 시간표 생성·충돌 확인 기능은 참고 도구이며, 최종 시간표 확정 결정은 이용자(교사, 행정실)에게 있습니다.</li>
    </ol>

    <h2>제13조 (서비스 해지 및 계정 삭제)</h2>
    <ol>
      <li>이용자는 언제든지 관리자에게 계정 삭제를 요청할 수 있습니다.</li>
      <li>관리자는 다음 경우 이용자의 접근 권한을 즉시 정지 또는 삭제할 수 있습니다.
        <ul>
          <li>본 약관을 위반한 경우</li>
          <li>학교 구성원 자격을 상실한 경우(졸업, 전출, 계약 종료 등)</li>
        </ul>
      </li>
      <li>계정 삭제 시 해당 이용자의 접근 이력 등은 보안 정책에 따라 일정 기간 보관 후 파기됩니다.</li>
    </ol>

    <h2>제14조 (분쟁 해결)</h2>
    <ol>
      <li>서비스 이용과 관련한 분쟁은 운영자와 이용자가 성실하게 협의하여 해결합니다.</li>
      <li>협의가 이루어지지 않을 경우, 운영자의 소재지를 관할하는 법원을 합의 관할 법원으로 합니다.</li>
      <li>본 약관에 명시되지 않은 사항은 대한민국 관련 법령 및 상관습에 따릅니다.</li>
    </ol>

    <h2>제15조 (준거법)</h2>
    <p>본 약관은 대한민국 법률에 따라 해석되고 적용됩니다.</p>

    <div className="legal-effective">본 이용약관은 2026년 07월 01일부터 시행됩니다.</div>
  </div>
);

/* ──────────────────────────────────────────
   Modal Component
────────────────────────────────────────── */

type ModalType = 'terms' | 'privacy' | null;

interface LegalModalProps {
  type: ModalType;
  onClose: () => void;
}

const LegalModal = ({ type, onClose }: LegalModalProps) => {
  const isTerms = type === 'terms';

  // ESC 키 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    // body 스크롤 잠금
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="legal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div
        className="legal-modal glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="legal-modal-header">
          <div className="legal-modal-title-row">
            {isTerms
              ? <FileText size={22} color="var(--primary-color)" />
              : <Shield size={22} color="var(--accent-color)" />
            }
            <h2 id="legal-modal-title">
              {isTerms ? '이용약관' : '개인정보처리방침'}
            </h2>
          </div>
          <button
            className="legal-close-btn"
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* 본문 (스크롤) */}
        <div className="legal-modal-body">
          {isTerms ? TERMS_CONTENT : PRIVACY_CONTENT}
        </div>

        {/* 하단 확인 버튼 */}
        <div className="legal-modal-footer">
          <button className="btn" onClick={onClose}>확인했습니다</button>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────
   Footer Component
────────────────────────────────────────── */

const Footer = () => {
  const [modal, setModal] = useState<ModalType>(null);

  const openTerms = useCallback(() => setModal('terms'), []);
  const openPrivacy = useCallback(() => setModal('privacy'), []);
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <>
      <footer className="app-footer">
        <div className="app-footer-inner">
          {/* 링크 영역 */}
          <div className="footer-links">
            <button
              id="footer-terms-btn"
              className="footer-link-btn"
              onClick={openTerms}
            >
              <FileText size={13} />
              이용약관
            </button>
            <span className="footer-divider">|</span>
            <button
              id="footer-privacy-btn"
              className="footer-link-btn"
              onClick={openPrivacy}
            >
              <Shield size={13} />
              개인정보처리방침
            </button>
          </div>

          {/* 정보관리책임자 */}
          <div className="footer-manager">
            <User size={13} />
            <span>정보관리책임자: 이현실</span>
          </div>

          {/* 카피라이트 */}
          <div className="footer-copyright">
            © 2026 시수 마법사. All rights reserved.
          </div>
        </div>
      </footer>

      {/* 모달 */}
      {modal && <LegalModal type={modal} onClose={closeModal} />}
    </>
  );
};

export default Footer;
