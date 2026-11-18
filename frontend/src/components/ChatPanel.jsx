import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons.jsx';

export const MODELS = [
  { id: 'equilibrado', name: 'Modelo Equilibrado', description: 'Para tarefas gerais e conversas do dia a dia.' },
  { id: 'rapido', name: 'Modelo Rápido', description: 'Para perguntas e respostas objetivas.' },
  { id: 'analitico', name: 'Modelo Analítico', description: 'Para raciocínio e análise de problemas.' },
];

const getModelName = (id) => MODELS.find((item) => item.id === id)?.name ?? 'Modelo';
const timeLabel = (date) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(date));

export default function ChatPanel({ conversation, selectedId, newChatCount, model, onModelChange, onSubmit, sending, loading, error, onOpenMenu }) {
  const [draft, setDraft] = useState('');
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);
  const activeModel = conversation?.model ?? model;

  useEffect(() => { setDraft(''); }, [selectedId, newChatCount]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [conversation?.messages.length, sending]);

  async function handleSubmit(event) {
    event?.preventDefault();
    const content = draft.trim();
    if (!content || sending || loading) return;
    setDraft('');
    try {
      await onSubmit(content);
    } catch {
      setDraft(content);
    }
    textareaRef.current?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_55%_45%,#fff_0%,#fafbfe_72%,#f8f9ff_100%)]">
      <header className="flex h-[66px] shrink-0 items-center justify-between gap-3 border-b border-[#e9ebf3] bg-white/75 px-4 md:h-[76px] md:px-6 lg:px-11">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-[#626b82] hover:bg-[#f1f0ff] md:hidden"
            onClick={onOpenMenu}
            aria-label="Abrir histórico de conversas"
          >
            <Icon name="menu" size={22} />
          </button>
          <span className="hidden size-8 shrink-0 place-items-center rounded-[9px] bg-[#f0edff] text-[#7969ef] md:grid">
            <Icon name="sparkle" size={19} />
          </span>
          <h1 className="truncate font-['Outfit',sans-serif] text-sm font-semibold text-[#222a3c] sm:text-base">
            {conversation?.title ?? 'Nova conversa'}
          </h1>
        </div>
        <span
          className="flex shrink-0 items-center gap-2 rounded-full border border-[#e8eaf2] bg-white p-2.5 text-[11px] font-semibold text-[#6d7385] sm:px-3"
          title={getModelName(activeModel)}
        >
          <span className="size-[7px] rounded-full bg-[#786af6]" />
          <span className="hidden sm:inline">{getModelName(activeModel)}</span>
        </span>
      </header>

      <div className={`min-h-0 flex-1 overflow-y-auto ${!conversation && !loading ? 'flex items-center justify-center' : ''}`}>
        {loading ? (
          <div role="status" className="flex h-full items-center justify-center gap-3 text-[13px] text-[#73788b]">
            <span className="size-[21px] animate-spin rounded-full border-[3px] border-[#e8e5ff] border-t-[#7766f1]" />
            Carregando histórico...
          </div>
        ) : conversation ? (
          <div aria-live="polite" className="mx-auto flex min-h-full max-w-[850px] flex-col gap-6 px-4 pb-7 pt-8 sm:px-7">
            <div className="mb-1 text-center text-[11px] text-[#adb1bd]">Início da conversa</div>
            {conversation.messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <article key={message.id} className={`flex max-w-[95%] gap-3 sm:max-w-[84%] ${isUser ? 'ml-auto justify-end' : ''}`}>
                  {!isUser && (
                    <span className="grid size-[33px] shrink-0 place-items-center rounded-[10px] bg-[#efebff] text-[#7b6af0]">
                      <Icon name="sparkle" size={19} />
                    </span>
                  )}
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className={`wrap-anywhere whitespace-pre-wrap rounded-[17px] px-4 py-3 text-[13px] leading-[1.75] sm:px-[18px] sm:py-[14px] sm:text-sm ${
                      isUser
                        ? 'rounded-br-[5px] border border-[#7666ef] bg-[#7666ef] text-white shadow-[0_8px_18px_#6e5de91e]'
                        : 'rounded-tl-[5px] border border-[#edf0f6] bg-white text-[#41495a] shadow-[0_3px_15px_#24284307]'
                    }`}>{message.content}</div>
                    <span className={`px-1 text-[10px] text-[#a3a8b6] ${isUser ? 'text-right' : ''}`}>
                      {timeLabel(message.createdAt)}
                    </span>
                  </div>
                </article>
              );
            })}
            {sending && (
              <div className="flex max-w-[84%] gap-3" role="status" aria-label="Gerando resposta simulada">
                <span className="grid size-[33px] shrink-0 place-items-center rounded-[10px] bg-[#efebff] text-[#7b6af0]"><Icon name="sparkle" /></span>
                <div className="flex items-center gap-1.5 rounded-xl border border-[#edf0f6] bg-white px-4 py-3">
                  <span className="size-[7px] animate-pulse rounded-full bg-[#9c93df]" />
                  <span className="size-[7px] animate-pulse rounded-full bg-[#9c93df] [animation-delay:150ms]" />
                  <span className="size-[7px] animate-pulse rounded-full bg-[#9c93df] [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        ) : (
          <div className="m-auto w-full max-w-[690px] px-6 pb-7 pt-8 text-center sm:pb-12">
            <div className="mx-auto mb-6 grid size-[66px] place-items-center rounded-[22px] bg-linear-to-br from-[#a28cff] to-[#605ae9] text-white shadow-[0_15px_35px_#7768fa33] sm:size-[73px]">
              <Icon name="sparkle" size={34} />
            </div>
            <p className="mb-3 text-[10px] font-extrabold tracking-[2.8px] text-[#7b69f2]">UM NOVO COMEÇO</p>
            <h2 className="mb-3 font-['Outfit',sans-serif] text-[30px] font-bold tracking-[-1.3px] text-[#202538] sm:text-[clamp(30px,4vw,42px)]">
              O que vamos criar hoje?
            </h2>
            <p className="mx-auto mb-6 max-w-[480px] text-xs leading-[1.7] text-[#858c9d] sm:mb-8 sm:text-sm">
              Escolha um modelo e comece uma conversa. Seu histórico ficará disponível na barra lateral.
            </p>
            <div className="mx-auto w-full max-w-[335px] text-left">
              <label htmlFor="model-select" className="mb-2.5 block text-xs font-bold text-[#4e5566]">Selecionar modelo</label>
              <div className="relative">
                <select
                  id="model-select"
                  value={model}
                  onChange={(event) => onModelChange(event.target.value)}
                  className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-[#e2e5ef] bg-white py-0 pl-4 pr-11 text-[13px] font-semibold text-[#343b53] shadow-[0_4px_14px_#23284308] outline-none focus:border-[#a89bf8] focus:ring-2 focus:ring-[#a89bf8]/25"
                >
                  {MODELS.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                </select>
                <Icon name="chevronDown" size={18} className="pointer-events-none absolute right-3.5 top-[15px] text-[#7a8297]" />
              </div>
              <p className="mt-2.5 px-0.5 text-[11px] text-[#979cad]">
                {MODELS.find((option) => option.id === model)?.description}
              </p>
            </div>
            <div className="mx-auto mt-7 grid max-w-[350px] grid-cols-1 gap-2 lg:mt-10 lg:max-w-none lg:grid-cols-3 lg:gap-3">
              {['Me ajude a planejar um projeto', 'Explique como funciona uma API', 'Quero aprender React'].map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => { setDraft(suggestion); textareaRef.current?.focus(); }}
                  className="flex min-h-[50px] items-start justify-between gap-2 rounded-xl border border-[#e8eaf1] bg-white px-4 py-3 text-left text-xs font-semibold leading-[1.4] text-[#515970] transition hover:-translate-y-0.5 hover:border-[#c4bbff] hover:shadow-[0_7px_25px_#6666aa12] lg:min-h-[74px]"
                >
                  {suggestion}<span className="text-base text-[#8d81ed]">↗</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 bg-linear-to-t from-[#fafbff] via-[#fafbff] to-transparent px-3 pb-4 pt-3 sm:px-6 lg:px-10">
        {error && (
          <div role="alert" className="mx-auto mb-2.5 flex max-w-[800px] items-center gap-2 rounded-[10px] border border-[#ffc7bd] bg-[#fff2f0] px-4 py-3 text-xs text-[#a73b35]">
            <Icon name="alert" size={17} />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-[800px] items-end gap-2.5 rounded-2xl border border-[#e1e4ed] bg-white px-3 py-3 pl-5 shadow-[0_5px_30px_#272f4810] focus-within:border-[#b2a8ff]">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva sua mensagem..."
            aria-label="Mensagem"
            rows={1}
            maxLength={5000}
            disabled={sending || loading}
            className="max-h-[150px] min-h-[26px] flex-1 resize-none bg-transparent py-1.5 text-[13px] leading-[1.65] text-[#333c50] outline-none placeholder:text-[#adb3c2] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending || loading}
            aria-label="Enviar mensagem"
            title="Enviar mensagem"
            className="grid size-[38px] shrink-0 place-items-center rounded-[10px] bg-[#7463ef] text-white transition hover:bg-[#5a49dc] disabled:cursor-not-allowed disabled:bg-[#d9dce8]"
          >
            <Icon name="arrowUp" size={20} />
          </button>
        </form>
        <p className="mt-2.5 text-center text-[9px] text-[#a1a6b3] sm:text-[10px]">
          Projeto demonstrativo · Respostas geradas por uma API fake, não por IA real.
        </p>
      </div>
    </main>
  );
}
