/**
 * Order Detail Manager Component
 * Quản lý state và logic cho trang chi tiết đơn hàng
 * 
 * Component này được sử dụng bởi Alpine.js để:
 * - Quản lý trạng thái (state) của trang chi tiết đơn hàng
 * - Xử lý các tương tác của user (in hóa đơn, tải hóa đơn, lưu ghi chú)
 * - Tự động cập nhật UI khi dữ liệu thay đổi
 */

// ============================================
// ORDER DETAIL MANAGER
// ============================================

/**
 * Order Detail Manager Component
 * Quản lý state và logic cho trang chi tiết đơn hàng
 */
function orderDetailManager() {
    return {
        // State - chỉ lưu orderType từ URL để điều khiển x-show
        orderId: '',
        orderType: 'purchase', // 'purchase' or 'sale'

        // Methods
        init() {
            // Get orderId and orderType from URL params
            const urlParams = new URLSearchParams(window.location.search);
            this.orderId = urlParams.get('id') || 'BO001';
            this.orderType = urlParams.get('type') || 'purchase';
            
            // Initialize Lucide icons
            this.$nextTick(() => {
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
        },

        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price).replace('₫', '₫');
        },

        printInvoice() {
            window.print();
        },

        downloadInvoice() {
            this.showNotification('Đang tải hóa đơn...', 'info');
            // TODO: Implement download invoice
        },

        savePrivateNote() {
            this.showNotification('Đã lưu ghi chú riêng', 'success');
            // TODO: Save to API
        },

        showNotification(message, type = 'info') {
            if (window.fastNotice) {
                window.fastNotice.show(message, type);
            }
        }
    };
}

// ============================================
// EXPORT & INITIALIZATION
// ============================================

/**
 * Đăng ký function orderDetailManager vào window object
 * Điều này cho phép Alpine.js truy cập và sử dụng component
 * 
 * Cách sử dụng trong HTML:
 * <div x-data="orderDetailManager()">
 *   <!-- Alpine.js sẽ tìm window.orderDetailManager và gọi nó -->
 * </div>
 */
window.orderDetailManager = orderDetailManager;
