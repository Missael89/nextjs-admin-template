import axios from "axios";

let data;

const insert = async (id, i18n, locale, text) => {
  let json;
  if (id === '' || id == null) {
    json = {
      i18n: {
        id: i18n
      },
      locale: {
        id: locale
      },
      text: text
    }
  } else {
    json = {
      id: id,
      i18n: {
        id: i18n
      },
      locale: {
        id: locale
      },
      text: text
    }
  }
  

  await axios.post(`http://localhost:8080/api/translation`, json)
    .then((res) => {
      data = res;
    }).catch((error) => console.error(error));

  return data;
}

const getTranslation = async (i18n, locale) => {
  await axios.get(`http://localhost:8080/api/getTranslation/${i18n}/${locale}`)
    .then((res) => {
      data = res;
    }).catch((error) => console.log(error));

  return data;
}

export default { insert, getTranslation };