/**
 * Settings Manager Component
 * Quản lý state và logic cho trang cài đặt
 */

function settingsManager() {
    return {
        // ============================================
        // PHẦN 1: STATE (Trạng thái của component)
        // ============================================
        
        isSavingSettings: false,

        // ============================================
        // PHẦN 2: DATA (Dữ liệu)
        // ============================================
        
        // Cài đặt chung
        settings: {
            language: 'vi',
            timezone: 'Asia/Ho_Chi_Minh',
            currency: 'VND'
        },

        // Sử dụng dữ liệu mô phỏng (true) hoặc API thực (false)
        useSimulatedData: true,

        // ============================================
        // PHẦN 3: LIFECYCLE METHODS (Các hàm khởi tạo)
        // ============================================
        
        /**
         * Hàm init() được Alpine.js tự động gọi khi component được khởi tạo
         */
        async init() {
            console.log('Settings Manager Initialized');
            
            // Load cài đặt
            await this.loadSettings();
            
            // Khởi tạo Lucide icons sau khi Alpine.js render xong
            this.$nextTick(() => {
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
        },

        // ============================================
        // PHẦN 4: API METHODS (Các hàm gọi API)
        // ============================================
        
        /**
         * Load cài đặt từ localStorage hoặc API
         */
        async loadSettings() {
            try {
                // Load từ localStorage trước
                const savedSettings = localStorage.getItem('userSettings');
                if (savedSettings) {
                    this.settings = JSON.parse(savedSettings);
                }

                // Nếu không dùng simulated data, load từ API
                if (!this.useSimulatedData) {
                    await this.fetchSettingsFromAPI();
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        },

        /**
         * Fetch settings từ API thực
         */
        async fetchSettingsFromAPI() {
            try {
                const response = await fetch(`${API_URL}profile/settings`, {
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch settings');
                }

                const data = await response.json();
                this.settings = data.data;

                // Save to localStorage
                localStorage.setItem('userSettings', JSON.stringify(this.settings));

                return data;
            } catch (error) {
                console.error('API fetch error:', error);
                throw error;
            }
        },

        /**
         * Lấy auth token từ localStorage hoặc cookie
         */
        getAuthToken() {
            return localStorage.getItem('authToken') || '';
        },

        // ============================================
        // PHẦN 5: ACTION METHODS (Các hàm xử lý hành động)
        // ============================================
        
        /**
         * Lưu cài đặt chung
         */
        async saveSettings() {
            this.isSavingSettings = true;

            try {
                // Save to localStorage
                localStorage.setItem('userSettings', JSON.stringify(this.settings));

                if (this.useSimulatedData) {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 500));
                    this.showNotification('Lưu cài đặt thành công', 'success');
                } else {
                    await this.saveSettingsAPI();
                }
            } catch (error) {
                console.error('Error saving settings:', error);
                this.showNotification('Không thể lưu cài đặt', 'error');
            } finally {
                this.isSavingSettings = false;
            }
        },

        /**
         * Save settings via API
         */
        async saveSettingsAPI() {
            try {
                const response = await fetch(`${API_URL}profile/settings`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getAuthToken()}`
                    },
                    body: JSON.stringify(this.settings)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to save settings');
                }

                this.showNotification('Lưu cài đặt thành công', 'success');
                
                return await response.json();
            } catch (error) {
                console.error('API save settings error:', error);
                throw error;
            }
        },

        /**
         * Xác nhận xóa tài khoản
         */
        confirmDeleteAccount() {
            if (!confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
                return;
            }

            // Double confirmation
            const confirmText = prompt('Nhập "XÓA TÀI KHOẢN" để xác nhận:');
            if (confirmText !== 'XÓA TÀI KHOẢN') {
                this.showNotification('Đã hủy xóa tài khoản', 'info');
                return;
            }

            this.deleteAccount();
        },

        /**
         * Xóa tài khoản
         */
        async deleteAccount() {
            try {
                if (this.useSimulatedData) {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    this.showNotification('Tài khoản đã được xóa', 'success');
                    // Redirect to home page
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } else {
                    await this.deleteAccountAPI();
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                this.showNotification('Không thể xóa tài khoản', 'error');
            }
        },

        /**
         * Delete account via API
         */
        async deleteAccountAPI() {
            try {
                const response = await fetch(`${API_URL}profile`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to delete account');
                }

                this.showNotification('Tài khoản đã được xóa', 'success');
                
                // Clear auth token and redirect
                localStorage.removeItem('authToken');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
                
                return await response.json();
            } catch (error) {
                console.error('API delete account error:', error);
                throw error;
            }
        },

        // ============================================
        // PHẦN 6: HELPER METHODS (Các hàm hỗ trợ)
        // ============================================
        
        /**
         * Hiển thị thông báo cho user
         */
        showNotification(message, type = 'success') {
            if (window.fastNotice) {
                window.fastNotice.show(message, type);
            } else {
                console.log(`[${type}] ${message}`);
            }
        }
    };
}

// ============================================
// EXPORT & INITIALIZATION
// ============================================

window.settingsManager = settingsManager;

