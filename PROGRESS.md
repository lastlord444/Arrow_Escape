# PROGRESS — Arrow Rescue TMA

| % | Milestone | PR | Owner (Model) | DoD |
|---:|---|---|---|---|
| 10 | Repo bootstrap + AGENTS.md + PROGRESS.md + copilot instructions | feature/bootstrap | - | ✅ npm dev/build/test çalışır |
| 5 | Bootstrap fix: base path, pnpm sil, PR template, CI | feature/bootstrap-fix | - | ✅ CI workflow aktif |
| 10 | Skills kurulumu + SKILLS_TR.md + skills-tr/ | feature/skills-tr | - | Türkçe skill dokümanları var |
| 25 | Game Core: 6x6 grid + arrow move + win condition + level loader | feature/engine-core | - | ✅ Grid, move, win, level loader, 1 valid level |
| 15 | Level pipeline: 5 level JSON + loader + tests | feature/levels-data | - | ✅ 5 valid 6x6 levels |
| 10 | Win condition + fail state + undo | feature/rules | - | unit test var |
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
- 2025-02-21: Engine core tamamlandı (PR #2 merge)
  - /src/game/types.ts, grid.ts, level.ts, rules.ts, move.ts yazıldı
  - /src/game/phaser/ArrowEscapeScene.ts, createGame.ts yazıldı
  - Unit testler eklendi (GRID_SIZE, parseLevel, checkWin, move rules)
  - npm test ✅ (11/11) + npm run lint ✅ + npm run build ✅
- 2025-02-21: 5 JSON level + loader tamamlandı
  - /src/content/levels/level-1.json ... level-5.json (6x6, valid)
  - /src/content/levels/index.ts (loader, getLevelById, getAllLevels)
  - Unit testler eklendi (5 levels valid, unique IDs)
  - npm test ✅ (18/18) + npm run lint ✅ + npm run build ✅
