// use when functions is specific to entries page

document.addEventListener("DOMContentLoaded", () => {
  const buttonSelector = document.querySelector(".newEntriesBtn");
  if (buttonSelector) {
    buttonSelector.addEventListener("click", () => {
      window.location.href = "new-entry.html";
    });
  }
  const submitEntryButton = document.querySelector(".jsButtonSubmitEntry");

  if (submitEntryButton) {
    submitEntryButton.addEventListener("click", () => {
      const title = document.querySelector(".jsTitleUserInput").value;
      const content = document.querySelector(".jsContentUserInput").value;
      const date = document.querySelector(".jsDateUserInput").value;
      const image = document.querySelector(".jsImageUserInput").value;

      const entryData = {
        title: title,
        content: content,
        date: date,
        image: image ? image : null, // if image then image as value else null
      };

      console.log(entryData);

      if (!title || !content) {
        alert("Pls put title and content");
        return;
      }

      alert("Entry submitted successfully!");
      console.log("Submitted Entry Data:", entryData);
    });
  }
});
