# Module Repository Sync

The root repository is the development workspace. The module folders are kept in sync with their matching standalone repositories:

| Folder in `Home-Control` | Standalone repository |
| --- | --- |
| `Hardware/` | `KamyarAhangar8778/Home-Control-Hardwar-Codes` |
| `Database/` | `KamyarAhangar8778/Home-Control-DB` |
| `Dashboard/` | `KamyarAhangar8778/Home-Control-Dashboard` |

## One-time setup

1. Create a fine-grained GitHub Personal Access Token. Limit repository access to the three child repositories above and grant **Contents: Read and write**. Do not commit or paste this token into a repository file.
2. In `Home-Control`, open **Settings → Secrets and variables → Actions → New repository secret**.
3. Set the secret name to exactly `CHILD_REPOS_TOKEN` and put the token in its value.
4. Open **Actions → Sync Home-Control modules → Run workflow** and run it on the `main` branch.

The first manual run imports each child repository under its folder using `git subtree add` without `--squash`, so the module history is retained. It also attempts to push the imported subtrees back to their matching child repositories. The existing root-level files in `Home-Control` are not moved or deleted.

## Normal workflow after setup

Commit and push changes to `Hardware/`, `Database/`, or `Dashboard/` on `main` in this repository. GitHub Actions will split the changed subtree history and push it to the corresponding child repository's `main` branch.

This is a one-way workflow: develop module changes in `Home-Control`. Direct commits made independently in a child repository may cause a non-fast-forward push or a divergence that must be reconciled before syncing again.

The workflow pushes to the child repositories using `CHILD_REPOS_TOKEN`. The parent repository's own workflow token is used only to add missing module folders to `Home-Control`.
