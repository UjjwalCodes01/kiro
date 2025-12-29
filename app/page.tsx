'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ParsedResponse {
  impliedMeaning: string;
  toneCategory: string;
  usageContext: string;
  socialAppropriateness: string;
  culturalNotes: string;
  culturalExplanation: string;
}

// Hardcoded fallback data for common phrases
const FALLBACK_DATA: Record<string, ParsedResponse> = {
  'dekhte hain': {
    impliedMeaning: '"Let\'s see" - A polite way of saying "maybe" or "I\'ll think about it" without committing to a definite yes or no.',
    toneCategory: 'Neutral to Polite Evasion',
    usageContext: 'Used in casual and professional settings when someone wants to avoid making an immediate commitment or decision.',
    socialAppropriateness: 'Generally appropriate in most contexts. It\'s a culturally accepted way to buy time or avoid confrontation.',
    culturalNotes: 'This phrase is deeply embedded in Indian communication culture. It can sometimes mean "no" but said politely to avoid disappointing someone. The actual intent depends heavily on context, tone, and body language.',
    culturalExplanation: 'In Indian culture, direct refusal can be seen as rude or confrontational. "Dekhte hain" allows people to maintain harmony while keeping their options open. It reflects the cultural value of maintaining relationships over being brutally honest.'
  },
  'chaliye ji': {
    impliedMeaning: '"Alright then" or "Let\'s go" - Often used as a polite way to end a conversation or transition to the next topic/action.',
    toneCategory: 'Polite and Respectful',
    usageContext: 'Common in North India, used in both formal and informal settings. Often heard when wrapping up meetings, phone calls, or conversations.',
    socialAppropriateness: 'Highly appropriate and respectful. The "ji" suffix adds a layer of respect and politeness.',
    culturalNotes: 'While it literally means "let\'s go," it\'s rarely about physical movement. It\'s more about social grace - a gentle way to signal that the conversation is concluding without being abrupt.',
    culturalExplanation: 'The use of "ji" (a respectful suffix) shows the importance of politeness in Indian culture. This phrase demonstrates how Indians often prioritize maintaining cordial relations and showing respect, even in simple transitions.'
  },
  'abhi thoda kaam hai': {
    impliedMeaning: '"I have some work right now" - Often used as a polite excuse to decline an invitation or postpone something without directly saying no.',
    toneCategory: 'Polite Deflection',
    usageContext: 'Used when someone wants to avoid a commitment or needs an excuse to not participate in something immediately.',
    socialAppropriateness: 'Socially acceptable as a soft refusal. It\'s understood that this might not always mean actual work, but rather a polite way to decline.',
    culturalNotes: 'This is a classic example of indirect communication in Indian culture. The phrase may or may not indicate actual work - it\'s often a face-saving way to say "I don\'t want to" or "I can\'t right now" without causing offense.',
    culturalExplanation: 'Indian culture values harmony and avoiding direct confrontation. Using "work" as a reason is universally understood and accepted, allowing both parties to maintain dignity. It\'s part of the social contract where everyone understands the unspoken meanings.'
  },
  'aap ka keeht hua': {
    impliedMeaning: '"What happened to you?" or "What\'s wrong with you?" - Can range from genuine concern to sarcastic criticism depending on tone.',
    toneCategory: 'Context-Dependent (Concern to Sarcasm)',
    usageContext: 'Used when someone does something unexpected, unusual, or perceived as wrong. The tone determines whether it\'s caring or critical.',
    socialAppropriateness: 'Appropriate among friends and family. Can be rude if used with strangers or in formal settings, especially with a sarcastic tone.',
    culturalNotes: 'This phrase is highly tone-dependent. With a soft, concerned tone, it shows care. With a sharp, sarcastic tone, it can be quite cutting. The relationship between speakers is crucial in determining appropriateness.',
    culturalExplanation: 'This phrase reflects the close-knit nature of Indian relationships where people feel comfortable questioning each other\'s behavior. It also shows how Hindi/Urdu allows for significant emotional range in simple phrases through tonal variation.'
  }
};

export default function CulturalInterpreter() {
  const [phrase, setPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [parsedResponse, setParsedResponse] = useState<ParsedResponse>({
    impliedMeaning: '',
    toneCategory: '',
    usageContext: '',
    socialAppropriateness: '',
    culturalNotes: '',
    culturalExplanation: ''
  });
  const [originalPhrase, setOriginalPhrase] = useState('');

  // Helper function to get fallback data for a phrase
  const getFallbackData = (phraseText: string): ParsedResponse | null => {
    const normalizedPhrase = phraseText.toLowerCase().trim();
    return FALLBACK_DATA[normalizedPhrase] || null;
  };

  const parseStructuredResponse = (text: string, phraseText: string): ParsedResponse => {
    const result: ParsedResponse = {
      impliedMeaning: '',
      toneCategory: '',
      usageContext: '',
      socialAppropriateness: '',
      culturalNotes: '',
      culturalExplanation: ''
    };

    const impliedMatch = text.match(/### 💬 Implied Meaning\s*\n\s*>\s*(.+?)(?=\n###|\n\*\*|$)/s);
    const toneMatch = text.match(/### 🏷️ Tone Category\s*\n\s*>\s*(.+?)(?=\n###|\n\*\*|$)/s);
    const usageMatch = text.match(/### 📍 Usage Context\s*\n\s*>\s*(.+?)(?=\n###|\n\*\*|$)/s);
    const socialMatch = text.match(/### 🤝 Social Appropriateness\s*\n\s*>\s*(.+?)(?=\n###|\n\*\*|$)/s);
    const risksMatch = text.match(/### ⚠️ Risks \/ Cultural Notes\s*\n\s*>\s*(.+?)(?=\n###|\n\*\*|$)/s);
    const explanationMatch = text.match(/### 📖 Cultural Explanation\s*\n\s*>\s*(.+?)(?=\n\*\*|$)/s);

    result.impliedMeaning = impliedMatch ? impliedMatch[1].trim() : '';
    result.toneCategory = toneMatch ? toneMatch[1].trim() : '';
    result.usageContext = usageMatch ? usageMatch[1].trim() : '';
    result.socialAppropriateness = socialMatch ? socialMatch[1].trim() : '';
    result.culturalNotes = risksMatch ? risksMatch[1].trim() : '';
    result.culturalExplanation = explanationMatch ? explanationMatch[1].trim() : '';

    // If this looks like a general guide response (no cultural interpretation fields found),
    // parse it as a general response
    if (!result.impliedMeaning && !result.toneCategory && !result.usageContext) {
      const answerMatch = text.match(/### 💬 Answer\s*\n\s*>\s*(.+?)(?=\n###|\n\*\*|$)/s);
      const detailsMatch = text.match(/### 📍 Details & Locations\s*\n\s*>\s*(.+?)(?=\n###|\n\*\*|$)/s);
      const tipsMatch = text.match(/### 🤝 Tips & Recommendations\s*\n\s*>\s*(.+?)(?=\n###|\n\*\*|$)/s);
      const notesMatch = text.match(/### ⚠️ Important Notes\s*\n\s*>\s*(.+?)(?=\n\*\*|$)/s);

      if (answerMatch) {
        result.impliedMeaning = answerMatch[1].trim();
        result.toneCategory = 'Friendly and Informative';
        result.usageContext = detailsMatch ? detailsMatch[1].trim() : 'General conversation';
        result.socialAppropriateness = 'Highly appropriate for all contexts';
        result.culturalNotes = notesMatch ? notesMatch[1].trim() : 'NCR guide response';
        result.culturalExplanation = tipsMatch ? tipsMatch[1].trim() : 'General guidance for NCR visitors';
      }
    }

    // If any field is empty, try to fill it with fallback data
    const fallback = getFallbackData(phraseText);
    if (fallback) {
      result.impliedMeaning = result.impliedMeaning || fallback.impliedMeaning;
      result.toneCategory = result.toneCategory || fallback.toneCategory;
      result.usageContext = result.usageContext || fallback.usageContext;
      result.socialAppropriateness = result.socialAppropriateness || fallback.socialAppropriateness;
      result.culturalNotes = result.culturalNotes || fallback.culturalNotes;
      result.culturalExplanation = result.culturalExplanation || fallback.culturalExplanation;
    }

    return result;
  };

  const interpretPhrase = async (phraseText?: string) => {
    const textToInterpret = phraseText || phrase;
    if (!textToInterpret.trim()) {
      setError('Please enter a phrase to interpret!');
      return;
    }

    setIsLoading(true);
    setError('');
    setShowResponse(false);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: textToInterpret })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const parsed = parseStructuredResponse(data.response, textToInterpret);
      setParsedResponse(parsed);
      setOriginalPhrase(textToInterpret);
      setShowResponse(true);
      setPhrase('');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get interpretation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setPhrase(suggestion);
    interpretPhrase(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      interpretPhrase();
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-5">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/image.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl space-y-5">
        {/* Header Card */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-8 text-center shadow-2xl hover:translate-y-[-2px] transition-transform">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Cultural Interpretation
          </h1>
          <p className="text-xl text-white/95 drop-shadow">
            Understand the deeper meaning behind local phrases
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-10 shadow-2xl hover:translate-y-[-2px] transition-transform">
          <div className="mb-6">
            <label className="block text-white text-base font-semibold mb-3 drop-shadow">
              Enter a phrase to interpret:
            </label>
            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Chaliye ji, Jugaad, Dekhte hain..."
              className="w-full px-6 py-4 text-lg border-2 border-white/30 rounded-2xl bg-white/25 backdrop-blur-md text-white font-medium placeholder-white/70 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all shadow-lg"
            />
            <button
              onClick={() => interpretPhrase()}
              disabled={isLoading}
              className="w-full mt-4 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#D4A574] to-[#C89968] rounded-2xl hover:translate-y-[-2px] hover:shadow-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
            >
              {isLoading ? 'Analyzing...' : 'Interpret Meaning'}
            </button>
          </div>

          {/* Suggestions */}
          <div className="mt-6">
            <span className="block text-white/90 text-sm font-medium mb-3 drop-shadow">
              Try these examples:
            </span>
            <div className="flex flex-wrap gap-3">
              {['Abhi thoda kaam hai', 'Chaliye ji', 'Dekhte hain', 'Aap ka keeht hua'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => useSuggestion(suggestion)}
                  className="px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-medium hover:bg-white/35 hover:translate-y-[-2px] hover:shadow-lg transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-10">
              <div className="inline-block w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-5"></div>
              <p className="text-white text-lg font-medium drop-shadow">
                Analyzing cultural context...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 bg-red-500/20 backdrop-blur-md border-2 border-red-500/50 rounded-2xl p-5 text-white font-medium drop-shadow">
              ❌ {error}
            </div>
          )}
        </div>

        {/* Response Card */}
        {showResponse && (
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-10 shadow-2xl animate-slideUp">
            {/* Response Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-white/20">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                Cultural Interpretation
              </h2>
              <span className="px-4 py-1.5 bg-gradient-to-r from-[#D4A574] to-[#C89968] rounded-full text-white text-xs font-bold tracking-wide shadow-lg">
                AI POWERED
              </span>
            </div>

            {/* Original Phrase */}
            <div className="bg-white/25 backdrop-blur-md border-2 border-white/30 rounded-2xl p-6 mb-6 text-center">
              <div className="text-white/90 text-xs font-bold uppercase tracking-wider mb-2">
                Original Phrase
              </div>
              <div className="text-white text-2xl font-semibold drop-shadow">
                "{originalPhrase}"
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-5 hover:bg-white/25 hover:translate-y-[-2px] transition-all">
                <div className="text-white/95 text-xs font-bold uppercase tracking-wider mb-2.5 drop-shadow">
                  IMPLIED MEANING
                </div>
                <div className="text-white text-base leading-relaxed font-medium drop-shadow">
                  {parsedResponse.impliedMeaning || 'Not available'}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-5 hover:bg-white/25 hover:translate-y-[-2px] transition-all">
                <div className="text-white/95 text-xs font-bold uppercase tracking-wider mb-2.5 drop-shadow">
                  TONE CATEGORY
                </div>
                <div className="text-white text-base leading-relaxed font-medium drop-shadow">
                  {parsedResponse.toneCategory || 'Not available'}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-5 hover:bg-white/25 hover:translate-y-[-2px] transition-all">
                <div className="text-white/95 text-xs font-bold uppercase tracking-wider mb-2.5 drop-shadow">
                  USAGE CONTEXT
                </div>
                <div className="text-white text-base leading-relaxed font-medium drop-shadow">
                  {parsedResponse.usageContext || 'Not available'}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-5 hover:bg-white/25 hover:translate-y-[-2px] transition-all">
                <div className="text-white/95 text-xs font-bold uppercase tracking-wider mb-2.5 drop-shadow">
                  SOCIAL APPROPRIATENESS
                </div>
                <div className="text-white text-base leading-relaxed font-medium drop-shadow">
                  {parsedResponse.socialAppropriateness || 'Not available'}
                </div>
              </div>
            </div>

            {/* Explanation Boxes */}
            <div className="bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-6 mb-5">
              <div className="text-white/95 text-xs font-bold uppercase tracking-wider mb-3 drop-shadow">
                RISKS / CULTURAL NOTES
              </div>
              <div className="text-white text-base leading-loose drop-shadow">
                {parsedResponse.culturalNotes || 'Not available'}
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-6">
              <div className="text-white/95 text-xs font-bold uppercase tracking-wider mb-3 drop-shadow">
                CULTURAL EXPLANATION
              </div>
              <div className="text-white text-base leading-loose drop-shadow">
                {parsedResponse.culturalExplanation || 'Not available'}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
