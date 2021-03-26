function sendData() {
    const formData = new FormData(form);
    formData.append("type", formData.get('file').type);
    formData.append("isnsfw", document.getElementById('nsfwCheckbox').checked);
    fetch("http://localhost:8080/api/v1/meme/addmeme", {
        method: 'POST',
        body: formData
    })
    //.then(response => response.json())
    .then(result => {
        console.log('Success:', result);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Access the form element...
const form = document.getElementById("upload-form");

// ...and take over its submit event.
form.addEventListener("submit", function (event) {
    event.preventDefault();

    if(document.getElementById("agreementCheckbox").checked){
      
      sendData();
      form.reset();
      document.getElementById("fileUploadDropZone").value = "";
    } else {
      alert("You must agree to the T.O.S.");
    }
});



document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");
  
  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });
  
  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });
  
  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });
  
  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });
  
  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();
  
    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }
  
    dropZoneElement.classList.remove("drop-zone--over");
  });
});



/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");
  
  // First time - remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }
  
  // First time - there is no thumbnail element, so lets create it
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }
  
  thumbnailElement.dataset.label = file.name;
  
  // Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
  
    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}
  