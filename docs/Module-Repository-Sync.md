# Module Repository Sync

The root repository is the primary development workspace. Each module folder is synchronized with its matching standalone repository:

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

The first run imports module folders using `git subtree add` without `--squash`, preserving child history. Existing files at the root of `Home-Control` are not moved or deleted.

## Normal workflow

Make module changes in `Home-Control/Hardware`, `Home-Control/Database`, or `Home-Control/Dashboard`, then commit and push to the parent repository's `main` branch. GitHub Actions merges any commits that were made directly in each child repository into the corresponding parent folder, pushes that reconciliation commit to the parent if needed, and then pushes the resulting subtree history to each child's `main`.

This reconciliation is deliberately non-destructive: it does not use `git push --force`. If changes in the parent and child modify the same lines incompatibly, Git will stop on a merge conflict rather than discard either side. Resolve the conflict in the matching folder in the parent repository, commit and push the resolution, then rerun the workflow.

For consistency, prefer making changes in the parent repository. A direct commit in a child repository is supported, but its history will be pulled into the parent the next time the workflow runs. Child pushes do not themselves trigger this parent's workflow; a push to a module path in the parent, or a manual workflow dispatch, is needed to initiate reconciliation.
