import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    //don't know why he did that, says it's good practice (to return item)
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex(el => el.id === id);
    this.items.splice(index, 1);
    /* the splice method mutates the array, and returns the deleted item
    in brackets is index of item to delete, and how many items to delete
    so if we wanted to get the deleted item, we could use return this.items.splice(index,1)*/
  }

  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
  }
};

