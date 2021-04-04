const BASE_URL =
  "https://strangers-things.herokuapp.com/api/2101-vpi-rm-web-pt";

const state = { posts: [], matches: [] };

let updateUi = () => {
  const token = localStorage.getItem("token");
  if (token) {
    $("button.action.login").addClass("hidden");
    $("button.action.add-Post").removeClass("hidden");
    $("button.action.my-account").removeClass("hidden");
    $("button.action.logout").removeClass("hidden");
  }
  if (!token) {
    $("button.action.login").removeClass("hidden");
    $("button.action.add-Post").addClass("hidden");
    $("button.action.my-account").addClass("hidden");
    $("button.action.logout").addClass("hidden");
  }
};

async function fetchPosts() {
  try {
    const url = `${BASE_URL}/posts`;
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    throw error;
  }
}

async function populatePosts() {
  try {
    const { data } = await fetchPosts();
    const { posts } = data;
    state.posts = posts;

    makePosts(state.posts);
  } catch (error) {
    console.error(error);
  }
}

const renderPosts = (post, username, _id) => {
  let { title, price, description, location, willDeliver } = post;
  if (location === "[On Request]" || location === "")
    location = "Location available on request.";
  if (price.match(/^[0-9]+$/)) price = `$${price}`;
  const displayName = username ? username : post.author.username;
  let userPost = null;
  const id = localStorage.getItem("id");
  let loggedOut = false;
  if (id === post.author._id) userPost = true;
  if (id === _id) userPost = true;
  if (!id) loggedOut = true;
  return $(`
<div class="post">
  <h3>
    <span class="title">
    ${title}
    </span>
    <span class="price">
    ${price}
      <p class='post-author'>
        <a class="displayName" href="#">${displayName}</a>
      </p>
    </span>
  </h3>
  <pre>${description}</pre>
  <footer class="actions">
    <span class="loc">${location}</span>
    <span class="delivery">Delivery Available:${
      willDeliver ? "✅" : "❌"
    }</span>
    ${
      loggedOut
        ? ""
        : `${
            userPost
              ? `<button class="action edit">EDIT</button>
      <button class="action delete">DELETE</button>`
              : `<button class="action message">MESSAGE SELLER</button>`
          }`
    }
    
  </footer>
</div>
`).data("post", post);
};

const renderMessages = (messageObj) => {
  const { content, fromUser } = messageObj;
  return $(`
  <div class="post">
    <h3>
      <span class="title">
        Message from: ${fromUser.username}
      </span>
      <pre>${content}</pre>
    </h3>
  </div>
  `);
};

async function createPost(postObj) {
  try {
    const url = `${BASE_URL}/posts`;
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postObj),
    });
    const newPost = await response.json();
    return newPost;
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
    const url = `${BASE_URL}/posts/${postId}`;
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
}

const sendMessage = async (messageObj, postId) => {
  try {
    const url = `${BASE_URL}/posts/${postId}/messages`;
    const token = localStorage.getItem("token");
    console.log(messageObj);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(messageObj),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

$(document).ready(function () {
  $("#confirm-password, #create-password").keyup(function () {
    let text = $("#confirm-password").val();
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
      userId();
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
      populatePosts();
      userId();
    }
  } catch (error) {
    console.error(error);
  }
};

const userId = async () => {
  try {
    const url = `${BASE_URL}/users/me`;
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const newId = await response.json();
    localStorage.setItem("id", newId.data._id);
  } catch (error) {
    console.error(error);
  }
};

const userPage = async () => {
  try {
    const url = `${BASE_URL}/users/me`;
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const postObj = await response.json();

    const posts = postObj.data.posts;
    const username = postObj.data.username;
    const id = postObj.data._id;
    makePosts(posts, username, id);
  } catch (error) {
    console.error(error);
  }
};

const makePosts = (postArr, username, id) => {
  const postListElement = $(".current-posts");
  postListElement.empty();
  postArr.forEach((post) => {
    if (post.active) {
      postListElement.append(renderPosts(post, username, id));
      post.messages.forEach((message) =>
        postListElement.append(renderMessages(message))
      );
    }
  });
};

$(document).ready(function () {
  $("#searchBox").keyup(function () {
    searchValue = $("#searchBox").val();
    if (!searchValue) {
      populatePosts();
      return;
    }
    const searchTerms = searchValue.toLowerCase().split(" ");

    const matches = state.posts.filter((postObj) => {
      const titleWords = postObj.title.toLowerCase();
      const bodyWords = postObj.description.toLowerCase();
      const priceWords = postObj.price.toLowerCase();
      const authorWords = postObj.author.username.toLowerCase();

      const titleMatch = searchTerms.some((searchTerm) => {
        return titleWords.includes(searchTerm);
      });
      const bodyMatch = searchTerms.some((searchTerm) => {
        return bodyWords.includes(searchTerm);
      });
      const priceMatch = searchTerms.some((searchTerm) => {
        return priceWords.includes(searchTerm);
      });
      const authorMatch = searchTerms.some((searchTerm) => {
        return authorWords.includes(searchTerm);
      });

      const isMatch = titleMatch + bodyMatch + priceMatch + authorMatch;
      return isMatch;
    });

    makePosts(matches);
  });
});
const bootStrap = () => {
  populatePosts();
  updateUi();
};

bootStrap();

$("input[type=search]").on("search", function () {
  populatePosts();
});

$(".post-list").on("click", ".edit", async function () {
  const postElement = $(this).closest(".post");
  const post = postElement.data("post");
  console.log(post);
});

$(".post-list").on("click", ".post-author", function () {
  const postElement = $(this).closest(".post");
  const post = postElement.data("post");
  const author = post.author.username;
  $("#searchBox").val(author);
  $("#searchBox").keyup();
  $(".searchField").removeClass("hidden");
});

$(".displayName a").click((event) => event.preventDefault());

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

$(".post-list").on("click", ".message", async function () {
  const postElement = $(this).closest(".post");
  const post = postElement.data("post");
  console.log(post._id);
  $(".seller").text(post.author.username);
  $(".listing-title").text(post.title);
  $(".modal-message").addClass("open").data("id", post._id);
});

$(".action.cancel").click(() => {
  $(".modal").removeClass("open");
  $(".post-form").trigger("reset");
  $(".login-form").trigger("reset");
  $(".create-form").trigger("reset");
  $(".create-account").prop("disabled", true);
  $(".message-form").trigger("reset");
});

$(".create-post").click(async (event) => {
  event.preventDefault();
  const postObj = {
    post: {
      title: $("#post-title").val(),
      description: $("#post-body").val(),
      price: $("#post-price").val(),
      location: $("#post-location").val(),
      willDeliver: deliveryBox.checked,
    },
  };
  if (oboBox.checked) postObj.post.price = `${postObj.post.price}, OBO`;
  await createPost(postObj);
  bootStrap();
  $(".post-form").trigger("reset");
  $(".modal").removeClass("open");
});

$(".register").click(() => {
  $(".modal").removeClass("open");
  $(".login-form").trigger("reset");
  $(".modal-create").addClass("open");
});

$(".create-account").click(async () => {
  const userObj = {
    user: {
      username: $("#create-name").val(),
      password: $("#create-password").val(),
    },
  };
  await registerUser(userObj);
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
  bootStrap();
});

$(".send-message").click(async () => {
  const content = $("#message-body").val();
  const id = $(".modal-message").data("id");
  console.log(id);
  const messageObj = {
    message: {
      content,
    },
  };
  await sendMessage(messageObj, id);
  $(".message-form").trigger("reset");
  $(".modal").removeClass("open");
  bootStrap();
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
  localStorage.clear("token");
  localStorage.clear("userName");
  localStorage.clear("id");
  bootStrap();
});

$(".my-account").click(() => {
  userPage();
});

$(".action.search").click(() => $(".searchField").toggleClass("hidden"));
