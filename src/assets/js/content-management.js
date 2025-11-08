/**
 * Content Management Component
 * Quản lý state và logic cho trang quản lý nội dung (WordPress-like)
 * 
 * Component này được sử dụng bởi Alpine.js để:
 * - Quản lý trạng thái (state) của trang quản lý bài viết
 * - Xử lý các tương tác của user (click, search, filter, sort)
 * - Tự động cập nhật UI khi dữ liệu thay đổi
 */

function contentManager() {
    return {
        // ============================================
        // PHẦN 1: STATE (Trạng thái của component)
        // ============================================
        
        // Bộ lọc trạng thái bài viết
        // Giá trị có thể là: 'all', 'mine', 'published', 'draft', 'trash', 'core'
        statusFilter: 'all',
        
        // Từ khóa tìm kiếm (user nhập vào ô search)
        searchQuery: '',
        
        // Bộ lọc ngày
        dateFilter: '',
        
        // Bộ lọc danh mục
        categoryFilter: '',
        
        // Bộ lọc SEO
        seoFilter: '',
        
        // Hành động hàng loạt
        bulkAction: '',
        
        // Bài viết được chọn
        selectedPosts: [],
        
        // Sắp xếp
        sortField: 'date',
        sortOrder: 'desc',
        
        // Trạng thái đang tải dữ liệu
        isLoading: false,
        
        // Trạng thái đang tạo bài viết
        isCreatingPost: false,
        
        // Form tạo bài viết mới
        newPost: {
            title: '',
            slug: '',
            content: '',
            category: '',
            tagsInput: '',
            featuredImage: '',
            seoKeywords: '',
            seoDescription: '',
            isDraft: false
        },
        
        // ============================================
        // PHẦN 2: DATA (Dữ liệu)
        // ============================================
        
        // Danh sách tất cả bài viết
        allPosts: [],
        
        // Danh sách bài viết đang hiển thị (có thể là filtered hoặc paginated)
        displayedPosts: [],
        
        // Tổng số bài viết
        totalPosts: 7,
        
        // Thống kê số lượng bài viết theo từng trạng thái
        stats: {
            all: 7,
            mine: 1,
            published: 6,
            draft: 1,
            trash: 33,
            core: 0
        },

        // ============================================
        // PHẦN 3: WATCHERS (Theo dõi thay đổi)
        // ============================================

        // ============================================
        // PHẦN 4: LIFECYCLE METHODS (Các hàm khởi tạo)
        // ============================================
        
        /**
         * Hàm init() được Alpine.js tự động gọi khi component được khởi tạo
         */
        async init() {
            console.log('Content Manager Initialized');
            
            // Load danh sách bài viết từ API
            await this.loadPosts();
            
            // Watch for filter changes and reload
            this.$watch('statusFilter', () => this.handleFilterChange());
            this.$watch('dateFilter', () => this.handleFilterChange());
            this.$watch('categoryFilter', () => this.handleFilterChange());
            this.$watch('seoFilter', () => this.handleFilterChange());
            
            // Watch title changes to auto-generate slug
            this.$watch('newPost.title', (newTitle) => {
                if (newTitle && (!this.newPost.slug || this.newPost.slug === this.generateSlug(this.newPost.title))) {
                    this.newPost.slug = this.generateSlug(newTitle);
                }
            });
            
            // Khởi tạo Lucide icons sau khi Alpine.js render xong
            this.$nextTick(() => {
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
            
            // Khởi tạo jModal cho modal thêm bài viết
            if (window.jModal) {
                window.jModal.init('#addPostModal', {
                    onOpen: () => {
                        // Reset form khi mở modal
                        this.resetNewPostForm();
                        // Re-initialize Lucide icons
                        if (window.lucide) {
                            requestAnimationFrame(() => window.lucide.createIcons());
                        }
                    }
                });
            }
        },
        
        /**
         * Load danh sách bài viết từ API hoặc dữ liệu mẫu
         */
        async loadPosts() {
            this.isLoading = true;
            
            try {
                // Dữ liệu mẫu (simulated data)
                this.allPosts = [
                    {
                        id: 1,
                        title: 'sad',
                        status: 'draft',
                        editor: 'Classic editor',
                        author: 'dev',
                        category: 'Tải Roblox',
                        tags: [],
                        comments: 0,
                        date: '04/11/2025 lúc 1:48 chiều',
                        seo: {
                            keywords: '',
                            schema: 'Bài viết (BlogPosting)',
                            links: {
                                internal: 0,
                                external: 0,
                                broken: 0
                            }
                        }
                    },
                    {
                        id: 2,
                        title: 'Tải Hack Shindo Life VNG MOD APK',
                        status: 'published',
                        editor: 'Classic editor',
                        author: 'siteapkroblox',
                        category: 'Tải Roblox',
                        tags: [],
                        comments: 0,
                        date: '17/10/2025 lúc 4:44 chiều',
                        seo: {
                            keywords: '',
                            schema: 'Bài viết (BlogPosting)',
                            links: {
                                internal: 0,
                                external: 2,
                                broken: 0
                            }
                        }
                    },
                    {
                        id: 3,
                        title: 'Tải Hack Pet Simulator X VNG MOD APK',
                        status: 'published',
                        editor: 'Classic editor',
                        author: 'siteapkroblox',
                        category: 'Game',
                        tags: [],
                        comments: 0,
                        date: '17/10/2025 lúc 4:42 chiều',
                        seo: {
                            keywords: '',
                            schema: 'Bài viết (BlogPosting)',
                            links: {
                                internal: 0,
                                external: 2,
                                broken: 3
                            }
                        }
                    },
                    {
                        id: 4,
                        title: 'Hướng dẫn tải và cài đặt Roblox',
                        status: 'published',
                        editor: 'Classic editor',
                        author: 'admin',
                        category: 'Tải Roblox',
                        tags: ['roblox', 'hướng dẫn'],
                        comments: 5,
                        date: '16/10/2025 lúc 10:30 sáng',
                        seo: {
                            keywords: 'roblox, tải roblox',
                            schema: 'Bài viết (BlogPosting)',
                            links: {
                                internal: 3,
                                external: 1,
                                broken: 0
                            }
                        }
                    },
                    {
                        id: 5,
                        title: 'Top 10 game Roblox hay nhất 2025',
                        status: 'published',
                        editor: 'Classic editor',
                        author: 'admin',
                        category: 'Game',
                        tags: ['top game', 'roblox'],
                        comments: 12,
                        date: '15/10/2025 lúc 3:20 chiều',
                        seo: {
                            keywords: 'top game roblox',
                            schema: 'Bài viết (BlogPosting)',
                            links: {
                                internal: 5,
                                external: 2,
                                broken: 0
                            }
                        }
                    },
                    {
                        id: 6,
                        title: 'Cập nhật mới Roblox Studio',
                        status: 'published',
                        editor: 'Classic editor',
                        author: 'admin',
                        category: 'Tin tức',
                        tags: ['roblox studio'],
                        comments: 8,
                        date: '14/10/2025 lúc 2:15 chiều',
                        seo: {
                            keywords: 'roblox studio',
                            schema: 'Bài viết (BlogPosting)',
                            links: {
                                internal: 2,
                                external: 1,
                                broken: 0
                            }
                        }
                    },
                    {
                        id: 7,
                        title: 'Bài viết mẫu chưa hoàn thành',
                        status: 'published',
                        editor: 'Classic editor',
                        author: 'editor',
                        category: 'Tin tức',
                        tags: [],
                        comments: 0,
                        date: '13/10/2025 lúc 11:00 sáng',
                        seo: {
                            keywords: '',
                            schema: 'Bài viết (BlogPosting)',
                            links: {
                                internal: 0,
                                external: 0,
                                broken: 0
                            }
                        }
                    }
                ];
                
                // Cập nhật danh sách hiển thị
                this.updateDisplayedPosts();
                
            } catch (error) {
                console.error('Error loading posts:', error);
                if (window.fastNotice) {
                    window.fastNotice.show('Có lỗi xảy ra khi tải danh sách bài viết', 'error');
                }
            } finally {
                this.isLoading = false;
            }
        },
        
        /**
         * Xử lý khi filter thay đổi - cập nhật danh sách hiển thị
         */
        handleFilterChange() {
            this.updateDisplayedPosts();
        },
        
        /**
         * Cập nhật danh sách bài viết hiển thị dựa trên các bộ lọc
         */
        updateDisplayedPosts() {
            let filtered = [...this.allPosts];
            
            // Lọc theo trạng thái
            if (this.statusFilter !== 'all') {
                if (this.statusFilter === 'mine') {
                    // Giả sử user hiện tại là 'admin' hoặc 'dev'
                    filtered = filtered.filter(post => post.author === 'admin' || post.author === 'dev');
                } else {
                    filtered = filtered.filter(post => post.status === this.statusFilter);
                }
            }
            
            // Lọc theo tìm kiếm
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase().trim();
                filtered = filtered.filter(post => 
                    post.title.toLowerCase().includes(query) ||
                    post.author.toLowerCase().includes(query) ||
                    post.category.toLowerCase().includes(query)
                );
            }
            
            // Lọc theo danh mục
            if (this.categoryFilter) {
                filtered = filtered.filter(post => {
                    // Nếu categoryFilter là tên danh mục, so sánh trực tiếp
                    return post.category === this.categoryFilter;
                });
            }
            
            // Sắp xếp
            filtered.sort((a, b) => {
                let aVal, bVal;
                
                switch (this.sortField) {
                    case 'title':
                        aVal = a.title.toLowerCase();
                        bVal = b.title.toLowerCase();
                        break;
                    case 'date':
                        aVal = new Date(a.date);
                        bVal = new Date(b.date);
                        break;
                    case 'comments':
                        aVal = a.comments || 0;
                        bVal = b.comments || 0;
                        break;
                    default:
                        aVal = a.date;
                        bVal = b.date;
                }
                
                if (this.sortOrder === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
            
            this.displayedPosts = filtered;
            this.totalPosts = filtered.length;
        },
        
        /**
         * Tìm kiếm bài viết
         */
        searchPosts() {
            this.updateDisplayedPosts();
        },
        
        /**
         * Sắp xếp theo trường
         */
        sortBy(field) {
            if (this.sortField === field) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortField = field;
                this.sortOrder = 'desc';
            }
            this.updateDisplayedPosts();
        },
        
        /**
         * Chọn/bỏ chọn tất cả
         */
        toggleSelectAll(event) {
            if (event.target.checked) {
                this.selectedPosts = this.displayedPosts.map(post => post.id);
            } else {
                this.selectedPosts = [];
            }
        },
        
        /**
         * Áp dụng hành động hàng loạt
         */
        applyBulkAction() {
            if (!this.bulkAction) {
                if (window.fastNotice) {
                    window.fastNotice.show('Vui lòng chọn hành động', 'warning');
                }
                return;
            }
            
            if (this.selectedPosts.length === 0) {
                if (window.fastNotice) {
                    window.fastNotice.show('Vui lòng chọn ít nhất một bài viết', 'warning');
                }
                return;
            }
            
            // Xử lý hành động hàng loạt
            switch (this.bulkAction) {
                case 'delete':
                    this.deletePosts(this.selectedPosts);
                    break;
                case 'restore':
                    this.restorePosts(this.selectedPosts);
                    break;
                case 'publish':
                    this.publishPosts(this.selectedPosts);
                    break;
                case 'draft':
                    this.draftPosts(this.selectedPosts);
                    break;
                case 'edit':
                    // Redirect to edit page with selected IDs
                    window.location.href = `/edit-post.html?ids=${this.selectedPosts.join(',')}`;
                    break;
            }
            
            // Reset
            this.bulkAction = '';
            this.selectedPosts = [];
        },
        
        /**
         * Xóa bài viết
         */
        deletePosts(postIds) {
            if (confirm(`Bạn có chắc chắn muốn xóa ${postIds.length} bài viết đã chọn?`)) {
                this.allPosts = this.allPosts.filter(post => !postIds.includes(post.id));
                this.updateDisplayedPosts();
                if (window.fastNotice) {
                    window.fastNotice.show('Đã xóa bài viết thành công', 'success');
                }
            }
        },
        
        /**
         * Khôi phục bài viết
         */
        restorePosts(postIds) {
            this.allPosts = this.allPosts.map(post => {
                if (postIds.includes(post.id)) {
                    return { ...post, status: 'draft' };
                }
                return post;
            });
            this.updateDisplayedPosts();
            if (window.fastNotice) {
                window.fastNotice.show('Đã khôi phục bài viết thành công', 'success');
            }
        },
        
        /**
         * Xuất bản bài viết
         */
        publishPosts(postIds) {
            this.allPosts = this.allPosts.map(post => {
                if (postIds.includes(post.id)) {
                    return { ...post, status: 'published' };
                }
                return post;
            });
            this.updateDisplayedPosts();
            if (window.fastNotice) {
                window.fastNotice.show('Đã xuất bản bài viết thành công', 'success');
            }
        },
        
        /**
         * Chuyển sang bản nháp
         */
        draftPosts(postIds) {
            this.allPosts = this.allPosts.map(post => {
                if (postIds.includes(post.id)) {
                    return { ...post, status: 'draft' };
                }
                return post;
            });
            this.updateDisplayedPosts();
            if (window.fastNotice) {
                window.fastNotice.show('Đã chuyển bài viết sang bản nháp', 'success');
            }
        },
        
        /**
         * Áp dụng bộ lọc
         */
        applyFilters() {
            this.updateDisplayedPosts();
            if (window.fastNotice) {
                window.fastNotice.show('Đã áp dụng bộ lọc', 'success');
            }
        },
        
        /**
         * Chỉnh sửa SEO
         */
        editSEO(postId) {
            // Redirect to SEO edit page
            window.location.href = `/edit-seo.html?id=${postId}`;
        },
        
        /**
         * Mở modal thêm bài viết
         */
        openAddPostModal() {
            if (window.jModal) {
                window.jModal.open('addPostModal');
            } else {
                console.error('jModal library not loaded');
            }
        },
        
        /**
         * Đóng modal thêm bài viết
         */
        closeAddPostModal() {
            if (window.jModal) {
                window.jModal.close('addPostModal');
            }
        },
        
        /**
         * Reset form tạo bài viết
         */
        resetNewPostForm() {
            this.newPost = {
                title: '',
                slug: '',
                content: '',
                category: '',
                tagsInput: '',
                featuredImage: '',
                seoKeywords: '',
                seoDescription: '',
                isDraft: false
            };
        },
        
        /**
         * Tạo slug từ tiêu đề
         */
        generateSlug(title) {
            if (!title) return '';
            return title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        },
        
        /**
         * Chọn hình ảnh đại diện
         */
        selectFeaturedImage() {
            // TODO: Implement image picker
            const url = prompt('Nhập URL hình ảnh:');
            if (url) {
                this.newPost.featuredImage = url;
            }
        },
        
        /**
         * Tạo bài viết mới
         */
        async createPost() {
            // Validate form
            if (!this.newPost.title || !this.newPost.content || !this.newPost.category) {
                if (window.fastNotice) {
                    window.fastNotice.show('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
                }
                return;
            }
            
            this.isCreatingPost = true;
            
            try {
                // Parse tags
                const tags = this.newPost.tagsInput
                    ? this.newPost.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
                    : [];
                
                // Generate slug if empty
                if (!this.newPost.slug) {
                    this.newPost.slug = this.generateSlug(this.newPost.title);
                }
                
                // Create post object
                const postData = {
                    id: Date.now(), // Temporary ID
                    title: this.newPost.title,
                    slug: this.newPost.slug,
                    content: this.newPost.content,
                    status: this.newPost.isDraft ? 'draft' : 'published',
                    editor: 'Classic editor',
                    author: 'admin', // TODO: Get from current user
                    category: this.newPost.category,
                    tags: tags,
                    comments: 0,
                    date: new Date().toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }),
                    featuredImage: this.newPost.featuredImage,
                    seo: {
                        keywords: this.newPost.seoKeywords || '',
                        schema: 'Bài viết (BlogPosting)',
                        description: this.newPost.seoDescription || '',
                        links: {
                            internal: 0,
                            external: 0,
                            broken: 0
                        }
                    }
                };
                
                // Add to posts list
                this.allPosts.unshift(postData);
                
                // Update stats
                if (postData.status === 'draft') {
                    this.stats.draft++;
                } else {
                    this.stats.published++;
                }
                this.stats.all++;
                this.stats.mine++;
                
                // Update displayed posts
                this.updateDisplayedPosts();
                
                // Close modal and reset form
                this.closeAddPostModal();
                this.resetNewPostForm();
                
                // Show success message
                if (window.fastNotice) {
                    window.fastNotice.show(
                        postData.status === 'draft' 
                            ? 'Đã lưu bản nháp thành công' 
                            : 'Đã xuất bản bài viết thành công',
                        'success'
                    );
                }
                
                // TODO: Send to API
                // await this.savePostToAPI(postData);
                
            } catch (error) {
                console.error('Error creating post:', error);
                if (window.fastNotice) {
                    window.fastNotice.show('Có lỗi xảy ra khi tạo bài viết', 'error');
                }
            } finally {
                this.isCreatingPost = false;
            }
        }
    };
}

