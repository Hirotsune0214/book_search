/*
インポートとpropsの型定義です。コンポーネントのプロパティとしては、検索結果の表示最大件数(maxResults)と書籍追加イベントを拾うコールバック関数(onBookAdd)を持たせます。
*/

import React,{ useState, useRef } from "react";
import { BookDescription } from "./BookDescription";
import BookSearchItem from "./BookSearchItem";
import { useBookData } from "./useBookData";



// 下記で、検索結果の表示最大件数を扱う
type BookSearchDialogProps = {
  maxResults: number;
  onBookAdd: (book: BookDescription) => void
};

const BookSearchDialog = (props: BookSearchDialogProps) => {
  // booksは書籍の検索結果を表す配列で、初期値は空の配列
  // const [title, setTitle] = useState("");
  // const [author, setAuthor] = useState("");
  // useRefを使用するので上記の代わりに下記に変更する
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(""); 

  const books = useBookData(title, author, props.maxResults);




//タイトル、著者名のinput要素のonChangeイベントを拾い、それぞれのステート変数を更新する。
// const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   setTitle(e.target.value);
// };

// const handleAuthorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   setAuthor(e.target.value);
// };

// 検索ボタンのクリックイベント
const handleSearchClick = () => {
  if(!titleRef.current!.value && !authorRef.current!.value) {
    alert("条件を入力してください");
    return;
  }
  setTitle(titleRef.current!.value);
  setAuthor(authorRef.current!.value);
}



/*
書籍追加イベントに対するコールバックも実装しておきます。これは子のBookSearchItemで発火したイベントを親コンポーネントへ伝搬するだけ
*/
const handleBookAdd = (book: BookDescription) => {
  props.onBookAdd(book);
};

/*
検索結果はBookSearchItemコンポーネントを配列の要素数だけ繰り返し出力します。各イベントとハンドラの紐付けを行う
*/
const bookItems = books.map((b, idx) => {
  return (
    <BookSearchItem description={b} onBookAdd={(b) => handleBookAdd(b)} key={idx} />
  );
});

/*
isSearchingがtrueの時に下記が実行される
・fetch関数によるAPIコール(Ajax)
・結果のJSONから書籍のデータを抽出
・setBooks関数によるステート変数booksの更新


*/



return (
  <div className="dialog">
    <div className="operation">
      <div className="conditions">
        <input type="text" ref={titleRef}
        placeholder="タイトルで検索"
        />
        <input type="text" ref={authorRef}
        placeholder="著名者名で検索"
        />
        </div>
        <div className="button-like" onClick={handleSearchClick}>
          検索
          </div>
    </div>
    <div className="search-results">{bookItems}</div>
  </div>
)
};

export default BookSearchDialog;