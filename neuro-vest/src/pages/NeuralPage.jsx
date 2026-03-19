import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { fakeChartEEG } from '../api';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
        {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
      </div>
    );
  }
  return null;
};

const ONDAS = [
  { key: 'eegDelta', label: 'Delta', faixa: '0.5–4 Hz', valor: 22, cor: '#7c4dff', descricao: 'Sono profundo, recuperação' },
  { key: 'eegTheta', label: 'Theta', faixa: '4–8 Hz', valor: 18, cor: '#00e5ff', descricao: 'Relaxamento, sonolência' },
  { key: 'eegAlpha', label: 'Alpha', faixa: '8–13 Hz', valor: 35, cor: '#00e676', descricao: 'Relaxamento alerta (dominante)' },
  { key: 'eegBeta', label: 'Beta', faixa: '13–30 Hz', valor: 25, cor: '#ff9100', descricao: 'Cognição, concentração' },
  { key: 'eegGamma', label: 'Gamma', faixa: '30–80 Hz', valor: 8, cor: '#ff1744', descricao: 'Processamento avançado' },
];

export default function NeuralPage() {
  const [chartEEG, setChartEEG] = useState(fakeChartEEG);
  const [nirsData, setNirsData] = useState(
    Array.from({ length: 20 }, (_, i) => ({ t: i, hbo2: 65 + Math.round(Math.random() * 8), hb: 18 + Math.round(Math.random() * 5) }))
  );

  useEffect(() => {
    const t = setInterval(() => {
      setChartEEG(prev => [...prev.slice(1), {
        t: prev[prev.length - 1].t + 1,
        delta: 18 + Math.round(Math.random() * 10),
        alpha: 30 + Math.round(Math.random() * 12),
        beta: 18 + Math.round(Math.random() * 10),
      }]);
      setNirsData(prev => [...prev.slice(1), {
        t: prev[prev.length - 1].t + 1,
        hbo2: 63 + Math.round(Math.sin(Date.now() / 2000) * 5 + Math.random() * 4),
        hb: 16 + Math.round(Math.random() * 5),
      }]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const radarData = ONDAS.map(o => ({ onda: o.label, valor: o.valor }));

  return (
    <div>
      {/* Status cerebral */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Oxig. Cerebral (fNIRS)', value: '68%', ok: true, color: 'var(--accent-purple)' },
          { label: 'Fluxo Sanguíneo Cerebral', value: '62%', ok: true, color: 'var(--accent-blue)' },
          { label: 'Índice Alfa/Beta', value: '1.4', ok: true, color: 'var(--accent-green)' },
          { label: 'Risco Neural IA', value: '38%', ok: true, color: 'var(--accent-cyan)' },
        ].map(m => (
          <div className="col-6 col-md-3" key={m.label}>
            <div className="metric-card" style={{ borderTop: `2px solid ${m.color}` }}>
              <div className="metric-label">{m.label}</div>
              <div className="metric-value" style={{ fontSize: 28, color: m.color }}>{m.value}</div>
              <div className="metric-status badge-normal mt-2"><i className="bi bi-check-circle me-1"></i>Normal</div>
            </div>
          </div>
        ))}
      </div>

      {/* Ondas cerebrais */}
      <div className="section-header">Bandas EEG — Distribuição de Frequências</div>
      <div className="row g-3 mb-4">
        {ONDAS.map(o => (
          <div className="col-6 col-md" key={o.key}>
            <div className="card-dark h-100 text-center">
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{o.faixa}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: o.cor, fontFamily: 'var(--font-mono)' }}>{o.valor}<span style={{ fontSize: 14 }}>%</span></div>
              <div style={{ fontWeight: 600, fontSize: 14, color: o.cor, marginBottom: 4 }}>{o.label}</div>
              <div className="risk-bar">
                <div className="risk-fill" style={{ width: `${o.valor}%`, background: o.cor }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>{o.descricao}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        {/* EEG tempo real */}
        <div className="col-12 col-lg-7">
          <div className="card-dark h-100">
            <div className="section-header">EEG — Bandas em Tempo Real</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartEEG}>
                <XAxis dataKey="t" hide />
                <YAxis domain={[0, 60]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="delta" stroke="#7c4dff" strokeWidth={2} dot={false} name="Delta (%)" />
                <Line type="monotone" dataKey="alpha" stroke="#00e676" strokeWidth={2} dot={false} name="Alpha (%)" />
                <Line type="monotone" dataKey="beta" stroke="#ff9100" strokeWidth={2} dot={false} name="Beta (%)" />
              </LineChart>
            </ResponsiveContainer>
            <div className="d-flex gap-3 mt-2" style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>
              <span><span style={{ color: '#7c4dff' }}>─</span> Delta</span>
              <span><span style={{ color: '#00e676' }}>─</span> Alpha</span>
              <span><span style={{ color: '#ff9100' }}>─</span> Beta</span>
            </div>
          </div>
        </div>

        {/* Radar */}
        <div className="col-12 col-lg-5">
          <div className="card-dark h-100">
            <div className="section-header">Perfil Neural (Radar)</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="onda" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Radar name="EEG" dataKey="valor" stroke="var(--accent-purple)" fill="var(--accent-purple)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* fNIRS */}
        <div className="col-12">
          <div className="card-dark">
            <div className="section-header">fNIRS — Oxigenação Cerebral Regional</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
              HbO₂ (oxihemoglobina) e Hb (desoxihemoglobina) — região pré-frontal
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={nirsData}>
                <defs>
                  <linearGradient id="hbo2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-red)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-red)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" hide />
                <YAxis domain={[0, 90]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="hbo2" stroke="var(--accent-red)" fill="url(#hbo2Grad)" strokeWidth={2} name="HbO₂ (%)" />
                <Line type="monotone" dataKey="hb" stroke="var(--accent-blue)" strokeWidth={2} dot={false} name="Hb (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
