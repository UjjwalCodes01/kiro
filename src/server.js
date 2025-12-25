const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Load product context for reference
let productContext = null;

function initializeContext() {
  try {
    const productContextPath = path.join(__dirname, '../.kiro/product.md');
    productContext = fs.readFileSync(productContextPath, 'utf-8');
    console.log('✅ Loaded NCR Local Guide context from product.md');
  } catch (error) {
    console.error('❌ Failed to load context:', error.message);
    console.log('⚠️  Using fallback responses');
  }
}

// Initialize on startup
initializeContext();

/**
 * Main endpoint: /api/ask
 * Processes user queries using context from product.md
 * Generates intelligent local guide responses
 */
app.post('/api/ask', (req, res) => {
  const { query } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Query is required',
      message: 'Please provide a valid query'
    });
  }

  try {
    console.log(`📝 Processing query: ${query}`);

    // Generate intelligent response based on context and query
    const response = generateContextAwareResponse(query);

    console.log(`✅ Response generated for: ${query}`);

    res.json({
      query,
      response: response,
      timestamp: new Date().toISOString(),
      source: 'NCR Local Guide Bot'
    });

  } catch (error) {
    console.error('❌ Error processing query:', error);
    
    const fallback = generateMockResponse(query);
    
    res.json({
      query,
      response: fallback,
      timestamp: new Date().toISOString(),
      source: 'Fallback Response'
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    contextLoaded: productContext ? true : false,
    timestamp: new Date().toISOString()
  });
});

/**
 * Context-aware response generator
 * Analyzes query and generates intelligent responses based on product.md context
 */
function generateContextAwareResponse(query) {
  const lowerQuery = query.toLowerCase();
  
  // Slang queries
  if (lowerQuery.includes('jugaad') || lowerQuery.includes('scene') || lowerQuery.includes('slang') || lowerQuery.includes('bhaiya') || lowerQuery.includes('chappal') || lowerQuery.includes('mast')) {
    return generateSlangResponse(query);
  }
  
  // Food queries
  if (lowerQuery.includes('momo') || lowerQuery.includes('chaat') || lowerQuery.includes('paratha') || 
      lowerQuery.includes('khana') || lowerQuery.includes('food') || lowerQuery.includes('eating') ||
      lowerQuery.includes('restaurant') || lowerQuery.includes('butter chicken') || lowerQuery.includes('dosa')) {
    return generateFoodResponse(query);
  }
  
  // Traffic queries
  if (lowerQuery.includes('traffic') || lowerQuery.includes('noida') || lowerQuery.includes('ghaziabad') ||
      lowerQuery.includes('commute') || lowerQuery.includes('nh-24') ||
      lowerQuery.includes('travel') || lowerQuery.includes('hours') ||
      (lowerQuery.includes('time') && (lowerQuery.includes('take') || lowerQuery.includes('long') || lowerQuery.includes('duration')))) {
    return generateTrafficResponse(query);
  }
  
  // Tips queries
  if (lowerQuery.includes('visit') || lowerQuery.includes('tourist') || lowerQuery.includes('weather') ||
      lowerQuery.includes('season') || lowerQuery.includes('safety') || lowerQuery.includes('budget') ||
      lowerQuery.includes('cost') || lowerQuery.includes('tip') || lowerQuery.includes('advice') ||
      lowerQuery.includes('first time')) {
    return generateTipsResponse(query);
  }
  
  return generateDefaultResponse(query);
}

/**
 * Generate slang-related responses
 */
function generateSlangResponse(query) {
  const lowerQuery = query.toLowerCase();

  // Specific responses based on keywords
  if (lowerQuery.includes('jugaad')) {
    return "Jugaad, bhai? Yeh to NCR ki jaan hai! Jugaad matlab ek smart, innovative tarika kisi problem ko solve karne ka... bina fancy solution banaye. Jaisa kehte hain, 'Usi se hi sab kuch theek kar do!' 😄 Yeh ek tarika hai kisi bhi mushkil ka jugaar nikalna. Real life example: Auto ka handle toot gaya to rope se bandh do - yeh jugaad hai!";
  }

  if (lowerQuery.includes('scene')) {
    return "'Scene kya hai?' bhai! Yeh phrase sab se ziada use hota hai NCR mein! 'Scene' matlab situation ya kya situation hai. Like 'Arre, scene kya hai aaj?', matlab 'What's happening today?' Ya 'Ghaziabad ka scene kaisa hai?' matlab 'How are things in Ghaziabad?' Bahut casual aur friendly phrase hai!";
  }

  if (lowerQuery.includes('bhaiya')) {
    return "'Bhaiya' ek tarika hai respectfully kisi ko address karne ka! Shopkeeper ko 'Bhaiya, ek chai do' bolte hain. Ye polite aur friendly dono hote hain! 'Bhabhi' bhi use hote hain casual mein ladies ke liye. NCR ke culture mein ye sab bahut normal hai!";
  }

  if (lowerQuery.includes('chappal')) {
    return "'Chappal' matlab slipper hota hai normally, but NCR mein sometimes 'Chappal kha jaega' matlab tum trouble mein padoge! 😄 Paise nahi ho to sab kuch mushkil ho jaata hai. Local slang hai!";
  }

  if (lowerQuery.includes('mast')) {
    return "'Mast' matlab awesome, cool, bahut acha! 'Yeh plan mast hai!' = 'This plan is awesome!' 'Mazaa aaya' = 'Had fun!' Ye sab everyday phrases hain NCR mein!";
  }

  // Default slang response
  return "NCR mein bahut saare slang hote hain! Jaisa ke 'jugaad' (smart workaround), 'scene kya hai?' (what's happening?), 'bhaiya' (respectful address), 'mast' (awesome), aur 'chappal' (slipper or trouble)! Kya specific slang poochna chahte ho?";
}

/**
 * Generate food-related responses
 */
function generateFoodResponse(query) {
  const lowerQuery = query.toLowerCase();

  // Specific responses based on keywords
  if (lowerQuery.includes('momo')) {
    return "Bhai, momos? 🥟 Raj Nagar Extension jao! Vahan par har corner pe momos milenge, aur taste is so mast! 50-100 rupees mein plate kha jaega. Saath mein red aur green chutney add kar dena - kamal ka! Morning 10 se night 10 tak open rehta hai. Trust me, Ghaziabad ke liye Raj Nagar momos ka synonymous ho gaya hai!";
  }

  if (lowerQuery.includes('chaat')) {
    return "Chaat kaha mil jayega? Turab Nagar jao, bhai! Pani puri, aloo tikki, samosa chaat - sab kuch milega! 20-50 rupees mein poora satisfied ho jaega. Wahan ke vendors ko experience karte hain, isliye taste bhi mast hota hai. Especially evening time bahut crowded rehta hai!";
  }

  if (lowerQuery.includes('paratha')) {
    return "Parathas? Old Ghaziabad ka area dekho! Aloo paratha, paneer paratha, mooli paratha - sab mein butter aur curd milega. 30-80 rupees per plate. Breakfast time best hai, aur halwai ke paas chai bhi ho jayegi. Generations se same family chal raha hai!";
  }

  if (lowerQuery.includes('butter chicken')) {
    return "Butter chicken? Sahibabad wale dhabas mein best milega! 150-250 rupees mein, gravy so rich aur creamy. Roti ya naan ke saath order kar dena. Evening time se raat tak khate hain log, bahut popular hai!";
  }

  if (lowerQuery.includes('dosa')) {
    return "Dosa craving ho gayi? Delhi ka Connaught Place ya NCR ke mall food courts mein milta hai. 80-150 rupees mein South Indian taste. Sambhar aur chutney ke saath kamal ka! Bahut healthy option hai!";
  }

  // Default food response
  return "NCR mein bahut saare delicious options hain! Momos (Raj Nagar), Chaat (Turab Nagar), Parathas (Old Ghaziabad), Butter Chicken (Sahibabad), aur Dosa (Connaught Place) sab famous hain. Kya specific khana poochna chahte ho?";
}

/**
 * Generate traffic-related responses
 */
function generateTrafficResponse(query) {
  const lowerQuery = query.toLowerCase();

  // Specific responses based on keywords
  if (lowerQuery.includes('ghaziabad') && lowerQuery.includes('noida')) {
    return "Ghaziabad se Noida kitna time? Depend karta hai timing par, yaar! 🚗 Agar normal time (11 AM to 4 PM) mein jao to 30-40 minute mein pahunch jaega. Lekin agar 6-8 PM ko nikle to 1.5-2 ghante lag sakte hain! NH-24 bahut crowded rehta hai evening mein. Better alternative hai Ghaziabad Bypass, thoda zyada time nahi lagta!";
  }

  if (lowerQuery.includes('peak') || lowerQuery.includes('rush')) {
    return "Peak hours? Bhai, 8-10 AM aur 6-9 PM avoid kar! 🚨 Specially 6-8 PM sab se worst hota hai NCR mein. NH-24 par sab trucks hote hain, traffic bahut badh jaata hai. Agar possible ho to 11 AM to 4 PM ke beech travel kar, bahut peaceful rehta hai!";
  }

  if (lowerQuery.includes('dnd') || lowerQuery.includes('flyway') || lowerQuery.includes('gt road')) {
    return "DND Flyway ya GT Road? DND thoda better hota hai lekin toll bhi lagta hai 50-100 rupees. NH-24 bypass free hai but thoda slow. Timing par depend karta hai - rush hours mein dono hi slow ho jayenge!";
  }

  if (lowerQuery.includes('sahibabad') && lowerQuery.includes('noida')) {
    return "Sahibabad to Noida? 45 minutes to 1 hour normally. 7 PM ke baad traffic badh jaata hai. Agar Metro possible ho to that's the best option! 30-40 minutes mein pahunch jaega aur hassle-free bhi rahega!";
  }

  if (lowerQuery.includes('weekend')) {
    return "Weekend traffic alag hota hai! 🚗 Zyada vehicles to nahi hote weekends par, lekin markets bahut crowded hote hain. Shopping areas mein parking bhi tough ho jaata hai. Weekday morning (9-10 AM) best time hai travel karne ke liye!";
  }

  // Default traffic response
  return "NCR ka traffic famous hai for being unpredictable! 🚗 Peak hours 8-10 AM aur 6-9 PM avoid karo. NH-24, DND Flyway, aur GT Road sab options hain. Metro best hai long distance ke liye. Kya specific route poochna chahte ho?";
}

/**
 * Generate culture-related responses
 */
function generateCultureResponse(query) {
  const lowerQuery = query.toLowerCase();

  // Specific responses based on keywords
  if (lowerQuery.includes('diwali')) {
    return "Diwali NCR mein bahut badiya celebrate hoti hai, bhai! 🪔 Puri Delhi NCR light up ho jaati hai - diyas, candles, fairy lights sab jagmagate hain! Fireworks evening ko, patakhe bajate hain. Sweets banate hain - laddoos, barfis, jalebis. Family time, rangoli banate hain, puja karte hain. Lekin traffic bahut kharab ho jaata hai, aur pollution badh jaati hai. Best time hai morning ya afternoon mein bahar niklna.";
  }

  if (lowerQuery.includes('holi')) {
    return "Holi NCR mein rang ka festival hai! 🎨 March mein celebrate hota hai. Pichkariyan, gulal, pani ke khel - sab kuch! Street celebrations hote hain, dhol nagade bajate hain. Gujiya aur malpua khate hain. Bahut masti hoti hai, lekin careful raho - kuch log neeche ka rang bhi laga dete hain! 😄 Traditional Holi best hai old city areas mein.";
  }

  if (lowerQuery.includes('eid')) {
    return "Eid NCR mein bahut khushi se celebrate hota hai! 🕌 Biryani banati hai, sheer khurma, sewaiyan. New clothes pehente hain, masjid jaate hain for prayers. Family gatherings, mithaiyan distribute karte hain. Muslim community ke liye bahut special festival hai. Chand raat ko moon dekhte hain, agar clear ho to!";
  }

  if (lowerQuery.includes('culture') || lowerQuery.includes('people')) {
    return "NCR ka culture? Bhai, yahan ke log bahut friendly aur direct hote hain! 🤝 Chai (tea) ke saath sab kuch theek ho jaata hai - business, friendship, sab! Street vendors par bahut belief hote hain people ko. Football (soccer) bahut popular hai, cricket to national obsession hai! Diwali, Holi, Eid - sab celebrate karte hain mil-baithkar!";
  }

  if (lowerQuery.includes('festival') || lowerQuery.includes('celebration')) {
    return "Festivals NCR mein kaise celebrate hote hain? Diwali mein puri Delhi NCR light up ho jaati hai! Fireworks, diyas, meethe - sab kuch! Holi mein rang khelte hain, pani ke khel hote hain. Eid par biryani aur kebabs! Sab communities ek-dusre ke festivals mein join karte hain. Bahut cultural melting pot hai!";
  }

  if (lowerQuery.includes('custom') || lowerQuery.includes('tradition')) {
    return "Local customs? 'Kaise ho?' = 'How are you?' - casual greeting. 'Sab theek hai?' = 'Everything okay?' - caring tone. 'Accha, theek hai' = 'Okay, that's fine'. People direct bolte hain, beating around the bush nahi karte. Negotiations normal hote hain markets mein! Respect aur warmth dono milta hai!";
  }

  if (lowerQuery.includes('chai') || lowerQuery.includes('tea')) {
    return "Chai culture NCR mein legend hai! ☕ Har corner par chai ka dhaba hota hai. 10-20 rupees mein garam chai, aur uske saath gup-shup (gossip) free! Business deals, friendships, sab chai pe hote hain. Early morning jaao to fresh ginger-elaichi chai, bahut rejuvenating hoti hai!";
  }

  if (lowerQuery.includes('vendor') || lowerQuery.includes('street')) {
    return "Street vendors! 🏪 Ek number ke lokh hote hain, honest aur hardworking! Chaand-tara wala khaana banate hain (with love and dedication). Itne years se same spot par rehte hain, generations build trust karte hain. Fair price mein quality khaana milta hai!";
  }

  // Default culture response
  return "NCR ka culture bahut rich aur diverse hai! 🤝 Friendly people, chai culture, festivals, aur street vendors sab ka apna charm hai. Kya specific aspect poochna chahte ho - festivals, customs, ya kuch aur?";
}

/**
 * Generate event/festival responses
 */
function generateEventResponse(query) {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('weekend') || lowerQuery.includes('weekend plan')) {
    return "Weekend ka plan? NCR mein bahut options hain! Markets ja sakte ho - Karol Bagh, Lajpat Nagar, Kamla Nagar mein shopping aur street food. Movies dekh sakte ho PVR, INOX ya Cinepolis mein. Parks ja sakte ho - Lodhi Gardens, Buddha Garden, Nehru Park. Cafe culture enjoy karo - The Big Chill, Chai Point, Starbucks. Food streets ja sakte ho Raj Nagar ya Chandni Chowk mein. Tum kya karna chahte ho, main suggest kar deta hoon specific places!";
  }

  if (lowerQuery.includes('event') || lowerQuery.includes('happening')) {
    return "NCR mein events ka season! Festivals ke time to bahut kuch hota hai. Normal time mein concerts, exhibitions, food festivals. India Habitat Centre (IHC) mein cultural events hote rahte hain. Local clubs mein music nights, art exhibitions. Weekends mein farmers markets, flea markets. Kya type ka event pasand hai - music, food, art, ya cultural?";
  }

  if (lowerQuery.includes('movie') || lowerQuery.includes('cinema')) {
    return "Movies dekhne ka plan? NCR mein bahut options! PVR cinemas almost har jagah - Select Citywalk, Pacific Mall, Ansal Plaza. INOX bhi good hai. Cinepolis mein luxury experience. Tickets 150-400 rupees ke beech. New releases ke liye morning shows best hain, kam crowd. Food court mein bhi khana mil jaata hai. Kaunsi movie dekhni hai?";
  }

  if (lowerQuery.includes('park') || lowerQuery.includes('garden')) {
    return "Parks NCR mein relaxation ke liye best! Lodhi Gardens (Delhi) mein walking, historical monuments. Buddha Garden (Delhi) morning walks ke liye. Nehru Park (Delhi) boating aur picnic. Central Park (Noida) family time ke liye. Coronation Park (Delhi) quiet spot. Weekends mein bahut crowded hote hain, morning time best hai!";
  }

  // Default event response
  return "NCR mein entertainment options bahut hain! Movies, parks, markets, cafes, events - sab kuch mil jaata hai. Weekend plan banana hai ya specific event ka idea chahiye? Batao, main help karunga!";
}

/**
 * Generate general tips and advice responses
 */
function generateTipsResponse(query) {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('visit') || lowerQuery.includes('tourist') || lowerQuery.includes('first time')) {
    return "NCR mein first time aa rahe ho? Bahut accha! 😊 Pehle Metro sikho - Delhi ka lifeline hai, cheap aur fast. Street food try karo but clean places se - Raj Nagar, Chandni Chowk. Chai har jagah milti hai, free mein baatein ho jaati hain. Bargaining normal hai markets mein. Traffic avoid karo peak hours mein. Local cabs lo, drivers helpful hote hain. Hindi thodi sikho, log khush ho jaate hain. Aur haan, 'kaise ho?' se start karo conversations. Enjoy karo, NCR amazing hai!";
  }

  if (lowerQuery.includes('weather') || lowerQuery.includes('season')) {
    return "NCR ka weather unpredictable hai! Summer (April-June) mein bahut garmi - 40-45°C, AC essential. Monsoon (July-September) mein barsaat, traffic kharab. Winter (November-February) pleasant - 5-20°C, fog morning mein. Spring/Autumn best time - festivals aur outdoor activities ke liye. Weather app check karo daily, sudden changes hote rahte hain!";
  }

  if (lowerQuery.includes('safety') || lowerQuery.includes('safe')) {
    return "NCR mein safety ke liye basic tips: Night mein alone matt niklo, specially ladies. Trusted cabs use karo - Uber/Ola. Street food clean places se khao. Markets mein bargaining karo but arguments matt karo. Emergency ke liye 100 call karo. General sense use karo, NCR mostly safe hai but precautions zaroori hain. Local areas mein log helpful hote hain!";
  }

  if (lowerQuery.includes('budget') || lowerQuery.includes('cost') || lowerQuery.includes('expensive')) {
    return "NCR mein budget ke options bahut! Street food ₹20-100, local dhabas ₹100-200, restaurants ₹200-500. Metro ₹10-50 per trip, auto ₹20-100, cabs ₹50-200. Markets mein bargaining se 30-50% save ho jaata hai. Budget hotels ₹500-2000, hostels ₹300-800. Plan karo according to your budget, sab kuch mil jaata hai!";
  }

  // Default tips response
  return "NCR mein navigate karne ke liye tips? Metro learn karo, traffic avoid karo, local food try karo, bargaining sikho! Kya specific tip chahiye - travel, food, safety, ya budget?";
}

/**
 * Generate default response for general queries
 */
function generateDefaultResponse(query) {
  return "Bhai, yeh query to NCR-specific nahi lagraha! 🤔 Mujhe slang, khana, traffic, culture, events, aur local tips ke baare mein poocho. Main sirf NCR ka expert hoon! 😄 Kya poocho: Ghaziabad, Noida, Delhi NCR ke baare mein? Ask about jugaad, momos, chaat, traffic, festivals, weekend plans, ya safety tips!";
}

/**
 * Fallback mock response generator
 */
function generateMockResponse(query) {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('jugaad')) {
    return 'Jugaad, bhai? Yeh to NCR ki jaan hai! Jugaad matlab ek smart, innovative tarika kisi problem ko solve karne ka... bina fancy solution banaye. Jaisa kehte hain, "Usi se hi sab kuch theek kar do!" 😄';
  }

  if (lowerQuery.includes('momos') || lowerQuery.includes('khana')) {
    return 'Bhai, momos? Raj Nagar Extension jao! Vahan par har corner pe momos milenge, aur taste is so mast! 50-100 rupees mein plate kha jaega... spicy chutney ke saath kamal ka!';
  }

  if (lowerQuery.includes('traffic') || lowerQuery.includes('noida') || lowerQuery.includes('ghaziabad')) {
    return 'Yaar, timing par depend karta hai! Agar 12 baje jao to 30-40 minute mein pahunch jaega. Lekin agar 6-8 PM ko nikle to 1.5-2 ghante lag sakte hain! NH-24 waale raaste se avoid karo evening mein.';
  }

  return 'Bhai, yeh query to NCR-specific nahi lagraha hai! Mujhe slang, khana, traffic, aur local culture ke baare mein poocho. Main sirf NCR jaanta hoon! 😄';
}

// Serve frontend (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔴 Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 NCR Local Guide Bot running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/ask`);
  console.log(`💡 Try: curl -X POST http://localhost:${PORT}/api/ask -H "Content-Type: application/json" -d '{"query":"best momos?"}'`);
  console.log('\n');
});

module.exports = app;
