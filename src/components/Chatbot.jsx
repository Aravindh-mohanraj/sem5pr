import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Bot, User, HelpCircle, Heart, Coffee, Lightbulb, Smile
} from 'lucide-react';
import { qaKnowledgeBase, getTechnicalIndicators } from '../data/mockData';

const QUICK_ASKS = [
  { emoji: '📈', text: "Should I buy TCS right now?" },
  { emoji: '🤖', text: "What is NVIDIA's AI outlook?" },
  { emoji: '📊', text: "Explain RSI like I'm a beginner" },
  { emoji: '💼', text: "How does portfolio diversification work?" },
];

const GREETINGS = [
  "Hey there! 👋",
  "Hi friend! 😊",
  "Hello! Great to see you! 🎉",
  "Hey! Ready to learn? 🚀",
];

const THINKING_PHRASES = [
  "Hmm, let me think about that... 🤔",
  "Great question! Let me check... 📊",
  "Ooh interesting! Looking into it... 🔍",
];

export default function Chatbot({ selectedStock }) {
  const [messages, setMessages] = useState([
    {
      id: 1, sender: 'bot',
      text: `Hey there! 👋😊\n\nI'm your friendly AI stock buddy! Think of me as that friend who's really into finance but explains things simply.\n\nI can help you with:\n• 📊 Understanding stock indicators (RSI, SMA, MACD)\n• 🤖 AI-powered buy/sell/hold advice\n• 📰 News sentiment analysis\n• 💡 Learning about investing\n\nJust ask me anything — no question is too basic! Or tap one of the quick questions below to get started 👇`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      setSpeechSupported(true);
      const r = new SR();
      r.continuous = false; r.lang = 'en-US'; r.interimResults = false;
      r.onstart = () => setIsRecording(true);
      r.onresult = e => { setInputText(e.results[0][0].transcript); setIsRecording(false); };
      r.onerror = () => setIsRecording(false);
      r.onend = () => setIsRecording(false);
      recognitionRef.current = r;
    }
  }, []);

  const speakText = (text) => {
    if (!voiceEnabled) return;
    try {
      const clean = text.replace(/[*#`_\-]/g, '').replace(/[^\w\s,.!?']/g, '');
      const synth = window.speechSynthesis;
      if (synth) { synth.cancel(); const u = new SpeechSynthesisUtterance(clean); u.rate = 1.0; synth.speak(u); }
    } catch (_) {}
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const response = generateResponse(text.toLowerCase());
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'bot', text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      speakText(response);
    }, delay);
  };

  const generateResponse = (query) => {
    // Check knowledge base first
    for (const item of qaKnowledgeBase) {
      if (item.keywords.some(k => query.includes(k))) {
        return addFriendlyTouch(item.response);
      }
    }

    // Stock advice
    if (query.includes('buy') || query.includes('should i') || query.includes('recommendation') || query.includes('predict')) {
      if (query.includes('tcs')) return getStockAdvice('TCS');
      if (query.includes('reliance')) return getStockAdvice('RELIANCE');
      if (query.includes('nvidia') || query.includes('nvda')) return getStockAdvice('NVDA');
      if (query.includes('infosys') || query.includes('infy')) return getStockAdvice('INFY');
      if (query.includes('apple') || query.includes('aapl')) return getStockAdvice('AAPL');
      if (query.includes('microsoft') || query.includes('msft')) return getStockAdvice('MSFT');
      if (query.includes('tesla') || query.includes('tsla')) return getStockAdvice('TSLA');
      if (query.includes('hdfc')) return getStockAdvice('HDFCBANK');
      return getStockAdvice(selectedStock.id);
    }

    // Greetings
    if (/^(hi|hello|hey|sup|yo|hola|namaste)/i.test(query)) {
      return `${GREETINGS[Math.floor(Math.random() * GREETINGS.length)]}\n\nHow can I help you today? You can ask me about any stock, technical indicators, or investing concepts! 😄`;
    }

    // Thanks
    if (/thank|thanks|thx|tysm/i.test(query)) {
      return "You're welcome! 😊 Happy to help anytime. Got more questions? Fire away! 🔥";
    }

    // Default friendly fallback
    return `That's a great question! 🤔\n\nI'm best at helping with stock analysis and investing concepts. Here are some things you can try:\n\n• "Should I buy TCS?" — I'll give you an AI-powered analysis\n• "What is RSI?" — I'll explain it in simple terms\n• "NVIDIA outlook" — I'll share the latest AI insights\n\nFeel free to ask anything — I'm here to help! 💪`;
  };

  const addFriendlyTouch = (response) => {
    const starters = [
      "Great question! 🎯\n\n",
      "Glad you asked! 😊\n\n",
      "Ooh, this is a good one! 💡\n\n",
      "Let me break this down for you! 📊\n\n",
    ];
    const enders = [
      "\n\nHope that helps! Let me know if you want me to explain further 😊",
      "\n\nWant me to dive deeper into any part of this? 🤓",
      "\n\nFeel free to ask follow-up questions! I'm here for you 💪",
    ];
    return starters[Math.floor(Math.random() * starters.length)] + response + enders[Math.floor(Math.random() * enders.length)];
  };

  const getStockAdvice = (stockId) => {
    const ind = getTechnicalIndicators(stockId);
    const { rsi, predictions } = ind;
    const rating = rsi < 35 ? 'BUY' : rsi > 70 ? 'SELL' : 'HOLD';
    const emoji = rating === 'BUY' ? '🟢' : rating === 'SELL' ? '🔴' : '🟡';
    
    return `Here's what I found for ${stockId}! ${emoji}\n\n` +
      `📌 My AI says: **${rating}**\n\n` +
      `📊 Technical Snapshot:\n` +
      `• RSI (14-day): ${rsi} ${rsi < 30 ? '— Oversold! Could be a buying opportunity 👀' : rsi > 70 ? '— Overbought! Be careful here ⚠️' : '— Neutral zone'}\n` +
      `• 14-day SMA: ₹${ind.sma14.toLocaleString()}\n\n` +
      `🤖 AI Price Forecast:\n` +
      `• 7-day target: ₹${predictions.days7.toFixed(2)} (${predictions.days7ChangePct >= 0 ? '📈 +' : '📉 '}${predictions.days7ChangePct}%)\n` +
      `• 30-day target: ₹${predictions.days30.toFixed(2)} (${predictions.days30ChangePct >= 0 ? '📈 +' : '📉 '}${predictions.days30ChangePct}%)\n\n` +
      `💡 Pro tip: ${rsi < 30 ? "When RSI is this low, it often means the stock is oversold — could be a good entry point for long-term investors!" : rsi > 70 ? "High RSI means lots of buying pressure. Consider waiting for a pullback before entering." : "The stock is in a neutral range. Watch for a breakout above resistance or a dip to support levels."}\n\n` +
      `Remember, always do your own research too! 📚`;
  };

  const toggleRecording = () => {
    if (!speechSupported) return;
    isRecording ? recognitionRef.current?.stop() : recognitionRef.current?.start();
  };

  return (
    <div className="flex gap-5 h-[calc(100vh-14rem)]">
      
      {/* Chat Area */}
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-[15px] text-gray-900">StockBuddy AI</h3>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online — here to help!
              </span>
            </div>
          </div>
          <button onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg border transition-colors ${voiceEnabled ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}
            title={voiceEnabled ? "Voice On" : "Voice Off"}>
            {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'bot' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot size={14} />
                </div>
              )}
              <div className={`max-w-[75%] ${m.sender === 'user' ? '' : ''}`}>
                <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${
                  m.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-md shadow-sm' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                }`}>
                  {m.text}
                </div>
                <span className={`text-[10px] mt-1 block ${m.sender === 'user' ? 'text-right text-gray-400' : 'text-gray-400'}`}>{m.time}</span>
              </div>
              {m.sender === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={14} />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0 space-y-3">
          {/* Quick asks */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {QUICK_ASKS.map((q, i) => (
              <button key={i} onClick={() => handleSend(q.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 rounded-full text-[12px] font-medium text-gray-700 hover:text-blue-700 whitespace-nowrap shrink-0 transition-colors">
                <span>{q.emoji}</span> {q.text}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-2">
            {speechSupported && (
              <button onClick={toggleRecording}
                className={`p-2.5 rounded-xl border transition-all ${isRecording ? 'border-red-300 bg-red-50 text-red-500 animate-pulse' : 'border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-700'}`}
                title={isRecording ? "Listening..." : "Voice input"}>
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
            <input type="text" value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(inputText)}
              placeholder={isRecording ? "🎤 Listening... speak now!" : "Type your question here... 😊"}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-gray-400"
              disabled={isRecording} />
            <button onClick={() => handleSend(inputText)}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/20 transition-all">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Tips */}
      <div className="w-72 hidden xl:flex flex-col gap-4 shrink-0">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" />
            <h4 className="font-semibold text-sm text-gray-900">Tips & Tricks</h4>
          </div>
          
          <div className="space-y-3 text-[13px] text-gray-600 leading-relaxed">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <span className="font-semibold text-blue-900 text-xs block mb-1">🎤 Voice Chat</span>
              <p className="text-xs text-blue-700">Click the mic to talk! I'll listen and speak back to you.</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <span className="font-semibold text-amber-900 text-xs block mb-1">🧠 Smart Context</span>
              <p className="text-xs text-amber-700">Ask "Should I buy?" and I'll automatically analyze <strong>{selectedStock.id}</strong> for you!</p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <span className="font-semibold text-emerald-900 text-xs block mb-1">💬 Try asking</span>
              <p className="text-xs text-emerald-700">"What's the difference between SMA and EMA?" or "Is Tesla overvalued?"</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
          <Coffee size={20} className="text-blue-200 mb-2" />
          <p className="text-sm font-semibold">Learning is fun!</p>
          <p className="text-xs text-blue-200 mt-1 leading-relaxed">I'm here to make finance easy and enjoyable. No jargon, just plain English! 🎓</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[10px] text-gray-400 leading-normal text-center">
          ⚠️ For educational purposes only. Not financial advice.
        </div>
      </div>
    </div>
  );
}
