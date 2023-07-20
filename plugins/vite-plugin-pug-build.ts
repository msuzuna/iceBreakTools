import fs from "fs";
import type { Plugin } from "vite";
import { compileFile } from "pug";

export const vitePluginPugBuild = (): Plugin => {
  const pathMap: Record<string, string> = {};
  return {
    // Vite専用プラグインの命名には「vite-plugin-」のプレフィックスをつけるらしい
    name: "vite-plugin-pug-build",
    enforce: "pre",
    // ビルド時のみ
    apply: "build",
    // カスタムリゾルバーを定義できる
    // エントリーポイントの加工をできる
    resolveId(source: string) {
      if (source.endsWith(".pug")) {
        // xxxx.pug へのリクエストを
        // xxxx.html へのリクエストに偽る
        const dummy = `${
          source.slice(0, Math.max(0, source.lastIndexOf("."))) || source
        }.html`;
        // xxxx.pug と xxxx.html 対応表を作る
        pathMap[dummy] = source;
        // xxxx.html を返す
        return dummy;
      }
    },
    // ローダーを定義できる
    // ここでファイルの中身を読み込む
    load(id: string) {
      if (id.endsWith(".html")) {
        // xxxx.html へのリクエストがあった時
        if (pathMap[id]) {
          // もとのファイルが xxxx.pug の時は pug をコンパイルして返す
          const html = compileFile(pathMap[id])();
          return html;
        }
        // もとのファイルも xxxx.html の時は xxxx.html の中身をそのまま返す
        return fs.readFileSync(id, "utf-8");
      }
    },
  };
};
