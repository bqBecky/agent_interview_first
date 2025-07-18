document.addEventListener('DOMContentLoaded', function() {
    // 表单切换功能
    document.getElementById('switch-to-register').addEventListener('click', function() {
        document.getElementById('form-wrapper').style.transform = 'translateX(-50%)';
        document.getElementById('form-title').textContent = '账号注册';
        document.querySelector('.indicator-dot[data-form="login"]').classList.remove('active');
        document.querySelector('.indicator-dot[data-form="register"]').classList.add('active');
    });

    document.getElementById('switch-to-login').addEventListener('click', function() {
        document.getElementById('form-wrapper').style.transform = 'translateX(0)';
        document.getElementById('form-title').textContent = '账号登录';
        document.querySelector('.indicator-dot[data-form="register"]').classList.remove('active');
        document.querySelector('.indicator-dot[data-form="login"]').classList.add('active');
    });

    // 密码显示/隐藏切换
    const setupPasswordToggle = (passwordId, toggleId) => {
        const toggle = document.getElementById(toggleId);
        const passwordInput = document.getElementById(passwordId);

        toggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    };

    // 设置所有密码切换按钮
    setupPasswordToggle('password', 'toggle-password');
    setupPasswordToggle('reg-password', 'toggle-reg-password');
    setupPasswordToggle('reg-confirm-password', 'toggle-reg-confirm-password');

    // 清除输入内容
    const setupClearInput = (inputId, clearBtnId) => {
        const input = document.getElementById(inputId);
        const clearBtn = document.getElementById(clearBtnId);

        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                clearBtn.style.opacity = '0.7';
                clearBtn.style.visibility = 'visible';
            } else {
                clearBtn.style.opacity = '0';
                clearBtn.style.visibility = 'hidden';
            }
        });

        clearBtn.addEventListener('click', function() {
            input.value = '';
            this.style.opacity = '0';
            this.style.visibility = 'hidden';
        });
    };

    // 设置所有清除按钮
    setupClearInput('username', 'clear-username');
    setupClearInput('password', 'clear-password');
    setupClearInput('reg-username', 'clear-reg-username');
    setupClearInput('reg-password', 'clear-reg-password');
    setupClearInput('reg-confirm-password', 'clear-reg-confirm-password');
    setupClearInput('reg-email', 'clear-reg-email');

    // 表单验证
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (password !== confirmPassword) {
                e.preventDefault();
                alert('两次输入的密码不一致');
                return false;
            }

            if (!document.getElementById('agree').checked) {
                e.preventDefault();
                alert('请阅读并同意用户协议和隐私政策');
                return false;
            }

            return true;
        });
    }

    // 指示器切换
    document.querySelectorAll('.indicator-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            if (this.dataset.form === 'login') {
                document.getElementById('form-wrapper').style.transform = 'translateX(0)';
                document.getElementById('form-title').textContent = '账号登录';
            } else {
                document.getElementById('form-wrapper').style.transform = 'translateX(-50%)';
                document.getElementById('form-title').textContent = '账号注册';
            }

            document.querySelectorAll('.indicator-dot').forEach(d => d.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

