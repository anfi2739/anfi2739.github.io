let triviabtn = document.querySelector("#js-new-quote").addEventListener("click", newTrivia);

let answerbtn = document.querySelector("#js-tweet").addEventListener("click", newAnswer);

let current = {
    question: "",
    answer: "",
}

const endpoint = "https://catfact.ninja/fact";

async function newTrivia() {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();
        current.question = data.fact;
        displayTrivia();
    } catch (err) {
        alert('Failed to get trivia');
        console.error(err);
    }
}
console.log(data);
function displayTrivia() {
    const triviaText = document.querySelector("#js-quote-text");
    triviaText.textContent = current.question;
}

function newAnswer() {
    alert("Cats are amazing, aren’t they?");
}
newTrivia();