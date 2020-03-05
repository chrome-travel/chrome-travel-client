let isLogin = false;

const getToken = () => {
    return localStorage.getItem('token');
}

const setToken = (token) => {
    localStorage.setItem('token', token);
}

const showLogin = () => {
    $("#login").show();
    $("#register").hide();
}

const showRegister = () => {
    $("#login").hide();
    $("#register").show();
}

$("document").ready(function () {
    // if (getToken()) {
    //     isLogin = true;
    //     showLogin();
    // } else {
    //     showRegister();
    // }

    $("#login-form").on('submit',function (e) {
        e.preventDefault()
        const email = $("#email").val()
        const password = $("#password").val()
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/login",
            data: {
                email,
                password
            }
        })
            .done(response => {
                setToken(response.token)
                console.log(response);
            })
            .fail(err => {
                console.log(err)
            })
    })

    $("#register-form").on('submit',function (e) {
        e.preventDefault()
        const name = $("#register-name").val()
        const email = $("#register-email").val()
        const password = $("#register-password").val()
        const phone_number= $("#register-phone_number").val()
        const gender = $("#register-gender").val()
        console.log(name, email, password, phone_number, gender)
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/users",
            data: {
                name,
                email,
                password,
                phone_number,
                gender
            }
        })
            .done(response => {
                console.log(response)
            })
            .fail(err => {
                console.log(err)
            })
    })
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