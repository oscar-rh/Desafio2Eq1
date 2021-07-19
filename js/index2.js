/*************  SIDEBAR  *************/


/************  END SIDEBAR  *************/

const url = new URL(window.location.href)
let postID = url.searchParams.get("postID")

if (postID =="" )
{
    postID = "-Mel0_OXeGV5YyZWvXY4"
}

console.log("PostID", postID)

//Creamos una nueva instancia de nuestar db
let database = firebase.database();

//creamos una variable que apunte hacia la colecciónes
let usersRef = database.ref("/users");
let postsRef = database.ref("/posts");
let commentsRef = database.ref("/comments")
let userID = ""

const getClaseBotonTag = (arrayTags) => {
    let i = (Math.floor(Math.random() * (0 - arrayTags.length)) + arrayTags.length) +1         
    return   `btn-card-${i}`
}

postsRef.child(postID).once('value',function(datos)
    {
        post=datos.val();

        postContent= post.content;
        postDate= post.date;
        postLikes=post.likes;
        postTags=post.tags;
        postTitle=post.title
        urlImageCover = post.urlCover
        userID =  post.user 

        if (urlImageCover != "")
            $("#main-card-img").attr("src",urlImageCover)
        else 
            $("#main-card-img").remove()
        
        $("#post-title").html(postTitle)
        $("#post-content").html( '<p>' +  postContent + '</p>')
        
        
        $("#post-like-counter").html (postLikes)
        $(".class-add-like").attr("data-postlikekey",postID) 
       
        /*
        let año = postDate.substr(6,4)       
        let mes = postDate.substr(3,2)
        let dia = postDate.substr(0,2)        
        let d = new Date(`${año}"/"${mes}"/"${dia}`);       
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        let mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(d);
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        let dateFormatedPost = `${mo} ${da}`
        */
        console.log(postDate)
        dateFormatedPost = moment(postDate).format('MMM DD')

        let expresion = /[ ,]/g
        let tagsPost = postTags.split(expresion);
        let tagsLinks=``;
        tagsPost.forEach(element => {
            tagsLinks+=`&nbsp;<button class="${getClaseBotonTag(tagsPost)} text" type="button">#${element}</button>&nbsp;`;        
        });
        $("#tags").html(tagsLinks)

        $("#post-dateformatted").html(dateFormatedPost + " 7 min read")

        usersRef.child(userID).once('value',function(datos)
            {
                    user=datos.val();
                    postUserName= user.userName;
                    postUserPict= user.picture;
            
                    $("#user-profile-pic").attr("src",postUserPict)
                    $("#post-user-name").html(postUserName)                
            }
        )    

    }
)


$(".class-add-like").click(function (e) { 
    e.preventDefault();
    //console.log(e.target)
    let idpost = $(e.target).data("postlikekey")
    addLike(idpost)
});


const addLike = ( postId ) => {
    let currentLikes = 0
    postsRef.child(postID).once('value',function(datos)
    {
        post=datos.val();
        currentLikes=post.likes;        
        database.ref(`posts/${postId}/likes`).set( currentLikes + 1)
        $("#post-like-counter").html (currentLikes + 1)
    })

  }

/********  COMMENTS  ********/

$(".btn-subscribe").click(function(){
    if($(this).text().toLowerCase()==="subscribe"){
        $(".btn-subscribe-info").removeClass("d-none");
        $(this).text("Unsubscribe");
    }else{
        $(".btn-subscribe-info").addClass("d-none");
        $(this).text("Subscribe");
    }
    

});

$("#text-area-comment").click((event)=>{
    $(event.target).addClass("focus-text-area");
    $(".btn-submit-comment").prop('disabled', true);
    $(".btn-preview").prop('disabled', true);
    $(".btn-submit-comment").css('cursor', 'not-allowed');
    $(".btn-preview").css('cursor', 'not-allowed'); 
    $("#area-comment").addClass("d-flex");
    $("#area-comment-btn").addClass("d-flex");
});

$("#text-area-comment").on("change keyup paste",(event)=>{
    if($(event.target).val()!==""){
        $(".btn-submit-comment").attr('disabled', false);
    $(".btn-preview").attr('disabled', false);
        $(".btn-submit-comment").css('cursor', 'pointer'); 
        $(".btn-preview").css('cursor', 'pointer'); 
    }else{        
        $(".btn-submit-comment").css('cursor', 'not-allowed');
        $(".btn-preview").css('cursor', 'not-allowed');
    }
    
});

const saveComment = (postLlave) => {  
    let fecha = moment().format();
    let comentario =  $("#text-area-comment").val();
    let meGusta = 0;
    let usuarioKey = "-MejKvOK1E-5hGfJ6rIF"

    let postComment ={
        date : fecha,
        commentary : comentario,
        likes : meGusta,
        postKey : postLlave,
        userKey : usuarioKey
    }

    database.ref("/comments").push(postComment);
    $("#area-comment").removeClass("d-flex");
    $("#area-comment-btn").removeClass("d-flex");
    $("#text-area-comment").val("");
    $("#text-area-comment").removeClass("focus-text-area");   
    
}

const printComment= (commentObject,commentKey) => {

    let {commentary, date, likes, postKey, userKey} = commentObject;
    date = moment(date).format("MMM DD")
    if(postKey===postID){
        usersRef.child(userKey).once('value').then((snapshot) => {        
                let name = snapshot.val().userName;
                let foto = snapshot.val().picture;
                let numberChild = $("#comments").children().length
            cardComment = `<div class="d-flex flex-row">
                <div class="img-user-comment">
                <img src="${foto}" class="" alt="">
                </div>

                <div class="d-flex flex-column w-100 p-1 m-0">
                    <div class="comment-border">
                        <div class="d-flex flex-row justify-content-between align-items-center">
                            <div class="">
                                <span id="comment-user-name">${name}</span>
                                <span class="px-2">•</span>
                                <span class="date-txt m-0" id="">${date}</span>
                            </div>
                            <div class="dropdown">
                                <button class="btn-detalle-comment" data-toggle="dropdown" data-target="#navbarProfileInfoToggler"
                                aria-controls="menuComment" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" role="img"
                                        aria-labelledby="a3m8xfucf2xoqid7cokkdb3eo0gnc7n9" class="">
                                        <title id="a3m8xfucf2xoqid7cokkdb3eo0gnc7n9"></title>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M8.25 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5.25 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm3.75 1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z">
                                        </path>
                                    </svg>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="menuComment">
                                    <li><a class="dropdown-item" href="">Dashboard</a></li>
                                    <li><a class="dropdown-item" href="">Create Post</a></li>
                                    <li><a class="dropdown-item" href="">Reading List </a></li>
                                    <li><a class="dropdown-item" href="">Settings</a></li>
                                    <li><a class="dropdown-item" href="#">Sign Out</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="w-100">
                            <p>${commentary}</p>
                        </div>
                    </div>
                    <div class="d-flex flex-row align-items-center my-2 ">
                        <div class="btn-light allcomments-class" data-numberCard="${numberChild}" data-commentKey="${commentKey}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" role="img"
                                aria-labelledby="ah0ho4vrguhqcalal3r0v1fzvlxju7zc" class="mb-1">
                                <title id="ah0ho4vrguhqcalal3r0v1fzvlxju7zc">
                                    Reactions</title>
                                <path
                                    d="M18.884 12.595l.01.011L12 19.5l-6.894-6.894.01-.01A4.875 4.875 0 0112 5.73a4.875 4.875 0 016.884 6.865zM6.431 7.037a3.375 3.375 0 000 4.773L12 17.38l5.569-5.569a3.375 3.375 0 10-4.773-4.773L9.613 10.22l-1.06-1.062 2.371-2.372a3.375 3.375 0 00-4.492.25v.001z">
                                </path>
                            </svg>
                            <span class="m-2" id="commentLikes${numberChild}">${likes} reactions</span>
                        </div>
                        <div class="btn-light">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" role="img"
                                aria-labelledby="aavwx5vmqdgx8wvzfg593jo469ge3dnz" class="">
                                <title id="aavwx5vmqdgx8wvzfg593jo469ge3dnz">
                                    Comments</title>
                                <path
                                    d="M10.5 5h3a6 6 0 110 12v2.625c-3.75-1.5-9-3.75-9-8.625a6 6 0 016-6zM12 15.5h1.5a4.501 4.501 0 001.722-8.657A4.5 4.5 0 0013.5 6.5h-3A4.5 4.5 0 006 11c0 2.707 1.846 4.475 6 6.36V15.5z">
                                </path>
                            </svg>
                            <span class="m-2">Replay</span>
                        </div>
                    </div>
                </div>
                </div>`;
            $("#comments").append(cardComment);
            $(".allcomments-class").click(function(){
                let commentKey=$(this).data("commentkey");
                let number = $(this).data("numbercard");
                addLikeComment( commentKey,number );
            });

        });
    }
};



const addLikeComment = ( key,number ) => {    
    commentsRef.child(key).once('value').then((snapshot) => {    
        let numberLikes = snapshot.val().likes;
        let currentLikes = parseInt(numberLikes) +1 ;        
        database.ref(`comments/${key}/likes`).set( currentLikes);
        $(`#commentLikes${number}`).text(currentLikes+" Reactions");       
    });
};

commentsRef.on('value', snapshot => {   
    $("#comments").empty();
    let commentsCollection = snapshot.val();
    for (key in commentsCollection) {  
        printComment(commentsCollection[key],key);  
    }
    $("#comments-count").text(`(${snapshot.numChildren()-1})`)
})

$(".btn-submit-comment").click(()=>{saveComment(postID)});

/******* END COMMENTS ********/