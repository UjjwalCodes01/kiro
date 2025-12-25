# 🧪 Testing Guide - NCR Local Guide Bot

## Quick Test (2 minutes)

### 1. Start the Server

```bash
npm install
npm start
```

You should see:
```
✅ Kiro initialized with NCR Local Guide context
🚀 NCR Local Guide Bot running on http://localhost:3001
📝 API endpoint: http://localhost:3001/api/ask
```

### 2. Open in Browser

Visit: **http://localhost:3001**

You should see:
- Purple gradient header with "🗺️ NCR Local Guide Bot"
- Input field for queries
- Suggestion pills
- Response area

### 3. Test a Query

Click on "🥟 Best Momos" suggestion, and you should get a response like:
```
"Bhai, momos? Raj Nagar Extension jao! Vahan par har corner pe momos milenge..."
```

---

## Comprehensive Test Suite

### Category 1: Slang Translation Tests

#### Query 1.1: Explain Jugaad
```
Input: "Explain jugaad"
Expected: Hinglish explanation of "jugaad" as a smart workaround
Example Response: "Jugaad, bhai? Yeh to NCR ki jaan hai! Jugaad matlab..."
```

**Test Result:** ✅ / ❌

#### Query 1.2: Scene Kya Hai
```
Input: "Scene kya hai?"
Expected: Explanation that "scene" means situation/happening
```

**Test Result:** ✅ / ❌

#### Query 1.3: Bhaiya Meaning
```
Input: "What does bhaiya mean?"
Expected: Explanation of respectful address, usage examples
```

**Test Result:** ✅ / ❌

---

### Category 2: Food Recommendations

#### Query 2.1: Momos Location
```
Input: "Bhaiya, Raj Nagar me best momos kaha milenge?"
Expected: Specific recommendation for Raj Nagar Extension
Should mention: Location, price range (₹50-100), why it's good
```

**Test Result:** ✅ / ❌

#### Query 2.2: Chaat Spots
```
Input: "Best chaat spots in Ghaziabad?"
Expected: Mention Turab Nagar, prices, specific items
```

**Test Result:** ✅ / ❌

#### Query 2.3: Parathas
```
Input: "Parathas ke liye best spot?"
Expected: Recommend Old Ghaziabad area, prices, types
```

**Test Result:** ✅ / ❌

#### Query 2.4: Butter Chicken
```
Input: "Best butter chicken kaha?"
Expected: Recommend Sahibabad area dhabas
```

**Test Result:** ✅ / ❌

---

### Category 3: Traffic & Travel

#### Query 3.1: Ghaziabad to Noida
```
Input: "Ghaziabad se Noida kitna time?"
Expected: Time estimate based on time of day, mentions peak hours
Example: "30-40 minutes at normal time, 1.5-2 hours during peak"
```

**Test Result:** ✅ / ❌

#### Query 3.2: Peak Hours
```
Input: "What are peak traffic hours in NCR?"
Expected: Mention 8-10 AM and 6-9 PM, warn about specific routes
```

**Test Result:** ✅ / ❌

#### Query 3.3: Route Alternative
```
Input: "Is NH-24 crowded in evening?"
Expected: Yes, explain why, suggest alternatives like Ghaziabad Bypass
```

**Test Result:** ✅ / ❌

---

### Category 4: Cultural Context

#### Query 4.1: Local Customs
```
Input: "Tell me about NCR culture"
Expected: Mention friendly nature, chai culture, football popularity
```

**Test Result:** ✅ / ❌

#### Query 4.2: Festivals
```
Input: "How are festivals celebrated in NCR?"
Expected: Mention Diwali, Holi, Eid, etc.
```

**Test Result:** ✅ / ❌

---

### Category 5: Edge Cases & Natural Language

#### Query 5.1: Informal Language
```
Input: "Yaar, khana kaha hai?"
Expected: Understands informal Hindi, responds in kind
```

**Test Result:** ✅ / ❌

#### Query 5.2: Multiple Questions
```
Input: "Jugaad kya hai aur best momos kaha?"
Expected: Handles both questions, prioritizes one
```

**Test Result:** ✅ / ❌

#### Query 5.3: Off-Topic Query
```
Input: "What's the weather like?"
Expected: Politely redirects to NCR topics
```

**Test Result:** ✅ / ❌

#### Query 5.4: Empty Query
```
Input: ""
Expected: Error message asking for input
```

**Test Result:** ✅ / ❌

---

## API Testing with cURL

### Test 1: Slang Query
```bash
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"Explain jugaad"}'
```

Expected response:
```json
{
  "query": "Explain jugaad",
  "response": "Jugaad, bhai? Yeh to NCR ki jaan hai!...",
  "timestamp": "2024-12-25T10:30:00.000Z",
  "source": "Kiro AI"
}
```

### Test 2: Food Query
```bash
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"Best momos?"}'
```

### Test 3: Traffic Query
```bash
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"Ghaziabad se Noida time?"}'
```

### Test 4: Health Check
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "kiroStatus": "initialized",
  "timestamp": "2024-12-25T10:30:00.000Z"
}
```

---

## Performance Testing

### Load Test
```bash
# Install Apache Bench
# macOS: brew install httpd
# Ubuntu: sudo apt-get install apache2-utils

# Run 100 requests with 10 concurrent
ab -n 100 -c 10 -p test.json -T application/json http://localhost:3001/api/ask
```

Expected: < 500ms average response time

### Response Time Test
```bash
# Time how long queries take
time curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"Best momos?"}'
```

Expected: < 1000ms total

---

## Frontend Testing Checklist

### UI Elements
- [ ] Header displays correctly
- [ ] Input field accepts text
- [ ] Suggestion pills are clickable
- [ ] Ask button works
- [ ] Loading spinner appears while processing
- [ ] Response displays in response box
- [ ] Metadata (timestamp, source) shows

### Responsive Design
- [ ] Desktop (1920x1080) - looks good
- [ ] Tablet (768x1024) - responsive layout
- [ ] Mobile (375x667) - mobile-optimized

### Error Handling
- [ ] Empty query shows error message
- [ ] Server error shows friendly message
- [ ] Network timeout shows retry option

### Accessibility
- [ ] Can navigate with keyboard
- [ ] Input field has focus on load
- [ ] Color contrast is readable
- [ ] Text size is appropriate

---

## Manual Test Cases

### Test Case 1: User Journey
```
1. User visits http://localhost:3001
2. Sees beautiful interface
3. Types: "Explain jugaad"
4. Clicks "Ask Kiro"
5. Waits for response
6. Reads Hinglish explanation
7. Tries another query
```

Expected: All steps work smoothly

### Test Case 2: Food Discovery
```
1. User wants street food in Ghaziabad
2. Clicks "🍛 Chaat Spots" pill
3. Gets recommendations with prices
4. Understands why those spots are good
5. Wants to go try them
```

Expected: User satisfied with recommendations

### Test Case 3: Traffic Planning
```
1. User wants to travel from Ghaziabad to Noida
2. Asks: "Ghaziabad se Noida jane me kitna time?"
3. Gets realistic estimate
4. Learns about peak hours
5. Gets alternative route suggestion
```

Expected: User can make informed travel decision

---

## Sample Test Data / Queries

### Test Batch 1: Slang
```
1. Explain jugaad
2. What is scene kya hai?
3. Bhaiya ka matlab?
4. Explain chappal
5. What is mast?
```

### Test Batch 2: Food
```
1. Best momos kaha?
2. Chaat in Ghaziabad?
3. Parathas near me
4. Butter chicken restaurants
5. Chai spots
```

### Test Batch 3: Traffic
```
1. Ghaziabad to Noida time
2. NH-24 traffic status
3. Peak hours in NCR
4. DND flyway condition
5. Best time to travel
```

### Test Batch 4: Culture
```
1. Tell me about NCR culture
2. Local customs in Delhi
3. Festivals in NCR
4. Cricket obsession
5. Street vendors
```

---

## Automated Testing (Optional)

### Jest Test Example
```javascript
describe('NCR Local Guide Bot API', () => {
  
  test('should respond to slang query', async () => {
    const response = await fetch('/api/ask', {
      method: 'POST',
      body: JSON.stringify({ query: 'Explain jugaad' })
    });
    const data = await response.json();
    expect(data.response).toContain('jugaad');
  });

  test('should handle food queries', async () => {
    const response = await fetch('/api/ask', {
      method: 'POST',
      body: JSON.stringify({ query: 'Best momos?' })
    });
    const data = await response.json();
    expect(data.response).toContain('momos');
  });

  test('should return error for empty query', async () => {
    const response = await fetch('/api/ask', {
      method: 'POST',
      body: JSON.stringify({ query: '' })
    });
    expect(response.status).toBe(400);
  });

});
```

---

## Testing Checklist

### Before Submission
- [ ] All 30+ test queries work correctly
- [ ] Response times < 1000ms
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Error messages are friendly
- [ ] Hinglish tone is consistent
- [ ] Food recommendations are accurate
- [ ] Traffic info is realistic
- [ ] API health check works
- [ ] .kiro/product.md is being used

### Before Deployment
- [ ] Test on staging environment
- [ ] Test with fresh npm install
- [ ] Test in incognito mode (no cache)
- [ ] Test on different browsers
- [ ] Test on slow network (DevTools throttle)
- [ ] Test with Kiro API key set and unset
- [ ] Verify all files are committed to git

---

## Debugging Tips

### If responses are generic:
```bash
# Check if product.md is being read
grep -i "jugaad" .kiro/product.md

# Verify Kiro is initialized
# Look for: "✅ Kiro initialized" in terminal
```

### If API returns error:
```bash
# Check server logs
# Look for error messages in terminal

# Test with simple query
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"hello"}'
```

### If frontend doesn't load:
```bash
# Check browser console (F12 → Console tab)
# Look for JavaScript errors

# Verify public/index.html exists
ls -la public/index.html

# Check server is running
curl http://localhost:3001/
```

---

## Success Criteria

✅ **Your testing is successful when:**

1. All 30+ test queries return relevant responses
2. Responses use Hinglish naturally
3. Food recommendations are specific and helpful
4. Traffic information is realistic
5. Slang is explained clearly with examples
6. Response time < 1 second
7. UI is responsive and error-free
8. Health check endpoint works
9. API returns proper JSON format
10. No console errors

---

Good luck with testing! 🚀
