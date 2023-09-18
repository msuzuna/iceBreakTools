import db from '../lib/firebase';
import { DocumentData, doc, getDoc, updateDoc } from 'firebase/firestore';

export const draw = function () {
  const $main = <HTMLElement>document.querySelector('.js-main');
  for (let i = 1; i <= 9; i++) {
    let $canvas = document.createElement('canvas');
    $canvas.className = 'canvas';
    $canvas.setAttribute('id', `canvas${i}`);
    $canvas.setAttribute('width', '200');
    $canvas.setAttribute('height', '200');
    $main.appendChild($canvas);
  }
  /**
   * canvasクラスに関連する変数の宣言
   */
  const canvasCollection = <HTMLCollection>(
    document.getElementsByClassName('canvas')
  );
  // canvasクラスの要素数を取得
  const canvasCollectionLength: number = canvasCollection.length;

  /**
   * id=canvasに関連する変数の宣言
   */
  // HTMLCanvasElementを格納する配列を宣言
  const canvasArray: Array<HTMLCanvasElement> = [];
  // canvasクラスの要素それぞれからHTMLCanvasElement要素を取得し、配列に格納する
  for (let i = 1; i <= canvasCollectionLength; i++) {
    canvasArray.push(<HTMLCanvasElement>document.getElementById('canvas' + i));
  }

  /**
   * paperModalに関連する変数の宣言
   */
  const paperModalWindow = <HTMLElement>(
    document.getElementById('paperModalWindow')
  );
  const paperModal = <HTMLElement>document.getElementById('paperModal');
  const paperModalText = <HTMLElement>document.getElementById('paperModalText');

  /**
   * 図形描写に関する宣言
   */
  const envelopeColor: string = '#d7ccc8';
  const paperColor: string = '#ffffff';
  const shadowColor: string = 'rgba(0, 0, 0, 0.4)';
  const shadowBlur: number = 4;
  // 描画の頂点を設定
  const [min, median, max, foldPoint, overlap]: number[] = [
    5, 100, 195, 40, 80,
  ];

  /**
   * 図形描写のクラスを宣言
   */
  // 封筒の裏側のクラスを設定
  class BackPentagon {
    // 更新メソッド
    update() {
      return;
    }

    // 描画メソッド
    render(context: CanvasRenderingContext2D) {
      context.beginPath();
      context.moveTo(median, min);
      context.lineTo(max, foldPoint);
      context.lineTo(median, overlap);
      context.lineTo(min, foldPoint);
      context.fillStyle = envelopeColor;
      context.shadowBlur = shadowBlur;
      context.shadowColor = shadowColor;
      context.fill();
      context.save();
    }
  }

  // 封筒の中身の紙クラスを設定
  class Paper {
    // プロパティ
    x: number;
    y: number;
    width: number;
    height: number;
    movement: number;

    // コンストラクタ
    constructor(
      x: number,
      y: number,
      width: number,
      height: number,
      movement: number
    ) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.movement = movement;
    }

    // 更新メソッド
    update(isActive: boolean) {
      const flag: number = isActive === true ? -1 : 1;
      if (this.y > 15 && this.y <= 40) {
        this.y += this.movement * flag;
      } else if (this.y === 15 && !isActive) {
        this.y = 16;
        return;
      } else if (this.y === 41 && isActive) {
        this.y = 40;
        return;
      }
    }

    // 描画メソッド
    render(context: CanvasRenderingContext2D) {
      context.beginPath();
      context.rect(this.x, this.y, this.width, this.height);
      context.fillStyle = paperColor;
      context.shadowBlur = shadowBlur;
      context.shadowColor = shadowColor;
      context.fill();
      context.save();
    }
  }

  // 封筒の表側のクラスを設定
  class FrontPentagon {
    // 更新メソッド
    update() {
      return;
    }

    // 描画メソッド
    render(context: CanvasRenderingContext2D) {
      context.beginPath();
      context.moveTo(median, overlap);
      context.lineTo(max, foldPoint);
      context.lineTo(max, max);
      context.lineTo(min, max);
      context.lineTo(min, foldPoint);
      context.fillStyle = envelopeColor;
      context.shadowBlur = shadowBlur;
      context.shadowColor = shadowColor;
      context.fill();
      context.save();
    }
  }

  // トークテーマのテキストのクラスを設定
  class PaperText {
    // プロパティ
    text: string;

    // コンストラクタ
    constructor(text: string) {
      this.text = text;
    }

    // 更新メソッド
    update() {
      return;
    }

    // 描画メソッド
    render(context: CanvasRenderingContext2D) {
      context.font = '16px san-serif';
      context.textAlign = 'center';
      context.fillStyle = 'black';
      context.shadowBlur = 0;
      context.fillText(this.text, 100, 105);
    }
  }

  /**
   * firebase firestoreからトークテーマオブジェクトを取得
   */
  const searchParams = new URLSearchParams(window.location.search);
  const pageID = <string>searchParams.get('pageID');
  if (pageID === '') {
    location.href = 'https://icebreak-727fe.web.app/';
  }
  const firestoreDoc = doc(db, 'page', pageID);
  const querySnapShot = getDoc(firestoreDoc);
  querySnapShot.then((value) => {
    const talkThemeObject = <DocumentData>value.data();

    // HTMLCanvasElement要素それぞれに対して図形を描写
    canvasArray.forEach((canvas, index) => {
      if (canvas.getContext) {
        // canvasのコンテキスト取得
        const context = <CanvasRenderingContext2D>canvas.getContext('2d');
        const canvasLength: number = canvas.clientHeight; //canvasの高さ取得

        const objects: Array<BackPentagon | Paper | FrontPentagon> = [];
        const backPentagon = new BackPentagon();
        const paper = new Paper(20, 40, 160, 140, 1);
        const frontPentagon = new FrontPentagon();
        const paperText = new PaperText(talkThemeObject[index].theme);

        if (talkThemeObject[index].isOpened) {
          paper.y = (canvasLength - paper.height) / 2;
          objects.splice(1, 1, backPentagon);
          objects.push(frontPentagon);
          objects.splice(3, 1, paper);
          objects.push(paperText);
          objects;

          context.clearRect(0, 0, canvasLength, canvasLength); // clear canvas
          objects.forEach((obj) => obj.render(context));
        } else {
          objects.push(backPentagon);
          objects.push(paper);
          objects.push(frontPentagon);
          context.clearRect(0, 0, canvasLength, canvasLength); // clear canvas
          objects.forEach((obj) => obj.render(context));

          const movePaper = function () {
            context.clearRect(0, 0, canvasLength, canvasLength); // clear canvas

            // 各オブジェクトの状態を更新する。
            objects.forEach((obj) => obj.update(isActive));

            // 各オブジェクトを描画する。
            objects.forEach((obj) => obj.render(context));

            if (paper.y === 15 || paper.y === 41) {
              clearInterval(interval);
            }
          };

          let isActive: boolean = true;
          let interval: number;

          canvas.addEventListener('mouseover', function () {
            if (objects[1] === paper) {
              clearInterval(interval);
              isActive = true;
              interval = setInterval(movePaper, 10, isActive);
            }
          });

          canvas.addEventListener('mouseout', function () {
            if (objects[1] === paper) {
              clearInterval(interval);
              isActive = false;
              interval = setInterval(movePaper, 10, isActive);
            }
          });

          canvas.addEventListener('click', function () {
            clearInterval(interval);

            paperModalText.innerText = talkThemeObject[index].theme;
            paperModalWindow.classList.add('is-active');
            paperModal.classList.add('is-active');

            const docUpdate = updateDoc(firestoreDoc, {
              index: {
                isOpend: true,
              },
            });
            docUpdate.then(
              () => {
                return;
              },
              (error) => {
                console.log(error);
              }
            );

            setTimeout(() => {
              paper.y = (canvasLength - paper.height) / 2;
              objects.splice(1, 1, backPentagon);
              objects.splice(3, 1, paper);
              objects.push(paperText);
              context.clearRect(0, 0, canvasLength, canvasLength); // clear canvas
              objects.forEach((obj) => obj.render(context));
            }, 3000);

            setTimeout(() => {
              paperModalWindow.classList.remove('is-active');
            }, 6000);

            setTimeout(() => {
              paperModal.classList.remove('is-active');
            }, 7000);
          });
        }
      }
    });
  });
};
