let allProducts = [];
let filteredProducts = [];
let categoryChart = null;
let stockChart = null;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async () => {
    // Charger les données des produits (utilisez sampleProducts en attendant une vraie API)
    allProducts = sampleProducts; // Utilise les données d'exemple du fichier ok.js
    
    // Pour tester avec un vrai fichier JSON (décommentez quand vous avez un fichier products.json)
    // allProducts = await loadProductsData();
    
    filteredProducts = [...allProducts];
    
    // Initialiser les éléments de l'interface
    initUI();
    
    // Afficher les produits et les statistiques
    updateUI();
    
    // Créer les graphiques
    createCharts();
});

// Initialiser les éléments de l'interface utilisateur
function initUI() {
    // Remplir la liste déroulante des catégories
    const categories = [...new Set(allProducts.map(product => product.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Ajouter des écouteurs d'événements
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
    
    // Ajouter des écouteurs d'événements pour le tri des colonnes du tableau
    document.querySelectorAll('#productTable th').forEach(header => {
        header.addEventListener('click', () => {
            const sortField = header.getAttribute('data-sort');
            sortProducts(sortField);
        });
    });
}

// Appliquer les filtres et mettre à jour l'UI
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value;
    const categoryValue = document.getElementById('categoryFilter').value;
    const sortValue = document.getElementById('sortBy').value;
    
    // Filtrer par nom
    let filtered = searchTerm 
        ? searchByName(allProducts, searchTerm)
        : [...allProducts];
    
    // Filtrer par catégorie si ce n'est pas "all"
    if (categoryValue !== 'all') {
        filtered = filterByCategory(filtered, categoryValue);
    }
    
    // Trier selon le critère sélectionné
    switch (sortValue) {
        case 'price':
            filtered = sortByPrice(filtered);
            break;
        case 'stock':
            filtered = sortByStock(filtered);
            break;
        case 'name':
            filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    filteredProducts = filtered;
    updateUI();
}

// Tri des produits par un champ spécifique
function sortProducts(field) {
    switch (field) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'category':
            filteredProducts.sort((a, b) => a.category.localeCompare(b.category));
            break;
        case 'stock':
            filteredProducts.sort((a, b) => a.stock - b.stock);
            break;
    }
    updateUI();
}

// Mettre à jour l'interface utilisateur
function updateUI() {
    // Mettre à jour le tableau des produits
    updateProductTable();
    
    // Mettre à jour les statistiques
    updateStatistics();
    
    // Mettre à jour les graphiques si ils existent
    if (categoryChart && stockChart) {
        updateCharts();
    }
}

// Mettre à jour le tableau des produits
function updateProductTable() {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const tr = document.createElement('tr');
        
        // Colorer en rouge les produits en faible stock
        if (product.stock < 5) {
            tr.classList.add('table-danger');
        }
        
        tr.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Mettre à jour les statistiques
function updateStatistics() {
    // Prix total
    const totalPrice = calculateTotalPrice(filteredProducts);
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    
    // Nombre de produits
    document.getElementById('productCount').textContent = filteredProducts.length;
    
    // Produits en faible stock
    const lowStockProducts = findLowStockProducts(filteredProducts);
    document.getElementById('lowStockCount').textContent = lowStockProducts.length;
    
    // Afficher l'alerte si nécessaire
    const lowStockAlert = document.getElementById('lowStockAlert');
    if (lowStockProducts.length > 0) {
        lowStockAlert.style.display = 'block';
    } else {
        lowStockAlert.style.display = 'none';
    }
}

// Créer les graphiques avec Chart.js
function createCharts() {
    createCategoryChart();
    createStockChart();
}

// Créer un graphique de répartition par catégorie
function createCategoryChart() {
    // Regrouper les produits par catégorie
    const categoryCounts = {};
    
    allProducts.forEach(product => {
        if (!categoryCounts[product.category]) {
            categoryCounts[product.category] = 0;
        }
        categoryCounts[product.category]++;
    });
    
    // Préparer les données pour Chart.js
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);
    const backgroundColors = generateRandomColors(labels.length);
    
    // Créer le graphique
    const ctx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Produits par catégorie',
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

// Créer un graphique pour visualiser le stock
function createStockChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    stockChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allProducts.map(p => p.name),
            datasets: [{
                label: 'Niveau de stock',
                data: allProducts.map(p => p.stock),
                backgroundColor: allProducts.map(p => p.stock < 5 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)'),
                borderColor: allProducts.map(p => p.stock < 5 ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)'),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Mettre à jour les graphiques
function updateCharts() {
    // Mise à jour du graphique de stock pour refléter les produits filtrés
    stockChart.data.labels = filteredProducts.map(p => p.name);
    stockChart.data.datasets[0].data = filteredProducts.map(p => p.stock);
    stockChart.data.datasets[0].backgroundColor = filteredProducts.map(p => 
        p.stock < 5 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)'
    );
    stockChart.data.datasets[0].borderColor = filteredProducts.map(p => 
        p.stock < 5 ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)'
    );
    stockChart.update();
    
    // Le graphique par catégorie reste le même (pas besoin de mise à jour)
}

// Fonction utilitaire pour générer des couleurs aléatoires
function generateRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = (i * 137) % 360; // Distribution uniforme des teintes
        colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
}
