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
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("athleteListContainer");
  const totalCounter = document.getElementById("totalCount");
  const emptyState = document.getElementById("emptyState");

  // Mock Database Array representing submissions received across districts
  const athleteRoster = [
    {
      id: "REG-01",
      name: "Musa Baluku",
      dob: "2013-05-12",
      school: "Kampala Primary School",
      docSnapshot: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%233b82f6'/><text x='50%25' y='50%25' font-size='12' fill='white' text-anchor='middle'>ID Photo</text></svg>"
    },
    {
      id: "REG-02",
      name: "Brian Okello",
      dob: "2012-11-30",
      school: "St. Jude Academy",
      docSnapshot: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2310b981'/><text x='50%25' y='50%25' font-size='12' fill='white' text-anchor='middle'>ID Photo</text></svg>"
    }
  ];

  function renderRoster() {
    if (athleteRoster.length === 0) {
      emptyState.style.display = "block";
      totalCounter.textContent = "0";
      return;
    }

    emptyState.style.display = "none";
    totalCounter.textContent = athleteRoster.length;

    athleteRoster.forEach(athlete => {
      // Build row row shell
      const row = document.createElement("div");
      row.className = "athlete-row";

      row.innerHTML = `
        <img src="${athlete.docSnapshot}" alt="Thumbnail" class="thumb-preview" />
        <div class="player-name">${athlete.name}</div>
        <div>📅 DoB: ${athlete.dob}</div>
        <div><span class="badge-unit">${athlete.school}</span></div>
        <button type="button" class="view-doc-btn" onclick="alert('Viewing full asset payload for entry: ${athlete.id}')">Review ID</button>
      `;

      container.appendChild(row);
    });
  }

  // Initial Execution
  renderRoster();
});
