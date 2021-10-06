const levelBlock = document.getElementById("level-wrapper");
const questionText = document.getElementById("question");
const buttonsBlock = document.getElementById("button-wrapper");
const priceTable = document.getElementById("price-table");

// TODO: Multiple correct answers
let answerButtons;
let dataJSON;
let currentQ = 0;
let isSwitching = false;
let hasAnswered = false;
let currentPrice = 0;
let prices = [];
let currentButtons = [];
let ansButtonColor = "has-background-grey-lighter";

const readFile = async () => {
    try {
        const file = await fetch("res/data/data.json");
        await console.log("Json load successful");
        return await file.json();
    } catch (e) {
        console.log(e);
    }
};

const generatePriceTable = () => {
    let multiplayer = 1;
    let dataPrices = dataJSON.prices;
    for (let i = 0; i < dataJSON.questions.length; i++) {
        if (isNaN(dataPrices[i % dataPrices.length])) {
            createPrice(dataPrices[i % dataPrices.length]);
            dataPrices.pop();
            continue;
        }
        createPrice(dataPrices[i % dataPrices.length] * multiplayer);
        multiplayer *= i % 3 == 2 ? 10 : 1;
    }
};

const createPrice = (value) => {
    let price = document.createElement("h3");
    price.classList.add(
        "title",
        "is-3",
        "has-text-light",
        "has-text-centered",
        "my-4"
    );
    price.innerText = value;
    prices.push(price);
    priceTable.insertBefore(price, priceTable.firstChild);
};

const changeQuestionText = () => {
    let question;
    try {
        question = dataJSON.questions[currentQ]["question"];
    } catch {
        question = `Vyhrál jsi ${currentPrice}`;
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
    currentButtons = await dataJSON.questions[currentQ]["answers"].sort((a, b) => 0.5 - Math.random());
    await currentButtons.forEach((text, index) =>
        createButton(text, index)
    );
};

const createButton = (answerText, index) => {
    let button = document.createElement("button");

    button.dataset.id = index;
    button.onclick = checkAnswer;
    button.innerText = answerText;

    button.classList.add("button", "is-fullwidth", "is-large", "my-3",ansButtonColor);

    buttonsBlock.appendChild(button);
    answerButtons.push(button);
};

const checkAnswer = () => {
    if (hasAnswered) return;
    hasAnswered = true;

    let button = event.target;
    button.classList.remove(ansButtonColor);
    if (
        button.innerHTML == dataJSON.questions[currentQ].correctAns
    ) {
        button.classList.add("is-success");
        
        prices[currentQ].classList.add("highlight-price", "is-1");
        prices[currentQ].classList.remove("has-text-light", "is-3");

        currentPrice = prices[currentQ].innerHTML;

        if (currentQ != 0) {
            prices[currentQ - 1].classList.remove("highlight-price", "is-2")
            prices[currentQ - 1].classList.add("is-3")
        }

    } else {
        button.classList.add("is-danger");
        questionText.innerText = "Prohral jsi looool";
        return;
    }

    setTimeout(() => {
        HandleNextQuestion();
        currentQ++;
    }, 1000);
};

window.onload = async () => {
    dataJSON = await readFile();
    generatePriceTable();
    HandleNextQuestion();
    console.log(dataJSON)
};
