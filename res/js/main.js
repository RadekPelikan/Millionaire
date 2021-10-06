const levelBlock = document.getElementById("level-wrapper");
const questionText = document.getElementById("question");
const buttonsBlock = document.getElementById("button-wrapper");

// TODO: Multiple correct answers
let answerButtons;
let questionsJson;
let currentQ = 0;
let isSwitching = false;
let hasAnswered = false;

const readFile = async () => {
    try {
        const file = await fetch("res/data/data.json");
        await console.log("Json load successful");
        return await file.json();
    } catch (e) {
        return readFileGitHub();
    }
};

const changeQuestionText = () => {
    let question;
    try {
        question = questionsJson[currentQ]["question"];
    } catch {
        question = "Už žádné otázky, došly";
    }
    questionText.innerText = question;
};

const HandleNextQuestion = async () => {
    if (isSwitching) return;

    levelBlock.classList.add("next-question");
    isSwitching = true;

    await setTimeout(() => {
        changeQuestionText();
        generateButtons();
    }, 1000);

    await setTimeout(() => {
        levelBlock.classList.remove("next-question");
        isSwitching = false;
        hasAnswered = false;
    }, 2100);
};

const generateButtons = async () => {
    answerButtons = [];
    buttonsBlock.innerHTML = "";
    await questionsJson[currentQ]["answers"].forEach((text, index) =>
        createButton(text, index)
    );
};

const createButton = (answerText, index) => {
    let button = document.createElement("button");

    button.dataset.id = index;
    button.onclick = checkAnswer;
    button.innerText = answerText;

    button.classList.add("button","is-fullwidth", "is-large", "my-3");

    buttonsBlock.appendChild(button);
    answerButtons.push(button);
};

const checkAnswer = () => {
    if (hasAnswered) return;

    let button = event.target;
    if (button.dataset.id == parseInt(questionsJson[currentQ].correctAns) - 1) {
        button.classList.add("is-success");
    } else {
        button.classList.add("is-danger");
    }
    hasAnswered = true;

    setTimeout(() => {
        HandleNextQuestion();
        currentQ++;
    }, 1000);
};

window.onload = async () => {
    questionsJson = await readFile();
    HandleNextQuestion();
};
