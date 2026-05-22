document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("screeningForm");
  const dropZone = document.getElementById("idDropZone");
  const fileInput = document.getElementById("idFileInput");
  const idPreview = document.getElementById("idPreview");
  const promptText = dropZone.querySelector(".drop-zone-prompt");
  const actionsBar = document.getElementById("actionsBar");
  const removeBtn = document.getElementById("removeIdBtn");

  // Local state value for the base64 media asset
  let uploadedPhotoBase64 = null;

  // Interactivity for File Input Clicking
  dropZone.addEventListener("click", () => fileInput.click());

  // Drag over states
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  ["dragleave", "drop"].forEach(event => {
    dropZone.addEventListener(event, () => dropZone.classList.remove("drag-over"));
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length) {
      handleFile(fileInput.files[0]);
    }
  });

  function handleFile(file) {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image (PNG or JPG).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("File size bounds exceeded. Must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedPhotoBase64 = e.target.result;
      idPreview.src = uploadedPhotoBase64;
      idPreview.style.display = "block";
      promptText.style.display = "none";
      actionsBar.style.display = "flex";
    };
    reader.readAsDataURL(file);
  }

  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation(); 
    fileInput.value = "";
    uploadedPhotoBase64 = null;
    idPreview.src = "";
    idPreview.style.display = "none";
    promptText.style.display = "block";
    actionsBar.style.display = "none";
  });

  // Handle Form Submission Processing
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Guard Clause: Ensure eligibility document has been loaded
    if (!uploadedPhotoBase64) {
      alert("Please upload a Photo ID or Birth Certificate to complete screening.");
      return;
    }

    // Capture standard text fields from the UI form state
    const compiledSubmissionData = {
      athleteName: document.getElementById("playerName").value,
      dateOfBirth: document.getElementById("playerDOB").value,
      schoolUnit: document.getElementById("schoolUnit").value,
      guardianName: document.getElementById("guardianName").value,
      guardianIdNumber: document.getElementById("guardianId").value,
      verificationDocumentB64: uploadedPhotoBase64
    };

    // Output package validation check right in CodePen console
    console.log("Structured Registration Payload Ready:", compiledSubmissionData);
    alert(`Success! Profile for ${compiledSubmissionData.athleteName} is verified locally.`);
  });
});
