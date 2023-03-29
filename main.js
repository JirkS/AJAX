class Product {
    constructor(id, title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.discountPercentage = discountPercentage;
        this.rating = rating;
        this.stock = stock;
        this.brand = brand;
        this.category = category;
        this.thumbnail = thumbnail;
        this.images = images;
    }

    obrazky() {
        return `
        <div class="card m-4" style="width: 20rem;">
            <img src="${this.images[1]}" class="card-img-top">
            <div class="card-body">
                <h4 class="card-title">${this.title}</h4>
                <p class="card-text">${this.description}</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Price: ${this.price} $</li>
                <li class="list-group-item">Stock: ${this.stock} items</li>
                <li class="list-group-item">Rating: ${String(this.rating)}</li>
                <li class="list-group-item">Brand: ${this.brand}</li>
                <li class="list-group-item">Category: ${this.category}</li>
            </ul>
        </div>
        `;
    }

    tabulka() {
        return `
        <tr>
            <td>${this.title}</td>
            <td>${this.description}</td>
            <td>${this.price}</td>
            <td>${this.discountPercentage}</td>
            <td>${String(this.rating)}</td>
            <td>${this.stock}</td>
            <td>${this.brand}</td>
            <td>${this.category}</td>
        </tr>
        `;
    }
}

class Catalog {
    constructor() {
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        if (localStorage.getItem("products") == null) {
            this.getProductsFromWeb();
            console.log("*web!");
        } else if (localStorage.getItem("products") != null) {
            this.getProductsFromLocalStorage();
            console.log("*local storage!");
        } else {
            localStorage.removeItem("products");
            console.error("Error loading products!");
        }
    }

    getProductsFromWeb() {
        let req = new XMLHttpRequest();
        req.open("GET", "https://dummyjson.com/products");
        req.send();

        req.onprogress = (event) => {
            let percent = (event.loaded / event.total * 100);
            this.ProgressBar(percent);
        }

        req.onload = (e) => {
            let data = JSON.parse(req.responseText);

            if (data == null || data == undefined || data == "") {
                console.error("Error parsing JSON from web!");
                return;
            }

            data["products"].forEach(product => {
                let p = new Product(
                    product.id,
                    product.title,
                    product.description,
                    product.price,
                    product.discountPercentage,
                    product.rating,
                    product.stock,
                    product.brand,
                    product.category,
                    product.thumbnail,
                    product.images
                );
                this.products.push(p);
            });

            localStorage.setItem("products", JSON.stringify(this.products));
            this.printProducts();
            this.ProgressBar(0);
        }

        req.onerror = (error) => {
            console.log(error);
        }
    }

    getProductsFromLocalStorage() {
        let products = JSON.parse(localStorage.getItem("products"));

        products.forEach(product => {
            let p = new Product(
                product.id,
                product.title,
                product.description,
                product.price,
                product.discountPercentage,
                product.rating,
                product.stock,
                product.brand,
                product.category,
                product.thumbnail,
                product.images
            );
            this.products.push(p);
        });
        this.printProducts();
        this.ProgressBar(0);
    }

    printProducts() {
        let vypis = "";
        const mode = document.getElementById("content").getAttribute("data-mode");

        if (mode == null || mode == "" || mode == undefined) {
            console.error("Attribute data-mode not found!");
            return;
        }

        switch (mode) {
            case "cards":
                this.products.forEach(product => {
                    vypis += product.obrazky();
                });
                break;

            case "table":
                vypis += ` <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Rating</th>
                            <th>Stock</th>
                            <th>Brand</th>
                            <th>Category</th>
                          </tr>`;
                this.products.forEach(product => {
                    vypis += product.tabulka();
                });
                break;
        }
        document.getElementById("content").innerHTML = vypis;
    }

    ProgressBar(percent) {
        let progressBar = document.getElementById("progressBar");
        progressBar.style.width = percent + "%";
    }
}

onload = () => {
    let catalog = new Catalog();
}
//localStorage.clear();
