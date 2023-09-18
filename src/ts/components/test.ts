import db from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const test = function () {
  const testButton = <HTMLButtonElement>document.querySelector('.js-test');

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

  testButton.addEventListener('click', function () {
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
    const url = `http://127.0.0.1:5001/icebreak-727fe/us-central1/getTalkTheme?${query}`;

    fetch(url)
      .then((response) => {
        return response.json();

        // const obj = {
        //   1: {
        //     talkTheme: 'ピザの魅力',
        //     isOpend: false,
        //   },
        // };
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
        console.log(obj);
        // dbにinputの文字列を追加
        const id = createRandomId();
        const docRef = setDoc(doc(db, 'page', id), obj);
        docRef.then(
          () => {
            console.log('DBに書き込めたよ！');
            // location.href = `http://127.0.0.1:5001/icebreak-727fe/us-central1/displayRoom?pageID=${id}`;
            location.href = `http://localhost:5173/room/index.html?pageID=${id}`;
          },
          (error) => {
            console.log(error);
          }
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // fetch('http://127.0.0.1:5001/icebreak-727fe/us-central1/helloWorld')
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
    // window.location.href =
    //   'http://127.0.0.1:5001/icebreak-727fe/us-central1/helloWorld';

    // Forestoreへの書き込みテスト
  });
};
