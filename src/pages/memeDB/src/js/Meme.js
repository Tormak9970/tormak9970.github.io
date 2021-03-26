async function fetchId(){
  const response = await fetch("http://localhost:8080/api/v1/meme/randomid");
  const data = await response.json();
  return data;
}

async function fetchAttributes(id){
  const res = await fetch("http://localhost:8080/api/v1/meme/" + id + "/attributes");
  const data = await res.json();
  type = data.fileType;
  title = data.title;
  uploader = data.uploader;
  date = data.uploadDate;
  isNSFW = data.isNSFW;
  return [title, uploader, date, isNSFW, id, type];
}

async function fetchMeme(){
  var id = await fetchId();
  var atributesList = await fetchAttributes(id);

  removeMeme();

  createMeme(id, atributesList);
} 

const btn = document.getElementById("newMemeButton");

btn.addEventListener("click", function (event){
  event.preventDefault();

  fetchMeme();
});

async function createMeme(id, atributeList){
  var memeDisplayer = document.createElement("div");
  memeDisplayer.className = "meme-displayPlate";
  memeDisplayer.id = "memeDisplayContainer";

  var memeThumbnail = document.createElement("img");
  memeThumbnail.className = "meme-displayPlate__img";
  memeThumbnail.src = "http://localhost:8080/api/v1/meme/" + id + "/display/" + atributeList[5];
  memeThumbnail.alt = "If you are seeing this your computer may be having problems";
  memeThumbnail.style = "width: 450px; height: auto;";

  var imgATag = document.createElement("a");
  imgATag.target = "_blank";
  imgATag.rel = "noopener noreferrer";
  imgATag.href = "http://localhost:8080/api/v1/meme/" + id + "/display/" + atributeList[5];

  imgATag.appendChild(memeThumbnail);
  memeDisplayer.appendChild(imgATag);
  var memeTitle = document.createElement("h2");
  memeTitle.innerHTML = atributeList[0];
  memeTitle.style = "color: white;";
  memeDisplayer.appendChild(memeTitle);

  var subDiv = document.createElement("div");
  subDiv.className = "meme-displayPlate__info-container";
  
  var dateHeader = document.createElement("h3");
  dateHeader.className = "meme-displayPlate__h3-format";
  dateHeader.innerHTML = atributeList[2];
  subDiv.appendChild(dateHeader);  

  var uploader = document.createElement("h3");
  uploader.className = "meme-displayPlate__h3-format";
  uploader.innerHTML = "Uploader: " + atributeList[1];
  subDiv.appendChild(uploader);   

  memeDisplayer.appendChild(subDiv);
  document.getElementById("memDisplayBody").appendChild(memeDisplayer);
}

async function removeMeme(){
  var childElem = document.getElementById("memeDisplayContainer");
  document.getElementById("memDisplayBody").removeChild(childElem);
}