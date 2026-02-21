# PROGRESS — Arrow Rescue TMA

| % | Milestone | PR | Owner (Model) | DoD |
|---:|---|---|---|---|
| 10 | Repo bootstrap + AGENTS.md + PROGRESS.md + copilot instructions | feature/bootstrap | - | ✅ npm dev/build/test çalışır |
| 5 | Bootstrap fix: base path, pnpm sil, PR template, CI | feature/bootstrap-fix | - | ✅ CI workflow aktif |
| 10 | Skills kurulumu + SKILLS_TR.md + skills-tr/ | feature/skills-tr | - | Türkçe skill dokümanları var |
| 25 | Game Core: 6x6 grid + arrow move + remove | feature/engine-core | - | 5 level oynanır |
| 15 | Level pipeline: JSON schema + loader + 5 level | feature/levels | - | level değiştirilebilir |
| 10 | Win condition + fail state + undo(1) | feature/rules | - | unit test var |
| 10 | Rescue UI: win modal + albüm(localStorage) | feature/album | - | UI bozulmadan |
| 10 | Telegram wrapper: initData okuma + share link | feature/telegram | - | share tıklanır |
| 5  | Lint+SAST+build gate | feature/quality | - | PR kapısı |
| 5  | Deploy (Vercel/Netlify) + README | feature/deploy | - | canlı link |

## Tarihçe
- 2025-02-21: Repo bootstrap tamamlandı
  - Template kuruldu (React + TS + Vite + tma.js)
  - Phaser 3 yüklendi
  - Vitest konfigüre edildi
  - AGENTS.md + PROGRESS.md + copilot-instructions.md oluşturuldu
  - Dosya yapısı kuruldu (game, telegram, storage, content, tests)
  - Kritik düzeltmeler: base path env, pnpm kaldırıldı, PR template, CI workflow
- 2025-02-21: npm test ✅ + npm run build ✅
  
