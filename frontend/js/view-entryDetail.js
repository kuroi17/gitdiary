document.addEventListener("DOMContentLoaded", async () => {
  const entryDetails = document.getElementById("entryDetails");

  if (entryDetails) {
    // URLSearchParams is a built-in JavaScript interface used to work with URL query strings — the part after the ? in a URL.
    const urlParams = new URLSearchParams(window.location.search);
    // this gets the value of the index parameter from the URL query string
    const entryIndex = urlParams.get("index");

    if (entryIndex !== null) {
      let entryData;
      try {
        const response = await fetch(
          `http://localhost/gitdiary/backend/getEntryandShow.php?id=${entryIndex}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        entryData = await response.json();
      } catch (error) {
        console.error("Error fetching entries:", error);
        return;
      }

      let entryDetailsHTML = "";
      if (entryData) {
        entryDetailsHTML = `<article id="entryDetails" class="entry-card border rounded mb-4 mt-4">
        <h1 class="entry-title">${entryData.entryTitle}</h1>
    
        <span class="entry-date text-muted">${entryData.createdAt}</span>

        <p class="entry-text">
          ${entryData.entryContent}
        </p>
         ${
           entryData.entryImage
             ? `<img src="${entryData.entryImage}" alt="${entryData.entryTitle}" class="img-fluid mb-3">`
             : ""
         }

        <div class="entry-buttons">
          <button class="editButton btn btn-primary btn-lg px-4">Edit</button>
          <button class="deleteButton btn btn-secondary btn-lg px-4">Delete</button>
        </div>
      </article>
      `;
        entryDetails.innerHTML = entryDetailsHTML;

        const editButton = document.querySelector(".editButton");
        const deleteButton = document.querySelector(".deleteButton");

        //functionality for EDIT button
        if (editButton) {
          editButton.addEventListener("click", async () => {
            const newTitle = prompt("Enter new title:");
            const newContent = prompt("Enter new content: ");

            if (newTitle || newContent) {
              const newEntryData = {
                action: "update",
                title: newTitle ? newTitle : entryData.entryTitle,
                content: newContent ? newContent : entryData.entryContent,
                id: entryIndex,
              };
              try {
                const result = await fetch(
                  "http://localhost/gitdiary/backend/updateandDelete.php",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newEntryData),
                  }
                );
                const response = await result.json();
                alert(response.message);
                window.location.reload();
              } catch (error) {
                alert("Error updating entry: " + error.message);
                return;
              }
            }
          });
        }

        if (deleteButton) {
          deleteButton.addEventListener("click", async () => {
            const confirmDelete = confirm(
              "Are you sure you want to delete this entry?"
            );
            if (confirmDelete) {
              try {
                const result = await fetch(
                  "http://localhost/gitdiary/backend/updateandDelete.php",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      action: "delete",
                      id: entryIndex,
                    }),
                  }
                );
                const response = await result.json();
                alert(response.message);
              } catch (error) {
                alert("Error updating entry: " + error.message);
                return;
              }
            }
          });
        }
      } else {
        entryDetails.innerHTML = "<p>Entry not found.</p>";
      }
    }
  }
});
