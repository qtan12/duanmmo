/**
 * Security Manager Component
 * Quản lý state và logic cho trang bảo mật tài khoản
 */

function securityManager() {
    return {
        // ============================================
        // PHẦN 1: STATE (Trạng thái của component)
        // ============================================
        
        isChangingPassword: false,

        // ============================================
        // PHẦN 2: DATA (Dữ liệu)
        // ============================================
        
        // Form đổi mật khẩu
        passwordForm: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },

        // Cài đặt bảo mật
        securitySettings: {
            twoFactorEnabled: false,
            emailNotifications: true
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
            console.log('Security Manager Initialized');
            
            // Load cài đặt bảo mật
            await this.loadSecuritySettings();
            
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
         * Load cài đặt bảo mật từ server
         */
        async loadSecuritySettings() {
            try {
                if (this.useSimulatedData) {
                    await this.fetchSecuritySettingsSimulated();
                } else {
                    await this.fetchSecuritySettingsFromAPI();
                }
            } catch (error) {
                console.error('Error loading security settings:', error);
            }
        },

        /**
         * Fetch security settings từ API thực
         */
        async fetchSecuritySettingsFromAPI() {
            try {
                const response = await fetch(`${API_URL}profile/security`, {
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch security settings');
                }

                const data = await response.json();
                this.securitySettings = data.data;

                return data;
            } catch (error) {
                console.error('API fetch error:', error);
                throw error;
            }
        },

        /**
         * Simulated security settings response
         */
        async fetchSecuritySettingsSimulated() {
            await new Promise(resolve => setTimeout(resolve, 300));

            // Mock settings
            this.securitySettings = {
                twoFactorEnabled: false,
                emailNotifications: true
            };

            return this.securitySettings;
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
         * Đổi mật khẩu
         */
        async changePassword() {
            // Validation
            if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
                this.showNotification('Vui lòng điền đầy đủ thông tin', 'error');
                return;
            }

            if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
                this.showNotification('Mật khẩu mới không khớp', 'error');
                return;
            }

            if (this.passwordForm.newPassword.length < 6) {
                this.showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
                return;
            }

            this.isChangingPassword = true;

            try {
                if (this.useSimulatedData) {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    this.showNotification('Đổi mật khẩu thành công', 'success');
                    this.resetPasswordForm();
                } else {
                    await this.changePasswordAPI();
                }
            } catch (error) {
                console.error('Error changing password:', error);
                this.showNotification('Không thể đổi mật khẩu', 'error');
            } finally {
                this.isChangingPassword = false;
            }
        },

        /**
         * Change password via API
         */
        async changePasswordAPI() {
            try {
                const response = await fetch(`${API_URL}profile/password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getAuthToken()}`
                    },
                    body: JSON.stringify({
                        current_password: this.passwordForm.currentPassword,
                        new_password: this.passwordForm.newPassword
                    })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to change password');
                }

                this.showNotification('Đổi mật khẩu thành công', 'success');
                this.resetPasswordForm();
                
                return await response.json();
            } catch (error) {
                console.error('API change password error:', error);
                throw error;
            }
        },

        /**
         * Đặt lại form mật khẩu
         */
        resetPasswordForm() {
            this.passwordForm = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
        },

        /**
         * Bật/tắt xác thực 2 lớp
         */
        async toggle2FA() {
            this.securitySettings.twoFactorEnabled = !this.securitySettings.twoFactorEnabled;
            
            try {
                if (this.useSimulatedData) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    this.showNotification(
                        this.securitySettings.twoFactorEnabled ? 'Đã bật xác thực 2 lớp' : 'Đã tắt xác thực 2 lớp',
                        'success'
                    );
                } else {
                    await this.updateSecuritySettingsAPI();
                }
            } catch (error) {
                // Revert on error
                this.securitySettings.twoFactorEnabled = !this.securitySettings.twoFactorEnabled;
                console.error('Error toggling 2FA:', error);
                this.showNotification('Không thể cập nhật cài đặt bảo mật', 'error');
            }
        },

        /**
         * Update security settings via API
         */
        async updateSecuritySettingsAPI() {
            try {
                const response = await fetch(`${API_URL}profile/security`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getAuthToken()}`
                    },
                    body: JSON.stringify(this.securitySettings)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to update security settings');
                }

                this.showNotification('Cập nhật cài đặt bảo mật thành công', 'success');
                
                return await response.json();
            } catch (error) {
                console.error('API update security error:', error);
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

window.securityManager = securityManager;

