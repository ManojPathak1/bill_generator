import firebase from 'firebase';

export const getFirestoreDB = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyBAsdsnyDzJDJzu0LN0XzFhqUNhfk_jCZs",
        authDomain: "electricity-bill-generator.firebaseapp.com",
        projectId: "electricity-bill-generator",
        storageBucket: "electricity-bill-generator.appspot.com",
        messagingSenderId: "771543422078",
        appId: "1:771543422078:web:7a5a286144d0322df8742f",
        measurementId: "G-JNVG453TMT",
    };
		if (firebase.apps.length === 0) {
			firebase.initializeApp(firebaseConfig);
		}
    const db = firebase.firestore();
    return db;
};
