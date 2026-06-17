// um caractere especial, uma letra maiúscula e uma minúscula.
function validarSenha(senha) {
	const comprimentoMinimo = 8;
	if (!senha || senha.length < comprimentoMinimo) return false;
	const temMaiuscula = /[A-Z]/.test(senha);
	const temMinuscula = /[a-z]/.test(senha);
	const temNumero = /[0-9]/.test(senha);
	const temEspecial = /[!@#\\$%\\^&\\*\\(\\)_\\+\-=[\]{};':"\\|,.<>\\/?`~]/.test(senha);
	return temMaiuscula && temMinuscula && temNumero && temEspecial;
}


document.addEventListener('DOMContentLoaded', () => {
	const formulario = document.getElementById('cadastroForm');
	if (!formulario) return;
	const campoSenha = formulario.querySelector('input[name="senha"]');
	const campoConfirmarSenha = formulario.querySelector('input[name="confirmar-senha"]');

	const mostrarErro = (campo, mensagem) => {
		limparErro(campo);
		if (!campo) return;
		campo.classList.add('error-input');
		const elementoErro = document.createElement('div');
		elementoErro.className = 'error-message';
		elementoErro.textContent = mensagem;
		campo.parentNode.appendChild(elementoErro);
	};

	const limparErro = (campo) => {
		if (!campo) return;
		campo.classList.remove('error-input');
		const pai = campo.parentNode;
		if (pai) {
			const erroExistente = pai.querySelector('.error-message');
			if (erroExistente) {
				erroExistente.remove();
			}
		}
	};

	if (campoSenha) {
		campoSenha.addEventListener('input', () => {
			limparErro(campoSenha);
		});
	}

	if (campoConfirmarSenha) {
		campoConfirmarSenha.addEventListener('input', () => {
			limparErro(campoConfirmarSenha);
		});
	}

	formulario.addEventListener('submit', (evento) => {
		const senha = campoSenha ? campoSenha.value : '';
		const confirmarSenha = campoConfirmarSenha ? campoConfirmarSenha.value : '';

		// Limpa erros anteriores
		limparErro(campoSenha);
		limparErro(campoConfirmarSenha);

		let temErro = false;

		if (!validarSenha(senha)) {
			evento.preventDefault();
			mostrarErro(campoSenha, 'A senha deve ter ao menos 8 caracteres, incluir número, caractere especial, letra maiúscula e minúscula.');
			campoSenha.focus();
			temErro = true;
		}

		if (!temErro && senha !== confirmarSenha) {
			evento.preventDefault();
			mostrarErro(campoConfirmarSenha, 'As senhas não coincidem.');
			campoConfirmarSenha.focus();
			temErro = true;
		}
	});
});

if (typeof module !== 'undefined') module.exports = { validarSenha };

