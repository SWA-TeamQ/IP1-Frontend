// ProductDetails and Product classes

class ProductDetails {
    constructor(kwargs) {
        this.category = kwargs?.category;
        this.size = kwargs?.size;
        this.badge = kwargs?.badge;
        this.rating = kwargs?.rating;
        this.reviewCount = kwargs?.reviewCount;
        this.salePrice = kwargs?.salePrice;
        this.color = kwargs?.color;
    }
}

class Product {
    #price;
    constructor(id, name, price, image, description = "", details = {}) {
        this.id = id;
        this.name = name;
        this.#price = price;
        this.image = image;
        this.description = description;
        this.details = new ProductDetails(details);
        this.isFavorite = false;
    }

    getPrice() {
        return this.#price;
    }

    getRatingStars() {
        const fullStars = Math.floor(this.details.rating || 0);
        const hasHalfStar = (this.details.rating || 0) % 1 >= 0.5;
        return (
            "★".repeat(fullStars) +
            (hasHalfStar ? "☆" : "") +
            "☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
        );
    }
}


function changeImage(el){
    document.querySelectorAll('.thumbnail-gallery img').forEach(i=>i.classList.remove('active'));
    el.classList.add('active');
    mainImg.style.opacity=0;
    setTimeout(()=>{mainImg.src=el.src;mainImg.style.transform='scale(1.02)';mainImg.style.opacity=1;setTimeout(()=>mainImg.style.transform='scale(1)',200);},200);
}
