document.addEventListener("DOMContentLoaded", () => {
  const submitEntryButton = document.querySelector(".jsButtonSubmitEntry");
  const submitFilesButton = document.querySelector(".jsButtonSubmitFiles");
  const fileInput = document.querySelector(
    ".jsImageUserInput input[type='file']"
  );
  const dropzoneText = document.querySelector(".dropzone-text");
  const dropzoneStatus = document.querySelector(".dropzone-status");
  const uploadedStatusDone = document.querySelector(".uploadedStatusDone");
  const uploadStatus = document.querySelector(".uploadStatus");

  if (fileInput) {
    fileInput.addEventListener("change", (file) => {
      // if there is file selected, the dropzoneText ("Click or drag file to upload") will be hidden while dropzoneStatus ("File selected: filename") will be shown

      if (file.target.files.length > 0) {
        // domList means list of styles in the class. eg -> [mb-1, text-center]
        dropzoneText.classList.add("d-none"); // add the class d-none to domList of dropzoneText
        dropzoneStatus.classList.remove("d-none"); // remove the class d-none from domList of dropzoneStatus

        uploadStatus.classList.add("d-none");
        uploadedStatusDone.classList.remove("d-none");

        dropzoneStatus.textContent = `File selected: ${file.target.files[0].name}`;
      } else {
        dropzoneText.classList.remove("d-none");
        dropzoneStatus.classList.add("d-none");
      }
    });
  }

  if (submitEntryButton) {
    submitEntryButton.addEventListener("click", async () => {
      const title = document.querySelector(".jsTitleUserInput").value;
      const content = document.querySelector(".jsContentUserInput").value;
      const date = document.querySelector(".jsDateUserInput").value;
      const fileInput = document.querySelector(
        ".jsImageUserInput input[type='file']"
      );

      /*
      old JSON approach
      const entryData = {
        title: title,
        content: content,
        date: date,
        image: image ? image : null,
      };

      console.log(entryData);
      */

      if (!title || !content) {
        alert("Pls put title and content");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("date", date);

      if (fileInput.files.length > 0)
        formData.append("media", fileInput.files[0]);

      try {
        // Call the async function to submit the entry
        // use relative path since we're on same server
        const response = await fetch(
          "http://localhost/gitdiary/backend/submitEntry.php",
          {
            method: "POST", // POST method is used to send data to the server
            // Don't set Content-Type header - browser will set it with boundary for FormData

            // headers: {
            //   "Content-Type": "application/json",
            // },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // waiting for the response data
        const result = await response.json();
        console.log("server response: ", result);

        if (result.success) {
          alert("Entry submitted successfully!");
        } else {
          alert("Failed to submit entry: " + result.message);
        }
      } catch (error) {
        console.error("Error submitting entry:", error);
        alert("An error occurred while submitting the entry.");
      }

      // window.location.href = "index.html";
    });
  }
});
