// 评论功能
document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('comment-form');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('comment-name').value.trim();
            const email = document.getElementById('comment-email').value.trim();
            const content = document.getElementById('comment-content').value.trim();
            
            if (!name || !email || !content) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 模拟提交评论 (实际项目中替换为AJAX请求)
            const commentList = document.querySelector('.comment-list');
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            newComment.innerHTML = `
                <div class="comment-author">
                    <img src="../images/blog/avatar-default.jpg" alt="用户头像" class="avatar">
                    <div class="author-info">
                        <h4>${name}</h4>
                        <span class="comment-date">刚刚</span>
                    </div>
                </div>
                <div class="comment-content">
                    <p>${content}</p>
                </div>
            `;
            
            commentList.prepend(newComment);
            
            // 重置表单
            commentForm.reset();
            
            // 显示成功消息
            const successMsg = document.createElement('div');
            successMsg.className = 'alert success';
            successMsg.textContent = '评论已提交，感谢您的参与！';
            commentForm.parentNode.insertBefore(successMsg, commentForm.nextSibling);
            
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
            
            // 实际项目中:
            // fetch('/api/comments', {
            //     method: 'POST',
            //     body: JSON.stringify({ name, email, content, postId }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // })
            // .then(response => response.json())
            // .then(data => {
            //     // 添加新评论到列表
            //     // 显示成功消息
            //     // 重置表单
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            //     alert('提交评论时出错，请稍后再试。');
            // });
        });
    }
    
    // 评论回复功能
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = this.getAttribute('data-comment-id');
            const replyForm = document.createElement('div');
            replyForm.className = 'reply-form';
            replyForm.innerHTML = `
                <form class="comment-reply-form">
                    <div class="form-group">
                        <textarea placeholder="写下你的回复..." rows="3" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-small">提交回复</button>
                    <button type="button" class="btn btn-small btn-cancel">取消</button>
                </form>
            `;
            
            this.parentNode.appendChild(replyForm);
            
            const cancelBtn = replyForm.querySelector('.btn-cancel');
            cancelBtn.addEventListener('click', function() {
                replyForm.remove();
            });
            
            const replyFormElement = replyForm.querySelector('form');
            replyFormElement.addEventListener('submit', function(e) {
                e.preventDefault();
                const replyContent = this.querySelector('textarea').value.trim();
                
                if (replyContent) {
                    // 模拟提交回复
                    const replyElement = document.createElement('div');
                    replyElement.className = 'comment-reply';
                    replyElement.innerHTML = `
                        <div class="comment-author">
                            <img src="../images/blog/avatar-default.jpg" alt="用户头像" class="avatar">
                            <div class="author-info">
                                <h4>你的名字</h4>
                                <span class="comment-date">刚刚</span>
                            </div>
                        </div>
                        <div class="comment-content">
                            <p>${replyContent}</p>
                        </div>
                    `;
                    
                    replyForm.parentNode.insertBefore(replyElement, replyForm);
                    replyForm.remove();
                }
            });
        });
    });
});