function showFile(event) {
    let reader = new FileReader();

    reader.onload = (event) => {
        document.getElementById('fileImgId').src = event.target.result;
    };

    reader.readAsDataURL(event.target.files[0]);
}