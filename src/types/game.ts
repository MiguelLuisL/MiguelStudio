export type Language = 'pt-PT' | 'pt-BR' | 'fr' | 'en' | 'es' | 'it' | 'zh-CN';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'nightmare';

export type ControlMode = 'auto' | 'keyboard' | 'gamepad' | 'touch';

export type Gender = 'M' | 'F';

export type RoomId = 'hallway' | 'classroom' | 'library' | 'infirmary' | 'courtyard' | 'basement';

export type ItemId =
  | 'flashlight'
  | 'libKey'
  | 'medkit'
  | 'fuse'
  | 'diary1'
  | 'diary2'
  | 'amulet'
  | 'exitKey';

export type ScreenMode =
  | 'MENU'
  | 'CHAR_SELECT'
  | 'OPTIONS'
  | 'SAVE_LOAD'
  | 'ENDINGS'
  | 'CHAPTER_SPLASH'
  | 'PLAYING'
  | 'PAUSED'
  | 'ENDING_RESULT'
  | 'EXIT';

export type SpeakerId = 'player' | 'lucas' | 'sofia' | 'mariana' | 'monster' | 'narrator';

export type PortraitMood = 'normal' | 'scared' | 'happy';

export interface DialogueChoice {
  label: string;
  action?: () => void;
  next?: DialogueLine[];
}

export interface DialogueLine {
  who: SpeakerId;
  name: string;
  mood?: PortraitMood;
  text: string;
  choices?: DialogueChoice[];
}

export interface PlayerState {
  x: number;
  y: number;
  gender: Gender;
  name: string;
  dir: 'up' | 'down' | 'left' | 'right';
  frame: number;
  stepTimer: number;
  hp: number;
  maxHp: number;
  stam: number;
  invuln: number;
  scared: boolean;
}

export interface StoryFlags {
  helpedLucas: boolean;
  trustedSofia: boolean;
  savedMariana: boolean;
  usedDistraction: boolean;
  betrayal: number;
  ch2Shown: boolean;
  ch3Shown: boolean;
  restoredPower: boolean;
}

export interface SaveData {
  slot?: number;
  date: string;
  room: RoomId;
  chapter: number;
  player: PlayerState;
  inventory: ItemId[];
  flags: StoryFlags;
  difficulty: Difficulty;
  peaceful: boolean;
}

export interface RoomDoor {
  x: number;
  y: number;
  w: number;
  h: number;
  to: RoomId | 'exit_gate';
  tx?: number;
  ty?: number;
  label?: string;
}

export interface RoomObstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'desk' | 'bookshelf' | 'bed' | 'locker' | 'pillar' | 'goal';
}

export interface RoomObject {
  id: string;
  x: number;
  y: number;
  type: 'save' | 'item' | 'npc' | 'altar' | 'lore';
  item?: ItemId;
  who?: 'lucas' | 'sofia' | 'mariana';
  color?: string;
  loreKey?: string;
}

export interface RoomDef {
  id: RoomId;
  floor: string;
  wall: string;
  peacefulFloor: string;
  peacefulWall: string;
  doors: RoomDoor[];
  obstacles: RoomObstacle[];
  objects: RoomObject[];
}
