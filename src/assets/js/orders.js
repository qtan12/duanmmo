/**
 * Orders Manager Component
 * Quản lý state và logic cho trang đơn hàng
 * 
 * Component này được sử dụng bởi Alpine.js để:
 * - Quản lý trạng thái (state) của trang đơn hàng
 * - Xử lý các tương tác của user (click, search, filter)
 * - Tự động cập nhật UI khi dữ liệu thay đổi
 */

function ordersManager() {
    return {
        // ============================================
        // PHẦN 1: STATE (Trạng thái của component)
        // ============================================
        
        // Loại đơn hàng: 'purchase' = đơn mua, 'sale' = đơn bán
        orderType: 'purchase',
        
        // Bộ lọc trạng thái đơn hàng
        // Giá trị có thể là: 'all', 'pending', 'processing', 'processed', 'completed', 'dispute', 'cancelled'
        statusFilter: 'all',
        
        // Từ khóa tìm kiếm (user nhập vào ô search)
        searchQuery: '',
        
        // Hiển thị/ẩn bộ lọc nâng cao
        showFilter: false,
        
        // Trạng thái đang tải dữ liệu (hiển thị loading spinner)
        isLoading: false,
        
        // Load More Pagination State
        isLoadingMore: false,
        currentPage: 1,
        perPage: 10,
        totalOrders: 0,
        hasMore: true,
        useSimulatedData: true, // Toggle between simulated and real API

        // ============================================
        // PHẦN 2: DATA (Dữ liệu)
        // ============================================
        
        // Danh sách tất cả đơn hàng (dùng cho simulated mode)
        allOrders: [],
        
        // Danh sách đơn hàng đang hiển thị (có thể là filtered hoặc paginated)
        displayedOrders: [],

        // Thống kê số lượng đơn hàng theo từng trạng thái
        // Dùng để hiển thị số lượng trên các nút filter
        stats: {
            total: 45,
            pending: 8,
            processing: 12,
            processed: 15,
            completed: 7,
            dispute: 2,
            cancelled: 1
        },

        // ============================================
        // PHẦN 3: WATCHERS (Theo dõi thay đổi)
        // ============================================

        // ============================================
        // PHẦN 4: LIFECYCLE METHODS (Các hàm khởi tạo)
        // ============================================
        
        /**
         * Hàm init() được Alpine.js tự động gọi khi component được khởi tạo
         * Sử dụng để:
         * - Load dữ liệu ban đầu
         * - Khởi tạo các thư viện bên ngoài (Lucide icons)
         * - Setup watchers
         */
        async init() {
            console.log('Orders Manager Initialized');
            
            // Load danh sách đơn hàng từ API
            await this.loadOrders();
            
            // Watch for filter changes and reload
            this.$watch('orderType', () => this.handleFilterChange());
            this.$watch('statusFilter', () => this.handleFilterChange());
            
            // Khởi tạo Lucide icons sau khi Alpine.js render xong
            // $nextTick đảm bảo DOM đã được cập nhật
            this.$nextTick(() => {
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
        },
        
        /**
         * Xử lý khi filter thay đổi - reset và load lại
         */
        handleFilterChange() {
            this.currentPage = 1;
            this.displayedOrders = [];
            this.hasMore = true;
            this.loadOrders();
        },

        // ============================================
        // PHẦN 5: API METHODS (Các hàm gọi API)
        // ============================================
        
        /**
         * Load danh sách đơn hàng từ server (page đầu tiên)
         */
        async loadOrders() {
            this.isLoading = true;
            this.currentPage = 1;
            
            try {
                if (this.useSimulatedData) {
                    await this.fetchOrdersSimulated(1);
                } else {
                    await this.fetchOrdersFromAPI(1);
                }
            } catch (error) {
                console.error('Error loading orders:', error);
                this.showNotification('Không thể tải danh sách đơn hàng', 'error');
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Fetch orders từ API thực với pagination
         */
        async fetchOrdersFromAPI(page) {
            try {
                const params = new URLSearchParams({
                    page: page,
                    per_page: this.perPage,
                    type: this.orderType,
                    status: this.statusFilter !== 'all' ? this.statusFilter : '',
                    search: this.searchQuery
                });

                const response = await fetch(`${API_URL}orders?${params}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                
                // Expected API response format:
                // {
                //     data: [...orders],
                //     meta: {
                //         current_page: 1,
                //         total: 45,
                //         per_page: 10,
                //         last_page: 5,
                //         has_more: true
                //     },
                //     stats: {...}
                // }

                if (page === 1) {
                    this.displayedOrders = data.data;
                } else {
                    this.displayedOrders = [...this.displayedOrders, ...data.data];
                }

                this.totalOrders = data.meta.total;
                this.currentPage = data.meta.current_page;
                this.hasMore = data.meta.has_more || (this.currentPage < data.meta.last_page);
                
                if (data.stats) {
                    this.stats = data.stats;
                }

                // Render icons
                this.$nextTick(() => {
                    if (window.lucide) {
                        window.lucide.createIcons();
                    }
                });

                return data;
            } catch (error) {
                console.error('API fetch error:', error);
                throw error;
            }
        },

        /**
         * Simulated API response (cho demo/development)
         */
        async fetchOrdersSimulated(page) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Generate mock data nếu chưa có
            if (this.allOrders.length === 0) {
                this.generateMockOrders();
            }

            // Filter theo orderType và statusFilter
            let filtered = this.allOrders.filter(order => order.type === this.orderType);
            
            if (this.statusFilter !== 'all') {
                filtered = filtered.filter(order => order.status === this.statusFilter);
            }

            // Filter theo search
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(order => 
                    order.code.toLowerCase().includes(query) ||
                    order.productName.toLowerCase().includes(query)
                );
            }

            // Pagination
            const startIndex = (page - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            const pageOrders = filtered.slice(startIndex, endIndex);
            const lastPage = Math.ceil(filtered.length / this.perPage);

            // Simulate API response
            const mockResponse = {
                data: pageOrders,
                meta: {
                    current_page: page,
                    total: filtered.length,
                    per_page: this.perPage,
                    last_page: lastPage,
                    has_more: page < lastPage
                }
            };

            // Update state
            if (page === 1) {
                this.displayedOrders = mockResponse.data;
            } else {
                this.displayedOrders = [...this.displayedOrders, ...mockResponse.data];
            }

            this.totalOrders = mockResponse.meta.total;
            this.currentPage = mockResponse.meta.current_page;
            this.hasMore = mockResponse.meta.has_more;

            // Render icons
            this.$nextTick(() => {
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });

            return mockResponse;
        },

        /**
         * Generate mock orders data
         */
        generateMockOrders() {
            const products = [
                'Netflix Premium 1 Tháng', 'Spotify Premium 3 Tháng', 'NordVPN Premium 1 Năm',
                'Adobe Creative Cloud', 'Microsoft Office 365', 'Disney+ Premium', 
                'YouTube Premium', 'Amazon Prime Video', 'Canva Pro 1 Năm'
            ];
            
            const statuses = ['pending', 'processing', 'processed', 'completed', 'dispute', 'cancelled'];
            const types = ['purchase', 'sale'];

            for (let i = 1; i <= 45; i++) {
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                const randomType = types[Math.floor(Math.random() * types.length)];
                const randomPrice = Math.floor(Math.random() * 500000) + 100000;
                
                this.allOrders.push({
                    id: i,
                    code: `ORD${String(i).padStart(3, '0')}`,
                    productName: randomProduct,
                    status: randomStatus,
                    total: randomPrice,
                    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
                    type: randomType
                });
            }
        },

        /**
         * Load more orders (pagination)
         */
        async loadMoreOrders() {
            if (this.isLoadingMore || !this.hasMore) return;

            this.isLoadingMore = true;

            try {
                const nextPage = this.currentPage + 1;
                
                if (this.useSimulatedData) {
                    await this.fetchOrdersSimulated(nextPage);
                } else {
                    await this.fetchOrdersFromAPI(nextPage);
                }

                if (window.fastNotice) {
                    const loadedCount = Math.min(this.perPage, this.totalOrders - ((nextPage - 1) * this.perPage));
                    this.showNotification(`Đã tải thêm ${loadedCount} đơn hàng`, 'success');
                }
            } catch (error) {
                console.error('Error loading more orders:', error);
                this.showNotification('Không thể tải thêm đơn hàng', 'error');
            } finally {
                this.isLoadingMore = false;
            }
        },

        // ============================================
        // PHẦN 6: ACTION METHODS (Các hàm xử lý hành động)
        // ============================================
        
        /**
         * Làm mới danh sách đơn hàng
         * Được gọi khi user click nút "Làm mới"
         */
        async refreshOrders() {
            this.showNotification('Đang làm mới danh sách đơn hàng...', 'info');
            await this.loadOrders();
            this.showNotification('Đã cập nhật danh sách đơn hàng', 'success');
            
            // Render lại Lucide icons cho các elements mới
            this.$nextTick(() => {
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
        },

        /**
         * Tìm kiếm đơn hàng
         * Được gọi khi user submit form tìm kiếm
         */
        searchOrders() {
            console.log('Searching orders with query:', this.searchQuery);
            // Reset và load lại với search query
            this.currentPage = 1;
            this.displayedOrders = [];
            this.hasMore = true;
            this.loadOrders();
        },

        /**
         * Xuất dữ liệu ra file Excel
         * Được gọi khi user click nút "Xuất Excel"
         */
        exportToExcel() {
            this.showNotification('Đang xuất dữ liệu ra Excel...', 'info');
            // TODO: Implement Excel export functionality
            setTimeout(() => {
                this.showNotification('Xuất Excel thành công', 'success');
            }, 1000);
        },

        // ============================================
        // PHẦN 7: HELPER METHODS (Các hàm hỗ trợ)
        // ============================================
        
        /**
         * Format giá tiền theo định dạng Việt Nam
         * VD: 199000 → "199.000đ"
         */
        formatPrice(price) {
            return price.toLocaleString('vi-VN') + 'đ';
        },

        /**
         * Chuyển status code sang tiếng Việt
         * VD: 'pending' → "Chờ xử lý"
         */
        getStatusText(status) {
            const statusMap = {
                'pending': 'Chờ xử lý',
                'processing': 'Đang xử lý',
                'processed': 'Đã xử lý',
                'completed': 'Đã hoàn thành',
                'dispute': 'Khiếu nại',
                'cancelled': 'Đã hủy'
            };
            return statusMap[status] || status;
        },

        /**
         * Lấy CSS class cho badge trạng thái
         * Mỗi trạng thái có màu riêng để dễ phân biệt
         * VD: 'pending' → "bg-yellow-100 text-yellow-800" (màu vàng)
         */
        // getStatusClass(status) {
        //     const classMap = {
        //         'pending': 'bg-yellow-100 text-yellow-800',
        //         'processing': 'bg-blue-100 text-blue-800',
        //         'processed': 'bg-purple-100 text-purple-800',
        //         'completed': 'bg-green-100 text-green-800',
        //         'dispute': 'bg-orange-100 text-orange-800',
        //         'cancelled': 'bg-red-100 text-red-800'
        //     };
        //     return classMap[status] || 'bg-gray-100 text-gray-800';
        // },

        /**
         * Hiển thị thông báo cho user
         * Sử dụng thư viện FastNotice (đã được khởi tạo trong HTML)
         * @param {string} message - Nội dung thông báo
         * @param {string} type - Loại thông báo: 'success', 'error', 'info', 'warning'
         */
        showNotification(message, type = 'success') {
            if (window.fastNotice) {
                window.fastNotice.show(message, type);
            } else {
                console.log(`[${type}] ${message}`);
            }
        },

        // ============================================
        // PHẦN 8: CRUD OPERATIONS (Các thao tác với đơn hàng)
        // ============================================
        
        /**
         * Xem chi tiết đơn hàng
         * Navigate sang trang chi tiết hoặc mở modal
         */
        viewOrderDetail(orderId) {
            console.log('Viewing order detail:', orderId);
            // TODO: Navigate to order detail page or open modal
            window.location.href = `/order-detail.html?id=${orderId}`;
        },

        /**
         * Hủy đơn hàng
         * Chỉ có thể hủy đơn ở trạng thái "pending" (chờ xử lý)
         * Hiển thị confirm dialog trước khi hủy
         */
        async cancelOrder(orderId) {
            // Xác nhận trước khi hủy
            if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                return;
            }

            console.log('Cancelling order:', orderId);
            // TODO: Sau này sẽ gọi API để hủy đơn thực sự
            this.showNotification('Đã hủy đơn hàng thành công', 'success');
            
            // Cập nhật trạng thái đơn hàng trong data local
            const order = this.displayedOrders.find(o => o.id === orderId);
            if (order) {
                order.status = 'cancelled';
            }

            // Render lại icons sau khi DOM cập nhật
            this.$nextTick(() => {
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
        },

        /**
         * Mua lại sản phẩm từ đơn hàng cũ
         * Thêm sản phẩm vào giỏ hàng
         */
        reorder(orderId) {
            console.log('Reordering:', orderId);
            const order = this.displayedOrders.find(o => o.id === orderId);
            if (order) {
                this.showNotification(`Đã thêm "${order.productName}" vào giỏ hàng`, 'success');
                // TODO: Gọi hàm addToCart() từ cart-manager.js
            }
        },

        /**
         * Đánh giá đơn hàng
         * Mở modal hoặc navigate sang trang đánh giá
         */
        reviewOrder(orderId) {
            console.log('Reviewing order:', orderId);
            // TODO: Mở modal review hoặc chuyển sang trang review
            this.showNotification('Tính năng đánh giá đang được phát triển', 'info');
        }
    };
}

// ============================================
// EXPORT & INITIALIZATION
// ============================================

/**
 * Đăng ký function ordersManager vào window object
 * Điều này cho phép Alpine.js truy cập và sử dụng component
 * 
 * Cách sử dụng trong HTML:
 * <div x-data="ordersManager()">
 *   <!-- Alpine.js sẽ tìm window.ordersManager và gọi nó -->
 * </div>
 */
window.ordersManager = ordersManager;

