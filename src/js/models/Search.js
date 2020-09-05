import axios from 'axios';

export default class Search {
    constructor(query){
        this.query = query;
    }
    
    async getResult(){
    const app_id = 'db6fd9d3';
    const app_key = 'ac6fa568be12e5b5c745aedc9b3d9aab';
    try {
        const res = await axios(`https://api.edamam.com/search?q=${this.query}&app_id=${app_id}&app_key=${app_key}&from=0&to=30`);
        
            this.result = res.data.hits.map(function(e) {
                return e.recipe;
              });
        
    }
    catch(error){
        console.log(error);
    }
}
}







