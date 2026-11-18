import { useMemo, useState } from 'react';
import { Icon } from './Icons.jsx';

function dateGroup(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date >= today) return 'Hoje';
  if (date >= yesterday) return 'Ontem';
  return 'Anteriores';
}

export default function Sidebar({ conversations, selectedId, loading, onSelect, onNew, open, onClose }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => conversations.filter((chat) =>
    chat.title.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR').trim())
  ), [conversations, search]);

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#10121a]/65 md:hidden"
          aria-label="Fechar menu"
          onClick={onClose}
        />
      )}
      <aside
        aria-label="Histórico de conversas"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(310px,88vw)] shrink-0 flex-col bg-[#121622] text-[#e9ecf7] shadow-[8px_0_35px_#10121a1c] transition-transform duration-300 md:relative md:z-0 md:w-[268px] md:translate-x-0 md:shadow-none lg:w-[293px] ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-[19px] pb-[18px] pt-[30px] md:px-[15px] lg:px-[19px]">
          <div className="mb-9 flex items-center gap-3 px-1">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-[#8d6bfd] to-[#4669db] text-white shadow-[0_5px_20px_#715aff36]">
              <Icon name="sparkle" size={22} />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <strong className="font-['Outfit',sans-serif] text-xl leading-none tracking-[-0.6px]">ChatSpace</strong>
              <small className="mt-1 text-[11px] tracking-[0.15px] text-[#838aa0]">Seu espaço de ideias</small>
            </span>
            <button
              type="button"
              className="ml-auto grid size-8 place-items-center rounded-lg text-[#a8afc5] hover:bg-white/10 md:hidden"
              onClick={onClose}
              aria-label="Fechar menu"
            >
              <Icon name="x" />
            </button>
          </div>

          <button
            type="button"
            className="flex h-[47px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#7463f4] text-[13px] font-bold text-white shadow-[0_7px_24px_#6556e62b] transition hover:-translate-y-px hover:bg-[#8575fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2baff]"
            onClick={onNew}
          >
            <Icon name="plus" size={20} /> Nova conversa
          </button>

          <label className="mt-[23px] flex h-[42px] items-center gap-2.5 rounded-[9px] border border-[#2e3344] bg-[#1a1e2c] px-3 text-[#848b9f] focus-within:border-[#8b80ed]">
            <Icon name="search" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar conversas..."
              aria-label="Buscar conversas"
              className="w-full min-w-0 bg-transparent text-xs text-white outline-none placeholder:text-[#83889b]"
            />
          </label>
        </div>

        <nav aria-label="Conversas" className="min-h-0 flex-1 overflow-y-auto px-[19px] pb-6 pt-1 md:px-[15px] lg:px-[19px]">
          <div className="mb-6 flex items-center gap-2.5 px-3 text-[10px] font-extrabold tracking-[1.5px] text-[#747d96]">
            <Icon name="clock" size={16} />
            <span>HISTÓRICO</span>
            <span className="ml-auto rounded bg-[#262b3a] px-1.5 py-1 text-[10px] tracking-normal text-[#abb2c5]">{conversations.length}</span>
          </div>

          {loading ? (
            <p role="status" className="px-3 text-xs leading-7 text-[#888fa5]">Carregando conversas...</p>
          ) : filtered.length === 0 ? (
            <p className="px-3 text-xs leading-7 text-[#888fa5]">
              {search ? 'Nenhuma conversa encontrada.' : 'Suas conversas aparecerão aqui.'}
            </p>
          ) : (
            ['Hoje', 'Ontem', 'Anteriores'].map((group) => {
              const items = filtered.filter((chat) => dateGroup(chat.updatedAt) === group);
              if (!items.length) return null;
              return (
                <section key={group} aria-label={group} className="mb-6">
                  <h2 className="mb-3 px-3 text-[11px] font-bold text-[#717a93]">{group}</h2>
                  <div className="space-y-1">
                    {items.map((chat) => (
                      <button
                        type="button"
                        key={chat.id}
                        onClick={() => onSelect(chat.id)}
                        title={chat.title}
                        aria-current={selectedId === chat.id ? 'page' : undefined}
                        className={`flex w-full items-center gap-2.5 rounded-[9px] px-3 py-3 text-left text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-[#a294ff] ${
                          selectedId === chat.id
                            ? 'bg-[#2a2948] font-semibold text-[#f0efff]'
                            : 'text-[#aab1c5] hover:bg-[#24283a] hover:text-white'
                        }`}
                      >
                        <Icon name="message" size={17} className={`shrink-0 ${selectedId === chat.id ? 'text-[#a294ff]' : 'text-[#717a94]'}`} />
                        <span className="truncate">{chat.title}</span>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </nav>

        <div className="flex items-center gap-2 border-t border-[#292d3a] px-[23px] py-5 text-[11px] text-[#858ca0]">
          <span className="size-[7px] rounded-full bg-[#44cf9b] ring-4 ring-[#44cf9b]/10" />
          API fake conectada
          <span className="ml-auto text-[#5f687e]">v2.0</span>
        </div>
      </aside>
    </>
  );
}
