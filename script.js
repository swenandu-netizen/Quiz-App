let currentQuestionIndex = 0;
let quizData = [];

// यह फंक्शन तब चलेगा जब यूज़र किसी टॉपिक के बटन पर क्लिक करेगा
function startQuiz(jsonUrl) {
    // 1. टॉपिक वाले बॉक्स को छिपा दें और क्विज़ वाले बॉक्स को दिखा दें
    document.getElementById('category-box').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    // 2. पुराने सवाल और इंडेक्स को रीसेट करें (ताकि क्विज़ शुरू से चले)
    currentQuestionIndex = 0;
    quizData = [];
    document.getElementById('options').innerHTML = '';
    document.getElementById('question').innerText = "सवाल लोड हो रहा है...";

    // 3. जो लिंक बटन से मिला है, वहाँ से डेटा Fetch करें
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            quizData = data[""] || data; // JSON फॉर्मेट के हिसाब से डेटा सेट करें
            loadQuestion(); 
        })
        .catch(error => {
            console.error('डेटा लोड करने में गलती हुई:', error);
            document.getElementById('question').innerText = "एरर: डेटा लोड नहीं हो सका!";
        });
}

// सवाल दिखाने का फंक्शन
function loadQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    
    optionsElement.innerHTML = ''; 

    let currentData = quizData[currentQuestionIndex];
    questionElement.innerText = currentData.q; 

    currentData.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.style.margin = '5px';
        button.style.padding = '10px';
        button.style.cursor = 'pointer';
        
        button.onclick = () => checkAnswer(option, currentData.answer, button);
        optionsElement.appendChild(button);
    });
}

// जवाब चेक करने का फंक्शन
function checkAnswer(selectedOption, correctAnswer, buttonElement) {
    if (selectedOption === correctAnswer) {
        buttonElement.style.backgroundColor = 'lightgreen';
        alert("बिल्कुल सही जवाब!");
    } else {
        buttonElement.style.backgroundColor = 'lightcoral';
        alert("गलत जवाब! सही जवाब है: " + correctAnswer);
    }
    
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        setTimeout(loadQuestion, 1000); 
    } else {
        // क्विज़ खत्म होने पर वापस टॉपिक चुनने का ऑप्शन दिखाएँ
        document.getElementById('quiz-container').innerHTML = `
            <h2>क्विज़ समाप्त!</h2>
            <button onclick="location.reload()" style="padding: 10px; margin-top: 20px;">दूसरा क्विज़ खेलें</button>
        `;
    }
}

