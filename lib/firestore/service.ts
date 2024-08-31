import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { FirebaseError } from '@firebase/util';

import { type UserData, userDataSchema } from './schema';

const firebaseConfig = {
  apiKey: 'AIzaSyA9XHo2o-dBSGPmVQAGnsNPx67NLFSLuB4',
  authDomain: 'rs-react-2024q3-graphiql-app.firebaseapp.com',
  projectId: 'rs-react-2024q3-graphiql-app',
  storageBucket: 'rs-react-2024q3-graphiql-app.appspot.com',
  messagingSenderId: '859975649493',
  appId: '1:859975649493:web:abd7c3c75a1a40181c3a5c',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function isFirebaseError(error: unknown): error is FirebaseError {
  return Object.prototype.hasOwnProperty.call(error, 'code');
}

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const userData: UserData = {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    };

    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, userData, { merge: true });

    return user;
  } catch (error) {
    if (isFirebaseError(error)) {
      const { code, message, customData } = error;

      throw new FirebaseError(code, message, customData);
    } else {
      throw error;
    }
  }
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    let username = 'No name';

    if (userDocSnapshot.exists()) {
      try {
        const { name } = await userDataSchema.parseAsync(
          userDocSnapshot.data()
        );
        username = name;
      } catch (err) {
        console.error('User data document is incorrect');
      }
    }

    return { ...user, name: username };
  } catch (error) {
    if (isFirebaseError(error)) {
      const { code, message, customData } = error;

      throw new FirebaseError(code, message, customData);
    } else {
      throw error;
    }
  }
};

export {
  app,
  auth,
  db,
  registerWithEmailAndPassword,
  logInWithEmailAndPassword,
};
