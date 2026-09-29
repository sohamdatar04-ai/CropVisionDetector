import React, { useState } from 'react'
import {
  Bot,
  Send,
  Mic,
  Image as ImageIcon,
  Sparkles,
  User,
  Leaf,
} from 'lucide-react'
import { Button, Card, Badge } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'

interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  advisoryType?: string
}

export const AssistantPage: React.FC = () => {
  const { showToast } = useToast()
  const { isOffline, language, t } = useApp()
  const [inputText, setInputText] = useState('')

  // Language-specific seed conversations
  const defaultMessages: Record<string, ChatMessage[]> = {
    en: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Yellow spots appeared on my wheat flag leaves after the recent rains. Should I spray fungicide immediately?',
        timestamp: '10:14 AM',
      },
      {
        id: 'm2',
        sender: 'assistant',
        text: `Based on your recent scan from Plot 1 (Wheat PBW 550), the symptoms match **Yellow Stripe Rust (Puccinia striiformis)**.\n\nHere is your immediate field action plan:\n1. **Recommended Spray:** Propiconazole 25% EC @ 200 ml in 200 liters of water per acre.\n2. **Alternative Organic Formulation:** 5% Neem Seed Kernel Extract (NSKE) with soap solution if infestation is under 5%.\n3. **Ideal Spray Window:** Tomorrow morning 7:00 AM - 10:30 AM before wind speed picks up.\n4. **Caution:** Avoid spraying if dew or raindrops are still standing heavily on the leaves.`,
        timestamp: '10:15 AM',
        advisoryType: 'Fungicide Recommendation',
      },
    ],
    hi: [
      {
        id: 'm1',
        sender: 'user',
        text: 'हाल की बारिश के बाद मेरे गेहूं के पत्तों पर पीले धब्बे दिखाई दिए हैं। क्या मुझे तुरंत कवकनाशी का छिड़काव करना चाहिए?',
        timestamp: '10:14 AM',
      },
      {
        id: 'm2',
        sender: 'assistant',
        text: `खेत 1 (गेहूं PBW 550) के आपके हालिया स्कैन के आधार पर, लक्षण **पीला रतुआ / स्ट्राइप रस्ट (Puccinia striiformis)** से मेल खाते हैं।\n\nतत्काल कार्य योजना:\n1. **सुझाया गया रासायनिक छिड़काव:** प्रोपिकोनाज़ोल 25% EC @ 200 मिली प्रति 200 लीटर पानी प्रति एकड़।\n2. **जैविक विकल्प:** 5% नीम बीज अर्क (NSKE) साबुन के घोल के साथ।\n3. **अनुकूल समय:** कल सुबह 7:00 से 10:30 बजे तक हवा की गति बढ़ने से पहले।\n4. **सावधानी:** पत्तों पर भारी ओस या बारिश की बूंदें जमा होने पर छिड़काव न करें।`,
        timestamp: '10:15 AM',
        advisoryType: 'कवकनाशी सलाह (Fungicide Recommendation)',
      },
    ],
    mr: [
      {
        id: 'm1',
        sender: 'user',
        text: 'नुकत्याच झालेल्या पावसानंतर माझ्या गव्हाच्या पानांवर पिवळे डाग दिसत आहेत. मी ताबडतोब बुरशीनाशक फवारणी करावी का?',
        timestamp: '10:14 AM',
      },
      {
        id: 'm2',
        sender: 'assistant',
        text: `शेत 1 (गहू PBW 550) च्या तुमच्या अलीकडील स्कॅननुसार, लक्षणे **पिवळा तांबेरा / रस्ट (Puccinia striiformis)** रोगाशी जुळतात.\n\nतातडीची कृती योजना:\n1. **सुचवलेली फवारणी:** प्रोपिकोनाझोल 25% EC @ 200 मिली प्रति 200 लिटर पाण्यात प्रति एकर.\n2. **सेंद्रिय पर्याय:** 5% निंबोळी अर्क (NSKE) साबणाच्या द्रावणासह.\n3. **फवारणीची वेळ:** उद्या सकाळी 7:00 ते 10:30 दरम्यान वारा वाढण्यापूर्वी.\n4. **काळजी:** पानांवर दव किंवा पावसाचे थेंब असताना फवारणी करू नका.`,
        timestamp: '10:15 AM',
        advisoryType: 'बुरशीनाशक सल्ला (Fungicide Recommendation)',
      },
    ],
  }

  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages[language] || defaultMessages.en)

  // Quick prompts by language
  const suggestedPromptsByLang: Record<string, string[]> = {
    en: [
      'Organic spray for Mustard Aphids',
      'How to correct Zinc deficiency in Paddy',
      'Best spray timing for tomorrow morning',
      'Nano-Urea vs Granular Urea dosage per acre',
    ],
    hi: [
      'सरसों के माहू (एफिड) का जैविक नियंत्रण',
      'धान में जिंक की कमी कैसे दूर करें',
      'कल सुबह छिड़काव का सही समय',
      'नैनो यूरिया बनाम दानेदार यूरिया की मात्रा',
    ],
    mr: [
      'मोहरीवरील मावा किडीसाठी सेंद्रिय उपाय',
      'भातातील जस्त (झिंक) कमतरता कशी भरून काढावी',
      'उद्या सकाळची फवारणीची योग्य वेळ',
      'नॅनो युरिया आणि पारंपरिक युरियाचे प्रमाण',
    ],
  }

  const suggestedPrompts = suggestedPromptsByLang[language] || suggestedPromptsByLang.en

  const handleSend = () => {
    if (!inputText.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: 'Just now',
    }

    setMessages((prev) => [...prev, userMsg])
    const submittedQuery = inputText
    setInputText('')

    // Realistic agronomy reply based on language
    setTimeout(() => {
      let replyContent = ''
      if (language === 'hi') {
        replyContent = `कृषि साथी एआई से संपर्क करने के लिए धन्यवाद।\n\n"${submittedQuery}" के लिए क्षेत्रीय कृषि वैज्ञानिकों (KVK) द्वारा मान्य सलाह:\n• मौसम को ध्यान में रखते हुए सुबह के समय ही छिड़काव करें।\n• सुझाई गई मात्रा से अधिक रसायन का उपयोग न करें।\n• रोग के फैलाव पर नजर रखने के लिए कल दोबारा पत्ती की जांच करें।`
      } else if (language === 'mr') {
        replyContent = `कृषी साथी एआयशी संपर्क केल्याबद्दल धन्यवाद.\n\n"${submittedQuery}" संदर्भात स्थानिक कृषी विज्ञान केंद्राने (KVK) प्रमाणित केलेला सल्ला:\n• हवामानाचा अंदाज घेऊन सकाळच्या वेळीच फवारणी करावी.\n• ठरवून दिलेल्या प्रमाणापेक्षा जास्त औषध वापरू नये.\n• रोगाचा प्रसार थांबला आहे की नाही हे पाहण्यासाठी उद्या पानांची फेर-तपासणी करा.`
      } else {
        replyContent = `Thank you for consulting Krishi Saathi AI.\n\nFor "${submittedQuery}", verified agronomist advisory:\n• Schedule foliar applications in early morning hours before wind speeds increase.\n• Maintain strict adherence to recommended dilution ratios.\n• Re-inspect canopy in 24 hours to monitor lesion arrest.`
      }

      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyContent,
        timestamp: 'Just now',
        advisoryType: language === 'hi' ? 'कृषि सलाह' : language === 'mr' ? 'कृषी सल्ला' : 'Agronomy Advisory',
      }
      setMessages((prev) => [...prev, aiReply])
    }, 700)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
            <Bot className="w-4 h-4" />
            <span>AI Field Agronomist</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
            {t('assistant.title')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isOffline ? 'offline' : 'success'} size="sm" withDot>
            {isOffline ? 'Offline Advisory Rules' : 'Edge Hybrid Model'}
          </Badge>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Ask:</span>
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(prompt)}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-800 transition-colors shrink-0 cursor-pointer shadow-2xs font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-white/80">
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Leaf className="w-5 h-5" />
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-emerald-50/70 border border-emerald-200/80 text-slate-900 rounded-tl-none shadow-xs'
                }`}
              >
                {msg.advisoryType && (
                  <div className="inline-block mb-2">
                    <Badge variant="success" size="sm">
                      {msg.advisoryType}
                    </Badge>
                  </div>
                )}
                <div className="whitespace-pre-line text-xs sm:text-sm font-normal">
                  {msg.text}
                </div>
                <div
                  className={`text-[10px] mt-2 font-medium ${
                    msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast({ title: 'Voice Note (Placeholder)', message: 'Multilingual speech-to-text will connect in next phase.', type: 'info' })}
              className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors shrink-0"
              title="Speak in Hindi/Punjabi/Marathi"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={() => showToast({ title: 'Attach Leaf Photo (Placeholder)', message: 'Will route to camera in next phase.', type: 'info' })}
              className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors shrink-0"
              title="Attach leaf photo"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('assistant.placeholder')}
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleSend}
              className="shrink-0 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Powered by Agronomic Rules & Edge Intelligence</span>
            <span className="text-emerald-700 font-medium">Safe Dosage Guardrails Active</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
