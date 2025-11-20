'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { buildExportHtml, buildTheme, Theme, toTitle } from '../lib/vibe';
import Image from 'next/image';

function download(filename: string, text: string) {
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/html;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export default function Generator() {
  const [vibe, setVibe] = useState('neon cyberpunk nightlife');
  const theme = useMemo<Theme>(() => buildTheme(vibe), [vibe]);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.colors.primary);
  }, [theme.colors.primary]);

  return (
    <div className="container">
      <div className="grid">
        <aside className="card" style={{ padding: 16 }}>
          <div className="badge" style={{ marginBottom: 12 }}>
            <span>Vibe Rocket</span>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--primary)' }} />
          </div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
            Describe your vibe
          </label>
          <textarea
            className="input"
            rows={4}
            value={vibe}
            onChange={e => setVibe(e.target.value)}
            placeholder="e.g., warm artisanal coffeehouse, cozy, vintage, intimate"
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => setVibe(vibe.trim())}>
              Generate
            </button>
            <button
              className="btn secondary"
              onClick={() => download(`${toTitle(theme.name).replace(/\s+/g, '-')}.html`, buildExportHtml(theme))}
            >
              Export HTML
            </button>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Palette</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                ['Primary', theme.colors.primary],
                ['Secondary', theme.colors.secondary],
                ['Accent', theme.colors.accent]
              ].map(([label, color]) => (
                <div key={label} style={{ flex: 1 }}>
                  <div
                    className="card"
                    style={{
                      height: 42,
                      borderColor: 'rgba(255,255,255,0.2)',
                      background: String(color)
                    }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                    {label}: {color}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="preview-surface" ref={previewRef}>
          <div
            style={{
              background: theme.patternGradient
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: 28 }}>
                <div className="badge" style={{ marginBottom: 12, borderColor: 'rgba(255,255,255,0.2)' }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: theme.colors.primary,
                      boxShadow: '0 0 24px rgba(255,255,255,0.35)'
                    }}
                  />
                  <span>Vibe: {theme.name}</span>
                </div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 40,
                    lineHeight: 1.1,
                    fontFamily: 'var(--font-serif)'
                  }}
                >
                  {theme.title}
                </h1>
                <p style={{ marginTop: 10, color: 'var(--muted)', maxWidth: 640 }}>{theme.tagline}</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button className="btn">Get Started</button>
                  <button className="btn secondary">Learn More</button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 12,
                    marginTop: 16
                  }}
                >
                  {['Tailored Palette', 'Elegant Typography', 'Instant Export'].map((t, i) => (
                    <div key={t} className="card" style={{ padding: 16 }}>
                      <div style={{ fontWeight: 700 }}>{t}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>
                        {i === 0 && 'Colors derived from your vibe.'}
                        {i === 1 && 'A pairing that fits your mood.'}
                        {i === 2 && 'Download a ready-to-ship HTML file.'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ position: 'relative', height: 280 }}>
                <Image
                  src={theme.heroImage}
                  alt="Hero"
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="footer">Generated with Vibe Rocket ? Seed {theme.seed}</div>
    </div>
  );
}

