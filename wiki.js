document.addEventListener('DOMContentLoaded', () => {
    // Navegação entre abas da wiki
    const tabs = document.querySelectorAll('.wiki-tab');
    const sections = document.querySelectorAll('.wiki-section');

    // Função para trocar de aba
    function switchTab(tabId) {
        // Remove classes ativas de todas as abas e seções
        tabs.forEach(tab => tab.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        // Adiciona classe ativa na aba selecionada
        const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedSection = document.getElementById(tabId);
        
        if (selectedTab && selectedSection) {
            selectedTab.classList.add('active');
            selectedSection.classList.add('active');
        }
    }

    // Adiciona evento de clique em cada aba
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // Menu mobile (reutilizando a lógica do menu principal)
    const menuBtn = document.querySelector('.menu-mobile-btn');
    const navMenu = document.querySelector('.navmenu');

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });

    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.nav-item a, .btn1').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuBtn.textContent = '☰';
        });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            menuBtn.textContent = '☰';
        }
    });

    // Animação das barras de estatísticas dos clãs
    const statBars = document.querySelectorAll('.stat-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width;
            }
        });
    }, { threshold: 0.5 });

    statBars.forEach(bar => {
        observer.observe(bar);
    });

    // Adiciona funcionalidade aos botões de detalhes dos clãs
    const clanDetailsBtns = document.querySelectorAll('.clan-details-btn');
    
    clanDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const clanCard = btn.closest('.clan-card');
            const clanName = clanCard.querySelector('h3').textContent;
            
            // Aqui você pode implementar um modal ou redirecionamento
            // para a página detalhada do clã
            showClanDetails(clanName);
        });
    });

    // Função para carregar os dados do JSON
    async function loadData() {
        try {
            const response = await fetch('/data.json');
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return null;
        }
    }

    async function initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        const suggestionsContainer = document.getElementById('searchSuggestions');
        let selectedSuggestionIndex = -1;
        let wikiData = await loadData();

        function showSuggestions(suggestions) {
            suggestionsContainer.innerHTML = '';
            
            if (suggestions.length === 0) {
                suggestionsContainer.style.display = 'none';
                return;
            }

            suggestions.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                
                // Ícone baseado na categoria
                const icon = getCategoryIcon(item.category);
                
                div.innerHTML = `
                    <div class="suggestion-content">
                        <span class="suggestion-icon">${icon}</span>
                        <div class="suggestion-text">
                            <strong>${item.name}</strong>
                            <span class="suggestion-description">${item.description}</span>
                        </div>
                        <span class="suggestion-category">${item.category}</span>
                    </div>
                `;
                
                div.addEventListener('click', () => {
                    searchInput.value = item.name;
                    suggestionsContainer.style.display = 'none';
                    navigateToItem(item);
                });
                
                suggestionsContainer.appendChild(div);
            });
            
            suggestionsContainer.style.display = 'block';
        }

        function getCategoryIcon(category) {
            const icons = {
                clans: '👥',
                jutsu: '⚡',
                villages: '🏯'
            };
            return icons[category] || '❔';
        }

        function navigateToItem(item) {
            // Troca para a aba correta
            const tab = document.querySelector(`[data-tab="${item.category}"]`);
            if (tab) {
                tab.click();
            }

            // Encontra e destaca o elemento
            setTimeout(() => {
                const element = document.querySelector(`[data-name="${item.name}"]`);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    element.classList.add('highlight');
                    setTimeout(() => element.classList.remove('highlight'), 2000);
                }
            }, 500);
        }

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length < 2) {
                suggestionsContainer.style.display = 'none';
                return;
            }
            
            const suggestions = filterResults(query);
            showSuggestions(suggestions);
            selectedSuggestionIndex = -1;
        });

        // Navegação pelo teclado
        searchInput.addEventListener('keydown', (e) => {
            const suggestions = suggestionsContainer.children;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
                    updateSelection();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, 0);
                    updateSelection();
                    break;
                case 'Enter':
                    if (selectedSuggestionIndex >= 0) {
                        suggestions[selectedSuggestionIndex].click();
                    }
                    break;
                case 'Escape':
                    suggestionsContainer.style.display = 'none';
                    selectedSuggestionIndex = -1;
                    break;
            }
        });

        function updateSelection() {
            const suggestions = suggestionsContainer.children;
            for (let i = 0; i < suggestions.length; i++) {
                suggestions[i].classList.toggle('selected', i === selectedSuggestionIndex);
            }
        }

        // Fecha as sugestões ao clicar fora
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
                selectedSuggestionIndex = -1;
            }
        });
    }

    initializeSearch();
});

// Função para mostrar detalhes do clã (exemplo com modal)
function showClanDetails(clanName) {
    // Cria o modal
    const modal = document.createElement('div');
    modal.className = 'clan-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${clanName}</h2>
            <div class="clan-details">
                <h3>História</h3>
                <p>História detalhada do clã ${clanName}...</p>
                
                <h3>Habilidades Especiais</h3>
                <ul>
                    <li>Habilidade 1</li>
                    <li>Habilidade 2</li>
                    <li>Habilidade 3</li>
                </ul>
                
                <h3>Membros Notáveis</h3>
                <ul>
                    <li>Membro 1</li>
                    <li>Membro 2</li>
                    <li>Membro 3</li>
                </ul>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Fecha o modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Fecha o modal ao clicar fora dele
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
} 