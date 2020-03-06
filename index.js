let isLogin = false;
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
    $("#login").hide();
    $("#register").show();
    $("#cards").hide();
}

const showDashboard = () => {
    // $("#login").hide();
    // $("#register").hide();
    $("#cards").empty();
    getDestinationCards()
    $("#cards").show();
}

const showWishlist = () => {
    $("#login").hide();
    $("#register").hide();
    $("#cards").empty();
    getWishlist()
    $("#cards").show();
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
            console.log(response)
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
                                <button type="button" onclick="setDestinationId(${el.id})" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                                <a href="assets/img/portfolio/portfolio-1.jpg" onclick="setDestinationId(${el.id})" data-gall="portfolioGallery" class="venobox" title="Kuta"><i class="icofont-eye"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                )
            });
            console.log(response)
        })
        .fail(err => {
            console.log(err)
        })
}
// 
function getWishlist() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/wishlist",
        headers: {
            token: getToken()
        }
    })
        .done(response => {
            response.forEach(el => {
                $("#cards").append(
                    `
                    <section class="card" style="width: 18rem;">
                    <img class="card-img-top" src="..." alt="Card image cap">
                    <div class="card-body">
                      <h5 class="card-title">${el.Destination.name}</h5>
                      <p class="card-text">>${el.Destination.city},  ${el.Destination.country}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">${el.date}</li>
                    </ul>
                    <div class="card-body">
                      <a href="#" class="card-link">Detail</a>
                      <a href="#" class="card-link">Selain Detail</a>
                    </div>
                  </section>

                  
                    `
                )
            });
            console.log(response)
        })
        .fail(err => {
            console.log(err)
        })
}

// getDestinationCards()
$("document").ready(function () {
    // if (getToken()) {
    //     isLogin = true;
    //     showLogin();
    // } else {
    //     showRegister();
    // }
    // showDashboard()

    



    $("#btn-login").on('click',function () {
        $("#email").val("")
        $("#password").val("")
        showLogin()
    })

    $("#btn-register").on('click',function () {
        $("#register-name").val("")
        $("#register-email").val("")
        $("#register-password").val("")
        $("#register-phone_number").val("")
        $("#register-gender").val("")
        showRegister()
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
    

    //card destination
    
    

    //add wishlist
    $("#add-wishlist").on('submit',function (e) {
        e.preventDefault()
        const token = getToken()
        const date = $("#wishlist-date").val()
        const DestinationId = destinationId
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