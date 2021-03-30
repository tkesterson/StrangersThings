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
  if (location === "[On Request]" || location === "")
    location = "Location available on request.";
  if (price.match(/^[0-9]+$/)) price = `$${price}`;

  return $(`
<div class="post">
<h3>
<span class="title">
  ${title}
</span>
<span class="price">
    ${price}
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
  console.log(postObj);
  try {
    const url = `${BASE_URL}/posts`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //   'Authorization': 'Bearer TOKEN_STRING_HERE'
      },
      body: JSON.stringify(postObj),
    });
    console.log(postObj);
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

$(".action.cancel").click(() => {
  $(".modal").removeClass("open");
  $(".post-form").trigger("reset");
  $(".login-form").trigger("reset");
  $(".create-form").trigger("reset");
});

$(".create-post").click((event) => {
  event.preventDefault();
  const postObj = {
    title: $("#post-title").val(),
    description: $("#post-body").val(),
    price: $("#post-price").val(),
    obo: oboBox.checked,
    location: $("#post-location").val(),
    willDeliver: deliveryBox.checked,
  };
  createPost(postObj);
  $(".post-form").trigger("reset");
  $(".modal").removeClass("open");
});

$(".register").click(() => {
  $(".modal").removeClass("open");
  $(".login-form").trigger("reset");
  $(".modal-create").addClass("open");
});

$(".left-drawer").click(function (event) {
  if ($(event.target).hasClass("left-drawer")) {
    $("#app").toggleClass("drawer-open");
  }
});

$("aside .add-post").click(() => {
  $(".modal-post").addClass("open");
});

$("aside .login").click(() => {
  $(".modal-login").addClass("open");
});

$(".my-account").click(() => {});
