import React from "react";

export const Search = contents => {
  const [displayedContents, setDisplayedContents] = React.useState([]);

  const [searchPattern, setSearchPattern] = React.useState("");

  const [searchWait, setSearchWait] = React.useState();

  let timer = null;

  const delaySearch = (value, delay) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      setSearchPattern(value);
      setSearchWait(true);
    });
  };

  const fuzzyMatch = (pattern, str) => {
    pattern = ".*" + pattern.split("").join(".*") + ".*";

    return new RegExp(pattern).test(str);
  };

  const handleKeyDown = event => {
    if (event.keyCode === 13) {
      if (event.target.value === "" && event.target.value !== searchPattern) {
        delaySearch("", 1);
      }
    }
  };

  const handleSearchChange = event => {
    delaySearch(event.target.value.toLowerCase(), 1000);
  };

  const search = () => {
    if (searchWait) {
      const searchContents = [];

      contents.forEach(content => {
        if (fuzzyMatch(searchPattern, content.name.toLowerCase())) {
          searchContents.push(content);
        }
      });

      setDisplayedContents(searchContents);

      setSearchWait(false);
    }
  };

  return {
    displayedContents: displayedContents,
    handleKeyDown: handleKeyDown,
    handleSearchChange: handleSearchChange,
    search: search,
    setDisplayedContents: setDisplayedContents,
    setSearchPattern: setSearchPattern,
    searchPattern: searchPattern
  };
};
