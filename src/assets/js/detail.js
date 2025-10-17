// Product Detail Alpine.js Component

function productDetailComponent() {
    return {
        // State
        activeTab: 'description',
        quantity: 1,
        isWishlisted: false,
        isAddingToCart: false,
        isBuyingNow: false,
        selectedGmailType: 'gmail-vn-aged-20-50',
        selectedColor: 'xanh-da-troi', // Default color
        
        // Product data will be loaded from API or server
        product: null,

        // Initialize component
        init() {
            console.log('Product detail component initialized.');
            console.log('Product:', this.product);
        },

        // Methods
        setActiveTab(tab) {
            this.activeTab = tab;
        },

        isTabActive(tab) {
            return this.activeTab === tab;
        },

        // Helper methods
        formatPrice(price) {
            return window.cartManager.formatPrice(price);
        },

        getSavings() {
            // This will be calculated based on selected Gmail type
            return 2091000; // Static value for now
        },

        getTotalPrice() {
            // This will be calculated based on selected Gmail type and quantity
            return 899000 * this.quantity; // Static value for now
        },

        getTotalSavings() {
            return this.getSavings() * this.quantity;
        },

        getSelectedGmailType() {
            // This will be handled by the selected radio button in HTML
            return null;
        },

        getSelectedPrice() {
            const priceMap = {
                'gmail-vn-aged-20-50': '899.000đ',
                'gmail-vn-aged-30-80': '999.000đ',
                'gmail-vn-aged-40-90': '1.099.000đ',
                'gmail-vn-aged-60-120': '1.199.000đ',
                'gmail-vn-new-1day': '799.000đ'
            };
            return priceMap[this.selectedGmailType] || '899.000đ';
        },

        getSavingsText() {
            const priceMap = {
                'gmail-vn-aged-20-50': 899000,
                'gmail-vn-aged-30-80': 999000,
                'gmail-vn-aged-40-90': 1099000,
                'gmail-vn-aged-60-120': 1199000,
                'gmail-vn-new-1day': 799000
            };
            const selectedPrice = priceMap[this.selectedGmailType] || 899000;
            const savings = 2990000 - selectedPrice;
            return savings.toLocaleString('vi-VN') + 'đ';
        },

        selectGmailType(typeId) {
            this.selectedGmailType = typeId;
        },

        selectColor(colorId) {
            this.selectedColor = colorId;
        },

        getSelectedColor() {
            const colorMap = {
                'xanh-da-troi': 'Xanh Da Trời',
                'den-khong-gian': 'Đen Không Gian',
                'trang-may': 'Trắng Mây',
                'vang-nhat': 'Vàng Nhạt'
            };
            return colorMap[this.selectedColor] || 'Xanh Da Trời';
        },

        decreaseQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },

        increaseQuantity() {
            if (this.quantity < 50) { // Static limit for now
                this.quantity++;
            }
        },

        selectThumbnail(index) {
            // This will be handled by updating the main image src
            console.log('Selected thumbnail:', index);
        },

        toggleWishlist() {
            this.isWishlisted = !this.isWishlisted;
            
            if (window.fastNotice) {
                if (this.isWishlisted) {
                    window.fastNotice.success('Đã thêm vào danh sách yêu thích!');
                } else {
                    window.fastNotice.info('Đã xóa khỏi danh sách yêu thích!');
                }
            }
        },

        addToCart() {
            this.isAddingToCart = true;

            // Get selected Gmail type data
            const nameMap = {
                'gmail-vn-aged-20-50': 'Gmail VN Đã Ngâm 20-50 Ngày',
                'gmail-vn-aged-30-80': 'Gmail VN Đã Ngâm 30-80 Ngày',
                'gmail-vn-aged-40-90': 'Gmail VN Đã Ngâm 40-90 Ngày',
                'gmail-vn-aged-60-120': 'Gmail VN Đã Ngâm 60-120 Ngày',
                'gmail-vn-new-1day': 'Gmail VN Mới Reg 1 Ngày'
            };

            const priceMap = {
                'gmail-vn-aged-20-50': 899000,
                'gmail-vn-aged-30-80': 999000,
                'gmail-vn-aged-40-90': 1099000,
                'gmail-vn-aged-60-120': 1199000,
                'gmail-vn-new-1day': 799000
            };

            const name = nameMap[this.selectedGmailType];
            const price = priceMap[this.selectedGmailType];
            const colorName = this.getSelectedColor();

            if (!name || !price) {
                this.isAddingToCart = false;
                return;
            }

            // Add to cart using Cart Manager
            const cartItem = {
                id: `${this.selectedGmailType}-${this.selectedColor}`,
                name: `${name} - ${colorName}`,
                category: 'Tài khoản Streaming',
                price: price,
                originalPrice: 2990000,
                image: '/placeholder.svg?height=500&width=500&text=Netflix+Main',
                icon: this.getProductIcon(),
                color: colorName
            };

            // Add multiple items based on quantity
            for (let i = 0; i < this.quantity; i++) {
                window.cartManager.addToCart(cartItem);
            }

            // Simulate loading state
            setTimeout(() => {
                this.isAddingToCart = false;
            }, 500);
        },

        getProductIcon() {
            // Map product categories to icons
            const iconMap = {
                'Tài khoản Streaming': 'tv',
                'Tài khoản Social': 'users',
                'Software & License': 'monitor',
                'VPN & Proxy': 'shield',
                'SEO & Link Building': 'link',
                'Data & Tools MMO': 'search',
                'Tài khoản Email': 'mail',
                'Tài khoản Facebook': 'facebook',
                'Tài khoản Social khác': 'share-2'
            };
            return iconMap['Tài khoản Streaming'] || 'package';
        },

        buyNow() {
            this.isBuyingNow = true;

            // Simulate loading state
            setTimeout(() => {
                this.isBuyingNow = false;
                
                // Show success notification
                if (window.fastNotice) {
                    window.fastNotice.success('Đang chuyển hướng đến trang thanh toán...');
                }

                // Simulate redirect to checkout page
                setTimeout(() => {
                    console.log('Redirecting to checkout page...');
                    // window.location.href = '/checkout';
                }, 1000);
            }, 1500);
        },

        async share() {
            try {
                if (navigator.share) {
                    await navigator.share({
                        title: 'Netflix Premium 1 Năm - 4K Ultra HD',
                        text: 'Xem sản phẩm này tại MMO Store',
                        url: window.location.href
                    });
                } else {
                    // Fallback: copy to clipboard
                    await navigator.clipboard.writeText(window.location.href);
                    if (window.fastNotice) {
                        window.fastNotice.success('Đã sao chép link vào clipboard!');
                    }
                }
            } catch (error) {
                console.error('Error sharing:', error);
            }
        }
    };
}

// FAQ Component
function faqComponent() {
    return {
        // State
        openFaqs: [true, false, false, false, false], // First FAQ is open by default
        
        // Initialize component
        init() {
            console.log('FAQ component initialized.');
        },
        
        // Methods
        toggleFaq(index) {
            this.openFaqs[index] = !this.openFaqs[index];
        }
    };
}

// Reviews Component with Load More functionality
function reviewsComponent() {
    return {
        // State - Reviews List
        displayedReviews: [],
        totalReviews: 0,
        currentPage: 1,
        perPage: 6,
        isLoading: false,
        hasMore: true,
        productId: null, // Product ID from URL or data attribute
        useSimulatedData: true, // Toggle between simulated and real API

        // State - New Review Form
        newReview: {
            name: '',
            rating: 0,
            comment: ''
        },
        hoverRating: 0,
        isSubmitting: false,
        errors: {},

        // Initialize component
        async init() {
            console.log('Reviews component initialized.');
            
            // Get product ID from URL or data attribute
            this.productId = this.getProductId();
            
            // Load initial reviews
            await this.loadInitialReviews();
        },

        // Get product ID from URL or element data attribute
        getProductId() {
            // Try to get from URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id') || urlParams.get('product_id');
            
            if (productId) return productId;
            
            // Fallback to default for demo
            return 'default-product-123';
        },

        // Load initial reviews
        async loadInitialReviews() {
            this.isLoading = true;
            
            try {
                if (this.useSimulatedData) {
                    // Simulated data for demo/development
                    await this.fetchReviewsSimulated(1);
                } else {
                    // Real API call
                    await this.fetchReviewsFromAPI(1);
                }
            } catch (error) {
                console.error('Error loading reviews:', error);
                if (window.fastNotice) {
                    window.fastNotice.error('Không thể tải đánh giá. Vui lòng thử lại!');
                }
            } finally {
                this.isLoading = false;
            }
        },

        // Fetch reviews from real API (pagination query)
        async fetchReviewsFromAPI(page) {
            try {
                // Real API endpoint with pagination
                const response = await fetch(`/api/products/${this.productId}/reviews?page=${page}&per_page=${this.perPage}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch reviews');
                }

                const data = await response.json();
                
                // Expected API response format:
                // {
                //     data: [...reviews],
                //     meta: {
                //         current_page: 1,
                //         total: 1247,
                //         per_page: 6,
                //         last_page: 208,
                //         has_more: true
                //     }
                // }

                if (page === 1) {
                    this.displayedReviews = data.data;
                } else {
                    this.displayedReviews = [...this.displayedReviews, ...data.data];
                }

                this.totalReviews = data.meta.total;
                this.currentPage = data.meta.current_page;
                this.hasMore = data.meta.has_more || (this.currentPage < data.meta.last_page);

                return data;
            } catch (error) {
                console.error('API fetch error:', error);
                throw error;
            }
        },

        // Simulated API response (for demo/development)
        async fetchReviewsSimulated(page) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const names = [
                'Nguyễn Văn Hùng', 'Trần Thị Bích', 'Lê Minh Đức', 'Phạm Thu Hà',
                'Hoàng Văn Nam', 'Vũ Thị Lan', 'Đặng Quốc Huy', 'Bùi Thị Mai',
                'Ngô Văn Tùng', 'Phan Thị Hương', 'Lý Minh Tuấn', 'Đinh Thị Thảo'
            ];

            const comments = [
                'Sản phẩm tuyệt vời! Giao hàng nhanh, hỗ trợ nhiệt tình. Sẽ tiếp tục ủng hộ shop trong tương lai.',
                'Chất lượng tốt, giá cả hợp lý. Tuy nhiên phần hướng dẫn sử dụng hơi khó hiểu một chút.',
                'Rất đáng tiền. Mọi thứ hoạt động hoàn hảo.',
                'Dịch vụ chăm sóc khách hàng xuất sắc. Sản phẩm đúng như mô tả.',
                'Giao hàng nhanh, đóng gói cẩn thận. Sẽ giới thiệu cho bạn bè.',
                'Sản phẩm chất lượng cao, giá tốt. Rất hài lòng với lần mua này.',
                'Đã sử dụng được 2 tuần, hoạt động rất ổn định.',
                'Shop tư vấn nhiệt tình, sản phẩm chính hãng 100%.',
                'Mình rất thích sản phẩm này, vượt xa mong đợi.',
                'Giao hàng hơi chậm nhưng sản phẩm rất tốt.',
                'Chất lượng xuất sắc, giá cả phải chăng. Recommend!',
                'Sản phẩm tốt, đúng mô tả. Sẽ quay lại ủng hộ shop.'
            ];

            const timeUnits = ['ngày', 'tuần', 'tháng'];
            const totalReviews = 1247;
            const lastPage = Math.ceil(totalReviews / this.perPage);

            // Generate reviews for current page
            const startIndex = (page - 1) * this.perPage;
            const newReviews = [];

            for (let i = 0; i < this.perPage && (startIndex + i) < totalReviews; i++) {
                const reviewIndex = startIndex + i;
                const randomName = names[Math.floor(Math.random() * names.length)];
                const randomComment = comments[Math.floor(Math.random() * comments.length)];
                const randomRating = Math.floor(Math.random() * 2) + 4; // 4-5 stars mostly
                const randomTimeValue = Math.floor(Math.random() * 30) + 1;
                const randomTimeUnit = timeUnits[Math.floor(Math.random() * timeUnits.length)];
                const randomAvatarId = String.fromCharCode(97 + (reviewIndex % 26));

                newReviews.push({
                    id: reviewIndex + 1,
                    name: randomName,
                    avatar: `https://i.pravatar.cc/40?u=a042581f4e29026704${randomAvatarId}`,
                    rating: randomRating,
                    time: `${randomTimeValue} ${randomTimeUnit} trước`,
                    comment: randomComment
                });
            }

            // Simulate API response
            const mockResponse = {
                data: newReviews,
                meta: {
                    current_page: page,
                    total: totalReviews,
                    per_page: this.perPage,
                    last_page: lastPage,
                    has_more: page < lastPage
                }
            };

            // Update state
            if (page === 1) {
                this.displayedReviews = mockResponse.data;
            } else {
                this.displayedReviews = [...this.displayedReviews, ...mockResponse.data];
            }

            this.totalReviews = mockResponse.meta.total;
            this.currentPage = mockResponse.meta.current_page;
            this.hasMore = mockResponse.meta.has_more;

            return mockResponse;
        },

        // Load more reviews
        async loadMore() {
            if (this.isLoading || !this.hasMore) return;

            this.isLoading = true;

            try {
                const nextPage = this.currentPage + 1;
                
                if (this.useSimulatedData) {
                    await this.fetchReviewsSimulated(nextPage);
                } else {
                    await this.fetchReviewsFromAPI(nextPage);
                }

                // Show success notification
                if (window.fastNotice) {
                    const loadedCount = Math.min(this.perPage, this.totalReviews - ((nextPage - 1) * this.perPage));
                    window.fastNotice.success(`Đã tải thêm ${loadedCount} đánh giá`);
                }

                // Smooth scroll to new reviews
                this.scrollToNewReviews();
            } catch (error) {
                console.error('Error loading more reviews:', error);
                if (window.fastNotice) {
                    window.fastNotice.error('Không thể tải thêm đánh giá. Vui lòng thử lại!');
                }
            } finally {
                this.isLoading = false;
            }
        },

        // Smooth scroll to new content
        scrollToNewReviews() {
            setTimeout(() => {
                const container = document.getElementById('reviews-container');
                if (container) {
                    const reviewElements = container.querySelectorAll('.flex.items-start');
                    if (reviewElements.length > this.perPage) {
                        const targetIndex = Math.max(0, reviewElements.length - this.perPage - 1);
                        const targetElement = reviewElements[targetIndex];
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }
                }
            }, 100);
        },

        // ============= SUBMIT REVIEW FORM =============

        // Validate review form
        validateReviewForm() {
            this.errors = {};
            let isValid = true;

            // Validate name
            if (!this.newReview.name || this.newReview.name.trim() === '') {
                this.errors.name = 'Vui lòng nhập tên của bạn';
                isValid = false;
            } else if (this.newReview.name.trim().length < 2) {
                this.errors.name = 'Tên phải có ít nhất 2 ký tự';
                isValid = false;
            } else if (this.newReview.name.trim().length > 100) {
                this.errors.name = 'Tên không được quá 100 ký tự';
                isValid = false;
            }

            // Validate rating
            if (!this.newReview.rating || this.newReview.rating < 1 || this.newReview.rating > 5) {
                this.errors.rating = 'Vui lòng chọn số sao đánh giá';
                isValid = false;
            }

            // Validate comment
            if (!this.newReview.comment || this.newReview.comment.trim() === '') {
                this.errors.comment = 'Vui lòng nhập bình luận của bạn';
                isValid = false;
            } else if (this.newReview.comment.trim().length < 10) {
                this.errors.comment = 'Bình luận phải có ít nhất 10 ký tự';
                isValid = false;
            } else if (this.newReview.comment.trim().length > 1000) {
                this.errors.comment = 'Bình luận không được quá 1000 ký tự';
                isValid = false;
            }

            return isValid;
        },

        // Submit review
        async submitReview() {
            // Validate form
            if (!this.validateReviewForm()) {
                if (window.fastNotice) {
                    window.fastNotice.error('Vui lòng kiểm tra lại thông tin!');
                }
                return;
            }

            this.isSubmitting = true;

            try {
                if (this.useSimulatedData) {
                    await this.submitReviewSimulated();
                } else {
                    await this.submitReviewToAPI();
                }

                // Show success notification
                if (window.fastNotice) {
                    window.fastNotice.success('Đã gửi đánh giá thành công! Cảm ơn bạn đã đóng góp ý kiến.');
                }

                // Reset form
                this.resetReviewForm();

            } catch (error) {
                console.error('Error submitting review:', error);
                if (window.fastNotice) {
                    window.fastNotice.error('Không thể gửi đánh giá. Vui lòng thử lại sau!');
                }
            } finally {
                this.isSubmitting = false;
            }
        },

        // Submit review to real API
        async submitReviewToAPI() {
            try {
                const response = await fetch(`/api/products/${this.productId}/reviews`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add auth token if needed
                        // 'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: this.newReview.name.trim(),
                        rating: this.newReview.rating,
                        comment: this.newReview.comment.trim(),
                        product_id: this.productId
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to submit review');
                }

                const data = await response.json();

                // Add new review to the top of the list
                if (data.review) {
                    this.displayedReviews.unshift(data.review);
                    this.totalReviews++;
                }

                return data;
            } catch (error) {
                console.error('API submit error:', error);
                throw error;
            }
        },

        // Simulated submit review (for demo/development)
        async submitReviewSimulated() {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate random avatar
            const randomAvatarId = String.fromCharCode(97 + Math.floor(Math.random() * 26));

            // Create new review object
            const newReviewData = {
                id: Date.now(), // Use timestamp as ID
                name: this.newReview.name.trim(),
                rating: this.newReview.rating,
                comment: this.newReview.comment.trim(),
                time: 'Vừa xong',
                avatar: `https://i.pravatar.cc/40?u=new${randomAvatarId}`
            };

            // Add to the top of the list
            this.displayedReviews.unshift(newReviewData);
            this.totalReviews++;

            // Scroll to top to see new review
            setTimeout(() => {
                const container = document.getElementById('reviews-container');
                if (container) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);

            return newReviewData;
        },

        // Reset review form
        resetReviewForm() {
            this.newReview = {
                name: '',
                rating: 0,
                comment: ''
            };
            this.hoverRating = 0;
            this.errors = {};
        }
    };
}

// Export for use in HTML
window.productDetailComponent = productDetailComponent;
window.faqComponent = faqComponent;
window.reviewsComponent = reviewsComponent;
