document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const filePath = fileInput.value

      const allowedExtensions = /(\.jpg|\.jpeg|\.png)/i
      if(!allowedExtensions.exec(filePath)){
        Toastify({
          text: "Image Format not Supported",
          className: "info",
          style: {
              background: "linear-gradient(to right, #ff0000, #dd2a7f)",
          }
          }).showToast();
        fileInput.value = ''
          // foodImage.style.border = "red"
          // return false
      }else{
        if (file) {
          const reader = new FileReader();
  
          reader.addEventListener('load', () => {
            previewImage.setAttribute('src', reader.result);
          });
  
          reader.readAsDataURL(file);
          previewContainer.style.display = 'block'; // Show the preview container
        } else {
          previewImage.setAttribute('src', '#');
          previewContainer.style.display = 'none'; // Hide the preview container if no file selected
        }
      }
      
    });
  });