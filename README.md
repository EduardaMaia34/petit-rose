# Confeitaria Petit Rose
O **Petit Rose** é um sistema completo desenvolvido para simular o funcionamento interno e o gerenciamento de uma confeitaria.

Iniciamos o desenvolvimento da idealização deste projeto na disciplina de Banco de Dados, onde estudamos e modelamos as tabelas e relações por trás do serviço. Posteriormente, evoluímos o sistema na disciplina de Engenharia de Software, utilizando os conhecimentos adquiridos para colocar o software em prática.

## Ferramentas Utilizadas

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/springboot-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

## Funcionalidades do Sistema:
O sistema baseia-se em níveis de acesso para garantir a segurança e a organização do fluxo de trabalho:

*   **Usuário Comum (Funcionário):** Necessita que um administrador crie suas credenciais. Tem acesso ao gerenciamento de catálogo, registro de pedidos e controle de abertura/fechamento de comandas.
*   **Administrador:** Possui acesso total às ferramentas do sistema. Além das funções operacionais, pode gerenciar o estoque, os produtos, criar novos usuários (funcionários) e visualizar relatórios detalhados com base no fluxo de caixa.

## Descricao das Telas
### Tela de Login e Dashboard
O controle de acesso ao sistema inicia-se por uma tela de **Login** segura, onde credenciais administrativas geradas automaticamente permitem ao administrador autenticar-se e gerenciar novos perfis de funcionários. Ao entrar, o usuário é direcionado ao **Dashboard** principal, um painel de controle que centraliza a saúde financeira da confeitaria ao exibir, em tempo real, indicadores de faturamento bruto, controle de despesas e lucro líquido, além de listar os últimos pedidos realizados e um ranking com os produtos mais vendidos.
<img width="1465" alt="Dashboard" src="https://github.com/user-attachments/assets/1ba0035d-68a7-4292-aa39-7750f50e4065" />

### Gerenciamento de Comandas e Mesas
O fluxo do sistema inicia-se na tela de gerenciamento de mesas, que oferece uma visão clara e em tempo real do status de cada setor de atendimento. A regra de negócio estabelece uma relação de `1:N` (1 para Muitos): cada comanda deve obrigatoriamente estar associada a uma única mesa, enquanto uma mesa ativa pode comportar múltiplas comandas simultaneamente. Para garantir a consistência do fluxo, o atendimento deve ser iniciado com a "abertura" da mesa; a partir desse momento, o sistema habilita a criação e o vínculo de novas comandas para os clientes daquela mesa.
<img width="1335" alt="Mesas" src="https://github.com/user-attachments/assets/aeb37f29-f26f-4fcf-8cf4-417d00bd38e3" />

### Catálogo
<img width="1345" height="944" alt="WhatsApp Image 2026-06-15 at 20 04 40" src="https://github.com/user-attachments/assets/5742a2f9-5ab1-4c6b-b1d4-5e806dd11621" />

### Gerenciamento de Pedidos
<img width="1321" height="941" alt="WhatsApp Image 2026-06-15 at 20 04 51" src="https://github.com/user-attachments/assets/095dde0f-52ac-4d7b-94b2-77001a98b880" />

### Gerenciamento de Produtos
<img width="1281" height="933" alt="WhatsApp Image 2026-06-15 at 20 05 10" src="https://github.com/user-attachments/assets/d075d975-bf3f-42d9-8800-075452115d9b" />

### Gerenciamento de Estoque
<img width="1350" height="751" alt="WhatsApp Image 2026-06-15 at 20 05 36" src="https://github.com/user-attachments/assets/d7655233-9b16-48ab-bc32-8cae1ccea263" />

### Relatorios
<img width="1333" height="860" alt="WhatsApp Image 2026-06-15 at 20 05 50" src="https://github.com/user-attachments/assets/e9c49ac7-a183-4670-9829-f2f54f145c13" />

### Gerenciar login de outros usuarios
<img width="1340" height="685" alt="WhatsApp Image 2026-06-15 at 20 05 25" src="https://github.com/user-attachments/assets/09058c64-7c45-494e-80f8-0595050efa6f" />

## Como Executar o Projeto

**Pré-requisitos:**
*   Java 17+
*   Node.js
*   PostgreSQL (ou Docker para rodar o banco de dados)
*   Maven

**Passo a passo:**
1. Clone o repositório: `git clone https://github.com/EduardaMaia34/petit-rose.git`
2. **Backend:** Navegue até a pasta do backend, configure o `application.properties` com as suas credenciais do Postgres e inicie com o Maven.
3. **Frontend:** Navegue até a pasta do frontend, instale as dependências com `npm install` e rode o servidor com `npm run dev`.

---

## Equipe de Desenvolvimento
* Eduarda Maia 
* Karen Gomes 
*   Mariana Goes
*   Gustavo Marreira
