$("#preview").hide()
$("#btnRemove").hide()


//Creamos una nueva instancia de nuestar db
let database = firebase.database();

//creamos una variable que apunte hacia la colecciónes
let usersRef = database.ref("/users")
let postsRef = database.ref("/posts")

//apuntamos hacia la raíz del storage
var storageRef = firebase.storage().ref();

var urlImageCover = ""
var urlExtraImage = ""

//Creamos un listener que este al pendiente de cualquier cambio en los usuarios
usersRef.on('value', snapshot => {
    let usersCollection = snapshot.val()
    for (user in usersCollection) {
        let { userName } = usersCollection[user]
        $("#post-User").append(`
             <option value="${user}">${userName}</option>
        `)        
    }
})

postsRef.on('value', snapshot => {    
    console.log(snapshot.val())    
})

//Creamos la variable que guardará el archivo que voy a subir
var fileCover
$("#post-cover-image").change(event => {
    console.log(event.target.files[0])
    fileCover = event.target.files[0]    

    if (fileCover === undefined)
    {
        $("#preview").hide()
        $("#labelAddImage").text('Add a cover image')
        $("#btnremove").hide()
        $('#button-cover-image').css('width', '180px')
    }
    else
    {   
        $("#preview").show()
        $("#btnRemove").show()
        $("#labelAddImage").text('Change')  
        var TmpPath = URL.createObjectURL(event.target.files[0])    
        $("#imagepreview").attr("src", TmpPath);  
        $('#button-cover-image').css('width', '100px')  
    }
})

var fileExtra
$("#post-imageExtra").change(event => {
    console.log(event.target.files[0])
    fileExtra = event.target.files[0]
})


const savePost = () => {

    let date = new Date()
    let dd = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    let mm = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    let yyyy = date.getFullYear()
    let postDate = `${dd}/${mm}/${yyyy}`    

    postDate = moment().format()

    // let postCoverImage =  $("#post-cover-image").val()
    let postTitle =  $("#post-title").val()
    let postTags =  $("#post-tags").val()
    let postContent =  $("#post-content").val()
    let postLikes =  0
    // let postImageExtra = $("#post-imageExtra").val()
    let postUser =  $("#post-User").val()
    postUser = "-MejKvOK1E-5hGfJ6rIF"  // Jesus

    postTags = postTags.trim()
    
    let postObject = 
    {
       content : postContent,
       date : postDate,
       likes : postLikes,
       tags : postTags,
       title : postTitle,
       urlCover : urlImageCover, //postCoverImage,
       user : postUser,
       extraImage : urlExtraImage //postImageExtra
    }

    /// Obtengo el KEY generado en el post para enviarlo a la vista de detalle
    let idPostReference  = postsRef.push(postObject)
    let postID = idPostReference.key
    
    console.log ("postObject: " , postObject)
    console.log ("postID: " , postID)

    window.location="http://localhost:5501/index2.html?postID=" + postID
    
}

const uploadFile = (file) => {
    
    var uploadTask = storageRef.child('postimages/' + file.name).put(file);    
    let urlResult = ""
    
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function (snapshot) {                    
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED: // or 'paused'
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING: // or 'running'
                                    console.log('Upload is running');
                                    break;
                            }
                }, 
                function (error) {
                            // A full list of error codes is available at
                            // https://firebase.google.com/docs/storage/web/handle-errors
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
                                    break;
                                case 'storage/canceled':
                                    // User canceled the upload
                                    break;
                                case 'storage/unknown':
                                    // Unknown error occurred, inspect error.serverResponse
                                    break;
                            }
                }, 
                function () {
                              // Upload completed successfully, now we can get the download URL
                        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                            // console.log('File available at', downloadURL);
                            // urlResult = downloadURL
                            // GUARDO EN LA VARIABLE GLOBAL EL URL DEL POST  Y MANDO A LLAMAR EL GUARDADO DEL POST  
                            urlImageCover = downloadURL                            
                            savePost()                        
                        }

                );
                }
                
            )
}


$("#btn-publish").click(function (e) { 
    e.preventDefault();  

    /// solo se valida que el post tenga titulo 
    let postTitle =  $("#post-title").val().trim()
    let postContent =  $("#post-content").val().trim()

    if (postTitle !== "" && postContent !== "" )
    {
        //savePost()
        // si no hay imagen solo se guarda el post sin la imagen
        if  ($("#post-cover-image").val().length ==0)
            savePost()
        else 
            uploadFile(fileCover)
    }
    else 
    {
        alert ("Datos incompletos del post (Titulo y Contenido son requeridos)")
    }

})

$("#btn-upload").click(function (e) {     
    e.preventDefault();      
    

    //alert($("#post-cover-image").val().length)
    window.location="http://localhost:5501/index2.html"
    //console.log(fileCover)
    // let urlimage = uploadFile(fileCover)
    //console.log(urlimage)
})

$("#btnRemove").click(function (e) { 
    e.preventDefault();
   
    $("#preview").hide()
    $("#btnRemove").hide()    
    $("#labelAddImage").text('Add a cover image')  
    $('#button-cover-image').css('width', '180px')
});



var textarea = document.getElementById('post-title');
textarea.addEventListener('keydown', autosize);

function autosize(){
    var el = this;
    setTimeout(function(){
      el.style.cssText = 'height:auto; padding:0';
      el.style.cssText = 'height:' + el.scrollHeight + 'px';
    },0);
  }


  $("#boton-cerrar").click(function (e) { 
      e.preventDefault();
      
      window.location = "http://localhost:5501/index.html"
  });

  /*   ORH: TEMPORAL PARA CREAR USUARIOS
let userObject = {
    userName: "Xochitl",    
    picture: "https://avatars.githubusercontent.com/u/84822138?v=4"
}
const saveUser = () => {
    usersRef.push(userObject)
}
    <option value="-MejJl7qB95TMv3oQWwY">Alex</option>
    <option value="-MejKUt5xyvnoiRGyTXd">Oscar</option>
    <option value="-MejKvOK1E-5hGfJ6rIF">Jesus</option>
    <option value="-MejLARNwMGk-GFtXmt5">Carlos</option>
    <option value="-MejLObt9Q0Tl6_b2c7-">Ubaldo</option>
    <option value="-MejMSqgvlkYFWIMHiSV">Xochitl</option>
    <option value="user1">Xoch</option>
*/

/*
postsRef.on('value', snapshot => {    
    console.log(snapshot.val())    
    
    let postCollection = snapshot.val()
    for (post in postCollection) {
        let { content , date ,likes , tags , title , urlCover, user  } = postCollection[post]
        console.log( title , user , content )
        $("#post-User").append(`
             <h3>${userName}/${user}/${content} </h3>
        `)
    }
    
})
*/