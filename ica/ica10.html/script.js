let triviabtn = document.querySelector("#js-new-quote").addEventListener("click", newTrivia);
let answerbtn = document.querySelector("#js-tweet").addEventListener("click", newAnswer);

let current = {
    question: "",
    answer: "",
};

const endpoint = "https://trivia.cyberwisp.com/getrandomchristmasquestion";

async function newTrivia() {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const json = await response.json();
        console.log(json);
        current.question = json["question"];
        current.answer = json["answer"];
        console.log(current.question);
        console.log(current.answer);
        displayTrivia(current.question);
    } catch (err) {
        console.log(err);
        alert('Failed to get trivia');
    }
}

function displayTrivia(question) {
    const questionText = document.querySelector("#js-quote-text");
    const answerText = document.querySelector("#js-answer-text");
    answerText.textContent = "";
    questionText.textContent = question;
}

function newAnswer() {
    const answerText = document.querySelector("#js-answer-text");
    answerText.textContent = current.answer;
}

newTrivia();
