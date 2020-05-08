class Element {
    constructor(tag, position, parent, ...rest) {
        this. el = document.createElement(tag);
        this.el.classList.add(...rest);
        parent.insertAdjacentElement(position, this.el);
        return this.el;
    }
}


export default Element;
