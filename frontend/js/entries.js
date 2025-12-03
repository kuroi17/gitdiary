// use when functions is specific to entries page

document.addEventListener("DOMContentLoaded", () => {
  const buttonSelector = document.querySelector(".newEntriesBtn");
  if (buttonSelector) {
    buttonSelector.addEventListener("click", () => {
      window.location.href = "new-entry.html";
    });
  }
  
  // use the id entries-grid to instead of class entriesContainer to render entries
  const entriesGrid = document.getElementById("entries-grid");
  if (entriesGrid) {
    entries = JSON.parse(localStorage.getItem("entries")) || [];
    const currentPage = window.location.pathname;
    const isViewEntryPage = currentPage.includes("view-entry.html");

    let entriesGridHTML = "";

    // array.forEach(array)
    entries.forEach((entryData, index) => {
      // if view-entry.html
      if (isViewEntryPage) {
        entriesGridHTML += `
   <div class="entryCard card border p-3 rounded mt-4 mx-auto w-75">
   <div class="d-flex justify-content-between align-items-center">       
  <h3 class="fw-normal">${entryData.title}</h3>
  <!-- Link to view-entryDetail.html with index as query parameter -->

        <a href="view-entryDetail.html?index=${index}" class="readmoreLink text-end text-decoration-none" >
              Read more &rightarrow;
        </a>
        </div>
        <span class="fw-normal text-muted">${entryData.date}</span>
        <p class="text-secondary mt-3 text-gray-600">
          ${entryData.content}
        </p>
      </div>
`;
      } else {
        // index.html
        entriesGridHTML += `
        <div class="col-md-4 mb-3">
          <div class="entryCard card border p-3 rounded mt-4  ">
            <h3 class="fw-normal">${entryData.title}</h3>
            <span class="text-gray-500">${entryData.date}</span>
            <p class="mt-3 text-gray-600">
              ${entryData.content}
            </p>  
          </div>
          </div>
        `;
      }
    });

    entriesGrid.innerHTML = entriesGridHTML;
  }
  // for entryDetails cardPage
  
});
