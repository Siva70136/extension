import { getAuth } from "firebase/auth/web-extension";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.WXT_API_KEY,
  authDomain: import.meta.env.WXT_AUTH_DOMAIN,
  projectId: import.meta.env.WXT_PROJECT_ID,
  storageBucket: import.meta.env.WXT_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.WXT_MESSAGE_SENDER_ID,
  appId: import.meta.env.WXT_APP_ID,
  measurementId: import.meta.env.WXT_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
