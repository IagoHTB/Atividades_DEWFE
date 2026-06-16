
// um caractere especial, uma letra maiúscula e uma minúscula.
function validarSenha(senha) {
	const minLength = 8;
	if (!senha || senha.length < minLength) return false;
	const hasUpper = /[A-Z]/.test(senha);
	const hasLower = /[a-z]/.test(senha);
	const hasNumber = /[0-9]/.test(senha);
	const hasSpecial = /[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?`~]/.test(senha);
	return hasUpper && hasLower && hasNumber && hasSpecial;
}


document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('cadastroForm');
	if (!form) return;
	const senhaInput = form.querySelector('input[name="senha"]');
	const confirmarSenhaInput = form.querySelector('input[name="confirmar-senha"]');

	const showError = (input, message) => {
		clearError(input);
		if (!input) return;
		input.classList.add('error-input');
		const errorEl = document.createElement('div');
		errorEl.className = 'error-message';
		errorEl.textContent = message;
		input.parentNode.appendChild(errorEl);
	};

	const clearError = (input) => {
		if (!input) return;
		input.classList.remove('error-input');
		const parent = input.parentNode;
		if (parent) {
			const existingError = parent.querySelector('.error-message');
			if (existingError) {
				existingError.remove();
			}
		}
	};

	if (senhaInput) {
		senhaInput.addEventListener('input', () => {
			clearError(senhaInput);
		});
	}

	if (confirmarSenhaInput) {
		confirmarSenhaInput.addEventListener('input', () => {
			clearError(confirmarSenhaInput);
		});
	}

	form.addEventListener('submit', (e) => {
		const senha = senhaInput ? senhaInput.value : '';
		const confirmarSenha = confirmarSenhaInput ? confirmarSenhaInput.value : '';

		// Clear previous errors
		clearError(senhaInput);
		clearError(confirmarSenhaInput);

		let hasError = false;

		if (!validarSenha(senha)) {
			e.preventDefault();
			showError(senhaInput, 'A senha deve ter ao menos 8 caracteres, incluir número, caractere especial, letra maiúscula e minúscula.');
			senhaInput.focus();
			hasError = true;
		}

		if (!hasError && senha !== confirmarSenha) {
			e.preventDefault();
			showError(confirmarSenhaInput, 'As senhas não coincidem.');
			confirmarSenhaInput.focus();
			hasError = true;
		}
	});
});

if (typeof module !== 'undefined') module.exports = { validarSenha };

