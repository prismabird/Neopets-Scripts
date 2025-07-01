// ==UserScript==
// @name         Neopets - Petlookup Birthday Display
// @version      0.0.1
// @description  Converts a pet's age in hours to their actual birthday and displays it at the top of the petpage
// @author       Amu
// @match        *://*.neopets.com/petlookup.phtml*
// @match
// @grant        none
// @icon         https://www.neopets.com/favicon.ico
// ==/UserScript==

// NOTE: The :MM displayed matches the :MM of the page load time; only the HH is accurate.

(function() {
    'use strict';
    const body = document.body;

    // Isolate the pet's age in hours
    function getAgeInHours() {
        const bodyText = document.body.textContent;
        // console.log(bodyText);
        // screaming crying throwing up
        //regex = new RegExp("(\\d{0,3},)?(\\d{1,3)\\s?(<\/b>)?\\s?hours)Birthday");
        const regex = new RegExp("\\d{0,3},{0,1}\\d{1,3} hours\\)");

        // regex = new RegExp("(\\d{0-3},)?[0-9]?[0-9]?[0-9]?\\s?" + hoursTxt);
        console.log("Regex >> ", regex);

        let matches;
        while ((matches = regex.exec(bodyText)) !== null) {
            const hrAge = matches[0];
            const h = hrAge.replace(/[^0-9]/g, "");
            console.log("Hours = " + h);
            return h;
        };
    };

    // Calculate the birthdate, adjusting timezone to PST
    function calculateBirthday() {
        const hrAge = getAgeInHours();
        if (!hrAge) {
            return;
        };

        const rightNow = new Date().getTime();
        const msAge = hrAge * 3600 * 1000;
        const bdTimestamp = rightNow - msAge;
        const bdate = new Date(bdTimestamp);
        const neoYear = bdate.getFullYear() - 1998;
        const formattedBdate = bdate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', dateStyle: "full", timeStyle: "short"});
        console.log("Pet bday: " + formattedBdate);
        return {"bday": formattedBdate, "neoYr": neoYear};
    };

    // Creates the paragraph element and inserts it at the top of the petpage
    function createBirthdayText() {
        const calc = calculateBirthday();
        if (!calc) {
            return;
        };
        const birthday = calc.bday;
        const yr = calc.neoYr;
        const para = document.createElement("p");
        para.setAttribute("style", "font-size:15pt; text-align: center; background-color: #1A1A3F; padding: 10; font-family: Helvetica; color: #FFF; margin: 0;");
        const textNode = document.createTextNode("Birthday: " + birthday + " (Y" + yr + ")");
        para.appendChild(textNode);
        const first = body.firstChild;
        // console.dir(first);
        body.insertBefore(para, first.nextSibling.nextSibling);
    };

    createBirthdayText();
})();
