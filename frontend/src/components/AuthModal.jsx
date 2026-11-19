import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons.jsx';
import { login, register } from '../services/chatApi.js';

const inputClass =
  'mt-1.5 block h-11 w-full rounded-xl border border-[#e2e5ef] bg-white px-3.5 text-[13px] text-[#343b53] outline-none placeholder:text-[#adb3c2] focus:border-[#a89bf8] focus:ring-2 focus:ring-[#a89bf8]/25';

// Painel de login/cadastro ancorado no canto superior direito.
// onAuthenticated(user) é chamado após login (ou cadastro + login automático).
export default function AuthModal({ onClose, onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef(null);

  const isRegister = mode === 'register';

  useEffect(() => {
    firstInputRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function switchMode(next) {
    setMode(next);
    setError('');
  }

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) await register(form.name.trim(), form.email.trim(), form.password);
      const user = await login(form.email.trim(), form.password);
      onAuthenticated(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Fechar"
        className="fixed inset-0 z-[60] cursor-default bg-[#10121a]/20"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="fixed right-4 top-[74px] z-[70] w-[340px] max-w-[calc(100vw-32px)] rounded-2xl border border-[#e6e8f0] bg-white p-5 shadow-[0_18px_50px_#23284322] md:right-6 md:top-[84px] lg:right-11"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="auth-title" className="font-['Outfit',sans-serif] text-lg font-semibold text-[#202538]">
            {isRegister ? 'Criar conta' : 'Entrar'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid size-8 place-items-center rounded-lg text-[#8a90a3] hover:bg-[#f1f0ff]"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-xl bg-[#f3f2fb] p-1 text-xs font-semibold">
          {[['login', 'Entrar'], ['register', 'Criar conta']].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => switchMode(id)}
              aria-pressed={mode === id}
              className={`h-9 rounded-lg transition ${mode === id ? 'bg-white text-[#5a49dc] shadow-[0_2px_8px_#23284314]' : 'text-[#7a8095] hover:text-[#4e5566]'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <label className="block text-xs font-bold text-[#4e5566]">
              Nome
              <input
                ref={firstInputRef}
                value={form.name}
                onChange={update('name')}
                required
                minLength={5}
                maxLength={30}
                autoComplete="name"
                placeholder="Seu nome"
                className={inputClass}
              />
            </label>
          )}
          <label className="block text-xs font-bold text-[#4e5566]">
            E-mail
            <input
              ref={isRegister ? undefined : firstInputRef}
              type="email"
              value={form.email}
              onChange={update('email')}
              required
              autoComplete="email"
              placeholder="voce@email.com"
              className={inputClass}
            />
          </label>
          <label className="block text-xs font-bold text-[#4e5566]">
            Senha
            <input
              type="password"
              value={form.password}
              onChange={update('password')}
              required
              minLength={6}
              maxLength={30}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              placeholder="Mínimo 6 caracteres"
              className={inputClass}
            />
          </label>

          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-[10px] border border-[#ffc7bd] bg-[#fff2f0] px-3 py-2.5 text-xs text-[#a73b35]">
              <Icon name="alert" size={16} className="shrink-0" />{error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 h-11 w-full rounded-xl bg-[#7463ef] text-[13px] font-bold text-white transition hover:bg-[#5a49dc] disabled:cursor-not-allowed disabled:bg-[#b9b2f3]"
          >
            {submitting ? 'Aguarde...' : isRegister ? 'Criar conta e entrar' : 'Entrar'}
          </button>
        </form>
      </div>
    </>
  );
}
