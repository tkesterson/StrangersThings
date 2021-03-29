const BASE_URL =
  "https://strangers-things.herokuapp.com/api/2101-vpi-rm-web-pt";
async function populatePosts() {
  try {
    const { data } = await readPosts();
    const { posts } = data;
    const postListElement = $(".current-posts");
    console.log(posts);
    posts.forEach((post) => {
      postListElement.append(renderPosts(post));
    });
  } catch (error) {
    console.error(error);
  }
}
const renderPosts = (post) => {
  let { title, price, description, location, willDeliver } = post;
  if (location === "[On Request]") location = "Location available on request.";
  const newPrice = price.includes("$");

  return $(`
<div class="post">
<h3>
<span class="title">
  ${title}
</span>
<span class="price">
    ${newPrice ? price : `$${price}`}
  </span>
 </h3>
  <pre>${description}</pre>
  <footer class="actions">
<span class="loc">${location}</span>
<span class="delivery">Delivery Available:${willDeliver ? "✅" : "❌"}</span>
    <button class="action edit">EDIT</button>
    <button class="action delete">DELETE</button>
  </footer>
  
</div>
`).data("post", post);
};

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
      headers: {
        "Content-Type": "application/json",
        //   'Authorization': 'Bearer TOKEN_STRING_HERE'
      },
      body: JSON.stringify(
        postObj
        // {
        // post: {
        //   title: "My favorite stuffed animal",
        //   description:
        //     "This is a pooh doll from 1973. It has been carefully taken care of since I first got it.",
        //   price: "$480.00",
        //   willDeliver: true,
        // }}
      ),
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
$(".create-post").click(async (event) => {
  event.preventDefault();
  $(".todo-form").trigger("reset");
  $(".modal").removeClass("open");
  const postObj = {
    title: $("#post-title").val(),
    body: $("#post-body").val(),
  };
  try {
    const newPost = await createPost(postObj);
  } catch (error) {
    throw error;
  }
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
