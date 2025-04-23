# **Biblioteca Virtual \- Leiturinha**

## **Descrição do Projeto**

O projeto "Biblioteca Virtual" é uma aplicação web desenvolvida como um "Letterbox" para livros e outras formas de mídia, como filmes. Ele permite aos usuários descobrir, revisar e interagir com um catálogo de itens, com funcionalidades de avaliação, criação de listas de favoritos e acompanhamento de outros usuários.

## **Funcionalidades Principais**

* **Navegação e Descoberta:**  
  * Página inicial com destaques de itens populares e reviews recentes.  
  * Busca de itens (livros, filmes) com filtragem por título, autor e gênero.  
  * Página de detalhes do item, incluindo descrição, informações de disponibilidade e reviews.  
  * Listagem de itens semelhantes.  
* **Interação do Usuário:**  
  * Sistema de avaliação de itens com estrelas.  
  * Criação e gerenciamento de reviews, incluindo likes.  
  * Listas de favoritos para salvar itens.  
  * Perfis de usuário com informações e estatísticas.  
  * Sistema de seguidores para acompanhar as atividades de outros usuários.  
  * Notificações para informar sobre novas reviews de usuários seguidos.  
* **Recursos Adicionais:**  
  * Links para ler online ou baixar itens, quando disponíveis.  
  * Design responsivo com sidebar para navegação em dispositivos móveis.  
  * Popup de informações do usuário.

## **Ferramentas e Tecnologias Utilizadas**

* **Frontend:**  
  * React  
  * Styled Components  
  * React Router  
  * HTML5  
  * CSS3  
  * JavaScript (ES6+)  
* **APIs:**  
  * Google Books API (para buscar informações sobre livros)  
* **Outros**  
  * Tailwind

## **Participantes**

* Cassiano Socorro  
* Daniel  
* Caio Braga  
* Luiz Felipe  
* João Luiz  
* Arthur Varizi

## **Estrutura do Projeto**

O projeto é estruturado em componentes React, incluindo:

* App: Componente principal que configura a aplicação, o roteamento e o estado global.  
* HomePage: Exibe a página inicial com itens populares e reviews recentes.  
* DetailsPage: Mostra os detalhes de um item específico.  
* ProfilePage: Exibe o perfil de um usuário.  
* FavoritesPage: Exibe os itens favoritados pelo usuário.  
* ReviewCard: Componente para exibir uma review de um item.  
* ItemCard: Componente para exibir um card de item.  
* Sidebar: Componente para a barra de navegação lateral.  
* UserInfoPopup: Componente para exibir informações detalhadas do usuário.  
* NotificationItem: Componente para exibir uma notificação.  
* UserSearchResultCard: Componente para exibir resultados da pesquisa de usuários.  
* ItemSearchResult: Componente para exibir resultados da pesquisa de itens.

## **Observações**

* O projeto utiliza o Google Books API para buscar informações sobre livros, o que enriquece o catálogo de itens disponíveis na plataforma.  
* A aplicação implementa um sistema de notificações para manter os usuários informados sobre novas reviews de usuários que eles seguem.  
* O design é responsivo, garantindo uma boa experiência em diferentes dispositivos.  
* O projeto inclui funcionalidades como avaliação de itens, criação de listas de favoritos e perfis de usuário, promovendo a interação e o engajamento da comunidade.
