import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const fetchBookInfo = functions.https.onRequest(
  async (request, response) => {
    try {
      const db = admin.firestore();
      const doc = await db.collection('books').doc('000-0000000000').get();

      const bookInfo = doc.data();
      response.send(bookInfo);
    } catch (e) {
      console.error(e);
      response.status(500).send(e);
    }
  }
);
