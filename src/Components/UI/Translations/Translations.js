import React from "react";

export const getDict = async (path) => {
  const locale = getLocale();

  try {
    const dictData = await import(`../../../locale/${locale}${path}.json`);

    return dictData;
  } catch (e) {
    try {
      const dictData = await import(`../../../locale/en${path}.json`);

      console.log(e, "Falling back to English locale.");

      return dictData;
    } catch (e2) {
      console.log(e2, "Path does not exist.");

      return {};
    }
  }
};

export const getLocale = () => {
  const localeData = (
    navigator.language ||
    navigator.browserLanguage ||
    (navigator.languages || ["es"])[0]
  ).substring(0, 2);

  const localeOverride = "";

  return ["en", "es"].includes(localeOverride || localeData)
    ? localeOverride || localeData
    : "es";
};

export const useDict = (path) => {
  const [dict, setDict] = React.useState({});

  const _ = require("lodash");

  const getTranslation = (path, defaultVal = "") => {
    const pathArr = path.split("/");

    return _.get(dict, pathArr, defaultVal);
  };

  React.useEffect(() => {
    const getData = async () => {
      const dictData = await getDict(path);

      setDict(dictData);
    };

    getData();
  }, [path]);

  return getTranslation;
};
