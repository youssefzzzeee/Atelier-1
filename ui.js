let allProducts = [];
let filteredProducts = [];
let categoryChart = null;
let stockChart = null;

document.addEventListener('DOMContentLoaded', async () => {
    allProducts = sampleProducts;
    
    filteredProducts = [...allProducts];
    
    initUI();
    
    updateUI();
    
    createCharts();
});

function initUI() {
    const categories = [...new Set(allProducts.map(product => product.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
    
    document.querySelectorAll('#productTable th').forEach(header => {
        header.addEventListener('click', () => {
            const sortField = header.getAttribute('data-sort');
            sortProducts(sortField);
        });
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value;
    const categoryValue = document.getElementById('categoryFilter').value;
    const sortValue = document.getElementById('sortBy').value;
    
    let filtered = searchTerm 
        ? searchByName(allProducts, searchTerm)
        : [...allProducts];
    
    if (categoryValue !== 'all') {
        filtered = filterByCategory(filtered, categoryValue);
    }
    
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

function updateUI() {
    updateProductTable();
    
    updateStatistics();
    
    if (categoryChart && stockChart) {
        updateCharts();
    }
}

function updateProductTable() {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const tr = document.createElement('tr');
        
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

function updateStatistics() {
    const totalPrice = calculateTotalPrice(filteredProducts);
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    
    document.getElementById('productCount').textContent = filteredProducts.length;
    
    const lowStockProducts = findLowStockProducts(filteredProducts);
    document.getElementById('lowStockCount').textContent = lowStockProducts.length;
    
    const lowStockAlert = document.getElementById('lowStockAlert');
    if (lowStockProducts.length > 0) {
        lowStockAlert.style.display = 'block';
    } else {
        lowStockAlert.style.display = 'none';
    }
}

function createCharts() {
    createCategoryChart();
    createStockChart();
}

function createCategoryChart() {
    const categoryCounts = {};
    
    allProducts.forEach(product => {
        if (!categoryCounts[product.category]) {
            categoryCounts[product.category] = 0;
        }
        categoryCounts[product.category]++;
    });
    
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);
    const backgroundColors = generateRandomColors(labels.length);
    
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

function updateCharts() {
    stockChart.data.labels = filteredProducts.map(p => p.name);
    stockChart.data.datasets[0].data = filteredProducts.map(p => p.stock);
    stockChart.data.datasets[0].backgroundColor = filteredProducts.map(p => 
        p.stock < 5 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)'
    );
    stockChart.data.datasets[0].borderColor = filteredProducts.map(p => 
        p.stock < 5 ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)'
    );
    stockChart.update();
}

function generateRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = (i * 137) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
}
