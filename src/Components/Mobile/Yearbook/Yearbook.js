import React, { useState, useLayoutEffect } from "react";

import LoadingSpinner from "../../UI/LoadingSpinner";
import GroupYearbook from './GroupYearbook';

import { getTreeWithBooks } from "../../../utils";

import { getYearbookList } from "../../../services/yearbookService";
import { getDivisionsTree } from "../../../services/schoolInfoService";

import { useDict } from "../../UI/Translations"

import {setCurrentPage} from "../../../services/localStorageService";
import './Yearbook.css';

const Yearbook = () => {
  const [loading, setLoading] = useState(true);
  const [yearbooks, setYearbooks] = useState([]);
  const [booksTree, setBooksTree] = useState([]);
  const [updated, setUpdated] = useState(false);

  const dict = useDict("/mobile/yearbook")

  // console.log('==== YEARBOOK ====');
  setCurrentPage('/mobile/yearbook');

  const loadData = () => {
    const getData = async () => {
      const [yearbooks, tree] = await Promise.all([getYearbookList(), getDivisionsTree()]);
      setYearbooks(yearbooks);
      const treeWithBooks = getTreeWithBooks(tree, yearbooks);
      setBooksTree(treeWithBooks);
      setLoading(false);
    };

    try {
      getData();
      if (updated) {
        setUpdated(false);
      }
    } catch (e) {
      console.log(dict("main/message/error/api"));
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    loadData();
  }, [updated]);

  return (<div className="yearbook-config-container">
    <div className="yearbook-config-header-container">
      <p className="yearbook-config-header-title-text">
        {dict("main/header/title")}
      </p>

      <p className="yearbook-config-header-paragraph-text">
        {dict("main/header/paragraph")}
      </p>
    </div>

    {loading ? (
      <LoadingSpinner />
    ) : (
      <div className="yearbook-config-content-container">
        {booksTree.map((book, i) => (
          <div className="yearbook-config-content" key={book.bookId + book.id + book.name} >
            <GroupYearbook book={book} depth={1} setUpdated={setUpdated} />
          </div>
        ))}
      </div>
    )}
  </div>);
}

export default Yearbook;
