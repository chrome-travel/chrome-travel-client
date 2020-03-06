let destinationId;

function setDestinationId(id){
    $("#wishlist-date").val("")
    destinationId = id
    return destinationId
}

const getToken = () => {
    return localStorage.getItem('token');
}

const setToken = (token) => {
    localStorage.setItem('token', token);
}

const showLogin = () => {
    $("#login").show();
    $("#register").hide();
    $("#cards").hide();
}

const showRegister = () => {
    $("#register").show();
}

const showWishlist = () => {
    $("#login").hide();
    $("#register").hide();
    $("#cards").empty();
    getWishlist()
    $("#cards").show();
}

function getDestinationById(idinput){
    const token = getToken()
    const id = idinput

    $.ajax({
        method: "GET",
        url: `http://localhost:3000/destinations/${id}`,
        headers:{
            token
        }
    })
        .done(response => {
            const zomatos = response.zomato
            const hotels = response.hotels
            const youtube = response.youtube
            zomatos.forEach(el => {
                $("#list-zomatos").append(`
                    <li>${el.name}, rating: ${el.rating}</li>
                `)
            })
            hotels.forEach(el => {
                $("#list-hotels").append(`
                    <li>${el}</li>
                `)
            })
            youtube.forEach(el => {
                $("#list-youtube").append(
                    `
                    <li>
                        <iframe width="360" height="202.5" src="https://www.youtube.com/embed/${el.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </li>
                    `
                )
            })

            console.log(response)
        })
        .fail(err => {
            console.log(err)
        })
}

function duaduanya(id){
    setDestinationId(id)
    getDestinationById(id)
}

function getDestinationCards() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/destinations",
        headers: {
            token: getToken()
        }
    })
        .done(response => {
            response.forEach(el => {
                $("#cards").append(
                    `
                    <div class="col-lg-4 col-md-6 portfolio-item filter-app">
                        <div class="portfolio-wrap">
                            <img src="assets/img/portfolio/portfolio-${el.id}.jpg" class="img-fluid" alt="">
                            <div class="portfolio-info">
                                <h4>${el.name}</h4>
                                <p>${el.city},  ${el.country}</p>
                                <div class="portfolio-links">
                                <button onclick="duaduanya(${el.id})" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><i class="icofont-eye"></i></button>

                                </div>
                            </div>
                        </div>
                    </div>
                    `
                )
            });
        })
        .fail(err => {
            console.log(err)
        })
}

function deletewl(id) {
    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/wishlist/${id}`,
        headers: {
            token: getToken()
        }
    })
    .done(response => {
            getWishlist();
        })
        .fail(err => {
            console.log(err)
        })
}

function getWishlist() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/wishlist",
        headers: {
            token: getToken()
        }
    })
        .done(response => {
            $("#tbody-wishlist").empty();
            response.forEach(el => {
                $("#tbody-wishlist").append(
                    `
                    <tr>
                        <td>${el.Destination.name}</td>
                        <td>${el.Destination.city}, ${el.Destination.country}</td>
                        <td>${el.date}</td>
                        <td><button onclick="deletewl(${el.id})" type="button" class="btn btn-danger">Delete</button></td>
                    </tr>
                    `
                )
            });
        })
        .fail(err => {
            console.log(err)
        })
}

function loginaje(event) {
    event.preventDefault();
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
                showLanding()
                $("#authentication-action").empty()
                $("#authentication-action").append(`<li><a style="cursor: pointer" onclick="logout()">Logout</a></li>`)
                
            })
            .fail(err => {
                console.log(err)
            })
    })
}

$(document).ready(function () {
    $("#authentication-action").empty()
    getDestinationCards()
    $("#cards").show();
    
    let token = getToken()
    if (token) {
        $("#login").hide()
        $("#register").hide()
        $("#authentication-action").append(`<li><a style="cursor: pointer" onclick="logout()">Logout</a></li>`)
    } else {
        $("#login").show()
        $("#register").show()
        $("#authentication-action").append(`<li><a href="#login">Login</a></li>`)
    }

    // getDestinationCards()
    // $("#cards").show();
    

    $("#btn-login").on('click',function () {
        $("#email").val("")
        $("#password").val("")
        showLogin()
    })

    $("#btn-dashboard").on('click',function () {
        showDashboard()
    })

    $("#btn-wishlist").on('click',function () {
        showWishlist()
    })

    $("#login-form").on('submit',function (e) {
        e.preventDefault()
        const email = $("#email").val()
        const password = $("#password").val()
        console.log(email,password)
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

    //card wishlist
    getWishlist();

    //card destination
    
    

    //add wishlist
    
})

function addWishlist(event) {
        event.preventDefault()
        const token = getToken()
        const date = $("#wishlist-date").val()
        const DestinationId = destinationId
        console.log(date, DestinationId);
        console.log("anak babi!!!!!!!!!!!!!!!!!!!!!!!!!!");
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/wishlist",
            headers: {
                token
            },
            data: {
                date,
                DestinationId
            }
        })
            .done(response => {
                $('#exampleModal').modal('hide')
                // $("#tbody-wishlist").empty()
                getWishlist()
            })
            .fail(err => {
                console.log(err)
            })
}

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
            $("#authentication-action").empty()
            $("#authentication-action").append(`<li><a style="cursor: pointer" onclick="logout()">Logout</a></li>`)
            $("#register").hide()
            $("#login").hide()

        })
        .fail((err) => {
            console.log(err);
        })
}

function youtubeVideo(event, query) {
    event.preventDefault()
    $("#destination-videos").empty()

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/youtubeSearch",
        data: {
            query
        }
    })
        .done(result => {
            result.forEach(element => {

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


function logout() {

    localStorage.removeItem('token');

    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });

    $("#register").show()
    $("#login").show()
    $("#authentication-action").empty()
    $("#authentication-action").append(`<li><a href="#login">Login</a></li>`)

}

function showLanding() {
    $("#register").hide()
    $("#login").hide()
    $("#authentication-action").append(`<li><a style="cursor: pointer" onclick="logout()">Logout</a></li>`)
}

f