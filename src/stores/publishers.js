import { getPublishers } from '../controllers/publishers';
import { writable } from 'svelte/store';

const publisherData = await getPublishers();
export const publishers = writable(publisherData);
