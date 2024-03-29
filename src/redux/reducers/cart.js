const initialState = {
    items: {},  //обьект, кот. по id из сервера подгружает все данные про кофе
    totalPrice: 0,// сумма итоговая
    totalCount: 0, //кол-во пачек кофе
    
};
const getTotalPrice = (arr) => arr.reduce((sum, obj) => obj.price + sum, 0);

const _get = (obj, path) => {
   const [firstKey, ...keys] = path.split('.');
   return keys.reduce((val, key) => {
     return val[key];
   }, obj[firstKey]);
 };
 
 const getTotalSum = (obj, path) => {
   return Object.values(obj).reduce((sum, obj) => {
     const value = _get(obj, path);
     return sum + value;
   }, 0);
 };
 

const cart = (state = initialState, action) => {
switch (action.type) {
    case 'ADD_COFFE_CART': {
       const currentCoffeItems = !state.items[action.payload.id]
               ? [action.payload] 
               : [...state.items[action.payload.id].items, action.payload]
       const newItems = {
                ...state.items,
                [action.payload.id]: {
                  items: currentCoffeItems,
                  totalPrice: getTotalPrice(currentCoffeItems),
                },
             };
       

             const totalCount = getTotalSum(newItems, 'items.length');
             const totalPrice = getTotalSum(newItems, 'totalPrice');
             
      //  const allCoffe = [].concat.apply([], Object.values(newItems));
      //  const totalPrice = allCoffe.reduce((sum, obj) => obj.price + sum, 0);
        
       return {
            ...state,
           items: newItems,
           totalCount,         // кол-во пачек кофе в корзине
           totalPrice  
         };
  }
  case 'REMOVE_CART_ITEM': {
   const newItems = {
     ...state.items,
   };
   const currentTotalPrice = newItems[action.payload].totalPrice;
   const currentTotalCount = newItems[action.payload].items.length;
   delete newItems[action.payload];
   return {
     ...state,
     items: newItems,
     totalPrice: state.totalPrice - currentTotalPrice,
     totalCount: state.totalCount - currentTotalCount,
   };
 }

 case 'PLUS_CART_ITEM': {
   const newObjItems = [
     ...state.items[action.payload].items,
     state.items[action.payload].items[0],
   ];
   const newItems = {
     ...state.items,
     [action.payload]: {
       items: newObjItems,
       totalPrice: getTotalPrice(newObjItems),
     },
   };

   const totalCount = getTotalSum(newItems, 'items.length');
   const totalPrice = getTotalSum(newItems, 'totalPrice');

   return {
     ...state,
     items: newItems,
     totalCount,
     totalPrice,
   };
 }

 case 'MINUS_CART_ITEM': {
   const oldItems = state.items[action.payload].items;
   const newObjItems =
     oldItems.length > 1 ? state.items[action.payload].items.slice(1) : oldItems;
   const newItems = {
     ...state.items,
     [action.payload]: {
       items: newObjItems,
       totalPrice: getTotalPrice(newObjItems),
     },
   };

   const totalCount = getTotalSum(newItems, 'items.length');
   const totalPrice = getTotalSum(newItems, 'totalPrice');

   return {
     ...state,
     items: newItems,
     totalCount,
     totalPrice,
   };
 }

 case 'CLEAR_CART':
   return { totalPrice: 0, totalCount: 0, items: {} };

 default:
   return state;
}
}

//         case 'SET_TOTAL_COUNT':
//         return {
//            ...state,
//            totalCount: action.payload, //замени totalCount  на то, что тебе вернет action
//         };


//         default:
//         return state;
// }

export default cart;