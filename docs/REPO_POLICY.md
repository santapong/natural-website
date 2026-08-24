# Repository Policy — natural-wild

Scope: rules for code, commits, secrets, dependencies and reviews in
[`santapong/natural-website`](https://github.com/santapong/natural-website).

## 1. Ownership

| Role | Holder |
|------|--------|
| Owner / final approver | @santapong |
| Maintainers | added by owner only |

## 2. Branch protection (main)

`main` is the single source of truth:

- No force-pushes, no history rewrites.
- Direct pushes allowed **only** for docs typos and CI fixes; everything
  else goes through a feature branch + PR (see `BRANCH_POLICY.md`).
- A PR may merge when: CI green (`npm run lint`, `npm run typecheck`,
  `npm run build`) **and** one approving review (the owner counts as one).

## 3. Commit conventions

Format — [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional scope): imperative summary ≤ 72 chars

optional body: what & why, not how
```

Allowed types: `feat` `fix` `perf` `refactor` `docs` `style` `test`
`chore` `ci`.

Examples from this repo's history:

```
feat: Add world map mode with clickable biome beacons
fix(shader): remove duplicate color attribute declaration
docs: add 3D website types & styles reference
```

Small, single-purpose commits. Never mix a refactor with a feature.

## 4. Code standards

- TypeScript strict; no `any` in new code (`unknown` + narrowing instead).
- Lint is law: `npm run lint` must pass (React Compiler rules included —
  mutate refs inside `useFrame`, not render scope).
- Every visual feature must pass `npm run typecheck`, `lint`, and `build`
  before its PR is marked ready.
- 3D perf budget: keep total draw calls ≲ 100; prefer instancing and shader
  points over individual meshes.
- Accessibility: interactive DOM overlays need labels/aria; respect
  `prefers-reduced-motion` where motion is decorative.

## 5. Secrets & environment

- Never commit tokens, keys or `.env*` files (already gitignored).
- GitHub token lives in the local keyring via `gh auth`, never in files.

## 6. Dependencies

- Adding a runtime dependency requires a stated reason in the PR body.
- Prefer what three/drei/r3f already ship (e.g. no extra physics lib while
  hand-rolled integration suffices).
- After dependency changes run `npm install` and commit the updated
  `package-lock.json` in the same PR.

## 7. Assets & media

- Procedural-first: geometry/shaders over binary assets where possible.
- Binary art goes in `public/`, named `kebab-case`, and should stay under
  ~500 KB each unless discussed.

## 8. Documentation

Any user-visible behaviour change updates, in the same PR:

1. `README.md` (features/modes)
2. `CHANGELOG.md` (a bullet under **Unreleased**)
3. `docs/ARCHITECTURE.md` + regenerate/adjust `docs/architecture.svg`
   if data-flow changed
