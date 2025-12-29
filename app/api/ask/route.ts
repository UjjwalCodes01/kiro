/**
 * NCR Local Guide Bot - Next.js API Route
 *
 * DEVELOPMENT APPROACH - KIRO AGENTIC WORKFLOW:
 * This project was built using Kiro's spec-driven development methodology
 *
 * Integrated into Next.js for unified full-stack application
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// AI Service class (adapted from ai-service.js)
class AIService {
  private productContext: string | null = null;
  private steeringGuidelines: string | null = null;
  private apiKey: string | undefined;
  private provider: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY;
    this.provider = process.env.AI_PROVIDER || 'openai';

    this.loadContext();
  }

  private loadContext() {
    try {
      const productPath = path.join(process.cwd(), '.kiro/product.md');
      this.productContext = fs.readFileSync(productPath, 'utf-8');

      const steeringPath = path.join(process.cwd(), '.kiro/steering/ncr-guide-behavior.md');
      this.steeringGuidelines = fs.readFileSync(steeringPath, 'utf-8');

      console.log('✅ AI Service: Loaded context and steering guidelines');
    } catch (error) {
      console.error('❌ AI Service: Failed to load context:', error);
      throw error;
    }
  }

  private buildSystemPrompt(): string {
    return `You are Kiro, a friendly and knowledgeable local guide for Delhi NCR (National Capital Region).

# YOUR CONTEXT (NCR Knowledge Base):
${this.productContext}

# YOUR BEHAVIOR GUIDELINES:
${this.steeringGuidelines}

# IMPORTANT INSTRUCTIONS:
1. Use Hinglish (Hindi mixed with English) naturally
2. Be friendly, casual, and approachable
3. Address users as "bhai", "yaar", "dost", or "bhabhi"
4. Include specific locations, prices, and timings from the context
5. Use emojis to make responses engaging
6. Keep responses practical and actionable
7. If the query is not about NCR, politely redirect

# STRUCTURED RESPONSE FORMAT FOR ALL QUERIES:
Always provide responses in this structured format for consistency and professionalism:

## 🟣 Kiro's Guide

**Query Summary:** "[brief restatement of user's question]"

### 💬 Answer
> [Direct, clear answer to the question]

### 📍 Details & Locations
> [Specific places, addresses, landmarks mentioned]

### 💰 Cost Information
> [Prices, budget ranges, value tips]

### ⏰ Timing & Schedule
> [Best times, opening hours, duration info]

### 🤝 Tips & Recommendations
> [Practical advice, what to avoid, pro tips]

### ⚠️ Important Notes
> [Warnings, restrictions, cultural considerations]

**Powered by Kiro Knowledge Base × [AI Provider]**
_Using [.kiro/product.md](.kiro/product.md) for NCR insights_

Now respond to the user's query using this context and guidelines.`;
  }

  private async generateWithOpenAI(query: string) {
    const systemPrompt = this.buildSystemPrompt();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.8,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Check for quota/limit errors
      if (response.status === 429 ||
        errorData.error?.code === 'insufficient_quota' ||
        errorData.error?.type === 'insufficient_quota' ||
        errorData.error?.message?.includes('quota') ||
        errorData.error?.message?.includes('limit')) {
        throw new Error('API_LIMIT_EXCEEDED');
      }

      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      model: data.model,
      provider: 'OpenAI',
      usage: data.usage
    };
  }

  private async generateWithAnthropic(query: string) {
    const systemPrompt = this.buildSystemPrompt();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey as string,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 600,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: query
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Check for quota/limit errors
      if (response.status === 429 ||
        errorData.error?.type === 'rate_limit_error' ||
        errorData.error?.message?.includes('quota') ||
        errorData.error?.message?.includes('limit')) {
        throw new Error('API_LIMIT_EXCEEDED');
      }

      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.content[0].text,
      model: data.model,
      provider: 'Anthropic',
      usage: data.usage
    };
  }

  private async generateWithGemini(query: string) {
    // Note: This would require installing @google/genai
    // For now, fallback to OpenAI
    return this.generateWithOpenAI(query);
  }

  async generateResponse(query: string) {
    try {
      console.log(`🤖 AI Service: Generating response for: "${query}"`);

      let result;

      if (this.provider === 'anthropic') {
        result = await this.generateWithAnthropic(query);
      } else if (this.provider === 'gemini') {
        result = await this.generateWithGemini(query);
      } else {
        result = await this.generateWithOpenAI(query);
      }

      console.log(`✅ AI Service: Response generated using ${result.provider}`);

      return {
        response: result.text,
        metadata: {
          source: `${result.provider} AI Agent`,
          model: result.model,
          provider: result.provider,
          generatedAt: new Date().toISOString(),
          contextUsed: 'product.md + ncr-guide-behavior.md',
          usage: result.usage
        }
      };

    } catch (error) {
      console.error('❌ AI Service: Error generating response:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.productContext && this.steeringGuidelines);
  }
}

// Fallback response generator (adapted from server.js)
function generateContextAwareResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Greeting queries
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey') || lowerQuery.includes('namaste') || lowerQuery.includes('greetings')) {
    return generateGreetingResponse(query);
  }

  // Cultural/Slang queries
  if (lowerQuery.includes('jugaad') || lowerQuery.includes('bhaiya') || lowerQuery.includes('scene')) {
    return generateSlangResponse(query);
  }

  // Food queries
  if (lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('restaurant') || lowerQuery.includes('momos') || lowerQuery.includes('chaat')) {
    return `## 🟣 Kiro's Guide

**Query Summary:** "${query}"

### 💬 Answer
> Arre bhai, NCR mein bahut saare amazing food options hain! Raj Nagar mein momos ke liye "Wow Momos" try karo - सिर्फ ₹120 mein plate milta hai.

### 📍 Details & Locations
> Wow Momos, Raj Nagar Extension, Ghaziabad
> Buraapur ke paas "Chaat Corner" - best golgappe NCR mein

### 💰 Cost Information
> Momos: ₹100-150 per plate
> Chaat: ₹50-80 per serving
> Budget friendly options har taraf

### ⏰ Timing & Schedule
> Most places open 11 AM to 11 PM
> Best time for street food: Evening 6-9 PM

### 🤝 Tips & Recommendations
> Raj Nagar Extension mein walk karo - hidden gems milenge
> Local vendors se bargain karo, friendly hote hain

### ⚠️ Important Notes
> Street food ke saath hygiene ka dhyaan rakho
> Monsoon mein covered places prefer karo

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for NCR insights_`;
  }

  // Traffic queries
  if (lowerQuery.includes('traffic') || lowerQuery.includes('time') || lowerQuery.includes('distance')) {
    return `## 🟣 Kiro's Guide

**Query Summary:** "${query}"

### 💬 Answer
> Bhaiya, NCR traffic unpredictable hai! Ghaziabad se Noida normally 45-60 minutes lagte hain, but peak hours mein 2 ghante bhi ho sakte hain.

### 📍 Details & Locations
> Best route: NH-24 via Dasna
> Alternative: Old Delhi route (crowded)

### 💰 Cost Information
> Metro: ₹30-50
> Ola/Uber: ₹200-400 depending on traffic
> DTC Bus: सिर्फ ₹20-30

### ⏰ Timing & Schedule
> Morning peak: 8-11 AM (worst traffic)
> Evening peak: 5-8 PM
> Best time to travel: 10 AM or after 9 PM

### 🤝 Tips & Recommendations
> Metro is fastest and cheapest option
> Car pooling se save karo fuel aur time
> Traffic apps use karo real-time updates ke liye

### ⚠️ Important Notes
> Friday evenings aur long weekends avoid karo
> Rainy days mein double time socho

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for NCR insights_`;
  }

  // General NCR queries
  return `## 🟣 Kiro's Guide

**Query Summary:** "${query}"

### 💬 Answer
> Arre dost, NCR ek amazing place hai! Delhi, Noida, Ghaziabad, Gurgaon - har jagah different culture aur lifestyle.

### 📍 Details & Locations
> Delhi: Historic Red Fort, India Gate
> Noida: Tech hubs, Sector 62-63
> Ghaziabad: Markets, Raj Nagar Extension

### 💰 Cost Information
> Street food: ₹50-200
> Local transport: ₹20-100
> Entertainment: ₹500-2000

### ⏰ Timing & Schedule
> Best time to visit: October to March
> Monsoon: July to September
> Summer: April to June (hot!)

### 🤝 Tips & Recommendations
> Local transport use karo explore karne ke liye
> Street food try karo but hygiene ka dhyaan rakho
> People friendly hain, help chahiye toh poocho

### ⚠️ Important Notes
> Traffic can be crazy, so plan extra time
> Water bottle carry karo, heat mein dehydrate ho jate ho
> Respect local culture aur traditions

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for NCR insights_`;
}

function generateGreetingResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('namaste')) {
    return `## 🟣 Kiro's Guide

**Query Summary:** "${query}"

### 💬 Answer
> Namaste! 🙏 Welcome to NCR (National Capital Region)! I'm Kiro, your friendly local guide for Delhi-NCR culture, food, traffic, and everything in between.

### 📍 What I Can Help With
> Delhi: Historic sites, street food, local culture
> Noida: Tech hubs, shopping, weekend spots
> Ghaziabad: Markets, momos, local lifestyle
> Gurgaon: Corporate areas, malls, nightlife

### 💰 Cost Information
> Street food: ₹50-200 per meal
> Local transport: ₹20-100 per trip
> Entertainment: ₹500-2000 per outing

### ⏰ Best Times
> Morning: 9 AM - 12 PM (less traffic)
> Evening: 6 PM - 9 PM (food & culture)
> Weekend: Full day exploration

### 🤝 Tips & Recommendations
> Ask about momos, jugaad, traffic, festivals
> I know local slang, hidden gems, and pro tips
> Friendly and approachable - just like NCR people!

### ⚠️ Important Notes
> Traffic can be unpredictable - plan extra time
> Respect local culture and traditions
> Stay hydrated, especially in summer

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for NCR insights_`;
  }

  return `## 🟣 Kiro's Guide

**Query Summary:** "${query}"

### 💬 Answer
> Hello! 👋 Welcome to NCR (National Capital Region)! I'm Kiro, your friendly local guide for Delhi-NCR culture, food, traffic, and everything in between.

### 📍 What I Can Help With
> Delhi: Historic sites, street food, local culture
> Noida: Tech hubs, shopping, weekend spots
> Ghaziabad: Markets, momos, local lifestyle
> Gurgaon: Corporate areas, malls, nightlife

### 💰 Cost Information
> Street food: ₹50-200 per meal
> Local transport: ₹20-100 per trip
> Entertainment: ₹500-2000 per outing

### ⏰ Best Times
> Morning: 9 AM - 12 PM (less traffic)
> Evening: 6 PM - 9 PM (food & culture)
> Weekend: Full day exploration

### 🤝 Tips & Recommendations
> Ask about momos, jugaad, traffic, festivals
> I know local slang, hidden gems, and pro tips
> Friendly and approachable - just like NCR people!

### ⚠️ Important Notes
> Traffic can be unpredictable - plan extra time
> Respect local culture and traditions
> Stay hydrated, especially in summer

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for NCR insights_`;
}

function generateSlangResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('jugaad')) {
    return `## 🟣 Cultural Interpretation

**Original Phrase:** "Jugaad"

### 💬 Implied Meaning
> Creative problem-solving, innovative workaround, making do with available resources

### 🏷️ Tone Category
> Positive, resourceful, clever

### 📍 Usage Context
> Used when someone finds a smart solution to a problem, especially with limited resources

### 🤝 Social Appropriateness
> Can be used by anyone, commonly used in professional and casual settings

### ⚠️ Risks / Cultural Notes
> Sometimes associated with cutting corners, but generally positive in Indian context

### 📖 Cultural Explanation
> Jugaad represents the Indian spirit of innovation and resourcefulness. Born from necessity in a resource-constrained environment, it celebrates finding creative solutions. In NCR, jugaad is everywhere - from street vendors to tech startups.

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for cultural context_`;
  }

  if (lowerQuery.includes('bhaiya')) {
    return `## 🟣 Cultural Interpretation

**Original Phrase:** "Bhaiya"

### 💬 Implied Meaning
> Brother, friend, respectful address for males, service providers

### 🏷️ Tone Category
> Respectful, friendly, casual

### 📍 Usage Context
> Used to address auto drivers, shopkeepers, delivery boys, or as a term of endearment

### 🤝 Social Appropriateness
> Used by anyone, creates instant rapport and shows respect for local culture

### ⚠️ Risks / Cultural Notes
> Shows cultural awareness, locals appreciate when outsiders use it correctly

### 📖 Cultural Explanation
> "Bhaiya" reflects the familial, community-oriented nature of Indian society. In NCR, it's commonly used in markets, transport, and daily interactions. Shows you're integrating with local culture.

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for cultural context_`;
  }

  if (lowerQuery.includes('scene')) {
    return `## 🟣 Cultural Interpretation

**Original Phrase:** "Scene"

### 💬 Implied Meaning
> Situation, circumstances, what's happening, the deal

### 🏷️ Tone Category
> Casual, inquisitive, seeking clarification

### 📍 Usage Context
> Used when asking for explanation or understanding of a situation

### 🤝 Social Appropriateness
> Common in urban NCR, especially among younger people and professionals

### ⚠️ Risks / Cultural Notes
> Part of modern Hinglish, shows you're up with current lingo

### 📖 Cultural Explanation
> "Scene" is modern Hinglish evolution, blending Hindi and English. In NCR's cosmopolitan environment, it represents the dynamic mix of traditional and contemporary communication styles.

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for cultural context_`;
  }

  if (lowerQuery.includes('abhi thoda kaam hai') || lowerQuery.includes('abhi kaam hai')) {
    return `## 🟣 Cultural Interpretation

**Original Phrase:** "Abhi thoda kaam hai"

### 💬 Implied Meaning
> "I have some work right now" - Often a polite way to decline or postpone something without being direct

### 🏷️ Tone Category
> Polite refusal, indirect, non-confrontational

### 📍 Usage Context
> Used when someone wants to avoid a commitment, postpone plans, or politely decline an invitation without saying "no" directly

### 🤝 Social Appropriateness
> Very common in NCR culture, shows respect while maintaining personal boundaries. Used in both professional and casual settings

### ⚠️ Risks / Cultural Notes
> May not actually mean they're busy - it's often a soft way to say "I'm not interested right now" or "maybe later". NCR people value indirect communication to maintain harmony

### 📖 Cultural Explanation
> This phrase reflects NCR's preference for indirect communication. Rather than saying "no" directly (which can seem rude), people use "abhi thoda kaam hai" to politely decline. It maintains social harmony and gives both parties a graceful exit. The actual "work" might be real or just an excuse - context matters! In NCR culture, this is perfectly acceptable and understood by everyone.

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for cultural context_`;
  }

  if (lowerQuery.includes('chaliye ji') || lowerQuery.includes('chaliye')) {
    return `## 🟣 Cultural Interpretation

**Original Phrase:** "Chaliye ji"

### 💬 Implied Meaning
> "Let's go" or "Okay, let's proceed" - Can also mean polite dismissal or ending a conversation

### 🏷️ Tone Category
> Respectful, polite, can be neutral or slightly dismissive depending on context

### 📍 Usage Context
> Used to initiate movement, end a conversation politely, or agree to proceed with something. "Ji" adds respect

### 🤝 Social Appropriateness
> Very common and appropriate in all settings. The "ji" makes it respectful, suitable for elders, strangers, and formal situations

### ⚠️ Risks / Cultural Notes
> Can have dual meaning: genuine invitation to move OR polite way to end a conversation. Tone and body language matter! If said with finality, it means "okay, we're done here"

### 📖 Cultural Explanation
> "Chaliye ji" is quintessentially NCR! The word "chaliye" means "let's go/move" and "ji" adds respect (like "sir/ma'am"). In markets, you'll hear shopkeepers say this to customers. In offices, it signals meeting's end. Among friends, it's casual "chalo yaar". The beauty is in its flexibility - same phrase, different contexts. NCR people use it dozens of times daily, from auto-rickshaw negotiations to family gatherings!

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for cultural context_`;
  }

  if (lowerQuery.includes('dekhte hain') || lowerQuery.includes('dekhte hai')) {
    return `## 🟣 Cultural Interpretation

**Original Phrase:** "Dekhte hain"

### 💬 Implied Meaning
> "Let's see" or "We'll see" - Often means "probably not" or "I'm not committing" rather than actual consideration

### 🏷️ Tone Category
> Non-committal, evasive, keeping options open

### 📍 Usage Context
> Used to avoid making firm commitments, postpone decisions, or politely decline without saying no. Very common in NCR conversations

### 🤝 Social Appropriateness
> Universally acceptable phrase, used by everyone from kids to elders. Safe in all social situations

### ⚠️ Risks / Cultural Notes
> WARNING: "Dekhte hain" rarely means actual consideration! It's usually a soft "no" or "I don't want to commit". If someone says this repeatedly, they're probably not interested. NCR people understand this unspoken rule

### 📖 Cultural Explanation
> "Dekhte hain" is the ultimate NCR escape phrase! Literally "let's see", but culturally it means "I'm not saying yes, but I'm also not saying no to your face". It's the Indian way of maintaining social harmony while avoiding commitment. Parents use it with kids ("Can I get a new phone?" "Dekhte hain" = probably no). Friends use it for plans ("Party this weekend?" "Dekhte hain" = maybe, but don't count on me). In NCR's flexible time culture, this phrase is EVERYWHERE. Pro tip: If you get "dekhte hain" as response, have a backup plan!

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for cultural context_`;
  }

  if (lowerQuery.includes('aap ka keeht hua') || lowerQuery.includes('aapka keeht') || lowerQuery.includes('keeht hua')) {
    return `## 🟣 Cultural Interpretation

**Original Phrase:** "Aap ka keeht hua"

### 💬 Implied Meaning
> "It's done" or "Your work is completed" - Polite confirmation that a task/favor has been accomplished

### 🏷️ Tone Category
> Respectful, formal, service-oriented

### 📍 Usage Context
> Used by service providers, shopkeepers, or anyone completing a task for someone else. Shows respect and professionalism

### 🤝 Social Appropriateness
> Very formal and respectful phrase. Appropriate when serving customers, completing favors, or in professional settings. "Aap" (formal you) makes it extra respectful

### ⚠️ Risks / Cultural Notes
> This is old-school respectful Hindi, more common in traditional shops and with older generation. Younger NCR crowd might say "ho gaya" (done) instead. Shows cultural depth and respect when used

### 📖 Cultural Explanation
> "Aap ka keeht hua" reflects NCR's service culture and respect for customers. "Keeht" is a respectful word for "work/task", and "aap ka" means "yours". You'll hear this in traditional markets of Old Delhi, Chandni Chowk, or from older shopkeepers in Ghaziabad. It's the verbal equivalent of a bow - showing that serving you was their honor. In modern NCR, younger generation might say "done hai" or "ho gaya", but the traditional phrase carries weight and respect. If someone uses this with you, they're showing old-school NCR courtesy!

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for cultural context_`;
  }

  return `## 🟣 Cultural Interpretation

**Original Phrase:** "${query}"

### 💬 Implied Meaning
> This appears to be a cultural or slang term from NCR region

### 🏷️ Tone Category
> Local, regional, cultural

### 📍 Usage Context
> Used in local conversations, markets, and daily interactions in NCR

### 🤝 Social Appropriateness
> Part of local culture, shows cultural awareness when used appropriately

### ⚠️ Risks / Cultural Notes
> Context matters - same word can mean different things in different situations

### 📖 Cultural Explanation
> NCR has rich linguistic diversity with Hinglish, Punjabi influences, and local slang. Understanding these terms helps connect with locals and shows respect for regional culture.

**Powered by Kiro Knowledge Base × Template Fallback**
_Using [.kiro/product.md](.kiro/product.md) for cultural context_`;
}

// Initialize AI Service
let aiService: AIService | null = null;
let useAI = false;

function initializeAI() {
  try {
    aiService = new AIService();

    if (aiService.isConfigured()) {
      useAI = true;
      console.log('✅ AI Service initialized with real AI provider');
      console.log(`   Provider: ${process.env.AI_PROVIDER || 'openai'}`);
      console.log('   Context: product.md + steering guidelines loaded');
    } else {
      console.log('⚠️  AI Service not configured (missing API key)');
      console.log('   Set OPENAI_API_KEY or ANTHROPIC_API_KEY environment variable');
      console.log('   Falling back to template-based responses');
    }
  } catch (error) {
    console.error('❌ Failed to initialize AI Service:', error);
    console.log('⚠️  Using fallback template-based responses');
  }
}

// Initialize on module load
initializeAI();

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        error: 'Query is required',
        message: 'Please provide a valid query'
      }, { status: 400 });
    }

    console.log(`📝 Processing query: ${query}`);

    let response: string;
    let metadata: any;

    if (useAI && aiService) {
      try {
        // Use REAL AI to generate response
        const aiResponse = await aiService.generateResponse(query);
        response = aiResponse.response;
        metadata = aiResponse.metadata;

        console.log(`✅ Response generated by ${metadata.provider} AI`);
      } catch (aiError: any) {
        // Check if it's an API limit error
        if (aiError.message === 'API_LIMIT_EXCEEDED') {
          console.log('⚠️  API limit exceeded, falling back to hardcoded responses');

          // Fallback to template-based responses
          response = generateContextAwareResponse(query);
          metadata = {
            source: 'Hardcoded Fallback (API Limit Exceeded)',
            generatedAt: new Date().toISOString(),
            note: 'API quota exceeded. Using hardcoded responses until limit resets.',
            fallbackReason: 'API_LIMIT_EXCEEDED'
          };
        } else {
          // Re-throw other errors
          throw aiError;
        }
      }
    } else {
      // Fallback to template-based responses
      response = generateContextAwareResponse(query);
      metadata = {
        source: 'Template-based Fallback',
        generatedAt: new Date().toISOString(),
        note: 'Set OPENAI_API_KEY or ANTHROPIC_API_KEY for real AI'
      };

      console.log(`⚠️  Using fallback template response`);
    }

    return NextResponse.json({
      query,
      response,
      timestamp: new Date().toISOString(),
      ...metadata
    });

  } catch (error) {
    console.error('❌ Error processing query:', error);

    // Final fallback - always return hardcoded data on any error
    const { query } = await request.json();
    const fallbackResponse = generateContextAwareResponse(query);

    return NextResponse.json({
      query,
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      source: 'Emergency Fallback',
      note: 'An error occurred. Using hardcoded responses.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}