let currentQuestionIndex = 0;
let quizData = [];

// आपका लाइव GitHub Raw लिंक
const rawJSON_URL = "j.json"; 

// 1. GitHub से डेटा मंगाना
fetch(rawJSON_URL)
    .then(response => response.json())
    .then(data => {
        // डेटा को सेट करना (अगर डेटा {"": [...]} फॉर्मेट में है, या सीधे [...] फॉर्मेट में है)
        quizData = data[""] || data; 
        
        if(quizData && quizData.length > 0) {
            loadQuestion(); 
        } else {
            document.getElementById('question').innerText = "क्विज़ में कोई सवाल नहीं मिला!";
        }
    })
    .catch(error => {
        console.error('डेटा लोड करने में गलती हुई:', error);
        document.getElementById('question').innerText = "एरर: कृपया अपना इंटरनेट चेक करें या लिंक जांचें!";
    });

// 2. स्क्रीन पर सवाल और ऑप्शन्स दिखाना
function loadQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    
    // पुराना डेटा हटाएँ
    optionsElement.innerHTML = ''; 

    // नया सवाल सेट करें
    let currentData = quizData[currentQuestionIndex];
    questionElement.innerText = currentData.q; 

    // हर ऑप्शन के लिए बटन बनाएँ
    currentData.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('btn'); // HTML में जो डिज़ाइन बनाया है, उसे लगाएँ
        
        button.onclick = () => checkAnswer(option, currentData.answer, button);
        optionsElement.appendChild(button);
    });
}

// 3. जवाब चेक करना
function checkAnswer(selectedOption, correctAnswer, buttonElement) {
    // सबसे पहले सारे बटनों को लॉक (Disable) कर दें ताकि यूज़र दो बार क्लिक न कर सके
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(btn => btn.disabled = true);

    // अगर जवाब सही है
    if (selectedOption === correctAnswer) {
        buttonElement.style.backgroundColor = '#d4edda'; // हरा रंग
        buttonElement.style.borderColor = '#28a745';
        buttonElement.style.color = '#155724';
    } 
    // अगर जवाब गलत है
    else {
        buttonElement.style.backgroundColor = '#f8d7da'; // लाल रंग
        buttonElement.style.borderColor = '#dc3545';
        buttonElement.style.color = '#721c24';
        
        // यूज़र को सही जवाब दिखाने के लिए सही वाले बटन को हरा कर दें
        allButtons.forEach(btn => {
            if(btn.innerText === correctAnswer) {
                btn.style.backgroundColor = '#d4edda';
                btn.style.borderColor = '#28a745';
                btn.style.color = '#155724';
            }
        });
    }
    
    // 2 सेकंड रुकने के बाद अगले सवाल पर जाएँ
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        setTimeout(loadQuestion, 2000); // 2000 मिलीसेकंड = 2 सेकंड
    } else {
        // जब सारे सवाल खत्म हो जाएँ
        setTimeout(() => {
            document.getElementById('quiz-container').innerHTML = `
                <h2>क्विज़ समाप्त!</h2>
                <p>आपने बहुत अच्छा खेला।</p>
                <button class="btn" onclick="location.reload()" style="background-color: #007bff; color: white;">फिर से खेलें</button>
            `;
        }, 2000);
    }
}
