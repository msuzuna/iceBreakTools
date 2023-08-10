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

// ①リクエストを受け取ったらハローワールドを返すからスタートするのが良さそう
// 必要なデータを持ってきてくっつけて返す

export const requestOpenAI = functions.https.onRequest(
  async (request, response) => {
    try {
      const configuration = new Configuration({
        organization: `${process.env.VITE_OPENAI_ORG}`, // 環境変数の書き方を変えた方が良さそう！
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

/* トークテーマごとにパスを切る　リクエストごとにパスを変える
 * クエリパラメータごとに変える　URL　キーとバリュー
　　　クライアントに投げるときにリクエストにくっつけてfetchする
　　　fetch APIを使うことになる　難しい処理になりそう
　　　②リクエスト側でクエリを設定
　　　③受け取ったクエリをそのまま返す
　　　④受け取ったクエリをopenAIに投げる
　　　⑤openAI側から受け取った内容をクライアント側に返す
　　　サーバーからクエリを抽出してfetchして返ってきたのをクライアントに返す
 */
