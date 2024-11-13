let products = [];

function openProductModal() {
    const form = document.getElementById('orderForm');
    if (form.checkValidity()) {
        document.getElementById("modalFirstName").textContent = document.getElementById("firstName").value;
        document.getElementById("modalLastName").textContent = document.getElementById("lastName").value;
        document.getElementById("modalEmail").textContent = document.getElementById("email").value;
        document.getElementById("modalPhoneNumber").textContent = document.getElementById("phoneNumber").value;
        document.getElementById("modalAddress").textContent = document.getElementById("address").value;

        document.getElementById('productForm').reset();
        document.getElementById('productTable').getElementsByTagName('tbody')[0].innerHTML = '';
        products = [];
        updateTotals();
        new bootstrap.Modal(document.getElementById('productModal')).show();
    } else {
        form.classList.add('was-validated');
    }
}

document.getElementById('addProduct').addEventListener('click', function () {
    const productForm = document.getElementById('productForm');
    if (productForm.checkValidity()) {
        const productName = document.getElementById("productName").value;
        const productQuantity = parseInt(document.getElementById("productQuantity").value);
        const productRate = parseFloat(document.getElementById("productRate").value);
        const taxRate = parseFloat(document.getElementById("taxRate").value);

        const total = productQuantity * productRate;
        const tax = total * taxRate;
        const totalWithTax = total + tax;
        products.push({ productName, productQuantity, productRate, taxRate, tax, totalWithTax });
        updateProductTable();
        productForm.reset();
        document.getElementById('productName').focus();
    } else {
        productForm.classList.add('was-validated');
    }
});

function updateProductTable() {
    const tbody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    products.forEach((product, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.productName}</td>
            <td>${product.productQuantity}</td>
            <td>₹${product.productRate.toFixed(2)}</td>
            <td>₹${product.tax.toFixed(2)} (${(product.taxRate * 100).toFixed(0)}%)</td>
            <td class="text-end">₹${product.totalWithTax.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editProduct(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    });

    updateTotals();
}

function editProduct(index) {
    const product = products[index];
    document.getElementById("productName").value = product.productName;
    document.getElementById("productQuantity").value = product.productQuantity;
    document.getElementById("productRate").value = product.productRate;
    document.getElementById("taxRate").value = product.taxRate;

    products.splice(index, 1);
    updateProductTable();
}

function deleteProduct(index) {
    products.splice(index, 1);
    updateProductTable();
}

function updateTotals() {
    let subtotal = 0;
    let totalTax = 0;

    products.forEach(product => {
        subtotal += product.totalWithTax;
        totalTax += product.tax;
    });

    const loyalPoints = subtotal * 0.01;

    document.getElementById("modalSubtotal").textContent = subtotal.toFixed(2);
    document.getElementById("modalTax").textContent = totalTax.toFixed(2);
    document.getElementById("modalLoyalPoints").textContent = loyalPoints.toFixed(2);
    document.getElementById("modalTotal").textContent = subtotal.toFixed(2);
}

function submitInvoice() {
    alert("Invoice submitted!");
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Invoice', 105, 15, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Customer: ${document.getElementById("modalFirstName").textContent} ${document.getElementById("modalLastName").textContent}`, 20, 30);
    doc.text(`Email: ${document.getElementById("modalEmail").textContent}`, 20, 40);
    doc.text(`Phone: ${document.getElementById("modalPhoneNumber").textContent}`, 20, 50);
    doc.text(`Address: ${document.getElementById("modalAddress").textContent}`, 20, 60);

    doc.setFontSize(14);
    doc.text('Products', 20, 80);
    let yPos = 90;
    doc.setFontSize(10);
    doc.text('Product', 20, yPos);
    doc.text('Quantity', 70, yPos);
    doc.text('Rate', 100, yPos);
    doc.text('Tax', 130, yPos);
    doc.text('Total', 160, yPos);
    yPos += 10;

    products.forEach(product => {
        doc.text(product.productName, 20, yPos);
        doc.text(product.productQuantity.toString(), 70, yPos);
        doc.text(`₹${product.productRate.toFixed(2)}`, 100, yPos);
        doc.text(`₹${product.tax.toFixed(2)}`, 130, yPos);
        doc.text(`₹${product.totalWithTax.toFixed(2)}`, 160, yPos);
        yPos += 10;
    });

    yPos += 10;
    doc.text(`Subtotal: ₹${document.getElementById("modalSubtotal").textContent}`, 130, yPos);
    yPos += 10;
    doc.text(`Tax: ₹${document.getElementById("modalTax").textContent}`, 130, yPos);
    yPos += 10;
    doc.text(`Loyal Points: ₹${document.getElementById("modalLoyalPoints").textContent}`, 130, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Total: ₹${document.getElementById("modalTotal").textContent}`, 130, yPos);

    doc.save('invoice.pdf');
}

document.getElementById("darkModeToggle").addEventListener("click", function () {
    document.body.classList.add("dark-mode");
});

document.getElementById("lightModeToggle").addEventListener("click", function () {
    document.body.classList.remove("dark-mode");
});

let currentFontSize = 1;
const fontSizeStep = 0.1;

document.getElementById("increaseFont").addEventListener("click", function () {
    currentFontSize += fontSizeStep;
    document.body.style.fontSize = `${currentFontSize}em`;
});

document.getElementById("decreaseFont").addEventListener("click", function () {
    currentFontSize = Math.max(currentFontSize - fontSizeStep, 0.5);
    document.body.style.fontSize = `${currentFontSize}em`;
});

(function () {
    'use strict'
    var forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
})()