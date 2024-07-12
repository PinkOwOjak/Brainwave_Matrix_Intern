document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    const blogContainer = document.getElementById('blog-container');
    const loginFormContainer = document.getElementById('login-form-container');
    const signupFormContainer = document.getElementById('signup-form-container');

    document.getElementById('show-signup').addEventListener('click', () => {
        loginFormContainer.style.display = 'none';
        signupFormContainer.style.display = 'block';
    });

    document.getElementById('show-login').addEventListener('click', () => {
        signupFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.find(user => user.username === username)) {
            alert('Username already exists. Please choose another one.');
        } else {
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Signup successful! Please login.');
            signupFormContainer.style.display = 'none';
            loginFormContainer.style.display = 'block';
        }
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            authContainer.style.display = 'none';
            blogContainer.style.display = 'block';
            loadBlogs();
        } else {
            alert('Invalid username or password.');
        }
    });

    document.getElementById('new-blog-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const content = document.getElementById('blog-content').value;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const blogs = JSON.parse(localStorage.getItem('blogs')) || [];

        blogs.push({
            id: Date.now(),
            username: currentUser.username,
            content,
            upvotes: 0,
            downvotes: 0,
            upvotedBy: [],
            downvotedBy: [],
            comments: []
        });

        localStorage.setItem('blogs', JSON.stringify(blogs));
        document.getElementById('blog-content').value = '';
        loadBlogs();
    });

    function loadBlogs() {
        const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        const blogsDiv = document.getElementById('blogs');
        blogsDiv.innerHTML = '';

        blogs.forEach(blog => {
            const blogDiv = document.createElement('div');
            blogDiv.className = 'blog-post';
            blogDiv.innerHTML = `
                <p><strong>${blog.username}</strong></p>
                <p>${blog.content}</p>
                <div class="reactions">
                    <button onclick="upvoteBlog(${blog.id})">Upvote (${blog.upvotes})</button>
                    <button onclick="downvoteBlog(${blog.id})">Downvote (${blog.downvotes})</button>
                </div>
                <div class="comments">
                    <textarea placeholder="Write a comment..." onkeypress="if(event.keyCode == 13) addComment(${blog.id}, this.value)"></textarea>
                    <div class="comments-list">
                        ${blog.comments.map(comment => `<p>${comment}</p>`).join('')}
                    </div>
                </div>
            `;
            blogsDiv.appendChild(blogDiv);
        });
    }

    window.upvoteBlog = function(blogId) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        const blog = blogs.find(blog => blog.id === blogId);

        if (!blog.upvotedBy.includes(currentUser.username)) {
            blog.upvotes++;
            blog.upvotedBy.push(currentUser.username);
            blog.downvotedBy = blog.downvotedBy.filter(user => user !== currentUser.username); 
            localStorage.setItem('blogs', JSON.stringify(blogs));
            loadBlogs();
        } else {
            alert('You have already upvoted this blog.');
        }
    };

    window.downvoteBlog = function(blogId) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        const blog = blogs.find(blog => blog.id === blogId);

        if (!blog.downvotedBy.includes(currentUser.username)) {
            blog.downvotes++;
            blog.downvotedBy.push(currentUser.username);
            blog.upvotedBy = blog.upvotedBy.filter(user => user !== currentUser.username);
            localStorage.setItem('blogs', JSON.stringify(blogs));
            loadBlogs();
        } else {
            alert('You have already downvoted this blog.');
        }
    };

    window.addComment = function(blogId, comment) {
        const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        const blog = blogs.find(blog => blog.id === blogId);
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (comment.trim()) {
            blog.comments.push(`${currentUser.username}: ${comment}`);
            localStorage.setItem('blogs', JSON.stringify(blogs));
            loadBlogs();
        }
    };
});
