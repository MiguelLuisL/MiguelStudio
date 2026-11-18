import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Trophy, ShieldAlert, Sun, Lock } from 'lucide-react';
import {
  ControlMode,
  DialogueLine,
  Difficulty,
  Gender,
  ItemId,
  Language,
  PlayerState,
  RoomId,
  SaveData,
  ScreenMode,
  StoryFlags,
} from './types/game';
import { I18N_DATA, LANGUAGE_LABELS, pickText } from './data/i18n';
import { ROOMS } from './data/rooms';
import {
  getAltarLines,
  getAwakeningLines,
  getExitGateLines,
  getLockedLibraryLines,
  getLoreLines,
  getNpcLines,
} from './data/story';
import { soundEngine } from './audio/soundEngine';
import { getDifficultyParams, saveSystem } from './storage/saveSystem';
import { drawCharacterSprite, drawMonsterSprite, drawObstacle } from './game/sprites';
import { DialogueBox } from './components/DialogueBox';
import { TouchControls } from './components/TouchControls';

const INITIAL_FLAGS: StoryFlags = {
  helpedLucas: false,
  trustedSofia: false,
  savedMariana: false,
  usedDistraction: false,
  betrayal: 0,
  ch2Shown: false,
  ch3Shown: false,
  restoredPower: false,
};

interface EngineState {
  active: boolean;
  paused: boolean;
  peaceful: boolean;
  room: RoomId;
  chapter: number;
  player: PlayerState;
  monster: { active: boolean; x: number; y: number; speed: number };
  ball: { x: number; y: number; vx: number; vy: number };
  keeper: { x: number; y: number; dir: number };
  goals: number;
  inventory: ItemId[];
  flags: StoryFlags;
  keys: Record<string, boolean>;
  mouseTarget: { x: number; y: number } | null;
  gpA: boolean;
  gpStart: boolean;
  nearObjectId: string | null;
}

function createInitialPlayer(gender: Gender, name: string, maxHp: number): PlayerState {
  return {
    x: 320,
    y: 240,
    gender,
    name,
    dir: 'down',
    frame: 0,
    stepTimer: 0,
    hp: maxHp,
    maxHp,
    stam: 100,
    invuln: 0,
    scared: false,
  };
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => saveSystem.getLang());
  const [difficulty, setDifficulty] = useState<Difficulty>(() => saveSystem.getDifficulty());
  const [controlMode, setControlMode] = useState<ControlMode>(() => saveSystem.getControlMode());
  const [muted, setMuted] = useState(false);

  const [screen, setScreen] = useState<ScreenMode>('MENU');
  const [optFromPause, setOptFromPause] = useState(false);
  const [slMode, setSlMode] = useState<'save' | 'load'>('load');

  const [selectedGender, setSelectedGender] = useState<Gender>('M');
  const [playerNameInput, setPlayerNameInput] = useState('Alex');

  const [hasContinue, setHasContinue] = useState(() => saveSystem.hasContinue());
  const [unlockedEndings, setUnlockedEndings] = useState<number[]>(() => saveSystem.getUnlockedEndings());
  const [peacefulUnlocked, setPeacefulUnlocked] = useState(() => saveSystem.isPeacefulUnlocked());

  const [chapterSplash, setChapterSplash] = useState<number>(1);
  const [endingResultId, setEndingResultId] = useState<number>(1);
  const [dialogueQueue, setDialogueQueue] = useState<DialogueLine[] | null>(null);

  const [hudState, setHudState] = useState({
    name: 'Alex',
    hp: 100,
    maxHp: 100,
    stam: 100,
    room: 'hallway' as RoomId,
    inventory: [] as ItemId[],
    scared: false,
    peaceful: false,
    goals: 0,
  });

  const [isTouchViewport, setIsTouchViewport] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewMRef = useRef<HTMLCanvasElement | null>(null);
  const previewFRef = useRef<HTMLCanvasElement | null>(null);
  const chapterCallbackRef = useRef<(() => void) | null>(null);
  const dialogueOpenRef = useRef(false);
  const screenRef = useRef<ScreenMode>('MENU');
  const langRef = useRef<Language>(lang);
  const difficultyRef = useRef<Difficulty>(difficulty);
  const controlRef = useRef<ControlMode>(controlMode);

  const engineRef = useRef<EngineState>({
    active: false,
    paused: false,
    peaceful: false,
    room: 'hallway',
    chapter: 1,
    player: createInitialPlayer('M', 'Alex', 100),
    monster: { active: false, x: 100, y: 100, speed: 1.65 },
    ball: { x: 320, y: 240, vx: 0, vy: 0 },
    keeper: { x: 515, y: 240, dir: 1 },
    goals: 0,
    inventory: [],
    flags: { ...INITIAL_FLAGS },
    keys: {},
    mouseTarget: null,
    gpA: false,
    gpStart: false,
    nearObjectId: null,
  });

  const t = I18N_DATA[lang];

  useEffect(() => {
    dialogueOpenRef.current = dialogueQueue !== null;
  }, [dialogueQueue]);

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  useEffect(() => {
    controlRef.current = controlMode;
  }, [controlMode]);

  useEffect(() => {
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 820;
      setIsTouchViewport(hasTouch);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (screen === 'CHAR_SELECT') {
      if (previewMRef.current) {
        const ctx = previewMRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 48, 48);
          drawCharacterSprite(ctx, 24, 32, 'M', 'down', 0, false);
        }
      }
      if (previewFRef.current) {
        const ctx = previewFRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 48, 48);
          drawCharacterSprite(ctx, 24, 32, 'F', 'down', 0, false);
        }
      }
    }
  }, [screen]);

  const syncHud = useCallback(() => {
    const eng = engineRef.current;
    setHudState({
      name: eng.player.name,
      hp: eng.player.hp,
      maxHp: eng.player.maxHp,
      stam: eng.player.stam,
      room: eng.room,
      inventory: [...eng.inventory],
      scared: eng.player.scared,
      peaceful: eng.peaceful,
      goals: eng.goals,
    });
  }, []);

  const refreshMetaStorage = useCallback(() => {
    setHasContinue(saveSystem.hasContinue());
    setUnlockedEndings(saveSystem.getUnlockedEndings());
    setPeacefulUnlocked(saveSystem.isPeacefulUnlocked());
  }, []);

  const spawnMonsterForRoom = useCallback((room: RoomId) => {
    const eng = engineRef.current;
    if (eng.peaceful) {
      eng.monster.active = false;
      return;
    }
    const dp = getDifficultyParams(difficultyRef.current);
    eng.monster.speed = dp.monsterSpeed;
    const chance =
      difficultyRef.current === 'nightmare' ? 0.96 : difficultyRef.current === 'hard' ? 0.8 : 0.65;
    if (room === 'basement' || Math.random() < chance) {
      eng.monster.active = true;
      eng.monster.x = eng.player.x > 320 ? 85 : 545;
      eng.monster.y = eng.player.y > 240 ? 85 : 400;
    } else {
      eng.monster.active = false;
    }
  }, []);

  const buildSaveData = useCallback((): SaveData => {
    const eng = engineRef.current;
    return {
      date: new Date().toLocaleString(),
      room: eng.room,
      chapter: eng.chapter,
      player: { ...eng.player },
      inventory: [...eng.inventory],
      flags: { ...eng.flags },
      difficulty: difficultyRef.current,
      peaceful: eng.peaceful,
    };
  }, []);

  const returnToMenu = useCallback(() => {
    const eng = engineRef.current;
    eng.active = false;
    eng.paused = false;
    eng.keys = {};
    eng.mouseTarget = null;
    setDialogueQueue(null);
    refreshMetaStorage();
    setScreen('MENU');
  }, [refreshMetaStorage]);

  const triggerEnding = useCallback(
    (id: number) => {
      const eng = engineRef.current;
      eng.active = false;
      eng.paused = true;
      eng.keys = {};
      setDialogueQueue(null);
      saveSystem.unlockEnding(id);
      refreshMetaStorage();
      setEndingResultId(id);
      setScreen('ENDING_RESULT');
    },
    [refreshMetaStorage]
  );

  const showChapterSplashScreen = useCallback((num: number, cb?: () => void) => {
    const eng = engineRef.current;
    eng.chapter = num;
    eng.paused = true;
    chapterCallbackRef.current = cb || null;
    setChapterSplash(num);
    setScreen('CHAPTER_SPLASH');
  }, []);

  const advanceChapter = useCallback(
    (num: number) => {
      const eng = engineRef.current;
      if (num === 2 && !eng.flags.ch2Shown) {
        eng.flags.ch2Shown = true;
        window.setTimeout(() => showChapterSplashScreen(2), 350);
      } else if (num === 3 && !eng.flags.ch3Shown) {
        eng.flags.ch3Shown = true;
        window.setTimeout(() => showChapterSplashScreen(3), 350);
      }
    },
    [showChapterSplashScreen]
  );

  const startNewGame = () => {
    soundEngine.unlock();
    const dp = getDifficultyParams(difficulty);
    const cleanName = playerNameInput.trim() || 'Alex';
    const eng = engineRef.current;
    eng.peaceful = false;
    eng.room = 'hallway';
    eng.chapter = 1;
    eng.inventory = [];
    eng.flags = { ...INITIAL_FLAGS };
    eng.player = createInitialPlayer(selectedGender, cleanName, dp.maxHp);
    eng.active = true;
    eng.paused = true;
    eng.keys = {};
    eng.mouseTarget = null;
    spawnMonsterForRoom('hallway');
    syncHud();

    showChapterSplashScreen(1, () => {
      saveSystem.saveSlot(1, buildSaveData());
      refreshMetaStorage();
      setDialogueQueue(getAwakeningLines(langRef.current, cleanName));
    });
  };

  const startPeacefulMode = () => {
    if (!peacefulUnlocked) return;
    soundEngine.unlock();
    const cleanName = playerNameInput.trim() || 'Alex';
    const eng = engineRef.current;
    eng.peaceful = true;
    eng.room = 'courtyard';
    eng.chapter = 4;
    eng.inventory = [];
    eng.flags = { ...INITIAL_FLAGS };
    eng.player = createInitialPlayer(selectedGender, cleanName, 100);
    eng.player.x = 155;
    eng.player.y = 240;
    eng.ball = { x: 320, y: 240, vx: 0, vy: 0 };
    eng.keeper = { x: 515, y: 240, dir: 1 };
    eng.goals = 0;
    eng.monster.active = false;
    eng.active = true;
    eng.paused = true;
    eng.keys = {};
    eng.mouseTarget = null;
    syncHud();
    showChapterSplashScreen(4);
  };

  const applyLoadedSave = (data: SaveData) => {
    soundEngine.unlock();
    setDifficulty(data.difficulty || 'medium');
    saveSystem.setDifficulty(data.difficulty || 'medium');
    const eng = engineRef.current;
    eng.peaceful = !!data.peaceful;
    eng.room = data.room;
    eng.chapter = data.chapter || 1;
    eng.player = { ...data.player, invuln: 0, scared: false };
    eng.inventory = [...(data.inventory || [])];
    eng.flags = { ...INITIAL_FLAGS, ...data.flags };
    eng.active = true;
    eng.paused = false;
    eng.keys = {};
    eng.mouseTarget = null;
    spawnMonsterForRoom(eng.room);
    syncHud();
    setDialogueQueue(null);
    setScreen('PLAYING');
  };

  const interactAt = useCallback(
    (clickX: number | null = null, clickY: number | null = null) => {
      const eng = engineRef.current;
      if (!eng.active || eng.paused || dialogueOpenRef.current) return;

      const rm = ROOMS[eng.room];
      const objects = [...rm.objects];
      if (eng.peaceful && eng.room === 'courtyard') {
        objects.push({ id: 'npc_lucas_courtyard', x: 185, y: 92, type: 'npc', who: 'lucas' });
      }

      for (const obj of objects) {
        if (obj.type === 'item' && (eng.peaceful || (obj.item && eng.inventory.includes(obj.item)))) continue;
        if ((obj.type === 'altar' || obj.type === 'lore') && eng.peaceful) continue;

        const distPlayer = Math.hypot(eng.player.x - obj.x, eng.player.y - obj.y);
        const distClick = clickX !== null && clickY !== null ? Math.hypot(clickX - obj.x, clickY - obj.y) : 999;

        if (distPlayer < 50 || (distClick < 34 && distPlayer < 105)) {
          eng.mouseTarget = null;

          if (obj.type === 'save') {
            saveSystem.saveSlot(1, buildSaveData());
            soundEngine.save();
            refreshMetaStorage();
            setDialogueQueue([
              {
                who: 'narrator',
                name: 'SAVE',
                text: pickText(langRef.current, {
                  pt: '* A estrela dourada enche-te de determinação.\n* O teu progresso foi guardado no Espaço 1!',
                  ptBR: '* A estrela dourada enche você de determinação.\n* Seu progresso foi salvo no Slot 1!',
                  en: '* The golden star fills you with determination.\n* Your progress has been saved in Slot 1!',
                  es: '* La estrella dorada llena tu corazón.\n* ¡Progreso guardado en el Espacio 1!',
                  fr: '* L’étoile dorée te remplit de détermination.\n* Progression sauvegardée (Slot 1) !',
                  it: '* La stella dorata ti riempie di determinazione.\n* Progresso salvato nello Slot 1!',
                  zh: '* 金色的星星让你充满决心。\n* 进度已保存至存档位 1！',
                }),
              },
            ]);
            return;
          }

          if (obj.type === 'item' && obj.item) {
            if (!eng.inventory.includes(obj.item)) {
              eng.inventory.push(obj.item);
              soundEngine.pickup();
              syncHud();
              const itemName = I18N_DATA[langRef.current].items[obj.item];
              let extra = '';
              if (obj.item === 'exitKey') {
                advanceChapter(3);
                extra = pickText(langRef.current, {
                  pt: '\nCorre para o portão de SAÍDA a norte do Corredor Principal!',
                  ptBR: '\nCorra para o portão de SAÍDA ao norte do Corredor Principal!',
                  en: '\nRush to the EXIT gate north of the Main Hallway!',
                  es: '\n¡Corre hacia la SALIDA al norte del Pasillo Principal!',
                  fr: '\nCours vers la SORTIE au nord du Couloir Principal !',
                  it: '\nCorri verso l’USCITA a nord del Corridoio!',
                  zh: '\n快跑向主走廊北侧的出口大门！',
                });
              }
              setDialogueQueue([{ who: 'narrator', name: 'ITEM', text: `* ${itemName}!${extra}` }]);
            }
            return;
          }

          if (obj.type === 'lore') {
            setDialogueQueue(getLoreLines(langRef.current));
            return;
          }

          const storyCtx = {
            lang: langRef.current,
            playerName: eng.player.name,
            peaceful: eng.peaceful,
            inventory: eng.inventory,
            flags: eng.flags,
            goals: eng.goals,
            onUpdateFlags: (updater: (prev: StoryFlags) => StoryFlags) => {
              eng.flags = updater(eng.flags);
            },
            onAdvanceChapter: advanceChapter,
            onTriggerEnding: triggerEnding,
            onReturnToMenu: returnToMenu,
          };

          if (obj.type === 'altar') {
            setDialogueQueue(getAltarLines(storyCtx));
            return;
          }

          if (obj.type === 'npc' && obj.who) {
            setDialogueQueue(getNpcLines(obj.who, storyCtx));
            return;
          }
        }
      }
    },
    [advanceChapter, buildSaveData, refreshMetaStorage, returnToMenu, syncHud, triggerEnding]
  );

  // Keyboard listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      soundEngine.unlock();
      const eng = engineRef.current;
      eng.keys[e.key] = true;

      if (e.key === 'Escape' && eng.active && !dialogueOpenRef.current) {
        if (screenRef.current === 'PLAYING') {
          eng.paused = true;
          setScreen('PAUSED');
        } else if (screenRef.current === 'PAUSED') {
          eng.paused = false;
          setScreen('PLAYING');
        }
      }

      if (eng.active && !eng.paused && !dialogueOpenRef.current && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        interactAt();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      engineRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [interactAt]);

  // Main 60fps Canvas loop (Menu backdrop + Active gameplay)
  useEffect(() => {
    let rafId = 0;
    let lastHudSync = 0;

    const collides = (room: RoomId, nx: number, ny: number) => {
      if (nx < 34 || nx > 606 || ny < 42 || ny > 448) return true;
      for (const o of ROOMS[room].obstacles) {
        if (nx + 10 > o.x && nx - 10 < o.x + o.w && ny + 10 > o.y && ny - 10 < o.y + o.h) return true;
      }
      return false;
    };

    const tick = (now: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const eng = engineRef.current;

      if (ctx) {
        if (!eng.active) {
          // Animated atmospheric school corridor backdrop for menus
          ctx.fillStyle = '#07060c';
          ctx.fillRect(0, 0, 640, 480);

          const flicker = Math.sin(now * 0.004) > 0.88 ? 0.14 : 0.05;
          ctx.fillStyle = `rgba(225, 29, 72, ${flicker})`;
          ctx.fillRect(220, 60, 200, 320);

          ctx.strokeStyle = 'rgba(255,255,255,0.06)';
          ctx.lineWidth = 2;
          ctx.strokeRect(220, 60, 200, 320);
          ctx.beginPath();
          ctx.moveTo(0, 480);
          ctx.lineTo(220, 380);
          ctx.moveTo(640, 480);
          ctx.lineTo(420, 380);
          ctx.stroke();

          // Subtle blinking eyes in the dark doorway
          if (Math.sin(now * 0.002) > -0.3) {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(306, 190, 6, 6);
            ctx.fillRect(328, 190, 6, 6);
          }
        } else {
          // Update gameplay if not paused and no dialogue open
          if (!eng.paused && !dialogueOpenRef.current) {
            // Poll Gamepad
            let gpDx = 0;
            let gpDy = 0;
            let gpSprint = false;
            if (controlRef.current !== 'keyboard' && controlRef.current !== 'touch') {
              const pads = navigator.getGamepads ? navigator.getGamepads() : [];
              const gp = pads?.[0];
              if (gp) {
                if (Math.abs(gp.axes[0]) > 0.25) gpDx = gp.axes[0];
                if (Math.abs(gp.axes[1]) > 0.25) gpDy = gp.axes[1];
                if (gp.buttons[14]?.pressed) gpDx = -1;
                if (gp.buttons[15]?.pressed) gpDx = 1;
                if (gp.buttons[12]?.pressed) gpDy = -1;
                if (gp.buttons[13]?.pressed) gpDy = 1;
                gpSprint = !!gp.buttons[1]?.pressed;

                if (gp.buttons[0]?.pressed && !eng.gpA) {
                  eng.gpA = true;
                  interactAt();
                } else if (!gp.buttons[0]?.pressed) {
                  eng.gpA = false;
                }

                if (gp.buttons[9]?.pressed && !eng.gpStart) {
                  eng.gpStart = true;
                  eng.paused = true;
                  setScreen('PAUSED');
                } else if (!gp.buttons[9]?.pressed) {
                  eng.gpStart = false;
                }
              }
            }

            let dx = gpDx;
            let dy = gpDy;
            if (eng.keys['ArrowLeft'] || eng.keys['a'] || eng.keys['A']) dx -= 1;
            if (eng.keys['ArrowRight'] || eng.keys['d'] || eng.keys['D']) dx += 1;
            if (eng.keys['ArrowUp'] || eng.keys['w'] || eng.keys['W']) dy -= 1;
            if (eng.keys['ArrowDown'] || eng.keys['s'] || eng.keys['S']) dy += 1;

            if (dx !== 0 || dy !== 0) {
              eng.mouseTarget = null;
            } else if (eng.mouseTarget && controlRef.current !== 'touch') {
              const mdx = eng.mouseTarget.x - eng.player.x;
              const mdy = eng.mouseTarget.y - eng.player.y;
              const d = Math.hypot(mdx, mdy);
              if (d > 6) {
                dx = mdx / d;
                dy = mdy / d;
              } else {
                eng.mouseTarget = null;
              }
            }

            const sprinting = (eng.keys['Shift'] || gpSprint) && eng.player.stam > 2;
            const spd = sprinting ? 3.85 : 2.35;
            if (sprinting && (dx !== 0 || dy !== 0)) {
              eng.player.stam = Math.max(0, eng.player.stam - 0.65);
            } else {
              eng.player.stam = Math.min(100, eng.player.stam + 0.35);
            }

            const len = Math.hypot(dx, dy);
            if (len > 0.05) {
              dx /= Math.max(1, len);
              dy /= Math.max(1, len);
              if (Math.abs(dx) > Math.abs(dy)) eng.player.dir = dx < 0 ? 'left' : 'right';
              else eng.player.dir = dy < 0 ? 'up' : 'down';

              const nx = eng.player.x + dx * spd;
              const ny = eng.player.y + dy * spd;
              if (!collides(eng.room, nx, eng.player.y)) eng.player.x = nx;
              if (!collides(eng.room, eng.player.x, ny)) eng.player.y = ny;

              eng.player.stepTimer++;
              if (eng.player.stepTimer % 10 === 0) eng.player.frame++;
            } else {
              eng.player.frame = 0;
            }

            // Door transitions
            const rm = ROOMS[eng.room];
            for (const door of rm.doors) {
              if (
                eng.player.x > door.x - 10 &&
                eng.player.x < door.x + door.w + 10 &&
                eng.player.y > door.y - 10 &&
                eng.player.y < door.y + door.h + 10
              ) {
                if (door.to === 'exit_gate') {
                  eng.player.y = door.y + door.h + 18;
                  eng.mouseTarget = null;
                  setDialogueQueue(
                    getExitGateLines({
                      lang: langRef.current,
                      playerName: eng.player.name,
                      peaceful: eng.peaceful,
                      inventory: eng.inventory,
                      flags: eng.flags,
                      goals: eng.goals,
                      onUpdateFlags: (u) => {
                        eng.flags = u(eng.flags);
                      },
                      onAdvanceChapter: advanceChapter,
                      onTriggerEnding: triggerEnding,
                      onReturnToMenu: returnToMenu,
                    })
                  );
                  break;
                }

                if (door.to === 'library' && !eng.peaceful && !eng.inventory.includes('libKey')) {
                  eng.player.x = 568;
                  eng.mouseTarget = null;
                  soundEngine.locked();
                  setDialogueQueue(getLockedLibraryLines(langRef.current));
                  break;
                }

                eng.room = door.to;
                eng.player.x = door.tx ?? 320;
                eng.player.y = door.ty ?? 240;
                eng.mouseTarget = null;
                spawnMonsterForRoom(eng.room);
                syncHud();
                break;
              }
            }

            // Peaceful soccer minigame in Courtyard
            if (eng.peaceful && eng.room === 'courtyard') {
              eng.keeper.y += eng.keeper.dir * 1.45;
              if (eng.keeper.y > 292 || eng.keeper.y < 188) eng.keeper.dir *= -1;

              const distBall = Math.hypot(eng.player.x - eng.ball.x, eng.player.y - eng.ball.y);
              if (distBall < 22) {
                const ang = Math.atan2(eng.ball.y - eng.player.y, eng.ball.x - eng.player.x);
                eng.ball.vx = Math.cos(ang) * 7.2;
                eng.ball.vy = Math.sin(ang) * 7.2;
                soundEngine.kick();
              }

              const distKeeper = Math.hypot(eng.keeper.x - eng.ball.x, eng.keeper.y - eng.ball.y);
              if (distKeeper < 22 && eng.ball.vx > 0) {
                eng.ball.vx = -Math.abs(eng.ball.vx) * 0.85;
                soundEngine.kick();
              }

              eng.ball.x += eng.ball.vx;
              eng.ball.y += eng.ball.vy;
              eng.ball.vx *= 0.94;
              eng.ball.vy *= 0.94;

              if (eng.ball.x < 45 || eng.ball.x > 595) eng.ball.vx *= -0.8;
              if (eng.ball.y < 48 || eng.ball.y > 435) eng.ball.vy *= -0.8;

              if (eng.ball.x > 522 && eng.ball.y > 175 && eng.ball.y < 305) {
                eng.goals++;
                soundEngine.goal();
                eng.ball = { x: 320, y: 240, vx: 0, vy: 0 };
                syncHud();
              }
            }

            // Monster AI + Proximity Fear
            if (eng.player.invuln > 0) eng.player.invuln--;
            if (eng.monster.active && !eng.peaceful) {
              const mdx = eng.player.x - eng.monster.x;
              const mdy = eng.player.y - eng.monster.y;
              const dist = Math.hypot(mdx, mdy);
              const dp = getDifficultyParams(difficultyRef.current);

              if (dist < dp.aggro || difficultyRef.current === 'nightmare') {
                eng.monster.x += (mdx / Math.max(1, dist)) * eng.monster.speed;
                eng.monster.y += (mdy / Math.max(1, dist)) * eng.monster.speed;
              } else {
                eng.monster.x += Math.cos(now * 0.001) * 0.85;
                eng.monster.y += Math.sin(now * 0.0013) * 0.85;
              }

              if (dist < 215) {
                const intensity = Math.max(0, Math.min(1, (215 - dist) / 185));
                soundEngine.fearPulse(intensity);
                eng.player.scared = true;
              } else {
                eng.player.scared = false;
              }

              if (dist < 22 && eng.player.invuln === 0) {
                soundEngine.hurt();
                eng.player.hp = Math.max(0, eng.player.hp - dp.damage);
                eng.player.invuln = 65;
                syncHud();
                if (eng.player.hp <= 0) {
                  triggerEnding(5);
                }
              }
            } else {
              eng.player.scared = false;
            }

            // Near object prompt check
            let foundNear: string | null = null;
            const objs = [...rm.objects];
            if (eng.peaceful && eng.room === 'courtyard') {
              objs.push({ id: 'npc_lucas_courtyard', x: 185, y: 92, type: 'npc', who: 'lucas' });
            }
            for (const o of objs) {
              if (o.type === 'item' && (eng.peaceful || (o.item && eng.inventory.includes(o.item)))) continue;
              if ((o.type === 'altar' || o.type === 'lore') && eng.peaceful) continue;
              if (Math.hypot(eng.player.x - o.x, eng.player.y - o.y) < 50) {
                foundNear = o.id;
                break;
              }
            }
            eng.nearObjectId = foundNear;

            if (now - lastHudSync > 120) {
              lastHudSync = now;
              syncHud();
            }
          }

          // Render Active Room
          const rm = ROOMS[eng.room];
          ctx.save();
          if (eng.player.scared && !eng.peaceful && !eng.paused) {
            ctx.translate((Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 3.5);
          }

          ctx.fillStyle = eng.peaceful ? rm.peacefulFloor : rm.floor;
          ctx.fillRect(0, 0, 640, 480);

          // Floor grid
          ctx.strokeStyle = eng.peaceful ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.04)';
          ctx.lineWidth = 1;
          for (let x = 24; x < 616; x += 32) {
            ctx.beginPath();
            ctx.moveTo(x, 24);
            ctx.lineTo(x, 456);
            ctx.stroke();
          }
          for (let y = 24; y < 456; y += 32) {
            ctx.beginPath();
            ctx.moveTo(24, y);
            ctx.lineTo(616, y);
            ctx.stroke();
          }

          // Walls
          ctx.fillStyle = eng.peaceful ? rm.peacefulWall : rm.wall;
          ctx.fillRect(0, 0, 640, 26);
          ctx.fillRect(0, 454, 640, 26);
          ctx.fillRect(0, 0, 24, 480);
          ctx.fillRect(616, 0, 24, 480);

          // Courtyard soccer pitch markings
          if (eng.room === 'courtyard') {
            ctx.strokeStyle = 'rgba(255,255,255,0.28)';
            ctx.lineWidth = 2;
            ctx.strokeRect(52, 52, 518, 376);
            ctx.beginPath();
            ctx.arc(320, 240, 46, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(320, 52);
            ctx.lineTo(320, 428);
            ctx.stroke();
          }

          // Basement ritual circle
          if (eng.room === 'basement' && !eng.peaceful) {
            ctx.strokeStyle = 'rgba(225, 29, 72, 0.32)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(320, 235, 68, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Doors
          for (const d of rm.doors) {
            ctx.fillStyle = d.to === 'exit_gate' ? '#facc15' : '#94a3b8';
            ctx.fillRect(d.x, d.y, d.w, d.h);
            ctx.fillStyle = '#09090b';
            ctx.font = 'bold 10px monospace';
            if (d.label) {
              ctx.fillText(d.label, d.x + 16, d.y + 16);
            }
          }

          // Obstacles
          for (const o of rm.obstacles) {
            drawObstacle(ctx, o, eng.peaceful);
          }

          // Objects & NPCs
          const drawObjects = [...rm.objects];
          if (eng.peaceful && eng.room === 'courtyard') {
            drawObjects.push({ id: 'npc_lucas_courtyard', x: 185, y: 92, type: 'npc', who: 'lucas' });
          }

          for (const obj of drawObjects) {
            if (obj.type === 'item' && (eng.peaceful || (obj.item && eng.inventory.includes(obj.item)))) continue;
            if ((obj.type === 'altar' || obj.type === 'lore') && eng.peaceful) continue;

            if (obj.type === 'save') {
              ctx.fillStyle = '#facc15';
              const s = 9 + Math.sin(now * 0.008) * 2;
              ctx.beginPath();
              ctx.moveTo(obj.x, obj.y - s);
              ctx.lineTo(obj.x + s, obj.y);
              ctx.lineTo(obj.x, obj.y + s);
              ctx.lineTo(obj.x - s, obj.y);
              ctx.closePath();
              ctx.fill();
            } else if (obj.type === 'item') {
              const bob = Math.sin(now * 0.006) * 2.5;
              ctx.fillStyle = obj.color || '#38bdf8';
              ctx.fillRect(obj.x - 7, obj.y - 7 + bob, 14, 14);
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.5;
              ctx.strokeRect(obj.x - 7, obj.y - 7 + bob, 14, 14);
            } else if (obj.type === 'lore') {
              ctx.fillStyle = '#cbd5e1';
              ctx.fillRect(obj.x - 10, obj.y - 8, 20, 14);
              ctx.fillStyle = '#0f172a';
              ctx.fillRect(obj.x - 7, obj.y - 5, 14, 2);
              ctx.fillRect(obj.x - 7, obj.y - 1, 10, 2);
            } else if (obj.type === 'altar') {
              ctx.fillStyle = '#4c0519';
              ctx.fillRect(obj.x - 16, obj.y - 16, 32, 32);
              ctx.strokeStyle = '#fb7185';
              ctx.lineWidth = 2;
              ctx.strokeRect(obj.x - 16, obj.y - 16, 32, 32);
            } else if (obj.type === 'npc' && obj.who) {
              drawCharacterSprite(ctx, obj.x, obj.y, 'M', 'down', 0, !eng.peaceful, obj.who);
            }

            // Interaction prompt badge above nearby object
            if (eng.nearObjectId === obj.id) {
              ctx.fillStyle = '#facc15';
              ctx.font = 'bold 11px monospace';
              ctx.textAlign = 'center';
              ctx.fillText('[!]', obj.x, obj.y - 26);
              ctx.textAlign = 'left';
            }
          }

          // Peaceful soccer ball & moving goalkeeper
          if (eng.peaceful && eng.room === 'courtyard') {
            drawCharacterSprite(ctx, eng.keeper.x, eng.keeper.y, 'M', 'left', Math.floor(now / 150), false, 'mariana');
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(eng.ball.x, eng.ball.y, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Player
          if (eng.player.invuln % 6 < 4) {
            drawCharacterSprite(
              ctx,
              eng.player.x,
              eng.player.y,
              eng.player.gender,
              eng.player.dir,
              eng.player.frame,
              eng.player.scared
            );
          }

          // Monster
          if (eng.monster.active && !eng.peaceful) {
            drawMonsterSprite(ctx, eng.monster.x, eng.monster.y, now);
          }

          // Flashlight Darkness Fog-of-War in Horror mode
          if (!eng.peaceful) {
            const dp = getDifficultyParams(difficultyRef.current);
            const visionBonus = (eng.inventory.includes('flashlight') ? 75 : 0) + (eng.flags.restoredPower ? 35 : 0);
            const radius = dp.vision + visionBonus;
            const grad = ctx.createRadialGradient(eng.player.x, eng.player.y, 26, eng.player.x, eng.player.y, radius);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.68, 'rgba(5,4,10,0.68)');
            grad.addColorStop(1, 'rgba(2,2,6,0.97)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 640, 480);
          }

          // Scared Warning Banner
          if (eng.player.scared && !eng.peaceful) {
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`! ${I18N_DATA[langRef.current].fearAlert} !`, 320, 48);
            ctx.textAlign = 'left';
          }

          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [advanceChapter, interactAt, returnToMenu, spawnMonsterForRoom, syncHud, triggerEnding]);

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    soundEngine.unlock();
    const eng = engineRef.current;
    if (!eng.active || eng.paused || dialogueQueue) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (640 / rect.width);
    const sy = (e.clientY - rect.top) * (480 / rect.height);
    eng.mouseTarget = { x: sx, y: sy };
    interactAt(sx, sy);
  };

  const showTouch =
    screen === 'PLAYING' &&
    !dialogueQueue &&
    (controlMode === 'touch' || (controlMode === 'auto' && isTouchViewport));

  const currentChapterInfo = t.chapters[chapterSplash - 1] || t.chapters[0];
  const currentEndingInfo = t.endings[endingResultId - 1] || t.endings[0];

  return (
    <div className="w-screen h-[100dvh] bg-[#06050a] flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-[1024px] max-h-[768px] md:aspect-[4/3] bg-black md:border-2 md:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          onPointerDown={handleCanvasPointerDown}
          className="w-full h-full block object-contain bg-black"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Horror Proximity Vignette */}
        <div
          className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-150 ${
            screen === 'PLAYING' && hudState.scared && !hudState.peaceful
              ? 'fear-vignette-active opacity-100'
              : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle, transparent 36%, rgba(185, 28, 28, 0.58) 100%)',
          }}
        />

        {/* In-Game HUD */}
        {screen === 'PLAYING' && (
          <>
            <div className="absolute top-2.5 inset-x-2.5 z-20 flex flex-wrap justify-between items-start gap-2 pointer-events-none">
              <div className="bg-black/85 border-2 border-white px-3 py-1.5 flex items-center gap-3 pointer-events-auto text-xs sm:text-sm font-dialogue">
                <span className="font-bold text-white truncate max-w-[96px]">{hudState.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-rose-500">♥</span>
                  <div className="w-16 sm:w-20 h-2.5 bg-slate-800 border border-white">
                    <div
                      className="h-full bg-rose-500 transition-all duration-150"
                      style={{ width: `${Math.max(0, (hudState.hp / hudState.maxHp) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400">⚡</span>
                  <div className="w-10 sm:w-12 h-2.5 bg-slate-800 border border-white">
                    <div
                      className="h-full bg-amber-400 transition-all duration-75"
                      style={{ width: `${hudState.stam}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-black/85 border-2 border-white px-3 py-1.5 flex items-center gap-3 pointer-events-auto text-xs sm:text-sm font-dialogue">
                <span className="text-slate-200 whitespace-nowrap">
                  {t.rooms[hudState.room]}
                  {hudState.peaceful && hudState.room === 'courtyard' ? ` · ${t.goalsLabel}: ${hudState.goals}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    engineRef.current.paused = true;
                    setScreen('PAUSED');
                  }}
                  className="bg-slate-900 hover:bg-white hover:text-black text-white border border-white px-2.5 py-0.5 font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  MENU
                </button>
              </div>
            </div>

            {!hudState.peaceful && (
              <div className="absolute top-14 left-2.5 z-20 bg-black/80 border border-slate-400 px-2.5 py-1 text-[11px] font-dialogue text-slate-200 max-w-[260px] pointer-events-none">
                <span className="text-amber-300 font-bold">{t.invTitle}: </span>
                {hudState.inventory.length > 0
                  ? hudState.inventory.map((id) => t.items[id]).join(', ')
                  : t.emptyBag}
              </div>
            )}
          </>
        )}

        {/* Touch Virtual Controls */}
        <TouchControls
          visible={showTouch}
          onKeyChange={(k, pressed) => {
            soundEngine.unlock();
            engineRef.current.keys[k] = pressed;
          }}
          onAction={() => {
            soundEngine.unlock();
            interactAt();
          }}
        />

        {/* Undertale Dialogue Box */}
        {screen === 'PLAYING' && dialogueQueue && (
          <DialogueBox
            lines={dialogueQueue}
            playerGender={engineRef.current.player.gender}
            onClose={() => {
              setDialogueQueue(null);
              syncHud();
            }}
          />
        )}

        {/* MAIN MENU */}
        {screen === 'MENU' && (
          <div className="absolute inset-0 z-40 bg-[#06050a]/85 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-wider mb-2 text-balance drop-shadow-[0_3px_0_#9f1239]">
              {t.gameTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mb-7 tracking-wide">{t.gameSub}</p>

            <div className="w-full max-w-xs flex flex-col gap-2.5">
              {hasContinue && (
                <button
                  type="button"
                  onClick={() => {
                    const last = saveSystem.loadLast();
                    if (last) applyLoadedSave(last);
                  }}
                  className="w-full min-h-[44px] py-2.5 px-5 bg-amber-500/15 border-2 border-amber-400 text-amber-300 font-bold hover:bg-amber-400 hover:text-black transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t.continueBtn}
                </button>
              )}

              <button
                type="button"
                onClick={() => setScreen('CHAR_SELECT')}
                className="w-full min-h-[44px] py-2.5 px-5 bg-black/90 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {t.startBtn}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSlMode('load');
                  setScreen('SAVE_LOAD');
                }}
                className="w-full min-h-[44px] py-2.5 px-5 bg-black/90 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {t.loadBtn}
              </button>

              <button
                type="button"
                disabled={!peacefulUnlocked}
                onClick={startPeacefulMode}
                className={`w-full min-h-[44px] py-2.5 px-5 border-2 font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                  peacefulUnlocked
                    ? 'bg-sky-950/70 border-sky-400 text-sky-200 hover:bg-sky-400 hover:text-black cursor-pointer'
                    : 'bg-black/60 border-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {peacefulUnlocked ? <Sun className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{peacefulUnlocked ? t.peacefulUnlocked : t.peacefulLocked}</span>
              </button>

              <button
                type="button"
                onClick={() => setScreen('ENDINGS')}
                className="w-full min-h-[44px] py-2.5 px-5 bg-black/90 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{t.endingsBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOptFromPause(false);
                  setScreen('OPTIONS');
                }}
                className="w-full min-h-[44px] py-2.5 px-5 bg-black/90 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {t.optionsBtn}
              </button>

              <button
                type="button"
                onClick={() => setScreen('EXIT')}
                className="w-full min-h-[44px] py-2.5 px-5 bg-black/90 border-2 border-rose-500 text-rose-300 font-bold hover:bg-rose-600 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {t.exitBtn}
              </button>
            </div>
          </div>
        )}

        {/* CHARACTER SELECT */}
        {screen === 'CHAR_SELECT' && (
          <div className="absolute inset-0 z-40 bg-[#06050a]/95 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-md bg-[#0b0a12] border-2 border-white p-6 flex flex-col gap-5">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-amber-400 text-center">
                {t.charTitle}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedGender('M')}
                  className={`p-4 border-2 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                    selectedGender === 'M' ? 'border-amber-400 bg-[#1a162b]' : 'border-slate-700 bg-black/60 hover:border-slate-400'
                  }`}
                >
                  <canvas ref={previewMRef} width={48} height={48} className="w-16 h-16" style={{ imageRendering: 'pixelated' }} />
                  <span className="font-bold text-sm text-white">{t.male}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGender('F')}
                  className={`p-4 border-2 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                    selectedGender === 'F' ? 'border-amber-400 bg-[#1a162b]' : 'border-slate-700 bg-black/60 hover:border-slate-400'
                  }`}
                >
                  <canvas ref={previewFRef} width={48} height={48} className="w-16 h-16" style={{ imageRendering: 'pixelated' }} />
                  <span className="font-bold text-sm text-white">{t.female}</span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="player-name-input" className="text-sm text-slate-300 font-medium">
                  {t.nameLabel}
                </label>
                <input
                  id="player-name-input"
                  type="text"
                  maxLength={14}
                  value={playerNameInput}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border-2 border-white text-white font-dialogue focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setScreen('MENU')}
                  className="min-h-[44px] px-5 py-2 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  onClick={startNewGame}
                  className="min-h-[44px] px-5 py-2 border-2 border-amber-400 text-amber-300 font-bold hover:bg-amber-400 hover:text-black transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t.beginStory}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OPTIONS */}
        {screen === 'OPTIONS' && (
          <div className="absolute inset-0 z-40 bg-[#06050a]/95 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-lg bg-[#0b0a12] border-2 border-white p-6 flex flex-col gap-4">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-amber-400">{t.optTitle}</h2>

              <div className="flex items-center justify-between gap-4">
                <label htmlFor="opt-lang" className="text-sm font-medium text-slate-200">{t.langLabel}</label>
                <select
                  id="opt-lang"
                  value={lang}
                  onChange={(e) => {
                    const next = e.target.value as Language;
                    setLang(next);
                    saveSystem.setLang(next);
                  }}
                  className="bg-slate-950 border-2 border-white text-white px-3 py-2 text-sm min-w-[180px]"
                >
                  {(Object.keys(LANGUAGE_LABELS) as Language[]).map((code) => (
                    <option key={code} value={code}>
                      {LANGUAGE_LABELS[code]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="opt-diff" className="text-sm font-medium text-slate-200">{t.diffLabel}</label>
                  <select
                    id="opt-diff"
                    value={difficulty}
                    onChange={(e) => {
                      const next = e.target.value as Difficulty;
                      setDifficulty(next);
                      saveSystem.setDifficulty(next);
                    }}
                    className="bg-slate-950 border-2 border-white text-white px-3 py-2 text-sm min-w-[180px]"
                  >
                    {(['easy', 'medium', 'hard', 'nightmare'] as Difficulty[]).map((d) => (
                      <option key={d} value={d}>
                        {t.diffs[d]}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  {difficulty === 'nightmare' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                  <span>{t.diffDesc[difficulty]}</span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label htmlFor="opt-ctrl" className="text-sm font-medium text-slate-200">{t.ctrlLabel}</label>
                <select
                  id="opt-ctrl"
                  value={controlMode}
                  onChange={(e) => {
                    const next = e.target.value as ControlMode;
                    setControlMode(next);
                    saveSystem.setControlMode(next);
                  }}
                  className="bg-slate-950 border-2 border-white text-white px-3 py-2 text-sm min-w-[180px]"
                >
                  {(['auto', 'keyboard', 'gamepad', 'touch'] as ControlMode[]).map((c) => (
                    <option key={c} value={c}>
                      {t.ctrls[c]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-200">{t.soundLabel}</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !muted;
                    setMuted(next);
                    soundEngine.muted = next;
                  }}
                  className="min-h-[40px] px-4 py-1.5 border-2 border-white text-white text-sm font-bold flex items-center gap-2 hover:bg-white hover:text-black transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{muted ? t.soundOff : t.soundOn}</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 pt-1 leading-relaxed">{t.ctrlHelp}</p>

              <button
                type="button"
                onClick={() => setScreen(optFromPause ? 'PAUSED' : 'MENU')}
                className="min-h-[44px] w-full py-2.5 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {t.back}
              </button>
            </div>
          </div>
        )}

        {/* PAUSE */}
        {screen === 'PAUSED' && (
          <div className="absolute inset-0 z-40 bg-black/85 flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-[#0b0a12] border-2 border-white p-6 flex flex-col gap-3">
              <h2 className="font-display text-2xl font-bold text-amber-400 text-center mb-1">{t.pauseTitle}</h2>
              <button
                type="button"
                onClick={() => {
                  engineRef.current.paused = false;
                  setScreen('PLAYING');
                }}
                className="min-h-[44px] w-full py-2 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                {t.resume}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSlMode('save');
                  setScreen('SAVE_LOAD');
                }}
                className="min-h-[44px] w-full py-2 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                {t.saveBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSlMode('load');
                  setScreen('SAVE_LOAD');
                }}
                className="min-h-[44px] w-full py-2 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                {t.loadBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOptFromPause(true);
                  setScreen('OPTIONS');
                }}
                className="min-h-[44px] w-full py-2 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                {t.optionsBtn}
              </button>
              <button
                type="button"
                onClick={returnToMenu}
                className="min-h-[44px] w-full py-2 border-2 border-rose-500 text-rose-300 font-bold hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
              >
                {t.quitMenu}
              </button>
            </div>
          </div>
        )}

        {/* SAVE / LOAD SLOTS */}
        {screen === 'SAVE_LOAD' && (
          <div className="absolute inset-0 z-40 bg-[#06050a]/95 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0b0a12] border-2 border-white p-6 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-amber-400">
                {slMode === 'save' ? t.slSaveTitle : t.slLoadTitle}
              </h2>

              {[1, 2, 3].map((slot) => {
                const data = saveSystem.loadSlot(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={slMode === 'load' && !data}
                    onClick={() => {
                      if (slMode === 'save') {
                        saveSystem.saveSlot(slot, buildSaveData());
                        soundEngine.save();
                        refreshMetaStorage();
                        setScreen('PAUSED');
                      } else if (data) {
                        applyLoadedSave(data);
                      }
                    }}
                    className={`w-full min-h-[52px] p-3 border-2 text-left transition-colors ${
                      slMode === 'load' && !data
                        ? 'border-slate-700 text-slate-500 cursor-not-allowed'
                        : 'border-white text-white hover:bg-white hover:text-black cursor-pointer'
                    }`}
                  >
                    <div className="font-bold text-sm">
                      Slot {slot} · {data ? `${data.player.name} (${t.rooms[data.room]})` : t.emptySlot}
                    </div>
                    {data && <div className="text-xs opacity-75 mt-0.5 tabular-nums">{data.date}</div>}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setScreen(engineRef.current.active ? 'PAUSED' : 'MENU')}
                className="min-h-[44px] w-full py-2 mt-1 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                {t.back}
              </button>
            </div>
          </div>
        )}

        {/* ENDINGS GALLERY */}
        {screen === 'ENDINGS' && (
          <div className="absolute inset-0 z-40 bg-[#06050a]/95 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#0b0a12] border-2 border-white p-6 flex flex-col gap-4 max-h-[90vh]">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-amber-400">{t.endingsTitle}</h2>
                <p className="text-xs text-slate-400 mt-1">{t.endingsDesc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto pr-1">
                {t.endings.map((e) => {
                  const ok = unlockedEndings.includes(e.id);
                  return (
                    <div
                      key={e.id}
                      className={`p-3 border ${ok ? 'border-amber-400 bg-[#151221]' : 'border-slate-800 bg-black/50'}`}
                    >
                      <div className={`text-sm font-bold ${ok ? 'text-amber-300' : 'text-slate-500'}`}>
                        {ok ? e.title : `${e.id}. ${t.locked}`}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ok ? e.desc : '...'}</p>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setScreen('MENU')}
                className="min-h-[44px] w-full py-2 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                {t.back}
              </button>
            </div>
          </div>
        )}

        {/* CHAPTER SPLASH */}
        {screen === 'CHAPTER_SPLASH' && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-400 mb-3 text-balance max-w-lg">
              {currentChapterInfo.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed mb-8">
              {currentChapterInfo.subtitle}
            </p>
            <button
              type="button"
              onClick={() => {
                engineRef.current.paused = false;
                setScreen('PLAYING');
                const cb = chapterCallbackRef.current;
                chapterCallbackRef.current = null;
                if (cb) cb();
              }}
              className="min-h-[44px] px-7 py-2.5 border-2 border-amber-400 text-amber-300 font-bold hover:bg-amber-400 hover:text-black transition-colors cursor-pointer"
            >
              {t.proceed}
            </button>
          </div>
        )}

        {/* ENDING RESULT */}
        {screen === 'ENDING_RESULT' && (
          <div className="absolute inset-0 z-50 bg-[#06050a]/95 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0b0a12] border-2 border-white p-6 text-center flex flex-col gap-3">
              <div className="text-xs font-bold tracking-widest text-amber-400">
                {endingResultId === 7 ? t.secretBadge : `${t.endingBadge} ${endingResultId} / 6`}
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">{currentEndingInfo.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{currentEndingInfo.desc}</p>
              {[2, 6, 7].includes(endingResultId) && (
                <p className="text-xs font-bold text-sky-300 pt-1">{t.unlockedPeacefulMsg}</p>
              )}
              <button
                type="button"
                onClick={returnToMenu}
                className="min-h-[44px] w-full py-2.5 mt-2 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                {t.reopen}
              </button>
            </div>
          </div>
        )}

        {/* EXIT SCREEN */}
        {screen === 'EXIT' && (
          <div className="absolute inset-0 z-50 bg-[#06050a] flex flex-col items-center justify-center p-6 text-center gap-5">
            <h2 className="font-display text-xl sm:text-2xl text-white max-w-md">{t.exitMsg}</h2>
            <button
              type="button"
              onClick={() => setScreen('MENU')}
              className="min-h-[44px] px-6 py-2.5 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              {t.reopen}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
