const Item = require("../models/item");



function formatList(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return "<p>None</p>";
    }
    return "<ul>" + items.map(item => {
        // Check if the item is a URL (basic check)
        if (item.startsWith("http")) {
            return `<li><a class="source-link" href="${item}" target="_blank" rel="noopener noreferrer">${item}</a></li>`;
        }
        return `<li>${item}</li>`;
    }).join('') + "</ul>";
}

        function openModal(title, status, category, ranking, whyThisUniversity, programOfInterest, tuition, totalCost, scholarships, campus, career, pros, cons, image, cImage, sources,) {
            
            // Ensure pros and cons are arrays
            if (typeof pros === "string") pros = JSON.parse(pros);
            if (typeof cons === "string") cons = JSON.parse(cons);
            if (typeof sources === "string") sources = JSON.parse(sources);
            if (typeof whyThisUniversity === "string") whyThisUniversity = JSON.parse(whyThisUniversity);
           
           
            console.log("Campus Image URL:", cImage);
            document.getElementById("modalTitle").innerText = title;
            document.getElementById("campusImage").src = cImage;
            document.getElementById("modalImage").src = image;
            document.getElementById("modalStatus").innerText = status;
            document.getElementById("modalCategory").innerText = category;
            document.getElementById("modalRanking").innerText = ranking;
            document.getElementById("modalWhy").innerHTML = formatList(whyThisUniversity);
            document.getElementById("modalPrograms").innerText = programOfInterest;
            document.getElementById("modalTuition").innerText = tuition;
            document.getElementById("modalTotalCost").innerText = totalCost;
            document.getElementById("modalScholarships").innerText = scholarships;
            document.getElementById("modalCampus").innerText = campus;
            document.getElementById("modalCareer").innerText = career;

             // Convert string arrays back to lists
             document.getElementById("modalPros").innerHTML = formatList(pros);
             document.getElementById("modalCons").innerHTML = formatList(cons);
             document.getElementById("modalSources").innerHTML = formatList(sources);

          
            document.getElementById("itemModal").style.display = "flex";
        
            // Disable scrolling on the background
            document.body.style.overflow = "hidden";
            
              // Handle missing campus image with default
    if (cImage) {
        document.getElementById("campusImage").src = cImage;
    } else {
        document.getElementById("campusImage").src = "/images/default-campus.jpeg"; // Fallback
    }

    console.log("Sources received in modal:", sources);
}
        

        function closeModal() {
            document.getElementById("itemModal").style.display = "none";

            // Re-enable scrolling on the background
            document.body.style.overflow = "auto";
        }

 