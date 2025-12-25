# 🚀 Deployment & Hackathon Submission Guide

## Quick Setup Checklist

### Local Testing (Before Deployment)

```bash
# 1. Install dependencies
npm install

# 2. Run the app locally
npm start

# 3. Open in browser
# Visit: http://localhost:3001

# 4. Test with queries:
# - "Explain jugaad"
# - "Best momos in Raj Nagar?"
# - "Traffic Ghaziabad to Noida?"
```

### Verify Project Structure

```bash
# Make sure you have:
ls -la .kiro/product.md      # ✅ Context file exists
ls -la src/server.js          # ✅ Backend exists
ls -la public/index.html      # ✅ Frontend exists
ls -la package.json           # ✅ Dependencies listed
```

---

## 📦 GitHub Deployment

### Step 1: Initialize Git Repository

```bash
cd /your-project-path
git init
git add .
git commit -m "Initial commit: NCR Local Guide Bot powered by Kiro AI"
```

### Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create repo: `ncr-local-guide-bot`
3. Add description: "A friendly local guide for Delhi NCR powered by Kiro AI"
4. Make it **PUBLIC** (required for hackathon)
5. Don't initialize README (we already have one)

### Step 3: Push to GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/ncr-local-guide-bot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Verify .kiro is Committed

```bash
# Check that .kiro is in git (NOT in .gitignore)
git ls-files | grep .kiro

# You should see:
# .kiro/product.md
```

**If .kiro is missing:**
```bash
# Remove from gitignore if needed
nano .gitignore
# Remove any line with ".kiro"

# Re-add and commit
git add .kiro/
git commit -m "Add .kiro context directory"
git push
```

### Step 5: GitHub Repository Checklist

- ✅ Repository is PUBLIC
- ✅ `.kiro/product.md` is committed
- ✅ All source files present
- ✅ README.md is descriptive
- ✅ package.json has correct scripts
- ✅ `.gitignore` doesn't exclude `.kiro/`

**GitHub URL for submission:**
```
https://github.com/YOUR_USERNAME/ncr-local-guide-bot
```

---

## 🌐 Deploy to Vercel (Recommended for Hackathon)

### Why Vercel?
- ✅ Free tier with generous limits
- ✅ 1-click deployment from GitHub
- ✅ Auto-deploys on git push
- ✅ Free HTTPS and custom domain

### Deployment Steps

#### 1. Login to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

#### 2. Deploy Project

```bash
vercel
```

Follow the prompts:
- Link to existing project? → No
- Which scope? → Your account
- Project name? → `ncr-local-guide-bot`
- Framework? → Other
- Directory? → ./

#### 3. Environment Variables (if using Kiro API)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Add: `KIRO_API_KEY=your_key_here`

#### 4. Verify Deployment

Visit: `https://your-project.vercel.app`

---

## 🚀 Alternative: Deploy to Heroku

### Why Heroku?
- Node.js friendly
- Free tier available
- Good for backend APIs

### Deployment Steps

```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
heroku create ncr-local-guide-bot

# 4. Deploy
git push heroku main

# 5. View live
heroku open
```

**Heroku URL:**
```
https://ncr-local-guide-bot.herokuapp.com
```

---

## 🐳 Deploy to AWS (Advanced)

### Option 1: AWS Elastic Beanstalk

```bash
# 1. Install EB CLI
pip install awsebcli

# 2. Initialize
eb init -p node.js-18 ncr-local-guide-bot

# 3. Create environment
eb create ncr-local-guide-bot-env

# 4. Deploy
eb deploy

# 5. Open
eb open
```

### Option 2: EC2 + PM2

```bash
# On EC2 instance:

# 1. Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 2. Clone repo
git clone https://github.com/YOUR_USERNAME/ncr-local-guide-bot.git
cd ncr-local-guide-bot

# 3. Install dependencies
npm install

# 4. Install PM2 (process manager)
sudo npm install -g pm2

# 5. Start app
pm2 start src/server.js --name "kiro-app"
pm2 startup
pm2 save

# 6. Setup Nginx (optional, for reverse proxy)
sudo yum install -y nginx
sudo systemctl start nginx
```

---

## 📸 Prepare Screenshots for Blog

### What to Capture

1. **product.md Content**
   ```bash
   # Terminal screenshot showing:
   cat .kiro/product.md
   ```

2. **Running Server**
   ```bash
   # Terminal showing:
   npm start
   # Output: "🚀 NCR Local Guide Bot running on http://localhost:3001"
   ```

3. **Frontend UI**
   - Take screenshot of http://localhost:3001
   - Show the beautiful purple gradient interface

4. **Example Queries & Responses**
   - "Explain jugaad" → Full Hinglish response
   - "Best momos?" → Food recommendations
   - "Traffic to Noida?" → Traffic insights

5. **API Response** (using Postman or cURL)
   ```json
   {
     "query": "Explain jugaad",
     "response": "Jugaad, bhai? Yeh to NCR ki jaan hai!...",
     "source": "Kiro AI"
   }
   ```

6. **Architecture Diagram**
   - Use Draw.io or Lucidchart to create
   - Show: User → API → Kiro → product.md

7. **Code Snippet**
   ```javascript
   // Show Kiro integration code from server.js
   ```

### Tools to Use
- **Screenshots:** Win+Shift+S (Windows) or Cmd+Shift+4 (Mac)
- **Recording:** OBS Studio or ScreenFlow
- **GIF Creation:** ScreenToGif or ffmpeg

---

## 📝 Blog Post Submission

### AWS Builder Center

1. **Sign up:** [aws.amazon.com/blogs/](https://aws.amazon.com/blogs/)
2. **Create account** if needed
3. **Write article** using their editor
4. **Include:**
   - Title: "Building a Smart Local Guide in 3 Days with Kiro AI"
   - 2,000-2,500 words
   - 5-7 screenshots/GIFs
   - Code snippets
   - Link to GitHub repo
   - Your learnings and insights

### Blog Structure

```
📌 Title: Building a Smart Local Guide in 3 Days with Kiro AI

📖 Introduction (200 words)
- Hook: hackathon challenge
- Problem: generic AI doesn't understand local culture
- Solution: Kiro + custom context

🎯 Problem Statement (300 words)
- Limitations of traditional AI
- Why local knowledge matters
- Examples of bad vs good responses

💡 Solution Architecture (400 words)
- Kiro overview
- product.md approach
- Code example (hardcoding vs Kiro)
- Architecture diagram

🔧 Implementation (600 words)
- Frontend code snippet
- Backend API code
- Kiro integration
- Screenshots of queries

📊 Results & Impact (300 words)
- Development time saved
- Quality improvements
- Scalability benefits
- Metrics

🎓 Key Learnings (400 words)
- Technical insights
- Product insights
- Why context matters
- Applicability to other domains

🚀 Next Steps (200 words)
- Expand to more cities
- Add more features
- Open-source opportunities

📚 Resources (100 words)
- GitHub link
- Kiro documentation
- Related articles
```

---

## 🎯 Dashboard Submission

### Before Submitting

Prepare:
1. **GitHub Repository URL**
   ```
   https://github.com/YOUR_USERNAME/ncr-local-guide-bot
   ```

2. **AWS Builder Center Blog URL**
   ```
   https://aws.amazon.com/blogs/[your-blog-path]
   ```

3. **Live Demo URL** (Vercel/Heroku)
   ```
   https://your-project.vercel.app
   ```

### Submit to Dashboard

1. Go to **AI for Bharat Dashboard** (provided by organizers)
2. Select **Week 5: The Local Guide**
3. Submit:
   - [ ] GitHub repository link (public, with .kiro committed)
   - [ ] AWS Builder Center blog link
   - [ ] Optional: Live demo URL
   - [ ] Short description (250 words)

### Submission Deadline
⏰ **28th December, 2024 at 11:59 PM IST**

---

## ✅ Final Checklist

### Code Quality
- [ ] No console errors
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Fast load time (< 2 seconds)
- [ ] Error handling for edge cases
- [ ] API rate limiting (optional but good)

### Documentation
- [ ] README.md is complete and clear
- [ ] Code comments explain key sections
- [ ] Setup instructions work for others
- [ ] Architecture diagram included

### GitHub Repository
- [ ] PUBLIC repository
- [ ] `.kiro/product.md` is committed (not gitignored)
- [ ] All dependencies in package.json
- [ ] .gitignore is correct
- [ ] No API keys in code

### Deployment
- [ ] App runs locally without errors
- [ ] Deployed on Vercel/Heroku/AWS
- [ ] Live URL is accessible
- [ ] All features work in production

### Blog Post
- [ ] 2,000-2,500 words
- [ ] 5-7 screenshots/GIFs
- [ ] Code snippets included
- [ ] Links to GitHub and live demo
- [ ] Published on AWS Builder Center

### Submission
- [ ] GitHub link submitted
- [ ] Blog link submitted
- [ ] Within deadline (Dec 28, 11:59 PM IST)
- [ ] All required fields filled

---

## 🎉 Success!

Once you complete these steps:

1. ✅ GitHub repository is live and public
2. ✅ App is deployed and accessible
3. ✅ Blog post published and shared
4. ✅ Both links submitted to dashboard

**You're ready for review!**

---

## 📞 Troubleshooting

### Issue: .kiro directory not in GitHub

```bash
# Check if it's in .gitignore
grep -i ".kiro" .gitignore

# If found, remove it
nano .gitignore

# Re-add and commit
git rm --cached .kiro -r
git add .kiro/
git commit -m "Add .kiro directory"
git push
```

### Issue: npm install fails

```bash
# Clear cache
npm cache clean --force

# Try again
npm install
```

### Issue: Port 3001 already in use

```bash
# Windows: Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux: Kill process
lsof -i :3001
kill -9 <PID>

# Or use different port
PORT=3002 npm start
```

### Issue: Kiro API key not working

```bash
# Check environment variable
echo $KIRO_API_KEY

# Or in .env file
cat .env

# Set manually
export KIRO_API_KEY="your_key"
npm start
```

---

Good luck with your submission! 🚀
