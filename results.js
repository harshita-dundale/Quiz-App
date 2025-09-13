// Results Page JavaScript
class QuizResults {
    constructor() {
        this.score = 0;
        this.totalQuestions = 0;
        this.percentage = 0;
        this.userAnswers = [];
        this.questions = [];
        
        this.initializeElements();
        this.loadResults();
        this.bindEvents();
    }

    initializeElements() {
        this.elements = {
            scorePercentage: document.getElementById('score-percentage'),
            correctAnswers: document.getElementById('correct-answers'),
            totalQuestions: document.getElementById('total-questions'),
            accuracy: document.getElementById('accuracy'),
            performanceTitle: document.getElementById('performance-title'),
            performanceText: document.getElementById('performance-text'),
            answersReview: document.getElementById('answers-review'),
            restartBtn: document.getElementById('restart-btn'),
            homeBtn: document.getElementById('home-btn'),
            scoreCircle: document.querySelector('.score-circle')
        };
    }

    bindEvents() {
        this.elements.restartBtn.addEventListener('click', () => this.restartQuiz());
        this.elements.homeBtn.addEventListener('click', () => this.goHome());
    }

    loadResults() {
        // Get data from localStorage
        this.score = parseInt(localStorage.getItem('quizScore')) || 0;
        this.totalQuestions = parseInt(localStorage.getItem('totalQuestions')) || 0;
        this.percentage = parseInt(localStorage.getItem('percentage')) || 0;
        
        try {
            this.userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || [];
            this.questions = JSON.parse(localStorage.getItem('questions')) || [];
        } catch (error) {
            console.error('Error parsing stored data:', error);
            this.userAnswers = [];
            this.questions = [];
        }

        this.displayResults();
        this.displayAnswerReview();
        this.animateScoreCircle();
    }

    displayResults() {
        // Update score display
        this.elements.scorePercentage.textContent = this.percentage;
        this.elements.correctAnswers.textContent = this.score;
        this.elements.totalQuestions.textContent = this.totalQuestions;
        this.elements.accuracy.textContent = `${this.percentage}%`;

        // Update performance message
        const { title, message } = this.getPerformanceMessage();
        this.elements.performanceTitle.textContent = title;
        this.elements.performanceText.textContent = message;
    }

    getPerformanceMessage() {
        if (this.percentage >= 90) {
            return {
                title: "🏆 Outstanding!",
                message: "Excellent work! You've mastered this topic with flying colors. Your dedication to learning shows!"
            };
        } else if (this.percentage >= 80) {
            return {
                title: "🌟 Great Job!",
                message: "Well done! You have a solid understanding of the material. Keep up the excellent work!"
            };
        } else if (this.percentage >= 70) {
            return {
                title: "👍 Good Work!",
                message: "Nice effort! You're on the right track. A little more practice and you'll be perfect!"
            };
        } else if (this.percentage >= 60) {
            return {
                title: "📚 Keep Learning!",
                message: "You're making progress! Review the topics you missed and try again. Every attempt makes you better!"
            };
        } else {
            return {
                title: "💪 Don't Give Up!",
                message: "Learning is a journey! Take some time to review the material and come back stronger. You've got this!"
            };
        }
    }

    displayAnswerReview() {
        if (this.questions.length === 0 || this.userAnswers.length === 0) {
            this.elements.answersReview.innerHTML = '<p>No answer data available for review.</p>';
            return;
        }

        const reviewHTML = this.questions.map((question, index) => {
            const userAnswer = this.userAnswers[index];
            const correctAnswer = question.Correct;
            const isCorrect = userAnswer === correctAnswer;
            
            const userAnswerText = userAnswer ? this.getAnswerText(question, userAnswer) : 'No answer selected';
            const correctAnswerText = this.getAnswerText(question, correctAnswer);

            return `
                <div class="answer-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="question-title">
                        Question ${index + 1}: ${question.question}
                    </div>
                    <div class="answer-details">
                        <div class="user-answer">
                            <span class="answer-label">Your Answer:</span>
                            <span class="answer-value">${userAnswerText}</span>
                            <span class="status-icon">${isCorrect ? '✅' : '❌'}</span>
                        </div>
                        ${!isCorrect ? `
                            <div class="correct-answer">
                                <span class="answer-label">Correct Answer:</span>
                                <span class="answer-value">${correctAnswerText}</span>
                                <span class="status-icon">✅</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        this.elements.answersReview.innerHTML = reviewHTML;
    }

    getAnswerText(question, optionKey) {
        const optionMap = {
            'opt1': question.op1,
            'opt2': question.op2,
            'opt3': question.op3,
            'opt4': question.op4
        };
        return optionMap[optionKey] || 'Unknown option';
    }

    animateScoreCircle() {
        // Animate the score circle
        const circle = this.elements.scoreCircle;
        const percentage = this.percentage;
        const degrees = (percentage / 100) * 360;
        
        // Set CSS custom property for the conic gradient
        circle.style.setProperty('--percentage', `${degrees}deg`);
        
        // Animate the percentage counter
        this.animateCounter(this.elements.scorePercentage, 0, percentage, 1500);
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (end - start) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    restartQuiz() {
        // Clear stored data
        localStorage.removeItem('quizScore');
        localStorage.removeItem('totalQuestions');
        localStorage.removeItem('percentage');
        localStorage.removeItem('userAnswers');
        localStorage.removeItem('questions');
        
        // Redirect to quiz
        window.location.href = 'QuizApp.html';
    }

    goHome() {
        // Redirect to main quiz page
        window.location.href = 'QuizApp.html';
    }
}

// Initialize results when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizResults();
});