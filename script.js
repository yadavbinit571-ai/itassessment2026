// Theme Toggle
const themeToggle = document.getElementById('theme-toggle'); // button for theme switching
const body = document.body; // main body element

function toggleTheme() { // change theme state
    body.classList.toggle('dark'); // toggle dark class on body
    const isDark = body.classList.contains('dark'); // check current theme
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); // save theme in localStorage
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' :
     '<i class="fas fa-moon"></i>'; // set icon
}

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark'); // apply dark theme
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // sun icon for dark mode
} else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // moon icon for light mode
}

themeToggle.addEventListener('click', toggleTheme); // listen for toggle clicks

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || []; // restore cart or start empty
const cartCountElements = document.querySelectorAll('#cart-count'); // cart count badges

function updateCartCount() { // refresh cart badges
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // count all items
    cartCountElements.forEach(element => {
        element.textContent = totalItems; // display count
    });
}

function addToCart(productId, name, price, image) { // add product to cart
    const existingItem = cart.find(item => item.id === productId); // find existing item
    if (existingItem) {
        existingItem.quantity += 1; // increment quantity
    } else {
        cart.push({ // add new cart item
            id: productId,
            name: name,
            price: parseInt(price.replace('Rs ', '').replace(',', '')), // convert price string to number
            image: image,
            quantity: 1
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart)); // save cart state
    updateCartCount(); // update badges
    alert(`${name} added to cart!`); // notify user
}

function removeFromCart(productId) { // remove item from cart
    cart = cart.filter(item => item.id !== productId); // remove by id
    localStorage.setItem('cart', JSON.stringify(cart)); // save changes
    updateCartCount(); // refresh count
    renderCart(); // update cart page
}

function renderCart() { // render cart items on cart page
    const cartItemsContainer = document.getElementById('cart-items'); // items list
    const cartTotalElement = document.getElementById('cart-total'); // total area
    const emptyCartElement = document.getElementById('empty-cart'); // empty message

    if (!cartItemsContainer) return; // skip if not on cart page

    cartItemsContainer.innerHTML = ''; // clear existing content
    let total = 0; // total order price

    if (cart.length === 0) {
        emptyCartElement.style.display = 'block'; // show empty message
        cartTotalElement.style.display = 'none'; // hide total box
        return;
    }

    emptyCartElement.style.display = 'none'; // hide empty state
    cartTotalElement.style.display = 'block'; // show total box

    cart.forEach(item => { // build cart row for each item
        const itemTotal = item.price * item.quantity; // calculate item line total
        total += itemTotal; // add to total

        const cartItemElement = document.createElement('div'); // item card
        cartItemElement.className = 'cart-item'; // apply CSS class
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Price: Rs ${item.price.toLocaleString()}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Total: Rs ${itemTotal.toLocaleString()}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `; // item HTML
        cartItemsContainer.appendChild(cartItemElement); // add to DOM
    });

    document.getElementById('total-price').textContent = total.toLocaleString(); // show total order price
}

// Add to cart buttons initialization
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart'); // find all buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card'); // product card element
            const id = card.dataset.id; // product id
            const name = card.dataset.name; // product name
            const price = card.dataset.price; // product price string
            const image = card.dataset.image; // product image url
            addToCart(id, name, price, image); // add product to cart
        });
    });

    updateCartCount(); // update cart badge
    renderCart(); // render cart page if present
});

// Image Slider
let currentSlide = 0; // current slide index
const slides = document.querySelectorAll('.slide'); // slider slides
const prevBtn = document.querySelector('.slider-btn.prev'); // previous button
const nextBtn = document.querySelector('.slider-btn.next'); // next button

function showSlide(index) { // display specified slide
    slides.forEach(slide => slide.classList.remove('active')); // hide all
    slides[index].classList.add('active'); // show selected
    currentSlide = index; // update current index
}

function nextSlide() { // move to next slide
    currentSlide = (currentSlide + 1) % slides.length; // wrap around
    showSlide(currentSlide); // show it
}

function prevSlide() { // move to previous slide
    currentSlide = (currentSlide - 1 + slides.length) % slides.length; // wrap around
    showSlide(currentSlide); // show it
}

if (prevBtn && nextBtn) { // if slider is present
    prevBtn.addEventListener('click', prevSlide); // attach previous handler
    nextBtn.addEventListener('click', nextSlide); // attach next handler
    setInterval(nextSlide, 5000); // auto advance every 5 seconds
}

// Gallery Lightbox
const galleryItems = document.querySelectorAll('.gallery-item'); // gallery images
const lightbox = document.getElementById('lightbox'); // lightbox overlay
const lightboxImg = document.getElementById('lightbox-img'); // image inside lightbox
const closeBtn = document.querySelector('.close'); // close button

if (galleryItems.length > 0) { // if gallery exists
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            lightboxImg.src = this.src; // use clicked image
            lightbox.classList.add('show'); // open overlay
        });
    });

    closeBtn.addEventListener('click', function() {
        lightbox.classList.remove('show'); // close overlay
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) { // click outside image
            lightbox.classList.remove('show'); // close overlay
        }
    });
}

// Contact Form Validation
const contactForm = document.getElementById('contact-form'); // contact form element
const successMessage = document.getElementById('success-message'); // success message block

if (contactForm) { // if contact form exists
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // stop actual submission

        const name = document.getElementById('name'); // name input
        const email = document.getElementById('email'); // email input
        const phone = document.getElementById('phone'); // phone input
        const message = document.getElementById('message'); // message textarea

        let isValid = true; // form validity flag

        document.querySelectorAll('.error').forEach(error => error.textContent = ''); // clear previous errors

        if (name.value.trim() === '') { // require name
            document.getElementById('name-error').textContent = 'Name is required';
            isValid = false;
        }

        if (email.value.trim() === '') { // require email
            document.getElementById('email-error').textContent = 'Email is required';
            isValid = false;
        } else if (!email.value.includes('@') || !email.value.includes('.')) { // simple email validation
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            isValid = false;
        }

        if (phone.value.trim() === '') { // require phone
            document.getElementById('phone-error').textContent = 'Phone is required';
            isValid = false;
        }

        if (message.value.trim() === '') { // require message
            document.getElementById('message-error').textContent = 'Message is required';
            isValid = false;
        }

        if (isValid) { // if valid, show success state
            contactForm.style.display = 'none'; // hide form
            successMessage.style.display = 'block'; // show success text
            contactForm.reset(); // reset form data
        }
    });
}

// Checkout functionality
const checkoutBtn = document.getElementById('checkout-btn'); // checkout button
if (checkoutBtn) { // if on cart page
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) { // if cart empty
            alert('Your cart is empty!');
            return;
        }
        alert('Order placed successfully! Thank you for shopping with StepStyle.'); // checkout success message
        cart = []; // clear cart
        localStorage.setItem('cart', JSON.stringify(cart)); // save empty cart
        updateCartCount(); // update cart count
        renderCart(); // refresh cart display
    });
}
