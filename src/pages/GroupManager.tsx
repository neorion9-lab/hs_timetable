import { useTimetable } from '../context/TimetableContext';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const SortableItem = ({ id, grade }: { id: string, grade: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="grade-item">
      <span>{grade}</span>
      <GripVertical className="grade-icon" size={20} />
    </div>
  );
};

const GroupManager = () => {
  const { groups } = useTimetable();

  const handleDragEnd = (_event: DragEndEvent) => {
    // MVP 용으로 짱구식 피드백 알림!
    alert('오호라~ 드래그 앤 드롭 완료! 엉덩이 춤 한 번 추고 저장해줄게! 🍑🎶');
  };

  return (
    <div className="fade-in">
      <h1 className="page-title">학년 그룹 관리 🧑‍🤝‍🧑</h1>
      <p className="page-subtitle">어느 학년끼리 묶을까? 요리조리 끌어다 놔봐! 짱구가 지켜볼게!</p>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="group-container">
          {groups.map((group) => (
            <div key={group.group_id} className="group-column glass-panel">
              <h3>{group.name}</h3>
              <SortableContext items={group.memberGradeIds} strategy={verticalListSortingStrategy}>
                {group.memberGradeIds.map(gradeId => (
                  <SortableItem key={gradeId} id={gradeId} grade={`초등학교 ${gradeId.replace('G', '')}학년`} />
                ))}
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default GroupManager;
