export class SearchObject
{
    destination:string;
    from:string;
    to:string;
    guestsCount:number;
    page:number;

    constructor(destination:string, from:string, to:string, guestsCount:number, page:number)
    {
        this.destination = destination;
        this.from = from;
        this.to = to;
        this.guestsCount = guestsCount;
        this.page = page;
    }
}