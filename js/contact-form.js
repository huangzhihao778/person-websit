document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // 显示成功消息
            const successMsg = document.createElement('div');
            successMsg.className = 'form-success';
            successMsg.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>感谢您的留言！我会尽快回复您。</p>
            `;
            contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);
            
            // 重置表单
            contactForm.reset();
            
            // 3秒后淡出成功消息
            setTimeout(() => {
                successMsg.style.opacity = '0';
                setTimeout(() => {
                    successMsg.remove();
                }, 300);
            }, 3000);
            
            // 实际项目中这里应该是AJAX请求
            console.log('表单提交:', formObject);
        });
    }
});