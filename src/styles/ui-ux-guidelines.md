# UI/UX Guidelines & Design System

Este documento centraliza as diretrizes de design, as variáveis globais utilizadas e os padrões arquitetônicos de UI do projeto. O sistema adota um padrão de **Light Theme** com toques sutis de acessibilidade e tons semânticos focados em contraste.

---

## 1. Variáveis Globais (SASS)

As variáveis CSS estão definidas de forma centralizada no arquivo `src/styles/_variables.scss`. Todos os componentes devem importar esse arquivo (`@import 'path/to/variables.scss'`) e utilizar essas referências para garantir consistência visual.

### Paleta Principal (Brand)

| Variável         | Cor (Hex) | Função                                                            |
| :--------------- | :-------- | :---------------------------------------------------------------- |
| `$primary`       | `#0ea5e9` | Cor principal da marca, botões em destaque, links e ícones ativos |
| `$primary-hover` | `#0284c7` | Estado \`:hover\` de componentes principais                       |
| `$secondary`     | `#64748b` | Elementos de UI secundários (borders de foco, subtítulos)         |

### Backgrounds (Fundos)

| Variável     | Cor (Hex) | Função                                                          |
| :----------- | :-------- | :-------------------------------------------------------------- |
| `$bg-page`   | `#f0f9ff` | Fundo geral da aplicação (telas principais)                     |
| `$bg-card`   | `#ffffff` | Fundo preenchido 100% de blocos, cartões e cabeçalhos de tabela |
| `$bg-subtle` | `#f1f5f9` | Detalhes sutis ou fundos de botões desativados/passivos         |
| `$bg-hover`  | `#f8fafc` | Efeito sutil ao passar o mouse sobre linhas ou cartões          |

### Typography & Textos

| Variável          | Cor (Hex) | Função                                                           |
| :---------------- | :-------- | :--------------------------------------------------------------- |
| `$text-primary`   | `#0f172a` | Texto de alta prioridade (Títulos de página, métricas primárias) |
| `$text-secondary` | `#475569` | Texto corrido padrão, parágrafos                                 |
| `$text-muted`     | `#94a3b8` | Texto secundário diminuto (labels, rodapés)                      |

_(Nota: Títulos usam \`'Roboto'\`, e texto corrido \`'Inter'\`)_

---

## 2. Acessibilidade e Interatividade (Hover & Focus)

Para assegurar legibilidade e aderência aos padrões de UX modernos, todos os elementos interativos (_Tabs, Buttons, Links, Table Rows_) devem prever estados claros de **Hover** e **Focus**.

- **Hover (\`:hover\`)**: Elementos ganham o fundo `$bg-hover` ou a cor da fonte muda para `$primary-hover` com uma transição suave.
  _Exemplo SCSS:_
  \`\`\`scss
  transition: $transition-default;
  &:hover { background-color: $bg-hover; color: $primary-hover; }
  \`\`\`
- **Focus (\`:focus-visible\`)**: Para navegação por teclado fluida, utilizamos o `$shadow-focus` ao invés de simples bordas, garantindo que o outline não quebre o layout mas permaneça altamente visível (\`box-shadow: 0 0 0 3px $primary-focus\`).

---

## 3. Padrões de Componentes

### 3.1. Cards (\`TrackingCards.tsx\`, \`OverviewMetrics.tsx\`)

Os "cards" ou cartões métricos ditam a métrica primária da tela.

- **Fundo / Borda**: Usam `$bg-card` e bordas claras `$border-default`.
- **Sombra**: Devem usar `$shadow-sm` para flutuar acima do `$bg-page`.
- **Estrutura Interna**:
  - Título em caixa alta ou fonte diminuta (ex: 0.75rem, font-weight 600) em `$text-secondary`.
  - Valor massivo (2rem a 2.5rem) pesado (\`font-weight: 800\`) em `$text-primary`.
  - Opcional: Feedback visual de Badges dependendo da criticidade.

### 3.2. Tabelas (\`TrackingTable.tsx\`, \`sharedDataGridStyles\`)

Adotamos o **MUI DataGrid** como engine de tabelas pelo suporte avançado de dados e filtros.
As tabelas foram "tematizadas" de volta para convergir com o SCSS através do arquivo \`sharedDataGridStyles.ts\`:

- Cabeçalhos sem borda inferior pesada (usamos sutis \`2px solid $border-default\`).
- Texto do cabeçalho usa a cor secundária ($text-secondary) com font bold.
- Efeito **Zebra-Striping**: Linhas pares ganham \`#f8fafc\` automaticamente. Linhas em \`:hover\` marcam \`#f1f5f9\`.
- \`outline\` intrusivo nativo das células do MUI DataGrid foi anulado em prol de uma navegação mais transparente ao usuário convencional.

### 3.3. Gráficos (\`Recharts\`)

A biblioteca escolhida para gráficos de negócio é **\`recharts\`** devido ao seu ecossistema nativo React e personalização SVG.
**Boas Práticas de Uso:**

- **Cores dos Gráficos**: Evite utilizar cores fixas. Dentro do componente React, exporte a variável ou amarre ao tema, ou injete hexadecimais alinhadas aos Status Tokens (Exemplo: `#0ea5e9` para sucesso padronizado de progresso, amarelo/laranja em áreas de risco).
- **ResponsiveContainer**: Sempre amarre gráficos em uma \`<ResponsiveContainer width="100%" height="100%">\` em vez de dimensões fixas.
- **Tooltips Customizados**: Renderize \`<Tooltip content={<CustomTooltip />} />\` para garantir que o \`background-color\` do tooltip utilize `$bg-card` e contornos com `$border-default`, e não o padrão opaco preto primitivo.
