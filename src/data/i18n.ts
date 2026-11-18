import { Difficulty, ItemId, Language, RoomId } from '../types/game';

export interface EndingInfo {
  id: number;
  title: string;
  desc: string;
}

export interface ChapterInfo {
  title: string;
  subtitle: string;
}

export interface LocaleBundle {
  gameTitle: string;
  gameSub: string;
  continueBtn: string;
  startBtn: string;
  loadBtn: string;
  peacefulLocked: string;
  peacefulUnlocked: string;
  endingsBtn: string;
  optionsBtn: string;
  exitBtn: string;
  charTitle: string;
  male: string;
  female: string;
  nameLabel: string;
  back: string;
  beginStory: string;
  optTitle: string;
  langLabel: string;
  diffLabel: string;
  ctrlLabel: string;
  soundLabel: string;
  soundOn: string;
  soundOff: string;
  diffs: Record<Difficulty, string>;
  diffDesc: Record<Difficulty, string>;
  ctrls: Record<'auto' | 'keyboard' | 'gamepad' | 'touch', string>;
  ctrlHelp: string;
  pauseTitle: string;
  resume: string;
  saveBtn: string;
  quitMenu: string;
  slSaveTitle: string;
  slLoadTitle: string;
  emptySlot: string;
  slotSaved: string;
  endingsTitle: string;
  endingsDesc: string;
  locked: string;
  exitMsg: string;
  reopen: string;
  proceed: string;
  fearAlert: string;
  invTitle: string;
  emptyBag: string;
  interactHint: string;
  goalsLabel: string;
  secretBadge: string;
  endingBadge: string;
  unlockedPeacefulMsg: string;
  rooms: Record<RoomId, string>;
  items: Record<ItemId, string>;
  chapters: ChapterInfo[];
  endings: EndingInfo[];
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  'pt-PT': 'Português (Portugal)',
  'pt-BR': 'Português (Brasil)',
  fr: 'Français',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
  'zh-CN': '简体中文',
};

export const I18N_DATA: Record<Language, LocaleBundle> = {
  'pt-PT': {
    gameTitle: 'Eco da Escola Sombria',
    gameSub: 'Visual Novel 2D de Terror e Sobrevivência',
    continueBtn: 'Continuar',
    startBtn: 'Iniciar Jogo',
    loadBtn: 'Carregar Estado',
    peacefulLocked: 'Modo Pacífico (Bloqueado)',
    peacefulUnlocked: 'Modo Pacífico',
    endingsBtn: 'Finais (7)',
    optionsBtn: 'Opções',
    exitBtn: 'Sair',
    charTitle: 'Escolhe a Tua Personagem',
    male: 'Masculino',
    female: 'Feminino',
    nameLabel: 'O Teu Nome:',
    back: 'Voltar',
    beginStory: 'Entrar na Escola',
    optTitle: 'Opções',
    langLabel: 'Idioma',
    diffLabel: 'Dificuldade',
    ctrlLabel: 'Controlo',
    soundLabel: 'Áudio',
    soundOn: 'Ligado',
    soundOff: 'Desligado',
    diffs: { easy: 'Fácil', medium: 'Médio', hard: 'Difícil', nightmare: 'Pesadelo' },
    diffDesc: {
      easy: 'Criatura mais lenta, lanterna forte e mais vida.',
      medium: 'Equilíbrio clássico de terror e perseguição.',
      hard: 'Pouca visibilidade, criatura rápida e dano elevado.',
      nightmare: 'Escuridão quase total, perseguição implacável e morte instantânea.'
    },
    ctrls: { auto: 'Automático', keyboard: 'Teclado e Rato', gamepad: 'Gamepad', touch: 'Touch' },
    ctrlHelp: 'Teclado: Setas/WASD andar · Enter/Espaço/Clique interagir · Shift correr · Esc pausa | Gamepad: Analógico + A/B',
    pauseTitle: 'Pausa',
    resume: 'Retomar',
    saveBtn: 'Guardar Estado',
    quitMenu: 'Sair para o Menu',
    slSaveTitle: 'Guardar Estado',
    slLoadTitle: 'Carregar Estado',
    emptySlot: 'Espaço Vazio',
    slotSaved: 'Guardado',
    endingsTitle: 'Coleção de Finais (6 + 1 Secreto)',
    endingsDesc: 'Descobre todos os 6 finais e o final secreto. Conclui o Final 2, 6 ou 7 para desbloquear o Modo Pacífico.',
    locked: 'Bloqueado',
    exitMsg: 'Obrigado por jogares Eco da Escola Sombria.',
    reopen: 'Voltar ao Menu',
    proceed: 'Continuar',
    fearAlert: 'ALGO ESTÁ PERTO',
    invTitle: 'Mochila',
    emptyBag: 'Vazia',
    interactHint: 'Interagir [Enter / Toque]',
    goalsLabel: 'Golos',
    secretBadge: 'Final Secreto',
    endingBadge: 'Final',
    unlockedPeacefulMsg: 'Desbloqueaste o Modo Pacífico no Menu Inicial!',
    rooms: {
      hallway: 'Corredor Principal',
      classroom: 'Sala 1-A',
      library: 'Biblioteca',
      infirmary: 'Enfermaria',
      courtyard: 'Pátio / Campo',
      basement: 'Cave Oculta',
    },
    items: {
      flashlight: 'Lanterna',
      libKey: 'Chave da Biblioteca',
      medkit: 'Kit Médico',
      fuse: 'Fusível',
      diary1: 'Diário Rasgado I',
      diary2: 'Diário Rasgado II',
      amulet: 'Amuleto Antigo',
      exitKey: 'Chave da Saída',
    },
    chapters: [
      {
        title: 'Capítulo 1: O Despertar na Escola',
        subtitle: 'Acordas preso na escola após o anoitecer. Os portões estão trancados... e há uma criatura bizarra a respirar nos corredores.'
      },
      {
        title: 'Capítulo 2: Ecos e Sobreviventes',
        subtitle: 'Não estás sozinho. Outros colegas ficaram presos. Cada escolha que fizeres terá consequências reais.'
      },
      {
        title: 'Capítulo 3: A Chave da Salvação',
        subtitle: 'A criatura caça sem piedade. Encontra a Chave da Saída na Cave Oculta ou descobre a verdade no altar.'
      },
      {
        title: 'Modo Pacífico: Um Novo Amanhecer',
        subtitle: 'Sem monstros, sem medo. Joga futebol no pátio, conversa com os teus colegas e desfruta do tempo livre!'
      },
    ],
    endings: [
      { id: 1, title: 'Final 1: Fuga Solitária', desc: 'Abriste o portão com a Chave da Saída e fugiste sozinho para a noite, deixando os colegas para trás.' },
      { id: 2, title: 'Final 2: Esperança Unida', desc: 'Ajudaste Lucas, Sofia e Mariana, e escaparam todos juntos da escola assombrada ao nascer do sol.' },
      { id: 3, title: 'Final 3: Sacrifício Heroico', desc: 'Atraíste a criatura para longe para que os teus colegas pudessem escapar em segurança.' },
      { id: 4, title: 'Final 4: Traição Sombria', desc: 'Sacrificaste a confiança dos outros para garantir a tua sobrevivência. Escapaste, mas a culpa persegue-te.' },
      { id: 5, title: 'Final 5: Prisioneiro Eterno', desc: 'A escuridão venceu-te. A tua alma ficou presa para sempre nos corredores da escola.' },
      { id: 6, title: 'Final 6: A Verdade Selada', desc: 'Com os dois Diários e o Amuleto Antigo, selaste a maldição no altar da cave antes de saíres vitorioso.' },
      { id: 7, title: 'Final Secreto: O Despertar Pacífico', desc: 'Com os Diários, o Amuleto e compaixão intacta, acalmaste o espírito da escola e libertaste todos em paz.' },
    ],
  },
  'pt-BR': {
    gameTitle: 'Eco da Escola Sombria',
    gameSub: 'Visual Novel 2D de Terror e Sobrevivência',
    continueBtn: 'Continuar',
    startBtn: 'Iniciar Jogo',
    loadBtn: 'Carregar Estado',
    peacefulLocked: 'Modo Pacífico (Bloqueado)',
    peacefulUnlocked: 'Modo Pacífico',
    endingsBtn: 'Finais (7)',
    optionsBtn: 'Opções',
    exitBtn: 'Sair',
    charTitle: 'Escolha Seu Personagem',
    male: 'Masculino',
    female: 'Feminino',
    nameLabel: 'Seu Nome:',
    back: 'Voltar',
    beginStory: 'Entrar na Escola',
    optTitle: 'Opções',
    langLabel: 'Idioma',
    diffLabel: 'Dificuldade',
    ctrlLabel: 'Controle',
    soundLabel: 'Áudio',
    soundOn: 'Ligado',
    soundOff: 'Desligado',
    diffs: { easy: 'Fácil', medium: 'Médio', hard: 'Difícil', nightmare: 'Pesadelo' },
    diffDesc: {
      easy: 'Criatura mais lenta, lanterna forte e mais vida.',
      medium: 'Equilíbrio clássico de terror e perseguição.',
      hard: 'Pouca visibilidade, criatura rápida e dano alto.',
      nightmare: 'Escuridão quase total, perseguição implacável e morte em 1 golpe.'
    },
    ctrls: { auto: 'Automático', keyboard: 'Teclado e Mouse', gamepad: 'Gamepad', touch: 'Touch' },
    ctrlHelp: 'Teclado: Setas/WASD mover · Enter/Espaço/Clique interagir · Shift correr · Esc pausa | Gamepad: Analógico + A/B',
    pauseTitle: 'Pausa',
    resume: 'Continuar',
    saveBtn: 'Salvar Estado',
    quitMenu: 'Voltar ao Menu',
    slSaveTitle: 'Salvar Estado',
    slLoadTitle: 'Carregar Estado',
    emptySlot: 'Slot Vazio',
    slotSaved: 'Salvo',
    endingsTitle: 'Galeria de Finais (6 + 1 Secreto)',
    endingsDesc: 'Descubra os 6 finais e o final secreto. Conclua o Final 2, 6 ou 7 para desbloquear o Modo Pacífico.',
    locked: 'Bloqueado',
    exitMsg: 'Obrigado por jogar Eco da Escola Sombria.',
    reopen: 'Voltar ao Menu',
    proceed: 'Continuar',
    fearAlert: 'ALGO ESTÁ PERTO',
    invTitle: 'Mochila',
    emptyBag: 'Vazia',
    interactHint: 'Interagir [Enter / Toque]',
    goalsLabel: 'Gols',
    secretBadge: 'Final Secreto',
    endingBadge: 'Final',
    unlockedPeacefulMsg: 'Você desbloqueou o Modo Pacífico no Menu Inicial!',
    rooms: {
      hallway: 'Corredor Principal',
      classroom: 'Sala 1-A',
      library: 'Biblioteca',
      infirmary: 'Enfermaria',
      courtyard: 'Pátio / Quadra',
      basement: 'Porão Oculto',
    },
    items: {
      flashlight: 'Lanterna',
      libKey: 'Chave da Biblioteca',
      medkit: 'Kit Médico',
      fuse: 'Fusível',
      diary1: 'Diário Rasgado I',
      diary2: 'Diário Rasgado II',
      amulet: 'Amuleto Antigo',
      exitKey: 'Chave da Saída',
    },
    chapters: [
      {
        title: 'Capítulo 1: O Despertar na Escola',
        subtitle: 'Você acorda preso na escola à noite. Os portões estão trancados... e algo bizarro respira pelos corredores.'
      },
      {
        title: 'Capítulo 2: Ecos e Sobreviventes',
        subtitle: 'Você não está sozinho. Outros colegas ficaram presos. Cada decisão terá consequências.'
      },
      {
        title: 'Capítulo 3: A Chave da Salvação',
        subtitle: 'A criatura caça sem piedade. Encontre a Chave da Saída no Porão ou revele a verdade no altar.'
      },
      {
        title: 'Modo Pacífico: Tempo Livre',
        subtitle: 'Sem monstros, sem medo! Jogue futebol na quadra, converse com seus colegas e aproveite a escola.'
      },
    ],
    endings: [
      { id: 1, title: 'Final 1: Fuga Solitária', desc: 'Você abriu a saída com a chave e escapou sozinho na escuridão, deixando os colegas para trás.' },
      { id: 2, title: 'Final 2: Esperança Unida', desc: 'Você ajudou Lucas, Sofia e Mariana, e todos escaparam juntos ao amanhecer.' },
      { id: 3, title: 'Final 3: Sacrifício Heroico', desc: 'Você atraiu a criatura para longe para salvar seus amigos.' },
      { id: 4, title: 'Final 4: Traição Sombria', desc: 'Você usou a confiança dos outros para fugir. Escapou, mas a culpa nunca vai embora.' },
      { id: 5, title: 'Final 5: Prisioneiro Eterno', desc: 'A escuridão venceu. Você ficou preso para sempre na escola assombrada.' },
      { id: 6, title: 'Final 6: A Verdade Selada', desc: 'Com os Diários e o Amuleto Antigo, você selou a maldição no porão antes de escapar.' },
      { id: 7, title: 'Final Secreto: Despertar Pacífico', desc: 'Com os Diários, o Amuleto e zero traições, você acalmou o espírito da escola e libertou todos em paz.' },
    ],
  },
  en: {
    gameTitle: 'Echo of the Dark School',
    gameSub: '2D Horror Visual Novel & Survival',
    continueBtn: 'Continue',
    startBtn: 'Start Game',
    loadBtn: 'Load State',
    peacefulLocked: 'Peaceful Mode (Locked)',
    peacefulUnlocked: 'Peaceful Mode',
    endingsBtn: 'Endings (7)',
    optionsBtn: 'Options',
    exitBtn: 'Exit',
    charTitle: 'Choose Your Character',
    male: 'Male',
    female: 'Female',
    nameLabel: 'Your Name:',
    back: 'Back',
    beginStory: 'Enter School',
    optTitle: 'Options',
    langLabel: 'Language',
    diffLabel: 'Difficulty',
    ctrlLabel: 'Controls',
    soundLabel: 'Audio',
    soundOn: 'On',
    soundOff: 'Off',
    diffs: { easy: 'Easy', medium: 'Medium', hard: 'Hard', nightmare: 'Nightmare' },
    diffDesc: {
      easy: 'Slower creature, bright flashlight, higher health.',
      medium: 'Balanced horror chase and exploration.',
      hard: 'Dim vision, fast stalker, heavy damage.',
      nightmare: 'Near-total darkness, relentless pursuit, lethal 1-hit danger.'
    },
    ctrls: { auto: 'Auto', keyboard: 'Keyboard & Mouse', gamepad: 'Gamepad', touch: 'Touch' },
    ctrlHelp: 'Keyboard: Arrows/WASD move · Enter/Space/Click interact · Shift sprint · Esc pause | Gamepad: Stick + A/B',
    pauseTitle: 'Paused',
    resume: 'Resume',
    saveBtn: 'Save State',
    quitMenu: 'Main Menu',
    slSaveTitle: 'Save State',
    slLoadTitle: 'Load State',
    emptySlot: 'Empty Slot',
    slotSaved: 'Saved',
    endingsTitle: 'Endings Collection (6 + 1 Secret)',
    endingsDesc: 'Discover all 6 endings and the secret ending. Earn Ending 2, 6, or 7 to unlock Peaceful Mode.',
    locked: 'Locked',
    exitMsg: 'Thank you for playing Echo of the Dark School.',
    reopen: 'Back to Menu',
    proceed: 'Continue',
    fearAlert: 'SOMETHING IS NEAR',
    invTitle: 'Bag',
    emptyBag: 'Empty',
    interactHint: 'Interact [Enter / Tap]',
    goalsLabel: 'Goals',
    secretBadge: 'Secret Ending',
    endingBadge: 'Ending',
    unlockedPeacefulMsg: 'Peaceful Mode is now unlocked on the Main Menu!',
    rooms: {
      hallway: 'Main Hallway',
      classroom: 'Classroom 1-A',
      library: 'Library',
      infirmary: 'Infirmary',
      courtyard: 'Courtyard / Field',
      basement: 'Hidden Basement',
    },
    items: {
      flashlight: 'Flashlight',
      libKey: 'Library Key',
      medkit: 'Medkit',
      fuse: 'Fuse',
      diary1: 'Torn Diary I',
      diary2: 'Torn Diary II',
      amulet: 'Ancient Amulet',
      exitKey: 'Exit Key',
    },
    chapters: [
      {
        title: 'Chapter 1: Awakening in the School',
        subtitle: 'You wake up trapped inside the haunted school after dark. The gate is locked... and something lurks in the halls.'
      },
      {
        title: 'Chapter 2: Echoes and Survivors',
        subtitle: 'Other classmates are trapped too. Every choice you make carries real consequences.'
      },
      {
        title: 'Chapter 3: The Key to Salvation',
        subtitle: 'The creature hunts relentlessly. Find the Exit Key in the Basement or uncover the altar truth.'
      },
      {
        title: 'Peaceful Mode: Free Time',
        subtitle: 'No monsters, no fear! Play soccer in the courtyard, chat with classmates, and enjoy free time.'
      },
    ],
    endings: [
      { id: 1, title: 'Ending 1: Lone Escape', desc: 'You unlocked the gate with the Exit Key and fled alone into the night.' },
      { id: 2, title: 'Ending 2: United Hope', desc: 'You helped Lucas, Sofia, and Mariana, and escaped together at sunrise.' },
      { id: 3, title: 'Ending 3: Heroic Sacrifice', desc: 'You drew the creature away so your classmates could escape safely.' },
      { id: 4, title: 'Ending 4: Dark Betrayal', desc: 'You sacrificed others to survive. You escaped, but guilt follows you forever.' },
      { id: 5, title: 'Ending 5: Eternal Prisoner', desc: 'Darkness claimed you. Your soul remains trapped in the haunted school forever.' },
      { id: 6, title: 'Ending 6: The Sealed Truth', desc: 'With both Diaries and the Ancient Amulet, you sealed the curse at the basement altar before escaping.' },
      { id: 7, title: 'Secret Ending: Peaceful Awakening', desc: 'With the Diaries, Amulet, and zero betrayals, you soothed the school spirit and freed everyone in peace.' },
    ],
  },
  es: {
    gameTitle: 'Eco de la Escuela Sombría',
    gameSub: 'Novela Visual 2D de Terror y Supervivencia',
    continueBtn: 'Continuar',
    startBtn: 'Iniciar Juego',
    loadBtn: 'Cargar Estado',
    peacefulLocked: 'Modo Pacífico (Bloqueado)',
    peacefulUnlocked: 'Modo Pacífico',
    endingsBtn: 'Finales (7)',
    optionsBtn: 'Opciones',
    exitBtn: 'Salir',
    charTitle: 'Elige tu Personaje',
    male: 'Masculino',
    female: 'Femenino',
    nameLabel: 'Tu Nombre:',
    back: 'Volver',
    beginStory: 'Entrar en la Escuela',
    optTitle: 'Opciones',
    langLabel: 'Idioma',
    diffLabel: 'Dificultad',
    ctrlLabel: 'Control',
    soundLabel: 'Audio',
    soundOn: 'Activado',
    soundOff: 'Desactivado',
    diffs: { easy: 'Fácil', medium: 'Medio', hard: 'Difícil', nightmare: 'Pesadilla' },
    diffDesc: {
      easy: 'Criatura más lenta, linterna potente y más salud.',
      medium: 'Equilibrio clásico de terror y persecución.',
      hard: 'Poca visibilidad, criatura rápida y daño alto.',
      nightmare: 'Oscuridad casi total, persecución implacable y muerte de 1 golpe.'
    },
    ctrls: { auto: 'Automático', keyboard: 'Teclado y Ratón', gamepad: 'Mando', touch: 'Táctil' },
    ctrlHelp: 'Teclado: Flechas/WASD mover · Enter/Espacio/Clic interactuar · Shift correr · Esc pausa',
    pauseTitle: 'Pausa',
    resume: 'Reanudar',
    saveBtn: 'Guardar Estado',
    quitMenu: 'Menú Principal',
    slSaveTitle: 'Guardar Estado',
    slLoadTitle: 'Cargar Estado',
    emptySlot: 'Ranura Vacía',
    slotSaved: 'Guardado',
    endingsTitle: 'Galería de Finales (6 + 1 Secreto)',
    endingsDesc: 'Descubre los 6 finales y el secreto. Completa el Final 2, 6 o 7 para desbloquear el Modo Pacífico.',
    locked: 'Bloqueado',
    exitMsg: 'Gracias por jugar Eco de la Escuela Sombría.',
    reopen: 'Volver al Menú',
    proceed: 'Continuar',
    fearAlert: 'ALGO ESTÁ CERCA',
    invTitle: 'Mochila',
    emptyBag: 'Vacía',
    interactHint: 'Interactuar [Enter / Toque]',
    goalsLabel: 'Goles',
    secretBadge: 'Final Secreto',
    endingBadge: 'Final',
    unlockedPeacefulMsg: '¡Desbloqueaste el Modo Pacífico en el Menú Principal!',
    rooms: {
      hallway: 'Pasillo Principal',
      classroom: 'Aula 1-A',
      library: 'Biblioteca',
      infirmary: 'Enfermería',
      courtyard: 'Patio / Cancha',
      basement: 'Sótano Oculto',
    },
    items: {
      flashlight: 'Linterna',
      libKey: 'Llave Biblioteca',
      medkit: 'Botiquín',
      fuse: 'Fusible',
      diary1: 'Diario Rasgado I',
      diary2: 'Diario Rasgado II',
      amulet: 'Amuleto Antiguo',
      exitKey: 'Llave de Salida',
    },
    chapters: [
      { title: 'Capítulo 1: El Despertar', subtitle: 'Despiertas atrapado en la escuela maldita. Una criatura bizarra acecha en la oscuridad.' },
      { title: 'Capítulo 2: Ecos y Supervivientes', subtitle: 'Otros compañeros están atrapados. Cada decisión tiene consecuencias.' },
      { title: 'Capítulo 3: La Llave de Salvación', subtitle: 'Encuentra la Llave de Salida en el sótano o descubre la verdad del altar.' },
      { title: 'Modo Pacífico: Tiempo Libre', subtitle: '¡Sin monstruos! Juega al fútbol en el patio y charla con tus compañeros.' },
    ],
    endings: [
      { id: 1, title: 'Final 1: Huida Solitaria', desc: 'Escapaste solo en la noche dejando atrás a los demás.' },
      { id: 2, title: 'Final 2: Esperanza Unida', desc: 'Ayudaste a todos tus compañeros y escaparon juntos al amanecer.' },
      { id: 3, title: 'Final 3: Sacrificio Heroico', desc: 'Atrajiste a la criatura para salvar a tus amigos.' },
      { id: 4, title: 'Final 4: Traición Oscura', desc: 'Sobreviviste traicionando la confianza de los demás.' },
      { id: 5, title: 'Final 5: Prisionero Eterno', desc: 'La oscuridad te atrapó para siempre en la escuela.' },
      { id: 6, title: 'Final 6: La Verdad Sellada', desc: 'Sellaste la maldición con los diarios y el amuleto antes de huir.' },
      { id: 7, title: 'Final Secreto: Amanecer Pacífico', desc: 'Comprendiste el espíritu de la escuela y liberaste a todos en paz.' },
    ],
  },
  fr: {
    gameTitle: 'Écho de l’École Maudite',
    gameSub: 'Visual Novel 2D d’Horreur et Survie',
    continueBtn: 'Continuer',
    startBtn: 'Commencer',
    loadBtn: 'Charger',
    peacefulLocked: 'Mode Pacifique (Verrouillé)',
    peacefulUnlocked: 'Mode Pacifique',
    endingsBtn: 'Fins (7)',
    optionsBtn: 'Options',
    exitBtn: 'Quitter',
    charTitle: 'Choisis ton Personnage',
    male: 'Masculin',
    female: 'Féminin',
    nameLabel: 'Ton Nom :',
    back: 'Retour',
    beginStory: 'Entrer dans l’École',
    optTitle: 'Options',
    langLabel: 'Langue',
    diffLabel: 'Difficulté',
    ctrlLabel: 'Contrôles',
    soundLabel: 'Audio',
    soundOn: 'Activé',
    soundOff: 'Coupé',
    diffs: { easy: 'Facile', medium: 'Moyen', hard: 'Difficile', nightmare: 'Cauchemar' },
    diffDesc: {
      easy: 'Créature plus lente, lampe puissante et plus de vie.',
      medium: 'Équilibre classique de survie et d’horreur.',
      hard: 'Visibilité réduite, traqueur rapide et lourds dégâts.',
      nightmare: 'Obscurité presque totale, poursuite implacable et mort en 1 coup.'
    },
    ctrls: { auto: 'Auto', keyboard: 'Clavier & Souris', gamepad: 'Manette', touch: 'Tactile' },
    ctrlHelp: 'Clavier : Flèches/WASD bouger · Entrée/Espace/Clic interagir · Maj courir · Échap pause',
    pauseTitle: 'Pause',
    resume: 'Reprendre',
    saveBtn: 'Sauvegarder',
    quitMenu: 'Menu Principal',
    slSaveTitle: 'Sauvegarder',
    slLoadTitle: 'Charger',
    emptySlot: 'Emplacement Vide',
    slotSaved: 'Sauvegardé',
    endingsTitle: 'Galerie des Fins (6 + 1 Secrète)',
    endingsDesc: 'Découvrez les 6 fins et la fin secrète. Obtenez la Fin 2, 6 ou 7 pour débloquer le Mode Pacifique.',
    locked: 'Verrouillé',
    exitMsg: 'Merci d’avoir joué à Écho de l’École Maudite.',
    reopen: 'Retour au Menu',
    proceed: 'Continuer',
    fearAlert: 'QUELQUE CHOSE APPROCHE',
    invTitle: 'Sac',
    emptyBag: 'Vide',
    interactHint: 'Interagir [Entrée / Toucher]',
    goalsLabel: 'Buts',
    secretBadge: 'Fin Secrète',
    endingBadge: 'Fin',
    unlockedPeacefulMsg: 'Le Mode Pacifique est maintenant débloqué au Menu !',
    rooms: {
      hallway: 'Couloir Principal',
      classroom: 'Classe 1-A',
      library: 'Bibliothèque',
      infirmary: 'Infirmerie',
      courtyard: 'Cour / Terrain',
      basement: 'Sous-sol Caché',
    },
    items: {
      flashlight: 'Lampe Torche',
      libKey: 'Clé Bibliothèque',
      medkit: 'Trousse de Soin',
      fuse: 'Fusible',
      diary1: 'Journal Déchiré I',
      diary2: 'Journal Déchiré II',
      amulet: 'Amulette Ancienne',
      exitKey: 'Clé de Sortie',
    },
    chapters: [
      { title: 'Chapitre 1 : L’Éveil', subtitle: 'Tu te réveilles piégé dans l’école hantée. Une créature rôde dans le noir.' },
      { title: 'Chapitre 2 : Échos et Survivants', subtitle: 'D’autres élèves sont piégés. Chaque décision a des conséquences.' },
      { title: 'Chapitre 3 : La Clé du Salut', subtitle: 'Trouve la Clé de Sortie au sous-sol ou révèle la vérité de l’autel.' },
      { title: 'Mode Pacifique : Temps Libre', subtitle: 'Pas de monstres ! Joue au football dans la cour et discute avec tes camarades.' },
    ],
    endings: [
      { id: 1, title: 'Fin 1 : Fuite Solitaire', desc: 'Tu as fui seul dans la nuit en abandonnant les autres.' },
      { id: 2, title: 'Fin 2 : Espoir Uni', desc: 'Tous les camarades se sont échappés ensemble à l’aube.' },
      { id: 3, title: 'Fin 3 : Sacrifice Héroïque', desc: 'Tu as sauvé tes amis en attirant la créature loin d’eux.' },
      { id: 4, title: 'Fin 4 : Sombre Trahison', desc: 'Tu as survécu en trahissant les autres. La culpabilité te hante.' },
      { id: 5, title: 'Fin 5 : Prisonnier Éternel', desc: 'L’obscurité t’a vaincu pour toujours.' },
      { id: 6, title: 'Fin 6 : La Vérité Scellée', desc: 'Tu as scellé la malédiction avec les journaux et l’amulette.' },
      { id: 7, title: 'Fin Secrète : Aube Pacifique', desc: 'Tu as apaisé l’esprit de l’école et libéré tout le monde en paix.' },
    ],
  },
  it: {
    gameTitle: 'Eco della Scuola Oscura',
    gameSub: 'Visual Novel 2D Horror e Sopravvivenza',
    continueBtn: 'Continua',
    startBtn: 'Inizia Gioco',
    loadBtn: 'Carica Stato',
    peacefulLocked: 'Modalità Pacifica (Bloccata)',
    peacefulUnlocked: 'Modalità Pacifica',
    endingsBtn: 'Finali (7)',
    optionsBtn: 'Opzioni',
    exitBtn: 'Esci',
    charTitle: 'Scegli il Personaggio',
    male: 'Maschio',
    female: 'Femmina',
    nameLabel: 'Il Tuo Nome:',
    back: 'Indietro',
    beginStory: 'Entra a Scuola',
    optTitle: 'Opzioni',
    langLabel: 'Lingua',
    diffLabel: 'Difficoltà',
    ctrlLabel: 'Controlli',
    soundLabel: 'Audio',
    soundOn: 'Attivo',
    soundOff: 'Disattivo',
    diffs: { easy: 'Facile', medium: 'Medio', hard: 'Difficile', nightmare: 'Incubo' },
    diffDesc: {
      easy: 'Creatura più lenta, torcia potente e più salute.',
      medium: 'Equilibrio classico tra paura e fuga.',
      hard: 'Scarsa visibilità, creatura veloce e danni gravi.',
      nightmare: 'Oscurità quasi totale, caccia spietata e morte con 1 colpo.'
    },
    ctrls: { auto: 'Automatico', keyboard: 'Tastiera e Mouse', gamepad: 'Gamepad', touch: 'Touch' },
    ctrlHelp: 'Tastiera: Frecce/WASD muovi · Invio/Spazio/Clic interagisci · Shift corri · Esc pausa',
    pauseTitle: 'Pausa',
    resume: 'Riprendi',
    saveBtn: 'Salva Stato',
    quitMenu: 'Menu Principale',
    slSaveTitle: 'Salva Stato',
    slLoadTitle: 'Carica Stato',
    emptySlot: 'Slot Vuoto',
    slotSaved: 'Salvato',
    endingsTitle: 'Galleria Finali (6 + 1 Segreto)',
    endingsDesc: 'Scopri i 6 finali e quello segreto. Ottieni il Finale 2, 6 o 7 per sbloccare la Modalità Pacifica.',
    locked: 'Bloccato',
    exitMsg: 'Grazie per aver giocato a Eco della Scuola Oscura.',
    reopen: 'Torna al Menu',
    proceed: 'Continua',
    fearAlert: 'QUALCOSA È VICINO',
    invTitle: 'Zaino',
    emptyBag: 'Vuoto',
    interactHint: 'Interagisci [Invio / Tocca]',
    goalsLabel: 'Gol',
    secretBadge: 'Finale Segreto',
    endingBadge: 'Finale',
    unlockedPeacefulMsg: 'Hai sbloccato la Modalità Pacifica nel Menu Principale!',
    rooms: {
      hallway: 'Corridoio Principale',
      classroom: 'Classe 1-A',
      library: 'Biblioteca',
      infirmary: 'Infermeria',
      courtyard: 'Cortile / Campo',
      basement: 'Seminterrato',
    },
    items: {
      flashlight: 'Torcia',
      libKey: 'Chiave Biblioteca',
      medkit: 'Kit Medico',
      fuse: 'Fusibile',
      diary1: 'Diario Strappato I',
      diary2: 'Diario Strappato II',
      amulet: 'Amuleto Antico',
      exitKey: 'Chiave Uscita',
    },
    chapters: [
      { title: 'Capitolo 1: Il Risveglio', subtitle: 'Sei intrappolato nella scuola infestata. Una creatura bizzarra ti dà la caccia.' },
      { title: 'Capitolo 2: Echi e Sopravvissuti', subtitle: 'Altri studenti sono bloccati qui. Ogni scelta ha conseguenze.' },
      { title: 'Capitolo 3: La Chiave della Salvezza', subtitle: 'Trova la Chiave dell’Uscita nel seminterrato o scopri la verità sull’altare.' },
      { title: 'Modalità Pacifica: Tempo Libero', subtitle: 'Niente mostri! Gioca a calcio in cortile e parla con i compagni.' },
    ],
    endings: [
      { id: 1, title: 'Finale 1: Fuga Solitaria', desc: 'Sei fuggito da solo nella notte lasciando gli altri indietro.' },
      { id: 2, title: 'Finale 2: Speranza Unita', desc: 'Siete fuggiti tutti insieme all’alba.' },
      { id: 3, title: 'Finale 3: Sacrificio Eroico', desc: 'Hai salvato i tuoi compagni attirando la creatura.' },
      { id: 4, title: 'Finale 4: Tradimento Oscuro', desc: 'Hai tradito gli altri per sopravvivere.' },
      { id: 5, title: 'Finale 5: Prigioniero Eterno', desc: 'L’oscurità ti ha sconfitto per sempre.' },
      { id: 6, title: 'Finale 6: Verità Sigillata', desc: 'Hai sigillato la maledizione con i diari e l’amuleto.' },
      { id: 7, title: 'Finale Segreto: Alba Pacifica', desc: 'Hai placato lo spirito della scuola e liberato tutti in pace.' },
    ],
  },
  'zh-CN': {
    gameTitle: '幽暗校园的回响',
    gameSub: '2D 恐怖视觉小说与生存探索',
    continueBtn: '继续游戏',
    startBtn: '开始游戏',
    loadBtn: '读取存档',
    peacefulLocked: '和平模式（未解锁）',
    peacefulUnlocked: '和平模式',
    endingsBtn: '结局图鉴 (7)',
    optionsBtn: '选项设置',
    exitBtn: '退出',
    charTitle: '选择你的角色',
    male: '男生',
    female: '女生',
    nameLabel: '你的名字：',
    back: '返回',
    beginStory: '进入校园',
    optTitle: '选项设置',
    langLabel: '语言',
    diffLabel: '难度',
    ctrlLabel: '操作方式',
    soundLabel: '音效',
    soundOn: '开启',
    soundOff: '关闭',
    diffs: { easy: '简单', medium: '普通', hard: '困难', nightmare: '噩梦' },
    diffDesc: {
      easy: '怪物移动较慢，手电视野宽广，生命值更高。',
      medium: '标准的恐怖追逐与探索平衡。',
      hard: '视野较窄，怪物速度更快，伤害较高。',
      nightmare: '近乎完全黑暗，全程无情追击，一击致命。'
    },
    ctrls: { auto: '自动适配', keyboard: '键盘和鼠标', gamepad: '游戏手柄', touch: '触屏控制' },
    ctrlHelp: '键盘：方向键/WASD移动 · 回车/空格/点击互动 · Shift奔跑 · Esc暂停 | 手柄：摇杆 + A/B',
    pauseTitle: '游戏暂停',
    resume: '继续',
    saveBtn: '保存进度',
    quitMenu: '返回主菜单',
    slSaveTitle: '保存进度',
    slLoadTitle: '读取进度',
    emptySlot: '空存档位',
    slotSaved: '已保存',
    endingsTitle: '结局收集（6个普通 + 1个隐藏）',
    endingsDesc: '探索全部6个结局和隐藏结局。达成结局2、6或7即可解锁和平模式。',
    locked: '未解锁',
    exitMsg: '感谢游玩《幽暗校园的回响》。',
    reopen: '返回主菜单',
    proceed: '继续',
    fearAlert: '有什么东西正在靠近',
    invTitle: '背包',
    emptyBag: '空',
    interactHint: '互动 [回车 / 点击]',
    goalsLabel: '进球',
    secretBadge: '隐藏结局',
    endingBadge: '结局',
    unlockedPeacefulMsg: '已在主菜单解锁和平模式！',
    rooms: {
      hallway: '主走廊',
      classroom: '1-A 教室',
      library: '图书馆',
      infirmary: '医务室',
      courtyard: '操场 / 球场',
      basement: '秘密地下室',
    },
    items: {
      flashlight: '手电筒',
      libKey: '图书馆钥匙',
      medkit: '急救箱',
      fuse: '保险丝',
      diary1: '残破日记 I',
      diary2: '残破日记 II',
      amulet: '古老护身符',
      exitKey: '大门钥匙',
    },
    chapters: [
      { title: '第一章：校园惊醒', subtitle: '夜幕降临后你被困在学校里，出口已锁死，诡异的怪物正在走廊徘徊。' },
      { title: '第二章：回响与幸存者', subtitle: '其他同学也被困在这里。你的每一次选择都将带来不同的后果。' },
      { title: '第三章：逃生之钥', subtitle: '怪物紧追不舍。前往秘密地下室寻找大门钥匙，或在祭坛揭开真相。' },
      { title: '和平模式：自由时光', subtitle: '没有怪物与恐惧！在操场踢足球，与同学们聊天，享受校园自由时光。' },
    ],
    endings: [
      { id: 1, title: '结局 1：独自逃生', desc: '你用大门钥匙独自逃入黑夜，把同学们留在了后面。' },
      { id: 2, title: '结局 2：团结希望', desc: '你帮助了卢卡斯、索菲亚和玛丽安娜，大家在黎明时分一起逃出校园。' },
      { id: 3, title: '结局 3：英勇牺牲', desc: '你引开了怪物，掩护同学们安全逃脱。' },
      { id: 4, title: '结局 4：黑暗背叛', desc: '你背叛了同伴的信任独自逃生，但内疚永远缠绕着你。' },
      { id: 5, title: '结局 5：永恒囚徒', desc: '黑暗吞噬了你，你的灵魂永远被困在校园走廊中。' },
      { id: 6, title: '结局 6：封印真相', desc: '你在地下室祭坛用两本日记和古老护身符封印了诅咒并成功逃脱。' },
      { id: 7, title: '隐藏结局：和平黎明', desc: '集齐日记与护身符且未曾背叛任何人，你安抚了校园怨灵，让所有人获得和平。' },
    ],
  },
};

export function pickText(lang: Language, texts: { pt: string; ptBR?: string; en: string; es: string; fr: string; it: string; zh: string }): string {
  switch (lang) {
    case 'pt-PT': return texts.pt;
    case 'pt-BR': return texts.ptBR ?? texts.pt;
    case 'fr': return texts.fr;
    case 'es': return texts.es;
    case 'it': return texts.it;
    case 'zh-CN': return texts.zh;
    default: return texts.en;
  }
}
