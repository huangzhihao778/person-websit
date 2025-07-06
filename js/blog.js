// 博客交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 博客搜索功能 (如果添加了搜索框)
    const searchForm = document.querySelector('.blog-search');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input').value.trim();
            if (searchTerm) {
                // 实际项目中这里应该是AJAX请求或过滤已有内容
                alert('搜索功能: ' + searchTerm);
                // window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
    
    // 分类筛选
    const categoryLinks = document.querySelectorAll('.category-filter a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            // 实际项目中这里应该是AJAX请求或过滤已有内容
            console.log('筛选分类:', category);
        });
    });
    
    // 阅读进度指示器 (单篇文章页面)
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    if (document.querySelector('.single-post')) {
        window.addEventListener('scroll', function() {
            const post = document.querySelector('.single-post article');
            const postHeight = post.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            const progress = (scrollTop / (postHeight - windowHeight)) * 100;
            progressBar.style.width = Math.min(100, progress) + '%';
        });
    }
    
    // 代码高亮 (如果有代码示例)
    document.querySelectorAll('pre code').forEach(block => {
        // 实际项目中可以使用highlight.js等库
        // hljs.highlightBlock(block);
    });
    
    // 图片灯箱 (文章内图片)
    document.querySelectorAll('.post-content img').forEach(img => {
        if (!img.closest('a')) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function() {
                // 使用之前定义的灯箱功能
                const lightbox = document.querySelector('.lightbox');
                const lightboxImg = lightbox.querySelector('img');
                const lightboxCaption = lightbox.querySelector('.lightbox-caption');
                
                lightboxImg.src = this.src;
                lightboxCaption.textContent = this.alt || '';
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        }
    });
});