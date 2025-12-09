document.addEventListener("DOMContentLoaded", () => {
  const submitEntryButton = document.querySelector(".jsButtonSubmitEntry");

  if (submitEntryButton) {
    submitEntryButton.addEventListener("click", async () => {
      const title = document.querySelector(".jsTitleUserInput").value;
      const content = document.querySelector(".jsContentUserInput").value;
      const date = document.querySelector(".jsDateUserInput").value;
      const fileInput = document.querySelector(".jsImageUserInput").value;

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

      if (fileInput.files.length > 0) formData.append("media", fileInput.files[0]);

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

      window.location.href = "index.html";
    });
   
  }
   
});
