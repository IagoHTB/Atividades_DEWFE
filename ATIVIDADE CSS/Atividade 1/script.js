
// um caractere especial, uma letra maiúscula e uma minúscula.
function validatePassword(password) {
	const minLength = 8;
	if (!password || password.length < minLength) return false;
	const hasUpper = /[A-Z]/.test(password);
	const hasLower = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSpecial = /[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
	return hasUpper && hasLower && hasNumber && hasSpecial;
}

// Handler de exemplo para um formulário com id "signupForm" e input "password"
document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('signupForm');
	if (!form) return;
	const pwdInput = form.querySelector('input[name="password"]');
	const errorEl = document.createElement('div');
	errorEl.style.color = 'red';
	errorEl.style.marginTop = '8px';
	form.appendChild(errorEl);

	form.addEventListener('submit', (e) => {
		const pwd = pwdInput ? pwdInput.value : '';
		if (!validatePassword(pwd)) {
			e.preventDefault();
			errorEl.textContent = 'A senha deve ter ao menos 8 caracteres, incluir número, caractere especial, letra maiúscula e minúscula.';
			pwdInput.focus();
		} else {
			errorEl.textContent = '';
		}
	});
});

if (typeof module !== 'undefined') module.exports = { validatePassword };

