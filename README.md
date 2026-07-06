# monkeyturnv-counter2 mobile-v3

iPhone向けカードUIを維持した設定判別版です。

管理対象はこの6ファイルのみです。

- index.html
- app.js
- style.css
- manifest.json
- service-worker.js
- README.md

## 今回の反映

- 設定判別から総ゲーム数を除外
- レア小役は設定期待度に直接反映せず、AT直撃率の分母として使用
- レア小役未入力時は通常ゲーム数とレア小役確率から推定直撃率を表示・簡易評価
- チャージ後セリフに比率表示を追加
- 舟券は銀・金・虹のみ
- SGメダル、トロフィー、舟券に確定内容つき回数表示を追加
- 公表値表示を拡充
