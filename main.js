// https://www.youtube.com/watch?v=jfYWwQrtzzY
// https://www.youtube.com/watch?v=EFJg4nUg9sM chess example
// https://www.youtube.com/watch?v=wv7pvH1O5Ho sortable list example

const draggableList = document.getElementById('array');
const indexList = document.getElementById('indexArray');
const button = document.getElementById('testbutton');
let lastSwap = [];
let steps = 0;
const numValues = 5;

const randomValues = [];

// create a random array of 6 integers
for (let i = 0; i < numValues; i++) {
  randomValues[i] = Math.floor(Math.random() * 60); // gives an integer from 0 - 19
}
randomValues.sort((a, b) => a - b);

const listVals = [];
const indexVals = [];
let dragStartIndex; // changes later on

createList();
createIndexList();
listVals[0].classList.add('current'); // automatically the 0 index is 'current'

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
  console.log(dragStartIndex);
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
    moveCurrSpot(steps);
  } else {
    // wrong needs to be first, otherwise not colored red
    listVals[steps].classList.remove('current');
    listVals[steps].classList.add('wrong');
    listVals[steps].classList.add('current'); 
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
  const oldVal = listVals[lastSwap[0]];
  const oldIdx = indexVals[lastSwap[0]];
  console.log(oldVal.classList);
  oldVal.classList.remove('right');
  oldVal.classList.remove('wrong');
  oldIdx.classList.remove('sorted');
  steps--;
  listVals[steps+1].classList.remove('current');
  listVals[steps].classList.add('current');
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
    listItem.classList.remove('right');
    listItem.classList.add('wrong');
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

function moveCurrSpot(currentIndex) {
  listVals[currentIndex-1].classList.remove('current');
  listVals[currentIndex].classList.add('current');
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
  for (let i = 0; i <= steps; i++){
    await delay(500);
    listVals[i].classList.remove('done');
    listVals[i].removeEventListener('dragstart', dragStart);
  }
}

button.addEventListener('click', undo);
