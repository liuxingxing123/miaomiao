
import * as staticData from "./static"
let filterOptions = { };
for( const item in staticData ){
    filterOptions[item] =  (value)=>{
        const flagItem = staticData[item].find(itemChild=>itemChild.value==value);
        return flagItem?flagItem.label:'-'
        
    }
}
export default filterOptions;
