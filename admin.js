function getPosts() {
    return JSON.parse(localStorage.getItem("posts")) || [];
}

function savePosts(data) {
    localStorage.setItem("posts", JSON.stringify(data));
}

/* ================= RENDER ================= */
function renderAdmin() {
    let posts = getPosts();
    let container = document.getElementById("admin-posts");

    container.innerHTML = "";

    posts.forEach((post, index) => {
        container.innerHTML += `
        <div class="card">
            <h3>${post.title}</h3>
            <small>${post.category} | ${post.date}</small><br><br>

            <button onclick="editPost(${index})">✏️ Edit</button>
            <button onclick="deletePost(${index})">🗑 Delete</button>
        </div>
        `;
    });
}

/* ================= ADD / UPDATE ================= */
let editIndex = null;

function savePost() {
    let title = document.getElementById("title").value.trim();
    let content = document.getElementById("content").value.trim();
    let category = document.getElementById("category").value.trim();
    let image = document.getElementById("image").value.trim();

    if (!title || !content) {
        alert("Fill required fields");
        return;
    }

    let posts = getPosts();

    let newPost = {
        id: Date.now(),
        title,
        content,
        category: category || "General",
        date: new Date().toISOString().split("T")[0],
        image: image || `https://picsum.photos/600/300?random=${Date.now()}`
    };

    if (editIndex !== null) {
        posts[editIndex] = newPost;
        editIndex = null;
    } else {
        posts.unshift(newPost);
    }

    savePosts(posts);

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    document.getElementById("category").value = "";
    document.getElementById("image").value = "";

    renderAdmin();
}

/* ================= EDIT ================= */
function editPost(index) {
    let post = getPosts()[index];

    document.getElementById("title").value = post.title;
    document.getElementById("content").value = post.content;
    document.getElementById("category").value = post.category;
    document.getElementById("image").value = post.image;

    editIndex = index;
}

/* ================= DELETE ================= */
function deletePost(index) {
    let posts = getPosts();

    if (!confirm("Delete this post?")) return;

    posts.splice(index, 1);
    savePosts(posts);

    renderAdmin();
}

/* INIT */
renderAdmin();