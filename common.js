// ====================================================
//  سیستم کاربری یکپارچه برای تمام صفحات
//  نسخه: بدون لول، سکه و معدل
// ====================================================

let currentUser = null;

// ====================================================
//  بارگذاری کاربر از localStorage
// ====================================================
function loadUser() {
    const saved = localStorage.getItem('bacheha_user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            console.log('✅ کاربر بارگذاری شد:', currentUser.name);
            updateDashboard();
            return true;
        } catch(e) {
            console.error('خطا در بارگذاری کاربر:', e);
        }
    }
    return false;
}

// ====================================================
//  ذخیره‌ی کاربر در localStorage
// ====================================================
function saveUser() {
    if (currentUser) {
        try {
            localStorage.setItem('bacheha_user', JSON.stringify(currentUser));
        } catch(e) {
            console.error('خطا در ذخیره‌سازی کاربر:', e);
        }
    }
}

// ====================================================
//  به‌روزرسانی داشبورد (فقط نام و شماره)
// ====================================================
function updateDashboard() {
    const userName = document.getElementById('userName');
    const userPhone = document.getElementById('userPhone');
    const userAvatar = document.getElementById('userAvatar');
    const btnLogout = document.getElementById('btnLogout');
    const btnLoginShow = document.getElementById('btnLoginShow');

    if (!userName) return;

    if (currentUser) {
        userName.textContent = currentUser.name || 'کاربر عزیز';
        if (userPhone) userPhone.textContent = currentUser.phone || 'شماره ثبت شد';
        if (userAvatar) {
            userAvatar.textContent = (currentUser.name && currentUser.name.length > 0)
                ? currentUser.name.charAt(0).toUpperCase()
                : '👤';
        }
        if (btnLogout) btnLogout.style.display = 'inline-block';
        if (btnLoginShow) btnLoginShow.style.display = 'none';
    } else {
        userName.textContent = 'میهمان عزیز';
        if (userPhone) userPhone.textContent = 'وارد نشده‌اید';
        if (userAvatar) userAvatar.textContent = '👤';
        if (btnLogout) btnLogout.style.display = 'none';
        if (btnLoginShow) btnLoginShow.style.display = 'inline-block';
    }
}

// ====================================================
//  توابع ورود / ثبت‌نام
// ====================================================
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
        const phoneInput = document.getElementById('phoneInput');
        if (phoneInput) phoneInput.focus();
    }
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleLogin() {
    const phoneInput = document.getElementById('phoneInput');
    const nameInput = document.getElementById('nameInput');

    if (!phoneInput) return;

    const phone = phoneInput.value.trim();
    const name = nameInput ? nameInput.value.trim() || 'کاربر عزیز' : 'کاربر عزیز';

    if (phone.length < 10) {
        alert('📱 لطفاً شماره تلفن معتبر وارد کنید (حداقل ۱۰ رقم)');
        return;
    }

    const saved = localStorage.getItem('bacheha_user');
    if (saved) {
        try {
            const existing = JSON.parse(saved);
            if (existing.phone === phone) {
                currentUser = existing;
                saveUser();
                updateDashboard();
                hideLoginModal();
                alert('👋 خوش برگشتی ' + (currentUser.name || 'کاربر عزیز') + '!');
                return;
            }
        } catch(e) {}
    }

    // ثبت‌نام کاربر جدید - فقط نام و شماره
    currentUser = {
        name: name,
        phone: phone
    };
    saveUser();
    updateDashboard();
    hideLoginModal();
    alert('🎉 ثبت‌نام شما با موفقیت انجام شد! خوش آمدید ' + name);
}

function handleLogout() {
    if (confirm('آیا از خروج از حساب کاربری مطمئن هستید؟')) {
        currentUser = null;
        localStorage.removeItem('bacheha_user');
        updateDashboard();
        alert('🚪 با موفقیت خارج شدید.');
    }
}

// ====================================================
//  اتصال رویدادها (برای هر صفحه فراخوانی شود)
// ====================================================
function initUserSystem() {
    console.log('🚀 راه‌اندازی سیستم کاربری...');

    loadUser();

    const btnLoginShow = document.getElementById('btnLoginShow');
    const btnLoginAction = document.getElementById('btnLoginAction');
    const btnRegisterAction = document.getElementById('btnRegisterAction');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnLogout = document.getElementById('btnLogout');

    if (btnLoginShow) btnLoginShow.addEventListener('click', showLoginModal);
    if (btnLoginAction) btnLoginAction.addEventListener('click', handleLogin);
    if (btnRegisterAction) btnRegisterAction.addEventListener('click', handleLogin);
    if (btnCloseModal) btnCloseModal.addEventListener('click', hideLoginModal);
    if (btnLogout) btnLogout.addEventListener('click', handleLogout);

    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) hideLoginModal();
        });
    }

    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }

    window.addEventListener('beforeunload', function() {
        if (currentUser) saveUser();
    });
}

console.log('✅ common.js بارگذاری شد (بدون لول، سکه و معدل)');