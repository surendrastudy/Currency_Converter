const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const FALLBACK_URL = "https://latest.currency-api.pages.dev/v1/currencies";

// Select DOM elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

window.addEventListener("load", () => {
    updateExchangeRate();
});

// Update currency flags on change
for (let select of dropdowns) {
    for (currcode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currcode;
        newOption.value = currcode;
        if (select.name == "from" && currcode === "USD") {
            newOption.selected = "selected";
        } else if (select.name == "to" && currcode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update flag based on selected currency
const updateFlag = (element) => {
    let currcode = element.value;
    let countryCode = countryList[currcode]; // Get country code (e.g., "US", "IN")
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Fetch exchange rates with a fallback mechanism
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtval = amount.value;

    if (amtval === "" || amtval < 1) {
        amtval = 1; // Default to 1 if input is empty or invalid
        amount.value = "1";
    }

    try {
        let url = `${BASE_URL}/${fromcurr.value.toLowerCase()}.json`;
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch from primary URL, trying fallback.");
        }

        let data = await response.json();
        console.log(data)

        let rate = data[fromcurr.value.toLowerCase()][tocurr.value.toLowerCase()];

        if (!rate) {
            throw new Error("Invalid currency code");
        }

        let finalAmount = (amtval * rate).toFixed(2);
        msg.innerText = `${amtval} ${fromcurr.value} = ${finalAmount} ${tocurr.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Fetching from fallback URL...";
        fetchFromFallback();
    }
};

// Fetch exchange rates from the fallback URL
const fetchFromFallback = async () => {
    let amount = document.querySelector(".amount input");
    let amtval = amount.value;

    try {
        let url = `${FALLBACK_URL}/${fromcurr.value.toLowerCase()}.json`;
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch from fallback URL.");
        }

        let data = await response.json();
        let rate = data[fromcurr.value.toLowerCase()][tocurr.value.toLowerCase()];

        if (!rate) {
            throw new Error("Invalid currency code");
        }

        let finalAmount = (amtval * rate).toFixed(2);
        msg.innerText = `${amtval} ${fromcurr.value} = ${finalAmount} ${tocurr.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Unable to fetch exchange rate. Please try again later.";
    }
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault(); // Prevent form submission
    updateExchangeRate();
});
