import { writable } from 'svelte/store';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';

export const isAuthenticated = writable();
export const isAdmin = writable(false);
export const user = writable({});

const firebaseAuth = getAuth(app);
export const auth = writable(firebaseAuth);
