
$("#hamburguer").click( () => {
    $(".sidebar").addClass("d-flex");
    $(".sidebar-content").addClass("d-flex");
    $(".sidebar-overlay").addClass("d-block");
});

$("#close-sidebar").click( () => {
    $(".sidebar").removeClass("d-flex");
    $(".sidebar-content").removeClass("d-flex");
    $(".sidebar-overlay").removeClass("d-block");
});

//Creamos una nueva instancia de nuestar db
const database = firebase.database();

//creamos una variable que apunte hacia la colecciónes
const usersRef = database.ref("/users")
const postsRef = database.ref("/posts")

//Creamos un listener que este al pendiente de cualquier cambio en los usuarios
postsRef.on('value', snapshot => {    
    $("#posts").empty();

    let postCollection = snapshot.val();
    for (key in postCollection) {  
        printPosts(postCollection[key],key);
    }
})

const printPosts = (objectPosts,key) =>{
    let {date,likes,tags,title,urlCover,user} = objectPosts;   
    date = moment(date).format("MMM DD")
    let expresion = /[ ,]/g
    let tagsPost = tags.split(expresion);
    let tagsLinks=``;
    tagsPost.forEach(element => {
        tagsLinks+=`<a>#${element}</a>`;        
    });
    
    usersRef.child(user).once('value').then((snapshot) => {
        
        let name = snapshot.val().userName;
        let foto = snapshot.val().picture;
        let postCard;
        let numberPostChildren = $("#posts").children().length
        if(numberPostChildren===0){
            postCard = `<div class="card br-post post-card featured-post-card mx-2 my-2fit" id="post${numberPostChildren}">
                    <img src="${urlCover}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <div class="d-flex c-header">
                                <img src="${foto}" alt="" class="br-100">
                                <div class="d-flex c-name">
                                    <h6 class="nickname mb-0">${name}</h6>
                                    <p>${date}</p>
                                </div>
                            </div>
                            <div class="card-content pl-5 pt-2">
                                <a href="index2.html" class="post-list"> 
                                    <h4 class="card-title">${title}</h4>
                                </a>
                                <div class="d-flex h-order">
                                    <nav class="card-post-tags">${tagsLinks}</nav>
                                </div>
                                <div class=" d-flex read">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                            height="24" role="img"
                                            aria-labelledby="ah0ho4vrguhqcalal3r0v1fzvlxju7zc"
                                            class="crayons-icon mb-1">
                                            <title id="ah0ho4vrguhqcalal3r0v1fzvlxju7zc">
                                                Reactions</title>
                                            <path
                                                d="M18.884 12.595l.01.011L12 19.5l-6.894-6.894.01-.01A4.875 4.875 0 0112 5.73a4.875 4.875 0 016.884 6.865zM6.431 7.037a3.375 3.375 0 000 4.773L12 17.38l5.569-5.569a3.375 3.375 0 10-4.773-4.773L9.613 10.22l-1.06-1.062 2.371-2.372a3.375 3.375 0 00-4.492.25v.001z">
                                            </path>
                                        </svg>
                                        <span class="not-b">${likes} reactions</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                            height="24" role="img"
                                            aria-labelledby="aavwx5vmqdgx8wvzfg593jo469ge3dnz"
                                            class="crayons-icon mb-1">
                                            <title id="aavwx5vmqdgx8wvzfg593jo469ge3dnz">
                                                Comments</title>
                                            <path
                                                d="M10.5 5h3a6 6 0 110 12v2.625c-3.75-1.5-9-3.75-9-8.625a6 6 0 016-6zM12 15.5h1.5a4.501 4.501 0 001.722-8.657A4.5 4.5 0 0013.5 6.5h-3A4.5 4.5 0 006 11c0 2.707 1.846 4.475 6 6.36V15.5z">
                                            </path>
                                        </svg>
                                        <button class="comment">Add comment</button>
                                    </div>
                                    <div class="d-flex">
                                        <p class="card-text mb-0"><small class="text-muted">7
                                                min read</small></p>
                                        <button class="save">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
        }else{
            postCard = `<div class="card br-post post-card featured-post-card mx-2 my-2" id="post${numberPostChildren}">
                            <div class="card-body">
                                <div class="d-flex c-header">
                                    <img src="${foto}" alt="" class="br-100">
                                    <div class="d-flex c-name">
                                        <h6 class="nickname mb-0">${name}</h6>
                                        <p>${date}</p>
                                    </div>
                                </div>
                                <div class="card-content pl-5 pt-2">
                                    <a href="index2.html" class="post-list"> 
                                        <h4 class="card-title">${title}</h4>
                                    </a>
                                    <div class="d-flex h-order">
                                        <nav class="card-post-tags">${tagsLinks}</nav>
                                    </div>
                                    <div class=" d-flex read">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                height="24" role="img"
                                                aria-labelledby="ah0ho4vrguhqcalal3r0v1fzvlxju7zc"
                                                class="crayons-icon mb-1">
                                                <title id="ah0ho4vrguhqcalal3r0v1fzvlxju7zc">
                                                    Reactions</title>
                                                <path
                                                    d="M18.884 12.595l.01.011L12 19.5l-6.894-6.894.01-.01A4.875 4.875 0 0112 5.73a4.875 4.875 0 016.884 6.865zM6.431 7.037a3.375 3.375 0 000 4.773L12 17.38l5.569-5.569a3.375 3.375 0 10-4.773-4.773L9.613 10.22l-1.06-1.062 2.371-2.372a3.375 3.375 0 00-4.492.25v.001z">
                                                </path>
                                            </svg>
                                            <span class="not-b">${likes} reactions</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                height="24" role="img"
                                                aria-labelledby="aavwx5vmqdgx8wvzfg593jo469ge3dnz"
                                                class="crayons-icon mb-1">
                                                <title id="aavwx5vmqdgx8wvzfg593jo469ge3dnz">
                                                    Comments</title>
                                                <path
                                                    d="M10.5 5h3a6 6 0 110 12v2.625c-3.75-1.5-9-3.75-9-8.625a6 6 0 016-6zM12 15.5h1.5a4.501 4.501 0 001.722-8.657A4.5 4.5 0 0013.5 6.5h-3A4.5 4.5 0 006 11c0 2.707 1.846 4.475 6 6.36V15.5z">
                                                </path>
                                            </svg>
                                            <button class="comment">Add comment</button>
                                        </div>
                                        <div class="d-flex">
                                            <p class="card-text mb-0"><small class="text-muted">7
                                                    min read</small></p>
                                            <button class="save">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
        }
        $("#posts").append(postCard);
        $(`#post${numberPostChildren}`).click(()=> {
            window.location="index2.html?postID=" + key
        });
    });
    
    


}

//Función para mandar a pagina de search.html anexando los buscado a la URL
$("#inputValue2").keyup(function (e) { 
    if(e.which == 13) {
        let searchValue = e.target.value;
        console.log(searchValue);
        window.location.href=`search.html?search=${searchValue}`;        
    }   

});

//Función para filtrar por week desde home page 
/*postRef.on('value', snapshot => {    
    $("#nav-week-tab").empty();

    let postCollection = snapshot.val();
    for (key in postCollection) {  
        filterByWeek(postCollection[key],key);
    }
});


const filterByWeek = (objectPosts,key) => {  
    let postCollection = snapshot.val();
        let postValues = Object.values(postCollection);
        let postKeys = Object.keys(postCollection);

        let filterResult = postKeys.reduce( ( accum, current ) => {
            let postWeek = postCollection[current];
            return postWeek.includes(objectPosts) ? {...accum, [current]:postCollection[current]} : accum;
    }, {});
    
    //console.log(postWeek)
    //Console.log(filterResult);

    for (postWeek in filterResult) {        
        {date} = objectPosts;
    
        var oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        let findDate = moment(date).isBetween(oneWeekAgo, new Date());
        }
    });

    $(`#nav-week-tab`).click(filterByWeek())=> {
*/
//Función para filtrar por month desde home page

//Función para filtrar por  year desde home page


//Función para filtrar  infinity  desde home page


//Función para filtrar por latest desde home page