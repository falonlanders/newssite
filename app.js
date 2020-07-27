const BASE_URL = "https://api.currentsapi.services/v1";
const API_KEY = "apiKey=ltszIpd4YwLRzkUGOlJuuQNPK6C7JLPCvkNZ_6ROosPOFl1c";
// let currentPage = 1;
// let newArray = [news];
// let articlePerPage = 10;

//CATEGORIES
async function fetchCategories() {
  try {
    const response = await fetch(`${BASE_URL}/available/categories/?${API_KEY}`);
    const { categories } = await response.json();
    console.log(categories);
    localStorage.setItem("categories", JSON.stringify(categories));
    return categories;
  } catch (error) {
    console.error(error);
  }
  if (localStorage.getItem("categories")) {
    return JSON.parse(localStorage.getItem("categories"));
  }
}

//REGION
async function fetchRegion() {
  try {
    const response = await fetch(`${BASE_URL}/available/regions/?${API_KEY}`);
    const { regions } = await response.json();
    console.log(regions);
    localStorage.setItem("regions", JSON.stringify(region));
    return regions;
  } catch (error) {
    console.error(error);
  }
  if (localStorage.getItem("regions")) {
    return JSON.parse(localStorage.getItem("regions"));
  }
}

//LANGUAGE
async function fetchLanguage() {
  try {
    const response = await fetch(`${BASE_URL}/available/languages/?${API_KEY}`);
    const { languages } = await response.json();
    console.log(languages);
    localStorage.setItem("languages", JSON.stringify(languages));
    return languages;
  } catch (error) {
    console.error(error);
  }
  if (localStorage.getItem("languages")) {
    return JSON.parse(localStorage.getItem("languages"))
  }
}

// DROPDOWN PREFETCH
async function dropdown() {
  try {
    const [categories, regions, languages] = await Promise.all([
      fetchCategories(),
      fetchRegion(),
      fetchLanguage(),
    ]);
    categories.forEach((category) => {
      $("#category").append($(`<option value="${category}">${category}</option>`));
    });
    const regionArray = Object.entries(regions);
    regionArray.forEach((region) => {
      $("#region").append($(`<option value="${region[1]}">${region[0]}</option>`));
    });
    const languageArray = Object.entries(languages);
    languageArray.forEach((language) => {
      $("#language").append($(`<option id="${language[1]}" value="${language[1]}">${language[0]}</option>`));
    });
    $("#en").attr("selected", true);
  } catch (error) {
    console.error(error);
  }
}
dropdown();

//BUILD SEARCH STRING
function buildSearchString() {
  const language = `language=${$("#language").val()}`;
  const keywords = `&keywords=${$("#search").val()}`;
  const country = `&country=${$("#region").val()}`;
  const category = `&category=${$("#category").val()}`;
  const start = `&start_date${$("#startDate").val()}`;
  const end = `&end_date=${$("#endDate").val()}`;
  const url = `https://api.currentsapi.services/v1/search?`
  if (keywords == "") {
    return `https://api.currentsapi.services/v1/latest-news?${API_KEY}`;
  } else {
    const updatedURL = `${url}${language}${keywords}${country}${category}${start}${end}&${API_KEY}`
    return encodeURI(updatedURL)
  }
}

//SEARCH BUTTON CLICK FUNCTION
$("form").on('submit', async function (event) {
  event.preventDefault();
  console.log("this is our url!", buildSearchString());
  try {
    const response = await fetch(buildSearchString());
    const { status, news } = await response.json();
    updateArticle(status, news);
  } catch (error) {
    console.log(error)
  }
  finally {
    $('form').trigger('reset');
  }
});

//RENDER PREVIEW
function renderArticle(article) {
  const { title, description, url, author, image, category, published } = article;
  results = $(
    `<br><br><br><div class="container"><div><a href"#" class="cat" data-category="${category}"></a>
</div>
<h2 class="title"><a class="title" target="_blank" href="${url}">${title}</a></h2>
<div>
<span class="author">${author}</span><br><span><div class="date">${published}</span><br>
</div>
<div class="image"><a target="_blank" href="${url}"><img class="image" src="${image}" alt="${title}"></a>
</div>
<div class="description">${description}</div></div>`)
    .data('article', article);
  console.log(results);
  return results;
}

//UPDATE PREVIEW
function updateArticle(status, news) {
  // const articles = $("#center");
  // if (news.next) {
  //   articles.find(".next").data("url", news.next).attr("disabled", false);
  // } else {
  //   root.find(".next").data("url", null).attr("disabled", true);
  // }
  // if (news.prev) {
  //   root.find(".previous").data("url", news.prev).attr("disabled", false);
  // } else {
  //   root.find(".previous").data("url", null).attr("disabled", true);
  // }
  const root = $('#results');
  root.empty();
  console.log("update article")
  news.forEach(function (article) {
    root.append(renderArticle(article));
  })
}


// {
//     "status": "ok",
//     "news": [
//         {
//             "id": "e1749cf0-8a49-4729-88b2-e5b4d03464ce",
//             "title": "US House speaker Nancy Pelosi backs congressional legislation on Hong Kong",
//             "description": "US House speaker Nancy Pelosi on Wednesday threw her support behind legislation meant to back Hong Kong's anti-government protesters.Speaking at a news conference featuring Hong Kong activists Joshua Wong Chi-fung and Denise Ho, who testified before the Congressional-Executive Commission on China (C...",
//             "url": "https://www.scmp.com/news/china/politics/article/3027994/us-house-speaker-nancy-pelosi-backs-congressional-legislation",
//             "author": "Robert Delaney",
//             "image": "None",
//             "language": "en",
//             "category": [
//                 "world"
//             ],
//             "published": "2019-09-18 21:08:58 +0000"
//         },
