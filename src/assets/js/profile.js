/**
 * Profile Manager Component
 * Quản lý state và logic cho trang hồ sơ cá nhân
 * 
 * Component này được sử dụng bởi Alpine.js để:
 * - Quản lý thông tin cá nhân

 */

function profileManager() {
    return {
        // ============================================
        // PHẦN 1: STATE (Trạng thái của component)
        // ============================================
        
        // Tab hiện tại: 'info', 'security', 'settings'
        activeTab: 'info',
        
        // Trạng thái đang tải dữ liệu
        isLoading: false,
        isSaving: false,
        isChangingPassword: false,
        isSavingSettings: false,

        // ============================================
        // PHẦN 2: DATA (Dữ liệu)
        // ============================================
        
        // Thông tin hồ sơ người dùng
        profile: {
            name: '',
            email: '',
            phone: '',
            birthday: '',
            address: '',
            role: 'Thành viên',
            status: 'Đang hoạt động',
            joinDate: new Date().toISOString(),
            avatar: ''
        },

        // Thống kê
        stats: {
            totalOrders: 0,
            completedOrders: 0,
            totalSpent: 0,
            rating: '0.0'
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
            console.log('Profile Manager Initialized');
            
            // Load thông tin profile từ API
            await this.loadProfile();
            
            // Load thống kê
            await this.loadStats();
            
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
         * Load thông tin profile từ server
         */
        async loadProfile() {
            this.isLoading = true;
            
            try {
                if (this.useSimulatedData) {
                    await this.fetchProfileSimulated();
                } else {
                    await this.fetchProfileFromAPI();
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                this.showNotification('Không thể tải thông tin hồ sơ', 'error');
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Fetch profile từ API thực
         */
        async fetchProfileFromAPI() {
            try {
                const response = await fetch(`${API_URL}profile`, {
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                
                // Expected API response format:
                // {
                //     data: {
                //         name: "Nguyễn Văn A",
                //         email: "user@example.com",
                //         phone: "0123456789",
                //         birthday: "1990-01-01",
                //         address: "123 Đường ABC",
                //         role: "Thành viên",
                //         status: "Đang hoạt động",
                //         joinDate: "2024-01-01T00:00:00Z",
                //         avatar: "https://..."
                //     }
                // }

                this.profile = data.data;

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
        async fetchProfileSimulated() {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock data
            this.profile = {
                name: 'Nguyễn Văn A',
                email: 'user@example.com',
                phone: '0123456789',
                birthday: '1990-01-01',
                address: '123 Đường ABC, Quận 1, TP.HCM',
                role: 'Thành viên',
                status: 'Đang hoạt động',
                joinDate: '2024-01-01T00:00:00Z',
                avatar: ''
            };

            // Render icons
            this.$nextTick(() => {
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });

            return this.profile;
        },

        /**
         * Load thống kê từ server
         */
        async loadStats() {
            try {
                if (this.useSimulatedData) {
                    await this.fetchStatsSimulated();
                } else {
                    await this.fetchStatsFromAPI();
                }
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        },

        /**
         * Fetch stats từ API thực
         */
        async fetchStatsFromAPI() {
            try {
                const response = await fetch(`${API_URL}profile/stats`, {
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }

                const data = await response.json();
                
                // Expected API response format:
                // {
                //     data: {
                //         totalOrders: 45,
                //         completedOrders: 35,
                //         totalSpent: 5000000,
                //         rating: "4.5"
                //     }
                // }

                this.stats = data.data;

                return data;
            } catch (error) {
                console.error('API fetch error:', error);
                throw error;
            }
        },

        /**
         * Simulated stats response
         */
        async fetchStatsSimulated() {
            await new Promise(resolve => setTimeout(resolve, 300));

            // Mock stats
            this.stats = {
                totalOrders: 45,
                completedOrders: 35,
                totalSpent: 5000000,
                rating: '4.5'
            };

            return this.stats;
        },

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
            // TODO: Implement token retrieval logic
            return localStorage.getItem('authToken') || '';
        },

        // ============================================
        // PHẦN 5: ACTION METHODS (Các hàm xử lý hành động)
        // ============================================
        
        /**
         * Cập nhật thông tin profile
         */
        async updateProfile() {
            // Validation
            if (!this.profile.name || !this.profile.email) {
                this.showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
                return;
            }

            this.isSaving = true;

            try {
                if (this.useSimulatedData) {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    this.showNotification('Cập nhật thông tin thành công', 'success');
                } else {
                    await this.updateProfileAPI();
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                this.showNotification('Không thể cập nhật thông tin', 'error');
            } finally {
                this.isSaving = false;
            }
        },

        /**
         * Update profile via API
         */
        async updateProfileAPI() {
            try {
                const response = await fetch(`${API_URL}profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getAuthToken()}`
                    },
                    body: JSON.stringify(this.profile)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                const data = await response.json();
                this.showNotification('Cập nhật thông tin thành công', 'success');
                
                return data;
            } catch (error) {
                console.error('API update error:', error);
                throw error;
            }
        },

        /**
         * Đặt lại form về giá trị ban đầu
         */
        resetForm() {
            // Reload profile data
            this.loadProfile();
            this.showNotification('Đã đặt lại form', 'info');
        },

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

        /**
         * Mở modal đổi avatar
         */
        openAvatarModal() {
            // TODO: Implement avatar upload modal
            this.showNotification('Tính năng đổi avatar đang được phát triển', 'info');
        },

        // ============================================
        // PHẦN 6: HELPER METHODS (Các hàm hỗ trợ)
        // ============================================
        
        /**
         * Format giá tiền theo định dạng Việt Nam
         */
        formatPrice(price) {
            return price.toLocaleString('vi-VN') + 'đ';
        },

        /**
         * Format ngày tháng
         */
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        /**
         * Lấy chữ cái đầu của tên để hiển thị avatar
         */
        getInitials() {
            if (!this.profile.name) return 'U';
            const names = this.profile.name.trim().split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return names[0][0].toUpperCase();
        },

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

/**
 * Đăng ký function profileManager vào window object
 * Điều này cho phép Alpine.js truy cập và sử dụng component
 */
window.profileManager = profileManager;

