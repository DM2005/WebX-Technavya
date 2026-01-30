import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic, MicOff, Phone, PhoneOff, Bot, User } from 'lucide-react';

const VapiWidget = ({ apiKey, assistantId }) => {
  const [vapi, setVapi] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState([]);

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    vapiInstance.on('call-start', () => {
      setIsConnected(true);
    });

    vapiInstance.on('call-end', () => {
      setIsConnected(false);
      setIsSpeaking(false);
    });

    vapiInstance.on('speech-start', () => {
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      setIsSpeaking(false);
    });

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript') {
        setTranscript((prev) => [
          ...prev,
          { role: message.role, text: message.transcript },
        ]);
      }
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
    });

    return () => {
      vapiInstance.stop();
    };
  }, [apiKey]);

  const startCall = () => {
    vapi?.start(assistantId);
  };

  const endCall = () => {
    vapi?.stop();
  };

  if (!isConnected) {
    // Not connected state - show start button centered in the available space
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="relative group">
            <button
              onClick={startCall}
              className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-3"
            >
              <div className="relative">
                <Mic className="w-6 h-6 animate-pulse" />
                <div className="absolute -inset-2 bg-white/20 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-lg cursor-pointer">Start Voice Chat</span>
              <div className="flex items-center gap-1 ml-2">
                <div className="w-1 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-4 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="w-1 h-5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
              </div>
            </button>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
          </div>
          <p className="mt-6 text-gray-400 text-sm max-w-sm">
            Click to start a voice conversation with our AI assistant
          </p>
        </div>
      </div>
    );
  }

  // Connected state - show chat interface with bottom controls
  return (
    <div className="h-full flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
        {transcript.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-full flex items-center justify-center">
                {isSpeaking ? (
                  <MicOff className="w-8 h-8 text-emerald-400" />
                ) : (
                  <Mic className="w-8 h-8 text-emerald-400 animate-pulse" />
                )}
              </div>
              <p className="text-gray-400 text-sm">
                Your voice conversation will appear here...
              </p>
            </div>
          </div>
        ) : (
          transcript.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-3 max-w-[85%] ${
                  msg.role === 'user'
                    ? 'flex-row-reverse space-x-reverse'
                    : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-green-700 to-blue-700'
                      : 'bg-gradient-to-br from-emerald-500 to-emerald-700'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5 text-gray-300" />
                  ) : (
                    <Bot className="w-5 h-5 text-black" />
                  )}
                </div>
                <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed bg-white/10 backdrop-blur-sm border border-white/10 text-white">
                  {msg.text}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom controls - FIXED with consistent spacing */}
      <div className="bg-black p-4 border-t border-white/20 flex-shrink-0">
        <div className="flex items-center justify-between max-w-4xl mx-auto min-h-[60px]">
          {/* Left indicator - Fixed width container */}
          <div className="flex items-center gap-4 min-w-[200px]">
            <div className="relative flex items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  isSpeaking
                    ? 'bg-red-500 shadow-lg shadow-red-500/50'
                    : 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                } transition-all duration-300 ${isSpeaking ? 'animate-pulse' : 'animate-pulse'}`}
              ></div>
              {isSpeaking && (
                <div className="flex items-end gap-1 ml-4">
                  <div className="w-1 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-1 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className={`font-medium text-sm ${isSpeaking ? 'text-red-400' : 'text-emerald-400'} transition-colors duration-300`}>
                {isSpeaking ? 'AI Speaking' : 'Listening'}
              </span>
              <span className="text-gray-500 text-xs">
                {isSpeaking ? 'Please wait...' : 'Speak now'}
              </span>
            </div>
          </div>

          {/* Center microphone indicator - Absolute center */}
          <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isSpeaking 
                  ? 'bg-red-500/20 border-2 border-red-500/40' 
                  : 'bg-emerald-500/20 border-2 border-emerald-500/40'
              } transition-all duration-300`}>
                {isSpeaking ? (
                  <MicOff className="w-6 h-6 text-red-400" />
                ) : (
                  <Mic className="w-6 h-6 text-emerald-400 animate-pulse" />
                )}
              </div>
              {!isSpeaking && (
                <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping"></div>
              )}
            </div>
          </div>

          {/* End call button - Fixed width container */}
          <div className="flex justify-end min-w-[200px]">
            <button
              onClick={endCall}
              className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg shadow-red-600/30"
            >
              <PhoneOff className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">End Call</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VapiWidget;