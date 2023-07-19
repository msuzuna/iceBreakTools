import { Configuration, OpenAIApi } from 'openai';
// import db from '../lib/firebase';
// import { DocumentData, doc, getDoc, setDoc } from 'firebase/firestore';
import { draw } from './draw';

export const getTheme = function () {
  const createRoomButton = <HTMLButtonElement>(
    document.querySelector('.js-entryButton')
  );

  const configuration = new Configuration({
    organization: 'org-LCf4Mp0PxwPLVaoCcpBZnXyD',
    apiKey: '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',
  });
  const openai = new OpenAIApi(configuration);

  createRoomButton.addEventListener('click', function () {
    let labelText = <string>'';

    const $category = <NodeList>(
      document.querySelectorAll('input[name=category]')
    );
    $category.forEach((elm) => {
      const checked = (<HTMLInputElement>elm).checked;
      if (checked) {
        labelText = <string>(
          (<HTMLInputElement>elm).nextElementSibling?.innerHTML
        );
      }
    });

    document.querySelector('.js-top')?.remove();
    document.querySelector('.js-loader')?.classList.remove('is-invisible');

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
      console.log(themeArray);
      document.querySelector('.js-loader')?.remove();
      document.querySelector('.js-main')?.classList.remove('is-invisible');
      draw();
    })();
  });
};
