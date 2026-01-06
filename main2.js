// HEAPSORT

// internal array in memory
const internalArray = document.getElementById("array");
const heap = document.getElementById("heap");
const tree = document.getElementById("tree"); // divs stored within are the nodes

const arrayValues = []; // holding the array elements
let enforcedSwap = false;
let currentIndex = 0; // begins at 0
let dragStartIndex; // will change
let stageTwo = false;
let sortedElem = 0; // how many elements are sorted
let swapParent; // indices of parent and child elements being swapped
let swapChild;

// array of random values
const randVals = [];
// create a random array of 6 integers
for (let i = 0; i < 7; i++) {
  randVals[i] = Math.floor(Math.random() * 60); // gives an integer from 0 - 19
}

createArray();

function createArray() {
  // add the list elements to the dom
  [...randVals].forEach((num, index) => {
    const arrayValue = document.createElement('li');

    arrayValue.setAttribute('data-index', index); // custom attribute
    arrayValue.setAttribute('data-inheap', "false");
    arrayValue.innerHTML = `
      <div class="draggable">
      <p class="value">${num}</p>
      </div>
      `;
    arrayValues.push(arrayValue);
    internalArray.appendChild(arrayValue);
  });

  addClickEventListenersArray(); // double click listener
}

// automatically mark the first item
markCurrent();

// 1) HEAPIFY

function heapify() {
  let parentIndex = 0; // initialize

  if (currentIndex == 0) {
    parentIndex = 0;
  } else {
    parentIndex = Math.floor((currentIndex - 1) / 2);
  }
  
  // if not already in the heap move the element over and remove double click listener
  if (arrayValues[currentIndex].getAttribute('data-inheap') ==='false') {
    arrayValues[currentIndex].dataset['inheap'] = 'true';

    arrayValues[currentIndex].remove(); // removes it from array ul
    heap.appendChild(arrayValues[currentIndex]); // adds it to heap ul
    // add to tree node div
    addToTree(currentIndex);
  }

  // if the last move was enforcing a swap, remove the drag event listeners
  if (enforcedSwap){
    removeEventListeners(swapParent, swapChild);
    removeHighlights(swapParent, swapChild);
    enforcedSwap = false;
  }

  let i = 0;

  while (i <= currentIndex) {
    let parentVal = parseInt(arrayValues[i].querySelector('.draggable').innerText.trim());
    let lChild = i*2 + 1;
    let rChild = i*2 + 2;
    let lCVal;
    let rCVal;

    if (lChild <= currentIndex) {
      lCVal = parseInt(arrayValues[lChild].querySelector('.draggable').innerText.trim());
    }
    if (rChild <= currentIndex) {
      rCVal = parseInt(arrayValues[rChild].querySelector('.draggable').innerText.trim());
    }
    if ((parentVal < lCVal) || (parentVal < rCVal)) {
      enforcedSwap = true;
      swapParent = i;
      if (parentVal < lCVal) {
        swapChild = lChild;
      }
      if (parentVal < rCVal) {
        swapChild = rChild;
      }

      addHighlights(swapParent, swapChild);
      addDragEventListeners(swapParent, swapChild);
      return;
    }
    i++;
  }
  // if none of the ordering is incorrect, remove current marking from old one
  arrayValues[currentIndex].querySelector('.draggable').classList.remove('current');
  arrayValues[currentIndex].classList.add('done');
  currentIndex = currentIndex + 1;
  markCurrent();

  if (currentIndex === arrayValues.length) {
    addClickEventListenersHeap();
    stageTwo = true;
  }
}

function markCurrent() {
  arrayValues.forEach(item => {
    if (parseInt(item.getAttribute("data-index")) === currentIndex) {
      item.classList.add('current');
    } else {
      item.classList.remove('current');
    }
  })
}

function removeHighlights(parentIndex, childIndex) {
  arrayValues[parentIndex].querySelector('.draggable').classList.remove('swap');
  arrayValues[childIndex].querySelector('.draggable').classList.remove('swap');
}

function addHighlights(parentIndex, childIndex) {
  arrayValues[parentIndex].querySelector('.draggable').classList.add('swap');
  arrayValues[childIndex].querySelector('.draggable').classList.add('swap');
}

// *** interaction functionality ***

function addClickEventListenersHeap() {
  const listItems = document.querySelectorAll('.heap li'); // grab all the internal array elements
    listItems.forEach(item => {
      item.addEventListener('dblclick', doubleClick);
    })
}

function addClickEventListenersArray() {
  const listItems = document.querySelectorAll('.internal-array li'); // grab all the internal array elements
  listItems.forEach(item => {
    item.addEventListener('dblclick', doubleClick);
  });
}

function addDragEventListeners(parentIndex, childIndex) {
  arrayValues[parentIndex].draggable = true;
  arrayValues[childIndex].draggable = true;
  arrayValues[parentIndex].addEventListener('dragstart', dragStart);
  arrayValues[parentIndex].addEventListener('dragover', dragOver);
  arrayValues[parentIndex].addEventListener('drop', dragDrop);
  arrayValues[parentIndex].addEventListener('dragenter', dragEnter);
  arrayValues[parentIndex].addEventListener('dragleave', dragLeave);

  arrayValues[childIndex].addEventListener('dragstart', dragStart);
  arrayValues[childIndex].addEventListener('dragover', dragOver);
  arrayValues[childIndex].addEventListener('drop', dragDrop);
  arrayValues[childIndex].addEventListener('dragenter', dragEnter);
  arrayValues[childIndex].addEventListener('dragleave', dragLeave);
}

function removeEventListeners(parentIndex, childIndex) {
  arrayValues[parentIndex].draggable = false;
  arrayValues[childIndex].draggable = false;
  arrayValues[parentIndex].removeEventListener('dragstart', dragStart);
  arrayValues[parentIndex].removeEventListener('dragover', dragOver);
  arrayValues[parentIndex].removeEventListener('drop', dragDrop);
  arrayValues[parentIndex].removeEventListener('dragenter', dragEnter);
  arrayValues[parentIndex].removeEventListener('dragleave', dragLeave);

  arrayValues[childIndex].removeEventListener('dragstart', dragStart);
  arrayValues[childIndex].removeEventListener('dragover', dragOver);
  arrayValues[childIndex].removeEventListener('drop', dragDrop);
  arrayValues[childIndex].removeEventListener('dragenter', dragEnter);
  arrayValues[childIndex].removeEventListener('dragleave', dragLeave);
}

function dragOver(e) {
  e.preventDefault(); // prevents accidental deposition
}

/**
 * get closest list element and access the index for dragStartIndex
 */
function dragStart() {
  // shift sorted elem
  dragStartIndex = +this.closest('li').getAttribute('data-index');
}

function dragDrop() {
  this.classList.remove('over');
  const dragEndIndex = +this.getAttribute('data-index') ;
  swapItems(dragStartIndex, dragEndIndex);
}

function dragEnter() {
  this.classList.add('over');
}

function dragLeave() {
  this.classList.remove('over');
}

function doubleClick() {
  const index = +this.getAttribute('data-index');
  if (index === currentIndex) {
    arrayValues[index].removeEventListener('dblclick', doubleClick);
    heapify();
  } 
  else if (this.getAttribute('data-inheap') ==='true' && stageTwo) {
    if (index === 0 && (enforcedSwap === false)) { // don't allow removal if enforced swap is still turned on
      sortedElem = sortedElem + 1;
      arrayValues[index].removeEventListener('dblclick', doubleClick);
      addToArray();
      reHeapify();
    }
  }
}

function swapItems(startIndex, endIndex) {
  // access the movable parts of the indices being swapped
  const itemOne = arrayValues[startIndex].querySelector('.draggable');
  const itemTwo = arrayValues[endIndex].querySelector('.draggable');
  
  // update indices in dom
  arrayValues[endIndex].appendChild(itemOne);
  arrayValues[startIndex].appendChild(itemTwo);

  arrayValues[startIndex].setAttribute('data-index', startIndex);
  arrayValues[endIndex].setAttribute('data-index', endIndex); // update indexing

  if (stageTwo) {
    addToTree(startIndex);
    addToTree(endIndex);
    reHeapify();
  } else {
    addToTree(startIndex);
    addToTree(endIndex);
    heapify();
  }
}

function addToArray() {
  const temp = arrayValues[arrayValues.length-1]; // rightmost child
  arrayValues[0].remove(); // remove from heap dom

  internalArray.prepend(arrayValues[0]); // add to top of ul 

  if (arrayValues.length > 1) {
    heap.prepend(temp); // first elem in dom if the heap still has elements
  }
  
  arrayValues[0] = temp; // rightmost child becomes new root
  arrayValues[0].setAttribute('data-index', 0); // update
  arrayValues.splice(arrayValues.length-1, 1); // destructive removal of rightmost child

  removeFromTree(0);
  if (arrayValues.length > 0) {addToTree(0)};
  removeFromTree(arrayValues.length);
}

function reHeapify() {
  let i = 0;
  
  // compare parents with children, go down the length of the array
  // if parent is smaller than children, choose the largest child and force the swap
  // then compare 
  // go down the length of the heap, 
  // while the right child is still smaller than the length of the heap
  while (i < arrayValues.length) {
    let parentVal = parseInt(arrayValues[i].querySelector('.draggable').innerText.trim());
    let lChild = (2*i) + 1;
    let rChild = (2*i) + 2;
    let bigLeft = false;
    let bigRight = false;
    let lCVal, rCVal; // initialize

    if (enforcedSwap) {
      removeHighlights(swapParent, swapChild);
      removeEventListeners(swapParent, swapChild);
      enforcedSwap = false;
    }
    if (lChild < arrayValues.length){
      lCVal = parseInt(arrayValues[lChild].querySelector('.draggable').innerText.trim());
      if (lCVal > parentVal) {
        bigLeft = true;
      }
      // console.log(`left child: ${lCVal} at index ${lChild}`);
    }
    if (rChild < arrayValues.length) {
      rCVal = parseInt(arrayValues[rChild].querySelector('.draggable').innerText.trim());
      if (rCVal > parentVal) {
        bigRight = true;
      }
      // console.log(`right child: ${rCVal} at index ${rChild}`);
    }
    
    // find out which child is larger and default to that 
    if (bigLeft && bigRight) {
      if (lCVal > rCVal) {
        bigRight = false; 
      }
      else {
        bigLeft = false;
      }
    }
    // if either child is larger, enforce swap
    if (bigLeft) {
      enforcedSwap = true;
      swapParent = i;
      swapChild = lChild;
      addHighlights(swapParent, swapChild);
      addDragEventListeners(swapParent, swapChild);
      break;
    }
    if (bigRight) {
      enforcedSwap = true;
      swapParent = i;
      swapChild = rChild;
      addHighlights(swapParent, swapChild);
      addDragEventListeners(swapParent, swapChild);
      break;
    }
    i++;
  }
}

function addToTree(index) {
  const node = tree.querySelector(`.index${index}`).querySelector('.node');

  node.textContent = arrayValues[index].querySelector('.draggable').innerText.trim(); 
}

function removeFromTree(index) {
  const node = tree.querySelector(`.index${index}`).querySelector('.node');
  node.textContent = "";
}

