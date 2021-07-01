let videoElem = document.querySelector(".video");
// 1. 
let recordBtn = document.querySelector(".record");
let captureImgBtn = document.querySelector(".click-image");
let filterBtn= document.querySelectorAll(".filter");
let filterOnScreen= document.querySelector(".video-filter");
let videoContainer = document.querySelector(".video-container");
let filterColor=["red","blue","gray"];
let zoominBtn = document.querySelector(".zoomin");
let zoomoutBtn = document.querySelector(".zoomout");
let galleryBtn = document.querySelector(".gallery");
let ImgContainer = document.querySelector(".captureImgDisp");
let indexDbObj = indexedDB.open("videoAndAudioStore");
let btn1 = document.querySelector(".btn-container");
let btn2 = document.querySelector(".btn2-container");
let timing = document.querySelector(".timing");
let scaleBtn = document.querySelector(".scaleContainer");
let rndBtn = document.querySelector(".rnd-btn");

 let showStorage=false;
 let counter = 0;
let clearObj;
let c=1;

let db;
indexDbObj.addEventListener("success",function(e){
    db = indexDbObj.result;

})

indexDbObj.addEventListener("error",function(e){
    alert("error");
})

indexDbObj.addEventListener("upgradeneeded",function(e){
    db = indexDbObj.result;
    db.createObjectStore("phto&Vdo",{
        keyPath:"id"
    })
})


let isRecording = false;
// user  requirement send 
let constraint = {
    audio: true, video: true
}
// represent future recording
let recording = [];
let mediarecordingObjectForCurrStream;
// promise 
let usermediaPromise = navigator
    .mediaDevices.getUserMedia(constraint);
// /stream coming from required media source
usermediaPromise.
    then(function (stream) {
        // UI stream 
        videoElem.srcObject = stream;
        // browser
        mediarecordingObjectForCurrStream = new MediaRecorder(stream);
        // camera recording add -> recording array
        mediarecordingObjectForCurrStream.ondataavailable = function (e) {
            recording.push(e.data);
        }
        // download
        mediarecordingObjectForCurrStream.addEventListener("stop", function () {
            // recording -> url convert 
            // type -> MIME type (extension)
            const blob = new Blob(recording, { type: "video/mp4" });
           
           const url = window.URL.createObjectURL(blob);
           console.log(url);
           
            // if(db){
            //     let transactionAccess = db.transaction("phto&Vdo","readwrite");
            //     let photovdostore = transactionAccess.objectStore("phto&Vdo");
            //     let entryofObj={
            //         id :uid(),
            //         value:url, 
            //     }
            //     photovdostore.add(entryofObj);
                
            // }
            let a = document.createElement("a");
            a.download = "file.mp4";
            a.href = url;
            a.click();
           
        })

    }).catch(function (err) {
        console.log(err)
        alert("please allow both microphone and camera");
    });
    

    recordBtn.addEventListener("click", function () {
    if (mediarecordingObjectForCurrStream == undefined) {
        alert("First select the devices");
        return;
    }
    if (isRecording == false) {
        mediarecordingObjectForCurrStream.start();
        // recordBtn.innerText = "Recording....";
        recordBtn.classList.add("record-animation");
        startTimer();
    }
    else {
        mediarecordingObjectForCurrStream.stop();
        // recordBtn.innerText = "Record";
        recordBtn.classList.remove("record-animation");
        stopTimer();
    }
    isRecording = !isRecording
})
function startTimer() {
    timing.style.display = "block";
    function fn() {
        // hours
        let hours = Number.parseInt(counter / 3600);
        let RemSeconds = counter % 3600;
        let mins = Number.parseInt(RemSeconds / 60);
        let seconds = RemSeconds % 60;
        hours = hours < 10 ? `0${hours}` : hours;
        mins = mins < 10 ? `0${mins}` : `${mins}`;
        seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        timing.innerText = `${hours}:${mins}:${seconds}`
        counter++;
    }
    clearObj = setInterval(fn, 1000);
}
function stopTimer() {
    timing.style.display = "none";
    clearInterval(clearObj);
}


captureImgBtn.addEventListener("click",function(){
   
    let canvas = document.createElement("canvas");
    canvas.height = videoElem.videoHeight;
    canvas.width = videoElem.videoWidth;
    let tool = canvas.getContext("2d");
    tool.drawImage(videoElem,0,0);
    tool.scale(scaleNumber,scaleNumber);
    const x = (tool.canvas.width/scaleNumber - videoElem.videoWidth)/2;
    const y = (tool.canvas.height/scaleNumber - videoElem.videoHeight)/2;

    tool.drawImage(videoElem,x,y);

    if(filterOnScreen.classList[1])
    {
        
        const style = getComputedStyle(filterOnScreen);
        let colr = style.backgroundColor;
        //console.log(colr);
        //console.log(filterOnScreen.style.backgroundColor);
        tool.fillStyle=colr;
        //console.log(filterOnScreen.classList[1]);
        tool.fillRect(0,0,canvas.width,canvas.height);
    }
   
    
    captureImgBtn.classList.add("photoClickAnimation");
    // captureImgBtn.classList.remove("photoClickAnimation");
    let url = canvas.toDataURL();
    if(db){
        let transactionAccess = db.transaction("phto&Vdo","readwrite");
        let photovdostore = transactionAccess.objectStore("phto&Vdo");
        let entryofObj={
            id :uid(),
            value:url, 
        }
        photovdostore.add(entryofObj);
        
    }
    // let a =document.createElement("a");
    // a.download="file.png";
    // a.href=url;
    // a.click();
    // a.remove();
    setTimeout(function(){
        captureImgBtn.classList.remove("photoClickAnimation");
    },2000) 
})



for(let i=0;i<filterBtn.length;i++)
{
    filterBtn[i].addEventListener("click",function(){
        let colorOfClickedBtn = filterBtn[i].classList[1];
        filterOnScreen.removeAttribute('class');
        filterOnScreen.classList.add("video-filter");
        filterOnScreen.classList.add(colorOfClickedBtn);
       // console.log(filterOnScreen.classList);
        // if(colorOfClickedBtn=="red-filter")
        // {
        //     //console.log("reached");
        //   // console.log(filterOnScreen.classList);
        //   filterOnScreen.classList.add("red-filter");
        //   console.log(filterOnScreen.classList);
        // }
        // else if(colorOfClickedBtn=="blue-filter")
        // {
        //     filterOnScreen.classList.remove();   
        //     filterOnScreen.classList.add("blue-filter");
        //   console.log(filterOnScreen.classList);
        // }
    })
}

// let isRecordingAnimation = false;
// recordBtn.addEventListener("click",function(){
//     isRecordingAnimation=!isRecordingAnimation;
//      if(isRecordingAnimation){
      
//      }
//      else
//      {
         
//      }
// })

let scaleNumber =1;
zoominBtn.addEventListener("click",function(){
    if(scaleNumber<2)
    {
        videoContainer.style.transform = `scale(${scaleNumber})`;
        scaleNumber+=0.1;
    }
    else
    {
        alert("Cannot Scale More Than This");
    }

});

zoomoutBtn.addEventListener("click",function(){
    if(scaleNumber>1)
    {
        videoContainer.style.transform = `scale(${scaleNumber})`;
        scaleNumber-=0.1;
    }
    else
    {
        alert("Cannot Scale Less Than This");
    }

});

let arrId=[];  let alreadyDownloaded=[];
galleryBtn.addEventListener("click",function(){
    showStorage=!showStorage;
  if(showStorage==true)
  {
    let x = window.matchMedia("(max-width: 320px)");
    
    videoContainer.style.display="none";
    let transactionAccess = db.transaction("phto&Vdo","readonly");
    let photovdostore = transactionAccess.objectStore("phto&Vdo");
    const items = photovdostore.getAll();
    items.onsuccess= function(){
        // items.result
        for(let i=0;i<items.result.length;i++)
        {
            
            //console.log(items.result[i].id);
        let imgContainerDiv = document.createElement("div");
        imgContainerDiv.setAttribute("id",items.result[i].id);
        imgContainerDiv.setAttribute("class","imgsubContainer");

        
            let img = document.createElement("img");
            img.src  =items.result[i].value;
            img.setAttribute("class","storedinDB");
            arrId.push(items.result[i].id);
            ImgContainer.setAttribute("class","storageImg");
            ImgContainer.style.position="absolute";
            ImgContainer.style.display="grid";
            ImgContainer.style.gridTemplateColumns="repeat(2, 1fr)";
            ImgContainer.style.left="7rem";
            ImgContainer.style.zIndex=4;
            ImgContainer.style. gap="10px";
            imgContainerDiv.appendChild(img);
            ImgContainer.appendChild(imgContainerDiv);
            let idx =arrId.findIndex(function(imgId){
                   return imgId==items.result[i].id;
                  })
                  if(!idx)
            deleteImagefromDB(arrId,img);
            if(x.matches)
            myFunction();


            for(let i=0;i<filterBtn.length;i++)
            filterBtn[i].style.display="none";

        }
         btn1.style.display="none";
         btn2.style.display="none";
         scaleBtn.style.display ="none";
    };
  }
  else
  {
      videoContainer.style.setProperty('display', 'initial')
      //f
      for(let i=0;i<filterBtn.length;i++)
            filterBtn[i].style.setProperty('display','initial');

    ImgContainer.style.display="none";

    let containedImg = document.querySelectorAll(".storedinDB");

            for(let i=0;i<containedImg.length;i++)
            {
                let divOfContainedImage = document.querySelectorAll(".imgsubContainer");
                divOfContainedImage[i].style.setProperty=('width','initial');
                divOfContainedImage[i].style.setProperty=('height','initial');
                console.log(divOfContainedImage[i]);
                containedImg[i].style.setProperty = ('width','initial');
                containedImg[i].style.setProperty = ('height','initial');
            }

            btn1.style.setProperty('display','flex');
            btn2.style.setProperty('display','flex');
            scaleBtn.style.setProperty('display','initial');
            rndBtn.style.setProperty('display','initial');
  }
});

function deleteImagefromDB(idArray,img){
    let c=0;
document.addEventListener("dblclick",function(e){
    
    // let img_id = document.querySelector(".imgsubContainer").id;
    // let idx =arrId.findIndex(function(imgId){
    //     return imgId==img_id;
    //  })
    //  console.log(idx);
    // console.log(img_id);
    let imgContainingDiv = document.querySelectorAll(".imgsubContainer");
    let id = e.path[1].id
    //console.log((id));
    for(let i=0;i<arrId.length;i++)
    {
        
        if(imgContainingDiv[i].id==id)
        {
        //     let transactionAccess = db.transaction("phto&Vdo","readwrite");
        // let photovdostore = transactionAccess.objectStore("phto&Vdo").delete(id);
        // let a =document.createElement("a");
        //alreadyDownloaded.push(id);
        let a =document.createElement("a");
        let url =imgContainingDiv[i].getElementsByTagName("img")[0].currentSrc;
    a.download="file.png";
    a.href=url;
    a.click();
    a.remove();
    c++;
           
        }
    }

})
}

function myFunction()
{
        console.log("fn ran");
        // if(showStorage==true)
        // imgsubContainer.style.height="300px";
        // imgsubContainer.style.width="300px";

        for(let i=0;i<arrId.length;i++)
        {
            let containedImg = document.querySelectorAll(".storedinDB");
            for(let i=0;i<containedImg.length;i++)
            {
                let divOfContainedImage = document.querySelectorAll(".imgsubContainer");
                divOfContainedImage[i].style.width="339px";
                divOfContainedImage[i].style.height="300px";
                containedImg[i].style.width = "339px";
                containedImg[i].style.height= "300px";
            }
            // max-width:100%;
            // height:auto;
           
        }
    
}
