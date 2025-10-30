# emergency-theme-backup-action
Automatically creates and maintains an Emergency Theme backup branch on every merge to main. No tokens required, simple setup.
This GitHub Action ensures your production theme or main branch is always backed up in a dedicated branch (`Emergency-Theme`).

It runs automatically when:
- A Pull Request to `main` is merged, or
- A direct push is made to `main`.

---

# How It Works

1. Detects `pull_request` (merged) or `push` events.  
2. Checks if a branch named `Emergency-Theme` exists.  
   - If found, it checks out and updates it.  
   - If not, it creates it from `main`.  
3. Creates an empty commit including:  
   - Event date  
   - Developer username  
   - Pull Request title or “direct push”  
4. Pushes the update to the remote repository.

This action requires no additional tokens or secrets — it uses GitHub’s default `GITHUB_TOKEN`.

---

# Example Usage

```yaml
name: Backup Before Merge

on:
  pull_request:
    types: [closed]
    branches: [main]
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: read

jobs:
  backup:
    if: >
      (github.event_name == 'pull_request' && github.event.pull_request.merged == true) ||
      (github.event_name == 'push' && !contains(github.event.head_commit.message, 'Merge pull request'))
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: Michael0967/emergency-theme-backup-action@v1.0.1






