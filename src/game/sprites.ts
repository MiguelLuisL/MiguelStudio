import { Gender, PortraitMood, RoomObstacle, SpeakerId } from '../types/game';

export function drawCharacterSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  gender: Gender,
  dir: 'up' | 'down' | 'left' | 'right',
  frame: number,
  scared = false,
  npcType: 'lucas' | 'sofia' | 'mariana' | null = null
) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  const bob = frame % 2 === 1 ? -1.5 : 0;

  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 14, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  let hair = gender === 'F' ? '#7c2d12' : '#1e293b';
  let shirt = gender === 'F' ? '#be123c' : '#1d4ed8';
  const skin = '#fed7aa';

  if (npcType === 'lucas') {
    hair = '#ca8a04';
    shirt = '#15803d';
  } else if (npcType === 'sofia') {
    hair = '#4c1d95';
    shirt = '#7e22ce';
  } else if (npcType === 'mariana') {
    hair = '#9a3412';
    shirt = '#0f766e';
  }

  ctx.fillStyle = '#0f172a';
  const step = frame % 2 === 1 ? 2 : 0;
  ctx.fillRect(-6, 5 + step, 5, 8);
  ctx.fillRect(1, 5 - step, 5, 8);

  ctx.fillStyle = shirt;
  ctx.fillRect(-8, -6 + bob, 16, 12);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-3, -6 + bob, 6, 4);

  ctx.fillStyle = skin;
  ctx.fillRect(-7, -18 + bob, 14, 12);

  ctx.fillStyle = hair;
  ctx.fillRect(-8, -21 + bob, 16, 6);
  if (gender === 'F' || npcType === 'sofia' || npcType === 'mariana') {
    ctx.fillRect(-8, -16 + bob, 3, 11);
    ctx.fillRect(5, -16 + bob, 3, 11);
  }

  if (dir !== 'up') {
    const ex = dir === 'left' ? -5 : dir === 'right' ? 1 : -4;
    if (scared) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ex, -14 + bob, 3, 4);
      ctx.fillRect(ex + 5, -14 + bob, 3, 4);
      ctx.fillStyle = '#09090b';
      ctx.fillRect(ex + 1, -13 + bob, 1, 2);
      ctx.fillRect(ex + 6, -13 + bob, 1, 2);
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(-2, -9 + bob, 4, 2);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ex, -13 + bob, 2, 3);
      ctx.fillRect(ex + 5, -13 + bob, 2, 3);
    }
  }
  ctx.restore();
}

export function drawMonsterSprite(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  const jx = (Math.random() - 0.5) * 3.5;
  const jy = Math.sin(t * 0.011) * 3;

  ctx.fillStyle = 'rgba(185, 28, 28, 0.25)';
  ctx.beginPath();
  ctx.arc(0, 0, 26 + Math.sin(t * 0.02) * 3, 0, Math.PI * 2);
  ctx.fill();

  // Jagged shadowy limbs
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-12 + jx, -12 + jy);
  ctx.lineTo(-22 + jx, 6 + Math.sin(t * 0.02) * 5);
  ctx.moveTo(12 + jx, -12 + jy);
  ctx.lineTo(22 + jx, 6 + Math.cos(t * 0.02) * 5);
  ctx.stroke();

  // Tall distorted torso & head
  ctx.fillStyle = '#050507';
  ctx.fillRect(-11 + jx, -26 + jy, 22, 42);
  ctx.fillRect(-14 + jx, -16 + jy, 28, 12);

  // Crimson eyes
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-6 + jx, -19 + jy, 4, 5);
  ctx.fillRect(3 + jx, -19 + jy, 4, 5);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-5 + jx, -17 + jy, 1, 2);
  ctx.fillRect(4 + jx, -17 + jy, 1, 2);

  // Grin
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-6 + jx, -9 + jy, 12, 3);
  ctx.fillStyle = '#000000';
  ctx.fillRect(-3 + jx, -9 + jy, 2, 3);
  ctx.fillRect(2 + jx, -9 + jy, 2, 3);

  ctx.restore();
}

export function drawObstacle(ctx: CanvasRenderingContext2D, o: RoomObstacle, peaceful: boolean) {
  if (o.kind === 'goal') {
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(o.x, o.y, o.w, o.h);
    return;
  }

  if (o.kind === 'bookshelf') {
    ctx.fillStyle = peaceful ? '#78350f' : '#2d1e2f';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(o.x, o.y, o.w, o.h);
    // Book spines
    const colors = ['#ef4444', '#eab308', '#3b82f6', '#10b981'];
    for (let bx = o.x + 4; bx < o.x + o.w - 6; bx += 8) {
      for (let by = o.y + 6; by < o.y + o.h - 10; by += 18) {
        ctx.fillStyle = colors[(bx + by) % colors.length];
        ctx.fillRect(bx, by, 5, 11);
      }
    }
    return;
  }

  if (o.kind === 'bed') {
    ctx.fillStyle = '#334155';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = peaceful ? '#f8fafc' : '#cbd5e1';
    ctx.fillRect(o.x + 4, o.y + 4, o.w - 8, o.h - 8);
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(o.x + 6, o.y + 6, 18, o.h - 12);
    return;
  }

  if (o.kind === 'locker') {
    ctx.fillStyle = peaceful ? '#64748b' : '#272936';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.strokeRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(o.x + 18, o.y, 2, o.h);
    ctx.fillRect(o.x + 36, o.y, 2, o.h);
    return;
  }

  if (o.kind === 'pillar') {
    ctx.fillStyle = peaceful ? '#64748b' : '#26141d';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.strokeStyle = peaceful ? '#94a3b8' : '#7f1d1d';
    ctx.lineWidth = 2;
    ctx.strokeRect(o.x, o.y, o.w, o.h);
    return;
  }

  // Desk
  ctx.fillStyle = peaceful ? '#92400e' : '#352b28';
  ctx.fillRect(o.x, o.y, o.w, o.h);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(o.x, o.y, o.w, o.h);
}

export function drawPortrait(
  canvas: HTMLCanvasElement,
  who: SpeakerId,
  mood: PortraitMood,
  playerGender: Gender
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, 40, 40);
  ctx.fillStyle = mood === 'scared' ? '#2c0a14' : '#11101d';
  ctx.fillRect(0, 0, 40, 40);

  if (who === 'monster') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(8, 4, 24, 34);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(12, 13, 5, 6);
    ctx.fillRect(23, 13, 5, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 26, 16, 4);
    return;
  }

  if (who === 'narrator') {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, 24, 24);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(18, 13, 4, 9);
    ctx.fillRect(18, 25, 4, 4);
    return;
  }

  let hair = '#1e293b';
  let shirt = '#1d4ed8';
  let isF = false;

  if (who === 'player') {
    isF = playerGender === 'F';
    hair = isF ? '#7c2d12' : '#1e293b';
    shirt = isF ? '#be123c' : '#1d4ed8';
  } else if (who === 'lucas') {
    hair = '#ca8a04';
    shirt = '#15803d';
  } else if (who === 'sofia') {
    hair = '#4c1d95';
    shirt = '#7e22ce';
    isF = true;
  } else if (who === 'mariana') {
    hair = '#9a3412';
    shirt = '#0f766e';
    isF = true;
  }

  ctx.fillStyle = shirt;
  ctx.fillRect(8, 28, 24, 12);
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(11, 10, 18, 18);
  ctx.fillStyle = hair;
  ctx.fillRect(9, 6, 22, 7);
  if (isF) {
    ctx.fillRect(9, 12, 4, 15);
    ctx.fillRect(27, 12, 4, 15);
  }

  ctx.fillStyle = mood === 'scared' ? '#ffffff' : '#0f172a';
  ctx.fillRect(14, 17, 3, mood === 'scared' ? 4 : 3);
  ctx.fillRect(23, 17, 3, mood === 'scared' ? 4 : 3);
  if (mood === 'scared') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(15, 18, 1, 2);
    ctx.fillRect(24, 18, 1, 2);
    ctx.fillRect(17, 24, 6, 3);
  } else if (mood === 'happy') {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(16, 24, 8, 2);
  } else {
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(17, 24, 6, 2);
  }
}
