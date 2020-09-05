import {element} from './base';
export const getInput = () => element.searchInput.value;

export const clearInput = () => {element.searchInput.value = '';};

export const clearPreData = () => {
    element.searchResult.innerHTML = '';
    element.searchResPages.innerHTML = '';
}

export const renderLoader = parent => {
    const loader = `
    <div class = "loader">
    <svg>
    <use href="img/icons.svg#icon-cw"></use>
    </svg>
    </div>
    `;
   parent.insertAdjacentHTML('afterbegin' , loader);

};

export const clearRenderLoader = () => {
const loader = document.querySelector('.loader');

if(loader) loader.parentElement.removeChild(loader);

};

export const activeRecpie = id => {

 const resArray = Array.from(document.querySelectorAll('.results__link'));
    resArray.forEach(el => {
        el.classList.remove('results__link--active');
    })

    document.querySelector(`a[href = "#${id}"]`).classList.add('results__link--active');
}

export const limitTitle = (title , limit = 17) => {
    const newTitle = [];
    if(title.length  > limit){
        title.split(' ').reduce((acc , cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        },0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

const getRes = res => {

    const id = res.uri.split('_');
    const rid = id[1];
    const markup = ` <li>
    <a class="results__link" href="#${rid}">
        <figure class="results__fig">
            <img src="${res.image}" alt="${res.label}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitTitle(res.label)}</h4>
            <p class="results__author">${res.source}</p>
        </div>
    </a>
</li>`;

element.searchResult.insertAdjacentHTML('beforeend' , markup);


}; 

const createButton = (page , type) => `
    <button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev'? page - 1 : page + 1}>
    <use href="img/icons.svg#icon-triangle-${type === 'prev'? 'left': 'right'}"></use>
    <svg class="search__icon">
        
    </svg>
    <span>Page ${type === 'prev'? page - 1 : page + 1}</span>
</button>`;


const renderButton = (page , numResult , resPerPage) => {

    const pages = Math.ceil(numResult / resPerPage);

    let button;
    if(page === 1 && pages>1){
        //only btn to next page
        button = createButton(page , 'next');
    }else if(page < pages){
        //both btns to next and previous
       button = `${createButton(page , 'prev')}
                 ${createButton(page , 'next')}`;
    }else if(page === pages && pages>1){
        //only btn to previous
        button = createButton(page , 'prev');
    }
    element.searchResPages.insertAdjacentHTML('afterbegin' , button);
};
 
export const renderResults = (recepies , page=1 , resPerPage=10) => {
     const start = (page - 1) * resPerPage;
     const end = page * resPerPage;
    recepies.slice(start , end).forEach(getRes);
    renderButton(page , recepies.length , resPerPage);
};


