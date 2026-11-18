import React from 'react';

interface TouchControlsProps {
  visible: boolean;
  onKeyChange: (key: string, pressed: boolean) => void;
  onAction: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ visible, onKeyChange, onAction }) => {
  if (!visible) return null;

  const bindTouch = (key: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onKeyChange(key, true);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onKeyChange(key, false);
    },
    onPointerLeave: () => onKeyChange(key, false),
    onPointerCancel: () => onKeyChange(key, false),
  });

  const btnCls =
    'w-12 h-12 rounded-lg bg-slate-900/75 border-2 border-white/75 text-white font-bold text-base flex items-center justify-center active:bg-white/40 active:text-black touch-none select-none';

  return (
    <div className="absolute inset-x-3 bottom-3 z-25 flex justify-between items-end pointer-events-none">
      <div className="grid grid-cols-3 grid-rows-3 gap-1 pointer-events-auto">
        <div />
        <button type="button" aria-label="Up" className={btnCls} {...bindTouch('ArrowUp')}>
          ▲
        </button>
        <div />
        <button type="button" aria-label="Left" className={btnCls} {...bindTouch('ArrowLeft')}>
          ◀
        </button>
        <div />
        <button type="button" aria-label="Right" className={btnCls} {...bindTouch('ArrowRight')}>
          ▶
        </button>
        <div />
        <button type="button" aria-label="Down" className={btnCls} {...bindTouch('ArrowDown')}>
          ▼
        </button>
        <div />
      </div>

      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          type="button"
          className="w-13 h-13 rounded-full bg-amber-500/55 border-2 border-white text-white font-bold text-xs flex items-center justify-center active:bg-amber-400 active:text-black touch-none"
          {...bindTouch('Shift')}
        >
          RUN
        </button>
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAction();
          }}
          className="w-15 h-15 rounded-full bg-rose-600/75 border-2 border-white text-white font-bold text-sm flex items-center justify-center active:bg-rose-400 touch-none"
        >
          OK
        </button>
      </div>
    </div>
  );
};
