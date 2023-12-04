import { writable } from 'svelte/store';

export const globalState = writable({
    uploadedData: null,
    graph: null,
    redrawStack: {}, // Create an empty stack to store the elements that need to be redrawn
    drawingWidth: 827,
    drawingHeight: 1169
  });

