'use client';
import { useState } from 'react';
import { DealCard, Deal } from './DealCard';
import { DealDrawer } from './DealDrawer';
import { DndContext, DragEndEvent, closestCorners, useDraggable, useDroppable, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

const STAGES = ['Lead', 'Negotiating', 'Contract Sent', 'Active', 'Delivered', 'Paid', 'Lost'];

const STAGE_COLORS: Record<string, string> = {
  'Lead':          'border-border',
  'Negotiating':   'border-blue-400/50',
  'Contract Sent': 'border-purple-400/50',
  'Active':        'border-warning-text/50',
  'Delivered':     'border-primary/50',
  'Paid':          'border-success-text/50',
  'Lost':          'border-danger-text/30',
};

const STAGE_HEADER_COLORS: Record<string, string> = {
  'Lead':          'text-foreground-muted',
  'Negotiating':   'text-blue-400',
  'Contract Sent': 'text-purple-400',
  'Active':        'text-warning-text',
  'Delivered':     'text-primary',
  'Paid':          'text-success-text',
  'Lost':          'text-danger-text',
};

function DroppableColumn({ stage, stageDeals, onUpdateDealStage, setSelectedDeal, onDeleteDeal }: any) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div className="flex flex-col min-w-[280px] md:min-w-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className={`font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${STAGE_HEADER_COLORS[stage] || 'text-foreground-muted'}`}>
          {stage}
          <span className="bg-foreground/5 text-foreground-muted px-2 py-0.5 rounded-full text-[10px] font-bold normal-case">{stageDeals.length}</span>
        </h3>
      </div>

      <div
        ref={setNodeRef}
        className={`rounded-2xl p-2.5 flex flex-col gap-2.5 border-2 transition-all flex-1 min-h-[160px] ${
          isOver
            ? 'bg-primary/5 border-primary/40 shadow-[inset_0_0_20px_rgba(var(--color-primary),0.05)]'
            : `bg-black/[0.02] dark:bg-black/20 ${STAGE_COLORS[stage] || 'border-black/5 dark:border-white/5'}`
        }`}
      >
        {stageDeals.map((deal: Deal) => (
          <DraggableCard key={deal.id} deal={deal} onUpdateDealStage={onUpdateDealStage} setSelectedDeal={setSelectedDeal} onDeleteDeal={onDeleteDeal} />
        ))}

        {stageDeals.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-6 text-center text-[10px] text-foreground-subtle font-bold uppercase tracking-widest border-2 border-dashed border-border rounded-xl opacity-60">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

function DraggableCard({ deal, onUpdateDealStage, setSelectedDeal, onDeleteDeal }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    data: { deal }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
    opacity: isDragging ? 0.85 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing outline-none ${isDragging ? 'rotate-1 shadow-2xl' : ''} transition-shadow`}
    >
      <DealCard
        deal={deal}
        onMoveStage={(newStage) => onUpdateDealStage(deal.id, newStage)}
        onClick={() => setSelectedDeal(deal)}
        onDeleteDeal={() => onDeleteDeal(deal.id)}
      />
    </div>
  );
}

interface KanbanBoardProps {
  deals: Deal[];
  onUpdateDealStage: (id: string, newStage: string) => void;
  onDeleteDeal: (id: string) => void;
}

export function KanbanBoard({ deals, onUpdateDealStage, onDeleteDeal }: KanbanBoardProps) {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const draggedDeal = active.data.current?.deal as Deal;
    if (draggedDeal && draggedDeal.stage !== over.id) {
      onUpdateDealStage(draggedDeal.id, over.id as string);
    }
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div
          className="flex md:grid md:grid-cols-7 gap-4 pb-4 items-start w-full overflow-x-auto md:overflow-x-visible snap-x"
        >
          {STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            return (
              <DroppableColumn
                key={stage}
                stage={stage}
                stageDeals={stageDeals}
                onUpdateDealStage={onUpdateDealStage}
                setSelectedDeal={setSelectedDeal}
                onDeleteDeal={onDeleteDeal}
              />
            );
          })}
        </div>
      </DndContext>

      <DealDrawer deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
    </>
  );
}
