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
    alert('그룹 배치가 변경되었습니다.');
  };

  return (
    <div className="fade-in">
      <h1 className="page-title">학년 그룹 관리 🧑‍🤝‍🧑</h1>
      <p className="page-subtitle">원하는 학년 그룹을 드래그 앤 드롭으로 구성하세요.</p>

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
