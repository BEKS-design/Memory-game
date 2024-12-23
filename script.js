document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById('startBtn');
    const gameBoard = document.getElementById('gameBoard');
    const message = document.getElementById('message');
    const timerDisplay = document.getElementById('timer');
    const easyBtn = document.getElementById('easyBtn');
    const mediumBtn = document.getElementById('mediumBtn');
    const hardBtn = document.getElementById('hardBtn');
    const difficultyDiv = document.getElementById('difficulty');  // Добавляем доступ к контейнеру с уровнями

    let cards = [];
    let flippedCards = [];
    let matchedCards = [];
    let cardImages = [];
    let timer = 0;
    let interval;
    let gameStarted = false;

    // Уникальные изображения для карточек (формат PNG, путь к папке images)
    const imageFiles = [
        'img1.png', 'img2.png', 'img3.png', 
        'img4.png', 'img5.png', 'img6.png', 
        'img7.png', 'img8.png', 'img9.png'
    ];

    // Уровни сложности
    function setDifficulty(level) {
        if (level === 'easy') {
            cardImages = [imageFiles[0], imageFiles[1], imageFiles[0], imageFiles[1], imageFiles[2], imageFiles[2]]; // 6 карточек (3 пары)
            timer = 60; // 60 секунд на легком уровне
        } else if (level === 'medium') {
            cardImages = [imageFiles[0], imageFiles[1], imageFiles[2], imageFiles[3], imageFiles[0], imageFiles[1], imageFiles[2], imageFiles[3], imageFiles[4], imageFiles[5], imageFiles[4], imageFiles[5]]; // 12 карточек (6 пар)
            timer = 90; // 90 секунд на среднем уровне
        } else if (level === 'hard') {
            cardImages = [imageFiles[0], imageFiles[1], imageFiles[2], imageFiles[3], imageFiles[4], imageFiles[5], imageFiles[6], imageFiles[7], imageFiles[0], imageFiles[1], imageFiles[2], imageFiles[3], imageFiles[4], imageFiles[5], imageFiles[6], imageFiles[7], imageFiles[8], imageFiles[8]]; // 18 карточек (9 пар)
            timer = 120; // 120 секунд на сложном уровне
        }
        if (gameStarted) {
            createBoard();  // Обновить доску
        }
        timerDisplay.textContent = `Time: ${timer}`;  // Обновляем отображение таймера
    }

    // Старт игры
    startButton.addEventListener('click', () => {
        if (!gameStarted) {
            gameStarted = true;
            matchedCards = [];
            flippedCards = [];
            message.textContent = '';
            message.classList.remove('lost');
            startButton.textContent = 'Restart Game';  // Изменяю текст кнопки на "Restart Game"
            difficultyDiv.style.display = 'none';  // Скрываюкнопки сложности
            clearInterval(interval);
            interval = setInterval(updateTimer, 1000); // Запускаю таймер
            createBoard();
        } else {
            // Перезапуск игры
            resetGame();
        }
    });

    // Сброс игры (для перезапуска)
    function resetGame() {
        gameStarted = false;
        clearInterval(interval);  // Останавливаю таймер
        timer = 0;
        timerDisplay.textContent = `Time: 0`;
        message.textContent = '';
        message.classList.remove('lost');
        
        // Очищаю игровое поле от карточек
        gameBoard.innerHTML = '';

        // Показываю кнопки выбора уровня сложности снова
        difficultyDiv.style.display = 'block';
        startButton.textContent = 'Start Game';  // Возвращаю текст на "Start Game"
    }

    // Создание доски
    function createBoard() {
        gameBoard.innerHTML = '';  // Очищаю поле перед добавлением новых карт
        cards = [];
        matchedCards = [];
        flippedCards = [];
        const shuffledCards = shuffleCards(cardImages);

        shuffledCards.forEach((value, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-index', index);
            card.dataset.value = value;
            card.addEventListener('click', flipCard);

            gameBoard.appendChild(card);
            cards.push(card);
        });
    }

    // Перемешивание карточек
    function shuffleCards(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // Переворачивание карточки
    function flipCard() {
        if (flippedCards.length === 2 || this.classList.contains('flipped') || matchedCards.includes(this)) return;

        this.classList.add('flipped');
        const img = document.createElement('img');
        img.src = this.dataset.value;  // Загружаю изображение
        this.appendChild(img);
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }

    // Проверка на совпадение
    function checkMatch() {
        if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
            matchedCards.push(flippedCards[0], flippedCards[1]);
            flippedCards.forEach(card => card.classList.add('matched'));
            flippedCards = [];
            if (matchedCards.length === cards.length) {
                clearInterval(interval);
                message.textContent = `You win! Time: ${timer} seconds`;
            }
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('flipped');
                    const img = card.querySelector('img');
                    if (img) img.remove();  // Убираю изображение
                });
                flippedCards = [];
            }, 1000);
        }
    }

    // Таймер (убывающий)
    function updateTimer() {
        timer--;
        timerDisplay.textContent = `Time: ${timer}`;
        if (timer <= 0) {
            clearInterval(interval);
            message.textContent = 'Time is up! You lost!';
            message.classList.add('lost');
        }
    }

    // Установка уровня сложности при выборе кнопки
    easyBtn.addEventListener('click', () => setDifficulty('easy'));
    mediumBtn.addEventListener('click', () => setDifficulty('medium'));
    hardBtn.addEventListener('click', () => setDifficulty('hard'));
});
