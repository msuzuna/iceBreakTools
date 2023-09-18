import db from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const getTheme = function () {
  const createRoomButton = <HTMLButtonElement>(
    document.querySelector('.js-entryButton')
  );

  // ランダム文字列の生成
  const createRandomId = function () {
    const num = <number>20; // 20文字
    const characters = <string>(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    );
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

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

    const params = { theme: labelText };
    const query = new URLSearchParams(params);
    const url = `https://us-central1-icebreak-727fe.cloudfunctions.net/getTalkTheme?${query}`;

    document.querySelector('.js-top')?.remove();
    document.querySelector('.js-loader')?.classList.remove('is-invisible');

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then(function (json) {
        interface Obj {
          [prop: number]: any;
        }
        const obj: Obj = {};

        for (const [index, value] of json.entries()) {
          obj[index] = {
            theme: value,
            isOpened: false,
          };
        }
        // dbにinputの文字列を追加
        const id = createRandomId();
        const docRef = setDoc(doc(db, 'page', id), obj);
        docRef.then(
          () => {
            location.href = `https://icebreak-727fe.web.app/room?pageID=${id}`;
          },
          (error) => {
            console.log(error);
          }
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
};
