const searchInput = document.getElementById('search-input');
const buttonSubmit = document.getElementById('button-submit');
const columnsContainer = document.getElementById('columns-container');
const paginationContainer = document.getElementById('pagination-container');
const prevButton = document.querySelector('.pagination-previous');
const nextButton = document.querySelector('.pagination-next');
const paginationNumbers = document.querySelector('.pagination-list');

const base_URL = 'https://api.tvmaze.com/search/shows/?q=';

let displayedShows = 0;
let paginationLimit = 10;
let pageCount;
let currentPage;

const createCard = (imageURL, tvShowName, genre, premiered, tvStatus, origin) => {
  const div1 = document.createElement('div');
  const div2 = document.createElement('div');
  const div3 = document.createElement('div');
  const div4 = document.createElement('div');
  const div5 = document.createElement('div');
  const div6 = document.createElement('div');
  const div7 = document.createElement('div');
  const figure = document.createElement('figure');
  const img = document.createElement('img')
  const p1 = document.createElement('p');
  const p2 = document.createElement('p');
  const p3 = document.createElement('p');
  const p4 = document.createElement('p');
  const p5 = document.createElement('p');

  div1.classList.add('column', 'is-one-fifth');
  div2.classList.add('card');
  div3.classList.add('card-image');
  figure.classList.add('image', 'is-1by1');
  img.setAttribute('src', imageURL)
  div4.classList.add('card-content');
  div5.classList.add('media');
  div6.classList.add('media-content');
  p1.classList.add('title', 'is-4');
  p1.textContent = tvShowName;
  div7.classList.add('content');
  p2.textContent = `Genre: ${genre}`;
  p3.textContent = `Premiered: ${premiered}`;
  p4.textContent = `Status: ${tvStatus}`;
  p5.textContent = `Origin: ${origin}`;

  div1.append(div2);
  div2.append(div3);
  div3.append(figure);
  figure.append(img);
  div2.append(div4);

  div4.append(div5);
  div5.append(div6);
  div6.append(p1);

  div4.append(div7)
  div7.append(p2);
  div7.append(p3);
  div7.append(p4);
  div7.append(p5);

  columnsContainer.append(div1);
}

const getTvShows = async () => {
  const res = await axios.get(`${base_URL}${searchInput.value}`);
  displayedShows += res.data.length;
  
  for(let i = 0; i < res.data.length; i++) {
    let tvImage = res.data[i].show.image;
    let tvName = res.data[i].show.name;
    let tvGenre = res.data[i].show.genres.join(', ');
    let tvPremiered = res.data[i].show.premiered;
    let tvStatus = res.data[i].show.status;
    let tvOrigin = res.data[i].show.network;
    if (tvImage === null) {
       tvImage = 'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png';
    } else {
      tvImage = tvImage.original;
    }
    if(tvGenre.length === 0) tvGenre = 'Not Available';
    if(tvPremiered === null) tvPremiered = 'Not Available';
    if(tvStatus === null) tvStatus = 'Not Available';
    if(tvOrigin === null) {
      tvOrigin = 'Not Available';
    } else {
      tvOrigin = tvOrigin.country.name;
    }
    createCard(tvImage, tvName, tvGenre, tvPremiered, tvStatus, tvOrigin);
  }
  if(displayedShows > 10) {
    displayPagination(displayedShows);
  }
  searchInput.value = ''
}

// columns-container as pagenated list var

const appendPageNumber = (index) => {
  const pageNumberLI = document.createElement('li');
  const pageNumber = document.createElement('a');
  pageNumber.classList.add('pagination-link');
  pageNumber.textContent = index;
  pageNumber.setAttribute('page-index', index);
  pageNumberLI.append(pageNumber);
  paginationNumbers.append(pageNumberLI);
}
  
const getPaginationNumbers = (data) => {
  pageCount = Math.ceil(data / paginationLimit);
  // const hasPageIndex = document.querySelector('.pagination-link');
  for (let i = 1; i <= pageCount; i++) {
    if(pageCount > 2) {
      appendPageNumber(pageCount);
      break;
    } else {
      appendPageNumber(i);
    }
  }
}

// Next and Previous Buttons
prevButton.addEventListener("click", () => {
  setCurrentPage(currentPage - 1);
});
nextButton.addEventListener("click", () => {
  setCurrentPage(currentPage + 1);
});
  
const displayPagination = (data) => { // START <<<
  paginationContainer.classList.remove('is-hidden'); // display pagination
  getPaginationNumbers(data);
  setCurrentPage(1);

  
  
  //Add Page Number Buttons Event Listener⬇
  const allPaginationNumber = document.querySelectorAll(".pagination-link");
  allPaginationNumber.forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));

    if (pageIndex) {
      button.addEventListener("click", () => {
        setCurrentPage(pageIndex);
      });
    }
  });
}

const disableButton = (button) => {
  button.classList.add("is-disabled");
  button.setAttribute("disabled", true);
};
const enableButton = (button) => {
  button.classList.remove("is-disabled");
  button.removeAttribute("disabled");
};

const handlePageButtonsStatus = () => {
  if (currentPage === 1) {
    disableButton(prevButton);
  } else {
    enableButton(prevButton);
  }
  if (pageCount === currentPage) {
    disableButton(nextButton);
  } else {
    enableButton(nextButton);
  }
};

//Display Active Page
const setCurrentPage = (pageNum) => {
  const cardItems = columnsContainer.querySelectorAll('.is-one-fifth');
  currentPage = pageNum;

  handleActivePageNumber();
  handlePageButtonsStatus();

  const prevRange = (pageNum -1) * paginationLimit; // 1
  const currRange = pageNum * paginationLimit; // 10

  cardItems.forEach((card, index) => {
    card.classList.add("is-hidden");
    if (index >= prevRange && index < currRange) {
      card.classList.remove("is-hidden");
    }
  });
}

// Set Active Page Number
const handleActivePageNumber = () => {
  const allPaginationNumber = document.querySelectorAll(".pagination-link");
  allPaginationNumber.forEach((button) => {
    button.classList.remove("is-current"); // is active
    
    const pageIndex = Number(button.getAttribute("page-index"));
    if (pageIndex == currentPage) {
      button.classList.add("is-current");
    }
  });
};

buttonSubmit.addEventListener('click', () => {
  getTvShows();
});
