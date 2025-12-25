# 🚀 Quick Reference Card - NCR Local Guide Bot

## In 30 Seconds

```
What: AI-powered local guide for Delhi NCR
Why: Generic AI doesn't understand local culture
How: Kiro + custom context file (product.md)
Built with: Node.js, Express, Kiro SDK
Time taken: 4-6 hours
```

---

## Commands You'll Need

### Setup
```bash
npm install           # Install dependencies
npm start             # Run server (localhost:3001)
npm test              # Run tests (if added)
```

### Testing
```bash
# Browser test
http://localhost:3001

# API test
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"Explain jugaad"}'

# Health check
curl http://localhost:3001/api/health
```

### Git
```bash
git add .             # Stage all files
git commit -m "msg"   # Commit changes
git push origin main  # Push to GitHub
git ls-files | grep .kiro  # Verify .kiro is committed
```

### Deployment
```bash
# Vercel
vercel

# Heroku
heroku create app-name
git push heroku main
```

---

## File Locations

```
.kiro/product.md              → Knowledge base
src/server.js                 → Backend API
public/index.html             → Frontend UI
README.md                      → Documentation
DEPLOYMENT_GUIDE.md           → How to deploy
TESTING_GUIDE.md              → Test procedures
BLOG_POST_DRAFT.md            → Blog template
ARCHITECTURE.md               → System design
SUBMISSION_CHECKLIST.md       → Final checklist
```

---

## Key Information

### Endpoints
```
POST /api/ask      → Submit query
GET /api/health    → Health check
GET /              → Frontend
```

### Query Examples
```
"Explain jugaad"
"Best momos kaha?"
"Ghaziabad se Noida time?"
"NCR culture"
```

### Expected Responses
```
Hinglish tone ✓
Specific locations ✓
Price ranges ✓
Cultural context ✓
Natural language ✓
```

---

## Submission Checklist

- [ ] Code works locally
- [ ] .kiro/product.md committed
- [ ] Deployed to live URL
- [ ] Blog published
- [ ] Both links submitted
- [ ] Before Dec 28, 11:59 PM IST

---

## Useful Links

**Your Code:**
- GitHub: https://github.com/YOUR_USERNAME/ncr-local-guide-bot
- Live: https://your-app.vercel.app

**Documentation:**
- [README.md](README.md) - Full documentation
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - How to deploy
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing procedures

**Resources:**
- [Kiro Documentation](https://kiro.ai/docs)
- [Express.js Guide](https://expressjs.com/)
- [AWS Builder Center](https://aws.amazon.com/blogs/)

---

## Troubleshooting

### Port 3001 in use?
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

### npm install fails?
```bash
npm cache clean --force
npm install
```

### .kiro not in git?
```bash
git rm --cached .kiro -r
git add .kiro/
git commit -m "Add .kiro directory"
git push
```

### Kiro not responding?
```bash
# Check it's initialized
grep "Kiro initialized" in terminal output

# Check product.md exists
ls -la .kiro/product.md
```

---

## Timeline (If Restarting)

- **Day 1:** Setup + Backend (2 hours)
- **Day 2:** Frontend + Testing (2 hours)
- **Day 3:** Deploy + Blog (2 hours)
- **Day 4:** Submit + Polish

**Total: 6-8 hours to complete**

---

## Contact Info

**Hackathon Dashboard:**
[Dashboard Link from Organizers]

**Questions?**
Check: DEPLOYMENT_GUIDE.md, TESTING_GUIDE.md, README.md

**Emergency:**
Contact hackathon organizers on Discord/email

---

## Success Metrics

```
✓ App runs locally
✓ Frontend loads
✓ Queries return responses
✓ Tone is Hinglish
✓ API works
✓ Deployed live
✓ Blog published
✓ Links submitted
```

**If all ✓, you're done!**

---

## Remember

1. **MOST IMPORTANT:** `.kiro/product.md` must be committed to GitHub
2. **DEADLINE:** 28th December, 2024 at 11:59 PM IST
3. **REQUIRED:** Both GitHub link AND blog link
4. **SUBMISSION:** Use AI for Bharat dashboard

---

**Built with ❤️ for AI for Bharat Hackathon**

**Powered by Kiro AI 🚀**

---

## Last Minute Checklist (30 mins before deadline)

```bash
# 1. Final git push
git add .
git commit -m "Final submission"
git push origin main

# 2. Verify GitHub
# Visit: https://github.com/YOUR_USERNAME/ncr-local-guide-bot
# Check: .kiro/product.md is there

# 3. Test live deployment
# Visit: https://your-app.vercel.app
# Try a query

# 4. Check blog
# Visit: AWS Builder Center blog link
# Confirm: Public and correct

# 5. Submit
# Dashboard → Week 5 → Submit
# GitHub link + Blog link + Submit button

echo "✅ SUBMITTED!"
```

---

**Go live! 🚀**
