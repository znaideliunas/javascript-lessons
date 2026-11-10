const warProArr = [];
const cartProArr = [];

const selecting = document.querySelector("#warehouseForm");
const selectingTheCarts = document.querySelector("#cartTable");

const warehouseInput = document.querySelectorAll("#warehouseForm input");
const cartInput = document.querySelectorAll("#cartTable input");

const buttonWarehouse = document.querySelectorAll("#warehouseForm button");
const cartButtons = document.querySelectorAll("#cartTable button");

const paragraphWarehouse = document.querySelector("#warehouseMessage");
const productParagraph = document.querySelector("#cartMessage");

warehouseInput.forEach(function(button) {
    button.addEventListener("click", function()
        if (button.id === "#addProduct") {
    }
    else if (button.id === "#searchProduct") {
    }
    else if (button.id === "#editProduct") {
}
else if (button.id === "#deleteProduct") {
}
)})