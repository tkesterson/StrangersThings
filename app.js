const BASE_URL = "https://strangers-things.herokuapp.com/api/2101-vpi-web-pt";
async function populatePosts() {
  try {
    const url = `${BASE_URL}/posts`;
    const response = await fetch(url);
    const data = await response.json();
    const posts = data.data.posts;
    const postListElement = $(".current-posts");
    //const { _id, title, description } = post;
    console.log(posts);
    posts.forEach((post) => {
      postListElement.append(
        $(`
      <div class="post" data-id="${post._id}">
      <h3>
      <span class="title">
        ${post.title}
      </span>
      <span class="price">
          ${post.price}
        </span>
       </h3>
        <pre>${post.description}</pre>
        <footer class="actions">
          <button class="action edit">EDIT</button>
          <button class="action delete">DELETE</button>
        </footer>
        
      </div>
      `).data("post", post)
      );
    });
  } catch (error) {
    console.error(error);
  }
}
populatePosts();
$(".post-list").on("click", ".edit", function () {
  const postElement = $(this).closest(".post");
  const post = postElement.data("post");
  console.log(post);
});
$("#posts").on("click", ".delete", function () {
  const postElement = $(this).closest(".post");
  const post = postElement.data("post");
  console.log(post);
});
$("#post-form").on("submit", function (event) {
  event.preventDefault();
});
$(".left-drawer").click(function (event) {
  if ($(event.target).hasClass("left-drawer")) {
    $("#app").toggleClass("drawer-open");
  }
});
$(".add-post").click(() => {
  $(".modal").addClass("open");
});
