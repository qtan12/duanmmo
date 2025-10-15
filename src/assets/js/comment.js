// Comment System
    function commentSystem() {
      return {
        // Data
        totalComments: 8,
        visibleComments: [],
        allComments: [],
        commentsPerPage: 3,
        currentPage: 1,
        loadingMore: false,

        // Forms
        commentForm: {
          name: '',
          email: '',
          content: '',
          notify: false,
          submitting: false,
          errors: {}
        },

        replyForm: {
          name: '',
          email: '',
          content: '',
          submitting: false
        },

        // Computed
        get hasMoreComments() {
          return this.visibleComments.length < this.allComments.length;
        },

        get remainingComments() {
          return this.allComments.length - this.visibleComments.length;
        },

        // Methods
        init() {
          this.loadComments();

          // Initialize Lucide icons after DOM is ready
          this.$nextTick(() => {
            lucide.createIcons();
          });
        },

        loadComments() {
          // Sample comments data
          this.allComments = [
            {
              id: 1,
              name: 'Minh Tuấn',
              email: 'minhtuan@example.com',
              content: 'Bài viết rất hay! Mình đã sử dụng proxy miễn phí trước đây và thực sự gặp nhiều vấn đề về tốc độ và bảo mật. Sau khi chuyển sang proxy trả phí thì hiệu quả hơn rất nhiều.',
              timeAgo: '2 giờ trước',
              likes: 12,
              dislikes: 0,
              userVote: null,
              initial: 'M',
              avatarBg: 'bg-emerald-100',
              avatarText: 'text-emerald-600',
              showReply: false,
              replies: [
                {
                  id: 1,
                  name: 'Admin MMO Store',
                  email: 'admin@mmostore.com',
                  content: 'Cảm ơn bạn đã chia sẻ kinh nghiệm! Đúng vậy, việc đầu tư vào proxy chất lượng sẽ mang lại hiệu quả lâu dài hơn nhiều so với việc sử dụng proxy miễn phí.',
                  timeAgo: '1 giờ trước',
                  likes: 5,
                  dislikes: 0,
                  userVote: null,
                  initial: 'A',
                  avatarBg: 'bg-blue-100',
                  avatarText: 'text-blue-600'
                }
              ]
            },
            {
              id: 2,
              name: 'Hương Lan',
              email: 'huonglan@example.com',
              content: 'Mình đang tìm hiểu về proxy cho dự án SEO. Bạn có thể recommend một số nhà cung cấp proxy uy tín không? Mình nghe nói MMO Store có dịch vụ proxy tốt.',
              timeAgo: '5 giờ trước',
              likes: 8,
              dislikes: 0,
              userVote: null,
              initial: 'H',
              avatarBg: 'bg-purple-100',
              avatarText: 'text-purple-600',
              showReply: false,
              replies: []
            },
            {
              id: 3,
              name: 'Đức Minh',
              email: 'ducminh@example.com',
              content: 'Bài viết rất chi tiết và hữu ích! Mình đã bookmark lại để tham khảo. Cảm ơn admin đã chia sẻ những thông tin quan trọng về proxy.',
              timeAgo: '1 ngày trước',
              likes: 15,
              dislikes: 0,
              userVote: null,
              initial: 'D',
              avatarBg: 'bg-orange-100',
              avatarText: 'text-orange-600',
              showReply: false,
              replies: []
            },
            {
              id: 4,
              name: 'Thảo Nguyên',
              email: 'thaonguyen@example.com',
              content: 'Mình đã sử dụng proxy của MMO Store được 3 tháng rồi, chất lượng rất tốt. Tốc độ nhanh và ổn định.',
              timeAgo: '2 ngày trước',
              likes: 6,
              dislikes: 0,
              userVote: null,
              initial: 'T',
              avatarBg: 'bg-pink-100',
              avatarText: 'text-pink-600',
              showReply: false,
              replies: []
            },
            {
              id: 5,
              name: 'Văn Hùng',
              email: 'vanhung@example.com',
              content: 'Cảm ơn admin đã chia sẻ bài viết hữu ích. Mình sẽ thử sử dụng proxy trả phí để cải thiện hiệu suất công việc.',
              timeAgo: '3 ngày trước',
              likes: 4,
              dislikes: 0,
              userVote: null,
              initial: 'V',
              avatarBg: 'bg-indigo-100',
              avatarText: 'text-indigo-600',
              showReply: false,
              replies: []
            }
          ];

          this.visibleComments = this.allComments.slice(0, this.commentsPerPage);
        },

        async submitComment() {
          this.commentForm.submitting = true;
          this.commentForm.errors = {};

          // Validation
          if (!this.commentForm.name.trim()) {
            this.commentForm.errors.name = 'Vui lòng nhập tên';
          }
          if (!this.commentForm.email.trim()) {
            this.commentForm.errors.email = 'Vui lòng nhập email';
          } else if (!this.isValidEmail(this.commentForm.email)) {
            this.commentForm.errors.email = 'Email không hợp lệ';
          }
          if (!this.commentForm.content.trim()) {
            this.commentForm.errors.content = 'Vui lòng nhập nội dung bình luận';
          }

          if (Object.keys(this.commentForm.errors).length > 0) {
            this.commentForm.submitting = false;
            this.showNotification('Vui lòng kiểm tra lại thông tin đã nhập!', 'warning');
            return;
          }

          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Add new comment
          const newComment = {
            id: Date.now(),
            name: this.commentForm.name,
            email: this.commentForm.email,
            content: this.commentForm.content,
            timeAgo: 'Vừa xong',
            likes: 0,
            dislikes: 0,
            userVote: null,
            initial: this.commentForm.name.charAt(0).toUpperCase(),
            avatarBg: this.getRandomAvatarBg(),
            avatarText: this.getRandomAvatarText(),
            showReply: false,
            replies: []
          };

          this.allComments.unshift(newComment);
          this.totalComments++;

          // Reset form
          this.commentForm = {
            name: '',
            email: '',
            content: '',
            notify: false,
            submitting: false,
            errors: {}
          };

          // Show success message
          this.showNotification('Bình luận đã được gửi thành công!', 'success');

          // Reinitialize Lucide icons
          this.$nextTick(() => {
            lucide.createIcons();
          });
        },

        async submitReply(commentId) {
          this.replyForm.submitting = true;

          // Validation for reply form
          if (!this.replyForm.name.trim() || !this.replyForm.email.trim() || !this.replyForm.content.trim()) {
            this.replyForm.submitting = false;
            this.showNotification('Vui lòng điền đầy đủ thông tin!', 'warning');
            return;
          }

          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));

          const comment = this.allComments.find(c => c.id === commentId);
          if (comment) {
            const newReply = {
              id: Date.now(),
              name: this.replyForm.name,
              email: this.replyForm.email,
              content: this.replyForm.content,
              timeAgo: 'Vừa xong',
              likes: 0,
              dislikes: 0,
              userVote: null,
              initial: this.replyForm.name.charAt(0).toUpperCase(),
              avatarBg: this.getRandomAvatarBg(),
              avatarText: this.getRandomAvatarText()
            };

            comment.replies.push(newReply);
            comment.showReply = false;
          }

          // Reset form
          this.replyForm = {
            name: '',
            email: '',
            content: '',
            submitting: false
          };

          this.showNotification('Trả lời đã được gửi thành công!', 'success');

          // Reinitialize Lucide icons
          this.$nextTick(() => {
            lucide.createIcons();
          });
        },

        toggleReply(commentId) {
          const comment = this.allComments.find(c => c.id === commentId);
          if (comment) {
            comment.showReply = !comment.showReply;

            // Reinitialize Lucide icons when reply form is shown
            if (comment.showReply) {
              this.$nextTick(() => {
                lucide.createIcons();
              });
            }
          }
        },

        cancelReply(commentId) {
          const comment = this.allComments.find(c => c.id === commentId);
          if (comment) {
            comment.showReply = false;
          }
          this.replyForm = {
            name: '',
            email: '',
            content: '',
            submitting: false
          };
        },

        voteComment(commentId, voteType) {
          const comment = this.allComments.find(c => c.id === commentId);
          if (!comment) return;

          if (comment.userVote === voteType) {
            // Remove vote
            if (voteType === 'like') comment.likes--;
            else comment.dislikes--;
            comment.userVote = null;
          } else {
            // Change vote
            if (comment.userVote === 'like') comment.likes--;
            else if (comment.userVote === 'dislike') comment.dislikes--;

            if (voteType === 'like') comment.likes++;
            else comment.dislikes++;
            comment.userVote = voteType;
          }

          // Show vote notification
          const voteMessage = voteType === 'like' ? 'Bạn đã thích bình luận này!' : 'Bạn đã không thích bình luận này!';
          this.showNotification(voteMessage, 'info');

          // Reinitialize Lucide icons after vote
          this.$nextTick(() => {
            lucide.createIcons();
          });
        },

        voteReply(commentId, replyId, voteType) {
          const comment = this.allComments.find(c => c.id === commentId);
          if (!comment) return;

          const reply = comment.replies.find(r => r.id === replyId);
          if (!reply) return;

          if (reply.userVote === voteType) {
            // Remove vote
            if (voteType === 'like') reply.likes--;
            else reply.dislikes--;
            reply.userVote = null;
          } else {
            // Change vote
            if (reply.userVote === 'like') reply.likes--;
            else if (reply.userVote === 'dislike') reply.dislikes--;

            if (voteType === 'like') reply.likes++;
            else reply.dislikes++;
            reply.userVote = voteType;
          }

          // Show vote notification for reply
          const voteMessage = voteType === 'like' ? 'Bạn đã thích trả lời này!' : 'Bạn đã không thích trả lời này!';
          this.showNotification(voteMessage, 'info');

          // Reinitialize Lucide icons after vote
          this.$nextTick(() => {
            lucide.createIcons();
          });
        },

        async loadMoreComments() {
          this.loadingMore = true;

          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          const startIndex = this.visibleComments.length;
          const endIndex = startIndex + this.commentsPerPage;
          const newComments = this.allComments.slice(startIndex, endIndex);

          if (newComments.length === 0) {
            this.loadingMore = false;
            this.showNotification('Không còn bình luận nào để tải thêm!', 'info');
            return;
          }

          this.visibleComments.push(...newComments);
          this.loadingMore = false;

          // Show load more notification
          this.showNotification(`Đã tải thêm ${newComments.length} bình luận!`, 'success');

          // Reinitialize Lucide icons
          this.$nextTick(() => {
            lucide.createIcons();
          });
        },

        // Utility functions
        isValidEmail(email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },

        getRandomAvatarBg() {
          const colors = ['bg-emerald-100', 'bg-blue-100', 'bg-purple-100', 'bg-orange-100', 'bg-pink-100', 'bg-indigo-100', 'bg-red-100', 'bg-yellow-100'];
          return colors[Math.floor(Math.random() * colors.length)];
        },

        getRandomAvatarText() {
          const colors = ['text-emerald-600', 'text-blue-600', 'text-purple-600', 'text-orange-600', 'text-pink-600', 'text-indigo-600', 'text-red-600', 'text-yellow-600'];
          return colors[Math.floor(Math.random() * colors.length)];
        },

        showNotification(message, type = 'info') {
          // Use FastNotice library for professional notifications
          const options = {
            title: type === 'success' ? 'Thành công!' :
              type === 'error' ? 'Lỗi!' :
                type === 'warning' ? 'Cảnh báo!' : 'Thông báo',
            duration: 4000
          };

          FastNotice.show(message, type, options);
        }
      }
    }