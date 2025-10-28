// main.js
// DOMのロードが完了したら実行する関数
document.addEventListener("DOMContentLoaded", function () {
  // CSVファイルを読み込んでパースする
  fetch("./hobbies.csv")
    .then(function (response) {
      return response.text(); // レスポンスをテキスト形式で取得
    })
    .then(function (data) {
      const records = parseCSV(data); // CSVデータをパースして配列に変換
      const elements = createTableContents(records); // パースされたデータでHTMLテーブルを生成
      const master = document.getElementById("master"); // テーブルを配置する要素を取得
      const table = master.querySelector("table");
      table.append(...elements); // テーブルにヘッダーとデータ行を追加
    });

  // 詳細画面の「戻る」ボタンにイベントリスナーを追加
  document.querySelector("#detail > button").addEventListener("click", () => {
    document.body.classList.remove("-showdetail"); // 詳細画面を非表示にする
  });
});

// CSVデータをパースして連想配列の配列に変換する関数
function parseCSV(data) {
  // CSVを改行で分割して各行を配列として扱う
  const rows = data.split("\n");
  // 最初の行（ヘッダー）をカンマで分割してカラム名を取得
  const headers = rows[0].split(",");

  // データ行をオブジェクトとして格納する配列
  const records = [];

  // 2行目以降のデータ行をループで処理
  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(","); // 行をカンマで分割して各列の値を取得
    let record = {}; // データを格納するオブジェクトを作成
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j]; // ヘッダーをキーにして値をオブジェクトに格納
    }
    records.push(record); // 作成したオブジェクトを配列に追加
  }
  return records; // 連想配列の配列を返す
}

// パースされたCSVデータからHTMLテーブルを生成する関数
function createTableContents(records) {
  // テーブルのヘッダー行を作成
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (let key in records[0]) {
    const th = document.createElement("th");
    th.textContent = key; // 各ヘッダーセルにカラム名を設定
    headerRow.append(th); // ヘッダー行にセルを追加
  }
  thead.append(headerRow); // theadにヘッダー行を追加

  // テーブルのデータ行を作成
  const tbody = document.createElement("tbody");
  for (let record of records) {
    const tr = document.createElement("tr");
    for (let key in record) {
      const td = document.createElement("td");
      td.textContent = record[key]; // 各データセルに値を設定
      tr.append(td); // データ行にセルを追加
    }
    // 行をクリックしたときに詳細表示を呼び出すイベントリスナーを追加
    tr.addEventListener("click", function (event) {
      showDetail(record); // クリックされた行のデータを詳細表示
    });
    tbody.append(tr); // tbodyにデータ行を追加
  }

  return [thead, tbody]; // theadとtbodyを配列として返す
}

// 詳細画面にクリックした行のデータを表示する関数
function showDetail(record) {
  // body要素にクラスを追加して詳細画面を表示
  document.body.classList.add("-showdetail");
  const detail = document.querySelector("#detail > .container");

  // 既存の詳細内容をクリア
  while (detail.firstChild) {
    detail.removeChild(detail.firstChild);
  }

  // 各データ項目を表示
  for (const key in record) {
    const dl = document.createElement("dl");
    const dt = document.createElement("dt");
    dt.textContent = key; // データのキー（ヘッダー名）を表示
    const dd = document.createElement("dd");
    dd.textContent = record[key]; // データの値を表示
    dl.append(dt, dd); // dtとddを詳細表示のリストに追加
    detail.append(dl); // 詳細コンテナにリストを追加
  }
}