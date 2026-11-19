import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import {
  createConversation,
  generateTitle,
  getConversation,
  listConversations,
  sendMessage,
} from './services/chatApi.js';

// TODO: rotas (react-router-dom): "/" Login, "/cadastro" Cadastro, "/chat" esta tela (só logado).
export default function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newChatCount, setNewChatCount] = useState(0);
  const viewVersion = useRef(0);

  async function refreshList() {
    const list = await listConversations();
    setConversations(list);
  }

  useEffect(() => {
    let mounted = true;
    listConversations()
      .then((list) => { if (mounted) setConversations(list); })
      .catch((err) => { if (mounted) setError(`Não foi possível carregar a lista: ${err.message}`); })
      .finally(() => { if (mounted) setListLoading(false); });
    return () => { mounted = false; };
  }, []);

  function newConversation() {
    viewVersion.current += 1; // Ignora respostas antigas ao trocar de tela.
    setSelectedId(null);
    setActiveConversation(null);
    setNewChatCount((count) => count + 1); // Remonta o ChatPanel e limpa o rascunho.
    setError('');
    setSidebarOpen(false);
    setChatLoading(false);
  }

  async function selectConversation(id) {
    if (id === selectedId && activeConversation) {
      setSidebarOpen(false);
      return;
    }
    const version = ++viewVersion.current;
    setSelectedId(id);
    setActiveConversation(null);
    setChatLoading(true);
    setError('');
    setSidebarOpen(false);
    try {
      const chat = await getConversation(id);
      if (version === viewVersion.current) setActiveConversation(chat);
    } catch (err) {
      if (version === viewVersion.current) setError(`Erro ao abrir conversa: ${err.message}`);
    } finally {
      if (version === viewVersion.current) setChatLoading(false);
    }
  }

  async function startConversation(content, version) {
    const chat = await createConversation(content);
    if (version === viewVersion.current) {
      setSelectedId(chat.id);
      setActiveConversation(chat);
    }
    await refreshList();

    // O título gerado pela IA chega depois; se falhar, fica a primeira mensagem.
    generateTitle(chat.id)
      .then((title) => {
        setConversations((list) => list.map((c) => (c.id === chat.id ? { ...c, title } : c)));
        setActiveConversation((current) => (current?.id === chat.id ? { ...current, title } : current));
      })
      .catch(() => {});
  }

  async function continueConversation(id, content, version) {
    const newMessages = await sendMessage(id, content);
    if (version === viewVersion.current) {
      setActiveConversation((current) => ({ ...current, messages: [...current.messages, ...newMessages] }));
    }
    await refreshList();
  }

  async function submitMessage(content) {
    const version = viewVersion.current;
    setError('');
    setSending(true);
    try {
      if (selectedId) await continueConversation(selectedId, content, version);
      else await startConversation(content, version);
    } catch (err) {
      // TODO: se for UnauthorizedError, redirecionar para o login.
      if (version === viewVersion.current) setError(`Não foi possível enviar: ${err.message}`);
      throw err;
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-dvh min-h-[480px] overflow-hidden bg-[#fafbfe] font-['DM_Sans',sans-serif] text-[#222a3c] antialiased">
      <Sidebar
        conversations={conversations}
        selectedId={selectedId}
        loading={listLoading}
        onSelect={selectConversation}
        onNew={newConversation}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <ChatPanel
        key={selectedId ?? `new-${newChatCount}`}
        conversation={activeConversation}
        onSubmit={submitMessage}
        sending={sending}
        loading={chatLoading}
        error={error}
        onOpenMenu={() => setSidebarOpen(true)}
      />
    </div>
  );
}
