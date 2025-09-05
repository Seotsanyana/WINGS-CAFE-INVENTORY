// Data structure
let products = JSON.parse(localStorage.getItem('wingsCafeProducts')) || [];

// DOM Elements
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-btn');
const productForm = document.getElementById('product-form');
const productModal = document.getElementById('product-modal');
const addProductBtn = document.getElementById('add-product-btn');
const closeModal = document.querySelector('.close');
const productsList = document.getElementById('products-list');

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    // Load navigation
    setupNavigation();

    // Load product form handling
    setupProductForm();

    // Load products table
    renderProducts();

    // Update dashboard
    updateDashboard();

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });
}

// Navigation
function setupNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.getAttribute('data-page');
            switchPage(pageId);

            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function switchPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Product Modal
addProductBtn.addEventListener('click', () => {
    openProductModal();
});

closeModal.addEventListener('click', closeProductModal);

function openProductModal(product = null) {
    document.getElementById('modal-title').textContent = product ? 'Edit Product' : 'Add Product';

    if (product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-quantity').value = product.quantity;
    } else {
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
    }

    productModal.style.display = 'block';
}

function closeProductModal() {
    productModal.style.display = 'none';
}

// Product Form Handling
function setupProductForm() {
    productForm.addEventListener('submit', handleProductSubmit);
}

function handleProductSubmit(e) {
    e.preventDefault();

    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);

    const productData = {
        id: productId || Date.now().toString(),
        name,
        description,
        category,
        price,
        quantity,
        lowStockThreshold: 10 // You can make this customizable later
    };

    if (productId) {
        // Update existing product
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = productData;
        }
    } else {
        // Add new product
        products.push(productData);
    }

    // Save to localStorage
    saveProducts();

    // Update UI
    renderProducts();
    updateDashboard();

    // Close modal and reset form
    closeProductModal();
    productForm.reset();
}

// Products Table
function renderProducts() {
    productsList.innerHTML = '';

    if (products.length === 0) {
        productsList.innerHTML = '<tr><td colspan="5" style="text-align: center;">No products found. Add your first product!</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');

        // Add low stock warning class if quantity is low
        const quantityClass = product.quantity <= product.lowStockThreshold ? 'low-stock' : '';

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td class="${quantityClass}">${product.quantity}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${product.id}">✏️</button>
                <button class="action-btn delete-btn" data-id="${product.id}">🗑️</button>
            </td>
        `;

        productsList.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-id');
            const product = products.find(p => p.id === productId);
            openProductModal(product);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this product?')) {
                deleteProduct(productId);
            }
        });
    });
}

function deleteProduct(productId) {
    products = products.filter(product => product.id !== productId);
    saveProducts();
    renderProducts();
    updateDashboard();
}

// Dashboard
function updateDashboard() {
    const totalProducts = products.length;
    const lowStockItems = products.filter(product => product.quantity <= product.lowStockThreshold).length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('low-stock-items').textContent = lowStockItems;
    document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
}

// Data persistence
function saveProducts() {
    localStorage.setItem('wingsCafeProducts', JSON.stringify(products));
}

// Export data function (for reporting)
function exportData() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'wings-cafe-data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Sample data for demonstration (you can remove this in production)
function addSampleData() {
    if (products.length === 0) {
        products = [
            {
                id: '1',
                name: 'Cappuccino',
                description: 'Classic Italian coffee drink',
                category: 'Beverages',
                price: 3.50,
                quantity: 25,
                lowStockThreshold: 10
            },
            {
                id: '2',
                name: 'Chocolate Cake',
                description: 'Rich chocolate cake slice',
                category: 'Desserts',
                price: 4.75,
                quantity: 8,
                lowStockThreshold: 10
            },
            {
                id: '3',
                name: 'Turkey Sandwich',
                description: 'Fresh turkey with veggies on whole wheat',
                category: 'Sandwiches',
                price: 7.25,
                quantity: 15,
                lowStockThreshold: 10
            }
        ];
        saveProducts();
        renderProducts();
        updateDashboard();
    }
}

// Uncomment the line below to add sample data automatically
// addSampleData();