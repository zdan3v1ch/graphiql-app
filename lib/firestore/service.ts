import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { FirebaseError } from '@firebase/util';

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

    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });

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

    return res.user;
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
