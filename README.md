# Confeitaria Petit Rose
Projeto que simula o funcionamento do servico interno e gerenciamento de um restarurante/lanchonete.
Comecamos o desenvolvimento da ideia desse projeto na disciplina de Banco de Dados, onde estudados como seria o funcionamento das tabelas por tras do servico. Depois continuamos na disciplina de Engenharia de Software, onde usamos dos conhecimentos adquiridos para colocar em pratica o software.

Ferramentas Usadas:
Java, Postgres, SpringBoot, React

## Funcionalidades do Sistema:
Tudo comeca na tela de login, na qual sera filtrado entre um usuario admin ou um usuario normal.  Se nao for admin, seu user e senha dependem que o admin crie essas credenciais para voce. Suas funcionalidades sao, gerenciamento de catalogo, de pedidos alem de abrir e fechar comandas.
Se voce for um administrador, voce tem acesso a todas as funcionalidades de um usuario comum porem suas opcoes de ferramentas se expandem, tambem tendo funcionalidades como gerenciamento de estoque, de produtos, criacao de usuarios para demais funcionarios e relatorios com base no fluxo de caixa.

## Descricao das Telas
### Tela de Login e DashBoard
O controle de acesso ao sistema inicia-se por uma tela de **Login** segura, onde credenciais administrativas geradas automaticamente permitem ao administrador autenticar-se e gerenciar novos perfis de funcionários. Ao entrar, o usuário é direcionado ao **Dashboard** principal, um painel de controle que centraliza a saúde financeira da confeitaria ao exibir, em tempo real, indicadores de faturamento bruto, controle de despesas e lucro líquido, além de listar os últimos pedidos realizados e um ranking com os produtos mais vendidos. 
<img width="1465" height="933" alt="WhatsApp Image 2026-06-15 at 20 04 28" src="https://github.com/user-attachments/assets/1ba0035d-68a7-4292-aa39-7750f50e4065" />

### Gerenciamento de Comandas e Mesas
O fluxo do sistema inicia-se na tela de gerenciamento de mesas, que oferece uma visão clara e em tempo real do status de cada setor de atendimento. A regra de negócio estabelece uma relação de 1-para-Muitos ($1 \rightarrow N$): cada comanda deve obrigatoriamente estar associada a uma única mesa, enquanto uma mesa ativa pode comportar múltiplas comandas simultaneamente. Para garantir a consistência do fluxo, o atendimento deve ser iniciado com a "abertura" da mesa; a partir desse momento, o sistema habilita a criação e o vínculo de novas comandas para os clientes daquela mesa.
<img width="1335" height="799" alt="WhatsApp Image 2026-06-15 at 20 04 59" src="https://github.com/user-attachments/assets/aeb37f29-f26f-4fcf-8cf4-417d00bd38e3" />

### Catalogo
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

