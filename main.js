// https://www.youtube.com/watch?v=jfYWwQrtzzY
// https://www.youtube.com/watch?v=EFJg4nUg9sM chess example
// https://www.youtube.com/watch?v=wv7pvH1O5Ho sortable list example

const draggableList = document.getElementById('array');
const indexList = document.getElementById('indexArray');
const button = document.getElementById('testbutton');
let lastSwap = [];
let steps = 0;

const randomValues = [];

// create a random array of 6 integers
for (let i = 0; i < 6; i++) {
  randomValues[i] = Math.floor(Math.random() * 20); // gives an integer from 0 - 19
}
randomValues.sort((a, b) => a - b);

const listVals = [];
const indexVals = [];
let dragStartIndex; // changes later on

createList();
createIndexList();

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
            <i class="fas fa-grip-lines"></i>
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
  // plus makes it a number
  const dragEndIndex = +this.getAttribute('data-index');
  swapItems(dragStartIndex, dragEndIndex);

  this.classList.remove('over');
  steps++;
  grade(); // call to grade function each time an object is dropped
}

// swap list items that are drag and drop
function swapItems(fromIndex, toIndex) {
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
}

function dragEnter() {
  this.classList.add('over'); // darken color
}

function dragLeave() {
  this.classList.remove('over'); // remove darkened color
}

// check the order of elements in list
function grade() {
  for (let i = 0; i < steps; i++) {
    let listItem = listVals[i];
    const itemVal = listItem.querySelector('.draggable').innerText.trim();
    if(parseInt(itemVal) !== randomValues[i]) {
      listItem.classList.remove('right');
      listItem.classList.add('wrong');
    } else {
      listItem.classList.remove('wrong');
      listItem.classList.add('right');
    }

    let indexItem = indexVals[i];
    indexItem.classList.add('sorted');
    console.log(indexItem.classList);
  }
}

function addEventListeners() {
  const draggables = document.querySelectorAll('.draggable');
  const dragListItems = document.querySelectorAll('.internal-array li');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
  })

  dragListItems.forEach(item => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  })
}

button.addEventListener('click', undo);
