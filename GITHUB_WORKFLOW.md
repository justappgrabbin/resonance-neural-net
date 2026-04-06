# GitHub Workflow Guide - Resonance Neural Network

## Repository

**GitHub:** https://github.com/justappgrabbin/resonance-neural-net

Your entire resonance network orchestrator is now on GitHub. This guide explains how to work with it.

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/justappgrabbin/resonance-neural-net.git
cd resonance-neural-net
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm dev
```

The dev server will start at `http://localhost:3000`

---

## Project Structure

```
resonance-neural-net/
├── client/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── orchestrator.ts          # Core neural network
│   │   │   ├── meta-orchestrator.ts     # Code assembly system
│   │   │   └── autonomous-agent.ts      # Autonomous agent core
│   │   ├── components/
│   │   │   ├── NeuralMeshVisualizer.tsx # Visualization
│   │   │   ├── MetaOrchestratorPanel.tsx
│   │   │   └── AutonomousAgentInterface.tsx
│   │   ├── pages/
│   │   │   └── Home.tsx                 # Main interface
│   │   └── index.css                    # Styling
│   ├── index.html
│   └── public/
├── server/
│   └── index.ts                         # Express server (placeholder)
├── package.json
├── README.md
├── ORCHESTRATOR_INTEGRATION.md
├── AUTONOMOUS_SYSTEM.md
├── META_ORCHESTRATOR_GUIDE.md
├── AUTONOMOUS_AGENT_GUIDE.md
└── GITHUB_WORKFLOW.md                   # This file
```

---

## Making Changes

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions

### 2. Make Your Changes

Edit files in the `client/src/` directory:

```bash
# Example: Add a new component
echo "export default function NewComponent() { ... }" > client/src/components/NewComponent.tsx

# Example: Update the agent
nano client/src/lib/autonomous-agent.ts
```

### 3. Test Locally

```bash
pnpm dev
# Visit http://localhost:3000 and test your changes
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit message format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Build, dependencies, etc.

### 5. Push to GitHub

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

Go to GitHub and create a PR from your branch to `main`:
- https://github.com/justappgrabbin/resonance-neural-net/pulls
- Describe your changes
- Link any related issues

### 7. Merge to Main

Once reviewed and tested, merge your PR to `main`.

---

## Common Workflows

### Adding a New Feature to the Agent

```bash
# 1. Create feature branch
git checkout -b feature/agent-improvement

# 2. Edit the agent
nano client/src/lib/autonomous-agent.ts

# 3. Update the interface component
nano client/src/components/AutonomousAgentInterface.tsx

# 4. Test locally
pnpm dev

# 5. Commit
git add .
git commit -m "feat: improve agent decision-making"

# 6. Push and create PR
git push origin feature/agent-improvement
```

### Fixing a Bug

```bash
# 1. Create fix branch
git checkout -b fix/bug-description

# 2. Fix the code
nano client/src/lib/orchestrator.ts

# 3. Test the fix
pnpm dev

# 4. Commit
git add .
git commit -m "fix: resolve morphing bug in neural mesh"

# 5. Push and create PR
git push origin fix/bug-description
```

### Updating Documentation

```bash
# 1. Create docs branch
git checkout -b docs/update-guide

# 2. Update docs
nano AUTONOMOUS_AGENT_GUIDE.md

# 3. Commit
git add .
git commit -m "docs: clarify agent autonomy levels"

# 4. Push and create PR
git push origin docs/update-guide
```

---

## Syncing with Manus Deployment

### After Making Changes Locally

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Update Manus Deployment:**
   - Go to the Manus Management UI
   - Click **Settings** → **GitHub**
   - The deployment will sync from GitHub
   - Or manually trigger a redeploy

### Pulling Latest from Manus

If changes were made in Manus, pull them to your local machine:

```bash
git pull origin main
pnpm install  # If dependencies changed
pnpm dev
```

---

## Deployment

### To Manus (Built-in Hosting)

1. Make changes locally
2. Push to GitHub
3. Go to Manus Management UI
4. Click **Publish** button
5. System deploys automatically

### To External Hosting (Render, Vercel, etc.)

1. Connect your GitHub repo to the hosting platform
2. Set up automatic deployments on push to `main`
3. Platform will build and deploy automatically

**Example for Render:**
- Go to Render.com
- Create new Web Service
- Connect GitHub repo
- Set build command: `pnpm build`
- Set start command: `pnpm start`
- Deploy

---

## Useful Commands

```bash
# Check status
git status

# See recent commits
git log --oneline -10

# See all branches
git branch -a

# Switch to a branch
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# Delete a branch
git branch -d branch-name

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View differences
git diff

# Stash changes temporarily
git stash

# Apply stashed changes
git stash pop
```

---

## Collaboration

### If Multiple People Are Working

1. **Pull before starting:**
   ```bash
   git pull origin main
   ```

2. **Create feature branches:**
   ```bash
   git checkout -b feature/your-name-your-feature
   ```

3. **Push regularly:**
   ```bash
   git push origin feature/your-name-your-feature
   ```

4. **Create PRs for review:**
   - Describe changes clearly
   - Link related issues
   - Wait for review before merging

5. **Merge to main:**
   - After review and tests pass
   - Delete feature branch after merging

---

## Troubleshooting

### "fatal: not a git repository"

You're not in the project directory. Navigate to it:
```bash
cd resonance-neural-net
```

### "Your branch is behind origin/main"

Pull the latest changes:
```bash
git pull origin main
```

### "Merge conflict"

When two changes conflict:
1. Open the conflicted file
2. Resolve the conflicts (marked with `<<<<` and `>>>>`)
3. Commit the resolution:
   ```bash
   git add .
   git commit -m "resolve merge conflict"
   ```

### "Permission denied (publickey)"

Your SSH key isn't set up. Use HTTPS instead:
```bash
git remote set-url origin https://github.com/justappgrabbin/resonance-neural-net.git
```

---

## Best Practices

1. **Commit often** - Small, focused commits are easier to review
2. **Write clear commit messages** - Future you will thank you
3. **Pull before pushing** - Avoid conflicts
4. **Test before committing** - Run `pnpm dev` and verify
5. **Use branches** - Never commit directly to `main`
6. **Create PRs** - Get feedback before merging
7. **Keep documentation updated** - Update docs when you change code
8. **Use meaningful branch names** - `feature/add-voice-input` not `test123`

---

## Next Steps

1. **Clone locally:**
   ```bash
   git clone https://github.com/justappgrabbin/resonance-neural-net.git
   cd resonance-neural-net
   pnpm install
   pnpm dev
   ```

2. **Make a test change:**
   - Create a feature branch
   - Edit a file
   - Commit and push
   - Create a PR

3. **Integrate with Synthia:**
   - Update API endpoints in `autonomous-agent.ts`
   - Connect to your science lab
   - Test the integration

4. **Deploy:**
   - Push to GitHub
   - Publish from Manus or external hosting

Your resonance network is now on GitHub and ready for collaboration!
