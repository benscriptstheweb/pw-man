import { writable } from 'svelte/store';
import { getShifts } from '../controllers/publishers';

let shiftsData = await getShifts();

export const shifts = writable(shiftsData);
