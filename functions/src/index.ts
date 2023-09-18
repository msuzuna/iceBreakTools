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
