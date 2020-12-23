import React, { Fragment, useState, useEffect } from 'react';
import './StudentsTable.css';

import Select from "../UI/Select";
import SearchIcon from "../../SchoolAPP Assets/Search";
import { MdPlayArrow } from "react-icons/md";
import ReactTableContainer from "react-table-container";
import { useTable, useFilters, usePagination, useSortBy, useRowSelect, useGlobalFilter, useAsyncDebounce } from 'react-table';

import { useDict } from "../UI/Translations"

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 100);

  return <input value={value || ''}
    onChange={e => {
      setValue(e.target.value);
      onChange(e.target.value);
    }} placeholder="Buscar alumnos" />;
};

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate])

  return <input type="checkbox" ref={resolvedRef} {...rest} />;
});

const StudentsTable = ({ columns, data, onModify, onDelete }) => {
  const [goToPageValue, setGoToPageValue] = useState(0);

  const dict = useDict("/students-page")

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize }
  } = useTable({
    columns,
    data,
    initialState: {
      pageSize: 10,
      pageIndex: 0
    }
  }, useFilters, useGlobalFilter, useSortBy, usePagination, useRowSelect, (hooks) => {
    hooks.visibleColumns.push(columns => [{
      id: 'selection',
      Header: ({ getToggleAllRowsSelectedProps }) => <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />,
      Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
    }, ...columns])
  });

  useEffect(() => {
    setGoToPageValue(pageIndex + 1);
  }, [pageIndex]);

  const paginationStartNumber = () => {
    const currentPage = pageIndex + 1;

    if (currentPage === 1) {
      return 1;
    } else if (currentPage !== 1) {
      return pageSize * currentPage - pageSize + 1;
    }
  };

  const paginationEndNumber = () => {
    let result = paginationStartNumber() - 1 + pageSize;

    if (result > data.length) {
      return data.length;
    }

    return result;
  };

  const pageNumbers = () => {
    const currentPage = pageIndex + 1;

    const delta = 2;

    return Array(pageCount).fill().map((i, index) => index + 1).reduce((pages, page) => {
      if (page === 1 || page === pageCount) {
        return [...pages, page];
      }

      if (page - delta <= currentPage && page + delta >= currentPage) {
        return [...pages, page];
      }

      if (pages[pages.length - 1] !== '...') {
        return [...pages, '...'];
      }

      return pages;
    }, []).map((i, index) => {
      const button = <button onClick={() => gotoPage(i - 1)} className={[
        'students-table-footer-pages-page',
        currentPage === i ? 'students-table-footer-pages-page-active' : ''
      ].join(' ')}>{i}</button>;
      const dots = <span>{i}</span>;

      return <Fragment key={index}>
        {isNaN(i) ? dots : button}
      </Fragment>;
    });
  };

  const modifyRows = (rows = []) => onModify(rows);
  const deleteRows = (rows = []) => onDelete(rows);

  return (
    <div className="students-table">
      <div className="students-table-head">
        <div className="students-table-head-row">
          <div className="students-table-head-row-search">
            <SearchIcon width="1rem" height="1rem" fill="#000000" stroke="none" />
            <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} setGlobalFilter={setGlobalFilter} />
          </div>
          <ul className="students-table-head-row-actions">
            <li className={selectedFlatRows.length === 0 ? 'students-table-head-row-actions-disabled' : ''}>
              <span onClick={() => modifyRows(selectedFlatRows.map((d) => d.original))}>Modificar</span>
            </li>
            <li className={selectedFlatRows.length === 0 ? 'students-table-head-row-actions-disabled' : ''}>
              <span onClick={() => deleteRows(selectedFlatRows.map((d) => d.original))}>Eliminar</span>
            </li>
          </ul>
        </div>
        <ReactTableContainer width="100%" height="calc(100vh - 280px)" className="students-table-container">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th>
                      <div className="students-th">
                        <div {...column.getHeaderProps(column.getSortByToggleProps())} className="students-th-header">
                          {column.render('Header')}

                          <span>
                            {column.isSorted ? column.isSortedDesc ? <div className="students-table-arrow-up">
                              <MdPlayArrow size="0.8em" color="#373737" />
                            </div> : <div className="students-table-arrow-down">
                                <MdPlayArrow size="0.8em" color="#373737" />
                              </div> : ''}
                          </span>
                        </div>

                        {['campus', 'level', 'grade', 'group', 'asg'].indexOf(column.id) !== -1 && <div>{column.render('Filter')}</div>}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </ReactTableContainer>
      </div>

      <div className="students-table-footer">
        <div className="students-table-footer-left">
          <div className="students-table-footer-page-number">{`${dict("students-table/pagination/entries", [])[0]} `}<strong>{paginationStartNumber()}-{paginationEndNumber()}</strong>{` ${dict("students-table/pagination/entries", [])[1]} `}<strong>{data.length}</strong>{` ${dict("students-table/pagination/entries", [])[2]}`}</div>
          <div className="students-table-footer-page-size">
            {dict("students-table/pagination/display", [])[0]}<Select value={pageSize} size="default" width="60px" onChange={(e) => setPageSize(Number(e.target.value))} >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </Select>{dict("students-table/pagination/display", [])[1]}
          </div>
        </div>
        <div className="students-table-footer-right">
          <div className="students-table-footer-pages">
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className="students-table-footer-pages-arrow-left">
              <MdPlayArrow size="1.3em" />
            </button>
            {pageNumbers()}
            <button onClick={() => nextPage()} disabled={!canNextPage} className="students-table-footer-pages-arrow-right">
              <MdPlayArrow size="1.3em" />
            </button>
          </div>
          <div className="students-table-footer-goto">
            {dict("students-table/pagination/go-to-page")}<input type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => setGoToPageValue(Number(e.target.value))}
              onKeyPress={(e) => e.key === 'Enter' && gotoPage(goToPageValue)} />
            <span onClick={(e) => gotoPage(goToPageValue)}>{`${dict("students-table/pagination/go")} `}<MdPlayArrow size="1.3em" color="#000000" /></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsTable;
