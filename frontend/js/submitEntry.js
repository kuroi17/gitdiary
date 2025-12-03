document.addEventListener("DOMContentLoaded", () => {
const submitEntryButton = document.querySelector(".jsButtonSubmitEntry");

  if (submitEntryButton) {
    submitEntryButton.addEventListener("click", async () => {
      const title = document.querySelector(".jsTitleUserInput").value;
      const content = document.querySelector(".jsContentUserInput").value;
      const date = document.querySelector(".jsDateUserInput").value;
      const image = document.querySelector(".jsImageUserInput").value;

      const entryData = {
        title: title,
        content: content,
        date: date,
        image: image ? image : null,
      };

      console.log(entryData);

      if (!title || !content) {
        alert("Pls put title and content");
        return;
      }

      try {
        // Call the async function to submit the entry
        const response = await fetch("/backend/submitEntry.php",{
          method: "POST", // POST method is used to send data to the server
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entryData)
        });
  

    if (!response.ok){
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
      });
  }
});
