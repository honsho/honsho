export class LeoTranslatedItem {
    constructor({ value, votes, pic_url, pic }) {
        this.value = value;
        this.votes = votes;
        this.pic = pic_url || pic;
    }
}