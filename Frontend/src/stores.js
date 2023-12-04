import { writable } from 'svelte/store';

export const globalState = writable({
    uploadedData: null,
    graph: null,
  });

