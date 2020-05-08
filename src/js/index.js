import  cards  from './cards';
import Element from './element'


//abstract
let wins =0, loses =0;
let selectedCard;
let state = false;

//init header
const hamburger = document.querySelector('.hamburger_menu');
const toggle = document.querySelector('.play_toggle');
const toggleText = toggle.querySelector('.play_toggle--text')

hamburger.addEventListener('click',(event)=> {
    hamburger.classList.toggle('hamburger_menu-active');
    nav.classList.toggle('navigation-active');
    event.stopPropagation();
    nav.addEventListener('transitionend', () => {
        if (nav.classList.contains('navigation-active')){
            document.addEventListener('click', hideNav);
        }
    })
});

toggle.addEventListener("click",()=> {
    toggle.classList.toggle('play_toggle-active');
    nav.classList.toggle('navigation-colored');
    cardsContainer.classList.toggle('cards_container-colored');
    startButton.classList.toggle('start_button-hidden_by_toggle');
    if (toggle.classList.contains('play_toggle-active')){
        toggleText.innerHTML = 'Play';
        state= !state;
        cardsContainer.removeEventListener('click', cardListenerTrain);
    }
    else {
        toggleText.innerHTML = 'Train';
        state = !state;
        cardsContainer.addEventListener('click', cardListenerTrain);
        cardsContainer.removeEventListener('click', cardListenerPlay);
    }
})

//init navigation
const nav = document.querySelector('.navigation');
const navList=nav.children[0];

cards[0].forEach((el) => {
    let a= new Element('li', 'beforeend', navList).innerHTML = el;
});

navList.addEventListener('click', (event)=> {
    if (event.target != navList) {
        if (event.target == statLink) {
            statisticsPage.classList.remove('statistics_page-inactive');
            cardsContainer.classList.add('cards_container-inactive');
            startButton.classList.add('start_button-hidden_by_stat');
        }
        else {
            statisticsPage.classList.add('statistics_page-inactive');
            cardsContainer.classList.remove('cards_container-inactive');
            startButton.classList.remove('start_button-hidden_by_stat');
            updateCards(event.target.innerHTML);
        }
    }
})
const statLink = new Element('li', 'beforeend', navList);
statLink.innerText = 'Statistics';
//init main
const starsContainer =new Element('div', 'afterend',nav,'stars_container');
const star = document.createElement('div');
star.classList.add('star');


const cardsContainer = new Element('div', 'afterend', starsContainer, 'cards_container');

const startButton =new Element ('button','afterend', cardsContainer,'start_button', 'start_button-hidden_by_toggle', 'start_button-hidden_by_section'); document.createElement('button');
new Element('div', 'beforeend',startButton,'start_button--text').innerHTML = 'Start game';
new Element('div', 'beforeend',startButton,'start_button--image');
const errorAudio = new Element('audio', 'beforeend',startButton);
errorAudio.setAttribute('src', 'assets/audio/error.mp3');
const correctAudio = new Element('audio', 'beforeend',startButton);
correctAudio.setAttribute('src', 'assets/audio/correct.mp3')

// init modal Window
const modal = new Element('div', 'afterend',startButton, 'modal', 'modal-hidden');
const modalText = new Element('div', 'beforeend',modal, 'modal--text');
const modalImage = new Element('div', 'beforeend',modal, 'modal--image');
const modalAudioWin = new Element('audio', 'beforeend',modal);
modalAudioWin.setAttribute('src', 'assets/audio/success.mp3')
const modalAudioLoose = new Element('audio', 'beforeend',modal);
modalAudioLoose.setAttribute('src', 'assets/audio/failure.mp3')

/// listener for navigation open state

const hideNav = function(e) {
    if (e.target!== nav && e.target!== navList){
        hamburger.classList.toggle('hamburger_menu-active');
        nav.classList.toggle('navigation-active');
        document.removeEventListener('click',hideNav);
    }
}

// listener for main page

const sectionListener = (event) => {
    if (event.target != cardsContainer) {
        let target = event.target;
        while(!target.classList.contains('card')){
            target = target.parentNode;
        }
        updateCards(target.querySelector('.card--title').innerHTML);

    }
}

/// create cards

(function (cards) {
    cards[0].forEach((el, index)=> {
        const card = new Element ('div','beforeend', cardsContainer,'card');
        const front =new Element ('div','beforeend', card,'card--face');
        const image = new Element ('div','beforeend', front,'card--image')
        image.style.backgroundImage=`url(assets/${cards[index+1][Math.round(Math.random()*(cards[index+1].length-1))].image})`;
        const back = front.cloneNode(true);
        back.classList.add('card--face-back');
        card.insertAdjacentElement('beforeend', back);
        const body =new Element ('div','beforeend', front,'card--body');
        new Element ('div','beforeend', body,'card--title').innerHTML=el;
        new Element ('div','beforeend', body,'card--reverse', 'cars--reverse-hidden');
        const bodyBack = body.cloneNode(false);
        back.insertAdjacentElement('beforeend', bodyBack);
        new Element ('div','beforeend', bodyBack,'card--translation');
        new Element ('audio','beforeend', card,'card--audio');
    })
    cardsContainer.addEventListener('click', sectionListener);
}(cards));

/// listener for train mode
const cardListenerTrain = (event) => {
    if (event.target!= cardsContainer) {
        let target = event.target;
        while(!target.classList.contains('card')){
            target = target.parentNode;
        }
        if (event.target.classList.contains('card--reverse')){
            target.classList.add('card-reverse');
            target.addEventListener('mouseleave', mouseLeaveListener);
            updateStat(navList.querySelector('.selected_item').innerText, target.querySelector('.card--title').innerText, 'trainClick');

        }
        else {
            target.querySelector('.card--audio').play();
            updateStat(navList.querySelector('.selected_item').innerText, target.querySelector('.card--title').innerText, 'trainPlay');
        }
    }

}

/// listener to flip card back
const mouseLeaveListener = (event) => {
    event.target.classList.remove('card-reverse');
    event.target.removeEventListener('mouseleave', mouseLeaveListener);
}

/// redraw cards

const updateCards = (section) => {
    let index;
    if (section === 'Main Page') {
        index = 0;
    }
    else {
        index = cards[0].indexOf(section)+1;
    }
    Array.from(navList.children).forEach(el => el.classList.remove('selected_item'));
    navList.children[index].classList.add('selected_item');

    if (cardsContainer.children.length>cards[index].length){
        Array.from(cardsContainer.children).filter((el, ind)=>ind>=cards[index].length).forEach((el)=> {
            cardsContainer.removeChild(el);
        });
    }
    else {
        if (cardsContainer.children.length<cards[index].length){
            for (let i=0;i<=cards[index].length-cardsContainer.children.length;i++){
                cardsContainer.insertAdjacentElement('beforeend', cardsContainer.children[0].cloneNode(true));
            }
        }
    }
    if (index==0){
        cardsContainer.classList.remove('cards_container-active');
        Array.from(cardsContainer.children).forEach((el, ind)=> {
            el.querySelector('.card--image').style.backgroundImage=`url(assets/${cards[ind+1][Math.round(Math.random()*(cards[ind+1].length-1))].image})`;
            el.querySelector('.card--title').innerHTML = cards[index][ind];
        });
        cardsContainer.removeEventListener('click', cardListenerTrain);
        cardsContainer.addEventListener('click', sectionListener);
        startButton.classList.add('start_button-hidden_by_section');
    }
    else {
        cardsContainer.removeEventListener('click', sectionListener);
        cardsContainer.classList.add('cards_container-active');
        Array.from(cardsContainer.children).forEach((el, ind)=> {
            Array.from(el.querySelectorAll('.card--image')).forEach(el=>el.style.backgroundImage = `url(assets/${cards[index][ind].image}`);
            el.querySelector('.card--title').innerHTML = cards[index][ind].word;
            el.querySelector('.card--translation').innerHTML = cards[index][ind].translation;
            el.querySelector('.card--audio').setAttribute('src', `assets/${cards[index][ind].audioSrc}`);
        });
        if (!state){
            cardsContainer.addEventListener('click', cardListenerTrain);
        }
        startButton.classList.remove('start_button-hidden_by_section');
    }
}

/// listener for button start
const startButtonListener = () => {
    startButton.classList.add('start_button-active');
    startButton.removeEventListener('click', startButtonListener);
    cardsContainer.addEventListener('click', cardListenerPlay);
    startButton.addEventListener('click', repeatButtonListener);
    selectCard();
}

startButton.addEventListener('click', startButtonListener);

/// select random card during play mode

const selectCard = () => {
    const arr = Array.from(cardsContainer.children).filter(el=> !el.classList.contains('card-inactive'));
    let number;
    if (arr.length>1) {
        number = Math.round(Math.random()*(arr.length-1));
    }
    else {
        number = 0;
    }
    selectedCard = arr[number];
    selectedCard.querySelector('.card--audio').play();
}

/// listener for button repeat

const repeatButtonListener = () => {
    selectedCard.querySelector('.card--audio').play();
}

/// listener for play mode
const cardListenerPlay = (event) => {
    if (event.target.classList.contains('card--image')) {
        const card = event.target.parentNode.parentNode;
        if (!card.classList.contains('card-inactive')){
            if (card === selectedCard) {
                selectedCard.classList.add('card-inactive');
                correctAudio.play();
                updateStat(navList.querySelector('.selected_item').innerText, card.querySelector('.card--title').innerText, 'correct');
                setTimeout(()=> {countResult(true)}, 800);
            }
            else {
                errorAudio.play();
                updateStat(navList.querySelector('.selected_item').innerText, selectedCard.querySelector('.card--title').innerText, 'incorrect');
                countResult(false);
            }
        }
    }
}

/// count result and insert stars
const countResult = (res) => {
    starsContainer.insertAdjacentElement('beforeend', star.cloneNode());
    if (res) {
        wins++;
        starsContainer.lastElementChild.classList.add('star-win');
        if (wins == cardsContainer.children.length) {
            displayResult();
        }
        else {
            selectCard();
        }
    }
    else {
        loses++;
    }
}

/// display modal Window with results
const displayResult = () => {
    modal.classList.remove('modal-hidden');
    if (loses == 0) {
        modalText.innerText = 'Win';
        modalImage.classList.add('modal--image-win');
        modalAudioWin.play();
    }
    else {
        modalText.innerText = `${loses} errors`;
        modalImage.classList.remove('modal--image-win');
        modalAudioLoose.play();
    }
    cardsContainer.removeEventListener('click', cardListenerPlay);
    Array.from(cardsContainer.children).forEach(el=>el.classList.remove('card-inactive'));
    loses = wins = 0;
    setTimeout(()=> {
        modal.classList.add('modal-hidden');
        starsContainer.innerHTML = '';
    }, 3000);
    updateCards('Main Page');
    startButton.classList.remove('start_button-active');
    startButton.addEventListener('click', startButtonListener);
    startButton.removeEventListener('click', repeatButtonListener);
}




//init statistics page

const statisticsPage = new Element('div', 'afterend', nav, 'statistics_page','statistics_page-inactive');
const statisticsTable = new Element ('table', 'afterbegin', new Element('div', 'afterbegin', statisticsPage, 'statistics_table_container'), 'statistics_table');
let stat = JSON.parse(localStorage.getItem('stat'))||{};
import quicksort from './quicksort'

/// try to get value from db(if available)

const getValue = (section, word, value)=> {
    let statSection = stat[section]||{};
    let statWord = statSection[word]||{};
    return statWord[value]||`0`;
}


///create table
(function() {
    const head = new Element('tr', 'beforeend', statisticsTable, 'row','row-head');
    new Element ('th', 'beforeend', head, 'cell','cell-head').innerHTML = 'section';
    new Element ('th', 'beforeend', head, 'cell','cell-head').innerHTML = 'word';
    new Element ('th', 'beforeend', head, 'cell','cell-head').innerHTML = 'translation';
    new Element ('th', 'beforeend', head, 'cell','cell-head').innerHTML = 'reverses';
    new Element ('th', 'beforeend', head, 'cell','cell-head').innerHTML = 'sounds';
    new Element ('th', 'beforeend', head, 'cell','cell-head').innerHTML = 'correct selections';
    new Element ('th', 'beforeend', head, 'cell','cell-head').innerHTML = 'incorrect selections';
    new Element ('th', 'beforeend', head, 'cell','cell-head').innerHTML = 'correct selections percentage';
    head.addEventListener('click', (event)=> {
        if (event.target.classList.contains('cell')){
            if (!event.target.classList.contains('col-desc')){
            const col = Array.from(head.children).findIndex(el=> el ==event.target);
                if (col >2){
                    quicksort(Array.from(statisticsTable.children).slice(1),(el)=>parseFloat(el.children[col].innerText), (arr, i, j)=> {
                        const temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                        statisticsTable.children[i+1].after(statisticsTable.children[j+1]);
                        statisticsTable.children[j+1].after(statisticsTable.children[i+1]);
                    }, true);
                }
                else {
                    quicksort(Array.from(statisticsTable.children).slice(1),(el)=>el.children[col].innerText.charCodeAt(0), (arr, i, j)=> {
                        const temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                        statisticsTable.children[i+1].after(statisticsTable.children[j+1]);
                        statisticsTable.children[j+1].after(statisticsTable.children[i+1]);
                    }, false);
                }
                Array.from(head.children).forEach(el=>el.classList.remove('col-asc', 'col-desc'));
                event.target.classList.add('col-desc');
            }
            else {
                reverseTable(statisticsTable);
                Array.from(head.children).forEach(el=>el.classList.remove('col-desc', 'col-asc'));
                event.target.classList.add('col-asc');
            }
        }
    })
    cards.slice(1).forEach((el,index)=> {
        el.forEach((element)=> {
            const row = new Element('tr', 'beforeend', statisticsTable, 'row');
            new Element ('td', 'beforeend', row, 'cell', 'cell-section').innerHTML = cards[0][index];
            new Element ('td', 'beforeend', row, 'cell', 'cell-section').innerHTML = element.word;
            new Element ('td', 'beforeend', row, 'cell', 'cell-section').innerHTML = element.translation;
            ///train
            new Element ('td', 'beforeend', row, 'cell', 'cell-section').innerHTML = getValue(cards[0][index], element.word, 'trainClick');
            new Element ('td', 'beforeend', row, 'cell', 'cell-section').innerHTML = getValue(cards[0][index], element.word, 'trainPlay');
            ///correct selections
            new Element ('td', 'beforeend', row, 'cell', 'cell-section').innerHTML = getValue(cards[0][index], element.word, 'correct');
            ///incorrect
            new Element ('td', 'beforeend', row, 'cell', 'cell-section').innerHTML = getValue(cards[0][index], element.word, 'incorrect');
            ///percentage
            new Element ('td', 'beforeend', row, 'cell', 'cell-section').innerHTML = `${getValue(cards[0][index], element.word, 'percentage')}%`;
        })
    })
}())

/// update stat db

const updateStat = (section, word, value) => {
    if (section == 'Difficult words'){
        section = stat[Array.from(stat).findIndex(el=> el[word]!==undefined)]
    }
    let statSection = stat[section]||{};
    let statWord = statSection[word]||{};
    let statValue = statWord[value]||0;
    statValue++;
    statWord[value] = statValue;
    const row = Array.from(statisticsTable.children).find((el)=>el.children[1].innerText==word);
    let col;
    switch(value) {
        case 'trainClick': {
            col = 3;
            break;
        }
        case 'trainPlay': {
            col = 4;
            break;
        }
        case 'correct': {
            col = 5;
            break;
        }
        case 'incorrect': {
            col = 6;
            break;
        }
    }
    row.children[col].innerText = statValue;
    if (value == 'correct' || value == 'incorrect') {
        const correct = statWord.correct||0;
        const incorrect = statWord.incorrect||0;
        if (statWord.correct !== undefined && statWord.incorrect !== undefined){
            statWord.percentage = (statWord.correct*100/(statWord.correct+statWord.incorrect)).toFixed(1);
            row.children[7].innerText = `${statWord.percentage}%`;
        }
    }
    statSection[word] = statWord;
    stat[section] = statSection;
}


/// init buttons for stat reset and repeat words
const buttonsContainer = new Element('div', 'beforeend', statisticsPage, 'buttons_container');

const resetButton = new Element('button', 'beforeend', buttonsContainer,'button',  'reset_button');
resetButton.innerText = 'Reset'
resetButton.addEventListener('click', ()=> {
    stat = {};
})

const repeatButton = new Element('button', 'beforeend', buttonsContainer, 'button', 'repeat_button');
repeatButton.innerText = 'Repeat dificalt words'
repeatButton.addEventListener('click', ()=> {
    statisticsPage.classList.add('statistics_page-inactive');
    cardsContainer.classList.remove('cards_container-inactive');
    startButton.classList.remove('start_button-hidden_by_stat');
    quicksort(Array.from(statisticsTable.children).slice(1),(el)=>parseFloat(el.children[7].innerText), (arr, i, j)=> {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        statisticsTable.children[i+1].after(statisticsTable.children[j+1]);
        statisticsTable.children[j+1].after(statisticsTable.children[i+1]);
    }, true);
    reverseTable(statisticsTable);
    if(navList.children[navList.children.length-2].innerText !== 'Difficult words'){
        new Element('li', 'beforebegin', navList.lastElementChild).innerText='Difficult words';
    }
    if (cards[0][cards[0].length-1]=== 'Difficult words') {
        cards.pop();
    }
    else {
        cards[0].push('Difficult words')
    }
    const newSection = [];
    Array.from(statisticsTable.children).filter(el=> parseFloat(el.children[7].innerText)>0|| parseFloat(el.children[6])>0).slice(0,8).forEach(el=> {
        const section = el.children[0].innerText;
        const ind1 = cards[0].indexOf(section)+1
        const ind2 = cards[ind1].findIndex(element=>element.word==el.children[1].innerText);
        const obj = cards[ind1][ind2];
        obj.section = section;
        newSection.push(obj);
    })
    cards.push(newSection);
    updateCards('Difficult words');
})

/// save stat to localstorage

window.addEventListener('beforeunload', ()=> {
    localStorage.setItem('stat', JSON.stringify(stat));
})

const reverseTable = (parent) => {
    const length = parent.children.length;
    for (let i =1; i< length/2; i++) {
        parent.children[i].after(parent.children[length-i]);
        parent.children[length-i].after(parent.children[i]);
    }
}



