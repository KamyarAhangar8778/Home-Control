# Module Repository Sync

`Home-Control` is the main workspace, and the three child repositories remain independently usable repositories. Git Subtree is used to preserve commit history while syncing the contents of each module folder.

| Parent folder | Child repository |
| --- | --- |
| `Hardware/` | `KamyarAhangar8778/Home-Control-Hardwar-Codes` |
| `Database/` | `KamyarAhangar8778/Home-Control-DB` |
| `Dashboard/` | `KamyarAhangar8778/Home-Control-Dashboard` |

## What happens on a push?

- A push to a module folder in the parent triggers the parent workflow. It first fetches the latest `main` from all child repositories, merges new child commits into their corresponding folders, pushes any reconciliation merge back to the parent, then splits and pushes each folder to its matching child repository.
- A push to any child repository triggers that child's `.github/workflows/sync-to-parent.yml`. If the `PARENT_SYNC_TOKEN` secret is configured, it requests an immediate run of the parent workflow.
- A scheduled run of the parent workflow checks for child-only commits every 10 minutes as a fallback, including when the immediate-dispatch secret has not yet been configured.
- If the same change is already present, Git should report that the subtree is up to date; it must not create another content change just to make the workflow loop.

## Required secrets

### In the parent repository: `Home-Control`

Keep the existing repository secret named `CHILD_REPOS_TOKEN`. Its fine-grained PAT needs access to all three child repositories with **Contents: Read and write**. The workflow uses it to fetch and push the child repositories.

### In each child repository

For immediate reverse synchronization, create a repository secret named `PARENT_SYNC_TOKEN` in each of the three child repositories.

The fine-grained PAT used for this secret should be restricted to `KamyarAhangar8778/Home-Control` and have **Actions: Read and write** permission so the child workflow can dispatch `sync-modules.yml` in the parent repository. Do not commit the token to a file or include it in command output.

The child workflow deliberately exits successfully with a warning if `PARENT_SYNC_TOKEN` is absent. In that case, the scheduled parent workflow should still find the child commit on its next run.

## Commit messages and history

- The workflow uses `git subtree add/pull/split` without `--squash`, so it does not squash away the original child commits.
- Original commit messages, authors, and timestamps are retained when those commits are imported. Synchronization may add a clearly named merge commit such as `chore: reconcile Dashboard with KamyarAhangar8778/Home-Control-Dashboard`.
- When a commit created in the parent is split into a child repository, its Git object SHA can differ because the subtree's path and parent graph are different. The commit message and author metadata are preserved where Git Subtree can map them; identical hashes across the parent and child should not be assumed for every mirrored commit.
- The workflow never uses `git push --force`. If the same lines were changed differently in the parent and child, Git stops with a conflict rather than silently discarding either change. Resolve the conflict in the corresponding folder, commit and push the resolution, then rerun the workflow.

## Recommended working style

You may develop in the parent repository or work directly in a child repository. To keep the history clean, use informative commit messages such as `feat: add module health status endpoint`, `fix: handle reconnect after socket timeout`, or `docs: clarify dashboard configuration`. Avoid making independent edits to the same file in both places at the same time; if both sides change the same lines, a manual conflict resolution may be required.
