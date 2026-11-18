import { I18N_DATA, pickText } from './i18n';
import { DialogueLine, ItemId, Language, StoryFlags } from '../types/game';

interface StoryContext {
  lang: Language;
  playerName: string;
  peaceful: boolean;
  inventory: ItemId[];
  flags: StoryFlags;
  goals: number;
  onUpdateFlags: (updater: (prev: StoryFlags) => StoryFlags) => void;
  onAdvanceChapter: (chapter: number) => void;
  onTriggerEnding: (id: number) => void;
  onReturnToMenu: () => void;
}

export function getAwakeningLines(lang: Language, playerName: string): DialogueLine[] {
  return [
    {
      who: 'player',
      name: playerName,
      mood: 'scared',
      text: pickText(lang, {
        pt: 'Onde estou...? A escola está às escuras e os portões estão trancados.\nTenho de explorar as salas, encontrar a Chave da Saída e fugir daquela criatura!',
        ptBR: 'Onde estou...? A escola está no escuro e os portões estão trancados.\nPreciso explorar as salas, achar a Chave da Saída e escapar daquela criatura!',
        en: 'Where am I...? The school is pitch black and the gates are locked.\nI need to explore the rooms, find the Exit Key, and escape whatever is lurking here!',
        es: '¿Dónde estoy...? La escuela está a oscuras y cerrada.\n¡Debo explorar las aulas, hallar la Llave de Salida y huir de esa criatura!',
        fr: 'Où suis-je ? L’école est plongée dans le noir et fermée.\nJe dois explorer les salles, trouver la Clé de Sortie et fuir cette créature !',
        it: 'Dove sono? La scuola è al buio e chiusa a chiave.\nDevo esplorare le stanze, trovare la Chiave dell’Uscita e fuggire!',
        zh: '这是哪里……学校一片漆黑，大门也被锁住了。\n我必须探索各个房间，找到大门钥匙并躲开那个怪物！',
      }),
    },
  ];
}

export function getLockedLibraryLines(lang: Language): DialogueLine[] {
  return [
    {
      who: 'narrator',
      name: I18N_DATA[lang].rooms.library,
      text: pickText(lang, {
        pt: '* A porta da Biblioteca está trancada! Procura a Chave da Biblioteca na Sala 1-A.',
        ptBR: '* A porta da Biblioteca está trancada! Procure a Chave da Biblioteca na Sala 1-A.',
        en: '* The Library door is locked! Search Classroom 1-A for the Library Key.',
        es: '* ¡La Biblioteca está cerrada! Busca la llave en el Aula 1-A.',
        fr: '* La Bibliothèque est fermée ! Cherche la clé en Classe 1-A.',
        it: '* La Biblioteca è chiusa! Cerca la chiave nella Classe 1-A.',
        zh: '* 图书馆大门锁住了！请前往 1-A 教室寻找图书馆钥匙。',
      }),
    },
  ];
}

export function getLoreLines(lang: Language): DialogueLine[] {
  return [
    {
      who: 'narrator',
      name: 'INFO',
      text: pickText(lang, {
        pt: '* Quadro de Avisos: "Se ficares preso à noite, procura os 2 Diários Rasgados e o Amuleto Antigo antes de ires ao Altar da Cave."',
        ptBR: '* Mural: "Se ficar preso à noite, procure os 2 Diários Rasgados e o Amuleto Antigo antes de ir ao Altar do Porão."',
        en: '* Noticeboard: "If trapped after dark, gather both Torn Diaries and the Ancient Amulet before approaching the Basement Altar."',
        es: '* Tablón: "Si quedas atrapado de noche, reúne los 2 Diarios y el Amuleto Antiguo antes de ir al Altar del Sótano."',
        fr: '* Panneau : "Si tu es piégé la nuit, rassemble les 2 Journaux et l’Amulette avant d’aller à l’Autel du Sous-sol."',
        it: '* Bacheca: "Se resti bloccato di notte, raccogli i 2 Diari e l’Amuleto Antico prima di andare all’Altare."',
        zh: '* 公告栏：“如果夜间被困，请在前往地下室祭坛前找齐两本日记和古老护身符。”',
      }),
    },
  ];
}

export function getNpcLines(who: 'lucas' | 'sofia' | 'mariana', ctx: StoryContext): DialogueLine[] {
  const { lang, playerName, peaceful, inventory, flags, goals, onUpdateFlags, onAdvanceChapter } = ctx;

  if (peaceful) {
    if (who === 'lucas') {
      return [
        {
          who: 'lucas',
          name: 'Lucas',
          mood: 'happy',
          text: pickText(lang, {
            pt: `Olá ${playerName}! Que alívio ver o sol a brilhar! Vamos jogar futebol no Pátio? Já marcámos ${goals} golos hoje!`,
            ptBR: `Oi ${playerName}! Que bom ver o sol brilhando! Vamos jogar futebol na quadra? Já fizemos ${goals} gols hoje!`,
            en: `Hey ${playerName}! What a sunny day! Ready to play soccer in the courtyard? We scored ${goals} goals today!`,
            es: `¡Hola ${playerName}! ¡Qué día tan soleado! ¿Jugamos al fútbol en el patio? ¡Llevamos ${goals} goles!`,
            fr: `Salut ${playerName} ! Quel beau soleil ! On joue au football dans la cour ? Déjà ${goals} buts marqués !`,
            it: `Ciao ${playerName}! Che bella giornata! Giochiamo a calcio in cortile? Abbiamo fatto ${goals} gol!`,
            zh: `嗨 ${playerName}！今天的阳光真温暖！一起去操场踢足球吧？我们已经进了 ${goals} 个球了！`,
          }),
        },
      ];
    }
    if (who === 'sofia') {
      return [
        {
          who: 'sofia',
          name: 'Sofia',
          mood: 'happy',
          text: pickText(lang, {
            pt: 'A biblioteca está tão tranquila hoje! Sem monstros e sem maldições — só livros e tempo livre.',
            ptBR: 'A biblioteca está tão tranquila hoje! Sem monstros, sem medo — só livros e tempo livre.',
            en: 'The library is so peaceful today! No monsters, no curses—just good books and free time.',
            es: '¡La biblioteca está tan tranquila hoy! Sin monstruos, solo paz y tiempo libre.',
            fr: 'La bibliothèque est si paisible aujourd’hui ! Plus de monstres, juste du temps libre.',
            it: 'La biblioteca è così pacifica oggi! Niente mostri, solo tempo libero.',
            zh: '今天的图书馆真安静！没有怪物和诅咒，只有书香和自由时光。',
          }),
        },
      ];
    }
    return [
      {
        who: 'mariana',
        name: 'Mariana',
        mood: 'happy',
        text: pickText(lang, {
          pt: `Obrigada pela tua amizade, ${playerName}! O meu pé já está ótimo. Aproveita o teu tempo livre pela escola!`,
          ptBR: `Obrigada pela amizade, ${playerName}! Meu pé já sarou. Aproveite o tempo livre pela escola!`,
          en: `Thanks for being a wonderful friend, ${playerName}! My ankle is completely healed. Enjoy free time!`,
          es: `¡Gracias por tu amistad, ${playerName}! Disfruta del tiempo libre por la escuela.`,
          fr: `Merci pour ton amitié, ${playerName} ! Profite bien du temps libre à l’école !`,
          it: `Grazie per la tua amicizia, ${playerName}! Goditi il tempo libero a scuola!`,
          zh: `谢谢你一直以来的陪伴，${playerName}！我的脚已经完全康复了，好好享受自由时光吧！`,
        }),
      },
    ];
  }

  // Horror mode NPCs
  if (who === 'lucas') {
    if (flags.helpedLucas) {
      return [
        {
          who: 'lucas',
          name: 'Lucas',
          mood: 'happy',
          text: pickText(lang, {
            pt: 'Vamos conseguir sair daqui! Quando encontrares a Chave da Saída na Cave, corre para o portão norte!',
            ptBR: 'Vamos sair daqui! Quando achar a Chave da Saída no Porão, corra para o portão norte!',
            en: 'We will make it out! Once you grab the Exit Key in the Basement, head to the north gate!',
            es: '¡Saldremos de aquí! Busca la Llave de Salida en el Sótano.',
            fr: 'On va s’en sortir ! La Clé de Sortie est au sous-sol.',
            it: 'Ce la faremo! La Chiave dell’Uscita è nel seminterrato.',
            zh: '我们一定能逃出去！拿到地下室的大门钥匙后快去北门！',
          }),
        },
      ];
    }
    return [
      {
        who: 'lucas',
        name: 'Lucas',
        mood: 'scared',
        text: pickText(lang, {
          pt: 'Ei! Ainda bem que encontraste esta sala... Aquela criatura bizarra fechou-nos aqui dentro!',
          ptBR: 'Ei! Que bom que você entrou aqui... Aquela criatura bizarra trancou a gente!',
          en: 'Hey! Thank goodness someone else is alive... That bizarre creature trapped us inside!',
          es: '¡Ey! Qué alivio verte... ¡Esa criatura bizarra nos encerró aquí!',
          fr: 'Hé ! Heureusement que tu es là... Cette créature bizarre nous a piégés !',
          it: 'Ehi! Meno male che sei vivo... Quella creatura ci ha intrappolati!',
          zh: '喂！太好了还有其他活人……那个诡异的怪物把我们困在学校里了！',
        }),
      },
      {
        who: 'lucas',
        name: 'Lucas',
        mood: 'normal',
        text: pickText(lang, {
          pt: 'Tenho medo de atravessar o corredor sozinho. Queres juntar-te a mim?',
          ptBR: 'Estou com medo de ir sozinho. Quer formar equipe comigo?',
          en: 'I am terrified to cross the hall alone. Will you team up with me?',
          es: 'Tengo miedo de ir solo. ¿Unimos fuerzas?',
          fr: 'J’ai peur d’y aller seul. On fait équipe ?',
          it: 'Ho paura ad andare da solo. Facciamo squadra?',
          zh: '我不敢一个人穿过走廊，你愿意和我结伴吗？',
        }),
        choices: [
          {
            label: pickText(lang, {
              pt: 'Sim, ficamos juntos!',
              ptBR: 'Sim, vamos juntos!',
              en: 'Yes, we stick together!',
              es: '¡Sí, juntos!',
              fr: 'Oui, ensemble !',
              it: 'Sì, restiamo insieme!',
              zh: '好，我们一起行动！',
            }),
            action: () => {
              onUpdateFlags((prev) => ({ ...prev, helpedLucas: true }));
              onAdvanceChapter(2);
            },
            next: [
              {
                who: 'lucas',
                name: 'Lucas',
                mood: 'happy',
                text: pickText(lang, {
                  pt: 'Obrigado! Ouvi passos pesados vindos da Cave a sul... a Chave da Saída deve estar lá em baixo.',
                  ptBR: 'Valeu! Ouvi passos pesados no Porão ao sul... a Chave da Saída deve estar lá.',
                  en: 'Thank you! I heard heavy footsteps from the Basement to the south... the Exit Key must be down there.',
                  es: '¡Gracias! La Llave de Salida debe estar en el Sótano al sur.',
                  fr: 'Merci ! La Clé de Sortie doit être au sous-sol au sud.',
                  it: 'Grazie! La Chiave dell’Uscita deve essere nel seminterrato a sud.',
                  zh: '谢谢！我听到南边地下室有沉重的脚步声……大门钥匙一定在那里。',
                }),
              },
            ],
          },
          {
            label: pickText(lang, {
              pt: 'Cada um por si.',
              ptBR: 'Cada um por si.',
              en: 'Every person for themselves.',
              es: 'Cada uno por su cuenta.',
              fr: 'Chacun pour soi.',
              it: 'Ognuno per sé.',
              zh: '各自行动吧。',
            }),
            action: () => {
              onUpdateFlags((prev) => ({ ...prev, betrayal: prev.betrayal + 1 }));
              onAdvanceChapter(2);
            },
            next: [
              {
                who: 'lucas',
                name: 'Lucas',
                mood: 'scared',
                text: pickText(lang, {
                  pt: 'O quê...? Tudo bem... boa sorte sozinho.',
                  ptBR: 'Sério...? Tudo bem... boa sorte sozinho.',
                  en: 'What...? Alright... good luck on your own.',
                  es: '¿Qué...? Buena suerte solo.',
                  fr: 'Quoi... Bonne chance alors.',
                  it: 'Cosa...? Buona fortuna da solo.',
                  zh: '什么……好吧，祝你好运。',
                }),
              },
            ],
          },
        ],
      },
    ];
  }

  if (who === 'sofia') {
    if (flags.trustedSofia) {
      return [
        {
          who: 'sofia',
          name: 'Sofia',
          mood: 'happy',
          text: pickText(lang, {
            pt: 'Com o fusível restaurámos parte da energia! Se procura o Amuleto Antigo, olha para o Pátio.',
            ptBR: 'Com o fusível restauramos parte da energia! Procure o Amuleto Antigo no Pátio.',
            en: 'With the fuse, part of the power is back! Check the Courtyard for the Ancient Amulet.',
            es: '¡Con el fusible volvió parte de la luz! Busca el Amuleto en el Patio.',
            fr: 'Avec le fusible, la lumière revient ! Cherche l’Amulette dans la Cour.',
            it: 'Con il fusibile torna un po’ di luce! Cerca l’Amuleto in Cortile.',
            zh: '装上保险丝后恢复了部分电力！快去操场找古老护身符。',
          }),
        },
      ];
    }
    const hasFuse = inventory.includes('fuse');
    return [
      {
        who: 'sofia',
        name: 'Sofia',
        mood: 'normal',
        text: pickText(lang, {
          pt: 'Shh! Encontrei registos sobre a maldição desta escola. Preciso de um Fusível para reativar o quadro elétrico.',
          ptBR: 'Shh! Achei registros sobre a maldição da escola. Preciso de um Fusível para ligar o painel.',
          en: 'Shh! I found records about the school curse. I need a Fuse to restore the breaker panel.',
          es: '¡Shh! Necesito un Fusible para reactivar el panel eléctrico.',
          fr: 'Chut ! Il me faut un Fusible pour relancer le panneau électrique.',
          it: 'Shh! Mi serve un Fusibile per riattivare la corrente.',
          zh: '嘘！我找到了校园诅咒的记录，需要一枚保险丝来重启电闸。',
        }),
      },
      ...(hasFuse
        ? [
            {
              who: 'sofia' as const,
              name: 'Sofia',
              mood: 'happy' as const,
              text: pickText(lang, {
                pt: 'Tens um Fusível contigo! Partilhas comigo para ajudar todos a escapar?',
                ptBR: 'Você tem um Fusível! Vai compartilhar para ajudar todos?',
                en: 'You have a Fuse! Will you share it so everyone has a better chance?',
                es: '¡Tienes un Fusible! ¿Me lo das para ayudar a todos?',
                fr: 'Tu as un Fusible ! Tu le partages pour aider tout le monde ?',
                it: 'Hai un Fusibile! Lo condividi per aiutare tutti?',
                zh: '你有保险丝！能交给我来帮助大家吗？',
              }),
              choices: [
                {
                  label: pickText(lang, { pt: 'Entregar Fusível', ptBR: 'Entregar Fusível', en: 'Give Fuse', es: 'Dar Fusible', fr: 'Donner', it: 'Dai Fusibile', zh: '交给她' }),
                  action: () => onUpdateFlags((prev) => ({ ...prev, trustedSofia: true, restoredPower: true })),
                },
                {
                  label: pickText(lang, { pt: 'Guardar para mim', ptBR: 'Guardar para mim', en: 'Keep it', es: 'Guardarlo', fr: 'Garder', it: 'Tienilo', zh: '自己留着' }),
                  action: () => onUpdateFlags((prev) => ({ ...prev, betrayal: prev.betrayal + 1 })),
                },
              ],
            },
          ]
        : []),
    ];
  }

  // Mariana
  if (flags.savedMariana) {
    return [
      {
        who: 'mariana',
        name: 'Mariana',
        mood: 'happy',
        text: pickText(lang, {
          pt: 'O meu pé já está muito melhor graças a ti! Encontra a Chave da Saída e vamos sair juntos!',
          ptBR: 'Meu pé já está bem melhor graças a você! Vamos sair daqui juntos!',
          en: 'My ankle feels much better thanks to you! Let us find the Exit Key and escape together!',
          es: '¡Mi tobillo está mucho mejor gracias a ti!',
          fr: 'Ma cheville va beaucoup mieux grâce à toi !',
          it: 'La mia caviglia sta molto meglio grazie a te!',
          zh: '多亏了你，我的脚好多了！快找到大门钥匙一起逃出去吧！',
        }),
      },
    ];
  }

  const hasMed = inventory.includes('medkit');
  return [
    {
      who: 'mariana',
      name: 'Mariana',
      mood: 'scared',
      text: pickText(lang, {
        pt: 'Agh... torci o tornozelo a fugir daquela coisa! Não consigo correr sem ajuda...',
        ptBR: 'Ai... torci o tornozelo fugindo daquela coisa! Não consigo correr sem ajuda...',
        en: 'Ugh... I sprained my ankle running from that thing! I cannot run without help...',
        es: '¡Agh! Me torcí el tobillo huyendo de esa cosa...',
        fr: 'Aïe... Je me suis tordu la cheville en fuyant cette chose...',
        it: 'Ahi... Mi sono slogata la caviglia scappando...',
        zh: '唔……逃跑时我扭伤脚踝了，没有帮助我根本走不了……',
      }),
    },
    ...(hasMed
      ? [
          {
            who: 'mariana' as const,
            name: 'Mariana',
            mood: 'scared' as const,
            text: pickText(lang, {
              pt: 'Tens um Kit Médico! O que decides fazer?',
              ptBR: 'Você tem um Kit Médico! O que decide fazer?',
              en: 'You have a Medkit! What will you do?',
              es: '¡Tienes un Botiquín! ¿Qué decides hacer?',
              fr: 'Tu as une Trousse de Soin ! Que décides-tu ?',
              it: 'Hai un Kit Medico! Cosa decidi di fare?',
              zh: '你有急救箱！你决定怎么做？',
            }),
            choices: [
              {
                label: pickText(lang, { pt: 'Curar Mariana', ptBR: 'Curar Mariana', en: 'Heal Mariana', es: 'Curar a Mariana', fr: 'Soigner Mariana', it: 'Cura Mariana', zh: '救治玛丽安娜' }),
                action: () => onUpdateFlags((prev) => ({ ...prev, savedMariana: true })),
              },
              {
                label: pickText(lang, { pt: 'Deixá-la como distração', ptBR: 'Deixá-la como distração', en: 'Leave her as bait', es: 'Dejarla como señuelo', fr: 'L’utiliser comme appât', it: 'Usala come esca', zh: '把她留作诱饵' }),
                action: () => onUpdateFlags((prev) => ({ ...prev, betrayal: prev.betrayal + 2, usedDistraction: true })),
              },
            ],
          },
        ]
      : []),
  ];
}

export function getAltarLines(ctx: StoryContext): DialogueLine[] {
  const { lang, inventory, flags, onTriggerEnding } = ctx;
  const hasTruth = inventory.includes('diary1') && inventory.includes('diary2') && inventory.includes('amulet');
  if (!hasTruth) {
    return [
      {
        who: 'narrator',
        name: 'ALTAR',
        text: pickText(lang, {
          pt: '* Um altar de pedra sombrio com 3 ranhuras vazias: duas para Diários Rasgados e uma para um Amuleto Antigo...',
          ptBR: '* Um altar sombrio com 3 espaços vazios: dois para Diários Rasgados e um para o Amuleto Antigo...',
          en: '* A dark stone altar with 3 empty slots: two for Torn Diaries and one for an Ancient Amulet...',
          es: '* Un altar oscuro con 3 huecos vacíos: 2 Diarios y 1 Amuleto Antiguo...',
          fr: '* Un autel sombre avec 3 emplacements vides : 2 Journaux et 1 Amulette...',
          it: '* Un altare oscuro con 3 fessure vuote: 2 Diari e 1 Amuleto Antico...',
          zh: '* 一座阴森的石制祭坛，上面有三个凹槽：两本残破日记与一枚古老护身符……',
        }),
      },
    ];
  }

  return [
    {
      who: 'narrator',
      name: 'ALTAR',
      text: pickText(lang, {
        pt: '* Os dois Diários Rasgados e o Amuleto Antigo brilham intensamente!\n* O espírito da escola revela a sua dor. Como vais encerrar a maldição?',
        ptBR: '* Os dois Diários e o Amuleto Antigo brilham intensamente!\n* O espírito revela sua dor. Como vai encerrar a maldição?',
        en: '* Both Torn Diaries and the Ancient Amulet glow brightly!\n* The school spirit reveals its sorrow. How will you end the curse?',
        es: '* ¡Los Diarios y el Amuleto brillan! ¿Cómo cerrarás la maldición?',
        fr: '* Les Journaux et l’Amulette brillent ! Comment briser la malédiction ?',
        it: '* I Diari e l’Amuleto brillano! Come spezzare la maledizione?',
        zh: '* 两本日记和古老护身符发出耀眼的光芒！\n* 校园幽灵向你倾诉了痛苦，你打算如何终结这场诅咒？',
      }),
      choices: [
        {
          label: pickText(lang, { pt: 'Selar a Maldição (Final 6)', ptBR: 'Selar a Maldição (Final 6)', en: 'Seal the Curse (Ending 6)', es: 'Sellar Maldición (Final 6)', fr: 'Sceller (Fin 6)', it: 'Sigilla (Finale 6)', zh: '封印诅咒（结局6）' }),
          action: () => onTriggerEnding(6),
        },
        ...(flags.betrayal === 0
          ? [
              {
                label: pickText(lang, {
                  pt: 'Perdoar e Libertar em Paz (Final Secreto)',
                  ptBR: 'Perdoar e Libertar em Paz (Final Secreto)',
                  en: 'Forgive & Free in Peace (Secret Ending)',
                  es: 'Liberar en Paz (Final Secreto)',
                  fr: 'Libérer en Paix (Fin Secrète)',
                  it: 'Libera in Pace (Finale Segreto)',
                  zh: '宽恕并超度亡灵（隐藏结局）',
                }),
                action: () => onTriggerEnding(7),
              },
            ]
          : []),
      ],
    },
  ];
}

export function getExitGateLines(ctx: StoryContext): DialogueLine[] {
  const { lang, peaceful, inventory, flags, onTriggerEnding, onReturnToMenu } = ctx;

  if (peaceful) {
    return [
      {
        who: 'narrator',
        name: 'EXIT',
        text: pickText(lang, {
          pt: 'Queres terminar o Tempo Livre e regressar ao Menu Inicial?',
          ptBR: 'Quer encerrar o Tempo Livre e voltar ao Menu Inicial?',
          en: 'End Free Time and return to the Main Menu?',
          es: '¿Terminar el Tiempo Libre y volver al Menú?',
          fr: 'Quitter le Temps Libre et revenir au Menu ?',
          it: 'Terminare il Tempo Libero e tornare al Menu?',
          zh: '要结束自由时光并返回主菜单吗？',
        }),
        choices: [
          { label: pickText(lang, { pt: 'Voltar ao Menu', ptBR: 'Voltar ao Menu', en: 'Main Menu', es: 'Menú', fr: 'Menu', it: 'Menu', zh: '返回主菜单' }), action: onReturnToMenu },
          { label: pickText(lang, { pt: 'Continuar aqui', ptBR: 'Ficar na escola', en: 'Stay', es: 'Quedarse', fr: 'Rester', it: 'Resta', zh: '继续留在这里' }), action: () => {} },
        ],
      },
    ];
  }

  if (!inventory.includes('exitKey')) {
    return [
      {
        who: 'narrator',
        name: 'EXIT',
        text: pickText(lang, {
          pt: '* O portão principal está trancado com correntes pesadas.\n* Precisas da Chave da Saída (procura na Cave Oculta a sul!).',
          ptBR: '* O portão principal está trancado.\n* Você precisa da Chave da Saída (procure no Porão ao sul!).',
          en: '* The main gate is locked with heavy chains.\n* You need the Exit Key (search the Hidden Basement to the south!).',
          es: '* La puerta está cerrada. Necesitas la Llave de Salida (en el Sótano al sur).',
          fr: '* Le portail est verrouillé. Trouve la Clé de Sortie au sous-sol au sud !',
          it: '* Il cancello è bloccato. Cerca la Chiave dell’Uscita nel seminterrato a sud!',
          zh: '* 大门被沉重的铁链锁住了。\n* 你需要大门钥匙（去南边的秘密地下室寻找！）。',
        }),
      },
    ];
  }

  const savedAll = flags.helpedLucas && flags.trustedSofia && flags.savedMariana;
  return [
    {
      who: 'narrator',
      name: 'EXIT',
      text: pickText(lang, {
        pt: '* A Chave da Saída encaixa na fechadura! A criatura aproxima-se rapidamente atrás de ti!',
        ptBR: '* A Chave da Saída encaixou! A criatura está vindo rápido atrás de você!',
        en: '* The Exit Key fits the lock! The creature charges behind you!',
        es: '* ¡La llave encaja! ¡La criatura se acerca detrás de ti!',
        fr: '* La clé fonctionne ! La créature fonce droit sur toi !',
        it: '* La chiave gira! La creatura ti sta raggiungendo!',
        zh: '* 大门钥匙插进了锁孔！背后的怪物正在狂奔而来！',
      }),
      choices: [
        ...(savedAll
          ? [
              {
                label: pickText(lang, { pt: 'Escapar com Todos! (Final 2)', ptBR: 'Escapar com Todos! (Final 2)', en: 'Escape Together! (Ending 2)', es: '¡Escapar Juntos! (Final 2)', fr: 'Fuir Ensemble ! (Fin 2)', it: 'Fuga Insieme! (Finale 2)', zh: '大家一起逃脱！（结局2）' }),
                action: () => onTriggerEnding(2),
              },
            ]
          : []),
        {
          label: pickText(lang, {
            pt: flags.betrayal > 0 ? 'Fugir Sozinho (Final 4)' : 'Fugir Imediatamente (Final 1)',
            ptBR: flags.betrayal > 0 ? 'Fugir Sozinho (Final 4)' : 'Fugir Imediatamente (Final 1)',
            en: flags.betrayal > 0 ? 'Flee Alone (Ending 4)' : 'Escape Immediately (Ending 1)',
            es: flags.betrayal > 0 ? 'Huir Solo (Final 4)' : 'Huir Ahora (Final 1)',
            fr: flags.betrayal > 0 ? 'Fuir Seul (Fin 4)' : 'Fuir Maintenant (Fin 1)',
            it: flags.betrayal > 0 ? 'Fuggi da Solo (Finale 4)' : 'Scappa Subito (Finale 1)',
            zh: flags.betrayal > 0 ? '独自逃生（结局4）' : '立刻逃跑（结局1）',
          }),
          action: () => onTriggerEnding(flags.betrayal > 0 ? 4 : 1),
        },
        {
          label: pickText(lang, { pt: 'Ficar para Atrasar a Criatura (Final 3)', ptBR: 'Ficar para Atrasar a Criatura (Final 3)', en: 'Hold the Creature Back (Ending 3)', es: 'Sacrificarse (Final 3)', fr: 'Se Sacrifier (Fin 3)', it: 'Sacrificarsi (Finale 3)', zh: '留下来引开怪物（结局3）' }),
          action: () => onTriggerEnding(3),
        },
      ],
    },
  ];
}
