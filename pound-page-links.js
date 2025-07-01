// ==UserScript==
// @name         Neopets: Add Petpage Link To Pound
// @namespace    http://tampermonkey.net/
// @version      2025-06-30
// @description  Adds petpage & pet lookup links above a pound pet entry
// @author       Amu
// @match        *://www.neopets.com/pound/adopt.phtml*
// @match        *://neopets.com/pound/adopt.phtml*
// @icon         https://www.neopets.com/favicon.ico
// @grant        none
// @run-at       document-end
// ==/UserScript==

let pet0Name = "";
let pet1Name = "";
let pet2Name = "";
let prevPet0Name;
let prevPet1Name;
let prevPet2Name;

function getPetNames() {
    prevPet0Name = pet0Name;
    prevPet1Name = pet1Name;
    prevPet2Name = pet2Name;
    pet0Name = document.getElementById("pet0_name")?.textContent;
    pet1Name = document.getElementById("pet1_name")?.textContent;
    pet2Name = document.getElementById("pet2_name")?.textContent;
};

function insertPetpageLinks() {
    const petNames = [pet0Name, pet1Name, pet2Name];
    petNames.forEach((name, index) => {
        const divId = `pet${index}Link`;
        // Remove old links
        if (document.getElementById(divId)) {
            let oldLink = document.getElementById(divId);
            oldLink.parentNode.removeChild(oldLink);
        };
        if (!name || name === "") {
            return;
        };
        // Create new links
        const linkDiv = document.createElement("div");
        linkDiv.setAttribute("id", `pet${index}Link`);

        const petpageA = document.createElement("a");
        petpageA.href = `https://www.neopets.com/~${name}`;
        petpageA.innerHTML = "Petpage";
        petpageA.target = "_blank";
        linkDiv.appendChild(petpageA);
        const lookupA = document.createElement("a");
        lookupA.href = `https://www.neopets.com/petlookup.phtml?pet=${name}`;
        lookupA.innerHTML = "Lookup";
        lookupA.target = "_blank";
        linkDiv.innerHTML += " | ";
        linkDiv.appendChild(lookupA);
        const petDiv = document.getElementById(`pet${index}`);
        petDiv.insertAdjacentElement("beforebegin", linkDiv);
    });
};

function addLinks() {
    getPetNames();
    insertPetpageLinks();
};

function addRefreshNamesOnViewMore() {
    let viewMore = document.getElementById("view_more");
    viewMore.addEventListener("click", function() {
        setTimeout(addLinks, 800);
    }, false);
};

function main() {
    getPetNames();
    addLinks();
    addRefreshNamesOnViewMore();
};


main();
