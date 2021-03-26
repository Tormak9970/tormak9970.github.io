document.getElementById("searchBar").addEventListener("keydown", ({key}) => {
    if (key === "Enter") {
        event.preventDefault();
        
        createLoadingAnimation();

        var errParentElem = document.getElementById("errorDivContainer");
        var resParentElem = document.getElementById("searchResults");
        var errElems = document.getElementsByClassName("error-div__error");
        var resElems = document.getElementsByClassName("test-preview");
        var errArray = Array.from(errElems);
        var resArray = Array.from(resElems);
        errArray.forEach(elem => {
          errParentElem.removeChild(elem);
        });

        resArray.forEach(elem => {
          resParentElem.removeChild(elem);
        });

        displayResults();
    }
});

async function fetchAttributes(id){
  const res = await fetch("http://localhost:8080/api/v1/meme/" + id + "/attributes");
  const data = await res.json();
  type = data.fileType;
  title = data.title;
  uploader = data.uploader;
  date = data.uploadDate;
  isNSFW = data.isNSFW
  return [title, uploader, date, isNSFW, id, type];
}

async function searchDB(query){
  const res = await fetch("http://localhost:8080/api/v1/meme/search/title/" + query + "/20");
  const data = await res.json();
  console.log(data);
  deleteLoadingAnimation();
  return data;
}

async function displayResults(){

  var idList = await searchDB(document.getElementById("searchBar").value);
  console.log(idList);

  if(idList.length === 0){
    createErrDiv();
  } else {
    idList.forEach(element => {
      createPreviewDiv(element);
    });
  }

}

async function createPreviewDiv(id){
  
  var valueList = await fetchAttributes(id);
  console.log(valueList);
  createElems(valueList, id);
  
}

async function createElems(atributeList, id){
  var newDiv = document.createElement("div");
  newDiv.className = "test-preview";

  var memePreview = document.createElement("img");
  memePreview.className = "test-preview__img";
  memePreview.src = "http://localhost:8080/api/v1/meme/" + id + "/display/" + atributeList[5]
  memePreview.alt = "thumbnail";
  memePreview.style = "width: 200px; height: auto;";

  var imgATag = document.createElement("a");
  imgATag.target = "_blank";
  imgATag.rel = "noopener noreferrer";
  imgATag.href = "http://localhost:8080/api/v1/meme/" + id + "/display/" + atributeList[5];

  imgATag.appendChild(memePreview);
  newDiv.appendChild(imgATag);
  var title = document.createElement("h3");
  title.innerHTML = atributeList[0];
  title.style = "color: white; font-size: 15px;";
  newDiv.appendChild(title);
  
  var subDiv = document.createElement("div");
  subDiv.className = "test-preview__info-container";
  
  var dateHeader = document.createElement("h3");
  dateHeader.className = "h3-format";
  dateHeader.innerHTML = atributeList[2];
  subDiv.appendChild(dateHeader);  

  var uploader = document.createElement("h3");
  uploader.className = "h3-format";
  uploader.innerHTML = "Uploader: " + atributeList[1];
  subDiv.appendChild(uploader);   

  newDiv.appendChild(subDiv);  

  document.getElementById("searchResults").appendChild(newDiv);
}

function createErrDiv(){

  var errMsg = document.createElement("h1");
  errMsg.className = "error-div__error";
  errMsg.innerHTML = "Sorry, your search didnt return any results.";

  document.getElementById("errorDivContainer").appendChild(errMsg);
}

function createLoadingAnimation(){
  var loadingText = document.createElement("div");
  loadingText.className = "loader-text";

  var slickPepeImg = document.createElement("img");
  slickPepeImg.src = "../src/img/Pepe-slick.png";
  slickPepeImg.alt = "slick-pepe";
  slickPepeImg.width = "150";
  slickPepeImg.height = "150";
  loadingText.appendChild(slickPepeImg);

  var loadingAnimation = document.createElement("div");
  loadingAnimation.className = "loader-animation";

  loadingAnimation.innerHTML = "<span></span><span></span><span></span>";
  document.getElementById("loadingAnimationContainer").appendChild(loadingText);
  document.getElementById("loadingAnimationContainer").appendChild(loadingAnimation);
}

function deleteLoadingAnimation(){
  var parent = document.getElementById("loadingAnimationContainer");
  var pepe = document.getElementsByClassName("loader-text")[0];
  var dots = document.getElementsByClassName("loader-animation")[0];
  parent.removeChild(pepe);
  parent.removeChild(dots);
}