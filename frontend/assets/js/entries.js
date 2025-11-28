// use when functions is specific to entries page

document.addEventListener("DOMContentLoaded", () => {
  const buttonSelector = document.querySelector(".newEntriesBtn");
  if (buttonSelector) {
    buttonSelector.addEventListener("click", () => {
      window.location.href = "view-entry.html"; 
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
        image: image ? image : null,
      };

      console.log(entryData);

      if (!title || !content) {
        alert("Pls put title and content");
        return;
      }

      // entryData will only be saved in local storage if it is in string format

      // retrieve existing entries from local storage or initialize an empty array
      let entries = JSON.parse(localStorage.getItem("entries")) || [];
      // add the new entry to the entries array
      entries.push(entryData);
      // save the updated entries array back to local storage
      localStorage.setItem("entries", JSON.stringify(entries));

      alert("Entry submitted successfully!");
      console.log("Submitted Entry Data:", entryData);
      window.location.href = "new-entry.html"; // refresh to entries page
    });
  }

  const entriesContainer = document.querySelector(".entriesContainer");

  if (entriesContainer) {
    const entries = JSON.parse(localStorage.getItem("entries")) || [];

    const currentPage = window.location.pathname;
    const isViewEntryPage = currentPage.includes("view-entry.html");

    let entriesContainerHTML = "";
    entries.forEach((entryData) => {
      if (isViewEntryPage) {
        entriesContainerHTML += `
  // <div class="entryCard border p-3 rounded mt-4 w-75 mx-auto">
   <div class="d-flex justify-content-between align-items-center">       
  <h3 class="fw-semibold">${entryData.title}</h3>
        <a href="#" class="text-end text-decoration-none">
              Read more &rightarrow;
        </a>
        </div>
        <span class="text-gray-500 fw-normal text-muted">${entryData.date}</span>
        <p class="mt-3 text-gray-600">
          ${entryData.content}
        </p>
      </div>
`;
      } else {
        entriesContainerHTML += `
          <div class="entryCard border p-3 rounded mt-4 w-75 mx-auto">
            <h3 class="fw-semibold">${entryData.title}</h3>
            <span class="text-gray-500">${entryData.date}</span>
            <p class="mt-3 text-gray-600">
              ${entryData.content}
            </p>
          </div>
        `;
      }
    });
    entriesContainer.innerHTML = entriesContainerHTML;
  }
});
