import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';

export const publisherCollection = collection(db, 'publishers');
const shiftsCollection = collection(db, 'shifts');

export const getPublishers = async () => {
  const publishersData = await getDocs(publisherCollection);

  let publishers = publishersData.docs.map((e) => {
    return {
      id: e.data().id,
      text: `${e.data().last_name}, ${e.data().first_name}`,
      role: e.data().role,
      email: e.data().email,
    };
  });

  publishers.sort((a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0));

  return publishers;
};

export const getLatestPublisherId = async () => {
  const q = query(publisherCollection, orderBy('id', 'desc'), limit(1));
  const publishers = await getDocs(q);
  return publishers.docs.map((e) => e.data())[0].id;
};

export const getSignedInUser = async (user) => {
  const publishers = await getPublishers();
  const signedInPublisher = publishers.filter((e) => e.email === user?.email)[0];
  return signedInPublisher;
};

export const createPublisher = async (publisherData) => {
  await addDoc(publisherCollection, publisherData);
};

export const addPublisherToShift = async (selectedPublisher, selectedDate, selectedLocation) => {
  let shift = {
    publisher: selectedPublisher.text,
    email: selectedPublisher.email,
    date: selectedDate,
    location: selectedLocation,
  };

  await addDoc(shiftsCollection, shift);
};

export const deleteShift = async (id) => {
  await deleteDoc(doc(db, 'shifts', id));
};

export const getShifts = async () => {
  const shiftData = await getDocs(shiftsCollection);

  let shifts = shiftData.docs.map((e) => {
    return {
      id: e.id,
      email: e.data().email,
      publisher: e.data().publisher,
      date: e.data().date.toDate(),
      location: e.data().location,
    };
  });

  sortShifts(shifts);

  return shifts;
};

export const sortShifts = (shifts) => {
  shifts.sort((a, b) => b.date - a.date);
};
