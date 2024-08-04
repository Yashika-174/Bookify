import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FireBaseContext = createContext(null);

export function useFireBase() {
    return useContext(FireBaseContext);
}

const firebaseConfig = {
    apiKey: "AIzaSyCXE_wp-GoA5VtY8l08kLQfh4Ymg43vngg",
    authDomain: "bookify-599ef.firebaseapp.com",
    projectId: "bookify-599ef",
    storageBucket: "bookify-599ef.appspot.com",
    messagingSenderId: "798111665494",
    appId: "1:798111665494:web:ea6c5735ce62d48d205af7"
};

const fireBaseApp = initializeApp(firebaseConfig);
const fireBaseAuth = getAuth(fireBaseApp);
const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(fireBaseApp);
const storage = getStorage(fireBaseApp);

export function FireBaseProvider({ children }) {

    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(fireBaseAuth, (user) => {
            if (user) {
                console.log("You are Logged In!", user);
                setUser(user);
            } else {
                console.log("You are Logged Out!");
                setUser(null);
            }
        });
    }, []);

    function signUpUserWithEmailAndPassword(email, password) {
        return createUserWithEmailAndPassword(fireBaseAuth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Account Created Successfully! :) ->", user);
                return user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Failed to Create your Account! :(", errorCode, errorMessage);
                throw error; // Rethrow the error for further handling
            });
    }

    function signInUserWithEmailAndPassword(email, password) {
        return signInWithEmailAndPassword(fireBaseAuth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Logged In Successfully! :) ->", user);
                return user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Failed to Log In! :(", errorCode, errorMessage);
                throw error; // Rethrow the error for further handling
            });
    }

    function signInWithGoogle() {
        return signInWithPopup(fireBaseAuth, googleProvider)
            .then((result) => {
                console.log("SignedIn with Google Successfully! :)");
                return result.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Failed to Sign In With Google! :(", errorCode, errorMessage);
                throw error;
            });
    }

    const isLoggedIn = user ? true : false;

    async function handleCreateNewListing(name, isbnNumber, price, coverPic) {
        const ImageRef = ref(storage, `uploads/images/${Date.now()}-${coverPic.name}`);
        const uploadResult = await uploadBytes(ImageRef, coverPic);

        try {
            console.log(uploadResult, uploadResult.metadata.fullPath);
            const docRef = await addDoc(collection(firestore, "books"), {
                name, isbnNumber, price,
                imageURL: uploadResult.metadata.fullPath,
                userID: user.uid,
                userEmail: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });
            console.log("Document written with ID: ", docRef.id);
            return docRef;
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e;
        }
    }

    async function listAllBooks() {
        return getDocs(collection(firestore, "books"));
    }

    function getImageURL(imageURL) {
        return getDownloadURL(ref(storage, imageURL));
    }

    async function getBookByID(id) {
        const ref = doc(firestore, "books", id);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap;
        } else {
            console.log("No such document!");
        }
    }

    async function placeOrder(bookId, qty) {
        const collectionRef = collection(firestore, 'books', bookId, 'orders');
        const result = await addDoc(collectionRef, {
            userID: user.uid,
            userEmail: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            qty: Number(qty),
            status: "Pending"
        });
        return result;
    }

    async function fetchMyBooks(userId) {
        const collectionRef = collection(firestore, "books");
        const q = query(collectionRef, where("userID", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot;
    }

    async function getOrders(bookId) {
        const collectionRef = collection(firestore, "books", bookId, "orders");
        const result = await getDocs(collectionRef);
        return result;
    }

    function signOutUser() {
        return signOut(fireBaseAuth).then(() => {
            console.log("Signed Out Successfully! :)");
            return true; // Return true to indicate successful sign-out
        }).catch((error) => {
            console.log("Failed to sign Out! :(", error);
            throw error; // Rethrow the error for further handling
        });
    }

    async function updateOrderStatus(bookId, orderId, status) {
        const orderRef = doc(firestore, "books", bookId, "orders", orderId);
        try {
            await updateDoc(orderRef, { status });
            console.log(`Order ${status} successfully!`);
        } catch (e) {
            console.error("Error updating order status: ", e);
            throw e; // Rethrow the error for handling in the UI
        }
    }

    async function deleteBook(bookId) {
        const bookRef = doc(firestore, "books", bookId);
        try {
            await deleteDoc(bookRef);
            console.log("Book deleted successfully!");
        } catch (e) {
            console.error("Error deleting book: ", e);
            throw e; // Rethrow the error for handling in the UI
        }
    }

    return (
        <FireBaseContext.Provider value={{
            signUpUserWithEmailAndPassword,
            signInUserWithEmailAndPassword,
            signInWithGoogle,
            isLoggedIn,
            handleCreateNewListing,
            listAllBooks,
            getImageURL,
            getBookByID,
            placeOrder,
            fetchMyBooks,
            user,
            getOrders,
            signOutUser,
            updateOrderStatus,
            deleteBook
        }}>
            {children}
        </FireBaseContext.Provider>
    );
}
