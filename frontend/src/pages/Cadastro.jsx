import { Link } from "react-router-dom"

function Cadastro() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6 pt-16">
      {/* Logo */}
      <div className="flex items-center gap-2 text-xl font-bold">
        <span>senAI</span>
        <span className="text-marinho">chat</span>
        <span className="text-royal">bot</span>
      </div>

      {/* Título e subtítulo */}
      <h1 className="mt-16 text-3xl font-bold text-marinho">Criar sua conta</h1>
      <p className="mt-3 text-esportivo">Comece a conversar com o senAI</p>

      {/* Formulário */}
      <form className="mt-12 w-full max-w-md">
        <label className="block text-sm font-medium text-marinho">
          Nome
          <input
            type="text"
            placeholder="Seu nome"
            className="mt-1 block w-full border-b border-celeste bg-transparent py-2 font-normal text-marinho outline-none placeholder:text-ceu focus:border-royal"
          />
        </label>

        <label className="mt-5 block text-sm font-medium text-marinho">
          E-mail
          <input
            type="email"
            placeholder="...@gmail.com"
            className="mt-1 block w-full border-b border-celeste bg-transparent py-2 font-normal text-marinho outline-none placeholder:text-ceu focus:border-royal"
          />
        </label>

        <label className="mt-5 block text-sm font-medium text-marinho">
          Senha
          <input
            type="password"
            placeholder="******"
            className="mt-1 block w-full border-b border-celeste bg-transparent py-2 font-normal text-marinho outline-none placeholder:text-ceu focus:border-royal"
          />
        </label>

        <button
          type="submit"
          className="mt-12 w-full cursor-pointer rounded-full bg-royal py-3.5 font-semibold text-white shadow-lg transition hover:bg-cobalto"
        >
          Cadastrar
        </button>
      </form>

      <p className="mt-6 text-sm text-esportivo">
        Já tem conta?{" "}
        <Link to="/" className="font-medium text-cobalto underline">
          Entrar
        </Link>
      </p>
    </main>
  )
}

export default Cadastro