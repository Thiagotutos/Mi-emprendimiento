class App {
    constructor() {
        this.cache = {};
        this.initNavigation();
    }

    initNavigation() {
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('data-target');
                this.navigate(target);
                
                // Update active class
                links.forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    navigate(viewId) {
        // Ocultar todas las vistas
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Mostrar vista objetivo
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            
            // Cargar datos según la vista
            if (viewId === 'catalogo') this.loadCatalogo();
            if (viewId === 'servicios') this.loadServicios();
        }
    }

    async fetchAPI(endpoint) {
        try {
            const res = await fetch(`/api/${endpoint}`);
            if (!res.ok) throw new Error('Network error');
            return await res.json();
        } catch (err) {
            console.error('Error fetching API API:', err);
            return null;
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(price);
    }

    createCard(item) {
        return `
            <div class="item-card">
                <h3>${item.nombre}</h3>
                ${item.descripcion ? `<p class="desc">${item.descripcion}</p>` : ''}
                ${item.stock ? `<p class="desc">Stock disponible: ${item.stock}</p>` : ''}
                <div class="price">${this.formatPrice(item.precio)}</div>
                <button class="btn-primary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">Me Interesa</button>
            </div>
        `;
    }

    async loadCatalogo() {
        if (this.cache.catalogo) return; // Ya cargado

        const data = await this.fetchAPI('catalogo');
        if (data) {
            const pcsGrid = document.getElementById('pcs-grid');
            const repuestosGrid = document.getElementById('repuestos-grid');

            pcsGrid.innerHTML = data.pcs.map(item => this.createCard(item)).join('');
            repuestosGrid.innerHTML = data.repuestos.map(item => this.createCard(item)).join('');
            
            this.cache.catalogo = true;
        }
    }

    async loadServicios() {
        if (this.cache.servicios) return;

        const data = await this.fetchAPI('servicios');
        if (data) {
            const grid = document.getElementById('servicios-grid');
            grid.innerHTML = data.map(item => this.createCard(item)).join('');
            this.cache.servicios = true;
        }
    }

    async verificarTurno() {
        const input = document.getElementById('turnoId').value.trim();
        const resultBox = document.getElementById('turno-result');

        if (!input) {
            alert('Por favor ingresa un código de turno.');
            return;
        }

        const data = await this.fetchAPI(`estado-turno/${input}`);
        resultBox.classList.remove('hidden');

        if (data && data.status === 'success') {
            const turno = data.data;
            resultBox.innerHTML = `
                <h3>Turno: ${turno.id}</h3>
                <p><strong>Cliente:</strong> ${turno.cliente}</p>
                <p><strong>Equipo:</strong> ${turno.equipo}</p>
                <p><strong>Motivo / Falla:</strong> ${turno.detalle}</p>
                <div class="status-badge">${turno.estado}</div>
            `;
        } else {
            resultBox.innerHTML = `
                <h3 style="color: #ff6b6b">No encontrado</h3>
                <p>No pudimos encontrar un turno con el código "${input}". Por favor verifica el número enviado.</p>
            `;
        }
    }
}

// Inicializar app cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
