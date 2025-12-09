// use when functions is specific to entries page

document.addEventListener("DOMContentLoaded", async () => {
  const buttonSelector = document.querySelector(".newEntriesBtn");
  if (buttonSelector) {
    buttonSelector.addEventListener("click", () => {
      window.location.href = "new-entry.html";
    });
  }

  // use the id entries-grid to instead of class entriesContainer to render entries
  const entriesGrid = document.getElementById("entries-grid");
  if (!entriesGrid) return;

  if (entriesGrid) {
    let entries = [];

    try {
      const response = await fetch(
        "http://localhost/gitdiary/backend/getEntryandShow.php"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      entries = await response.json();
      console.log("Entries from database:", entries);
    } catch (error) {
      console.log("Error submitting entry:", error);
      return;
    }

    const currentPage = window.location.pathname;
    const isViewEntryPage = currentPage.includes("view-entry.html");

    function renderEntries(entriesToShow) {
      let entriesGridHTML = "";
      // array.forEach(array)
      entriesToShow.forEach((entryData, index) => {
        // if view-entry.html
        if (isViewEntryPage) {
          let mediaUrl = "";
          // If entryMedia exists
          if (entryData.entryMedia) {
            if (entryData.entryMedia.startsWith("http")) {
              mediaUrl = entryData.entryMedia; //backend/uploads/filename.png.
            } else {
              mediaUrl = `http://localhost/gitdiary/${entryData.entryMedia}
              `;
              //http://localhost/gitdiary/backend/uploads/filename
            }
          } else {
            // If entryMedia is null or empty
            mediaUrl = "";
          }

          console.log("View Entry Media URL:", mediaUrl);

          entriesGridHTML += `
   <div class="entryCard card border p-3 rounded mt-4 mx-auto w-75">
   <div class="d-flex justify-content-between align-items-center">
   ${
     mediaUrl
       ? `<img src="${mediaUrl}" alt="Entry media" class="mb-2 mt-2 w-100">`
       : ""
   }   
  <h3 class="fw-normal">${entryData.entryTitle}</h3>
  <!-- Link to view-entryDetail.html with index as query parameter -->

        <a href="view-entryDetail.html?index=${
          entryData.entryNumber
        }" class="readmoreLink text-end text-decoration-none" >
              Read more &rightarrow;
        </a>
        </div>
        <span class="fw-normal text-muted">${entryData.createdAt}</span>
        <p class="text-secondary mt-3 text-gray-600">
          ${entryData.entryContent.substring(0, 100)}...
        </p>
      </div>
`;
        } else {
          // index.html
          if (index < 3) {
            let mediaUrl = "";

            if (entryData.entryMedia) {
              if (entryData.entryMedia.startsWith("http")) {
                mediaUrl = entryData.entryMedia; //backend/uploads/filename.png.
              } else {
                mediaUrl = `http://localhost/gitdiary/${entryData.entryMedia}`; // http://localhost/gitdiary/backend/uploads/filename
              }
            } else {
              mediaUrl = "";
            }
            entriesGridHTML += `
        <div class="col-md-4 mb-3">
          <div class="entryCard card border p-3 rounded mt-4  ">
          ${
            mediaUrl
              ? `<img src="${mediaUrl}" alt="Entry media" class="mb-2 mt-2 w-100">`
              : ""
          }
          
            <h3 class="fw-normal">${entryData.entryTitle}</h3>
            <span class="text-gray-500">${entryData.createdAt}</span>
            <p class="mt-3 text-gray-600">
              ${entryData.entryContent.substring(0, 100)}...
            </p>  
          </div>
          </div>
        `;
          }
        }
      });

      entriesGrid.innerHTML = entriesGridHTML;
    }

    renderEntries(entries);

    if (isViewEntryPage) {
      const searchEntry = document.getElementById("jsEntryInputSearch");
      if (searchEntry) {
        searchEntry.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            const inputEntry = searchEntry.value.toLowerCase();

            const filteredEntries = entries.filter(
              (entry) =>
                entry.entryTitle.toLowerCase().includes(inputEntry) ||
                entry.entryContent.toLowerCase().includes(inputEntry)
            );
            // If no entries found, show a message
            if (filteredEntries.length === 0) {
              entriesGrid.innerHTML = `<p class="text-center mt-4">No entries found.</p>`;
            } else {
              renderEntries(filteredEntries);
            }
          }
        });
      }
    }
  }
});
