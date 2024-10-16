// List of menu items
const drinks = [
    { id: 1, name: 'Es Teh', price: 5000, image: 'Asset/image/esteh.png' },
    { id: 2, name: 'Kopi', price: 10000, image: 'Asset/image/kopi.png' },
    { id: 3, name: 'Jus Jeruk', price: 15000, image: 'Asset/image/jusjeruk.png' },
    { id: 4, name: 'Jus Jambu', price: 12000, image: 'Asset/image/jusjambu.png' },
    { id: 5, name: 'Jus Apel', price: 15000, image: 'Asset/image/jusapel.png' },
    { id: 6, name: 'Jus Sirsak', price: 12000, image: 'Asset/image/jussirsak.png' },
    { id: 7, name: 'Jus Melon', price: 14000, image: 'Asset/image/jusmelon.png' },
    { id: 8, name: 'Josua', price: 8000, image: 'Asset/image/josua.png' },
];

const foods = [
    { id: 9, name: 'Nasi Goreng', price: 20000, image: 'Asset/image/nasigoreng.png' },
    { id: 10, name: 'Mie Ayam', price: 13000, image: 'Asset/image/mieayam.png' },
    { id: 11, name: 'Cap Cay', price: 15000, image: 'Asset/image/capcay.png' },
    { id: 12, name: 'Indomie Telur', price: 10000, image: 'Asset/image/indomie.png' },
    { id: 13, name: 'Batagor', price: 11000, image: 'Asset/image/batagor.png' },
    { id: 14, name: 'Bakpao', price: 8000, image: 'Asset/image/bakpao.png' },
    { id: 15, name: 'Pukis', price: 10000, image: 'Asset/image/pukis.png' },
    { id: 16, name: 'Dendeng Sapi', price: 25000, image: 'Asset/image/dendeng.png' }, 
];

let cart = [];
let totalItems = 0;
let totalPrice = 0;


function updateCartDisplay() {
    const cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = '';

    const uniqueItems = {};
    cart.forEach(item => {
        if (uniqueItems[item.name]) {
            uniqueItems[item.name].quantity += 1;
        } else {
            uniqueItems[item.name] = { ...item, quantity: 1 };
        }
    });

    for (let key in uniqueItems) {
        const li = document.createElement('li');
        li.innerText = `${uniqueItems[key].name} x ${uniqueItems[key].quantity} - Rp ${uniqueItems[key].price * uniqueItems[key].quantity}`;
        cartItemsList.appendChild(li);
    }

    document.getElementById('total-items').innerText = totalItems;
    document.getElementById('total-price').innerText = totalPrice;
}


function addItemToCart(item) {
    cart.push(item);
    totalItems++;
    totalPrice += item.price;
    updateCartDisplay();
}


document.getElementById('clear-cart').addEventListener('click', () => {
    const confirmClear = confirm('Apakah Anda yakin ingin menghapus semua item?');
    if (confirmClear) {
        resetTransaction();
    }
}, { once: true });  

function generateMenu(menu, menuSection) {
    menu.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;

        const name = document.createElement('h3');
        name.innerText = item.name;

        const price = document.createElement('p');
        price.innerText = `Rp ${item.price}`;

        const addButton = document.createElement('button');
        addButton.innerText = '+ Tambah';
        addButton.addEventListener('click', () => addItemToCart(item));

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(addButton);

        document.getElementById(menuSection).appendChild(card);
    });
}


generateMenu(drinks, 'drink-menu');
generateMenu(foods, 'food-menu');


document.getElementById('calculate-change').addEventListener('click', () => {
    const cash = parseInt(document.getElementById('cash').value);
    const change = cash - totalPrice;
    if (change >= 0) {
        alert(`Total Harga: Rp ${totalPrice}\nUang yang Diberikan: Rp ${cash}\nKembalian: Rp ${change}`);
        document.getElementById('change').innerText = change;
    } else {
        alert('Uang tidak cukup!');
    }
}, { once: true });  

function resetTransaction() {
    cart = [];
    totalItems = 0;
    totalPrice = 0;
    document.getElementById('total-items').innerText = totalItems;
    document.getElementById('total-price').innerText = totalPrice;
    document.getElementById('cart-items').innerHTML = '';
    document.getElementById('cash').value = '';
    document.getElementById('change').innerText = '0';
}


document.getElementById('new-transaction').addEventListener('click', () => {
    resetTransaction();
    alert('Transaksi baru dimulai.');
}, { once: true });  


document.getElementById('generate-invoice').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;  

    
    const doc = new jsPDF();

    
    doc.setFontSize(22);
    doc.text('Toko Modern by David', 20, 20);
    doc.setFontSize(16);
    doc.text('Invoice', 20, 35);
    doc.text('Terima kasih sudah berbelanja di Toko Modern by David!', 20, 45);

    
    const uniqueItems = {};
    cart.forEach(item => {
        if (uniqueItems[item.name]) {
            uniqueItems[item.name].quantity += 1;
        } else {
            uniqueItems[item.name] = { ...item, quantity: 1 };
        }
    });

    const items = [];
    for (let key in uniqueItems) {
        items.push([`${uniqueItems[key].name} x ${uniqueItems[key].quantity}`, `Rp ${uniqueItems[key].price * uniqueItems[key].quantity}`]);
    }

    
    doc.autoTable({
        startY: 50,  
        head: [['Item', 'Harga']],
        body: items,
        styles: {
            fontSize: 12,  
            halign: 'left',  
        },
        headStyles: {
            fillColor: [41, 128, 185],  
            textColor: [255, 255, 255], 
        },
    });

    const finalY = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total Harga: Rp ${totalPrice}`, 20, finalY);

    doc.save('invoice.pdf');
});
