import axios from 'axios';
export default class Recipe {
    constructor(id){
        this.id = id;
    }
    
    async getRecepie(){
    const app_id = 'db6fd9d3';
    const app_key = 'ac6fa568be12e5b5c745aedc9b3d9aab';
    try {
        const res = await axios(`https://api.edamam.com/search?r=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_${this.id}&app_id=${app_id}&app_key=${app_key}&from=0&to=30`);
        this.title = res.data[0].label;
        this.publisher = res.data[0].source;
        this.image = res.data[0].image;
        this.url = res.data[0].url;
        this.ingredients = res.data[0].ingredients.map(function(e) {
            return e.text;
        });
        //console.log(res);
        
        
    }
    catch(error){
        console.log(error);
    }
}

calTime() {
    //assume 15 min for 3 recepies
    const period = Math.ceil(this.ingredients.length / 3);
    this.time = period*15;

}

calService()  {
    this.service = 4;
}

parseIngrident() {

    const longIngridents = ['tablespoons' , 'tablespoon' , 'teaspoons' , 'teaspoon' , 'pieces' , 'piece' , 'pinch' , 'cups' , 'cup', 'ounces' , 'ounce' , 'slices' , 'slice' , 'batches' , 'batch' , 'leaves' , 'pound' , 'lb' , 'small' , 'eggs', 'egg'];
    const shortIngridents = ['tbsps' , 'tbsp' , 'tsps' , 'tsp' , 'piece' , 'piece' , 'pinch' , 'cup', 'cup', 'oz' , 'oz' , 'slice' , 'slice' , 'batch' , 'batch' , 'leave' , 'pound' , 'lb' , 'small' , 'egg' , 'egg'];

    const newIngridents = this.ingredients.map(el => {
                 let ingredient = el.toLowerCase();
                 longIngridents.forEach((unit , i) => {
                     ingredient = ingredient.replace(unit , shortIngridents[i]);
                 });

                

              //parse ingrident into unit count and ingrident

              const arrIng = ingredient.split(' ');
              const unitIndex = arrIng.findIndex(el2 => shortIngridents.includes(el2));

             let objIng;
              if(unitIndex > -1){
                  //there is a unit
      
                  const arrCount = arrIng.slice(0 , unitIndex);
                  let count;
                  if(arrCount === 1){
                      count = arrCount[0];
                  }else{
                      count = eval(arrIng.slice(0 , unitIndex).join('+'));
                  }

                  objIng = {
                      count , 
                      unit: arrIng[unitIndex] , 
                      ingredient: arrIng.slice(unitIndex+1).join(' ')
                  }


              } else if(parseInt(arrIng[0 , 10])){
                  // there is no unit but a number
                  objIng = {
                    count:parseInt(arrIng[0 , 10]),
                    unit:'',
                    ingredient: ingredient.slice(1).join(' ')
                }
              } else if(unitIndex === -1){
                  //there is no unit and no number
                  objIng = {
                      count:1,
                      unit:'',
                      ingredient
                  }
              }

              return objIng;

    });

    this.ingredients = newIngridents;

    
}

updateServing(type) {
      const newService = type === 'dec' ? this.service - 1 : this.service + 1;

    this.ingredients.forEach(ing => {
        ing.count *= (newService / this.service);
    });

      this.service = newService;
}


}