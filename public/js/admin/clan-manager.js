class ClanManager {
    constructor() {
        this.clanData = null;
        this.currentEditField = null;
        this.init();
    }

    async init() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            await this.loadClanData(user.clan);
        }
        this.setupEventListeners();
    }

    async loadClanData(clanName) {
        try {
            // Dados simulados dos clãs
            const clansData = {
                'Uchiha': {
                    name: 'Clã Uchiha',
                    description: 'Um dos clãs mais poderosos de Konoha, conhecido pelo Sharingan',
                    specialties: {
                        genjutsu: 95,
                        ninjutsu: 90,
                        taijutsu: 85
                    },
                    kekkeiGenkai: 'Sharingan',
                    requirements: [
                        'Linhagem Uchiha',
                        'Potencial para despertar o Sharingan'
                    ]
                },
                'Uzumaki': {
                    name: 'Clã Uzumaki',
                    description: 'Um clã renomado por sua vitalidade extraordinária e habilidades em Fuinjutsu',
                    specialties: {
                        genjutsu: 70,
                        ninjutsu: 90,
                        taijutsu: 85
                    },
                    kekkeiGenkai: 'Correntes de Chakra',
                    requirements: [
                        'Linhagem Uzumaki',
                        'Afinidade com Fuinjutsu',
                        'Grande reserva de chakra'
                    ]
                }
            };

            this.clanData = clansData[clanName];
            this.renderClanInfo();
        } catch (error) {
            console.error('Erro ao carregar dados do clã:', error);
        }
    }

    renderClanInfo() {
        const details = document.getElementById('clanDetails');
        if (!details || !this.clanData) return;

        details.innerHTML = `
            <div class="clan-stat">
                <h4>Descrição</h4>
                <p class="editable" onclick="clanManager.showQuickEdit(this, 'description')">${this.clanData.description}</p>
            </div>
            
            <div class="clan-stat">
                <h4>Especialidades</h4>
                <div class="stat-bars">
                    <div class="stat-bar">
                        <label class="editable" onclick="clanManager.showQuickEdit(this, 'genjutsu')">
                            Genjutsu: ${this.clanData.specialties.genjutsu}%
                        </label>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${this.clanData.specialties.genjutsu}%"></div>
                        </div>
                    </div>
                    <div class="stat-bar">
                        <label class="editable" onclick="clanManager.showQuickEdit(this, 'ninjutsu')">
                            Ninjutsu: ${this.clanData.specialties.ninjutsu}%
                        </label>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${this.clanData.specialties.ninjutsu}%"></div>
                        </div>
                    </div>
                    <div class="stat-bar">
                        <label class="editable" onclick="clanManager.showQuickEdit(this, 'taijutsu')">
                            Taijutsu: ${this.clanData.specialties.taijutsu}%
                        </label>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${this.clanData.specialties.taijutsu}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="clan-stat">
                <h4>Kekkei Genkai</h4>
                <p class="editable" onclick="clanManager.showQuickEdit(this, 'kekkeiGenkai')">${this.clanData.kekkeiGenkai}</p>
            </div>
            
            <div class="clan-stat">
                <h4>Requisitos de Entrada</h4>
                <ul>
                    ${this.clanData.requirements.map((req, index) => `
                        <li class="editable" onclick="clanManager.showQuickEdit(this, 'requirement', ${index})">${req}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    showQuickEdit(element, field, index = null) {
        const popup = document.getElementById('quickEditPopup');
        const input = document.getElementById('quickEditField');
        
        // Posicionar o popup próximo ao elemento clicado
        const rect = element.getBoundingClientRect();
        popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;
        
        // Configurar o valor atual
        let currentValue = '';
        if (field === 'requirement') {
            currentValue = this.clanData.requirements[index];
        } else if (field.includes('jutsu')) {
            currentValue = this.clanData.specialties[field];
        } else {
            currentValue = this.clanData[field];
        }
        
        input.value = currentValue;
        
        // Configurar o tipo de input baseado no campo
        if (field.includes('jutsu')) {
            input.type = 'number';
        } else {
            input.type = 'text';
        }
        
        // Mostrar o popup
        popup.style.display = 'block';
    }

    setupEventListeners() {
        // Adicionar event listeners para os botões de edição
    }
} 