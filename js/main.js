/**
 * 吴曦浩翔个人网站 - 主JavaScript文件
 * 功能包括：
 * 1. 移动端菜单切换
 * 2. 当前页面导航高亮
 * 3. 平滑滚动
 * 4. 表单基础验证
 * 5. 页面加载效果
 */

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    // ==================== 1. 移动端菜单切换 ====================
    initializeMobileMenu();
    
    // ==================== 2. 当前页面导航高亮 ====================
    setActiveNavLink();
    
    // ==================== 3. 平滑滚动 ====================
    setupSmoothScrolling();
    
    // ==================== 4. 页面加载效果 ====================
    setupPageLoader();
    
    // ==================== 5. 表单基础验证 ====================
    setupFormValidation();
    
    // ==================== 6. 返回顶部按钮 ====================
    setupBackToTopButton();
    initializeMobileMenu();
    setActiveNavLink();
});

/**
 * 初始化移动端菜单
 */
function initializeMobileMenu() {
    // 创建移动端菜单按钮
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '<span></span><span></span><span></span>';
    menuBtn.setAttribute('aria-label', '菜单');
    document.querySelector('header').appendChild(menuBtn);
    
    const nav = document.querySelector('nav');
    
    // 菜单按钮点击事件
    menuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('show');
        
        // 切换aria-expanded状态
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
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
    
    // 窗口大小改变时重置菜单状态
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuBtn.classList.remove('active');
            nav.classList.remove('show');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });
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
            (currentPage === 'index' && linkPage === '')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

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
 * 设置平滑滚动
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // 排除不需要平滑滚动的情况
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
                    document.querySelector('nav').classList.remove('show');
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
 * 设置表单基础验证
 */
function setupFormValidation() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // 检查必填字段
            this.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // 添加错误提示
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = field.getAttribute('data-error') || '此字段为必填项';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                        field.nextElementSibling.remove();
                    }
                }
            });
            
            // 检查邮箱格式
            const emailFields = this.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value && !validateEmail(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                    
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = '请输入有效的邮箱地址';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
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
            }
        });
        
        // 实时验证输入
        this.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                        this.nextElementSibling.remove();
                    }
                }
            });
        });
    });
}

/**
 * 验证邮箱格式
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 工具函数：防抖
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
 * 工具函数：节流
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

// 当前页面高亮
function setActiveNavLink() {
    const currentPage = location.pathname.split('/').pop().replace('.html', '');
    if (currentPage) {
        const links = document.querySelectorAll('nav a');
        links.forEach(link => {
            const linkPage = link.getAttribute('href').replace('.html', '');
            if (linkPage === currentPage || 
                (currentPage === 'index' && linkPage === '') ||
                (currentPage === 'index' && linkPage === 'blog/index')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// 移动端菜单初始化
function initializeMobileMenu() {
    // 创建菜单按钮
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '<span></span><span></span><span></span>';
    menuBtn.setAttribute('aria-label', '切换导航菜单');
    document.querySelector('header').appendChild(menuBtn);
    
    const navList = document.querySelector('nav ul');
    
    // 菜单按钮点击事件
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navList.classList.toggle('show');
    });
    
    // 点击文档其他区域关闭菜单
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && !e.target.closest('.menu-btn')) {
            menuBtn.classList.remove('active');
            navList.classList.remove('show');
        }
    });
    
    // 菜单项点击后关闭菜单
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            menuBtn.classList.remove('active');
            navList.classList.remove('show');
        });
    });
    
    // 窗口大小改变时重置菜单状态
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuBtn.classList.remove('active');
            navList.classList.remove('show');
        }
    });
}
/**
 * 导航菜单初始化
 */
function initNavigation() {
    // 创建移动端菜单按钮
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '<span></span><span></span><span></span>';
    menuBtn.setAttribute('aria-label', '菜单');
    document.querySelector('header').appendChild(menuBtn);
    
    const navList = document.querySelector('nav ul');
    
    // 菜单按钮点击事件
    menuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('show');
    });
    
    // 点击文档其他区域关闭菜单
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && !e.target.closest('.menu-btn')) {
            menuBtn.classList.remove('active');
            navList.classList.remove('show');
        }
    });
    
    // 菜单项点击后关闭菜单
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuBtn.classList.remove('active');
                navList.classList.remove('show');
            }
        });
    });
    
    // 窗口大小改变时重置菜单
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuBtn.classList.remove('active');
            navList.classList.remove('show');
        }
    });
    
    // 设置当前活动页签
    setActiveNav();
}

/**
 * 设置当前活动页签
 */
function setActiveNav() {
    const currentPage = location.pathname.split('/').pop().replace('.html', '');
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').replace('.html', '');
        
        if ((currentPage === '' && linkPage === 'index') || 
            linkPage === currentPage ||
            (currentPage === 'index' && linkPage === '')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

