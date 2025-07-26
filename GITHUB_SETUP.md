# GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click "New repository" (green button)
3. Repository name: `planix` (or your preferred name)
4. Set to **Public** or **Private**
5. **DO NOT** initialize with README (we already have files)
6. Click "Create repository"

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
# Navigate to your Planix folder
cd /app/Planix

# Add the remote origin (replace 'yourusername' with your actual GitHub username)
git remote add origin https://github.com/yourusername/planix.git

# Rename branch to main (GitHub default)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Fix Authentication Issues

If you get authentication errors:

### Option A: Personal Access Token (Recommended)
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` permissions
3. Use token as password when prompted

### Option B: SSH Key (More Secure)
1. Generate SSH key: `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys → New SSH key
3. Use SSH URL instead: `git remote set-url origin git@github.com:yourusername/planix.git`

## Step 4: Verify Upload

1. Refresh your GitHub repository page
2. You should see all files uploaded
3. Check that:
   - ✅ `backend/` folder exists
   - ✅ `frontend/` folder exists  
   - ✅ `README.md` is displayed
   - ❌ `.env` files are NOT visible (correct - they're private)

## Common Git Errors & Solutions

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/yourusername/planix.git
```

### Error: "Updates were rejected"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: "Authentication failed" 
- Use Personal Access Token instead of password
- Or set up SSH key (more secure)

## For Collaborators/New Installs

When someone clones your repo:
1. They need to create their own `.env` files using `.env.example`
2. They need to add their own MongoDB and API credentials
3. Follow the `SETUP_GUIDE.md` instructions