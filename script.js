const container = document.getElementById("blog-container");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");

/* ================= INIT DEFAULT POSTS ================= */
function initPosts() {
    let saved = JSON.parse(localStorage.getItem("posts"));

    if (!saved || saved.length === 0) {
        localStorage.setItem("posts", JSON.stringify(defaultPosts));
    } else {
        // merge default + saved (important fix)
        let merged = [...defaultPosts, ...saved];
        localStorage.setItem("posts", JSON.stringify(merged));
    }
}

/* ================= GET POSTS ================= */
function getPosts() {
    return JSON.parse(localStorage.getItem("posts")) || [];
}

/* ================= RENDER POSTS ================= */
function renderPosts(data) {
    if (!container) return;

    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<h3>No posts found</h3>";
        return;
    }

    data.forEach(post => {
        container.innerHTML += `
        <div class="card">
            <img src="${post.image}" class="post-img"
            onerror="this.onerror=null; this.src='https://picsum.photos/600/300';">

            <span class="badge">${post.category}</span>

            <h2>${post.title}</h2>

            <p>${post.content.substring(0, 120)}...</p>

            <small>${post.date}</small>

            <button onclick="openPost(${post.id})">Read More</button>
        </div>
        `;
    });
}

/* ================= SEARCH + FILTER ================= */
function filterPosts() {
    let value = (searchInput?.value || "").toLowerCase();
    let category = categoryFilter?.value || "All";

    let posts = getPosts();

    let filtered = posts.filter(post => {
        let title = post.title.toLowerCase();
        let content = post.content.toLowerCase();

        let matchSearch =
            title.includes(value) ||
            content.includes(value);

        let matchCategory =
            category === "All" ||
            post.category === category;

        return matchSearch && matchCategory;
    });

    renderPosts(filtered);
}

/* ================= OPEN POST ================= */
function openPost(id) {
    localStorage.setItem("postId", id);
    window.location.href = "post.html";
}

/* ================= LOAD SINGLE POST (FIXED) ================= */
function loadPost() {
    // ✅ RUN ONLY IF ELEMENT EXISTS (post.html)
    const titleEl = document.getElementById("post-title");
    if (!titleEl) return;

    let id = localStorage.getItem("postId");
    if (!id) return;

    let post = getPosts().find(p => p.id == id);
    if (!post) return;

    titleEl.innerText = post.title;
    document.getElementById("post-content").innerText = post.content;
    document.getElementById("post-meta").innerText = post.date;

    let img = document.getElementById("post-image");
    if (img) img.src = post.image;
}

/* ================= DARK MODE ================= */
function toggleTheme() {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

function loadTheme() {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }
}

/* ================= AI GENERATOR ================= */
let generatedContent = "";
let generatedTopic = "";

function generateAI() {
    let topic = document.getElementById("ai-topic").value.trim();
    if (!topic) return alert("Enter topic!");

    generatedTopic = topic;

    generatedContent = `
${topic.toUpperCase()} GUIDE

${topic} is an important concept in the modern digital world.

WHY IT MATTERS:
- Improves skills
- Boosts career growth
- Enhances knowledge

KEY AREAS:
- Basics
- Practical use
- Advanced concepts

TIPS:
1. Learn fundamentals
2. Practice regularly
3. Build real projects
4. Stay updated

CONCLUSION:
Start learning ${topic} today and grow your expertise.
    `;

    document.getElementById("ai-output").innerText = generatedContent;
    document.getElementById("saveBtn").style.display = "inline-block";
}

function saveAI() {
    let posts = getPosts();

    let newPost = {
        id: Date.now(),
        title: generatedTopic,
        content: generatedContent,
        category: "AI Generated",
        date: new Date().toISOString().split("T")[0],
        image: `https://picsum.photos/600/300?random=${Date.now()}`
    };

    posts.unshift(newPost);

    localStorage.setItem("posts", JSON.stringify(posts));

    alert("Saved!");

    renderPosts(getPosts());
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
    initPosts();
    loadTheme();
    renderPosts(getPosts());
    loadPost();

    if (searchInput) {
        searchInput.addEventListener("input", filterPosts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterPosts);
    }
});