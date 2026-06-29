import { useTimetable } from '../context/TimetableContext';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  useDroppable
} from '@dnd-kit/core';
import type { DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { 
  SortableContext, 
  useSortable, 
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const SortableItem = ({ id, grade }: { id: string, grade: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
    touchAction: 'none' // Prevent scrolling while dragging on touch devices
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="grade-item">
      <span>{grade}</span>
      <GripVertical className="grade-icon" size={20} />
    </div>
  );
};

const DroppableColumn = ({ id, name, items }: { id: string, name: string, items: string[] }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="group-column glass-panel">
      <h3>{name}</h3>
      <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
        {items.map(gradeId => (
          <SortableItem key={gradeId} id={gradeId} grade={`${gradeId.replace('G', '')}학년`} />
        ))}
      </SortableContext>
    </div>
  );
};

const GroupManager = () => {
  const { groups, setGroups } = useTimetable();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: string) => {
    if (groups.find(g => g.group_id === id)) return id;
    return groups.find(g => g.memberGradeIds.includes(id))?.group_id;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setGroups((prev) => {
      const activeGroupIndex = prev.findIndex(g => g.group_id === activeContainer);
      const overGroupIndex = prev.findIndex(g => g.group_id === overContainer);

      const activeItems = [...prev[activeGroupIndex].memberGradeIds];
      const overItems = [...prev[overGroupIndex].memberGradeIds];

      const activeIndex = activeItems.indexOf(activeId);
      const overIndex = overId === overContainer ? overItems.length : overItems.indexOf(overId);

      activeItems.splice(activeIndex, 1);
      overItems.splice(overIndex >= 0 ? overIndex : overItems.length, 0, activeId);

      const newGroups = [...prev];
      newGroups[activeGroupIndex] = { ...prev[activeGroupIndex], memberGradeIds: activeItems };
      newGroups[overGroupIndex] = { ...prev[overGroupIndex], memberGradeIds: overItems };

      return newGroups;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer !== overContainer) return;

    const activeIndex = groups.find(g => g.group_id === activeContainer)?.memberGradeIds.indexOf(activeId);
    const overIndex = groups.find(g => g.group_id === overContainer)?.memberGradeIds.indexOf(overId);

    if (activeIndex !== undefined && overIndex !== undefined && activeIndex !== overIndex) {
      setGroups((prev) => {
        const newGroups = [...prev];
        const groupIndex = prev.findIndex(g => g.group_id === activeContainer);
        newGroups[groupIndex] = {
          ...prev[groupIndex],
          memberGradeIds: arrayMove(prev[groupIndex].memberGradeIds, activeIndex, overIndex)
        };
        return newGroups;
      });
    }
  };

  return (
    <div className="fade-in">
      <h1 className="page-title">그룹 관리 🧑‍🤝‍🧑</h1>
      <p className="page-subtitle">원하는 학군 그룹을 끌어 앤 드롭으로 구성하세요.</p>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="group-container">
          {groups.map((group) => (
            <DroppableColumn key={group.group_id} id={group.group_id} name={group.name} items={group.memberGradeIds} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default GroupManager;
