import { getPublishers } from '../controllers/publishers';
import { writable } from 'svelte/store';

const publisherData = await getPublishers();
export const publishers = writable(publisherData);

export let adminStatus = writable(false);
export let loading = writable(true);
export let userIsSignedIn = writable(false);
export let isRegistered = writable(false);
