import React from 'react'
/*
  BookDescriptionは、APIで取得した書籍情報のうち下記の3つを保持する型
  title: string;
  authors: string;
  thumbnail: string;
*/
import { BookDescription } from './BookDescription'

type BookSearchItemProps = {
  description: BookDescription;
  onBookAdd: (book: BookDescription) => void;
};

const BookSearchItem = (props: BookSearchItemProps) => {
  const { title, authors, thumbnail } = props.description;

  const handleAddBookClick = () => {
    props.onBookAdd(props.description)
  };
  return (
    <div className='book-search-item'>
      <h2 title={title}>{title}</h2>
      <div className='authors' title={authors}>
        {authors}
      </div>
      {thumbnail ? <img src={thumbnail} alt="" /> : null}
      {/* +マークを押下したら、handleAddBookClick */}
      <div className='add-book' onClick={handleAddBookClick}>
      <span>+</span>
      </div>
    </div>
  )
}

export default BookSearchItem;