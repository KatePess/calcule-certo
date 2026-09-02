import { createContext, useContext, useEffect, useState } from 'react';
import { api, guardarToken, limparToken, lerToken } from './api.js';

const ContextoSessao = createContext(null);

export function ProvedorSessao({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o app, se ja existe token guardado, recupera o usuario.
  useEffect(() => {
    if (!lerToken()) {
      setCarregando(false);
      return;
    }
    api
      .eu()
      .then((dados) => setUsuario(dados.usuario))
      .catch(() => limparToken())
      .finally(() => setCarregando(false));
  }, []);

  async function entrar(email, senha, lembrar) {
    const dados = await api.login(email, senha);
    guardarToken(dados.token, lembrar);
    setUsuario(dados.usuario);
  }

  async function cadastrar(formulario) {
    const dados = await api.cadastrar(formulario);
    guardarToken(dados.token, false);
    setUsuario(dados.usuario);
  }

  function sair() {
    limparToken();
    setUsuario(null);
  }

  return (
    <ContextoSessao.Provider value={{ usuario, carregando, entrar, cadastrar, sair }}>
      {children}
    </ContextoSessao.Provider>
  );
}

export function useSessao() {
  const contexto = useContext(ContextoSessao);
  if (!contexto) throw new Error('useSessao precisa estar dentro de <ProvedorSessao>.');
  return contexto;
}
