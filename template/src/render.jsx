import React from 'react';
import { CONFIG } from './config.js';
import { AI_PRESETS } from './ai.js';

const SERIF = "'Noto Serif SC', serif";

// warm paper palette (matches the original artifact)
const C = {
  page: '#E9E3D5', sheet: '#F8F5EF', aside: '#FBF9F3',
  ink: '#2B2A27', body: '#4a4740', sub: '#8A857B', faint: '#9b978d',
  accent: '#C2663F', accentDark: '#a9542f',
  line: '#E4DECF', line2: '#EFEADD', cardBorder: '#EAE2D2',
};

// ---------- small building blocks ----------
function Field(self, path, value, ph, opts = {}) {
  const { multiline, rows = 2, style } = opts;
  const common = {
    className: 'bb-inline', 'data-field': path, value: value || '',
    onChange: self.onField, placeholder: ph,
    style: { fontFamily: 'inherit', ...style },
  };
  return multiline ? <textarea {...common} rows={rows} /> : <input {...common} />;
}

function SecHead({ onClick, title, link }) {
  return (
    <button className="bb-link" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, margin: '0 0 14px', color: C.ink }}>
      <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 21, margin: 0 }}>{title}</h2>
      <span style={{ color: C.accent, fontSize: 18 }}>›</span>
      {link ? <span style={{ fontSize: 12, color: C.faint, fontWeight: 500 }}>{link}</span> : null}
    </button>
  );
}

function Label({ children, style }) {
  return <h3 style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: C.faint, fontWeight: 600, margin: '0 0 12px', ...style }}>{children}</h3>;
}

function AIInline({ self, k }) {
  const a = self.state.ai[k] || {};
  const t = self.L[self.state.lang];
  if (a.busy) return <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, fontSize: 14, color: C.sub }}><span className="ai-spin" />{t.generating}</div>;
  if (!a.text) return null;
  return <div style={{ marginTop: 16, background: '#fff', border: '1px solid ' + C.cardBorder, borderRadius: 10, padding: '16px 18px', fontSize: 14, lineHeight: 1.8, color: '#3a3833' }}>{self.mdEl(self.cleanMd(a.text))}</div>;
}

function aiBtn(label, onClick) {
  return <button className="bb-aibtn" onClick={onClick} style={{ fontSize: 13, fontWeight: 600, padding: '9px 16px', borderRadius: 10, border: '1px solid #D9CFB9', background: '#fff', color: C.ink, cursor: 'pointer' }}>{label}</button>;
}
function primaryBtn(label, onClick, extra) {
  return <button className="bb-primary" onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, padding: '9px 16px', borderRadius: 10, border: 'none', background: C.accent, color: '#fff', cursor: 'pointer', ...extra }}>{label}</button>;
}
function xBtn(onClick, size = 22) {
  return <button className="bb-x" onClick={onClick} style={{ width: size, height: size, borderRadius: '50%', border: 'none', background: 'transparent', color: '#C0B8A7', cursor: 'pointer', fontSize: 15, justifySelf: 'end', flex: 'none' }}>×</button>;
}

// ================= HOME =================
function Home(self, v) {
  const t = v.t, today = v.today, tp = v.tp, lang = self.state.lang;
  const S = self.settings.sections, st = self.settings;
  return (
    <>
      {/* header band */}
      <div className="bb-band" style={{ padding: '38px 48px 24px', borderBottom: '1px solid ' + C.line, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', color: C.accent, fontWeight: 600 }}>{st.tagline[lang]}</div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, margin: '11px 0 0' }}>{st.appTitle[lang]}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: C.sub }}>{v.dateLabel}</div>
            <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 14, color: C.body, marginTop: 6, maxWidth: 280 }}>{st.encourage[lang]}</div>
          </div>
          <button className="bb-pill" onClick={self.toggleLang} style={{ border: '1px solid #D4CBB6', background: '#FFFDF8', color: C.ink, padding: '9px 15px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{t.langSwitch}</button>
        </div>
      </div>

      {/* stats band */}
      <div className="bb-band" style={{ padding: '24px 48px', borderBottom: '1px solid ' + C.line, display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 700, lineHeight: 1, color: C.accent }}>{v.dayNo}</span>
          <span style={{ fontSize: 14, color: C.sub }}>{v.ofTotal}</span>
        </div>
        <div style={{ height: 42, width: 1, background: C.line }} />
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: C.faint, fontWeight: 600 }}>{t.kStreak}</div>
          <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, marginTop: 4 }}>{v.streak} <span style={{ fontSize: 14, color: C.sub, fontFamily: "'Noto Sans SC',sans-serif" }}>{t.streakUnit}</span></div>
        </div>
        <div style={{ flex: 1, minWidth: 180, maxWidth: 280 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: C.faint, fontWeight: 600, marginBottom: 8 }}><span>{t.kCompletion}</span><span style={{ color: C.accent }}>{v.dPct}</span></div>
          <div style={{ height: 8, background: '#EAE4D7', borderRadius: 999, overflow: 'hidden' }}><div style={{ width: v.dPct, height: '100%', background: C.accent, transition: 'width .25s' }} /></div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18 }}>
          {S.weekly ? <button className="bb-pill" onClick={v.goWeekly} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #D4CBB6', background: '#FFFDF8', color: C.ink, padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent }} />{t.weeklyReview}</button> : null}
          <div>
            <div style={{ fontSize: 11, color: C.faint, marginBottom: 8, textAlign: 'right', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600 }}>{v.kProgress}</div>
            {v.gridEl}
          </div>
        </div>
      </div>

      {/* main two-column */}
      <div className="bb-main-grid">
        <div className="bb-band" style={{ padding: '30px 40px 40px 48px', display: 'flex', flexDirection: 'column', gap: 30 }}>
          {S.learning ? (
            <div>
              <SecHead onClick={v.goLearning} title={t.secLearning} link={t.viewAll} />
              {Field(self, tp + 'learning.topic', today.learning.topic, t.phTopic, { style: { fontSize: 17, fontWeight: 600, width: '100%', padding: '4px 6px', margin: '0 -6px 8px', display: 'block' } })}
              {Field(self, tp + 'learning.body', today.learning.body, t.phBody, { multiline: true, rows: 3, style: { fontSize: 15, lineHeight: 1.75, color: C.body, width: '100%', padding: '8px 10px', margin: '0 -10px', display: 'block' } })}
            </div>
          ) : null}

          {S.reflection ? (
            <div>
              <SecHead onClick={v.goReflection} title={t.secReflection} link={t.viewAll} />
              <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 16, color: C.accent, marginBottom: 14 }}>“{t.reflectQ}”</div>
              <div style={{ background: '#FFFDF8', border: '1px solid #E9E2D2', borderRadius: 8, padding: '14px 16px' }}>
                {Field(self, tp + 'reflection.answer', today.reflection.answer, t.phReflect, { multiline: true, rows: 2, style: { fontSize: 15, lineHeight: 1.75, color: '#3a3833', width: '100%', padding: 0, display: 'block' } })}
              </div>
            </div>
          ) : null}

          {S.fitness ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                <SecHead onClick={v.goFitness} title={t.secFitness} link={t.viewAll} />
                <button onClick={v.toggleFitness} style={today.fitness.done
                  ? { fontSize: 12, fontWeight: 600, padding: '4px 11px', borderRadius: 999, background: '#E2EBDD', color: '#4d7042', border: 'none', cursor: 'pointer', marginBottom: 14 }
                  : { fontSize: 12, fontWeight: 600, padding: '4px 11px', borderRadius: 999, background: 'transparent', color: C.faint, border: '1px solid #D9CFB9', cursor: 'pointer', marginBottom: 14 }}>
                  {today.fitness.done ? '✓ ' + t.doneBadge : '○ ' + t.notDone}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 86px 86px 26px', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: C.faint, fontWeight: 600, paddingBottom: 8, borderBottom: '1px solid ' + C.line }}>
                <span>{t.colMove}</span><span style={{ textAlign: 'right' }}>{t.colSets}</span><span style={{ textAlign: 'right' }}>{t.colWeight}</span><span />
              </div>
              {v.todayExercises.map(ex => (
                <div key={ex._i} style={{ display: 'grid', gridTemplateColumns: '1fr 86px 86px 26px', padding: '6px 0', borderBottom: '1px solid ' + C.line2, alignItems: 'center' }}>
                  {Field(self, tp + 'fitness.exercises.' + ex._i + '.name', ex.name, t.phMove, { style: { fontSize: 15, fontWeight: 500, padding: '5px 6px', marginLeft: -6 } })}
                  {Field(self, tp + 'fitness.exercises.' + ex._i + '.scheme', ex.scheme, '', { style: { fontSize: 15, color: '#6f6b62', textAlign: 'right', padding: '5px 6px' } })}
                  {Field(self, tp + 'fitness.exercises.' + ex._i + '.weight', ex.weight, '', { style: { fontSize: 15, fontWeight: 600, textAlign: 'right', padding: '5px 6px' } })}
                  {xBtn(ex.onRemove)}
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 10, flexWrap: 'wrap' }}>
                <button onClick={self.addEx} style={{ fontSize: 13, color: C.accent, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '4px 0' }}>{t.addMove}</button>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: C.faint, fontWeight: 600 }}>{t.cardioLabel}</span>
                  {Field(self, tp + 'fitness.cardio', today.fitness.cardio, t.phCardio, { style: { fontSize: 14, padding: '4px 6px', width: 150, textAlign: 'right', color: C.body } })}
                </div>
              </div>
            </div>
          ) : null}

          {S.diet ? (
            <div>
              <SecHead onClick={v.goDiet} title={t.secDiet} link={t.viewAllPhotos} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {v.todayMeals.map(m => (
                  <div key={m._i} style={{ display: 'grid', gridTemplateColumns: '74px 1fr 26px', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid ' + C.line2 }}>
                    {Field(self, tp + 'diet.meals.' + m._i + '.label', m.label, '', { style: { fontWeight: 600, fontSize: 14, color: C.accent, padding: '4px 6px', marginLeft: -6 } })}
                    {Field(self, tp + 'diet.meals.' + m._i + '.items', m.items, t.phMeal, { style: { fontSize: 15, color: C.body, padding: '4px 6px' } })}
                    {xBtn(m.onRemove)}
                  </div>
                ))}
              </div>
              <button onClick={self.addMeal} style={{ fontSize: 13, color: C.accent, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '10px 0 0' }}>{t.addMeal}</button>
            </div>
          ) : null}
        </div>

        {/* aside */}
        <div className="bb-band bb-aside" style={{ padding: '30px 48px 40px 32px', borderLeft: '1px solid ' + C.line, display: 'flex', flexDirection: 'column', gap: 28, background: C.aside }}>
          {S.milestones ? (
            <div>
              <Label>{t.secMilestone}</Label>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {v.milestones.map(m => (
                  <div key={m._i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '9px 0', borderBottom: '1px solid ' + C.line2 }}>
                    <button onClick={m.onToggle} style={m.done
                      ? { width: 30, height: 30, flex: 'none', borderRadius: '50%', background: C.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14 }
                      : { width: 30, height: 30, flex: 'none', borderRadius: '50%', border: '1.5px solid #D9CFB9', background: 'transparent', color: C.sub, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>
                      {m.done ? '✓' : m.tag}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {Field(self, 'milestones.' + m._i + '.text', m.text, t.phMile, { style: { fontSize: 14, fontWeight: 500, width: '100%', padding: '3px 5px', marginLeft: -5, display: 'block' } })}
                      {Field(self, 'milestones.' + m._i + '.sub', m.sub, '', { style: { fontSize: 12, color: C.faint, width: '100%', padding: '2px 5px', marginLeft: -5, display: 'block' } })}
                    </div>
                    {xBtn(m.onRemove, 20)}
                  </div>
                ))}
              </div>
              <button onClick={self.addMs} style={{ fontSize: 13, color: C.accent, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '10px 0 0' }}>{t.addMile}</button>
            </div>
          ) : null}

          {S.fitness ? (
            <div>
              <Label>{t.secBody}</Label>
              <div style={{ display: 'flex', gap: 24 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    {Field(self, tp + 'fitness.weight', today.fitness.weight, '', { style: { fontFamily: SERIF, fontSize: 28, fontWeight: 600, width: 64, padding: '0 2px' } })}
                    <span style={{ fontSize: 13, color: C.sub }}>kg</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>{t.weightLabel}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    {Field(self, tp + 'fitness.waist', today.fitness.waist, '', { style: { fontFamily: SERIF, fontSize: 28, fontWeight: 600, width: 48, padding: '0 2px' } })}
                    <span style={{ fontSize: 13, color: C.sub }}>cm</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>{t.waistLabel}</div>
                </div>
              </div>
              {v.trendText ? <div style={{ fontSize: 13, color: '#4d7042', marginTop: 12, fontWeight: 500 }}>{v.trendText}</div> : null}
            </div>
          ) : null}

          {S.body ? (
            <div>
              <button className="bb-link" onClick={v.goFitness} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, margin: '0 0 10px', color: C.ink }}>
                <Label style={{ margin: 0 }}>{t.bodyMap}</Label><span style={{ color: C.accent, fontSize: 16 }}>›</span>
              </button>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 150, flex: 'none' }}>{v.bodyEl}</div>
                <div>
                  <div style={{ fontSize: 11, color: C.faint }}>{t.bodyFatLabel}</div>
                  <div style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 700, lineHeight: 1.1 }}>{v.bodyFat}<span style={{ fontSize: 12, color: C.sub }}>%</span></div>
                  <div style={{ fontSize: 11, color: C.faint, marginTop: 8 }}>{t.muscleLabel}</div>
                  <div style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 700, lineHeight: 1.1 }}>{v.muscleMass}<span style={{ fontSize: 12, color: C.sub }}>kg</span></div>
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid ' + C.line }}>
            <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 17, lineHeight: 1.5 }}>“{st.quote[lang]}”</div>
          </div>
        </div>
      </div>

      {/* footer band */}
      <div className="bb-band" style={{ padding: '16px 48px', borderTop: '1px solid ' + C.line, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', background: C.aside }}>
        <span style={{ fontSize: 12, color: C.faint }}>✓ {t.saved}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button className="bb-reset" onClick={self.openSettings} style={footLink}>{t.settings}</button>
          <button className="bb-reset" onClick={self.openAI} style={footLink}>{t.aiSettings}</button>
          <button className="bb-reset" onClick={self.exportData} style={footLink}>{t.export}</button>
          <button className="bb-reset" onClick={self.triggerImport} style={footLink}>{t.import}</button>
          <button className="bb-reset" onClick={self.reset} style={footLink}>{t.reset}</button>
        </div>
      </div>
    </>
  );
}
const footLink = { fontSize: 12, color: C.faint, background: 'transparent', border: 'none', cursor: 'pointer' };

// ================= DETAIL =================
function DetailHeader(self, v) {
  const t = v.t;
  return (
    <div className="bb-band" style={{ padding: '26px 48px', borderBottom: '1px solid ' + C.line, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
      <button className="bb-reset" onClick={v.goBack} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: 'none', cursor: 'pointer', color: C.sub, fontSize: 14, fontWeight: 600, padding: 0 }}><span style={{ fontSize: 18 }}>‹</span>{t.back}</button>
      <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, margin: 0 }}>{v.viewTitle}</h1>
      <button className="bb-pill" onClick={self.toggleLang} style={{ border: '1px solid #D4CBB6', background: '#FFFDF8', color: C.ink, padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{t.langSwitch}</button>
    </div>
  );
}

function histDate(h) {
  return (
    <div style={{ fontSize: 13, color: C.faint, fontWeight: 600 }}>
      <div style={{ color: C.accent, fontFamily: SERIF, fontSize: 16 }}>{h.dayNo}</div>{h.dateLabel}
    </div>
  );
}

// a history row that is clickable to open the full day detail
function HistRow({ self, k, children, style }) {
  return (
    <div onClick={() => self.openDay(k)} className="bb-link" style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '88px 1fr', gap: 20, padding: '18px 0', borderTop: '1px solid ' + C.line2, ...style }}>
      {children}
    </div>
  );
}

function Detail(self, v) {
  const t = v.t, view = self.state.view, today = v.today, tp = v.tp, lang = self.state.lang;
  const aiCard = { background: C.aside, border: '1px solid ' + C.cardBorder, borderRadius: 12, padding: '22px 24px', marginBottom: 28 };
  const pad = { padding: '30px 48px 44px' };

  if (view === 'learning') {
    return (
      <div className="bb-band" style={pad}>
        <div style={aiCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}><span style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: C.accent, fontWeight: 700 }}>{t.aiAssistant}</span></div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            {aiBtn(t.btnPoints, v.learnPoints)}{aiBtn(t.btnQuiz, v.learnQuiz)}{aiBtn(t.btnTomorrow, v.learnTomorrow)}
          </div>
          <AIInline self={self} k="learning" />
        </div>
        <Label style={{ margin: '0 0 18px' }}>{t.history}</Label>
        {v.histLearning.map((h, i) => (
          <HistRow key={i} self={self} k={h.k}>
            {histDate(h)}
            <div>
              {h.topic ? <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{h.topic}</div> : null}
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.body, margin: '0 0 8px' }}>{h.body}</p>
              {h.hasReflect ? <div style={{ fontSize: 13, color: C.sub, fontStyle: 'italic', borderLeft: '2px solid #E0D7C2', paddingLeft: 12 }}>{h.reflect}</div> : null}
            </div>
          </HistRow>
        ))}
      </div>
    );
  }

  if (view === 'reflection') {
    return (
      <div className="bb-band" style={pad}>
        <div style={aiCard}>
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 16, color: C.accent, marginBottom: 14 }}>“{t.reflectQ}”</div>
          <div style={{ background: '#fff', border: '1px solid #E9E2D2', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
            {Field(self, tp + 'reflection.answer', today.reflection.answer, t.phReflect, { multiline: true, rows: 2, style: { fontSize: 15, lineHeight: 1.75, color: '#3a3833', width: '100%', padding: 0, display: 'block' } })}
          </div>
          {primaryBtn(t.btnCoach, v.coachRun)}
          <AIInline self={self} k="reflection" />
        </div>
        <Label style={{ margin: '0 0 18px' }}>{t.history}</Label>
        {v.histReflection.map((h, i) => (
          <HistRow key={i} self={self} k={h.k} style={{ padding: '16px 0' }}>
            {histDate(h)}
            <div style={{ fontSize: 15, lineHeight: 1.75, color: '#3a3833' }}>{self.mdEl(h.reflect)}</div>
          </HistRow>
        ))}
      </div>
    );
  }

  if (view === 'fitness') {
    return (
      <div className="bb-band" style={pad}>
        <div className="bb-fit-grid" style={{ marginBottom: 24 }}>
          <div style={{ background: C.aside, border: '1px solid ' + C.cardBorder, borderRadius: 12, padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 10 }}>
              <Label style={{ margin: 0 }}>{t.bodyMap}</Label>
              <div style={{ display: 'flex', gap: 4, background: '#F1EADb', borderRadius: 9, padding: 3 }}>
                <button onClick={v.setMuscle} style={toggleStyle(self.state.bodyMode === 'muscle', C.accent)}>{t.muscleMode}</button>
                <button onClick={v.setFat} style={toggleStyle(self.state.bodyMode === 'fat', '#CF9A3F')}>{t.fatMode}</button>
              </div>
            </div>
            <p style={{ fontSize: 12, color: C.faint, margin: '0 0 12px' }}>{t.bodyHint}</p>
            {v.bodyEl}
            {v.bodyLegendEl}
          </div>
          <div style={{ background: C.aside, border: '1px solid ' + C.cardBorder, borderRadius: 12, padding: '22px 24px' }}>
            <div style={{ display: 'flex', gap: 22, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 11, color: C.faint, textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>{t.bodyFatLabel}</div>
                <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>{v.bodyFat}<span style={{ fontSize: 14, color: C.sub }}>%</span></div>
                <div style={{ fontSize: 12, color: v.fatDeltaColor, fontWeight: 600 }}>{v.fatDelta}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.faint, textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>{t.muscleLabel}</div>
                <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>{v.muscleMass}<span style={{ fontSize: 14, color: C.sub }}>kg</span></div>
                <div style={{ fontSize: 12, color: v.musDeltaColor, fontWeight: 600 }}>{v.musDelta}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: C.faint, fontWeight: 600, marginBottom: 8 }}>{t.trend}</div>
            {v.trendEl}
            {primaryBtn(self.state.ai.bodyest && self.state.ai.bodyest.busy ? t.generating : t.btnEstimate, v.estimateBody, { marginTop: 16, width: '100%', justifyContent: 'center', padding: '10px 16px' })}
            {self.state.ai.bodyest && self.state.ai.bodyest.busy ? <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12, fontSize: 13, color: C.sub }}><span className="ai-spin" />{t.generating}</div> : null}
            {self.state.ai.bodyest && !self.state.ai.bodyest.busy && self.state.ai.bodyest.text ? <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.7, color: '#3a3833' }}>{self.state.ai.bodyest.text}</div> : null}
            <div style={{ fontSize: 11, color: '#b0a791', marginTop: 10, lineHeight: 1.5 }}>{t.bodyNote}</div>
          </div>
        </div>
        <div style={{ background: C.aside, border: '1px solid ' + C.cardBorder, borderRadius: 12, padding: '22px 24px', marginBottom: 24 }}>
          <Label style={{ margin: '0 0 14px' }}>{t.bodyPhoto}</Label>
          {v.todayBodyPhotoUrl
            ? <div style={{ position: 'relative', width: 200 }}>
                <img src={v.todayBodyPhotoUrl} alt="" style={{ width: 200, height: 260, objectFit: 'cover', borderRadius: 12, display: 'block' }} />
                <button onClick={self.removeBodyPhoto} style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,.5)', color: '#fff', cursor: 'pointer', fontSize: 14 }}>×</button>
              </div>
            : <button className="bb-aibtn" onClick={self.askBodyPhoto} style={{ width: 200, height: 260, borderRadius: 12, border: '1.5px dashed #D4C9B3', background: '#fff', color: '#A99E88', cursor: 'pointer', fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}><span style={{ fontSize: 30 }}>＋</span>{t.addBodyPhoto}</button>}
          <div style={{ fontSize: 12, color: '#b0a791', marginTop: 12 }}>{t.bodyPhotoNote}</div>
        </div>
        <div style={{ background: C.aside, border: '1px solid ' + C.cardBorder, borderRadius: 12, padding: '18px 22px', marginBottom: 30, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: C.accent, fontWeight: 700 }}>{t.aiAssistant}</span>
          {aiBtn(t.btnFitness, v.fitnessSuggest)}
          <div style={{ flexBasis: '100%' }}><AIInline self={self} k="fitness" /></div>
        </div>
        {v.histBody.length ? (
          <>
            <Label style={{ margin: '0 0 18px' }}>{t.bodyPhotoWall}</Label>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 34 }}>
              {v.histBody.map((h, i) => (
                <div key={i} onClick={() => self.openDay(h.k)} className="bb-link" style={{ cursor: 'pointer', width: 150 }}>
                  {h.url ? <img src={h.url} alt="" style={{ width: 150, height: 195, objectFit: 'cover', borderRadius: 10, display: 'block', marginBottom: 6 }} /> : <div style={{ width: 150, height: 195, borderRadius: 10, background: '#F1ECE0', marginBottom: 6 }} />}
                  <div style={{ fontSize: 12, color: C.faint, fontWeight: 600 }}><span style={{ color: C.accent, fontFamily: SERIF }}>{h.dayNo}</span> · {h.dateLabel}</div>
                </div>
              ))}
            </div>
          </>
        ) : null}
        <Label style={{ margin: '0 0 18px' }}>{t.history}</Label>
        {v.histFitness.map((h, i) => (
          <HistRow key={i} self={self} k={h.k}>
            {histDate(h)}
            <div>
              {h.exercises.map((ex, j) => (
                <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '5px 0', borderBottom: '1px solid #F3EEE3' }}>
                  <span style={{ fontWeight: 500 }}>{ex.name}</span>
                  <span style={{ color: C.sub }}>{ex.scheme} · <span style={{ color: C.ink, fontWeight: 600 }}>{ex.weight}</span></span>
                </div>
              ))}
              {h.cardioLine ? <div style={{ fontSize: 13, color: C.faint, marginTop: 8 }}>{h.cardioLine}</div> : null}
            </div>
          </HistRow>
        ))}
      </div>
    );
  }

  if (view === 'diet') {
    return (
      <div className="bb-band" style={pad}>
        <div style={aiCard}>
          <Label style={{ margin: '0 0 14px' }}>{t.todayMeals}</Label>
          {v.todayMeals.map(m => (
            <div key={m._i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid ' + C.line2, alignItems: 'flex-start' }}>
              <div style={{ flex: 'none', width: 96 }}>
                {m.hasPhoto ? <div style={{ position: 'relative' }}>{m.photoEl}<button onClick={m.onRemovePhoto} style={{ position: 'absolute', top: 5, right: 5, width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,.5)', color: '#fff', cursor: 'pointer', fontSize: 13 }}>×</button></div>
                  : <button className="bb-aibtn" onClick={m.onAddPhoto} style={{ width: 96, height: 96, borderRadius: 10, border: '1.5px dashed #D4C9B3', background: '#fff', color: '#A99E88', cursor: 'pointer', fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}><span style={{ fontSize: 22 }}>＋</span>{t.addPhoto}</button>}
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                {Field(self, tp + 'diet.meals.' + m._i + '.label', m.label, '', { style: { fontWeight: 600, fontSize: 15, color: C.accent, padding: '4px 6px', marginLeft: -6, display: 'block' } })}
                {Field(self, tp + 'diet.meals.' + m._i + '.items', m.items, t.phMeal, { style: { fontSize: 15, color: C.body, padding: '4px 6px', marginLeft: -6, width: '100%', marginTop: 4, display: 'block' } })}
              </div>
              {xBtn(m.onRemove)}
            </div>
          ))}
          <button onClick={self.addMeal} style={{ fontSize: 13, color: C.accent, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '12px 0 0' }}>{t.addMeal}</button>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid ' + C.cardBorder }}>
            {primaryBtn(t.btnDiet, v.dietFeedback)}
            <AIInline self={self} k="diet" />
            <div style={{ fontSize: 12, color: '#b0a791', marginTop: 10 }}>{t.photoNote}</div>
          </div>
        </div>
        <Label style={{ margin: '0 0 18px' }}>{lang === 'zh' ? '照片墙' : 'Photo wall'}</Label>
        {v.histDiet.map((h, i) => (
          <div key={i} onClick={() => self.openDay(h.k)} className="bb-link" style={{ cursor: 'pointer', padding: '16px 0', borderTop: '1px solid ' + C.line2 }}>
            <div style={{ fontSize: 13, color: C.faint, fontWeight: 600, marginBottom: 12 }}><span style={{ color: C.accent, fontFamily: SERIF, fontSize: 15 }}>{h.dayNo}</span> · {h.dateLabel}</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {h.meals.map((m, j) => (
                <div key={j} style={{ width: 180 }}>
                  {m.hasPhoto ? m.photoEl : <div style={{ width: 180, height: 130, borderRadius: 10, background: '#F1ECE0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C7BDA8', fontSize: 30, marginBottom: 8 }}>{(m.label || '·').slice(0, 1)}</div>}
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>{m.label}</div>
                  <div style={{ fontSize: 13, color: C.body, lineHeight: 1.5 }}>{m.items}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (view === 'weekly') {
    return (
      <div className="bb-band" style={pad}>
        <div style={{ background: C.aside, border: '1px solid ' + C.cardBorder, borderRadius: 12, padding: '26px 28px' }}>
          <h3 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 20, margin: '0 0 6px' }}>{t.weeklyTitle}</h3>
          <p style={{ fontSize: 14, color: C.sub, margin: '0 0 18px' }}>{t.weeklySub}</p>
          {primaryBtn(t.btnWeekly, v.weeklyReview, { fontSize: 14, padding: '11px 20px' })}
          <AIInline self={self} k="weekly" />
        </div>
      </div>
    );
  }

  if (view === 'day') return DayDetail(self, v);
  if (view === 'settings') return SettingsView(self, v);
  return null;
}

// read-only detail for a single past day
function DayDetail(self, v) {
  const t = v.t, lang = self.state.lang, day = v.day, S = self.settings.sections;
  if (!day) return null;
  const r = day.rec;
  const hasL = r.learning.topic || r.learning.body;
  const hasR = r.reflection.answer;
  const hasF = (r.fitness.exercises || []).length || r.fitness.cardio || r.fitness.weight || r.fitness.waist || r.fitness.bodyPhotoId;
  const hasD = (r.diet.meals || []).some(m => m.items || m.photoId);
  const empty = !(hasL || hasR || hasF || hasD);
  const card = { background: C.aside, border: '1px solid ' + C.cardBorder, borderRadius: 12, padding: '22px 24px', marginBottom: 22 };
  return (
    <div className="bb-band" style={{ padding: '30px 48px 44px' }}>
      <div style={{ fontSize: 13, color: C.faint, fontWeight: 600, marginBottom: 22 }}>{day.dateLabel}</div>
      {empty ? <div style={{ fontSize: 15, color: C.sub, padding: '20px 0' }}>{t.emptyDay}</div> : null}

      {S.learning && hasL ? (
        <div style={card}>
          <Label style={{ margin: '0 0 12px' }}>{t.dayDetailLearning}</Label>
          {r.learning.topic ? <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{r.learning.topic}</div> : null}
          <div style={{ fontSize: 15, lineHeight: 1.8, color: C.body }}>{self.mdEl(r.learning.body)}</div>
        </div>
      ) : null}

      {S.reflection && hasR ? (
        <div style={card}>
          <Label style={{ margin: '0 0 12px' }}>{t.dayDetailReflection}</Label>
          <div style={{ fontSize: 15, lineHeight: 1.8, color: '#3a3833' }}>{self.mdEl(r.reflection.answer)}</div>
        </div>
      ) : null}

      {S.fitness && hasF ? (
        <div style={card}>
          <Label style={{ margin: '0 0 12px' }}>{t.dayDetailFitness}</Label>
          {(r.fitness.exercises || []).map((ex, j) => (
            <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0', borderBottom: '1px solid #F3EEE3' }}>
              <span style={{ fontWeight: 500 }}>{ex.name}</span>
              <span style={{ color: C.sub }}>{ex.scheme} · <span style={{ color: C.ink, fontWeight: 600 }}>{ex.weight}</span></span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 12, fontSize: 13, color: C.faint }}>
            {r.fitness.cardio ? <span>{t.cardioLabel} · {r.fitness.cardio}</span> : null}
            {r.fitness.weight ? <span>{t.weightLabel} · {r.fitness.weight} kg</span> : null}
            {r.fitness.waist ? <span>{t.waistLabel} · {r.fitness.waist} cm</span> : null}
          </div>
          {day.bodyPhotoUrl ? <img src={day.bodyPhotoUrl} alt="" style={{ width: 200, height: 260, objectFit: 'cover', borderRadius: 12, display: 'block', marginTop: 16 }} /> : null}
        </div>
      ) : null}

      {S.diet && hasD ? (
        <div style={card}>
          <Label style={{ margin: '0 0 14px' }}>{t.dayDetailDiet}</Label>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {day.meals.map((m, j) => (
              <div key={j} style={{ width: 180 }}>
                {m.hasPhoto ? m.photoEl : <div style={{ width: 180, height: 130, borderRadius: 10, background: '#F1ECE0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C7BDA8', fontSize: 30, marginBottom: 8 }}>{(m.label || '·').slice(0, 1)}</div>}
                <div style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>{m.label}</div>
                <div style={{ fontSize: 13, color: C.body, lineHeight: 1.5 }}>{m.items}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// plan settings editor
function SettingsView(self, v) {
  const t = v.t, lang = self.state.lang, st = self.settings, S = st.sections;
  const d = self.state.data;
  const card = { background: C.aside, border: '1px solid ' + C.cardBorder, borderRadius: 12, padding: '22px 24px', marginBottom: 22 };
  const inStyle = { width: '100%', border: '1px solid ' + C.line, borderRadius: 9, padding: '9px 11px', fontSize: 14, background: '#FCFAF5', outline: 'none', fontFamily: 'inherit' };
  const fieldRow = (label, node) => (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <span style={{ display: 'block', fontSize: 12, color: C.faint, marginBottom: 5, fontWeight: 600 }}>{label}</span>
      {node}
    </label>
  );
  const txt = (label, path, value, ph) => fieldRow(label, <input type="text" value={value || ''} onChange={self.onSetting(path)} placeholder={ph} style={inStyle} />);
  const sectionDefs = [
    ['learning', t.secLearning], ['reflection', t.secReflection], ['fitness', t.secFitness],
    ['diet', t.secDiet], ['milestones', t.secMilestone], ['body', t.bodyMap], ['weekly', t.weeklyReview],
  ];
  return (
    <div className="bb-band" style={{ padding: '30px 48px 44px' }}>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 22 }}>{t.settingsTip}</div>

      <div style={card}>
        <Label style={{ margin: '0 0 16px' }}>{t.setBasics}</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          {fieldRow(t.fTotalDays, <input type="number" min="1" value={st.totalDays} onChange={self.onSettingNum('totalDays')} style={inStyle} />)}
          {fieldRow(t.fStartDate, <input type="date" value={d.startDate || ''} onChange={self.setStartDate} style={inStyle} />)}
          {txt(t.fTitleZh, 'appTitle.zh', st.appTitle.zh)}
          {txt(t.fTitleEn, 'appTitle.en', st.appTitle.en)}
          {txt(t.fTaglineZh, 'tagline.zh', st.tagline.zh)}
          {txt(t.fTaglineEn, 'tagline.en', st.tagline.en)}
        </div>
        {fieldRow(t.fEncourage, <input type="text" value={st.encourage.zh || ''} onChange={self.onSetting('encourage.zh')} style={inStyle} />)}
        {fieldRow(t.fQuote, <input type="text" value={st.quote.zh || ''} onChange={self.onSetting('quote.zh')} style={inStyle} />)}
      </div>

      <div style={card}>
        <Label style={{ margin: '0 0 14px' }}>{t.setSections}</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {sectionDefs.map(([k, label]) => (
            <button key={k} onClick={() => self.toggleSection(k)} style={S[k]
              ? { fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 999, border: 'none', background: C.accent, color: '#fff', cursor: 'pointer' }
              : { fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 999, border: '1px solid #D9CFB9', background: 'transparent', color: C.faint, cursor: 'pointer' }}>
              {S[k] ? '✓ ' : '○ '}{label}
            </button>
          ))}
        </div>
      </div>

      <div style={card}>
        <Label style={{ margin: '0 0 14px' }}>{t.setMilestones}</Label>
        {d.milestones.map((m, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 22px', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid ' + C.line2 }}>
            <input type="text" value={m.tag || ''} onChange={e => self.setData(dd => self.setPath(dd, 'milestones.' + i + '.tag', e.target.value))} placeholder={t.milestoneTagHint} style={Object.assign({}, inStyle, { textAlign: 'center' })} />
            <input type="text" value={m.text || ''} onChange={e => self.setData(dd => self.setPath(dd, 'milestones.' + i + '.text', e.target.value))} placeholder={t.milestoneTextHint} style={inStyle} />
            <input type="text" value={m.sub || ''} onChange={e => self.setData(dd => self.setPath(dd, 'milestones.' + i + '.sub', e.target.value))} placeholder={t.milestoneSubHint} style={inStyle} />
            {xBtn(() => self.removeMs(i), 20)}
          </div>
        ))}
        <button onClick={self.addMs} style={{ fontSize: 13, color: C.accent, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '12px 0 0' }}>{t.addMile}</button>
      </div>

      <div style={Object.assign({}, card, { marginBottom: 0 })}>
        <Label style={{ margin: '0 0 14px' }}>{t.setDanger}</Label>
        <button className="bb-aibtn" onClick={self.reset} style={{ fontSize: 13, fontWeight: 600, padding: '9px 16px', borderRadius: 10, border: '1px solid #D9CFB9', background: '#fff', color: C.ink, cursor: 'pointer' }}>{t.reset}</button>
      </div>
    </div>
  );
}
function toggleStyle(active, color) {
  return { fontSize: 12, fontWeight: 600, padding: '5px 13px', borderRadius: 7, border: 'none', cursor: 'pointer', background: active ? '#fff' : 'transparent', color: active ? color : C.faint };
}

// ================= AI settings modal =================
function AIModal(self) {
  if (!self.state.aiOpen) return null;
  const t = self.L[self.state.lang], f = self.state.aiForm;
  const inp = (label, key, type, placeholder) => (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <span style={{ display: 'block', fontSize: 12, color: C.faint, marginBottom: 4 }}>{label}</span>
      <input type={type || 'text'} value={f[key] || ''} onChange={self.onAIField(key)} placeholder={placeholder} style={{ width: '100%', border: '1px solid ' + C.line, borderRadius: 10, padding: '10px 12px', fontSize: 14, background: '#FCFAF5', outline: 'none' }} />
    </label>
  );
  return (
    <div onClick={self.closeAI} style={{ position: 'fixed', inset: 0, background: 'rgba(40,30,20,.35)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(0,0,0,.2)' }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: C.ink, marginBottom: 16, fontFamily: SERIF }}>{t.aiSettings}</div>
        <label style={{ display: 'block', marginBottom: 12 }}>
          <span style={{ display: 'block', fontSize: 12, color: C.faint, marginBottom: 4 }}>{t.aiPreset}</span>
          <select value={f.preset || 'custom'} onChange={self.onAIPreset} style={{ width: '100%', border: '1px solid ' + C.line, borderRadius: 10, padding: '10px 12px', fontSize: 14, background: '#FCFAF5' }}>
            {AI_PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        {inp(t.aiBaseURL, 'baseURL', 'text', 'https://api.deepseek.com/v1')}
        {inp(t.aiKey, 'apiKey', 'password', 'sk-...')}
        {inp(t.aiModel, 'model', 'text', 'deepseek-chat')}
        <div style={{ fontSize: 12, color: C.faint, marginBottom: 16 }}>{t.aiTip}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="bb-pill" onClick={self.closeAI} style={{ border: '1px solid ' + C.line, background: 'transparent', color: C.sub, padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{t.aiClose}</button>
          {primaryBtn(t.aiSave, self.saveAI)}
        </div>
      </div>
    </div>
  );
}

// ================= compute + top-level =================
function computeVals(self) {
  const d = self.state.data, lang = self.state.lang, t = self.L[lang] || self.L.zh, view = self.state.view;
  const N = self.settings.totalDays;
  const today = d.records[self.today] || self.emptyRecord();
  const tp = 'records.' + self.today + '.';
  const start = d.startDate;
  const dayNo = self.dayNumberOf(self.today, start);

  const checkins = [];
  for (let i = 0; i < N; i++) { const ds = self.iso(self.addDays(new Date(start + 'T00:00:00'), i)); checkins.push(self.hasContent(d.records[ds]) ? 1 : 0); }
  const doneCount = checkins.filter(Boolean).length;
  const completion = Math.round(doneCount / N * 100);
  let last = -1; for (let i = 0; i < checkins.length; i++) if (checkins[i]) last = i;
  let streak = 0; for (let i = last; i >= 0 && checkins[i]; i--) streak++;

  const cols = Math.min(30, N);
  const gridEl = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', 11px)', gap: 4 }}>
      {checkins.map((vv, i) => <span key={i} title={'Day ' + (i + 1)} style={{ width: 11, height: 11, borderRadius: 3, background: vv ? C.accent : C.line }} />)}
    </div>
  );

  const todayExercises = today.fitness.exercises.map((ex, i) => Object.assign({}, ex, { _i: i, onRemove: () => self.removeEx(i) }));
  const todayMeals = today.diet.meals.map((m, i) => {
    if (m.photoId) self.ensurePhoto(m.photoId);
    const url = (m.photoId && self.photoUrls[m.photoId]) || '';
    const photoEl = url ? <img src={url} alt="" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 10, display: 'block' }} /> : null;
    return Object.assign({}, m, { _i: i, hasPhoto: url ? true : null, photoEl, onRemove: () => self.removeMeal(i), onAddPhoto: () => self.askPhoto(i), onRemovePhoto: () => self.removePhoto(i) });
  });
  const milestones = d.milestones.map((ms, i) => Object.assign({}, ms, { _i: i, onToggle: () => self.toggleMs(i), onRemove: () => self.removeMs(i) }));

  const todayBodyPhotoId = today.fitness.bodyPhotoId;
  if (todayBodyPhotoId) self.ensurePhoto(todayBodyPhotoId);
  const todayBodyPhotoUrl = (todayBodyPhotoId && self.photoUrls[todayBodyPhotoId]) || '';

  const allDates = Object.keys(d.records).sort().reverse();
  const dn = k => t.dayWord + self.dayNumberOf(k, start) + t.dayWordEnd;
  const histLearning = allDates.filter(k => d.records[k].learning.body || d.records[k].learning.topic).map(k => { const r = d.records[k]; return { k, dateLabel: self.fmtDate(k, lang), dayNo: dn(k), topic: r.learning.topic, body: r.learning.body, reflect: r.reflection.answer, hasReflect: r.reflection.answer ? true : null }; });
  const histReflection = allDates.filter(k => d.records[k].reflection.answer).map(k => ({ k, dateLabel: self.fmtDate(k, lang), dayNo: dn(k), reflect: d.records[k].reflection.answer }));
  const histFitness = allDates.filter(k => (d.records[k].fitness.exercises || []).length).map(k => { const r = d.records[k]; return { k, dateLabel: self.fmtDate(k, lang), dayNo: dn(k), exercises: r.fitness.exercises, cardioLine: (r.fitness.cardio ? t.cardioLabel + ' · ' + r.fitness.cardio : '') + (r.fitness.weight ? '   ·   ' + t.weightLabel + ' ' + r.fitness.weight + ' kg' : '') }; });
  const histDiet = allDates.filter(k => (d.records[k].diet.meals || []).length).map(k => { const r = d.records[k]; const meals = r.diet.meals.map(m => { if (m.photoId) self.ensurePhoto(m.photoId); const url = (m.photoId && self.photoUrls[m.photoId]) || ''; const photoEl = url ? <img src={url} alt="" style={{ width: 180, height: 130, objectFit: 'cover', borderRadius: 10, display: 'block', marginBottom: 8 }} /> : null; return Object.assign({}, m, { hasPhoto: url ? true : null, photoEl }); }); return { k, dateLabel: self.fmtDate(k, lang), dayNo: dn(k), meals }; });

  const histBody = allDates.filter(k => d.records[k].fitness && d.records[k].fitness.bodyPhotoId).map(k => { const id = d.records[k].fitness.bodyPhotoId; if (id) self.ensurePhoto(id); const url = (id && self.photoUrls[id]) || ''; return { k, dateLabel: self.fmtDate(k, lang), dayNo: dn(k), url }; });

  // per-day detail (read-only view of a single date)
  let day = null;
  if (self.state.dayKey) {
    const k = self.state.dayKey, r = d.records[k] || self.emptyRecord();
    const meals = (r.diet.meals || []).map((m, i) => { if (m.photoId) self.ensurePhoto(m.photoId); const url = (m.photoId && self.photoUrls[m.photoId]) || ''; const photoEl = url ? <img src={url} alt="" style={{ width: 180, height: 130, objectFit: 'cover', borderRadius: 10, display: 'block', marginBottom: 8 }} /> : null; return Object.assign({}, m, { _i: i, hasPhoto: url ? true : null, photoEl }); });
    const bid = r.fitness && r.fitness.bodyPhotoId;
    if (bid) self.ensurePhoto(bid);
    const bodyPhotoUrl = (bid && self.photoUrls[bid]) || '';
    day = { k, rec: r, meals, bodyPhotoUrl, dateLabel: self.fmtDate(k, lang), dayNo: dn(k) };
  }

  const recForAI = today;
  const learnText = '主题：' + recForAI.learning.topic + '\n总结：' + recForAI.learning.body;
  const mealsText = recForAI.diet.meals.map(m => m.label + '：' + m.items).join('；');
  const fitSummary = histFitness.slice(0, 5).map(h => h.dayNo + ': ' + h.exercises.map(e => e.name + ' ' + e.scheme + ' ' + e.weight).join(', ')).join('\n');
  const weekSummary = allDates.slice(0, 7).map(k => { const r = d.records[k]; return self.fmtDate(k, lang) + '｜学:' + (r.learning.topic || '-') + '｜练:' + ((r.fitness.exercises || []).map(e => e.name).join('/') || '-') + '｜反思:' + (r.reflection.answer || '-'); }).join('\n');

  const snaps = d.bodySnapshots || [];
  const latest = snaps[snaps.length - 1], prev = snaps[snaps.length - 2];
  let bodyFat = '—', muscleMass = '—', fatDelta = '', musDelta = '', fatDeltaColor = C.faint, musDeltaColor = C.faint, trendText = '';
  if (latest) {
    bodyFat = latest.bodyFat; muscleMass = latest.muscleMass;
    if (prev) {
      const fd = latest.bodyFat - prev.bodyFat, md = latest.muscleMass - prev.muscleMass;
      fatDelta = (fd <= 0 ? '↓ ' : '↑ ') + Math.abs(fd).toFixed(1); fatDeltaColor = fd <= 0 ? '#4d7042' : '#b1632f';
      musDelta = (md >= 0 ? '↑ ' : '↓ ') + Math.abs(md).toFixed(1); musDeltaColor = md >= 0 ? '#4d7042' : '#b1632f';
      trendText = (lang === 'zh' ? '肌肉 ' : 'Muscle ') + (md >= 0 ? '↑' : '↓') + Math.abs(md).toFixed(1) + 'kg · ' + (lang === 'zh' ? '体脂 ' : 'Fat ') + (fd <= 0 ? '↓' : '↑') + Math.abs(fd).toFixed(1) + '%';
    }
  }

  const ofTotal = lang === 'zh' ? '/ 共 ' + N + ' 天' : '/ of ' + N;
  const kProgress = lang === 'zh' ? N + ' 天进度' : N + '-Day Progress';
  let viewTitle = t.titles[view] || '';
  if (view === 'day' && day) viewTitle = day.dayNo;
  else if (view === 'settings') viewTitle = t.settingsTitle;

  return {
    t, today, tp, dayNo, dPct: completion + '%', streak, dateLabel: self.fmtFull(lang), gridEl,
    todayExercises, todayMeals, milestones, ofTotal, kProgress, day,
    todayBodyPhotoUrl, histBody,
    viewTitle,
    goBack: () => self.setView(view === 'day' ? (self.state.dayBack || 'home') : 'home'),
    goHome: () => self.setView('home'), goLearning: () => self.setView('learning'), goReflection: () => self.setView('reflection'),
    goFitness: () => self.setView('fitness'), goDiet: () => self.setView('diet'), goWeekly: () => self.setView('weekly'),
    toggleFitness: self.toggleFitness,
    histLearning, histReflection, histFitness, histDiet,
    bodyEl: self.buildBody(latest, self.state.bodyMode), bodyLegendEl: self.buildLegend(latest), trendEl: self.buildTrend(snaps),
    bodyFat, muscleMass, fatDelta, musDelta, fatDeltaColor, musDeltaColor, trendText,
    setMuscle: () => self.setBodyMode('muscle'), setFat: () => self.setBodyMode('fat'),
    estimateBody: () => self.estimateBody(),
    learnPoints: () => self.callAI('learning', '把下面的学习总结提炼成 3-5 条要点：\n' + recForAI.learning.body),
    learnQuiz: () => self.callAI('learning', '基于下面的学习内容，出 3 道检验理解的问题，不要给答案：\n' + recForAI.learning.body),
    learnTomorrow: () => self.callAI('learning', '基于今天的学习（' + learnText + '），建议明天的 1-2 个学习重点，简短。'),
    coachRun: () => self.callAI('reflection', '我今天的学习：\n' + learnText + '\n我的反思：' + recForAI.reflection.answer + '\n请提出 2 个能深化反思的追问，并给一句具体的鼓励或下一步。'),
    dietFeedback: () => self.callAI('diet', '这是我今天的三餐（仅文字描述）："' + mealsText + '"。给出简短的营养评估和一条改进建议。'),
    fitnessSuggest: () => self.callAI('fitness', '这是我最近的训练记录：\n' + fitSummary + '\n请给出下次训练的建议，关注薄弱或不平衡的部位，简短分点。'),
    weeklyReview: () => self.callAI('weekly', '这是我过去 7 天的记录摘要：\n' + weekSummary + '\n请做每周复盘：亮点、需要改进的地方、下周 2-3 条具体建议。'),
  };
}

export function renderApp(self) {
  const v = computeVals(self);
  return (
    <div ref={self.setRoot} className="bb-page" style={{ minHeight: '100vh', background: C.page, padding: '36px 24px 64px', fontFamily: "'Noto Sans SC', system-ui, sans-serif", color: C.ink }}>
      <input ref={self.setPhotoInput} type="file" accept="image/*" onChange={self.onPhoto} style={{ display: 'none' }} />
      <input ref={self.setImportInput} type="file" accept="application/json,.json" onChange={self.onImport} style={{ display: 'none' }} />
      <div style={{ maxWidth: 1140, margin: '0 auto', background: C.sheet, borderRadius: 4, boxShadow: '0 4px 30px rgba(80,60,30,.12)', overflow: 'hidden', color: C.ink }}>
        {self.state.view === 'home' ? Home(self, v) : <>{DetailHeader(self, v)}{Detail(self, v)}</>}
      </div>
      {AIModal(self)}
      {self.state.toast ? <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: C.ink, color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, zIndex: 200 }}>{self.state.toast}</div> : null}
    </div>
  );
}
