import { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import AuthModal from './components/AuthModal.jsx';
import UserMenu from './components/UserMenu.jsx';
import {
  clearToken,
  createConversation,
  generateTitle,
  getConversation,
  getUser,
  listConversations,
  sendMessage,
} from './services/chatApi.js';

export default function App() {
  const [user, setUser] = useState(() => getUser());
  const [authOpen, setAuthOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [listLoading, setListLoading] = useState(Boolean(user));
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newChatCount, setNewChatCount] = useState(0);
  const viewVersion = useRef(0);

  function resetChat() {
    viewVersion.current += 1; // Ignora respostas antigas ao trocar de tela.
    setSelectedId(null);
    setActiveConversation(null);
    setNewChatCount((count) => count + 1); // Remonta o ChatPanel e limpa o rascunho.
    setError('');
    setChatLoading(false);
  }

  function logout() {
    clearToken();
    setUser(null);
    setConversations([]);
    resetChat();
  }

  // Token expirado/inválido: desloga e abre o login.
  function handleApiError(err, prefix) {
    if (err.status === 401) {
      logout();
      setAuthOpen(true);
      return;
    }
    setError(`${prefix}: ${err.message}`);
  }

  function handleAuthenticated(loggedUser) {
    setUser(loggedUser);
    setListLoading(true); // O useEffect de [user] recarrega a lista.
    setAuthOpen(false);
    resetChat();
  }

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  async function refreshList() {
    const list = await listConversations();
    setConversations(list);
  }

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    listConversations()
      .then((list) => { if (mounted) setConversations(list); })
      .catch((err) => {
        if (!mounted) return;
        if (err.status === 401) {
          clearToken();
          setUser(null);
          setAuthOpen(true);
        } else {
          setError(`Não foi possível carregar a lista: ${err.message}`);
        }
      })
      .finally(() => { if (mounted) setListLoading(false); });
    return () => { mounted = false; };
  }, [user]);

  function newConversation() {
    resetChat();
    setSidebarOpen(false);
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
      if (version === viewVersion.current) handleApiError(err, 'Erro ao abrir conversa');
    } finally {
      if (version === viewVersion.current) setChatLoading(false);
    }
  }

  async function startConversation(content, version) {
    const session = await createConversation(content);
    const chat = await getConversation(session.id);
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
    if (!user) {
      setAuthOpen(true);
      throw new Error('Login necessário'); // Faz o ChatPanel devolver o rascunho.
    }
    const version = viewVersion.current;
    setError('');
    setSending(true);
    try {
      if (selectedId) await continueConversation(selectedId, content, version);
      else await startConversation(content, version);
    } catch (err) {
      if (version === viewVersion.current) handleApiError(err, 'Não foi possível enviar');
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
        loggedIn={Boolean(user)}
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
        headerActions={<UserMenu user={user} onLogin={() => setAuthOpen(true)} onLogout={logout} />}
      />
      {authOpen && <AuthModal onClose={closeAuth} onAuthenticated={handleAuthenticated} />}
    </div>
  );
}
