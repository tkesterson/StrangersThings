const BASE_URL = "https://strangers-things.herokuapp.com/api/2101-vpi-web-pt";
async function populatePosts() {
  try {
    const data = await readPosts();
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
async function readPosts() {
  try {
    const url = `${BASE_URL}/posts`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function createPost(postObj) {
  try {
    const url = `${BASE_URL}/posts`;
    const response = await fetch(url, {
      method: "POST",
      // headers: {
      //   'Content-Type': 'application/json',
      //   'Authorization': 'Bearer TOKEN_STRING_HERE'
      // },
      body: JSON.stringify({
        post: {
          title: "My favorite stuffed animal",
          description:
            "This is a pooh doll from 1973. It has been carefully taken care of since I first got it.",
          price: "$480.00",
          willDeliver: true,
        },
      }),
    });
  } catch (error) {
    throw error;
  }
}
async function updatePost(postObj) {
  try {
    const url = `${BASE_URL}/posts`;
    const response = await fetch(url);
  } catch (error) {
    throw error;
  }
}
async function deletePost(postId) {
  try {
    const url = `${BASE_URL}/posts${postId}`;
    const response = await fetch(url, {
      method: "DELETE",
      // headers: {
      //   "Content-Type": "application/json",
      //   Authorization: "Bearer TOKEN_STRING_HERE",
      // },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
populatePosts();
$(".post-list").on("click", ".edit", async function () {
  const postElement = $(this).closest(".post");
  const post = postElement.data("post");
  console.log(post);
});
$(".post-list").on("click", ".delete", async function () {
  const postElement = $(this).closest(".post");
  const post = postElement.data("post");
  console.log(post._id);
  try {
    result = await deletePost(post._id);
    postElement.slideUp();
  } catch (error) {
    throw error;
  }
});
$(".create-post").click((event) => {
  event.preventDefault();
  $(".todo-form").trigger("reset");
  $(".modal").removeClass("open");
  const postObj = {
    title: $("#post-title").val(),
    body: $("#post-body").val(),
  };
  console.log(postObj);
});

$(".cancel-create-post").click(() => $(".modal").removeClass("open"));

$(".left-drawer").click(function (event) {
  if ($(event.target).hasClass("left-drawer")) {
    $("#app").toggleClass("drawer-open");
  }
});
$(".add-post").click(() => {
  $(".modal").addClass("open");
});
