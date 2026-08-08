import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  User,
  HelpCircle
} from 'lucide-react';
import { qaKnowledgeBase, getTechnicalIndicators } from '../data/mockData';

const PRESET_QUERIES = [
  "Should I buy TCS right now?",
  "What is NVIDIA AI outlook?",
  "What is RSI and how does it help newbies?",
  "How does Modern Portfolio Theory reduce risk?"
];

export default function Chatbot({ selectedStock }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello! I am your AI Financial Mentor. 🤖💰 
      I can explain technical indicators, evaluate risk, analyze sentiment, and answer questions about TCS, Reliance, Infosys, Apple, Nvidia, Microsoft, Tesla, or HDFC Bank. 
      Try asking a question or select a quick query below!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setInputText(speechToText);
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speakText = (text) => {
    if (!voiceEnabled) return;
    try {
      const cleanText = text.replace(/[*#`_\-]/g, '');
      const synth = window.speechSynthesis;
      if (synth) {
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        synth.speak(utterance);
      }
    } catch (e) {
      console.log('Speech synthesis failed');
    }
  };

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const responseText = generateBotResponse(textToSend.toLowerCase());
      
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      speakText(responseText);
    }, 600);
  };

  const generateBotResponse = (query) => {
    for (const item of qaKnowledgeBase) {
      if (item.keywords.some(k => query.includes(k))) {
        return item.response;
      }
    }

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

    return `As an AI Mentor, I suggest analyzing the stock's **RSI indicator** (if it's below 30, it is oversold) and checking its **News Sentiment**. 
    For specific insights, try asking:
    * *"Should I buy TCS?"*
    * *"What is NVIDIA AI outlook?"*
    * *"What is RSI?"*`;
  };

  const getStockAdvice = (stockId) => {
    const indicators = getTechnicalIndicators(stockId);
    const { rsi, predictions } = indicators;
    const rating = rsi < 35 ? 'BUY' : rsi > 70 ? 'SELL' : 'HOLD';
    
    return `For **${stockId}**, technical models suggest a **${rating}** recommendation.
    * **Technical Standing**: RSI is at ${rsi} (14-day index). 14-day SMA is at ₹${indicators.sma14.toLocaleString()}.
    * **LSTM AI Forecast**: Our short-term neural net model predicts a 7-day target of ₹${predictions.days7.toFixed(2)} (${predictions.days7ChangePct >= 0 ? '+' : ''}${predictions.days7ChangePct}%) and 30-day target of ₹${predictions.days30.toFixed(2)} (${predictions.days30ChangePct >= 0 ? '+' : ''}${predictions.days30ChangePct}%).
    * **Guidance**: If RSI is nearing oversold levels (<30), it provides a low-risk accumulation zone for long-term investors.`;
  };

  const toggleRecording = () => {
    if (!speechSupported) return;
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-14rem)]">
      
      {/* Left Area: Chat Container */}
      <div className="flex-1 glass-panel rounded-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-sky-600" />
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900">AI Financial Mentor</h3>
              <span className="text-[10px] text-sky-700 font-bold flex items-center gap-0.5">
                <Sparkles size={8} /> Active Conversation
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-lg border transition-colors ${
                voiceEnabled 
                  ? 'border-sky-300 bg-sky-50 text-sky-700' 
                  : 'border-slate-200 text-slate-400 hover:text-slate-700'
              }`}
              title={voiceEnabled ? "Mute Voice Assistant Output" : "Unmute Voice Assistant Output"}
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
              <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                m.sender === 'user' ? 'bg-sky-600 text-white' : 'bg-slate-900 text-white'
              }`}>
                {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-4 rounded-2xl text-xs space-y-1.5 leading-relaxed font-medium ${
                m.sender === 'user' 
                  ? 'bg-sky-600 text-white rounded-tr-none shadow-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line shadow-sm'
              }`}>
                <p>{m.text}</p>
                <span className={`text-[9px] block text-right font-mono ${m.sender === 'user' ? 'text-sky-100' : 'text-slate-400'}`}>{m.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0 space-y-3">
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 text-slate-700 select-none">
            {PRESET_QUERIES.map((q, idx) => (
              <button 
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-bold whitespace-nowrap shrink-0 transition-colors text-slate-700"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {speechSupported && (
              <button 
                onClick={toggleRecording}
                className={`p-3 rounded-xl border transition-all ${
                  isRecording 
                    ? 'border-rose-500 bg-rose-50 text-rose-600 animate-pulse' 
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
                title={isRecording ? "Listening... Click to Stop" : "Start Voice Input Assistant"}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
            
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder={isRecording ? "Listening... Speak now!" : "Ask your financial mentor..."}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              disabled={isRecording}
            />

            <button 
              onClick={() => handleSendMessage(inputText)}
              className="p-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-md shadow-sky-600/20 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>

      {/* Right Area: Helper Info Card */}
      <div className="w-80 glass-panel rounded-2xl p-6 hidden xl:flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-sky-600" />
            <h4 className="font-display font-bold text-sm text-slate-900">Mentor Handbook</h4>
          </div>
          
          <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-medium">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900 block mb-1">Interactive Voice Assistant</span>
              <p>Click the microphone icon to speak. The AI converts your voice to text and speaks responses aloud!</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900 block mb-1">Context Awareness</span>
              <p>The chatbot monitors the active stock. If you ask: *"Should I buy?"*, it compiles metrics for **{selectedStock.id}**.</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-normal">
          Disclaimer: Information provided is for learning and demonstration purposes.
        </div>
      </div>

    </div>
  );
}
