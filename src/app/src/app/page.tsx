'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Mic, MicOff, Volume2, Trophy, Gift, Sparkles, Settings,
  LogOut, Shield, Crown, Users, Home, Wallet, Plus,
  Edit3, Sliders, MessageSquare, Ban, Lock, FileText, Music, Pin, Send
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function SahraFullApp() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [appSettings, setAppSettings] = useState<any>({
    app_name: 'SAHRA',
    logo_url: 'https://placehold.co/200x200/1A0B2E/D4AF37?text=SAHRA',
  });
  const [loading, setLoading] = useState(true);

  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('ذكر');
  const [birthDate, setBirthDate] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [authMsg, setAuthMsg] = useState('');

  const [activeScreen, setActiveScreen] = useState<'home' | 'room' | 'wallet' | 'admin'>('home');
  const [homeTab, setHomeTab] = useState<'Play' | 'شائع' | 'جديد'>('Play');
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [gifts, setGifts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [isMicOn, setIsMicOn] = useState(false);
  const [entryNotice, setEntryNotice] = useState<any>(null);
  const [activeGiftAnim, setActiveGiftAnim] = useState<any>(null);

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [chargeId, setChargeId] = useState('');
  const [chargeAmount, setChargeAmount] = useState(1000);

  useEffect(() => {
    initApp();
  }, []);

  async function initApp() {
    const { data: settingsData } = await supabase.from('app_settings').select('*').eq('id', 1).single();
    if (settingsData) setAppSettings(settingsData);

    const { data: { session: currentSession } } = await supabase.auth.getSession();
    setSession(currentSession);
    if (currentSession?.user) {
      await fetchProfile(currentSession.user.id);
      await fetchInitialData();
    }
    setLoading(false);

    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
        await fetchInitialData();
      } else {
        setProfile(null);
      }
    });
  }

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  }

  async function fetchInitialData() {
    const { data: roomsList } = await supabase.from('rooms').select('*').order('is_pinned', { ascending: false });
    if (roomsList) setRooms(roomsList);

    const { data: giftsList } = await supabase.from('gifts').select('*').order('price', { ascending: true });
    if (giftsList) setGifts(giftsList);
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthMsg('');
    if (authMode === 'signup') {
      if (!agreed) return setAuthMsg('يجب الموافقة على شروط الاستخدام');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName || 'عضو SAHRA' } },
      });
      if (error) return setAuthMsg(error.message);
      if (data.user) {
        await supabase.from('profiles').update({
          full_name: fullName,
          gender,
          birth_date: birthDate || null,
        }).eq('id', data.user.id);
        setAuthMsg('تم إنشاء الحساب بنجاح!');
      }
    } else if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthMsg('خطأ في البريد الإلكتروني أو كلمة المرور');
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      setAuthMsg(error ? error.message : 'تم إرسال رابط استعادة الحساب');
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  async function enterRoom(room: any) {
    setActiveRoom(room);
    setActiveScreen('room');
    setEntryNotice(profile);
    setTimeout(() => setEntryNotice(null), 5000);

    const { data: oldMsgs } = await supabase
      .from('room_messages')
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: true })
      .limit(30);
    if (oldMsgs) setMessages(oldMsgs);

    supabase
      .channel(`room-live-${room.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
        (payload) => setActiveRoom(payload.new)
      )
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_id=eq.${room.id}` },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .subscribe();
  }

  async function toggleSeat(index: number) {
    if (!activeRoom || !profile) return;
    const seats = [...activeRoom.seats];
    const seat = seats[index];

    if (seat.locked && profile.role !== 'super_admin') return alert('المقعد مقفل من الإدارة');

    if (seat.user_id === profile.id) {
      seats[index] = { ...seat, user_id: null, user_name: null, avatar: null, vip: 0, level: 1 };
      setIsMicOn(false);
    } else if (!seat.user_id) {
      seats.forEach((s: any, i: number) => {
        if (s.user_id === profile.id) {
          seats[i] = { ...s, user_id: null, user_name: null, avatar: null, vip: 0, level: 1 };
        }
      });
      seats[index] = {
        ...seat,
        user_id: profile.id,
        user_name: profile.full_name,
        avatar: profile.avatar_url,
        vip: profile.vip_level,
        level: profile.wealth_level,
      };
      setIsMicOn(true);
    }
    await supabase.from('rooms').update({ seats }).eq('id', activeRoom.id);
  }

  async function sendRoomMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || !activeRoom || !profile) return;
    await supabase.from('room_messages').insert({
      room_id: activeRoom.id,
      sender_id: profile.id,
      sender_name: profile.full_name,
      sender_vip: profile.vip_level,
      sender_level: profile.wealth_level,
      content: chatInput,
    });
    setChatInput('');
  }

  async function handleSendGift(gift: any) {
    if (!profile || !activeRoom) return;
    const { data, error } = await supabase.rpc('send_gift_secure', {
      p_sender: profile.id,
      p_receiver: activeRoom.owner_id,
      p_room: activeRoom.id,
      p_gift: gift.id,
    });
    if (error || !data?.success) {
      return alert(data?.error || 'رصيد العملات غير كافٍ');
    }
    setShowGiftModal(false);
    setActiveGiftAnim({ ...gift, sender: profile.full_name });
    setTimeout(() => setActiveGiftAnim(null), 4000);
    await fetchProfile(profile.id);
  }

  async function handleRoomAdminCmd(cmd: string) {
    if (!activeRoom) return;
    if (cmd === 'toggle_chat') {
      await supabase.from('rooms').update({ chat_open: !activeRoom.chat_open }).eq('id', activeRoom.id);
    } else if (cmd === 'lock_room') {
      await supabase.from('rooms').update({ is_locked: !activeRoom.is_locked }).eq('id', activeRoom.id);
    } else if (cmd === 'pin_room') {
      await supabase.from('rooms').update({ is_pinned: !activeRoom.is_pinned }).eq('id', activeRoom.id);
    } else {
      alert('تم تنفيذ الأمر بنجاح');
    }
    setShowAdminMenu(false);
  }

  async function createNewRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!newRoomTitle.trim() || !profile) return;
    const { data, error } = await supabase.from('rooms').insert({
      owner_id: profile.id,
      title: newRoomTitle,
      description: newRoomDesc || 'غرفة صوتية',
      category: 'جديد',
    }).select().single();
    if (!error && data) {
      setShowCreateRoom(false);
      setNewRoomTitle('');
      setNewRoomDesc('');
      await fetchInitialData();
      enterRoom(data);
    }
  }

  async function openSuperAdmin() {
    if (profile?.role !== 'super_admin') return;
    const { data } = await supabase.from('profiles').select('*').order('public_id', { ascending: true });
    if (data) setAllUsers(data);
    setActiveScreen('admin');
  }

  async function saveGlobalSettings() {
    await supabase.from('app_settings').update({
      app_name: appSettings.app_name,
      logo_url: appSettings.logo_url,
    }).eq('id', 1);
    alert('تم الحفظ والتطبيق فوراً!');
  }

  async function adminRecharge() {
    const { data: target } = await supabase.from('profiles').select('*').eq('public_id', Number(chargeId)).single();
    if (!target) return alert('الـ ID غير موجود');
    await supabase.from('profiles').update({
      coins_balance: Number(target.coins_balance) + Number(chargeAmount)
    }).eq('id', target.id);
    alert(`تم شحن ${chargeAmount} عملة بنجاح`);
    openSuperAdmin();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090410] flex flex-col items-center justify-center text-[#D4AF37]">
        جاري تحميل SAHRA...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A0B2E] to-[#07030D] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#140A24] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-[#D4AF37]">{appSettings.app_name}</h1>
            <p className="text-xs text-white/60 mt-1">عالم الغرف الصوتية والهدايا</p>
          </div>

          <div className="flex gap-2 bg-black/40 p-1 rounded-xl mb-5 text-xs font-bold">
            <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 rounded-lg ${authMode === 'login' ? 'bg-[#D4AF37] text-black' : 'text-white/70'}`}>دخول</button>
            <button onClick={() => setAuthMode('signup')} className={`flex-1 py-2 rounded-lg ${authMode === 'signup' ? 'bg-[#D4AF37] text-black' : 'text-white/70'}`}>حساب جديد</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-3 text-sm">
            {authMode === 'signup' && (
              <>
                <input required placeholder="الاسم الكامل" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-black/50 border border-white/15 rounded-xl p-3 outline-none" />
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-black/50 border border-white/15 rounded-xl p-3 outline-none">
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </>
            )}
            <input type="email" required placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-white/15 rounded-xl p-3 outline-none" />
            <input type="password" required placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/15 rounded-xl p-3 outline-none" />
            {authMsg && <p className="text-xs text-center text-[#D4AF37]">{authMsg}</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-[#D4AF37] text-black font-black">{authMode === 'login' ? 'دخول التطبيق' : 'إنشاء حساب'}</button>
          </form>
          <button onClick={handleGoogleLogin} className="w-full mt-3 py-2.5 rounded-xl bg-white/10 text-xs font-bold">الدخول باستخدام Google</button>
        </div>
      </div>
    );
  }

  if (activeScreen === 'room' && activeRoom) {
    const adminTools = [
      { id: 'editor', label: 'المحرر', icon: Edit3 },
      { id: 'room_mode', label: 'وضع الغرفة', icon: Sliders },
      { id: 'mic_control', label: 'التحكم بالمايك', icon: Mic },
      { id: 'mic_manage', label: 'إدارة المايكات', icon: MicOff },
      { id: 'toggle_chat', label: 'الدردشة', icon: MessageSquare },
      { id: 'room_manager', label: 'مدير الغرفة', icon: Shield },
      { id: 'blacklist', label: 'المحظورون', icon: Ban },
      { id: 'lock_room', label: 'قفل الغرفة', icon: Lock },
      { id: 'room_logs', label: 'السجلات', icon: FileText },
      { id: 'room_reward', label: 'المكافأة', icon: Gift },
      { id: 'music_manage', label: 'الموسيقى', icon: Music },
      { id: 'pin_room', label: 'تثبيت', icon: Pin },
      { id: 'users_list', label: 'المستخدمون', icon: Users },
    ];

    return (
      <div className="min-h-screen max-w-md mx-auto bg-[#0E061B] flex flex-col justify-between p-4 relative">
        {activeGiftAnim && (
          <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/40">
            <div className="text-7xl animate-bounce">{activeGiftAnim.icon}</div>
            <div className="mt-3 bg-[#D4AF37] text-black font-black px-5 py-2 rounded-full text-sm">{activeGiftAnim.sender} أرسل هدية!</div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 bg-white/10 p-1.5 pl-4 rounded-full border border-[#D4AF37]/40">
            <img src={activeRoom.cover_url} className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]" />
            <div>
              <h2 className="text-xs font-black text-white">{activeRoom.title}</h2>
              <p className="text-[10px] text-[#D4AF37]">ID: {activeRoom.room_code}</p>
            </div>
          </div>
          <button onClick={() => setActiveScreen('home')} className="p-2.5 rounded-full bg-white/10 text-white"><LogOut className="w-4 h-4" /></button>
        </div>

        <div className="my-4">
          <div className="grid grid-cols-3 gap-4">
            {activeRoom.seats?.map((seat: any, idx: number) => (
              <div key={seat.seat} onClick={() => toggleSeat(idx)} className={`flex flex-col items-center cursor-pointer ${idx === 0 ? 'col-span-3' : ''}`}>
                <div className="relative w-16 h-16 rounded-full bg-white/5 border-2 border-[#D4AF37]/70 flex items-center justify-center">
                  {seat.user_id ? <img src={seat.avatar} className="w-full h-full rounded-full object-cover" /> : <Mic className="w-6 h-6 text-[#D4AF37]/70" />}
                </div>
                <span className="mt-1 text-[11px] font-bold text-white/90">{seat.user_id ? seat.user_name : `مقعد ${seat.seat}`}</span>
              </div>
            ))}
          </div>
        </div>

        {entryNotice && (
          <div className="mb-2 bg-[#D4AF37] text-black p-2 rounded-r-full flex items-center gap-2 max-w-xs text-xs font-bold">
            <span>{entryNotice.full_name} دخل الغرفة</span>
          </div>
        )}

        <div className="h-32 overflow-y-auto space-y-1 bg-black/30 rounded-2xl p-2.5 mb-2 text-xs">
          {messages.map((m) => (
            <div key={m.id}><span className="text-[#D4AF37] font-bold">{m.sender_name}: </span><span className="text-white/90">{m.content}</span></div>
          ))}
        </div>

        <div className="space-y-2">
          <form onSubmit={sendRoomMessage} className="flex gap-2">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="اكتب رسالة..." className="flex-1 bg-white/10 rounded-full px-4 py-2 text-xs outline-none border border-white/10" />
            <button type="submit" className="p-2 rounded-full bg-[#D4AF37] text-black"><Send className="w-4 h-4" /></button>
          </form>

          <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-2xl border border-white/10">
            <button onClick={() => setIsMicOn(!isMicOn)} className="p-2.5 rounded-full bg-white/10 text-[#D4AF37]">{isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-red-400" />}</button>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs font-bold"><Trophy className="w-3.5 h-3.5" /><span>{activeRoom.room_cup_total || 0}</span></div>
              <button onClick={() => setShowGiftModal(true)} className="p-2.5 rounded-full bg-[#D4AF37] text-black"><Gift className="w-4 h-4" /></button>
              <button onClick={() => setShowAdminMenu(true)} className="p-2.5 rounded-full bg-white/10 text-white"><Settings className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {showGiftModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center" onClick={() => setShowGiftModal(false)}>
            <div className="w-full max-w-md bg-[#160B28] border-t border-[#D4AF37] rounded-t-3xl p-5" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-black text-[#D4AF37] mb-3">متجر هدايا SAHRA</h3>
              <div className="grid grid-cols-4 gap-3">
                {gifts.map((g) => (
                  <button key={g.id} onClick={() => handleSendGift(g)} className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-3xl mb-1">{g.icon}</span>
                    <span className="text-[10px] font-bold">{g.name}</span>
                    <span className="text-[10px] text-[#D4AF37]">{g.price} 🪙</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showAdminMenu && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center" onClick={() => setShowAdminMenu(false)}>
            <div className="w-full max-w-md bg-[#160B28] border-t border-[#D4AF37] rounded-t-3xl p-5" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-center font-black text-[#D4AF37] mb-3">قائمة إدارة الغرفة</h3>
              <div className="grid grid-cols-4 gap-2">
                {adminTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button key={tool.id} onClick={() => handleRoomAdminCmd(tool.id)} className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/10">
                      <Icon className="w-5 h-5 text-[#D4AF37] mb-1" />
                      <span className="text-[10px] text-center">{tool.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeScreen === 'admin' && profile?.role === 'super_admin') {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-[#0D0618] p-4 space-y-4 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-black text-[#D4AF37]">لوحة تحكم Super Admin</h1>
          <button onClick={() => setActiveScreen('home')} className="text-xs bg-white/10 px-3 py-1 rounded-xl">رجوع</button>
        </div>
        <div className="bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-[#D4AF37]">تخصيص التطبيق</h2>
          <input value={appSettings.app_name} onChange={(e) => setAppSettings({ ...appSettings, app_name: e.target.value })} className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-xs" />
          <button onClick={saveGlobalSettings} className="w-full py-2 rounded-xl bg-[#D4AF37] text-black font-black text-xs">حفظ وتطبيق</button>
        </div>
        <div className="bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-[#D4AF37]">شحن العملات</h2>
          <input type="number" placeholder="ID المستخدم" value={chargeId} onChange={(e) => setChargeId(e.target.value)} className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-xs" />
          <input type="number" placeholder="الكمية" value={chargeAmount} onChange={(e) => setChargeAmount(Number(e.target.value))} className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-xs" />
          <button onClick={adminRecharge} className="w-full py-2 rounded-xl bg-emerald-500 text-black font-black text-xs">شحن الرصيد</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gradient-to-b from-[#170A29] to-[#090410] p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <img src={profile?.avatar_url} className="w-10 h-10 rounded-full border border-[#D4AF37] object-cover" />
          <div>
            <h1 className="font-black text-xs">{profile?.full_name}</h1>
            <p className="text-[10px] text-[#D4AF37]">ID: {profile?.public_id} • 🪙 {profile?.coins_balance}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCreateRoom(true)} className="p-2.5 rounded-full bg-[#D4AF37] text-black"><Plus className="w-4 h-4" /></button>
          <button onClick={() => supabase.auth.signOut()} className="p-2.5 rounded-full bg-white/10 text-white/70"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex gap-2 bg-white/5 p-1 rounded-2xl mb-4 text-xs font-bold">
        {(['Play', 'شائع', 'جديد'] as const).map((tab) => (
          <button key={tab} onClick={() => setHomeTab(tab)} className={`flex-1 py-2 rounded-xl ${homeTab === tab ? 'bg-[#D4AF37] text-black' : 'text-white/70'}`}>{tab}</button>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold text-white/70">الغرف الصوتية النشطة ({rooms.length})</h2>
        {rooms.map((room) => (
          <div key={room.id} onClick={() => enterRoom(room)} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-[#D4AF37]/20 cursor-pointer">
            <img src={room.cover_url} className="w-14 h-14 rounded-2xl object-cover border border-[#D4AF37]/50" />
            <div className="flex-1">
              <h3 className="font-black text-xs text-white">{room.title}</h3>
              <p className="text-[10px] text-white/60 line-clamp-1">{room.description}</p>
              <div className="flex justify-between mt-1 text-[10px] text-[#D4AF37]">
                <span>ID: {room.room_code}</span>
                <span>🏆 {room.room_cup_total || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateRoom && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowCreateRoom(false)}>
          <form onSubmit={createNewRoom} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm bg-[#160B28] border border-[#D4AF37] rounded-3xl p-5 space-y-3">
            <h3 className="font-black text-[#D4AF37] text-center text-sm">إنشاء غرفة صوتية</h3>
            <input required placeholder="اسم الغرفة" value={newRoomTitle} onChange={(e) => setNewRoomTitle(e.target.value)} className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs" />
            <input placeholder="وصف الغرفة" value={newRoomDesc} onChange={(e) => setNewRoomDesc(e.target.value)} className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs" />
            <button type="submit" className="w-full py-3 rounded-xl bg-[#D4AF37] text-black font-black text-xs">إنشاء والدخول</button>
          </form>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#120722] border-t border-white/10 flex justify-around py-3">
        <button onClick={() => setActiveScreen('home')} className="flex flex-col items-center text-[#D4AF37] text-[10px] font-bold"><Home className="w-5 h-5 mb-0.5" /><span>الرئيسية</span></button>
        {profile?.role === 'super_admin' && (
          <button onClick={openSuperAdmin} className="flex flex-col items-center text-amber-400 text-[10px] font-black"><Crown className="w-5 h-5 mb-0.5" /><span>الإدارة</span></button>
        )}
      </div>
    </div>
  );
}
