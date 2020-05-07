export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLiked(id, author, title, img) {
    const like = {id, author, title, img};
    this.likes.push(like);
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);
  }

  isLiked(id) {
    // if it is -1 (the element is not in the array) it will return false
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }
}
