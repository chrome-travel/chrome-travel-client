let isLogin = false;

const getToken = () => {
    return localStorage.getItem('token');
}

const setToken = (token) => {
    localStorage.setItem('token', token);
}

const showLogin = () => {
    $("login").show();
    $("register").hide();
}

const showRegister = () => {
    $("login").hide();
    $("register").show();
}

$(document).ready(function () {
    if (getToken()) {
        isLogin = true;
        showLogin();
    } else {
        showRegister();
    }
})

function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    const id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token)
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/loginGoogle",
        headers: {
            id_token
        }
    })
        .done((result) => {
            setToken(result.token);
            showRegister();
        })
        .fail((err) => {
            console.log(err);
        })
}

function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut()
        .then(function () {
            console.log('User signed out.');
        });
}

function youtubeVideo(event, query) {
    event.preventDefault()
    $("#destination-videos").empty()
    console.log(query);

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/youtubeSearch",
        data: {
            query
        }
    })
        .done(result => {
            result.forEach(element => {
                console.log(element.videoId);

                $("#destination-videos").append(
                    `
                    <iframe width="320" height="180" src="https://www.youtube.com/embed/${element.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    `
                )

            });
        })

        .fail(err => {
            console.log(err);
        })
}