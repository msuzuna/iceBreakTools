import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Configuration, OpenAIApi } from 'openai';
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

export const requestOpenAI = functions.https.onRequest(
  async (request, response) => {
    try {
      const configuration = new Configuration({
        organization: `${process.env.VITE_OPENAI_ORG}`,
        apiKey: `${process.env.VITE_OPENAI_API_KEY}`,
      });
      const openai = new OpenAIApi(configuration);

      (async () => {
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `${labelText}についてのトークテーマをそれぞれ15文字以内で9つ教えてください。文字数のカウントは不要です。`,
            },
          ],
        });
        const input: string | undefined =
          completion.data.choices[0].message?.content;
        const inputArray = input?.split('\n');
        const themeArray = inputArray?.map((element) => {
          return element.substring(3, element.length);
        });

        document.querySelector('.js-loader')?.remove();
        document.querySelector('.js-main')?.classList.remove('is-invisible');
        draw();
      })();
    } catch (e) {
      console.error(e);
      response.status(500).send(e);
    }
  }
);
