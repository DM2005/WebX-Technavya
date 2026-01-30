import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Mic, MessageSquare, Paperclip, X } from 'lucide-react';
import { sendChatMessage } from '../services/chatBotService';
import { Think } from '../assets/think';
import VapiWidget from "./VapiWidget";

const apiKey = import.meta.env.VITE_VAPI_API_KEY;
const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

const ChatBot = ({ userData }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm an AI assistant. How can I help you today?",
      isBot: true
    }
  ]);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false); // Toggle state

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedFile({
            file: file,
            preview: e.target.result,
            base64: e.target.result.split(',')[1],
            mimeType: file.type
          });
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select an image file.");
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getBotResponse = async (userMessage, fileData) => {
    try {
      const response = await sendChatMessage(userMessage, userData, fileData);
      return response.message;
    } catch (error) {
      console.error("Error getting bot response:", error);
      return "Sorry, I couldn't process your request. Please try again later.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || isSending) return;

    const newUserMessage = {
      id: Date.now(),
      text: input,
      image: selectedFile ? selectedFile.preview : null,
      isBot: false
    };

    const fileDataToSend = selectedFile ? {
      mimeType: selectedFile.mimeType,
      data: selectedFile.base64
    } : null;

    setMessages((prev) => [...prev, newUserMessage]);
    const userInput = input;
    setInput('');
    clearFile();
    setIsSending(true);

    try {
      const typingMessageId = Date.now() + 1;
      setMessages((prev) => [
        ...prev,
        {
          id: typingMessageId,
          text: "Thinking...",
          isBot: true,
          isTyping: true
        },
      ]);
      const botMessageText = await getBotResponse(userInput, fileDataToSend);

      setMessages((prev) => {
        const updatedMessages = prev.filter(msg => msg.id !== typingMessageId);
        return [
          ...updatedMessages,
          {
            id: Date.now() + 2,
            text: botMessageText,
            isBot: true
          }
        ];
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setMessages((prev) => {
        const updatedMessages = prev.filter(msg => !msg.isTyping);
        return [
          ...updatedMessages,
          {
            id: Date.now() + 2,
            text: "An error occurred. Please check the console.",
            isBot: true
          }
        ];
      });
    } finally {
      setIsSending(false);
    }
  };

  const toggleMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  // Voice AI Component - moved outside to prevent recreation
  const renderVoiceAI = () => {
    return (
      <div className="flex-1 pt-20 min-h-0">
        <VapiWidget
          apiKey={apiKey}
          assistantId={assistantId}
        />
      </div>
    );
  };

  // Text AI Component - moved to direct JSX to prevent recreation
  const renderTextAI = () => {
    return (
      <>
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 pt-20 space-y-6 scroll-smooth min-h-0"
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[85%] ${message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isBot
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-700'
                  : 'bg-gradient-to-r from-green-700 to-blue-700'
                  }`}>
                  {message.isBot ? (
                    <Bot className="w-5 h-5 text-black" />
                  ) : (
                    <User className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.isTyping ? 'animate-pulse' : ''
                  } ${message.isBot
                    ? 'bg-white/10 backdrop-blur-sm border border-white/10 text-white'
                    : 'bg-white/20 backdrop-blur-sm border border-white/10 text-white'
                  }`}>
                  {message.isTyping ? <Think /> : (
                    <>
                      {message.image && (
                        <img src={message.image} alt="User upload" className="mb-2 max-w-full rounded-lg max-h-48 object-cover" />
                      )}
                      {message.text && <p>{message.text}</p>}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black/30 backdrop-blur-sm p-4 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-2">
              {selectedFile && (
                <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg w-max">
                  <img src={selectedFile.preview} alt="Selected" className="h-10 w-10 object-cover rounded" />
                  <span className="text-xs text-gray-300 truncate max-w-[150px]">{selectedFile.file.name}</span>
                  <button onClick={clearFile} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending}
                  className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Attach image"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isSending ? "Bot is thinking..." : "Type your message..."}
                  disabled={isSending}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-sm text-gray-100 placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent shadow-md shadow-black/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={(!input.trim() && !selectedFile) || isSending}
                  className="cursor-pointer bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-md shadow-emerald-800/30"
                >
                  {isSending ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="w-full mx-auto h-[770px] flex flex-col bg-black border border-gray-700 rounded-lg shadow-lg overflow-hidden relative">

      {/* Header with Toggle - Fixed positioning */}
      <div className="absolute top-0 left-0 right-0 z-20 backdrop-blur-md bg-black/90 border-b border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-gray-100 font-medium text-sm">Triksha Bot</h2>
            <p className="text-gray-400 text-xs">
              {isVoiceMode ? 'Voice AI Assistant' : 'Text AI Assistant'}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2">
          <MessageSquare className={`w-4 h-4 transition-colors duration-200 ${!isVoiceMode ? 'text-emerald-400' : 'text-gray-500'}`} />
          <button
            onClick={toggleMode}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black ${isVoiceMode ? 'bg-emerald-600' : 'bg-gray-600'
              }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isVoiceMode ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
          </button>
          <Mic className={`w-4 h-4 transition-colors duration-200 ${isVoiceMode ? 'text-emerald-400' : 'text-gray-500'}`} />
        </div>
      </div>

      {/* Conditional Rendering based on mode */}
      {isVoiceMode ? renderVoiceAI() : renderTextAI()}
    </div>
  );
};

const AIAgent = () => {
  return (
    <div>
      <ChatBot />
    </div>
  );
}

export default ChatBot;