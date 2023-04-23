import React, { useState, useEffect } from "react"
import BookRow from "./BookRow"
import { BookToRead } from "./BookToRead"
import "./App.css"
// modalは開閉ができるもの
import Modal from "react-modal"
import BookSearchDialog from "./BookSearchDialog"
import { BookDescription } from "./BookDescription"

Modal.setAppElement("#root");


// customStylesはモーダルダイアログおよびオーバーレイの外観のスタイル設定
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)"
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: 0,
    transform: "translate(-50%, -50%)"
  }
};

// リロードしても書籍リストが消えないように、LocalStorageにデータを保存する
const APP_KEY = "react-hooks-tutorial"

const App = () => {
  // 書籍のリストを状態管理
  const [books, setBooks] = useState([] as BookToRead[]);
  // モーダルダイアログが開いているかどうかのステートで、最初は閉じていて欲しいので初期値はfalseにする
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // 下記の処理は初回のレンダリングだけで良いので、[]を記入
  useEffect(() => {
    const storeBooks = localStorage.getItem(APP_KEY);
    if(storeBooks) {
      setBooks(JSON.parse(storeBooks));
    }
  }, [])

  // LocalStorageの読み書きようなコンポーネント内で閉じない処理は副作用としてuseEffect関数を用いる
  useEffect(() => {
    localStorage.setItem(APP_KEY, JSON.stringify(books));
  }, [books])

  // 削除イベントのハンドリング
  // filterで、idが一致する書籍を除外した配列を生成し、setBooks関数を通じてステート変数の更新
    const handleBookDelete = (id: number) => {
      const newBooks = books.filter((b) => b.id !== id)
      setBooks(newBooks)
    };

  const bookRows = books.map((b) => {
    return (
      // mapを使用しているのでkey属性をつけている
      <BookRow book={b} key={b.id} onMemoChange={(id, memo) => handleBookMemoChange(id, memo)}
      onDelete={(id) => handleBookDelete(id)}
      />
    )
  })
  
  const handleBookMemoChange = (id: number, memo: string) => {
    const newBooks = books.map((b) => {
      return b.id === id
        ? { ...b, memo: memo }
        : b;
    });
    setBooks(newBooks);
  }
    // モーダルダイアログを開くためのもの
     const handleAddClick = () => {
      setModalIsOpen(true);
     };

     // モーダルダイアログが開かれた状態で、ダイアログの領域外をクリックした際に呼び出される
     const handleModalClose = () => {
      setModalIsOpen(false);
    };
    /*
    const newBooks = [...books, newBook]で現在の書籍リストの末尾に、検索ダイアログで選択した書籍情報（から作ったBookToReadオブジェクト）を追加し、setBooks関数でステート変数を更新する
    また、追加後はモーダルダイアログを閉じるために、同様にsetModalIsOpen関数でステート変数を更新する
    */

    const handleBookAdd = (book: BookDescription) => {
      const newBook: BookToRead = { ...book, id: Date.now(), memo:""};
      const newBooks = [...books, newBook];
      setBooks(newBooks);
      setModalIsOpen(false);
    }

  
return (
  <div className="App">
    <section className="nav">
      <h1>読みたい本リスト</h1>
      {/* 本を追加を押すとモーダルダイアログが開く */}
      <div className="button-like" onClick={handleAddClick}>本を追加</div>
    </section>
    <section className="main">{bookRows}</section>
    {/* BookSearchDialogがモーダル表示される */}
    <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        style={customStyles}
      >
      <BookSearchDialog maxResults={20} onBookAdd={(b) => {handleBookAdd(b)}} />
    </Modal>
  </div>
)
}
export default App;
