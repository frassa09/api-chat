import { Icon } from './Icons.jsx';

// Canto superior direito: botão "Entrar" ou nome do usuário + sair.
export default function UserMenu({ user, onLogin, onLogout }) {
  if (!user) {
    return (
      <button
        type="button"
        onClick={onLogin}
        className="flex h-9 items-center gap-2 rounded-full bg-[#7463ef] px-3.5 text-xs font-bold text-white shadow-[0_6px_16px_#6e5de92a] transition hover:bg-[#5a49dc]"
      >
        <Icon name="user" size={16} />
        <span>Entrar</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-[#e8eaf2] bg-white py-1 pl-1 pr-1">
      <span className="grid size-7 place-items-center rounded-full bg-[#f0edff] text-[11px] font-bold uppercase text-[#6a59ea]">
        {user.name?.trim()?.[0] ?? '?'}
      </span>
      <span className="hidden max-w-[140px] truncate px-1.5 text-xs font-semibold text-[#4e5566] sm:inline" title={user.email}>
        {user.name}
      </span>
      <button
        type="button"
        onClick={onLogout}
        aria-label="Sair"
        title="Sair"
        className="grid size-7 place-items-center rounded-full text-[#8a90a3] hover:bg-[#fff2f0] hover:text-[#a73b35]"
      >
        <Icon name="logout" size={16} />
      </button>
    </div>
  );
}
