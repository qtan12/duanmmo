document.addEventListener('DOMContentLoaded', function() {
    // Initialize Related Products Slider
    const relatedProductsSlider = document.querySelector('.related-products-slider');
    if (relatedProductsSlider) {
        new BlazeSlider(relatedProductsSlider, {
            all: {
                enableAutoplay: true,
                autoplayInterval: 3000,
                slidesToShow: 3,
            },
            
        });
    }
    // Initialize BlazeSlider for hot products
    const hotProductsSlider = document.querySelector('.hot-products-slider');
    if (hotProductsSlider) {
        new BlazeSlider(hotProductsSlider, {
            all: {
                enableAutoplay: true,
                autoplayInterval: 50000,
                transitionDuration: 500,
                slidesToShow: 2,
            },
            '(max-width: 640px)': {
                slidesToShow: 1,
            }
        });
    }

    // Initialize Testimonials Slider
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (testimonialsSlider) {
        new BlazeSlider(testimonialsSlider, {
            all: {
                enableAutoplay: true,
                autoplayInterval: 5000,
                slidesToShow: 1,
            },
            '(min-width: 1000px)': {
                slidesToShow: 2,
            }
        });
    }

    // Initialize Flash-sale Slider (2 rows layout like Hero)
    const flashSliderEl = document.querySelector('.flash-sale-slider');
    if (flashSliderEl) {
        var flashSlider = new BlazeSlider(flashSliderEl, {
            all: {
                enableAutoplay: true,
                autoplayInterval: 2000,
                transitionDuration: 500,
                slidesToShow: 1.2,
                autoPlay: true,
            },
            '(min-width: 768px) and (max-width: 1024px)': {
                slidesToShow: 2,
            },
            '(min-width: 1024px)': {
                slidesToShow: 2.8,
            },
            '(min-width: 1240px)': {
                slidesToShow: 3.5,
            }
        });
        
        flashSliderEl.addEventListener('mouseenter', () => {
            flashSlider.stopAutoplay();
        });

        flashSliderEl.addEventListener('mouseleave', () => {
            flashSlider.refresh();
        });
    }

   

    // Countdown Flash-sale (đếm ngược tới 23:59 hôm nay)
    const hEl = document.getElementById('fs-h');
    const mEl = document.getElementById('fs-m');
    const sEl = document.getElementById('fs-s');
    if (hEl && mEl && sEl) {
        function nextMidnight() {
            const now = new Date();
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            if (end <= now) end.setDate(end.getDate() + 1);
            return end;
        }
        let endTime = nextMidnight();
        function pad(n){return n.toString().padStart(2,'0');}
        function tick() {
            const now = new Date();
            let diff = Math.max(0, endTime - now);
            const hours = Math.floor(diff / 3600000);
            diff -= hours * 3600000;
            const minutes = Math.floor(diff / 60000);
            diff -= minutes * 60000;
            const seconds = Math.floor(diff / 1000);
            hEl.textContent = pad(hours);
            mEl.textContent = pad(minutes);
            sEl.textContent = pad(seconds);
            if (hours === 0 && minutes === 0 && seconds === 0) {
                endTime = nextMidnight();
            }
        }
        tick();
        setInterval(tick, 1000);
    }
     // Initialize Product Thumbnails Slider (chỉ khi có >= 5 ảnh)
     const thumbnailsSlider = document.querySelector('.product-thumbnails-slider');
     if (thumbnailsSlider) {
         const slides = thumbnailsSlider.querySelectorAll('.blaze-slide');
         const slideCount = slides.length;
         
          if (slideCount >= 5) {
              // Có từ 5 ảnh trở lên -> khởi tạo slider
              new BlazeSlider(thumbnailsSlider, {
                  all: {
                      slidesToShow: 4,
                      slidesToScroll: 1,
                      enableAutoplay: false,
                      loop: false, // Không lặp vòng
                      enablePagination: false, // Tắt pagination dots
                  },
                  '(min-width: 640px)': {
                      slidesToShow: 5,
                  },
                  '(min-width: 900px)': {
                     slidesToShow: 6,
                 },
                  '(min-width: 1024px)': {
                      slidesToShow: 5,
                  }
              });
          } else {
              // Dưới 5 ảnh -> hiển thị dạng grid bình thường
              const track = thumbnailsSlider.querySelector('.blaze-track');
              if (track) {
                  track.style.display = 'grid';
                  track.style.gridTemplateColumns = `repeat(auto-fit, minmax(4rem, 1fr))`;
                  track.style.gap = '0.5rem';
                  track.style.maxWidth = `${slideCount * 5}rem`; // Giới hạn width để không bị giãn
              }
              // Ẩn nút navigation
              const prevBtn = thumbnailsSlider.querySelector('.blaze-prev');
              const nextBtn = thumbnailsSlider.querySelector('.blaze-next');
              if (prevBtn) prevBtn.style.display = 'none';
              if (nextBtn) nextBtn.style.display = 'none';
          }
     }
});