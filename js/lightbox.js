// 灯箱效果实现
document.addEventListener('DOMContentLoaded', function() {
    // 创建灯箱HTML结构
    const lightboxHTML = `
        <div class="lightbox">
            <div class="lightbox-content">
                <img src="" alt="">
                <div class="lightbox-caption"></div>
                <button class="lightbox-close">&times;</button>
                <div class="lightbox-nav">
                    <button class="lightbox-prev">&lt;</button>
                    <button class="lightbox-next">&gt;</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let images = [];
    
    // 初始化灯箱
    document.querySelectorAll('[data-lightbox="portfolio"]').forEach((link, index) => {
        images.push({
            src: link.getAttribute('href'),
            title: link.getAttribute('data-title') || ''
        });
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            currentImageIndex = index;
            openLightbox();
        });
    });
    
    function openLightbox() {
        const image = images[currentImageIndex];
        lightboxImg.src = image.src;
        lightboxCaption.textContent = image.title;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        const image = images[currentImageIndex];
        lightboxImg.src = image.src;
        lightboxCaption.textContent = image.title;
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        const image = images[currentImageIndex];
        lightboxImg.src = image.src;
        lightboxCaption.textContent = image.title;
    }
    
    // 事件监听
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('show')) return;
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
});