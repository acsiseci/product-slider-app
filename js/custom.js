let swiper = null
let recommendedProductsData = [];

const initialize = () => {
    createSliderContainer();
    createToast();
    readTextFile('./product-list.json', (text) => {
        const data = JSON.parse(text);
        recommendedProductsData = data.responses[0][0].params.recommendedProducts;

        const userCategories = getUserCategoriesFromResponse(data.responses);
        createCategories(userCategories);

        const firstCategoryName = document.querySelector('.category-list > li > a' ).innerText;
        createProductsByCategory(recommendedProductsData[firstCategoryName]);
    });
}

const createSliderContainer = () => {
    document.body.innerHTML += `
    <div class="menu">
        <div id="category" class="category">
            <ul class="category-list"></ul>
        </div>
        <div class="swiper-container product-swiper">
            <div class="product-list swiper-wrapper"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
    </div>`
}

const createToast = () => {
    document.body.innerHTML += `
    <div id="toast" class="add-basket-toast d-none">
        <div class="toast">
            <div class="icon">
                <i class="check"></i>
            </div>
            <div class="toast-content">
                <div>Ürün Sepete Eklendi.</div>
                <span class="toast-basket-text">Sepete Git</span>
            </div>
            <div onclick="closeToast()" class="icon-close"></div>
        </div>
    </div>`
}

const getUserCategoriesFromResponse = (response) => {
    let userCategories = [];
    response.map( _data => (
        _data.map( __data => (
            __data.params.userCategories.map(x => (
                !userCategories.includes(x) ? userCategories.push(x) : '' // Check repetitive categories data
            ))
        ))
    ));
    return userCategories;
}

// Load JSON file locally using pure Javascript
const readTextFile = (file, callback) => {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType('application/json');
    rawFile.open('GET', file, true);
    rawFile.onreadystatechange = () => {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

const createCategories = (categories) => {
    const categoryListSection = document.querySelector('.category-list');
    categoryListSection.innerHTML = categories
        .map((item) => `<li><a class="category-button" onclick="setSelectedCategory(this)">${item}</a></li>`)
        .join('');
}

const setSelectedCategory = (categoryElement) => {
    // Selected Category Remove All Class
    let categoryButtonsElements = document.querySelectorAll(".category-button-selected");
    [].forEach.call(categoryButtonsElements, (el) => {
        el.classList.remove('category-button-selected');
    });
    categoryElement.classList.add('category-button-selected') // Selected Category Add Class
    createProductsByCategory(recommendedProductsData[categoryElement.firstChild.nodeValue]);
    swiper.slideTo(1, 0, false);
    swiper.slidePrev();
}

const createProductsByCategory = (products) => {
    const productListSection = document.querySelector('.product-list');
    productListSection.innerHTML = products.map((item) => `
        <div class="product swiper-slide" onclick="addToBasket()">
            <img class="product-image swiper-lazy" data-src="${item.image}" alt="Product Image">
            <div class="product-title">${item.name}</div>
            <div class="product-price">${item.priceText}</div>
            <div class="free-cargo">Ücretsiz Kargo</div>
            <div class="product-buy-button">Sepete Ekle</div>
            <div class="swiper-lazy-preloader"></div>
        </div>`
    ).join('');

    swiper = new Swiper('.product-swiper', {
        // Lazy loading
        preloadImages: false,
        lazy: true,
        watchSlidesVisibility: true,
        // Lazy loading
        observer: true,
        observeParents: true,
        slidesPerView: 'auto',
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}

const addToBasket = () => {
    document.getElementById('toast').classList.remove('d-none');
    setTimeout(closeToast, 5000);
}

const closeToast = () => {
    document.getElementById('toast').classList.add('d-none');
}

window.addEventListener('DOMContentLoaded', initialize);
