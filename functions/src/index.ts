import * as functions from 'firebase-functions';
import { Configuration, OpenAIApi } from 'openai';

export const getTalkTheme = functions.https.onRequest((request, response) => {
  const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  (async () => {
    const talkTheme = request.query.theme;
    const text =
      talkTheme +
      'についてのトークテーマをそれぞれ10文字以内で9つ教えてください。文字数のカウントは不要です。';
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
    });
    const input: string | undefined =
      completion.data.choices[0].message?.content;
    const inputArray = input?.split('\n');
    const themeArray = inputArray?.map((element) => {
      return element.substring(3, element.length);
    });

    functions.logger.info(openai, completion, { structuredData: true });
    response.set('Access-Control-Allow-Headers', '*');
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST');
    response.send(themeArray);
    response.end();
  })();
});

export const displayRoom = functions.https.onRequest((request, response) => {
  const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&amp;display=swap">
    <title>アイスブレークツール</title>
    <script type="module" crossorigin src="/assets/roomTest-0d77c9d7.js">
    </script>
    <link rel="stylesheet" href="/assets/index-f7d4a071.css">
    </head>
    <body>
    <div class="main js-main"><div class="paperModal" id="paperModalWindow">
    <div class="paperModal__inner" id="paperModal">
    <p class="paperModal__text" id="paperModalText"></p>
    </div></div></div></body></html>`;
  functions.logger.info(displayRoom, { structuredData: true });
  response.set('Access-Control-Allow-Headers', '*');
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST');
  response.send(html);
  response.end();
});
