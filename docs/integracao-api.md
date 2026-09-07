# Integração com a API — registro de alterações

Documenta as mudanças feitas no front-end para substituir os dados de exemplo (`src/mocks/`)
pelas chamadas reais à API Java do projeto.

**Data:** 07/09/2026
**Estado:** front-end integrado; build validado; login e listagem testados ponta a ponta
pelo Nginx.

---

## Contexto

O front-end foi construído contra dados de exemplo, com as chamadas reais já escritas mas
comentadas. A API (Spring Boot) ficou pronta e o contrato foi fechado, então este trabalho
consistiu em ativar essas chamadas e ajustar o que a troca revelou.

O caminho completo em produção é:

```
navegador  →  Nginx (VM1)  →  API Spring Boot (VM2)  →  MySQL (VM3)
```

O Nginx remove o prefixo `/api` antes de repassar, então a API responde em `/products`,
`/users` e `/auth/login`. Para o front isso é transparente: ele sempre chama `/api/...`.

---

## 1. Camada de API

### `src/api/client.js`

**Interceptor de autenticação.** Todas as rotas, exceto login e cadastro, exigem o header
`Authorization: Bearer <token>`. Foi adicionado um interceptor de requisição que injeta o
token em toda chamada:

```js
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
```

A alternativa seria passar o header manualmente nas dez funções de `products.api.js` —
além do trabalho repetido, bastaria esquecer uma para aquela tela falhar com `401`.
O `if (token)` evita enviar um header vazio na tela de login, quando ainda não há token.

**Por que um interceptor e não `apiClient.defaults`.** Definir o header uma vez, no topo
de um módulo, não funciona numa SPA: esse código roda quando o módulo é carregado — na
abertura da aplicação, antes de qualquer login. Nesse instante o `localStorage` está
vazio, o header vira `Bearer null`, e nunca mais é atualizado, porque o topo do módulo não
executa de novo. O sintoma seria `401` em tudo, exceto depois de um F5. O interceptor
resolve isso por ler o token **no momento de cada requisição**.

**Por que `localStorage` e não uma variável em memória.** O `src/store/appStore.js`
guardava o token numa variável de módulo, que se perde a cada recarregamento da página —
apertar F5 deslogava o usuário. Com o `localStorage`, a sessão sobrevive. Esse arquivo
ficou sem uso e pode ser removido numa limpeza posterior.

**Timeout de 1000 para 5000 ms.** A primeira requisição após a API subir costuma passar de
um segundo, porque o pool de conexões do banco ainda está inicializando. O sintoma era um
erro de timeout apenas na primeira ação, difícil de diagnosticar.

### `src/api/controllers/users.api.js`

A função `authenticate` chamava uma rota que não existe no contrato:

```js
// antes
apiClient.get(`/users?login=${login}&password=${password}`)

// depois
apiClient.post('/auth/login', { login, password })
```

Três mudanças simultâneas:

- **`GET` → `POST`** — o login não é uma leitura; ele cria uma sessão no banco.
- **`/users` → `/auth/login`** — o contrato separa cadastro de autenticação.
- **Query string → corpo da requisição** — credenciais na URL apareceriam em texto puro
  no `access.log` do Nginx, que registra o caminho completo de cada requisição. É o mesmo
  motivo pelo qual o token viaja no header.

---

## 2. Substituição dos dados de exemplo

Oito telas liam de `src/mocks/controllers/control.js`. Em todas, a mudança seguiu o mesmo
padrão: trocar a função do mock pela de `products.api.js`, converter para `async/await`, e
remover o `import` do mock.

| Arquivo | Mock removido | Chamada real |
|---|---|---|
| `pages/auth/Login/login.jsx` | `authUser` | `authenticate` |
| `dashboard/features/prime/Home/home.jsx` | `getProducts` | `getAll` |
| `actions/views/Check/check.jsx` | `getProducts` | `getAll` |
| `actions/views/Add/add.jsx` | `getProducts` | `getAll` |
| `actions/views/Remove/remove.jsx` | `getProducts` | `getAll` |
| `actions/views/EditItem/edititem.jsx` | `getProduct` | `getById` |
| `actions/views/RemoveItem/removeitem.jsx` | `getProduct` | `getById` |
| `actions/views/Register/register.jsx` | `getLastId` | `lastId` |

Os arquivos em `src/mocks/` foram mantidos no repositório, mas não são mais importados por
nenhuma tela.

### Por que o `useEffect` recebeu uma função interna

O callback do `useEffect` não pode ser `async`: o React espera que ele devolva nada ou uma
função de limpeza, e toda função `async` devolve uma Promise, que o React interpretaria
como função de limpeza. O padrão adotado foi declarar uma função assíncrona dentro e
chamá-la em seguida:

```js
useEffect(() => {
    async function loadProducts() {
        try {
            const response = await getAll();
            setProducts(response.data);
        } catch (e) {
            alert("Erro ao carregar as informações dos produtos.");
            navigate("/");
        }
    }

    loadProducts();
}, [navigate]);
```

O `await` não é opcional aqui. Sem ele, o `try/catch` deixa de funcionar: uma Promise
rejeita depois que o bloco síncrono já terminou, então o `catch` nunca dispara e a falha
some sem nenhum aviso na tela.

### Diferença de formato entre mock e API

O mock devolvia o objeto diretamente; o axios devolve a resposta HTTP completa. Onde o
código fazia `setProduct(getProduct(id))`, passou a fazer:

```js
const response = await getById(id);
setProduct(response.data);
```

O `parseInt(id)` deixou de ser necessário — o `id` vai na URL e a API faz a conversão.

---

## 3. Correções de bugs

Três problemas que a troca dos mocks tornou visíveis ou que já estavam ativos.

### 3.1 — Exclusão sem `await` (`RemoveItem/removeitem.jsx`)

```js
// antes
function handlerDelete() {
    try {
        deleteById(product.id).then();
    } catch (e) {
        alert("Erro ao excluir o produto.");
    } finally {
        handlerExit();
    }
}
```

Três defeitos no mesmo bloco: a navegação do `finally` acontecia antes de a exclusão
terminar, então a tela seguinte podia listar um produto já apagado; o `catch` síncrono
nunca capturava a falha da Promise; e o `finally` saía da tela mesmo em caso de erro,
escondendo o problema do usuário.

```js
// depois
async function handlerDelete() {
    try {
        await deleteById(product.id);
        handlerExit();
    } catch (e) {
        alert("Erro ao excluir o produto.");
    }
}
```

### 3.2 — Mensagem de erro da API não chegava à tela (`Add/add.jsx`, `Remove/remove.jsx`)

```js
// antes
if (response.status !== 200) {              // código morto
    setError(`... ${response.data.message}`)
}
...
} catch (e) {
    setError(e)                             // guarda um objeto Error
}
```

O axios **lança exceção** para qualquer status 4xx ou 5xx, então a verificação
`status !== 200` nunca executava e o fluxo sempre caía no `catch`. Lá, `setError(e)`
guardava o objeto `Error` inteiro em vez do texto da mensagem.

```js
// depois
} catch (e) {
    setError(e.response?.data?.message ?? "Não foi possível concluir a operação.");
    setBoxVisible(true);
    return false;
}
```

A API devolve o corpo `{"message": "..."}` em todos os erros, acessível em
`e.response.data.message`. Isso importa diretamente para a regra de negócio central do
sistema: ao tentar remover mais unidades do que existem, a API responde `400` com
*"Quantidade insuficiente em estoque! Estoque atual: N"*. Sem esta correção, o usuário
não via o motivo da recusa.

### 3.3 — Modal chamado como função (`auth/SingUp/singup.jsx`)

A tela de cadastro importava `Modal` como componente, mas o invocava como função comum:

```js
Modal({ title: "...", text: "..." });   // não renderiza nada
```

Chamar um componente React diretamente apenas executa a função e descarta o retorno — o
React nunca fica sabendo que havia algo para montar. Nenhuma das mensagens de erro
aparecia, incluindo o `409` de login duplicado.

Passou a usar o contexto, mesmo padrão do `login.jsx`:

```js
const { openModal } = useModal();
...
openModal({ title: "...", text: "..." });
```

A mesma função também não tinha tratamento de erro nem redirecionamento após o sucesso.
Foi reescrita com `try/catch`, exibindo a mensagem da API em caso de falha e navegando
para a tela de login quando o cadastro conclui.

---

## 4. Variáveis de ambiente

O `src/config/env.js` valida `VITE_API_URL` com `z.url()` do Zod, o que tem duas
implicações: a URL precisa ser **absoluta** (um caminho relativo como `/api` é rejeitado),
e um valor inválido impede a aplicação de carregar.

### `.env.development`

```diff
- VITE_API_URL=http://endereco-da-api
+ VITE_API_URL=http://localhost/api
```

O valor anterior era um exemplo e quebrava o `npm run dev`.

### `.env.production` (novo)

```
VITE_API_URL=http://localhost/api
VITE_ENVIRONMENT=production
```

Este arquivo precisou ser criado porque **o `vite build` não lê o `.env.development`** —
ele roda em modo produção e carrega apenas `.env` e `.env.production`. Sem ele, a variável
ficava indefinida no build e a validação do Zod derrubava a aplicação.

> **Antes da entrega:** trocar para o IP da VM1, que serve o front e o proxy:
> `VITE_API_URL=http://192.168.122.11/api`

---

## O que não foi alterado

Verificado durante o trabalho e já em conformidade com o contrato:

- **`src/api/controllers/products.api.js`** — as dez funções, verbos e caminhos estão
  corretos, incluindo o `PATCH /products/{id}` com corpo `{op, quantity}`.
- **`register.jsx`** — ler `response.data.id` está correto: `GET /products/lastId` devolve
  o objeto `{"id": N}`, não um número solto.
- **`src/config/env.js`** — o typo `VITE_ENVIROMENT` relatado no planejamento já não
  existe; o arquivo lê o nome certo.

---

## Contrato da API

Referência das rotas consumidas pelo front:

| Método | Rota | Corpo | Sucesso | Erros |
|---|---|---|---|---|
| POST | `/api/auth/login` | `{login, password}` | `200 {token}` | `401` |
| POST | `/api/users` | `{name, login, password}` | `201` | `409` |
| GET | `/api/products` | — | `200 [{id,name,quantity,price}]` | |
| GET | `/api/products/{id}` | — | `200 {...}` | `404` |
| GET | `/api/products/lastId` | — | `200 {id}` | |
| POST | `/api/products` | `{name, quantity, price}` | `201` | `400` |
| PUT | `/api/products/{id}` | `{id,name,quantity,price}` | `200` | `404`, `400` |
| PATCH | `/api/products/{id}` | `{op, quantity}` | `200` | `404`, `400` |
| DELETE | `/api/products/{id}` | — | `204` | `404` |

Todas as rotas, exceto as duas primeiras, exigem `Authorization: Bearer <token>` e
respondem `401` sem um token válido. Todo erro devolve o corpo `{"message": "..."}`.

O `lastId` é uma **estimativa** do próximo id, usada apenas para exibição antes de salvar.
Quem decide o id real é o `AUTO_INCREMENT` do banco, no momento da inserção — se um produto
tiver sido excluído, o valor real virá diferente, e isso é esperado.

---

## Como testar

Com a API rodando e o Nginx configurado:

```bash
npm run build
sudo cp -r dist/* /var/www/armazem/
```

Acessar `http://localhost` e entrar com um usuário **real do banco** — as credenciais de
exemplo (`admin` / `1234`) não valem mais, já que o login passou a consultar a API.

Roteiro sugerido:

1. Login
2. Tela inicial — os produtos listados devem ser os do banco
3. Cadastrar um produto
4. Adicionar e remover quantidade
5. Editar e excluir
6. **Caminho de erro:** tentar remover mais unidades do que existem em estoque. A tela deve
   exibir a mensagem vinda da API com o total disponível — é o teste que valida a correção
   descrita em 3.2.
