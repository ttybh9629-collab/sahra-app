<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAHRA – Social Voice Chat & Gaming</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        midnight: '#090914',
                        royal: '#5424A8',
                        violetDark: '#24103F',
                        gold: '#D8AD55',
                        goldLight: '#F3D58B',
                        softWhite: '#F5F2FA',
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #090914;
            color: #F5F2FA;
            overflow-x: hidden;
        }
        .gold-gradient-text {
            background: linear-gradient(135deg, #FFF3D1 0%, #D8AD55 50%, #B8860B 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .royal-gradient {
            background: linear-gradient(135deg, #5424A8 0%, #24103F 100%);
        }
        .card-glass {
            background: rgba(36, 16, 63, 0.7);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(216, 173, 85, 0.25);
        }
        .gold-border {
            border: 1px solid rgba(216, 173, 85, 0.4);
        }
        .gold-glow {
            box-shadow: 0 0 20px rgba(216, 173, 85, 0.3);
        }
        .purple-glow {
            box-shadow: 0 0 25px rgba(84, 36, 168, 0.5);
        }
        ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }
        ::-webkit-scrollbar-track {
            background: #090914;
        }
        ::-webkit-scrollbar-thumb {
            background: #5424A8;
            border-radius: 9999px;
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
        }
        .floating {
            animation: float 4s ease-in-out infinite;
        }
    </style>
</head>
<body class="bg-midnight text-softWhite min-h-screen flex flex-col justify-between selection:bg-royal selection:text-gold">

    <!-- Toast Container -->
    <div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"></div>

    <!-- Login / Registration Screen -->
    <div id="auth-overlay" class="fixed inset-0 z-50 bg-midnight flex items-center justify-center p-4">
        <div class="card-glass w-full max-w-sm rounded-3xl p-6 gold-border purple-glow space-y-6">
            <div class="text-center">
                <div class="w-20 h-20 mx-auto rounded-2xl royal-gradient flex items-center justify-center text-gold text-4xl gold-glow floating mb-3">
                    <i class="fa-solid fa-moon"></i>
                </div>
                <h1 class="text-3xl font-extrabold gold-gradient-text tracking-wider">SAHRA</h1>
                <p class="text-xs text-softWhite/70 mt-1">Social Voice Chat & Gaming Platform</p>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="text-xs text-softWhite/70 block mb-1 font-medium">Your Nickname / اسم المستخدم</label>
                    <input type="text" id="auth-username" placeholder="e.g. Queen_Sahra" class="w-full bg-violetDark/90 text-xs rounded-xl px-4 py-3 gold-border focus:outline-none text-softWhite placeholder-softWhite/40">
                </div>
                <button onclick="handleLogin()" class="w-full py-3.5 royal-gradient text-xs font-bold text-gold rounded-xl gold-border shadow-lg mt-2 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-door-open"></i> تسجيل الدخول وإنشاء روم خاصة (Login & Create Room)
                </button>
            </div>
        </div>
    </div>

    <!-- Main Container Frame -->
    <div class="w-full max-w-md mx-auto bg-midnight min-h-screen flex flex-col relative shadow-2xl border-x border-royal/30">

        <!-- Top Header Status Bar -->
        <header class="px-4 py-2.5 flex items-center justify-between card-glass sticky top-0 z-40 border-b border-royal/40">
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full royal-gradient p-0.5 gold-border flex items-center justify-center cursor-pointer overflow-hidden shadow-md" onclick="switchTab('profile')">
                    <img id="header-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Avatar" class="w-full h-full object-cover rounded-full">
                </div>
                <div>
                    <h1 class="text-[11px] font-bold flex items-center gap-1">
                        <span id="header-username">Queen_Sahra</span>
                        <i class="fa-solid fa-circle-check text-gold text-[9px]"></i>
                    </h1>
                    <div class="flex items-center gap-1 text-[9px] text-goldLight">
                        <span class="bg-royal/60 px-1.5 py-0.2 rounded-full font-semibold">Lv.32</span>
                        <span class="text-gold"><i class="fa-solid fa-crown text-[8px]"></i> VIP</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center space-x-2">
                <div onclick="switchTab('recharge')" class="flex items-center space-x-1 bg-violetDark/90 gold-border px-2.5 py-1 rounded-full cursor-pointer hover:bg-royal/40 transition">
                    <i class="fa-solid fa-coins text-gold text-[10px]"></i>
                    <span id="coin-balance" class="text-[11px] font-bold text-gold">125,750</span>
                    <i class="fa-solid fa-plus text-[9px] text-goldLight"></i>
                </div>
                <button onclick="logout()" class="w-7 h-7 rounded-full card-glass flex items-center justify-center text-rose-400 hover:bg-royal/30 transition" title="Logout">
                    <i class="fa-solid fa-arrow-right-from-bracket text-[10px]"></i>
                </button>
            </div>
        </header>

        <!-- Main Dynamic Content Area -->
        <main id="app-content" class="flex-1 pb-20 overflow-y-auto">
            <!-- Dynamically injected active room / profile -->
        </main>

        <!-- Bottom Room Toolbar & Navigation -->
        <nav class="absolute bottom-0 left-0 right-0 card-glass border-t border-royal/40 py-2.5 px-3 flex justify-around items-center z-40 backdrop-blur-xl">
            <button onclick="switchTab('room')" id="nav-room" class="flex flex-col items-center text-gold transition transform active:scale-95">
                <i class="fa-solid fa-microphone-lines text-base mb-0.5"></i>
                <span class="text-[9px] font-medium">رومي (My Room)</span>
            </button>
            <button onclick="openGiftModal()" class="flex flex-col items-center text-softWhite/70 hover:text-gold transition">
                <i class="fa-solid fa-gift text-base mb-0.5 text-gold"></i>
                <span class="text-[9px] font-medium">الهدايا (Gifts)</span>
            </button>
            <button onclick="openGamesModal()" class="flex flex-col items-center text-softWhite/70 hover:text-gold transition">
                <i class="fa-solid fa-gamepad text-base mb-0.5 text-pink-400"></i>
                <span class="text-[9px] font-medium">الألعاب (Games)</span>
            </button>
            <button onclick="openSettingsModal()" class="flex flex-col items-center text-softWhite/70 hover:text-gold transition">
                <i class="fa-solid fa-gear text-base mb-0.5"></i>
                <span class="text-[9px] font-medium">الإعدادات (Settings)</span>
            </button>
            <button onclick="switchTab('profile')" id="nav-profile" class="flex flex-col items-center text-softWhite/70 hover:text-gold transition">
                <i class="fa-solid fa-user text-base mb-0.5"></i>
                <span class="text-[9px] font-medium">حسابي (Profile)</span>
            </button>
        </nav>

    </div>

    <!-- Modal Container -->
    <div id="custom-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm hidden p-4">
        <div class="card-glass w-full max-w-sm rounded-2xl p-5 gold-border shadow-2xl relative">
            <div id="modal-content"></div>
            <button onclick="closeModal()" class="absolute top-4 right-4 text-softWhite/60 hover:text-gold">
                <i class="fa-solid fa-xmark text-lg"></i>
            </button>
        </div>
    </div>

    <script>
        let currentTab = 'room';
        let userCoins = 125750;
        let userName = 'Queen_Sahra';
        let userId = '258746';
        let userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

        // Personal room database for each logged-in user
        let userRooms = {};

        function handleLogin() {
            const nameInput = document.getElementById('auth-username').value.trim();
            if(!nameInput) {
                showAlert('الرجاء إدخال اسم المستخدم', 'error');
                return;
            }
            userName = nameInput;
            userId = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Create user's personal private/public room automatically
            userRooms[userId] = {
                id: userId,
                name: `غرفة ${userName} الملكية`,
                owner: userName,
                bg: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
                visitors: 1,
                messages: [
                    { user: userName, text: 'أهلاً بكم في غرفتي الخاصة ✨', color: 'text-gold' }
                ],
                seats: [
                    { id: 1, name: userName, avatar: userAvatar, isMuted: false, role: 'host' },
                    { id: 2, name: null, avatar: null, isLocked: false },
                    { id: 3, name: null, avatar: null, isLocked: false },
                    { id: 4, name: null, avatar: null, isLocked: false },
                    { id: 5, name: null, avatar: null, isLocked: false },
                    { id: 6, name: null, avatar: null, isLocked: false },
                    { id: 7, name: null, avatar: null, isLocked: false },
                    { id: 8, name: null, avatar: null, isLocked: false },
                    { id: 9, name: null, avatar: null, isLocked: true },
                    { id: 10, name: null, avatar: null, isLocked: true },
                    { id: 11, name: null, avatar: null, isLocked: true },
                    { id: 12, name: null, avatar: null, isLocked: true },
                    { id: 13, name: null, avatar: null, isLocked: true },
                    { id: 14, name: null, avatar: null, isLocked: true },
                    { id: 15, name: null, avatar: null, isLocked: true }
                ]
            };

            document.getElementById('header-username').innerText = userName;
            document.getElementById('auth-overlay').classList.add('hidden');
            showAlert(`مرحباً ${userName}! تم إنشاؤء غرفتك الخاصة بنجاح برقم ID: ${userId}`);
            switchTab('room');
        }

        function logout() {
            document.getElementById('auth-overlay').classList.remove('hidden');
            showAlert('تم تسجيل الخروج بنجاح.');
        }

        function showAlert(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `card-glass px-4 py-3 rounded-xl gold-border shadow-xl flex items-center gap-3 text-xs pointer-events-auto`;
            toast.innerHTML = `
                <i class="fa-solid ${type === 'success' ? 'fa-circle-check text-gold' : 'fa-triangle-exclamation text-rose-400'}"></i>
                <span>${message}</span>
            `;
            container.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        function switchTab(tab) {
            currentTab = tab;
            const content = document.getElementById('app-content');
            content.scrollTop = 0;

            if (tab === 'room') {
                content.innerHTML = renderVoiceRoomScreen(userId);
            } else if (tab === 'profile') {
                content.innerHTML = renderProfileScreen();
            } else if (tab === 'recharge') {
                content.innerHTML = renderRechargeScreen();
            }
        }

        // --- VOICE ROOM SCREEN (Exact reference 15 mic seats layout) ---
        function renderVoiceRoomScreen(roomId) {
            const room = userRooms[roomId];
            return `
                <div class="relative min-h-[82vh] flex flex-col justify-between p-3 bg-cover bg-center animate-fadeIn pb-16" style="background-image: linear-gradient(rgba(9, 9, 20, 0.9), rgba(9, 9, 20, 0.96)), url('${room.bg}');">
                    
                    <!-- Room Top Bar -->
                    <div class="flex items-center justify-between card-glass p-2.5 rounded-2xl gold-border">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full royal-gradient flex items-center justify-center text-gold">
                                <i class="fa-solid fa-crown text-xs"></i>
                            </div>
                            <div>
                                <h3 class="text-xs font-bold truncate max-w-[150px]">${room.name}</h3>
                                <p class="text-[9px] text-softWhite/60">ID: ${room.id} • <i class="fa-solid fa-headphones text-gold"></i> ${room.visitors}</p>
                            </div>
                        </div>
                        <button onclick="openSettingsModal()" class="px-3 py-1 rounded-full card-glass gold-border text-[10px] font-bold text-gold">إعدادات الغرفة</button>
                    </div>

                    <!-- 15 Microphone Seats Grid -->
                    <div class="my-3 grid grid-cols-5 gap-2.5">
                        ${room.seats.map((seat, index) => {
                            if (seat.name) {
                                return `
                                    <div class="flex flex-col items-center cursor-pointer group" onclick="openSeatOptions(${index}, '${seat.name}')">
                                        <div class="relative w-11 h-11 rounded-full royal-gradient p-0.5 gold-border shadow-lg group-hover:scale-105 transition">
                                            <img src="${seat.avatar}" class="w-full h-full object-cover rounded-full">
                                            ${seat.role === 'host' ? '<span class="absolute -top-1 -right-1 bg-amber-500 text-midnight text-[8px] px-1 rounded-full font-extrabold"><i class="fa-solid fa-crown"></i></span>' : ''}
                                            <span class="absolute bottom-0 right-0 bg-emerald-600 text-white text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center"><i class="fa-solid fa-microphone"></i></span>
                                        </div>
                                        <span class="text-[9px] font-medium mt-1 truncate w-14 text-center">${seat.name}</span>
                                    </div>
                                `;
                            } else if (seat.isLocked) {
                                return `
                                    <div class="flex flex-col items-center opacity-50">
                                        <div class="w-11 h-11 rounded-full card-glass flex items-center justify-center text-softWhite/40 border border-softWhite/10">
                                            <i class="fa-solid fa-lock text-xs"></i>
                                        </div>
                                        <span class="text-[9px] text-softWhite/40 mt-1">No.${index+1}</span>
                                    </div>
                                `;
                            } else {
                                return `
                                    <div class="flex flex-col items-center cursor-pointer group" onclick="claimSeat(${index})">
                                        <div class="w-11 h-11 rounded-full card-glass gold-border flex items-center justify-center text-gold group-hover:bg-royal/40 transition">
                                            <i class="fa-solid fa-plus text-xs"></i>
                                        </div>
                                        <span class="text-[9px] text-softWhite/70 mt-1">No.${index+1}</span>
                                    </div>
                                `;
                            }
                        }).join('')}
                    </div>

                    <!-- Live Chat Box -->
                    <div class="card-glass rounded-2xl p-2.5 h-32 flex flex-col justify-between gold-border mb-2">
                        <div class="overflow-y-auto space-y-1 text-xs pr-1">
                            ${room.messages.map(m => `
                                <div class="bg-midnight/50 px-2 py-0.5 rounded-lg">
                                    <span class="font-bold ${m.color}">${m.user}:</span> <span class="text-softWhite/90">${m.text}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="flex items-center gap-2 mt-1 pt-1 border-t border-royal/40">
                            <input type="text" id="room-msg-input" placeholder="اكتب رسالة..." class="flex-1 bg-midnight/80 text-xs rounded-xl px-3 py-1.5 gold-border focus:outline-none text-softWhite placeholder-softWhite/40">
                            <button onclick="sendRoomMessage()" class="px-3 py-1.5 rounded-xl royal-gradient text-gold text-xs font-bold gold-border">إرسال</button>
                        </div>
                    </div>

                </div>
            `;
        }

        function claimSeat(seatIndex) {
            const room = userRooms[userId];
            room.seats.forEach(s => { if(s.name === userName) s.name = null; });
            room.seats[seatIndex] = { id: userId, name: userName, avatar: userAvatar, isMuted: false, role: 'host' };
            switchTab('room');
            showAlert(`صعدت إلى الميكروفون رقم ${seatIndex+1}`);
        }

        function openSeatOptions(seatIndex, seatUserName) {
            const modal = document.getElementById('custom-modal');
            const content = document.getElementById('modal-content');
            content.innerHTML = `
                <h3 class="text-sm font-bold gold-gradient-text mb-3 text-center">خيارات المستخدم (${seatUserName})</h3>
                <div class="space-y-2">
                    <button onclick="showAlert('تم فتح بطاقة المستخدم'); closeModal();" class="w-full py-2.5 card-glass text-xs font-bold text-gold rounded-xl gold-border">إظهار بطاقة المستخدم</button>
                    <button onclick="leaveSeat(${seatIndex}); closeModal();" class="w-full py-2.5 card-glass text-xs font-bold text-rose-400 rounded-xl gold-border">مغادرة الميكروفون</button>
                    <button onclick="closeModal()" class="w-full py-2.5 royal-gradient text-xs font-bold text-gold rounded-xl gold-border">إلغاء</button>
                </div>
            `;
            modal.classList.remove('hidden');
        }

        function leaveSeat(seatIndex) {
            userRooms[userId].seats[seatIndex].name = null;
            userRooms[userId].seats[seatIndex].avatar = null;
            switchTab('room');
            showAlert('تم مغادرة الميكروفون.');
        }

        function sendRoomMessage() {
            const input = document.getElementById('room-msg-input');
            if(!input || !input.value.trim()) return;
            userRooms[userId].messages.push({ user: userName, text: input.value.trim(), color: 'text-gold' });
            input.value = '';
            switchTab('room');
        }

        function openGiftModal() {
            const modal = document.getElementById('custom-modal');
            const content = document.getElementById('modal-content');
            content.innerHTML = `
                <h3 class="text-sm font-bold gold-gradient-text mb-3 text-center"><i class="fa-solid fa-gift text-gold"></i> إرسال الهدايا الافتراضية</h3>
                <div class="grid grid-cols-3 gap-2">
                    <div class="card-glass p-3 rounded-xl gold-border text-center cursor-pointer hover:bg-royal/30" onclick="sendGift('كعكة الاحتفال', 500)">
                        <i class="fa-solid fa-cake-candles text-pink-400 text-2xl mb-1"></i>
                        <p class="text-[10px] font-bold">كعكة الاحتفال</p>
                        <span class="text-[9px] text-gold">500 ذهب</span>
                    </div>
                    <div class="card-glass p-3 rounded-xl gold-border text-center cursor-pointer hover:bg-royal/30" onclick="sendGift('الساعة الرملية', 200)">
                        <i class="fa-solid fa-hourglass-half text-purple-400 text-2xl mb-1"></i>
                        <p class="text-[10px] font-bold">الساعة الرملية</p>
                        <span class="text-[9px] text-gold">200 ذهب</span>
                    </div>
                    <div class="card-glass p-3 rounded-xl gold-border text-center cursor-pointer hover:bg-royal/30" onclick="sendGift('شعار ناوا', 50)">
                        <i class="fa-solid fa-award text-gold text-2xl mb-1"></i>
                        <p class="text-[10px] font-bold">شعار ناوا</p>
                        <span class="text-[9px] text-gold">50 ذهب</span>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
        }

        function sendGift(name, price) {
            if(userCoins < price) {
                showAlert('رصيد العملات لا يكفي، يرجى الشحن.', 'error');
                closeModal();
                switchTab('recharge');
                return;
            }
            userCoins -= price;
            document.getElementById('coin-balance').innerText = userCoins.toLocaleString();
            closeModal();
            showAlert(`تم إرسال هدية ${name} بنجاح! 🎉`);
        }

        function openGamesModal() {
            const modal = document.getElementById('custom-modal');
            const content = document.getElementById('modal-content');
            content.innerHTML = `
                <h3 class="text-sm font-bold gold-gradient-text mb-3 text-center"><i class="fa-solid fa-gamepad text-gold"></i> ألعاب الغرفة</h3>
                <div class="grid grid-cols-2 gap-3">
                    <div class="card-glass p-3 rounded-xl gold-border text-center cursor-pointer hover:bg-royal/30" onclick="showAlert('تم تشغيل لعبة لودو'); closeModal();">
                        <i class="fa-solid fa-dice text-gold text-2xl mb-1"></i>
                        <h4 class="text-xs font-bold">لعبة لودو (Ludo)</h4>
                    </div>
                    <div class="card-glass p-3 rounded-xl gold-border text-center cursor-pointer hover:bg-royal/30" onclick="showAlert('تم تشغيل لعبة صراحة أم تحدي'); closeModal();">
                        <i class="fa-solid fa-masks-theater text-pink-400 text-2xl mb-1"></i>
                        <h4 class="text-xs font-bold">صراحة أم تحدي</h4>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
        }

        function openSettingsModal() {
            const room = userRooms[userId];
            const modal = document.getElementById('custom-modal');
            const content = document.getElementById('modal-content');
            content.innerHTML = `
                <h3 class="text-sm font-bold gold-gradient-text mb-3 text-center"><i class="fa-solid fa-gear text-gold"></i> إعدادات الغرفة الخاصة</h3>
                <div class="space-y-3">
                    <div>
                        <label class="text-[10px] text-softWhite/70">اسم الغرفة</label>
                        <input type="text" id="edit-room-name" value="${room.name}" class="w-full bg-violetDark text-xs rounded-xl p-2.5 gold-border mt-1 text-softWhite">
                    </div>
                    <div>
                        <label class="text-[10px] text-softWhite/70">رابط صورة الخلفية</label>
                        <input type="text" id="edit-room-bg" value="${room.bg}" class="w-full bg-violetDark text-xs rounded-xl p-2.5 gold-border mt-1 text-softWhite">
                    </div>
                    <button onclick="saveRoomSettings()" class="w-full py-2.5 royal-gradient text-xs font-bold text-gold rounded-xl gold-border mt-2">حفظ التغييرات</button>
                </div>
            `;
            modal.classList.remove('hidden');
        }

        function saveRoomSettings() {
            const newName = document.getElementById('edit-room-name').value;
            const newBg = document.getElementById('edit-room-bg').value;
            if(newName) userRooms[userId].name = newName;
            if(newBg) userRooms[userId].bg = newBg;
            closeModal();
            showAlert('تم حفظ إعدادات الغرفة بنجاح!');
            switchTab('room');
        }

        function closeModal() {
            document.getElementById('custom-modal').classList.add('hidden');
        }

        function renderProfileScreen() {
            return `
                <div class="p-4 space-y-4 animate-fadeIn pb-16">
                    <div class="card-glass rounded-3xl p-5 text-center relative overflow-hidden gold-border purple-glow">
                        <div class="w-20 h-20 mx-auto rounded-full royal-gradient p-1 gold-border relative mb-3">
                            <img src="${userAvatar}" class="w-full h-full object-cover rounded-full">
                        </div>
                        <h2 class="text-sm font-extrabold">${userName}</h2>
                        <p class="text-[10px] text-softWhite/60">ID: ${userId}</p>
                        <div class="flex justify-center gap-2 mt-3">
                            <span class="bg-royal/60 px-3 py-1 rounded-full text-[10px] font-bold text-gold gold-border">Lv.32</span>
                            <span class="bg-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-gold gold-border"><i class="fa-solid fa-crown"></i> VIP</span>
                        </div>
                    </div>
                    <div class="card-glass rounded-2xl p-2 gold-border space-y-1">
                        <div onclick="switchTab('room')" class="flex items-center justify-between p-3 rounded-xl hover:bg-royal/30 cursor-pointer">
                            <span class="text-xs font-medium"><i class="fa-solid fa-door-open text-gold"></i> الدخول إلى غرفتي الخاصة</span>
                            <i class="fa-solid fa-chevron-right text-xs text-softWhite/40"></i>
                        </div>
                        <div onclick="switchTab('recharge')" class="flex items-center justify-between p-3 rounded-xl hover:bg-royal/30 cursor-pointer">
                            <span class="text-xs font-medium"><i class="fa-solid fa-wallet text-gold"></i> شحن العملات والذهب</span>
                            <i class="fa-solid fa-chevron-right text-xs text-softWhite/40"></i>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderRechargeScreen() {
            return `
                <div class="p-4 space-y-4 animate-fadeIn pb-16">
                    <div class="card-glass rounded-2xl p-5 text-center gold-border purple-glow">
                        <h3 class="text-xs font-bold text-softWhite/80">رصيدك الحالي</h3>
                        <h2 class="text-2xl font-extrabold gold-gradient-text">${userCoins.toLocaleString()} Coins</h2>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="card-glass p-3 rounded-2xl gold-border text-center cursor-pointer hover:bg-royal/30" onclick="rechargeCoins(1000)">
                            <h3 class="text-gold font-bold text-sm my-2"><i class="fa-solid fa-coins"></i> 1,000 Coins</h3>
                            <button class="w-full py-1.5 royal-gradient text-xs font-bold text-gold rounded-xl gold-border">$1.99</button>
                        </div>
                        <div class="card-glass p-3 rounded-2xl gold-border text-center cursor-pointer hover:bg-royal/30" onclick="rechargeCoins(5000)">
                            <h3 class="text-gold font-bold text-sm my-2"><i class="fa-solid fa-coins"></i> 5,000 Coins</h3>
                            <button class="w-full py-1.5 royal-gradient text-xs font-bold text-gold rounded-xl gold-border">$5.99</button>
                        </div>
                    </div>
                </div>
            `;
        }

        function rechargeCoins(amount) {
            userCoins += amount;
            document.getElementById('coin-balance').innerText = userCoins.toLocaleString();
            showAlert(`تم شحن ${amount.toLocaleString()} قطعة ذهبية بنجاح! 💎`);
            switchTab('room');
        }
    </script>
</body>
</html>
