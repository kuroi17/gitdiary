document.addEventListener("DOMContentLoaded", () => {

const entryDetails = document.getElementById("entryDetails");

  if (entryDetails) {
    // is a built-in JavaScript interface used to work with URL query strings — the part after the ? in a URL.
    const urlParams = new URLSearchParams(window.location.search);
    // this gets the value of the index parameter from the URL query string
    const entryIndex = urlParams.get("index");

    if (entryIndex !== null) {
      // retrieve entries from local storage or initialize an empty array
      const entries = JSON.parse(localStorage.getItem("entries")) || [];
      // this gets the entryData from the entryindex of the array "entries"
      const entryData = entries[entryIndex];

      let entryDetailsHTML = "";
      if (entryData) {
        entryDetailsHTML = `<article id="entryDetails" class="entry-card border rounded mb-4 mt-4">
        <h1 class="entry-title">${entryData.title}</h1>
    
        <span class="entry-date text-muted">${entryData.date}</span>

        <p class="entry-text">
          ${entryData.content}
        </p>
         ${
           entryData.image
             ? `<img src="${entryData.image}" alt="${entryData.title}" class="img-fluid mb-3">`
             : ""
         }

        <div class="entry-buttons">
          <button class="editButton btn btn-primary btn-lg px-4">Edit</button>
          <button class="deleteButton btn btn-secondary btn-lg px-4">Delete</button>
        </div>
      </article>
      `;
        entryDetails.innerHTML = entryDetailsHTML;

        //functionality for EDIT button
        const editButton = document.querySelector(".editButton");
        const deleteButton = document.querySelector(".deleteButton");
        if (editButton) {
          editButton.addEventListener("click", () => {
            const newTitle = prompt("Enter new title:");
            const newContent = prompt("Enter new content: ");

            if (newTitle || newContent) {
              // retrieve url parameters from window.location.search
              const urlParams = new URLSearchParams(window.location.search);

              // get the index parameter from the url
              const entryIndex = urlParams.get("index");

              // retrieve existing entries from local storage or initialize an empty array
              let entries = JSON.parse(localStorage.getItem("entries")) || [];
              // get the entryData at the specified index of array "entries"
              let entryData = entries[entryIndex];

              if (entryData) {
                // if newTitle or newContent, update entryData.content || entryData.title
                if (newTitle) entryData.title = newTitle;
                if (newContent) entryData.content = newContent;

                // equate the updated entryData back to entries array at entryIndex
                entries[entryIndex] = entryData;
                // save the updated entries array back to local storage using JSON.stringify
                localStorage.setItem("entries", JSON.stringify(entries));
                alert("Entry updated successfully!");
                window.location.reload();
              }
            }
          });
        }
        if (deleteButton) {
          deleteButton.addEventListener("click", () => {
            const confirmDelete = confirm(
              "Are you sure you want to delete this entry?"
            );
            if (confirmDelete) {
              // retrieve url parameters from window.location.search
              const urlParams = new URLSearchParams(window.location.search);
              // get the index parameter from the url
              const entryIndex = urlParams.get("index");
              // retrieve existing entries from local storage or initialize an empty array
              let entries = JSON.parse(localStorage.getItem("entries")) || [];
              // remove the entry at the specified index using splice
              entries.splice(entryIndex, 1);
              // save the updated entries array back to local storage
              localStorage.setItem("entries", JSON.stringify(entries));
              alert("Entry deleted successfully!");
              window.location.href = "view-entry.html"; // redirect to entries page
            }
          });
        }
      } else {
        entryDetails.innerHTML = "<p>Entry not found.</p>";
      }
    }
  }


});