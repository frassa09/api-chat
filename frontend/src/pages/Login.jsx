function Login() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6 pt-16">
      <div className="flex items-center gap-2 text-xl font-bold">
        <span></span>
        <span className="text-marinho">Chat com SenAI</span>
      </div>

      <h1 className="mt-16 text-3xl font-bold text-marinho">
        Conectar-se
      </h1>
      <p className="mt-3 text-esportivo">Conversar com sua IA</p>

      <form className="mt-12 w-full max-w-md">
        <label className="block text-sm font-medium text-marinho">
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
            placeholder="Sua senha"
            className="mt-1 block w-full border-b border-celeste bg-transparent py-2 font-normal text-marinho outline-none placeholder:text-ceu focus:border-royal"
          />
        </label>

        <button
          type="submit"
          className="mt-12 w-full cursor-pointer rounded-full bg-royal py-3.5 font-semibold text-white shadow-lg transition hover:bg-cobalto"
        >
          Entrar
        </button>
      </form>

      <p className="mt-6 text-sm text-esportivo">
        Sem conta?
        <a href="#" className="font-medium text-cobalto underline">
          Cadastre-se aqui
        </a>
      </p>
    </main>
  )
}

export default Login