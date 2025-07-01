// ==UserScript==
// @name         Neopets: Add Petpage Link To Neoboards
// @version      0.0.1
// @description  Adds petpage link under active pet display
// @author       Amu
// @match        *://www.neopets.com/neoboards/topic*
// @match        *://neopets.com/neoboards/topic*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.neopets.com/favicon.ico
// @run-at       document-end
// ==/UserScript==


function main() {
    $(".boardPostByline").each(function(i, byline) {
        const petName = $(byline).find(".postPetInfo").text().split("Active Neopet")[0];
        const ppUrl = `https://www.neopets.com/~${petName}`;
        const petpageA = document.createElement("a");
        petpageA.href = ppUrl;
        petpageA.innerHTML = "Petpage";
        petpageA.target = "_blank";
        //$(byline).append(petpageA);
        $(byline).append(`<span><a href="${ppUrl}">[pp]</a></span>`);
    });
};

main();
