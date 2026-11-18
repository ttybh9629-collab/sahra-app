'use client';
import React, { useState } from 'react';
import { Mic, MicOff, Gift, MessageSquare, Users, Crown, Wallet, Sparkles, LogIn, ArrowRight } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [micMuted, setMicMuted] = useState(true);
  const [coins, setCoins] = useState(5280);

  const rooms = [
    "قصر الأمير الملكي",
    "سهرة الأمراء والديوانية",
    "غرفة السهرة الملكية الخاصة",
    "جلسة طرب وشات الأمير"
  ].map((name, i) => ({
    id: i + 1,
    name,
    host: `الامير ${i + 1}`,
    listeners: Math.floor(Math.random() * 50) + 15,
    seatsCount: 15
  }));

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#07020d] text-white font-sans pb-10 select-none">
      
      {/* 1. شاشة تسجيل الدخول لـ تطبيق الأمير */}
      {!isLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-purple-950/90 via-slate-900 to-slate-950 border border-amber-500/50 p-6 rounded-3xl shadow-2xl text-center backdrop-blur-md">
            <div className="flex justify-center mb-3">
              <Crown className="text-amber-400 w-12 h-12 animate-bounce" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent mb-1">
              ⋆ 𝑨𝑴𝑰𝑹⋆ تطبيق الأمير
            </h1>
            <p className="text-xs text-purple-300/80 mb-6">منصة الغرف الصوتية والسهرات الملكية (15 مقعد)</p>
            
            <form onSubmit={handleLogin} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">اسم المستخدم / لقب الأمير</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="اكتب اسمك هنا..."
                  required
                  className="w-full bg-purple-950/50 border border-amber-500/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 text-sm"
              >
                <LogIn className="w-4 h-4" /> دخول تطبيق الأمير
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* 2. التطبيق الرئيسي لتطبيق الأمير */
        <div>
          {/* Header */}
          <header className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border-b border-purple-900/40 p-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <Crown className="text-amber-400 w-6 h-6 animate-pulse" />
              <span className="text-lg font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                ⋆ 𝑨𝑴𝑰𝑹⋆ تطبيق الأمير
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-purple-200 bg-purple-900/40 px-3 py-1 rounded-full border border-purple-500/30">
                مرحباً، <span className="text-amber-300 font-bold">{username}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-purple-900/40 px-3 py-1.5 rounded-full border border-purple-500/30">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">{coins}</span>
              </div>
            </div>
          </header>

          {!inRoom ? (
            /* قائمة الغرف الخاصة بتطبيق الأمير */
            <main className="p-4 max-w-md mx-auto">
              <div className="mb-6 bg-gradient-to-br from-purple-900/60 to-slate-900 p-5 rounded-2xl border border-amber-500/30 text-center shadow-lg">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h2 className="text-lg font-bold text-amber-200 mb-1">غرف تطبيق الأمير الملكية</h2>
                <p className="text-xs text-purple-300 mb-4">اختر غرفتك واستمتع بسهرات صوتية بـ 15 مقعد</p>
              </div>

              <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> الغرف النشطة في تطبيق الأمير
              </h3>

              <div className="space-y-3">
                {rooms.map((room) => (
                  <div 
                    key={room.id}
                    onClick={() => { setInRoom(true); setCurrentRoom(room); }}
                    className="bg-slate-900/90 border border-purple-900/40 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:border-amber-500/50 transition shadow-md"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm">{room.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">مضيف الغرفة: {room.host} • 15 مقعد صوتي</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-950/80 px-3 py-1 rounded-full text-xs text-amber-300 border border-purple-800">
                        {room.listeners} مستمع
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                ))}
              </div>
            </main>
          ) : (
            /* واجهة الغرفة الصوتية لـ تطبيق الأمير (15 مقعد) */
            <div className="p-4 max-w-md mx-auto">
              <div className="bg-slate-900 border border-amber-500/40 p-4 rounded-2xl mb-4 text-center relative shadow-xl">
                <button 
                  onClick={() => setInRoom(false)}
                  className="absolute top-3 left-3 text-xs bg-red-950/80 text-red-300 px-3 py-1.5 rounded-full border border-red-800 hover:bg-red-900 transition"
                >
                  مغادرة الغرفة
                </button>
                <h2 className="text-base font-bold text-amber-200 mb-1">{currentRoom?.name}</h2>
                <p className="text-xs text-purple-300">غرفة تطبيق الأمير • 15 مقعد نشط</p>
              </div>

              {/* شبكة الـ 15 مقعد */}
              <div className="grid grid-cols-5 gap-3 mb-6 bg-purple-950/20 p-4 rounded-2xl border border-purple-900/30">
                {Array.from({ length: 15 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full ${idx === 0 ? 'bg-gradient-to-tr from-amber-600 to-amber-400 border-2 border-amber-300 shadow-amber-500/50' : 'bg-purple-950 border border-amber-500/50'} flex items-center justify-center relative shadow-inner`}>
                      <Users className={`w-5 h-5 ${idx === 0 ? 'text-slate-950' : 'text-purple-300'}`} />
                      {idx === 0 && <Crown className="w-3.5 h-3.5 text-slate-950 absolute -top-1 -right-1" />}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">مقعد {idx + 1}</span>
                  </div>
                ))}
              </div>

              {/* أزرار التحكم السفلية داخل الغرفة */}
              <div className="flex justify-around items-center bg-slate-900/90 border border-amber-500/30 p-3 rounded-2xl shadow-lg">
                <button 
                  onClick={() => setMicMuted(!micMuted)}
                  className={`p-3 rounded-full transition ${micMuted ? 'bg-red-950/80 text-red-400 border border-red-800' : 'bg-green-950/80 text-green-400 border border-green-800'}`}
                >
                  {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button className="p-3 bg-purple-950/80 text-amber-300 rounded-full border border-purple-800 hover:bg-purple-900">
                  <Gift className="w-5 h-5" />
                </button>
                <button className="p-3 bg-purple-950/80 text-purple-300 rounded-full border border-purple-800 hover:bg-purple-900">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
