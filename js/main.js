/**
 * 吴曦浩翔个人网站 - 主JavaScript文件
 * 功能包括：
 * 1. 响应式导航菜单
 * 2. 页面滚动行为
 * 3. 表单验证
 * 4. 作品集筛选
 * 5. 图片灯箱
 * 6. 页面加载效果
 */

document.addEventListener('DOMContentLoaded', function() {
    // ==================== 1. 初始化移动端菜单 ====================
    initializeMobileMenu();
    
    // ==================== 2. 设置当前导航高亮 ====================
    setActiveNavLink();
    
    // ==================== 3. 设置平滑滚动 ====================
    setupSmoothScrolling();
    
    // ==================== 4. 初始化页面加载效果 ====================
    setupPageLoader();
    
    // ==================== 5. 初始化返回顶部按钮 ====================
    setupBackToTopButton();
    
    // ==================== 6. 初始化作品集筛选 ====================
    if (document.querySelector('.portfolio-filter')) {
        initPortfolioFilter();
    }
    
    // ==================== 7. 初始化图片灯箱 ====================
    if (document.querySelector('[data-lightbox]')) {
        initLightbox();
    }
    
    // ==================== 8. 初始化表单验证 ====================
    document.querySelectorAll('form').forEach(form => {
        initFormValidation(form);
    });
});

// ==================== 功能函数 ====================

/**
 * 初始化移动端菜单
 */
function initializeMobileMenu() {
    // 创建菜单按钮
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '<span></span><span></span><span></span>';
    menuBtn.setAttribute('aria-label', '切换导航菜单');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.querySelector('header').appendChild(menuBtn);
    
    const nav = document.querySelector('nav ul');
    
    // 菜单按钮点击事件
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.classList.toggle('active');
        nav.classList.toggle('show');
        this.setAttribute('aria-expanded', !isExpanded);
    });
    
    // 点击菜单外区域关闭菜单
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && e.target !== menuBtn) {
            menuBtn.classList.remove('active');
            nav.classList.remove('show');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // 菜单项点击后关闭菜单（移动端）
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuBtn.classList.remove('active');
                nav.classList.remove('show');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // 窗口大小改变时重置菜单状态
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth > 768) {
            menuBtn.classList.remove('active');
            nav.classList.remove('show');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    }, 100));
}

/**
 * 设置当前导航链接高亮
 */
function setActiveNavLink() {
    const currentPage = getCurrentPageName();
    if (!currentPage) return;
    
    const links = document.querySelectorAll('nav a');
    
    links.forEach(link => {
        const linkPage = getLinkPageName(link.getAttribute('href'));
        
        if (linkPage === currentPage || 
            (currentPage === 'index' && (linkPage === '' || linkPage === 'blog/index'))) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

/**
 * 设置平滑滚动
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // 排除特殊情况
            if (this.getAttribute('href') === '#' || 
                this.hasAttribute('data-no-smooth')) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 计算滚动位置（考虑固定头部高度）
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 如果是移动端，关闭菜单
                if (window.innerWidth <= 768) {
                    document.querySelector('.menu-btn').classList.remove('active');
                    document.querySelector('nav ul').classList.remove('show');
                }
                
                // 更新URL（不刷新页面）
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });
}

/**
 * 设置页面加载效果
 */
function setupPageLoader() {
    // 添加加载动画元素
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
        </div>
    `;
    document.body.appendChild(loader);
    
    // 页面加载完成后隐藏加载动画
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 300);
        }, 300);
    });
}

/**
 * 设置返回顶部按钮
 */
function setupBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '&uarr;';
    backToTopBtn.setAttribute('aria-label', '返回顶部');
    document.body.appendChild(backToTopBtn);
    
    // 滚动显示/隐藏按钮
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, 100));
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 初始化作品集筛选
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-options button');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 更新活动按钮
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // 筛选作品
            portfolioItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                } else {
                    const categories = item.getAttribute('data-category').split(' ');
                    if (categories.includes(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
                
                // 添加淡入动画
                if (item.style.display === 'block') {
                    item.style.animation = 'fadeIn 0.5s ease';
                }
            });
        });
    });
}

/**
 * 初始化图片灯箱
 */
function initLightbox() {
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
    
    // 收集所有灯箱图片
    document.querySelectorAll('[data-lightbox]').forEach((link, index) => {
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
        updateLightboxImage();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }
    
    function updateLightboxImage() {
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
}

/**
 * 初始化表单验证
 */
function initFormValidation(form) {
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        // 检查必填字段
        this.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                markFieldAsInvalid(field, '此字段为必填项');
            } else {
                markFieldAsValid(field);
                
                // 特殊字段验证
                if (field.type === 'email' && !validateEmail(field.value)) {
                    isValid = false;
                    markFieldAsInvalid(field, '请输入有效的邮箱地址');
                }
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            
            // 滚动到第一个错误字段
            const firstError = this.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        } else {
            // 表单验证通过，可以显示成功消息
            if (this.id === 'contact-form') {
                e.preventDefault();
                showFormSuccess(this, '感谢您的留言！我会尽快回复您。');
            }
        }
    });
    
    // 实时验证输入
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                markFieldAsValid(this);
            }
        });
    });
}

/**
 * 标记字段为无效
 */
function markFieldAsInvalid(field, message) {
    field.classList.add('error');
    
    // 添加或更新错误消息
    let errorMsg = field.nextElementSibling;
    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        field.parentNode.insertBefore(errorMsg, field.nextSibling);
    }
    errorMsg.textContent = message;
}

/**
 * 标记字段为有效
 */
function markFieldAsValid(field) {
    field.classList.remove('error');
    const errorMsg = field.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains('error-message')) {
        errorMsg.remove();
    }
}

/**
 * 显示表单成功消息
 */
function showFormSuccess(form, message) {
    // 移除旧的成功消息
    const oldSuccess = form.querySelector('.form-success');
    if (oldSuccess) oldSuccess.remove();
    
    // 创建成功消息元素
    const successMsg = document.createElement('div');
    successMsg.className = 'form-success';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>${message}</p>
    `;
    
    // 插入到表单后面
    form.parentNode.insertBefore(successMsg, form.nextSibling);
    
    // 重置表单
    form.reset();
    
    // 3秒后淡出
    setTimeout(() => {
        successMsg.style.opacity = '0';
        setTimeout(() => successMsg.remove(), 300);
    }, 3000);
}

// ==================== 工具函数 ====================

/**
 * 获取当前页面名称
 */
function getCurrentPageName() {
    const path = window.location.pathname;
    return path.split('/').pop().replace('.html', '').replace('.php', '');
}

/**
 * 获取链接页面名称
 */
function getLinkPageName(href) {
    if (!href) return '';
    
    // 处理外部链接
    if (href.startsWith('http') || href.startsWith('//')) return '';
    
    // 处理锚点链接
    if (href.startsWith('#')) return '';
    
    // 处理博客子目录
    if (href.includes('blog/')) {
        return href.split('blog/').pop().replace('.html', '');
    }
    
    return href.replace('.html', '');
}

/**
 * 验证邮箱格式
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * 防抖函数
 */
function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

/**
 * 节流函数
 */
function throttle(func, limit = 100) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}
