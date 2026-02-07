const PARTICLES = [
  { left: '8%',  size: 5,   dur: '14s', delay: '0s',   travel: '-85vh', sway: '18px',  opacity: 0.5,  color: 'rgba(240,180,41,0.8)' },
  { left: '22%', size: 3.5, dur: '18s', delay: '-4s',  travel: '-90vh', sway: '-12px', opacity: 0.4,  color: 'rgba(251,216,114,0.7)' },
  { left: '35%', size: 4,   dur: '16s', delay: '-8s',  travel: '-80vh', sway: '22px',  opacity: 0.45, color: 'rgba(240,180,41,0.7)' },
  { left: '48%', size: 3.5, dur: '20s', delay: '-2s',  travel: '-92vh', sway: '-16px', opacity: 0.35, color: 'rgba(255,255,255,0.5)' },
  { left: '62%', size: 5,   dur: '15s', delay: '-10s', travel: '-88vh', sway: '14px',  opacity: 0.5,  color: 'rgba(240,180,41,0.8)' },
  { left: '75%', size: 3.5, dur: '19s', delay: '-6s',  travel: '-82vh', sway: '-20px', opacity: 0.4,  color: 'rgba(224,64,160,0.5)' },
  { left: '88%', size: 4,   dur: '17s', delay: '-12s', travel: '-86vh', sway: '10px',  opacity: 0.45, color: 'rgba(251,216,114,0.6)' },
  { left: '15%', size: 3.5, dur: '22s', delay: '-7s',  travel: '-78vh', sway: '-8px',  opacity: 0.3,  color: 'rgba(255,255,255,0.4)' },
  { left: '55%', size: 3,   dur: '21s', delay: '-14s', travel: '-84vh', sway: '25px',  opacity: 0.35, color: 'rgba(240,180,41,0.6)' },
  { left: '42%', size: 3.5, dur: '16s', delay: '-3s',  travel: '-90vh', sway: '-14px', opacity: 0.4,  color: 'rgba(251,216,114,0.5)' },
  { left: '92%', size: 3,   dur: '23s', delay: '-9s',  travel: '-76vh', sway: '12px',  opacity: 0.3,  color: 'rgba(224,64,160,0.4)' },
  { left: '5%',  size: 3.5, dur: '19s', delay: '-15s', travel: '-88vh', sway: '-18px', opacity: 0.35, color: 'rgba(240,180,41,0.5)' },
];

export function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            bottom: '0%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            '--particle-duration': p.dur,
            '--particle-delay': p.delay,
            '--particle-travel': p.travel,
            '--particle-sway': p.sway,
            '--particle-peak-opacity': p.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
