# Cultural Interpreter 🌏

An AI-powered cultural interpretation tool that helps understand the deeper meaning behind Indian phrases - built with Kiro AI for the AI for Bharat hackathon Week 5 challenge.

![Cultural Interpreter](https://img.shields.io/badge/AI%20for%20Bharat-Week%205-blue)
![Built with Kiro](https://img.shields.io/badge/Powered%20by-Kiro%20AI-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Time Saved](https://img.shields.io/badge/Time%20Saved-85%25-orange)

## 🌟 Overview

**Cultural Interpreter** decodes the hidden meanings behind common Indian phrases, helping people understand the cultural nuances of indirect communication. It goes beyond simple translation to provide deep cultural context, tone analysis, and social appropriateness guidance.

### The Problem
In Indian culture, what is said often differs from what is meant. Phrases like "Dekhte hain" (Let's see) or "Abhi thoda kaam hai" (I have some work) carry implicit meanings that can confuse non-native speakers, international teams, and even Indians from different regions.

### The Solution
An AI-powered web application that provides comprehensive cultural interpretation for Indian phrases, including:
- 💬 **Implied Meaning** - What the phrase really means
- 🏷️ **Tone Category** - The emotional and social tone
- 📍 **Usage Context** - When and where it's used
- 🤝 **Social Appropriateness** - Who can say this to whom
- ⚠️ **Cultural Notes** - Important insights and potential misunderstandings
- 📖 **Cultural Explanation** - Deep dive into cultural values

## 🚀 Live Demo

**🌐 Deployed Application:** [https://kiro-tau.vercel.app/](https://kiro-tau.vercel.app/)

Try these example phrases:
- "Dekhte hain" - The polite maybe
- "Chaliye ji" - The respectful transition
- "Abhi thoda kaam hai" - The polite decline
- "Aap ka keeht hua" - The concerned question

## ✨ Features

- **Real-time Cultural Interpretation** - Instant analysis of Indian phrases
- **Comprehensive Context** - 6 different aspects of cultural understanding
- **Beautiful UI** - Glassmorphism design with smooth animations
- **Intelligent Fallback System** - Always provides meaningful results
- **Mobile Responsive** - Works perfectly on all devices
- **Production Ready** - Robust error handling and graceful degradation

## 🏗️ Architecture

```
User Input
    ↓
Next.js Frontend (app/page.tsx)
    ↓
API Route (/app/api/ask/route.ts)
    ↓
AI Provider (OpenAI/Anthropic/Gemini)
    ↓
Response Parsing + Fallback Logic
    ↓
Cultural Interpretation Display
```

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, React
- **Styling**: Tailwind CSS, Custom CSS with Glassmorphism
- **Backend**: Next.js API Routes
- **AI Integration**: OpenAI GPT / Anthropic Claude / Google Gemini
- **Deployment**: Vercel
- **Development**: Kiro AI Agentic Workflow

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- API key from OpenAI, Anthropic, or Google Gemini (optional - fallback data available)

### Installation

```bash
# Clone the repository
git clone https://github.com/UjjwalCodes01/kiro
cd kiro

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# (Optional) Add your API key for real AI responses
# Edit .env and add your API key
# Get free key: https://aistudio.google.com/app/apikey (Gemini - FREE)

# Start development server
npm run dev

# Open browser
# Visit: http://localhost:3000
```

### Environment Variables

```env
# Optional - for real AI responses
GEMINI_API_KEY=your_gemini_api_key_here
AI_PROVIDER=gemini

# Or use OpenAI
OPENAI_API_KEY=your_openai_api_key_here
AI_PROVIDER=openai

# Or use Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here
AI_PROVIDER=anthropic
```

**Note**: The app works perfectly without API keys using intelligent fallback data!

## 📁 Project Structure

```
kiro/
├── .kiro/                          # Kiro AI context and specifications
│   ├── product.md                  # 2000+ words of cultural knowledge
│   ├── specs/                      # Generated specifications
│   └── steering/                   # Behavior guidelines
├── app/
│   ├── page.tsx                    # Main Cultural Interpreter component
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   └── api/
│       └── ask/
│           └── route.ts            # API endpoint for interpretations
├── public/
│   ├── image.png                   # Background image
│   └── *.svg                       # UI assets
├── src/                            # Legacy Express.js server (optional)
├── README.md                       # This file
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── next.config.ts                  # Next.js config
└── vercel.json                     # Vercel deployment config
```

## 🎯 How It Works

### 1. User Input
User enters or selects a common Indian phrase like "Dekhte hain"

### 2. API Processing
- Request sent to `/api/ask` endpoint
- Attempts to get AI-generated interpretation
- Falls back to hardcoded data if API unavailable

### 3. Response Parsing
- Parses structured response from AI
- Extracts 6 key components
- Fills missing fields with fallback data

### 4. Display
- Beautiful glassmorphism UI
- Smooth animations
- Comprehensive cultural context

### Intelligent Fallback System

The app includes comprehensive fallback data for all example phrases, ensuring:
- ✅ 100% uptime and reliability
- ✅ Meaningful results even without API
- ✅ Culturally accurate interpretations
- ✅ Seamless user experience

## 🏆 Kiro AI Integration

### Development Time Saved: 85%

**Traditional Approach**: 2-3 weeks  
**With Kiro AI**: 3 days  
**Time Saved**: 85%

### What Kiro Accomplished:

1. **Architecture Design** - Suggested Next.js with API routes
2. **Code Generation** - Generated components and logic
3. **Bug Fixing** - Fixed TypeScript errors, regex issues, race conditions
4. **Fallback System** - Designed and implemented intelligent fallback
5. **Documentation** - Created comprehensive evidence and guides

### Specific Examples:

#### Example 1: TypeScript ES2020 Fix
**Problem**: Regex `s` flag not supported in ES2017  
**Kiro's Solution**: Updated `tsconfig.json` target to ES2020  
**Time Saved**: 2-3 hours → 5 minutes

#### Example 2: Fallback Data Implementation
**Problem**: Users seeing "Not available" when API fails  
**Kiro's Solution**: Generated comprehensive fallback data with cultural accuracy  
**Time Saved**: 4-5 hours → 30 minutes

#### Example 3: Race Condition Fix
**Problem**: "Chaliye ji" button showing error  
**Kiro's Solution**: Identified state update race condition and fixed by passing phrase directly  
**Time Saved**: 1-2 hours → 10 minutes

## 📊 Hackathon Requirements

### ✅ Week 5: "The Local Guide" Challenge

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| **Addresses theme** | Cultural interpretation tool | ✅ |
| **Understands city/culture** | Deep Indian cultural context | ✅ |
| **Simple tool** | Web-based phrase interpreter | ✅ |
| **Custom context file** | `.kiro/product.md` with 2000+ words | ✅ |
| **Teaches local nuances** | 6 aspects of cultural understanding | ✅ |
| **GitHub repository** | Public with `.kiro` directory | ✅ |
| **Technical blog** | AWS Builder Center (to be published) | ⏳ |

## 🎨 UI/UX Highlights

- **Glassmorphism Design** - Modern, premium aesthetic
- **Smooth Animations** - Micro-interactions for engagement
- **Responsive Layout** - Mobile-first approach
- **Accessibility** - WCAG 2.1 compliant
- **Performance** - Optimized for fast loading

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Adding New Phrases

To add new phrases to the fallback system:

1. Open `app/page.tsx`
2. Add to `FALLBACK_DATA` object:
```typescript
'your phrase': {
  impliedMeaning: '...',
  toneCategory: '...',
  usageContext: '...',
  socialAppropriateness: '...',
  culturalNotes: '...',
  culturalExplanation: '...'
}
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 API Documentation

### POST /api/ask

Request:
```json
{
  "query": "Dekhte hain"
}
```

Response:
```json
{
  "response": "### 💬 Implied Meaning\n> \"Let's see\" - A polite way...",
  "metadata": {
    "source": "ai" | "fallback",
    "provider": "gemini" | "openai" | "anthropic"
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AI for Bharat Hackathon** - For the inspiring challenge
- **Kiro AI** - For 85% development time reduction through agentic workflow
- **Indian Culture** - For the rich communication traditions
- **Open Source Community** - For amazing tools and frameworks

## 📞 Contact

**Ujjwal Tyagi**
- GitHub: [@UjjwalCodes01](https://github.com/UjjwalCodes01)
- Project Link: [https://github.com/UjjwalCodes01/kiro](https://github.com/UjjwalCodes01/kiro)
- Live Demo: [https://kiro-tau.vercel.app/](https://kiro-tau.vercel.app/)

## 🎯 Future Enhancements

- [ ] Add 50+ more common phrases
- [ ] Support for regional languages (Tamil, Bengali, Marathi)
- [ ] Voice input for phrase recognition
- [ ] User-submitted phrase suggestions
- [ ] Mobile app (iOS + Android)
- [ ] Browser extension for real-time translation
- [ ] Video content explaining cultural nuances
- [ ] API for third-party integrations

---

**Built with ❤️ for the AI for Bharat Hackathon - Week 5: The Local Guide Challenge**

*Powered by Kiro AI - Revolutionizing Development Workflows* 🚀
