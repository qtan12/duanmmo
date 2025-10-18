// Products Page Alpine.js Component - HTML Static Version
document.addEventListener('alpine:init', () => {
    Alpine.data('productsPage', () => ({
        // Filter states
        selectedCategory: 'all',
        selectedPrice: '',
        selectedRating: '',
        selectedSort: 'popular',
        filterOpen: false,
        
        // Search
        searchQuery: '',
        
        // Filtered products count
        filteredProducts: [],
        
        // Load more functionality
        productsPerPage: 6,
        currentPage: 1,
        totalPages: 1,
        hasMoreProducts: false,
        
        init() {
            this.setupEventListeners();
            this.calculateTotalPages();
            this.applyFilters();
        },
        
        setupEventListeners() {
            // Listen for search input changes
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.searchQuery = e.target.value;
                    this.applyFilters();
                });
            }
        },
        
        // Check if a product should be visible based on current filters
        isProductVisible(category, price, rating, name, seller) {
            // Category filter
            if (this.selectedCategory !== 'all' && category !== this.selectedCategory) {
                return false;
            }
            
            // Price filter
            if (this.selectedPrice) {
                const [min, max] = this.selectedPrice.split('-').map(Number);
                if (max) {
                    if (price < min || price > max) return false;
                } else {
                    if (price < min) return false;
                }
            }
            
            // Rating filter
            if (this.selectedRating) {
                const minRating = Number(this.selectedRating);
                if (rating < minRating) return false;
            }
            
            // Search filter
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase();
                if (!name.toLowerCase().includes(query) && 
                    !seller.toLowerCase().includes(query)) {
                    return false;
                }
            }
            
            return true;
        },
        
        applyFilters() {
            // Get all product items
            const productItems = document.querySelectorAll('.product-item');
            let visibleCount = 0;
            
            productItems.forEach(item => {
                const category = item.dataset.category;
                const price = parseInt(item.dataset.price);
                const rating = parseFloat(item.dataset.rating);
                const name = item.dataset.name;
                const seller = item.dataset.seller;
                
                if (this.isProductVisible(category, price, rating, name, seller)) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Update filtered products count
            this.filteredProducts = Array.from(productItems).filter(item => 
                item.style.display !== 'none'
            );
            
            // Apply sorting to visible products
            this.sortVisibleProducts();
            
            // Reset pagination and calculate new total pages
            this.currentPage = 1;
            this.calculateTotalPages();
            this.updateProductVisibility();
        },
        
        sortVisibleProducts() {
            const productItems = Array.from(document.querySelectorAll('.product-item'))
                .filter(item => item.style.display !== 'none');
            
            // Sort based on selected sort option
            productItems.sort((a, b) => {
                switch (this.selectedSort) {
                    case 'price-low':
                        return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                    case 'price-high':
                        return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                    case 'newest':
                        return parseInt(b.dataset.id || 0) - parseInt(a.dataset.id || 0);
                    case 'rating':
                        return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                    case 'popular':
                    default:
                        return parseInt(b.dataset.sold) - parseInt(a.dataset.sold);
                }
            });
            
            // Re-append sorted products to maintain order
            const container = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3');
            if (container) {
                productItems.forEach(item => {
                    container.appendChild(item);
                });
            }
        },
        
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price);
        },
        
        handleImageError(event) {
            // Fallback image when product image fails to load
            event.target.src = '/assets/images/placeholder-product.jpg';
        },
        
        addProductToCart(product) {
            // Check if cart manager is available
            if (window.cartManager) {
                window.cartManager.addToCart(product);
                
                // Show success notification
                if (window.fastNotice) {
                    window.fastNotice.show({
                        type: 'success',
                        message: `Đã thêm "${product.name}" vào giỏ hàng`,
                        duration: 2000
                    });
                }
            } else {
                console.error('Cart manager not available');
            }
        },
        
        resetFilters() {
            this.selectedCategory = 'all';
            this.selectedPrice = '';
            this.selectedRating = '';
            this.selectedSort = 'popular';
            this.searchQuery = '';
            this.filterOpen = false;
            
            // Clear search input if exists
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.value = '';
            }
            
            this.resetLoadMore();
            this.applyFilters();
        },
        
        getFilterCount() {
            let count = 0;
            if (this.selectedCategory !== 'all') count++;
            if (this.selectedPrice) count++;
            if (this.selectedRating) count++;
            if (this.searchQuery.trim()) count++;
            return count;
        },
        
        // Load more functionality
        calculateTotalPages() {
            const visibleProducts = this.filteredProducts.length;
            this.totalPages = Math.ceil(visibleProducts / this.productsPerPage);
            this.hasMoreProducts = this.currentPage < this.totalPages;
        },
        
        updateProductVisibility() {
            const visibleProducts = this.filteredProducts;
            const startIndex = 0;
            const endIndex = this.currentPage * this.productsPerPage;
            
            visibleProducts.forEach((item, index) => {
                if (index >= startIndex && index < endIndex) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            this.hasMoreProducts = endIndex < visibleProducts.length;
        },
        
        loadMoreProducts() {
            if (this.hasMoreProducts) {
                this.currentPage++;
                this.updateProductVisibility();
            }
        },
        
        resetLoadMore() {
            this.currentPage = 1;
            this.calculateTotalPages();
            this.updateProductVisibility();
        }
    }));
});
