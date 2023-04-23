// カスタムフックの作成
import { BookDescription } from "./BookDescription";
import { useState, useEffect } from "react";

// 検索ダイアログで入力した条件で、Google Books APIsを呼び出して結果を表示
function buildSearchUrl(title: string, author: string, maxResults: number): string {
  let url = "https://www.googleapis.com/books/v1/volumes?q=";
  const conditions: string[] = []
  if (title) {
    conditions.push(`intitle:${title}`);
  }
  if (author) {
    conditions.push(`inauthor:${author}`);
  }
  return url + conditions.join('+') + `&maxResults=${maxResults}`;
}

// buildSearchUrlはAPIのURLを組み立てる関数、extractBooksはAPIの呼び出し結果(JSON)からコンポーネントが欲しい形でデータを抽出する関数
function extractBooks(json: any): BookDescription[] {
  const items: any[] = json.items;
  return items.map((item: any) => {
    const volumeInfo: any = item.volumeInfo;
    return {
      title: volumeInfo.title,
      authors: volumeInfo.authors ? volumeInfo.authors.join(', ') : "",
      thumbnail: volumeInfo.imageLinks ? volumeInfo.imageLinks.smallThumbnail : "",
    }
  });
}



export const useBookData = (title: string, author: string, maxResults: number) => {
  const [books, setBooks] = useState([] as BookDescription[]);
  
  useEffect(() => {
    if(title || author) {
      const url = buildSearchUrl(
        title, author, maxResults
      );
      fetch(url).then((res) => {
        return res.json();
      })
      .then((json) => {
        return extractBooks(json);
      })
      .then((books) => {
        setBooks(books);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    
    // useEffect 内の条件は「 title または author が空でないこと」とし、第2引数の依存性配列も isSearchg から title, author, maxResults に変更します。
    //戻り値は books のみとなります。
  }, [title, author, maxResults])

  return books;

}