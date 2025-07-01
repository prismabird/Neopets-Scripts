// ==UserScript==
// @name         Neopets - Petpage Birthday Display
// @version      0.0.1
// @description  Converts a pet's age in hours to their actual birthday and displays it at the top of the petpage
// @author       Amu
// @match        *://*.neopets.com/~*
// @match        *://neopets.com/~*
// @match
// @grant        none
// @icon         https://www.neopets.com/favicon.ico
// ==/UserScript==

// NOTE: The :MM displayed matches the :MM of the page load time; only the HH is accurate.

(function() {
    'use strict';

    const suffixes = [", hour", "hour", "old"];
    const prefixes = ["Age: ", "Age:", "hunting sometime."];
    const body = document.body;
    const referLink = document.querySelectorAll('a[href*="refer.phtml?username="]');
    const href = referLink[0].getAttribute("href");
    const username = href.split('=')[1];

    // Isolate the pet's age in hours
    function getAgeInHours() {
        const bodyText = document.body.textContent;
        let searchString = "";
        let suf, pref = false;
        let regex;

        for (let i = 0; i < suffixes.length; i++) {
            if (bodyText.includes(suffixes[i])) {
                searchString = suffixes[i];
                suf = true;
                break;
            };
        };
        if (!suf || bodyText.includes("I am an Acara *giggle*")) {
            for (let i = 0; i < prefixes.length; i++) {
                if (bodyText.includes(prefixes[i])) {
                    searchString = prefixes[i];
                    pref = true;
                    break;
                };
            };
        };
        // screaming crying throwing up
        if (suf) {
            regex = new RegExp("(\\d+)\\s{0,1}\\n{0,1}\\s{0,15}" + searchString);
        };
        if (pref) {
            regex = new RegExp(searchString + "\\s*(\\d+)");
        };
        if (!regex) { return; };
        let matches;
        while ((matches = regex.exec(bodyText)) !== null) {
            const hrAge = matches[1];
            console.log("Hours = " + hrAge);
            return hrAge;
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
        para.setAttribute("id", "birthdayText");
        para.setAttribute("style", "font-size:14pt; text-align: center; background-color: #1A1A3F; padding: 5; font-family: Helvetica; color: #FFF; margin: 0;");
        const textNode = document.createTextNode("Birthday: " + birthday + " (Y" + yr + ")");
        para.appendChild(textNode);
        const first = body.firstChild;
        // console.dir(first);
        body.insertBefore(para, first.nextSibling.nextSibling);
    };

    function createPoundText() {
        if (username === "none") {
            console.log("In the pound!");
            const para = document.createElement("p");
            para.setAttribute("id", "birthdayText");
            para.setAttribute("style", "font-size:10pt; text-align: center; background-color: #184818; padding: 1; font-family: Helvetica; color: #FFF; margin: 0;");
            const textNode = document.createTextNode("✨ [IN THE POUND] ✨");
            para.appendChild(textNode);
            const first = body.firstChild;
            // console.dir(first);
            body.insertBefore(para, first.nextSibling.nextSibling);
        };
    };

    function createButton() {
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("id", "toggleButton");
        button.appendChild(document.createTextNode("Close"));
    };

    function toggle(button, element) {
        element.remove();
        button.remove();
    };


    function createToggle() {
        const btn = document.getElementById("toggleButton");
        const birthdayP = document.getElementById("birthdayText");
        btn.addEventListener('click', birthdayP.remove());
    };


    function createUserLink() {
        referLink.forEach(link => {
            const params = href.split('?')[1];
            const u = params.replace("username=", "user=");
            const neoDomain = "https://www.neopets.com/userlookup.phtml?";
            const placeValue = "place=9999";
            const urlString = (neoDomain + placeValue + "&" + u);
            // console.log(urlString);
            const newUrl = new URL(urlString);
            link.setAttribute('href', newUrl.href.toString());
        });
    };

    function main() {
        createBirthdayText();
        createUserLink();
        createPoundText();
        // createButton();
        // createToggle();
    };

    main();
})();
