// ============================================
// app.js - Semua logika/fungsi JavaScript ada di sini
// ============================================


// ============================================
// BAGIAN 1: GREETING & WAKTU
// ============================================

// --- Ambil elemen HTML berdasarkan id-nya ---
// Ini seperti "menunjuk" ke elemen tertentu di HTML
// supaya JS bisa mengubah isinya
const greetingText  = document.getElementById('greeting-text');
const clockEl       = document.getElementById('clock');
const dateEl        = document.getElementById('date-display');
const nameInput     = document.getElementById('name-input');
const nameSaveBtn   = document.getElementById('name-save-btn');
const nameChangeBtn = document.getElementById('name-change-btn');
const nameForm      = document.getElementById('name-form');

// --- Fungsi: Tentukan greeting sesuai jam ---
// Fungsi = kumpulan instruksi yang bisa dipanggil kapan saja
function getGreeting(hour) {
  // hour = angka jam saat ini (0-23)
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';     // Pagi: jam 5 pagi - 11.59
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';   // Siang: jam 12 - 16.59
  } else if (hour >= 17 && hour < 21) {
    return 'Good Evening';     // Sore/petang: jam 17 - 20.59
  } else {
    return 'Good Night';       // Malam: jam 21 - 4.59
  }
}

// --- Fungsi: Update jam, tanggal, dan greeting setiap detik ---
function updateClock() {
  // "new Date()" = ambil waktu sekarang dari komputer
  const now = new Date();

  // Ambil angka jam, menit, detik
  const hours   = now.getHours();    // 0-23
  const minutes = now.getMinutes();  // 0-59
  const seconds = now.getSeconds();  // 0-59

  // Tambahkan "0" di depan kalau angkanya 1 digit
  // Contoh: "9" jadi "09"  (ternary operator: kondisi ? nilaijika-true : nilaijika-false)
  const hh = hours   < 10 ? '0' + hours   : hours;
  const mm = minutes < 10 ? '0' + minutes : minutes;
  const ss = seconds < 10 ? '0' + seconds : seconds;

  // Tampilkan jam di elemen #clock
  clockEl.textContent = hh + ':' + mm + ':' + ss;

  // --- Format tanggal dalam Bahasa Indonesia ---
  // Daftar nama hari dan bulan
  const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Januari','Februari','Maret','April','Mei','Juni',
                  'Juli','Agustus','September','Oktober','November','Desember'];

  const dayName   = days[now.getDay()];     // getDay() = 0(Minggu) - 6(Sabtu)
  const date      = now.getDate();           // Tanggal 1-31
  const monthName = months[now.getMonth()]; // getMonth() = 0(Jan) - 11(Des)
  const year      = now.getFullYear();       // Tahun, misal 2026

  dateEl.textContent = dayName + ', ' + date + ' ' + monthName + ' ' + year;

  // --- Update teks greeting ---
  // Ambil nama user dari Local Storage (null kalau belum pernah disimpan)
  const savedName = localStorage.getItem('userName');

  // Buat teks greeting lengkap
  const greeting = getGreeting(hours);
  if (savedName) {
    // Kalau nama sudah ada: "Good Morning, Budi!"
    greetingText.textContent = greeting + ', ' + savedName + '!';
  } else {
    // Kalau belum ada nama: "Good Morning!"
    greetingText.textContent = greeting + '!';
  }
}

// --- Fungsi: Tampilkan atau sembunyikan form nama ---
function showNameForm() {
  // Tampilkan form input nama
  nameForm.style.display = 'flex';
  // Sembunyikan tombol "Ganti Nama"
  nameChangeBtn.style.display = 'none';
  // Fokuskan cursor ke input supaya langsung bisa ketik
  nameInput.focus();
}

function hideNameForm() {
  // Sembunyikan form input nama
  nameForm.style.display = 'none';
}

// --- Fungsi: Simpan nama ke Local Storage ---
function saveName() {
  // .trim() = hapus spasi di awal dan akhir teks
  const name = nameInput.value.trim();

  if (name === '') {
    // Kalau input kosong, jangan simpan
    alert('Nama tidak boleh kosong!');
    return; // Hentikan fungsi di sini
  }

  // Simpan nama ke Local Storage dengan key 'userName'
  // Local Storage = tempat penyimpanan di browser, tidak hilang saat refresh
  localStorage.setItem('userName', name);

  // Kosongkan input setelah disimpan
  nameInput.value = '';

  // Sembunyikan form, tampilkan tombol ganti nama
  hideNameForm();
  nameChangeBtn.style.display = 'inline-block';

  // Langsung update greeting
  updateClock();
}

// --- Inisialisasi: jalankan saat halaman pertama dibuka ---
function initGreeting() {
  const savedName = localStorage.getItem('userName');

  if (savedName) {
    // Kalau nama sudah tersimpan: sembunyikan form, tampilkan tombol ganti
    hideNameForm();
    nameChangeBtn.style.display = 'inline-block';
  } else {
    // Kalau belum ada nama: tampilkan form input
    showNameForm();
  }

  // Jalankan updateClock() sekali langsung, supaya tidak blank saat pertama buka
  updateClock();

  // setInterval = jalankan fungsi secara berulang setiap X milidetik
  // 1000 milidetik = 1 detik
  setInterval(updateClock, 1000);
}

// --- Pasang "event listener" ke tombol-tombol ---
// Event listener = "dengarkan" aksi user (klik, ketik, dll)

// Saat tombol "Simpan" diklik → panggil fungsi saveName()
nameSaveBtn.addEventListener('click', saveName);

// Saat tombol "Ganti Nama" diklik → tampilkan form lagi
nameChangeBtn.addEventListener('click', showNameForm);

// Saat user tekan Enter di input nama → langsung simpan
nameInput.addEventListener('keypress', function(event) {
  // event.key = tombol yang ditekan
  if (event.key === 'Enter') {
    saveName();
  }
});

// --- Jalankan inisialisasi greeting ---
initGreeting();


// ============================================
// BAGIAN 2: FOCUS TIMER (POMODORO)
// ============================================

// --- Ambil elemen HTML timer ---
const timerDisplay  = document.getElementById('timer-display');
const timerStatus   = document.getElementById('timer-status');
const timerStartBtn = document.getElementById('timer-start-btn');
const timerStopBtn  = document.getElementById('timer-stop-btn');
const timerResetBtn = document.getElementById('timer-reset-btn');

// --- Variabel state timer ---
// "State" = kondisi/data yang berubah-ubah selama aplikasi berjalan

const TIMER_DURATION = 25 * 60; // 25 menit diubah ke detik (25 × 60 = 1500)

let timeLeft    = TIMER_DURATION; // Sisa waktu dalam detik
let timerInterval = null;         // Menyimpan referensi setInterval (null = timer tidak jalan)
let isRunning   = false;          // true = timer sedang berjalan, false = tidak

// --- Fungsi: Format detik menjadi "MM:SS" ---
// Contoh: 1500 detik → "25:00", 90 detik → "01:30"
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60); // Bagi dengan 60, bulatkan ke bawah
  const secs = seconds % 60;             // Sisa bagi 60 = detik

  // Tambah "0" di depan kalau 1 digit
  const mm = mins < 10 ? '0' + mins : mins;
  const ss = secs < 10 ? '0' + secs : secs;

  return mm + ':' + ss;
}

// --- Fungsi: Update tampilan timer di layar ---
function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);

  // Ubah warna display saat waktu hampir habis (kurang dari 1 menit)
  if (timeLeft <= 60 && isRunning) {
    timerDisplay.classList.add('timer-warning'); // Tambah class CSS merah
  } else {
    timerDisplay.classList.remove('timer-warning');
  }
}

// --- Fungsi: Start timer ---
function startTimer() {
  if (isRunning) return; // Kalau sudah jalan, jangan start lagi

  isRunning = true;

  // Update tampilan tombol: Start nonaktif, Stop aktif
  timerStartBtn.disabled = true;
  timerStopBtn.disabled  = false;
  timerStatus.textContent = '⏳ Sedang fokus...';

  // setInterval: panggil fungsi ini setiap 1 detik (1000ms)
  timerInterval = setInterval(function() {
    timeLeft--; // Kurangi 1 detik

    updateTimerDisplay();

    // Cek apakah waktu sudah habis
    if (timeLeft <= 0) {
      finishTimer(); // Panggil fungsi selesai
    }
  }, 1000);
}

// --- Fungsi: Stop/pause timer ---
function stopTimer() {
  if (!isRunning) return; // Kalau tidak jalan, tidak perlu stop

  isRunning = false;

  // clearInterval: hentikan setInterval yang sedang berjalan
  clearInterval(timerInterval);
  timerInterval = null;

  // Update tampilan tombol: Start aktif kembali, Stop nonaktif
  timerStartBtn.disabled = false;
  timerStopBtn.disabled  = true;
  timerStatus.textContent = '⏸ Dijeda — klik Start untuk lanjut';
}

// --- Fungsi: Reset timer ke 25:00 ---
function resetTimer() {
  // Hentikan interval yang berjalan (kalau ada)
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning     = false;

  // Kembalikan waktu ke durasi awal
  timeLeft = TIMER_DURATION;

  // Update tampilan
  updateTimerDisplay();
  timerStatus.textContent   = 'Siap memulai sesi fokus?';
  timerStartBtn.disabled    = false;
  timerStopBtn.disabled     = true;
  timerDisplay.classList.remove('timer-warning');
}

// --- Fungsi: Timer selesai (waktu habis) ---
function finishTimer() {
  // Hentikan interval
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning     = false;

  timerStatus.textContent = '🎉 Sesi selesai! Saatnya istirahat.';
  timerStartBtn.disabled  = false;
  timerStopBtn.disabled   = true;

  // Notifikasi suara/visual sederhana: judul tab berkedip
  // (karena kita tidak pakai library, pakai alert sederhana saja)
  alert('⏰ Sesi fokus 25 menit selesai! Istirahat dulu ya.');

  // Reset otomatis setelah selesai
  resetTimer();
}

// --- Pasang event listener ke tombol-tombol timer ---
timerStartBtn.addEventListener('click', startTimer);
timerStopBtn.addEventListener('click', stopTimer);
timerResetBtn.addEventListener('click', resetTimer);

// --- Inisialisasi: tampilkan waktu awal saat halaman dibuka ---
updateTimerDisplay();


// ============================================
// BAGIAN 3: TO-DO LIST
// ============================================

// --- Ambil elemen HTML todo ---
const todoInput   = document.getElementById('todo-input');
const todoAddBtn  = document.getElementById('todo-add-btn');
const todoList    = document.getElementById('todo-list');
const todoError   = document.getElementById('todo-error');
const todoCount   = document.getElementById('todo-count');
const filterBtns  = document.querySelectorAll('.filter-btn'); // Ambil SEMUA tombol filter

// --- State ---
let todos         = [];           // Array berisi semua task
let currentFilter = 'all';        // Filter aktif: 'all', 'active', atau 'done'

// --- Fungsi: Load tasks dari Local Storage ---
// Dipanggil saat halaman pertama dibuka
function loadTodos() {
  // getItem: ambil data dari Local Storage dengan key 'todos'
  // Kalau belum ada, kembalikan null
  const stored = localStorage.getItem('todos');

  if (stored) {
    // JSON.parse: ubah teks JSON → array JavaScript
    // Data di Local Storage selalu disimpan sebagai teks
    todos = JSON.parse(stored);
  } else {
    todos = []; // Mulai dengan array kosong
  }
}

// --- Fungsi: Simpan tasks ke Local Storage ---
// Dipanggil setiap kali ada perubahan pada todos
function saveTodos() {
  // JSON.stringify: ubah array JavaScript → teks JSON
  localStorage.setItem('todos', JSON.stringify(todos));
}

// --- Fungsi: Tampilkan pesan error ---
function showError(msg) {
  todoError.textContent = msg;
  // Hilangkan pesan error setelah 3 detik otomatis
  setTimeout(function() {
    todoError.textContent = '';
  }, 3000);
}

// --- Fungsi: Cek apakah task sudah ada (duplikat) ---
// Challenge: Prevent duplicate tasks
function isDuplicate(text) {
  // .some() = cek apakah ADA minimal 1 elemen yang memenuhi kondisi
  // .toLowerCase() = ubah ke huruf kecil supaya perbandingan tidak case-sensitive
  // Jadi "Belajar" dan "belajar" dianggap sama
  return todos.some(function(todo) {
    return todo.text.toLowerCase() === text.toLowerCase();
  });
}

// --- Fungsi: Tambah task baru ---
function addTodo() {
  const text = todoInput.value.trim();

  // Validasi 1: teks tidak boleh kosong
  if (text === '') {
    showError('Task tidak boleh kosong!');
    return;
  }

  // Validasi 2: cek duplikat
  if (isDuplicate(text)) {
    showError('❌ Task "' + text + '" sudah ada!');
    return;
  }

  // Buat objek task baru
  // Date.now() = angka unik berdasarkan waktu (dipakai sebagai ID)
  const newTodo = {
    id:   Date.now(),   // ID unik, contoh: 1725500000000
    text: text,         // Teks task
    done: false         // Status: belum selesai
  };

  // Tambahkan ke array todos
  todos.push(newTodo);

  // Simpan ke Local Storage
  saveTodos();

  // Kosongkan input dan fokus ulang
  todoInput.value = '';
  todoInput.focus();

  // Re-render daftar task di layar
  renderTodos();
}

// --- Fungsi: Toggle status selesai/belum ---
function toggleTodo(id) {
  // .find() = cari elemen pertama yang cocok dengan kondisi
  const todo = todos.find(function(t) { return t.id === id; });

  if (todo) {
    // Balik nilai done: kalau true jadi false, kalau false jadi true
    todo.done = !todo.done;
    saveTodos();
    renderTodos();
  }
}

// --- Fungsi: Hapus task ---
function deleteTodo(id) {
  // .filter() = buat array BARU yang hanya berisi elemen yang LULUS kondisi
  // Di sini: simpan semua task KECUALI yang id-nya sama
  todos = todos.filter(function(t) { return t.id !== id; });
  saveTodos();
  renderTodos();
}

// --- Fungsi: Mulai mode edit task ---
function startEdit(id, currentText) {
  // Cari elemen <li> berdasarkan data-id
  const li = todoList.querySelector('[data-id="' + id + '"]');
  if (!li) return;

  // Ambil elemen teks di dalam li
  const textSpan = li.querySelector('.todo-text');

  // Simpan teks asli (untuk cancel)
  const originalText = currentText;

  // Ganti span teks dengan input edit
  // innerHTML = ubah isi HTML elemen
  textSpan.innerHTML =
    '<input class="todo-edit-input" type="text" value="' +
    escapeHtml(currentText) + '" maxlength="100" />';

  const editInput = textSpan.querySelector('.todo-edit-input');
  editInput.focus();
  // Pindahkan kursor ke akhir teks
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);

  // Sembunyikan tombol edit, tampilkan tombol save & cancel
  li.querySelector('.btn-edit').style.display   = 'none';
  li.querySelector('.btn-save').style.display   = 'inline-flex';
  li.querySelector('.btn-cancel').style.display = 'inline-flex';

  // Simpan jika tekan Enter
  editInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') saveEdit(id, editInput, textSpan, li);
  });

  // Cancel jika tekan Escape
  editInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') cancelEdit(originalText, textSpan, li);
  });
}

// --- Fungsi: Simpan hasil edit ---
function saveEdit(id, editInput, textSpan, li) {
  const newText = editInput.value.trim();

  // Validasi: tidak boleh kosong
  if (newText === '') {
    showError('Task tidak boleh kosong!');
    editInput.focus();
    return;
  }

  // Cek duplikat (kecuali dengan task itu sendiri)
  const isDup = todos.some(function(t) {
    return t.id !== id && t.text.toLowerCase() === newText.toLowerCase();
  });

  if (isDup) {
    showError('❌ Task "' + newText + '" sudah ada!');
    editInput.focus();
    return;
  }

  // Update teks di array
  const todo = todos.find(function(t) { return t.id === id; });
  if (todo) {
    todo.text = newText;
    saveTodos();
    renderTodos();
  }
}

// --- Fungsi: Batalkan edit ---
function cancelEdit(originalText, textSpan, li) {
  // Kembalikan tampilan ke teks semula
  textSpan.textContent = originalText;
  li.querySelector('.btn-edit').style.display   = 'inline-flex';
  li.querySelector('.btn-save').style.display   = 'none';
  li.querySelector('.btn-cancel').style.display = 'none';
}

// --- Fungsi helper: Escape karakter HTML berbahaya ---
// Mencegah bug jika teks task mengandung karakter < > & " '
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- Fungsi: Update counter "X task tersisa" ---
function updateCount() {
  const total   = todos.length;
  const done    = todos.filter(function(t) { return t.done; }).length;
  const active  = total - done;

  if (total === 0) {
    todoCount.textContent = 'Belum ada task. Yuk tambahkan!';
  } else {
    todoCount.textContent = active + ' task tersisa · ' + done + ' selesai';
  }
}

// --- Fungsi: Render (gambar ulang) seluruh daftar task ke layar ---
// Dipanggil setiap kali ada perubahan
function renderTodos() {
  // Kosongkan daftar dulu sebelum diisi ulang
  todoList.innerHTML = '';

  // Filter task sesuai pilihan aktif
  let filtered = todos;
  if (currentFilter === 'active') {
    filtered = todos.filter(function(t) { return !t.done; });
  } else if (currentFilter === 'done') {
    filtered = todos.filter(function(t) { return t.done; });
  }

  // Kalau tidak ada task yang sesuai filter
  if (filtered.length === 0) {
    todoList.innerHTML = '<li class="todo-empty">Tidak ada task di sini.</li>';
    updateCount();
    return;
  }

  // Buat elemen <li> untuk setiap task
  filtered.forEach(function(todo) {
    // createElement: buat elemen HTML baru
    const li = document.createElement('li');
    li.className  = 'todo-item' + (todo.done ? ' done' : '');
    // data-id: simpan ID task di atribut HTML (berguna untuk mencari elemen)
    li.setAttribute('data-id', todo.id);

    // innerHTML: isi HTML di dalam li
    li.innerHTML =
      // Checkbox
      '<button class="btn-check" title="' + (todo.done ? 'Tandai belum selesai' : 'Tandai selesai') + '">' +
        (todo.done ? '✅' : '⬜') +
      '</button>' +

      // Teks task
      '<span class="todo-text">' + escapeHtml(todo.text) + '</span>' +

      // Tombol aksi
      '<div class="todo-actions">' +
        '<button class="btn-action btn-edit" title="Edit">✏️</button>' +
        '<button class="btn-action btn-save" title="Simpan" style="display:none">💾</button>' +
        '<button class="btn-action btn-cancel" title="Batal" style="display:none">✖</button>' +
        '<button class="btn-action btn-delete" title="Hapus">🗑️</button>' +
      '</div>';

    // --- Pasang event listener ke tombol dalam li ---

    // Tombol centang
    li.querySelector('.btn-check').addEventListener('click', function() {
      toggleTodo(todo.id);
    });

    // Tombol edit
    li.querySelector('.btn-edit').addEventListener('click', function() {
      startEdit(todo.id, todo.text);
    });

    // Tombol simpan edit
    li.querySelector('.btn-save').addEventListener('click', function() {
      const textSpan  = li.querySelector('.todo-text');
      const editInput = textSpan.querySelector('.todo-edit-input');
      if (editInput) saveEdit(todo.id, editInput, textSpan, li);
    });

    // Tombol cancel edit
    li.querySelector('.btn-cancel').addEventListener('click', function() {
      const textSpan = li.querySelector('.todo-text');
      cancelEdit(todo.text, textSpan, li);
    });

    // Tombol hapus
    li.querySelector('.btn-delete').addEventListener('click', function() {
      deleteTodo(todo.id);
    });

    // Tambahkan li ke dalam ul#todo-list
    todoList.appendChild(li);
  });

  updateCount();
}

// --- Pasang event listener tombol filter ---
filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    // Hapus class 'active' dari semua tombol filter
    filterBtns.forEach(function(b) { b.classList.remove('active'); });
    // Tambah class 'active' ke tombol yang diklik
    btn.classList.add('active');
    // Update filter aktif
    currentFilter = btn.getAttribute('data-filter');
    renderTodos();
  });
});

// --- Pasang event listener tombol tambah & input ---
todoAddBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') addTodo();
});

// --- Inisialisasi todo list ---
function initTodos() {
  loadTodos();
  renderTodos();
}

initTodos();


// ============================================
// BAGIAN 4: QUICK LINKS
// ============================================

// --- Ambil elemen HTML quick links ---
const linksGrid       = document.getElementById('links-grid');
const linksToggleBtn  = document.getElementById('links-toggle-btn');
const linksForm       = document.getElementById('links-form');
const linkNameInput   = document.getElementById('link-name-input');
const linkUrlInput    = document.getElementById('link-url-input');
const linkSaveBtn     = document.getElementById('link-save-btn');
const linkCancelBtn   = document.getElementById('link-cancel-btn');
const linkError       = document.getElementById('link-error');

// --- State ---
let links = []; // Array berisi semua quick link

// --- Data link bawaan (default) saat pertama kali dibuka ---
// Jika user belum punya data di Local Storage, pakai ini sebagai contoh
const DEFAULT_LINKS = [
  { id: 1, name: 'Google',    url: 'https://google.com',    emoji: '🔍' },
  { id: 2, name: 'YouTube',   url: 'https://youtube.com',   emoji: '▶️' },
  { id: 3, name: 'GitHub',    url: 'https://github.com',    emoji: '🐙' },
  { id: 4, name: 'Wikipedia', url: 'https://wikipedia.org', emoji: '📖' },
];

// --- Fungsi: Load links dari Local Storage ---
function loadLinks() {
  const stored = localStorage.getItem('quickLinks');
  if (stored) {
    links = JSON.parse(stored);
  } else {
    // Pertama kali buka: pakai default links
    links = DEFAULT_LINKS;
    saveLinks(); // Langsung simpan ke Local Storage
  }
}

// --- Fungsi: Simpan links ke Local Storage ---
function saveLinks() {
  localStorage.setItem('quickLinks', JSON.stringify(links));
}

// --- Fungsi: Tampilkan pesan error form link ---
function showLinkError(msg) {
  linkError.textContent = msg;
  setTimeout(function() {
    linkError.textContent = '';
  }, 3000);
}

// --- Fungsi: Ambil emoji otomatis berdasarkan nama/URL ---
// Supaya setiap kartu link punya ikon yang relevan
function getAutoEmoji(name, url) {
  const n = name.toLowerCase();
  const u = url.toLowerCase();

  if (n.includes('google')    || u.includes('google'))    return '🔍';
  if (n.includes('youtube')   || u.includes('youtube'))   return '▶️';
  if (n.includes('github')    || u.includes('github'))    return '🐙';
  if (n.includes('twitter')   || u.includes('twitter') ||
      u.includes('x.com'))                                return '🐦';
  if (n.includes('instagram') || u.includes('instagram')) return '📸';
  if (n.includes('facebook')  || u.includes('facebook'))  return '👤';
  if (n.includes('reddit')    || u.includes('reddit'))    return '🤖';
  if (n.includes('wikipedia') || u.includes('wikipedia')) return '📖';
  if (n.includes('netflix')   || u.includes('netflix'))   return '🎬';
  if (n.includes('spotify')   || u.includes('spotify'))   return '🎵';
  if (n.includes('mail')  || n.includes('email') ||
      u.includes('mail')  || u.includes('gmail'))         return '✉️';
  if (n.includes('chat')  || u.includes('discord') ||
      u.includes('slack') || u.includes('whatsapp'))      return '💬';
  if (n.includes('news')      || u.includes('news'))      return '📰';
  if (n.includes('shop')  || n.includes('store') ||
      u.includes('tokopedia') || u.includes('shopee'))    return '🛒';

  // Default: globe emoji
  return '🌐';
}

// --- Fungsi: Validasi URL ---
// URL wajib diawali dengan http:// atau https://
function isValidUrl(url) {
  try {
    // new URL() akan error jika format URL tidak valid
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// --- Fungsi: Tambah link baru ---
function addLink() {
  const name = linkNameInput.value.trim();
  const url  = linkUrlInput.value.trim();

  // Validasi nama
  if (name === '') {
    showLinkError('Nama link tidak boleh kosong!');
    linkNameInput.focus();
    return;
  }

  // Validasi URL
  if (url === '') {
    showLinkError('URL tidak boleh kosong!');
    linkUrlInput.focus();
    return;
  }

  if (!isValidUrl(url)) {
    showLinkError('URL tidak valid! Harus diawali https:// atau http://');
    linkUrlInput.focus();
    return;
  }

  // Buat objek link baru
  const newLink = {
    id:    Date.now(),
    name:  name,
    url:   url,
    emoji: getAutoEmoji(name, url) // Pilih emoji otomatis
  };

  links.push(newLink);
  saveLinks();

  // Kosongkan input dan tutup form
  linkNameInput.value = '';
  linkUrlInput.value  = '';
  hideLinksForm();

  renderLinks();
}

// --- Fungsi: Hapus link ---
function deleteLink(id) {
  links = links.filter(function(l) { return l.id !== id; });
  saveLinks();
  renderLinks();
}

// --- Fungsi: Tampilkan form tambah link ---
function showLinksForm() {
  linksForm.style.display = 'block';
  linksToggleBtn.textContent = '✕ Tutup';
  linkNameInput.focus();
}

// --- Fungsi: Sembunyikan form tambah link ---
function hideLinksForm() {
  linksForm.style.display  = 'none';
  linksToggleBtn.textContent = '+ Tambah Link';
  linkError.textContent    = '';
}

// --- Fungsi: Render semua kartu link ke layar ---
function renderLinks() {
  linksGrid.innerHTML = ''; // Kosongkan dulu

  if (links.length === 0) {
    linksGrid.innerHTML = '<p class="links-empty">Belum ada link. Tambahkan yang pertama!</p>';
    return;
  }

  links.forEach(function(link) {
    // Buat elemen div untuk setiap kartu link
    const card = document.createElement('div');
    card.className = 'link-card';

    card.innerHTML =
      // Anchor <a>: saat diklik, buka URL di tab baru
      '<a href="' + escapeHtml(link.url) + '" target="_blank" rel="noopener noreferrer" class="link-anchor">' +
        '<span class="link-emoji">' + link.emoji + '</span>' +
        '<span class="link-name">'  + escapeHtml(link.name) + '</span>' +
      '</a>' +
      // Tombol hapus di pojok kartu
      '<button class="link-delete-btn" title="Hapus link">✕</button>';

    // Event listener tombol hapus
    card.querySelector('.link-delete-btn').addEventListener('click', function() {
      deleteLink(link.id);
    });

    linksGrid.appendChild(card);
  });
}

// --- Pasang event listener ---

// Tombol "Tambah Link" / "Tutup" (toggle form)
linksToggleBtn.addEventListener('click', function() {
  // Cek apakah form sedang tampil atau tidak
  if (linksForm.style.display === 'none') {
    showLinksForm();
  } else {
    hideLinksForm();
  }
});

// Tombol Simpan di form
linkSaveBtn.addEventListener('click', addLink);

// Tombol Batal di form
linkCancelBtn.addEventListener('click', hideLinksForm);

// Tekan Enter di salah satu input → simpan
linkNameInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') addLink();
});
linkUrlInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') addLink();
});

// --- Inisialisasi quick links ---
function initLinks() {
  loadLinks();
  renderLinks();
}

initLinks();


// ============================================
// BAGIAN 5: DARK / LIGHT MODE TOGGLE
// ============================================

// --- Ambil elemen tombol toggle tema ---
const themeToggle = document.getElementById('theme-toggle');

// --- Fungsi: Terapkan tema ke halaman ---
// theme = 'dark' atau 'light'
function applyTheme(theme) {
  if (theme === 'dark') {
    // Tambahkan class 'dark' ke elemen <body>
    // CSS akan mendeteksi class ini dan mengganti warna-warna
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️'; // Ikon berubah jadi matahari
    themeToggle.title       = 'Ganti ke Light Mode';
  } else {
    // Hapus class 'dark' dari body → kembali ke light mode
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙'; // Ikon kembali ke bulan
    themeToggle.title       = 'Ganti ke Dark Mode';
  }
}

// --- Fungsi: Toggle tema saat tombol diklik ---
function toggleTheme() {
  // Cek apakah body saat ini punya class 'dark'
  const isDark = document.body.classList.contains('dark');

  // Balik tema: kalau dark → light, kalau light → dark
  const newTheme = isDark ? 'light' : 'dark';

  // Terapkan tema baru
  applyTheme(newTheme);

  // Simpan pilihan tema ke Local Storage supaya tidak reset saat refresh
  localStorage.setItem('theme', newTheme);
}

// --- Inisialisasi tema saat halaman dibuka ---
function initTheme() {
  // Cek apakah user pernah memilih tema sebelumnya
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    // Kalau ada: pakai tema yang tersimpan
    applyTheme(savedTheme);
  } else {
    // Kalau belum pernah pilih: cek preferensi sistem operasi user
    // window.matchMedia: mendeteksi setting OS (dark/light mode)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
}

// --- Pasang event listener ke tombol toggle ---
themeToggle.addEventListener('click', toggleTheme);

// --- Jalankan inisialisasi tema ---
// Dipanggil PERTAMA sebelum yang lain supaya tema langsung aktif
initTheme();
