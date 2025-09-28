

document.addEventListener('DOMContentLoaded', function() {
    // 1. Manejo del Formulario de Contacto 
    const formContacto = document.getElementById('formContacto');
    if (formContacto) {
        formContacto.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            
            if (nombre && email && mensaje) {
               
                alert(`¡Gracias, ${nombre}! Tu mensaje ha sido enviado a contacto@techshop.cr. Te responderemos pronto.`);
                formContacto.reset(); 
            } else {
                alert('Por favor, completa todos los campos correctamente.');
            }
        });
    }

    // 2. Inicializar Carousel de Testimonios 
    const carousel = document.getElementById('carouselTestimonios');
    if (carousel) {
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000, 
            wrap: true, 
            touch: true 
        });
    }

    // 3. Integración API FakeStore 
    if (window.location.pathname.includes('productos.html')) {
        initProductos();
    }
});

// Función principal para cargar productos (async para fetch)
async function initProductos() {
    const loading = document.getElementById('loading');
    const tabsContainer = document.getElementById('tabsCategorias');
    const contenido = document.getElementById('contenidoProductos');
    const errorMsg = document.getElementById('errorMsg');

    try {
        //  Cargar categorías de la API
        const categoriasRes = await fetch('https://fakestoreapi.com/products/categories');
        const categorias = await categoriasRes.json(); 

        if (!categorias || categorias.length === 0) {
            throw new Error('No se pudieron cargar las categorías');
        }

        // Generar tabs dinámicamente
        let tabsHtml = '';
        categorias.forEach((cat, index) => {
            const activeClass = index === 0 ? ' active' : ''; 
            tabsHtml += `
                <li class="nav-item" role="presentation">
                    <button class="nav-link${activeClass}" id="tab-${cat}" data-bs-toggle="tab" data-bs-target="#${cat}" type="button" role="tab">
                        ${capitalizar(cat.replace("'", ''))} <!-- Ej: Electronics -->
                    </button>
                </li>
            `;
        });
        tabsContainer.innerHTML = tabsHtml;

        // Cargar productos de la primera categoría por default
        await cargarProductosPorCategoria(categorias[0], contenido);

        //  Event listeners para tabs (al clic, carga categoría)
        tabsContainer.addEventListener('click', async function(e) {
            if (e.target.matches('.nav-link')) {
                const categoria = e.target.id.replace('tab-', '');
                await cargarProductosPorCategoria(categoria, contenido);
            }
        });

        // Ocultar loading
        loading.style.display = 'none';

    } catch (error) {
        console.error('Error en API:', error);
        loading.style.display = 'none';
        errorMsg.style.display = 'block';
    }
}

// Función para cargar productos de una categoría específica
async function cargarProductosPorCategoria(categoria, container) {
    try {
        // Usa endpoint por categoría (ej. /products/category/electronics)
        const url = `https://fakestoreapi.com/products/category/${categoria}`;
        const res = await fetch(url);
        const productos = await res.json(); // Array de productos

        if (!productos || productos.length === 0) {
            container.innerHTML = '<p class="text-center">No hay productos en esta categoría.</p>';
            return;
        }

        // Generar cards HTML dinámicamente
        let html = '';
        productos.forEach(producto => {
            html += `
                <div class="tab-pane fade show active" id="${categoria}" role="tabpanel">
                    <div class="row">
                        ${productos.map(p => generarCardProducto(p)).join('')} <!-- Map para todas las cards -->
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;

    } catch (error) {
        console.error('Error cargando productos:', error);
        container.innerHTML = '<p class="text-center text-danger">Error al cargar productos de esta categoría.</p>';
    }
}

// Función helper: Genera una card para un producto
function generarCardProducto(producto) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card card-producto h-100">
                <img src="${producto.image}" class="card-img-top" alt="${producto.title}" loading="lazy">
                <div class="card-body">
                    <h5 class="card-title">${producto.title.substring(0, 50)}...</h5> <!-- Título corto -->
                    <p class="card-text">${producto.description.substring(0, 100)}...</p> <!-- Descripción corta -->
                    <p class="precio">$${producto.price.toFixed(2)}</p>
                    <span class="badge bg-secondary">${capitalizar(producto.category)}</span>
                    <button class="btn btn-primary mt-2" onclick="verDetalles(${producto.id})">Ver Detalles</button>
                </div>
            </div>
        </div>
    `;
}

// Función para ver detalles de un producto (modal simple con fetch por ID)
async function verDetalles(id) {
    try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const producto = await res.json();
        
        // Muestra alert simple (puedes cambiar a modal Bootstrap)
        alert(`Detalles del producto ID ${id}:\nTítulo: ${producto.title}\nPrecio: $${producto.price}\nDescripción: ${producto.description}\nRating: ${producto.rating.rate} (${producto.rating.count} reseñas)`);
    } catch (error) {
        alert('Error al cargar detalles del producto.');
    }
}

// Helper
function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace("'", '');
}

// footer

document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

