import { initializeApp } from 'firebase/app';
//your firebase private data
const firebaseConfig = {
  apiKey: "Your Private Data",
  authDomain: "Your Private Data",
  projectId: "Your Private Data",
  storageBucket: "Your Private Data",
  messagingSenderId: "Your Private Data",
  appId: "Your Private Data"
};
export const app = initializeApp(firebaseConfig);