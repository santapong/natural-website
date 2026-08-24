# Branch Policy — natural-wild

How work moves from idea to `main`.

## 1. Branch model

Single long-lived branch:

```
main  ── always deployable, protected (see REPO_POLICY.md)
```

All work happens on short-lived branches cut from `main` and merged back
via squash-merge PRs.

## 2. Naming

```
<type>/<short-kebab-description>[-optional-issue]
```

| Prefix | Use for | Example |
|--------|---------|---------|
| `feat/` | new capability | `feat/music-fireflies` |
| `fix/` | bug fix | `fix/fjord-wall-clip` |
| `perf/` | performance only | `perf/instanced-grass` |
| `docs/` | documentation only | `docs/architecture-svg` |
| `chore/` | tooling, deps, CI | `chore/bump-three` |
| `spike/` | throwaway experiment (never merges) | `spike/water-shader-v2` |

Rules: lowercase, kebab-case, ASCII, ≤ 40 chars after the prefix.

## 3. Lifecycle

```
1  git switch main && git pull
2  git switch -c feat/my-thing          # branch from fresh main
3  commit small & often (Conventional Commits)
4  git push -u origin feat/my-thing     # first push opens the PR draft
5  mark PR "Ready for review" when CI is green
6  squash-merge into main               # branch auto-deleted
7  delete local branch                  # git branch -D feat/my-thing
```

### Definition of ready-to-merge

- [ ] `npm run lint` ✅ · `npm run typecheck` ✅ · `npm run build` ✅
- [ ] Smoke-tested in browser (`npm run dev`) at 60 fps-ish on a laptop
- [ ] Docs updated (README / CHANGELOG / ARCHITECTURE if flow changed)
- [ ] No console errors or shader warnings introduced
- [ ] One approving review

## 4. Merge style

**Squash-merge only.** The squash title becomes a Changelog-worthy entry:

```
feat: add world map mode with clickable biome beacons (#12)
```

Merge commits and rebase-merges are not used — history stays linear and
each `main` commit = one shippable change.

## 5. Tags & releases

- Tags follow **SemVer**: `vMAJOR.MINOR.PATCH`.
- Cutting a release: move the CHANGELOG **Unreleased** bullets under a new
  version heading with the date, bump `package.json`, tag, push:

```bash
npm version minor        # e.g. 0.8.0 → 0.9.0 (creates the tag)
git push origin main --follow-tags
```

- PATCH = fixes/docs; MINOR = new features/modes; MAJOR = breaking content
  structure (unlikely for a site).

## 6. Emergency hotfixes

For a broken main: branch `hotfix/<desc>` straight from `main`, minimal
diff, same CI gates, squash-merge immediately, then update CHANGELOG.

## 7. Hygiene

- Branches older than 30 days without commits may be deleted by the owner.
- Never commit generated artefacts: `.next/`, `node_modules/`,
  `*.tsbuildinfo` are already ignored — keep it that way.
