// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单按钮
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '<span></span><span></span><span></span>';
    document.querySelector('header').appendChild(menuBtn);
    
    const nav = document.querySelector('nav');
    
    menuBtn.addEventListener('click', function() {
        nav.classList.toggle('show');
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 如果是移动端，关闭菜单
                if (window.innerWidth <= 768) {
                    nav.classList.remove('show');
                }
            }
        });
    });
    
    // 当前页面高亮
    const currentPage = location.pathname.split('/').pop().replace('.html', '');
    if (currentPage) {
        const links = document.querySelectorAll('nav a');
        links.forEach(link => {
            const linkPage = link.getAttribute('href').replace('.html', '');
            if (linkPage === currentPage || 
                (currentPage === 'index' && linkPage === '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
});