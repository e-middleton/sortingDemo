// https://www.youtube.com/watch?v=jfYWwQrtzzY
// https://www.youtube.com/watch?v=EFJg4nUg9sM chess example
// https://www.youtube.com/watch?v=wv7pvH1O5Ho sortable list example
// https://www.youtube.com/watch?v=hBbrGFCszU4 dropdown menu example


/** Dropdown menu functionality */
const dropdown = document.querySelector('.dropdown');

/** get internal elements */
const select = dropdown.querySelector('.select');
const caret = dropdown.querySelector('.caret');
const menu = dropdown.querySelector('.menu');
const options = dropdown.querySelectorAll('.menu li');
const selected = dropdown.querySelector('.selected');

select.addEventListener('click', () => {
  // add styling to the selected element
  select.classList.toggle('select-clicked');
  // add rotate to caret
  caret.classList.toggle('caret-rotate');
  menu.classList.toggle('menu-open');
});

// add event listeners to all options
options.forEach(option => {
  // add click listener to each option
  option.addEventListener('click', () => {
    // make sure old results are cleared out
    reset();

    // create an array of the appropriate length
    createArray(parseInt(option.innerText));

    // change selected inner text to the clicked option
    selected.innerText = "Array Length: " + option.innerText;
    // add clicked style to selected object
    select.classList.remove('select-clicked');
    caret.classList.remove('caret-rotate');
    menu.classList.remove('menu-open');

    // remove active class
    options.forEach(option => {
      option.classList.remove('active');
    });
    // add active to the clicked object only
    option.classList.add('active');
  });
});


/** Sorting array functionality */
const draggableList = document.getElementById('array');
const indexList = document.getElementById('indexArray');
const button = document.getElementById('testbutton');
const randomValues = [];
const listVals = [];
const indexVals = [];

let dragStartIndex; // changes later on
let numValues;
let lastSwap = [];
let steps;

/**
 * clear out old arrays when new ones are requested
 */
function reset() {
  steps = 0;
  // clear out old arrays in place
  randomValues.length = 0;
  // clear out elements from DOM
  listVals.forEach(element => {
    element.remove();
  })
  indexVals.forEach(index => {
    index.remove();
  })

  listVals.length = 0;
  indexVals.length = 0;
}

/**
 * given a number of elements in the array
 * create a random array of numbers to sort
 */
function createArray(optionNumber) {
  numValues = optionNumber; // from dropdown menu

  // create a random array of 6 integers
  for (let i = 0; i < numValues; i++) {
    randomValues[i] = Math.floor(Math.random() * 60); // gives an integer from 0 - 19
  }
  randomValues.sort((a, b) => a - b);
  createList();
  createIndexList();
}

// insert list items into dom
// copy it
// make it into an object of value, sort
// shuffle it
// make it back into an array of strings
function createList() {
  // spread operator makes copy
  [...randomValues] 
    .map(a => ({ value: a, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort) // goes by randomized sorting val to scramble array
    .map(a => a.value)
    .forEach((num, index) => {
      const listVal = document.createElement('li'); // list item element

      listVal.setAttribute('data-index', index); // custom attribute is data-attribute
      listVal.innerHTML = `
          <div class="draggable" draggable="true">
            <p class="value">${num}</p>
          </div>
        `;
      listVals.push(listVal);
      draggableList.appendChild(listVal);
    });

    addEventListeners();
}

function createIndexList() {
  randomValues.forEach((value, index) => {
    const indexVal = document.createElement('li');
    indexVal.innerHTML = `
      <span class="number">${"index "+index}</span>
    `;
    indexList.appendChild(indexVal);
    indexVals.push(indexVal);
  })
}

function dragStart() {
  dragStartIndex = +this.closest('li').getAttribute('data-index'); // plus symbol makes it a number
}

// only reason to include this is to prevent default
function dragOver(e) {
  e.preventDefault();
}

function dragDrop() {
  if (dragStartIndex < steps) {
    this.classList.remove('over');
    return;
  }
  // plus makes it a number
  const dragEndIndex = +this.getAttribute('data-index');
  swapItems(dragStartIndex, dragEndIndex);
  this.classList.remove('over');

  grade(); // call to grade function each time an object is dropped
  if (listVals[steps].classList.contains('right')){
    steps++; // move forward
  } else {
    lockInteraction(); // locks interaction until fixed
    button.classList.add('locked');
  }
}

// swap list items that are drag and drop
function swapItems(fromIndex, toIndex) {
  // not allowed to try to swap to sorted array
  if (toIndex < steps) {
    return;
  }
  const itemOne = listVals[fromIndex].querySelector('.draggable');
  const itemTwo = listVals[toIndex].querySelector('.draggable');
  
  // updates in the dom
  listVals[fromIndex].appendChild(itemTwo);
  listVals[toIndex].appendChild(itemOne);

  // update last swap
  lastSwap[0] = fromIndex;
  lastSwap[1] = toIndex;
}

function undo() {
  swapItems(lastSwap[1], lastSwap[0]);
  const oldVal1 = listVals[lastSwap[0]];
  const oldVal2 = listVals[lastSwap[1]];
  oldVal1.classList.remove('wrong');
  oldVal2.classList.remove('wrong');
  unlockInteraction();
  button.classList.remove('locked');
}

function dragEnter() {
  this.classList.add('over'); // darken color
}

function dragLeave() {
  this.classList.remove('over'); // remove darkened color
}

// check the order of elements in list
function grade() {
  const listItem = listVals[steps];
  const itemVal = listItem.querySelector('.draggable').innerText.trim();
  if(parseInt(itemVal) !== randomValues[steps]) {
    listVals[lastSwap[0]].classList.add('wrong');
    listVals[lastSwap[1]].classList.add('wrong');
  } else {
    listItem.classList.remove('wrong');
    listItem.classList.add('right');
  }

  if (listVals[steps].classList.contains('right')){
    let indexItem = indexVals[steps];
    indexItem.classList.add('sorted');
    // remove interactivity for correctly sorted elements
    removeInteraction(listVals[steps]);
  }

  if (steps === listVals.length-1) {
    markFinished();
  }
}

function addEventListeners() {
  const dragListItems = document.querySelectorAll('.internal-array li');

  dragListItems.forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  })
}

function removeInteraction(item) {
  item.classList.add('done');
  item.removeEventListener('drop', dragDrop);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function markFinished() {
  for (let i = 0; i < listVals.length; i++){
    await delay(250);
    listVals[i].classList.remove('done');
    listVals[i].removeEventListener('dragstart', dragStart);
  }
}

// remove event listeners from indices step - endOfArr
function lockInteraction() {
  for (let i = steps; i < listVals.length; i++) {
    listVals[i].removeEventListener('dragstart', dragStart);
    listVals[i].removeEventListener('drop', dragDrop);
    listVals[i].removeEventListener('dragover', dragOver);
  }
}

function unlockInteraction() {
  for (let i = steps; i < listVals.length; i++) {
    listVals[i].addEventListener('dragstart', dragStart);
    listVals[i].addEventListener('drop', dragDrop);
    listVals[i].addEventListener('dragover', dragOver);
  }
}

button.addEventListener('click', undo);
