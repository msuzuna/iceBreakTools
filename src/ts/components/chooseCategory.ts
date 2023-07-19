import db from '../lib/firebase';
import { DocumentData, doc, getDoc, setDoc } from 'firebase/firestore';

export const chooseCategory = function () {
  const $categoryList = <Element>document.querySelector('.js-category');

  // ページが読み込まれたら
  window.addEventListener('load', function () {
    const querySnapShot = getDoc(doc(db, 'talkTheme', 'category'));

    const createInputItem = (key: string, value: string) => {
      // DOM要素を定義
      let $listItem = document.createElement('li');
      let $labelItem = document.createElement('label');
      let $inputItem = document.createElement('input');

      // 各種クラスの追加
      $listItem.className = 'category__item';
      $labelItem.className = 'category__label';
      $inputItem.className = 'category__input';

      // labelにテキストを追加
      $labelItem.textContent = value;

      // 属性追加
      $inputItem.setAttribute('type', 'radio');
      $inputItem.setAttribute('name', 'category');
      $inputItem.setAttribute('id', key);
      $inputItem.setAttribute('value', key);
      $labelItem.setAttribute('for', key);

      //　DOM要素を追加
      $categoryList.appendChild($listItem);
      $listItem.appendChild($inputItem);
      $listItem.appendChild($labelItem);
      return;
    };

    querySnapShot.then(
      (value) => {
        const array = <DocumentData>value.data();

        Object.keys(array).forEach(function (key) {
          createInputItem(key, array[key]);
        });

        // カテゴリーを取得
        const $category = <NodeList>(
          document.querySelectorAll('input[name=category]')
        );
        const $entryButton = <HTMLButtonElement>(
          document.querySelector('.js-entryButton')
        );

        $category.forEach((elm) => {
          elm.addEventListener('change', (event: Event) => {
            const checked = (<HTMLInputElement>event.target).checked;
            if (checked) {
              $entryButton.classList.remove('entryButton--inactive');
              $entryButton.disabled = false;
            }
          });
        });
      },
      (error) => {
        console.log('失敗');
      }
    );
  });
};
