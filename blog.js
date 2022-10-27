/**
 * @typedef {{
 *  title: string,
 *  date: string,
 *  summary: string
 * }} Post
 */




/**
 * Generating an id for each post
 */
export function generatePostId() {
    return crypto.randomUUID();
}

export const examplePost = {
    "title": "My First Post",
    "date": "07-25-2022",
    "summary": "The summary of my first post."
};


/**
 * Storing a collection(map) of posts to local storage
 * @param {string: Post} posts a JSON map: id->post
 */
function storePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

/**
 * Get the dataset of posts from local storage
 * @returns the JSON map of posts from local storage
 */
function loadPosts() {
    return JSON.parse(localStorage.getItem('posts')) || {};
}

/**
 * CRUD instructions below
 */


/**
 * (Create) Add a new post to the database.
 * @param {Post} post the post object to be added to the database.
 * @returns {String} the generated UUID for this post in the database.
 */
export function insertPost(post) {
    const posts = loadPosts() //get the database(map) from local storage
    const postId = generatePostId(); // generate a UUID fro the new post

    posts[postId] = post; // insert the new post into the map(database)
    storePosts(posts); //store the updated database back to local stroage

    return postId;
}


/**
 * (Read) Read a specific post from the database.
 * @param {string} postId the id of the post we want to read.
 * @returns {Post | undefined} return the post if found, or undefined otherwiese.  
 */
export function selectPost(postId) {
    const posts = loadPosts(); // get the database from local stroage
    return posts[postId];   // get the desired post by id from map
}


/**
 * (Read) return all posts from the database
 * @returns {{String: Post}} a collection of posts
 */
export function selectAllPosts() {
    const posts = loadPosts();
    return posts;
}


/**
 * (Update) Update a specific post in the database
 * @param {string} postId the id of a post to update 
 * @param {Post} post an new post object to replace the old post
 */
export function updatePost(postId, post) {
    const posts = loadPosts()   // get the database
    posts[postId] = post;   // update the database
    storePosts(posts);      // store the database back to local stroage
}

/**
 * Delete a post from the database.
 * @param {string} PostId the id of the post to delete.
 * @returns {bool} return true if we found a post to delete, false otherwise.
 */
export function deletePost(postId) {
    const posts = loadPosts(); // load the database

    // fail to find the id in the DB, return false
    if (!(postId in posts))
        return false;
    
    // found the id corresponds to a post, delete it.
    else{
        delete posts[postId]; // delete the post
        storePosts(posts);  // update the new database after deleting a post
        return true;
    }
}

/**
 * Count the number of posts in the DB.
 * @returns the number of posts in the DB
 */
export function countPosts() {
    const posts = loadPosts();
    return Object.keys(posts).length;
}

/**
 * Render a custom html element <post> contains the post to render
 * @param {string} poostId the post id
 * @param {Post} post a post to be rendered.
 * @returns a <post> element to be appended to the DOM
 */
export function renderPost(postId, post) {
    const template = document.getElementById("post-template");

    const postEl = template.content.cloneNode(true);
    postEl.children[0].dataset.postId = postId; // create an attribute named"data-postId", and assign the postid to it


    /**
     * filling post content to the template
     */
    const titleH1 = postEl.querySelector('post > h1');
    titleH1.textContent = post.title;

    const dateP  = postEl.querySelector('post > h2');
    dateP.textContent = post.date;

    const summaryP = postEl.querySelector('post > p');
    summaryP.textContent = post.summary;

    const editBtn = postEl.querySelector('post > .edit');

    const delBtn = postEl.querySelector('post > .delete');
    
    

    // delete post button
    delBtn.addEventListener(('click'), ()=>{
        deletePost(postId);
        const existingPost = document.getElementById('post-list').querySelector(`[data-post-id="${postId}"]`);
        if (existingPost) {
            existingPost.remove();
        }
    });

    // edit post button
    editBtn.addEventListener(('click'),()=>{
        console.log(post);
        var dialog = document.getElementById('dialog-2');
        document.getElementById("input-title").value = post.title;
        document.getElementById("input-date").value = post.date;
        document.getElementById("input-summary").value = post.summary;
        document.getElementById("input-postId").value = postId;

        dialog.showModal();
        

    });




    return postEl;
}


/**
 * Render a post and display its content in the 'container'.
 * If a post with the same id exists, replace it.
 */
export function redisplayPost (postId, post, container) {
    const postEl = renderPost(postId, post);

    const existingPost = container.querySelector(`[data-post-id="${postId}"]`);
    if (existingPost) {
        existingPost.remove();
    }

    if (post) {
        container.appendChild(postEl);
    }
}   

/**
 * Redisplay all posts in a container
 * @param {*} container 
 */
export function redisplayAllPosts (container) {
    const posts = selectAllPosts();

    for (const [id, post] of Object.entries(posts)){
        redisplayPost(id, post, container);
    }
}