const BASE_URL = "https://strangers-things.herokuapp.com/api/2101-vpi-web-pt";
async function populatePosts() {
  try {
    const url = `${BASE_URL}/posts`;
    const response = await fetch(url);
    const data = await response.json();
    const posts = data.data.posts;
    const postListElement = $("#posts");
    //const { _id, title, description } = post;

    posts.forEach((post) => {
      postListElement.append(
        $(`
      <div class="post" data-id="${post._id}">
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <button class="edit">EDIT</button>
        <button class="delete">DELETE</button>
      </div>
      `).data("post", post)
      );
    });
  } catch (error) {
    console.error(error);
  }
}
populatePosts();
$("#posts").on("click", ".edit", function () {
  const postElement = $(this).closet(".post");
  const post = postElement.data("post");
  console.log(post);
});
$("#posts").on("click", ".delete", function () {
  const postElement = $(this).closet(".post");
  const post = postElement.data("post");
  console.log(post);
});
$("#post-form").on("submit", function (event) {
  event.preventDefault();
});
