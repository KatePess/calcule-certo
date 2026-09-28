# Roteiro de homologação — Calcule Certo

Roteiro da sessão com a empresa parceira prevista na seção 2.9 do TCC e na
Sprint 6 do [plano de implementação](PLANO-DE-IMPLEMENTACAO.md). Imprima ou
deixe aberto durante a reunião e preencha as tabelas na hora.

**Objetivos**

1. Confirmar a fórmula do cálculo (perguntas Q1 a Q5).
2. Comparar o sistema com a planilha da empresa, **centavo a centavo** (RNF02).
3. Medir o tempo da tarefa completa. A meta é **menos de 3 minutos**; hoje a empresa leva cerca de 40 (RNF05).
4. Ouvir a opinião de quem vai usar o sistema no dia a dia.

Data: ____/____/______ · Participantes: ______________________________

---

## Antes da reunião

- [ ] Docker Desktop aberto e sistema rodando (`docker compose up -d`, API e front-end — ver README)
- [ ] Entrar com a conta de demonstração para conferir que está tudo no ar
- [ ] Pedir antes, por mensagem, **a planilha atual** e **3 ou mais licitações reais** já calculadas nela
- [ ] Levar este roteiro e um cronômetro (o do celular serve)
- [ ] Criar uma conta nova para o stakeholder usar na sessão (assim os dados de demonstração não se misturam)

---

## Parte 1 — Validar a fórmula

Hoje o sistema segue a proposta da seção 5 do plano. Anote a resposta exata de cada pergunta.

| # | Pergunta | Como o sistema faz hoje | Resposta da empresa | Precisa mudar? |
|---|---|---|---|---|
| Q1 | A taxa da plataforma e a comissão são cobradas sobre o **preço final** da proposta? | Sim, sobre o preço final | | ☐ Sim ☐ Não |
| Q2 | A margem de lucro é um percentual **do preço final** ou **do custo**? | Do preço final | | ☐ Sim ☐ Não |
| Q3 | O que é o campo **"Orçamento da empresa"**? | O preço que a empresa usaria hoje; o sistema mostra quanto ela ganharia ou perderia com ele | | ☐ Sim ☐ Não |
| Q4 | O **custo variável** é por item ou o total? | Por item (multiplicado pela quantidade) | | ☐ Sim ☐ Não |
| Q5 | O **seguro** é um valor em R$ ou um percentual? | Valor em R$, somado ao custo | | ☐ Sim ☐ Não |

Para explicar a Q1 de forma simples, use o exemplo da seção 5.3 do plano:
somar 40% ao custo de R$ 1.000,00 dá R$ 1.400,00, mas a plataforma e a
comissão levam R$ 420,00 desse preço e a empresa fica com **prejuízo de R$ 20,00**.

---

## Parte 2 — Comparar com a planilha

**Aquecimento (cenário 0).** Serve para mostrar a tela antes dos casos reais. O resultado esperado é conhecido (seção 5.4 do plano):
10 itens · custo variável R$ 80,00 · custo fixo R$ 150,00 · seguro R$ 0,00 · plataforma 5% · comissão 10% · margem 10% · orçamento da empresa R$ 1.100,00.

| Campo | Esperado | Sistema | Confere? |
|---|---|---|---|
| Custos totais | R$ 950,00 | | ☐ |
| Novo orçamento gerado | R$ 1.266,67 | | ☐ |
| Lucro estimado | R$ 126,67 | | ☐ |
| Com o orçamento de R$ 1.100,00 | prejuízo de R$ 15,00 | | ☐ |

**Cenários reais.** Repita a tabela abaixo para cada licitação trazida pela empresa.

Cenário ___ · Licitação: __________________ · Órgão: __________________

Entradas: itens ______ · custo variável R$ ______ · custo fixo R$ ______ · seguro R$ ______ ·
plataforma ____% · comissão ____% · margem ____% · outras taxas ______________

| Campo | Planilha | Sistema | Diferença |
|---|---|---|---|
| Custos totais | | | |
| Taxa da plataforma (R$) | | | |
| Comissão (R$) | | | |
| Lucro estimado | | | |
| Novo orçamento | | | |

Se houver diferença, anote **a fórmula que a planilha usa naquela célula**. É isso que vai dizer se o sistema ou a planilha precisa mudar.

---

## Parte 3 — Tarefa cronometrada

Peça à pessoa que faça sozinha, sem ajuda, a tarefa do dia a dia:

1. Cadastrar a licitação (número, órgão, data de abertura)
2. Preencher o cálculo e clicar em **Confirmar**
3. Conferir o resumo e **Salvar em Relatórios**
4. Baixar o PDF

O cronômetro começa no clique em **Orçamento** e para quando o PDF é salvo.

| Tentativa | Tempo | Onde a pessoa hesitou ou errou |
|---|---|---|
| 1ª | ___ min ___ s | |
| 2ª | ___ min ___ s | |

Meta: **menos de 3 minutos** · ☐ Atingida ☐ Não atingida

---

## Parte 4 — Opinião de quem vai usar

Notas de 1 (discordo totalmente) a 5 (concordo totalmente):

| Afirmação | Nota |
|---|---|
| Foi fácil encontrar onde fazer o cálculo | |
| Os nomes dos campos são os mesmos que a empresa usa | |
| O resumo explica bem de onde veio o novo orçamento | |
| O PDF pode ser enviado como está, sem ajustes | |
| Eu usaria o sistema no lugar da planilha | |

Perguntas abertas:

- O que mais atrapalhou? ______________________________________________
- Falta algum campo ou taxa que a empresa usa? ________________________
- O que você mudaria primeiro? _________________________________________

---

## Depois da reunião

- [ ] Passar os cenários reais para o teste que está marcado como pendente (`test.todo('13. cenários reais...')` em `backend/testes/motorCalculo.test.js`)
- [ ] Criar um cartão no Trello, na lista "Ajustes pós-homologação", para cada mudança combinada
- [ ] Preencher o resumo abaixo e levá-lo para o capítulo de resultados do TCC

**Se a fórmula precisar mudar:** a regra fica toda em `backend/src/servicos/motorCalculo.js`.
Ao mudá-la, troque `VERSAO_FORMULA` de `'1'` para `'2'` em `backend/src/constantes/calculo.js`.
Os relatórios antigos continuam mostrando o que foi calculado na época (seção 5.7 do plano).

### Resumo para o TCC

| Item | Resultado |
|---|---|
| Cenários reais comparados | |
| Cenários com diferença de centavos | |
| Tempo médio da tarefa completa | |
| Tempo com a planilha (antes) | cerca de 40 minutos |
| Nota média da Parte 4 | |
| Principais ajustes pedidos | |
