const BASE_URL =
  "https://strangers-things.herokuapp.com/api/2101-vpi-rm-web-pt";
let loggedIn;

let updateUi = () => {
  if (loggedIn) {
    $("button.action.login").addClass("hidden");
    $("button.action.add-Post").removeClass("hidden");
    $("button.action.my-account").removeClass("hidden");
    $("button.action.logout").removeClass("hidden");
  }
  if (!loggedIn) {
    $("button.action.login").removeClass("hidden");
    $("button.action.add-Post").addClass("hidden");
    $("button.action.my-account").addClass("hidden");
    $("button.action.logout").addClass("hidden");
  }
};

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
$(document).ready(function () {
  $("#confirm-password").keyup(function () {
    let text = $(this).val();
    let text2 = $("#create-password").val();
    if (text === text2) {
      $(".create-account").prop("disabled", true);
      $(".create-account").removeAttr("disabled");
      $(".warning").css("display", "none");
    } else {
      $(".create-account").prop("disabled", true);
      $(".warning").css("display", "block");
    }
  });
});
const registerUser = async (userObj) => {
  try {
    const url = `${BASE_URL}/users/register`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    });
    const newUser = await response.json();
    if (!newUser.success) alert(newUser.error.message);
    if (!newUser.success) {
      localStorage.setItem("token", newUser.data.token);
      alert(newUser.data.message);
    }

    console.log(newUser);
    return newUser;
  } catch (error) {
    throw error;
  }
};
const loginUser = async (userObj, username) => {
  try {
    const url = `${BASE_URL}/users/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    });
    const newUser = await response.json();
    if (!newUser.success) alert(newUser.error.message);
    if (newUser.success) {
      localStorage.setItem("token", newUser.data.token);
      localStorage.setItem("userName", username);
      alert(newUser.data.message);
      loggedIn = true;
    }

    console.log(newUser);
    return newUser;
  } catch (error) {
    console.error(error);
  }
};
populatePosts();
updateUi();

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
  $(".create-account").prop("disabled", true);
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
  updateUi();
  $(".post-form").trigger("reset");
  $(".modal").removeClass("open");
});

$(".register").click(() => {
  $(".modal").removeClass("open");
  $(".login-form").trigger("reset");
  $(".modal-create").addClass("open");
});
$(".create-account").click(() => {
  const userObj = {
    user: {
      username: $("#create-name").val(),
      password: $("#create-password").val(),
    },
  };
  registerUser(userObj);
  updateUi();
  $(".create-form").trigger("reset");
  $(".modal").removeClass("open");
});

$(".login-account").click(async () => {
  const username = $("#login-name").val();

  const password = $("#login-password").val();

  const userObj = {
    user: {
      username,
      password,
    },
  };
  await loginUser(userObj, username);

  $(".login-form").trigger("reset");
  $(".modal").removeClass("open");
  updateUi();
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
$("aside .logout").click(() => {
  loggedIn = false;
  localStorage.clear("token");
  localStorage.clear("userName");
  updateUi();
});
$(".my-account").click(() => {});
