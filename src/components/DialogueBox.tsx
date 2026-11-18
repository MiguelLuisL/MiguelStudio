import React, { useEffect, useRef, useState } from 'react';
import { DialogueLine, Gender } from '../types/game';
import { drawPortrait } from '../game/sprites';
import { soundEngine } from '../audio/soundEngine';

interface DialogueBoxProps {
  lines: DialogueLine[];
  playerGender: Gender;
  onClose: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ lines: initialLines, playerGender, onClose }) => {
  const [queue, setQueue] = useState<DialogueLine[]>(initialLines);
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(0);
  const portraitRef = useRef<HTMLCanvasElement | null>(null);

  const currentLine = queue[idx];
  const fullText = currentLine?.text ?? '';
  const isTyping = charIdx < fullText.length;

  useEffect(() => {
    setQueue(initialLines);
    setIdx(0);
    setCharIdx(0);
    setSelectedChoice(0);
  }, [initialLines]);

  useEffect(() => {
    if (!currentLine || !portraitRef.current) return;
    drawPortrait(portraitRef.current, currentLine.who, currentLine.mood || 'normal', playerGender);
  }, [currentLine, playerGender]);

  useEffect(() => {
    if (!currentLine || charIdx >= fullText.length) return;
    const timer = window.setTimeout(() => {
      if (charIdx % 2 === 0) {
        const pitch = currentLine.who === 'monster' ? 160 : currentLine.who === 'sofia' ? 520 : 380;
        soundEngine.blip(pitch);
      }
      setCharIdx((c) => c + 1);
    }, 20);
    return () => window.clearTimeout(timer);
  }, [charIdx, fullText, currentLine]);

  const pickChoice = (choiceIdx: number) => {
    if (!currentLine?.choices) return;
    const ch = currentLine.choices[choiceIdx];
    if (!ch) return;
    soundEngine.pickup();
    if (ch.action) ch.action();

    if (ch.next && ch.next.length > 0) {
      const updated = [...queue.slice(0, idx + 1), ...ch.next, ...queue.slice(idx + 1)];
      setQueue(updated);
      setIdx(idx + 1);
      setCharIdx(0);
      setSelectedChoice(0);
    } else if (idx + 1 < queue.length) {
      setIdx(idx + 1);
      setCharIdx(0);
      setSelectedChoice(0);
    } else {
      onClose();
    }
  };

  const advance = () => {
    if (!currentLine) {
      onClose();
      return;
    }
    if (isTyping) {
      setCharIdx(fullText.length);
      return;
    }
    if (currentLine.choices && currentLine.choices.length > 0) {
      pickChoice(selectedChoice);
      return;
    }
    if (idx + 1 >= queue.length) {
      onClose();
    } else {
      setIdx(idx + 1);
      setCharIdx(0);
      setSelectedChoice(0);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        advance();
      } else if (currentLine?.choices && !isTyping) {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          setSelectedChoice((prev) => (prev - 1 + currentLine.choices!.length) % currentLine.choices!.length);
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          setSelectedChoice((prev) => (prev + 1) % currentLine.choices!.length);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  });

  if (!currentLine) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (!currentLine.choices || isTyping) advance();
      }}
      className="font-dialogue absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5 z-30 bg-black border-4 border-white p-3 sm:p-4 flex gap-3 sm:gap-4 items-start shadow-2xl min-h-[124px] max-h-[46%]"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 border-white bg-[#100f18] flex items-center justify-center">
        <canvas
          ref={portraitRef}
          width={40}
          height={40}
          className="w-14 h-14 sm:w-[72px] sm:h-[72px]"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between h-full overflow-y-auto">
        <div>
          {currentLine.name && (
            <div className="text-amber-400 font-bold text-xs sm:text-sm mb-1">{currentLine.name}</div>
          )}
          <div className="text-white text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
            {fullText.slice(0, charIdx)}
          </div>
        </div>

        {!isTyping && currentLine.choices && currentLine.choices.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {currentLine.choices.map((ch, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  pickChoice(i);
                }}
                className={`px-3 py-1.5 text-xs sm:text-sm border-2 text-left transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedChoice === i
                    ? 'border-amber-400 text-amber-300 bg-[#1a1628]'
                    : 'border-white text-white bg-black hover:border-amber-300'
                }`}
              >
                {selectedChoice === i ? '♥ ' : '> '}
                {ch.label}
              </button>
            ))}
          </div>
        )}

        {(!currentLine.choices || isTyping) && (
          <div className="self-end text-amber-400 text-xs mt-1 animate-pulse">▼</div>
        )}
      </div>
    </div>
  );
};
