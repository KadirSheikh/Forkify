import Search from './models/Search';
import Recipe from './models/Recepie';
import List from './models/List';
import Like from './models/Like';
import {element} from './views/base';
import * as searchView from './views/searchView';
import * as recepieView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';


/** Search Controller */
const state = {};
//window.state = state; 

const controlSearch = async () => {

    //get query
    const query = searchView.getInput();
    
    if(query){
        //new object
         state.search = new Search(query);

        //update ui
        searchView.clearInput();
        searchView.clearPreData();
        searchView.renderLoader(element.searchRes);
       

        //call function
        await state.search.getResult();

        //render result on ui
        searchView.clearRenderLoader();
        searchView.renderResults(state.search.result);
      //console.log(state.search.result);
       
    }

};

element.searchForm.addEventListener('submit' , e => {
e.preventDefault();
controlSearch();
});

/*window.addEventListener('load' , e => {
    e.preventDefault();
    controlSearch();
    });*/

    //pagination 

element.searchResPages.addEventListener('click' , e=> {
const btn = e.target.closest('.btn-inline');
const goToPage = parseInt(btn.dataset.goto);
searchView.clearPreData();
searchView.renderResults(state.search.result , goToPage);
//console.log(goToPage);
});





/** Get Recepie Controller */
const controlRecepie = async  () => {
    //get id
const id = window.location.hash.replace('#' , '');

//console.log(id);
if(id){
    //prepare ui
    recepieView.clearResult();
    searchView.renderLoader(element.recipe);

  //active recepie
  if(state.search) searchView.activeRecpie(id);


    //create new recepie object
    state.recepie = new Recipe(id);
    /*window.r = state.recepie;*/

    try {
//get data and parse ingridents
await state.recepie.getRecepie();
state.recepie.parseIngrident();


//call timing and servicing function
state.recepie.calTime();
state.recepie.calService();

//render result in ui
searchView.clearRenderLoader();
recepieView.renderRecipe(state.recepie , state.likes.isLiked(id));
//console.log(state.recepie);

    }catch(error){
        console.log(error)
    }

}

};

//window.addEventListener('hashchange' , controlRecepie);

['hashchange' , 'load'].forEach(e => {
    window.addEventListener(e , controlRecepie);
});



/** Get List Controller */
const controlList = () => {
    //if there is no list add one
    if(!state.list) state.list = new List();

     //add items to the list
     state.recepie.ingredients.forEach(el => {
               const item = state.list.addItem(el.count , el.unit , el.ingredient);
               listView.renderItem(item);

     });

};

//handle delete and update list item from ui

element.shopping.addEventListener('click' , el=>{
    //retrive id for each list item
    const id =  el.target.closest('.shopping__item').dataset.itemid;
   
    if(el.target.matches('.shopping__delete, .shopping__delete *')){
     //delete list from state
        state.list.deleteItem(id);
   
    //delete list from ui
        listView.deleteItem(id);
   
    
    }else if(el.target.matches('.shopping__item--value')){
        const value = parseFloat(el.target.value , 10);
   
        state.list.updateCount(id , value);
   
    }
   
   });

/** Get Like Controller */

const controlLike = ()  => {

   if(!state.likes) state.likes = new Like();

   const currentID = state.recepie.id;

   //user NOT liked
    if(!state.likes.isLiked(currentID)){
      
        //add like to state
        const newLike = state.likes.addLike(currentID , state.recepie.title , state.recepie.publisher , state.recepie.image);
        //toggle like
         likeView.toggleLikeBtn(true);
        //add like to ui
        likeView.renderLike(newLike);
         //console.log(state.likes);
  //user liked
    }else {
        //remove like to state
         state.likes.deleteLike(currentID);
        //toggle like
        likeView.toggleLikeBtn(false);
        //remove like to ui
        likeView.deleteLike(currentID);
        //console.log(state.likes);
    }

    likeView.toggleMenuBtn(state.likes.likeCount());
    
};

//restore liked recepie back when page load
window.addEventListener('load' , () => {
    state.likes = new Like();

    state.likes.readStorage();

    likeView.toggleMenuBtn(state.likes.likeCount());

   state.likes.likes.forEach(like => likeView.renderLike(like));

});



//Handling recepie btn click 
element.recipe.addEventListener('click' , e=> {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){

        if(state.recepie.service > 1){
            
            state.recepie.updateServing('dec');
            recepieView.updateServingIng(state.recepie);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recepie.updateServing('inc');
        recepieView.updateServingIng(state.recepie); 
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
    //console.log(state.recepie);
});


window.l = new List();