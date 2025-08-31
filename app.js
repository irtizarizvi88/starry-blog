function openPage(page) {
    const signupcontainer = document.querySelector(".signup-container");
    const logincontainer = document.querySelector(".login-container");
    const dashboardcontainer = document.querySelector(".dashboard-container")

    if (page === "login") {
        signupcontainer.style.display = "none";
        logincontainer.style.display = "grid";
        dashboardcontainer.style.display = "none";
    }
    else if (page === "signup") {
        logincontainer.style.display = "none";
        signupcontainer.style.display = "grid";
        dashboardcontainer.style.display = "none";
    }
    else if (page === "dashboard") {
        signupcontainer.style.display = "none";
        logincontainer.style.display = "none";
        dashboardcontainer.style.display = "grid";

        let currentuser = localStorage.getItem("currentUser");
        document.getElementById("current-user").textContent = currentuser;
    }
}

//------------------------------------------SignUp Page------------------------------------------//


function ValidateSignup() {
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let usernameError = document.querySelector("#username + span");
    let emailError = document.querySelector("#email + span");
    let passwordError = document.querySelector("#password + span");

    usernameError.style.display = "none";
    emailError.style.display = "none";
    passwordError.style.display = "none";

    if (username === "") {
        usernameError.style.display = "block";
    } else if (!email.includes("@") || !email.includes(".")) {
        emailError.style.display = "block";
    } else if (password.length < 8) {
        passwordError.style.display = "block";
    } else {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let userExists = users.some(u => u.username === username || u.email === email);

        if (userExists) {
            alert("this user already exist")
        } else {

            users.push({
                username: username,
                email: email,
                password: password
            });

            localStorage.setItem("users", JSON.stringify(users))
            alert("Signup successful!");
            openPage("login");
        }
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    openPage("login");
}

//-------------------------------------------------Login Page ----------------------------------------//

function ValidateLogin() {
    let usernamelogin = document.getElementById("username-login").value;
    let passwordlogin = document.getElementById("password-login").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let validuser = users.find(u => u.username === usernamelogin && u.password === passwordlogin);

    if (validuser) {
        localStorage.setItem("currentUser", validuser.username)
        alert("Login successful");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Credentials")
    }
}
//-------------------------------------------Fonts add in JS-----------------------------//

const fonts = ["Arial", "Times New Roman", "Courier New", "Georgia", "Verdana", "Roboto"];

const fontselect = document.getElementById("font-select");
fonts.forEach(font => {
    let option = document.createElement("option");
    option.value = font;
    option.textContent = font;
    option.style.fontFamily = font;
    fontselect.appendChild(option);
});

function changeFont() {
    const selectedFont = document.getElementById("font-select").value;

    document.getElementById("post-title").style.fontFamily = selectedFont;
    document.getElementById("author-name").style.fontFamily = selectedFont;
    document.getElementById("post-content").style.fontFamily = selectedFont;

    const posts = document.querySelectorAll(".posts");
    posts.forEach(post => {
        post.style.fontFamily = selectedFont;
    });

    localStorage.setItem("selectedFont", selectedFont);
}

window.onload = function() {
    const savedFont = localStorage.getItem("selectedFont");
    if (savedFont) {
        document.getElementById("font-select").value = savedFont;
        changeFont();
    }
    renderPosts();
};

//---------------------------------------------------Post-------------------------------------------------//

function savedToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function PostToPage(key) {
    let data = localStorage.getItem(key);

    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.warn("Invalid JSON in localStorage for key:", key, data);
        localStorage.removeItem(key); 
        return [];
    }
}





function addPost() {
    let title = document.getElementById("post-title").value;
    let authorname = document.getElementById("author-name").value;
    let postcontent = document.getElementById("post-content").value;

    if (title === "" || authorname === "" || postcontent === "") {
        alert("Please fill all fields before posting!");
        return;
    }
        

    let data = {
        post: title,
        authorname: authorname,
        postcontent: postcontent
    }


    let posts = PostToPage("posts");
    posts.push(data);
    savedToLocalStorage("posts", posts);

    document.getElementById("post-title").value = "";
    document.getElementById("author-name").value = "";
    document.getElementById("post-content").value = "";

    renderPosts()
}

//----------------------------------------------Post Delete---------------------------------------------//


function renderPosts() {
    let posts = PostToPage("posts");
    let container = document.getElementById("posts-container");
    container.innerHTML = ""; 


    for (let i = 0; i < posts.length; i++) {
        container.innerHTML += `
            <div>
                <h3>${posts[i].post}</h3>
                <p><strong>By:</strong> ${posts[i].authorname}</p>
                <p>${posts[i].postcontent}</p>
                <button onclick="deletePost(${i})">Delete</button>
                <hr>
            </div>
        `;
    }
}

function deletePost(index) {
    let posts = PostToPage("posts");
    posts.splice(index, 1);
    savedToLocalStorage("posts", posts);
    renderPosts();
}

//-------------------------------------------Open&Close Dashboard----------------------------------------//

function openDashboard() {
    const dashboardcontainer = document.querySelector("#dashboard-container");
    const overlay = document.querySelector("#overlay");

    dashboardcontainer.style.display = "grid";
    overlay.style.display = "block";

    const currentUser = localStorage.getItem("currentUser");
    document.getElementById("current-user").textContent = currentUser;
}

function closeDashboard() {
    const dashboardclose = document.querySelector("#dashboard-container");
    const overlay = document.querySelector("#overlay")

    dashboardclose.style.display = "none";
    overlay.style.display = "none";
}

function logout() {
    localStorage.removeItem("currentUser");

    // Agar login page alag hai
    window.location.href = "index.html";

    // Agar same page pe dashboard hide karna hai
    const dashboardcontainer = document.querySelector("#dashboard-container");
    const overlay = document.querySelector("#overlay");
    dashboardcontainer.style.display = "none";
    overlay.style.display = "none";
}


//-----------------------------------------------------------------------------------//
document.addEventListener("DOMContentLoaded", function() {
    const starContainer = document.getElementById("starry-bg");
    if (!starContainer) return; // agar star div exist nahi karta to exit

    for (let i = 0; i < 500; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        const size = Math.random() * 3 + 1;
        star.style.width = star.style.height = size + "px";
        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.left = Math.random() * window.innerWidth + "px";
        star.style.animation = `twinkle ${Math.random() * 5 + 2}s infinite`;
        starContainer.appendChild(star);
    }

    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes twinkle {
            0%,100% {opacity:0.8;}
            50% {opacity:0.2;}
        }
    `;
    document.head.appendChild(style);
});




