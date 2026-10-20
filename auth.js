// Farm2Ayur - Authentication & User Profile Management
// Handles login, registration, JWT session, and logged-in profile/stats view

const API = 'http://127.0.0.1:8000';

function showMsg(form, text, ok) {
  let el = form.querySelector('.auth-msg');
  if (!el) {
    el = document.createElement('p');
    el.className = 'auth-msg';
    el.style.cssText = 'margin-top:10px;font-size:13px;min-height:18px;';
    form.appendChild(el);
  }
  el.style.color = ok ? '#2e7d32' : '#c62828';
  el.textContent = text;
}

function errorText(data) {
  if (!data) return 'Something went wrong.';
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail) && data.detail.length) {
    return data.detail[0].msg || 'Please check the details you entered.';
  }
  return 'Something went wrong.';
}

async function postJson(path, body) {
  const res = await fetch(API + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // response had no JSON body
  }
  return { ok: res.ok, data };
}

function saveSession(data) {
  localStorage.setItem('farm2ayur_token', data.access_token);
  localStorage.setItem(
    'farm2ayur_user',
    JSON.stringify({
      id: data.user_id,
      name: data.full_name,
      email: data.email,
      role: data.role,
    })
  );
  // Keeps the existing header / scanner guard working
  localStorage.setItem('farm2ayur_logged_in', 'true');
}

function isUserLoggedIn() {
  return localStorage.getItem('farm2ayur_logged_in') === 'true';
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem('farm2ayur_user');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function getInitials(name) {
  if (!name) return '🌿';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRole(role) {
  if (!role) return '🌿 Verified Seeker';
  const r = String(role).toLowerCase();
  if (r === 'admin') return '🛡️ System Administrator';
  if (r === 'practitioner' || r === 'doctor') return '🩺 Ayurvedic Vaidya';
  if (r === 'researcher') return '🔬 Botanical Researcher';
  if (r === 'farmer') return '🌱 Certified Cultivator';
  return '🌿 Verified Seeker';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function renderUserProfile() {
  const user = getStoredUser() || {
    id: 1,
    name: 'Ayurvedic Seeker',
    email: 'seeker@farm2ayur.org',
    role: 'user'
  };

  const nameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmailText');
  const roleEl = document.getElementById('profileRoleBadge');
  const idEl = document.getElementById('profileIdBadge');
  const initialsEl = document.getElementById('avatarInitials');

  const displayName = user.name || user.username || 'Ayurvedic Seeker';
  if (nameEl) nameEl.textContent = displayName;
  if (emailEl) emailEl.textContent = user.email || 'seeker@farm2ayur.org';
  if (roleEl) roleEl.textContent = formatRole(user.role);
  if (idEl) idEl.textContent = `ID: #AYUR-${String(user.id || '001').padStart(3, '0')}`;
  if (initialsEl) initialsEl.textContent = getInitials(displayName);

  const token = localStorage.getItem('farm2ayur_token');
  if (!token) return;

  // Background fetch to enrich profile with live server data
  try {
    const meRes = await fetch(API + '/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (meRes.ok) {
      const meData = await meRes.json();
      if (nameEl && meData.full_name) nameEl.textContent = meData.full_name;
      if (emailEl && meData.email) emailEl.textContent = meData.email;
      if (roleEl && meData.role) roleEl.textContent = formatRole(meData.role);
      if (idEl && meData.id) idEl.textContent = `ID: #AYUR-${String(meData.id).padStart(3, '0')}`;
      if (initialsEl && meData.full_name) initialsEl.textContent = getInitials(meData.full_name);

      // Cache updated user in localStorage
      localStorage.setItem('farm2ayur_user', JSON.stringify({
        id: meData.id,
        name: meData.full_name,
        email: meData.email,
        role: meData.role
      }));
    }
  } catch (err) {
    // Offline or network error - gracefully keep local cached data
  }

  // Background fetch for user scans
  try {
    const scanRes = await fetch(API + '/scan/history', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (scanRes.ok) {
      const scans = await scanRes.json();
      const scansCountEl = document.getElementById('statScansCount');
      const scansSubEl = document.getElementById('statScansSub');
      const activityList = document.getElementById('profileActivityList');

      if (Array.isArray(scans) && scans.length > 0) {
        if (scansCountEl) scansCountEl.textContent = scans.length;
        if (scansSubEl) scansSubEl.textContent = `${scans.length} Real Specimens Verified`;

        if (activityList) {
          activityList.innerHTML = scans.slice(0, 3).map(scan => {
            const name = scan.predicted_name || scan.original_filename || 'Botanical Specimen';
            const conf = scan.confidence ? `${Math.round(scan.confidence * 100)}% Match` : 'Analyzed';
            const dateStr = scan.created_at ? new Date(scan.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Verified';
            return `
              <li class="activity-item">
                <span class="activity-bullet">🌿</span>
                <div class="activity-text">
                  <strong>${escapeHtml(name)}</strong> • ${conf}
                </div>
                <span class="activity-time">${dateStr}</span>
              </li>
            `;
          }).join('');
        }
      }
    }
  } catch (err) {
    // Graceful fallback to default stats
  }
}

function manageBgVideo(loggedIn) {
  const video = document.getElementById('bgVideo');
  if (video) {
    if (loggedIn) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }
}

function handleLogout() {
  localStorage.removeItem('farm2ayur_logged_in');
  localStorage.removeItem('farm2ayur_token');
  localStorage.removeItem('farm2ayur_user');

  document.documentElement.classList.remove('user-logged-in');

  const profileCard = document.getElementById('profileContainer');
  const loginCard = document.getElementById('container');
  if (profileCard) profileCard.style.display = 'none';
  if (loginCard) loginCard.style.display = 'block';

  manageBgVideo(false);

  // Clear any existing msgs in forms
  document.querySelectorAll('.auth-msg').forEach(el => el.textContent = '');
}

function syncAuthUI() {
  const loggedIn = isUserLoggedIn();
  const profileCard = document.getElementById('profileContainer');
  const loginCard = document.getElementById('container');

  manageBgVideo(loggedIn);

  if (loggedIn) {
    document.documentElement.classList.add('user-logged-in');
    if (profileCard) profileCard.style.display = 'flex';
    if (loginCard) loginCard.style.display = 'none';
    renderUserProfile();
  } else {
    document.documentElement.classList.remove('user-logged-in');
    if (profileCard) profileCard.style.display = 'none';
    if (loginCard) loginCard.style.display = 'block';
  }
}

function wireLogoutBtn() {
  const logoutBtn = document.getElementById('profileLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
}

async function doLogin(email, password, form) {
  const { ok, data } = await postJson('/auth/login', { email, password });
  if (!ok) {
    showMsg(form, errorText(data), false);
    return false;
  }
  saveSession(data);
  showMsg(form, 'Welcome, ' + data.full_name + '! Entering portal...', true);
  setTimeout(() => {
    syncAuthUI();
  }, 400);
  return true;
}

function wireSignIn() {
  const form = document.querySelector('.form-container.sign-in form');
  if (!form) return;
  const emailEl = form.querySelector('input[type="email"]');
  const passEl = form.querySelector('input[type="password"]');
  const btn = form.querySelector('button.btn-primary');

  async function submit() {
    const email = emailEl.value.trim();
    const password = passEl.value;
    if (!email || !password) {
      showMsg(form, 'Please enter your email and password.', false);
      return;
    }
    btn.disabled = true;
    showMsg(form, 'Signing in...', true);
    try {
      await doLogin(email, password, form);
    } catch (e) {
      showMsg(form, 'Cannot reach the server. Is the backend running?', false);
    }
    btn.disabled = false;
  }

  btn.addEventListener('click', submit);
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  });
}

function wireSignUp() {
  const form = document.querySelector('.form-container.sign-up form');
  if (!form) return;
  const nameEl = form.querySelector('input[type="text"]');
  const emailEl = form.querySelector('input[type="email"]');
  const passEl = form.querySelector('input[type="password"]');
  const btn = form.querySelector('button.btn-primary');

  async function submit() {
    const full_name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passEl.value;
    if (!full_name || !email || !password) {
      showMsg(form, 'Please fill in your name, email and password.', false);
      return;
    }
    btn.disabled = true;
    showMsg(form, 'Creating your account...', true);
    try {
      const { ok, data } = await postJson('/auth/register', {
        full_name,
        email,
        password,
      });
      if (!ok) {
        showMsg(form, errorText(data), false);
      } else {
        await doLogin(email, password, form);
      }
    } catch (e) {
      showMsg(form, 'Cannot reach the server. Is the backend running?', false);
    }
    btn.disabled = false;
  }

  btn.addEventListener('click', submit);
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  });
}

// Initialize interactions
wireSignIn();
wireSignUp();
wireLogoutBtn();
syncAuthUI();
