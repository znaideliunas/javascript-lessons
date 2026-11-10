const warProArr = [];
const foundProArr = [];

const warehouseInput = document.querySelectorAll("#warehouseForm input");
const buttonWarehouse = document.querySelectorAll("#warehouseForm button");
const findInput = document.querySelector("#findId");
const findButton = document.querySelector("#findProduct");

const paragraphWarehouse = document.querySelector("#warehouseMessage");
const findParagraph = document.querySelector("#findMessage");

const warehouseTable = document.querySelector("#warehouseTable");
const warehouseTableBox = document.querySelector("#warehouseTableBox");
const warehouseEmpty = document.querySelector("#warehouseEmpty");

const foundTable = document.querySelector("#foundTable");
const foundTableBox = document.querySelector("#foundTableBox");
const foundEmpty = document.querySelector("#foundEmpty");

const idList = document.querySelector("#idList");


const savedWarehouse = JSON.parse(localStorage.getItem("warehouseList"));
const savedFound = JSON.parse(localStorage.getItem("foundList"));

if (Array.isArray(savedWarehouse)) warProArr.push(...savedWarehouse);
if (Array.isArray(savedFound)) foundProArr.push(...savedFound);

function saveData() {
    localStorage.setItem("warehouseList", JSON.stringify(warProArr));
    localStorage.setItem("foundList", JSON.stringify(foundProArr));
}


function findById(arr, id) {
    return arr.find(function (product) {
        return product.id === id;
    });
}


function renderTable(tbody, tableBox, emptyMessage, products) {
    tbody.innerHTML = "";

    products.forEach(function (product) {
        const row = document.createElement("tr");

        [product.id, product.name, product.quantity].forEach(function (value, i) {
            const cell = document.createElement("td");
            cell.textContent = value;
            Object.assign(cell.style, {
                padding: "7px 10px",
                textAlign: i === 1 ? "left" : "center",
                borderBottom: "1px solid #888"
            });
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    const hasData = products.length > 0;
    tableBox.hidden = !hasData;
    emptyMessage.hidden = hasData;
}

function displayWarehouse() {
    renderTable(warehouseTable, warehouseTableBox, warehouseEmpty, warProArr);


    idList.innerHTML = "";
    warProArr.forEach(function (product) {
        const option = document.createElement("option");
        option.value = product.id;
        option.label = product.name;
        idList.appendChild(option);
    });
}

function displayFound() {
    renderTable(foundTable, foundTableBox, foundEmpty, foundProArr);
}


function digitsOnly(input) {
    input.addEventListener("input", function () {
        input.value = input.value.replace(/\D/g, "");
    });
}

digitsOnly(warehouseInput[0]);
digitsOnly(findInput);

let autoFilled = false;

warehouseInput[0].addEventListener("input", function () {
    const found = findById(warProArr, warehouseInput[0].value.trim());

    if (found) {
        warehouseInput[1].value = found.name;
        warehouseInput[2].value = found.quantity;
        autoFilled = true;
    } else if (autoFilled) {
        warehouseInput[1].value = "";
        warehouseInput[2].value = "";
        autoFilled = false;
    }
});

buttonWarehouse.forEach(function (button) {
    button.addEventListener("click", function () {
        const productId = warehouseInput[0].value.trim();
        const productName = warehouseInput[1].value.trim();
        const productQuantity = warehouseInput[2].value.trim();

        if (button.id === "addProduct") {
            if (productId === "" || productName === "" || productQuantity === "") {
                paragraphWarehouse.textContent = "Please fill in all fields!";
            } else if (findById(warProArr, productId)) {
                paragraphWarehouse.textContent = "This product already exists!";
            } else if (Number(productQuantity) <= 0) {
                paragraphWarehouse.textContent = "Quantity must be greater than zero!";
            } else {
                warProArr.push({
                    id: productId,
                    name: productName,
                    quantity: Number(productQuantity)
                });
                saveData();
                displayWarehouse();
                paragraphWarehouse.textContent = "Product added successfully!";
            }
        }

        else if (button.id === "editProduct") {
            const found = findById(warProArr, productId);

            if (!found) {
                paragraphWarehouse.textContent = "Product not found!";
            } else if (productName === "" || productQuantity === "") {
                paragraphWarehouse.textContent = "Enter a new name and quantity!";
            } else if (Number(productQuantity) <= 0) {
                paragraphWarehouse.textContent = "Quantity must be greater than zero!";
            } else {
                found.name = productName;
                found.quantity = Number(productQuantity);

                const inFound = findById(foundProArr, productId);
                if (inFound) {
                    inFound.name = productName;
                    inFound.quantity = Number(productQuantity);
                }

                saveData();
                displayWarehouse();
                displayFound();
                paragraphWarehouse.textContent = "Product updated successfully!";
            }
        }

        else if (button.id === "deleteProduct") {
            const index = warProArr.findIndex(function (product) {
                return product.id === productId;
            });

            if (index === -1) {
                paragraphWarehouse.textContent = "Product not found!";
            } else {
                warProArr.splice(index, 1);

                const foundIndex = foundProArr.findIndex(function (product) {
                    return product.id === productId;
                });
                if (foundIndex !== -1) foundProArr.splice(foundIndex, 1);

                saveData();
                displayWarehouse();
                displayFound();

                warehouseInput[0].value = "";
                warehouseInput[1].value = "";
                warehouseInput[2].value = "";
                autoFilled = false;

                paragraphWarehouse.textContent = "Product deleted successfully!";
            }
        }
    });
});
findButton.addEventListener("click", function () {
    const findId = findInput.value.trim();

    if (findId === "") {
        findParagraph.textContent = "Please enter a product code!";
        return;
    }

    const found = findById(warProArr, findId);

    if (!found) {
        findParagraph.textContent = "Product not found!";
    } else if (findById(foundProArr, findId)) {
        findParagraph.textContent = "Product is already in the table!";
    } else {
        foundProArr.push({
            id: found.id,
            name: found.name,
            quantity: found.quantity
        });
        saveData();
        displayFound();
        findParagraph.textContent = "Product found!";
    }
});

function style(selector, styles) {
    document.querySelectorAll(selector).forEach(function (el) {
        Object.assign(el.style, styles);
    });
}

function applyStyles() {
    style("body", {
        margin: "0",
        padding: "24px",
        minHeight: "100vh",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        color: "#444",
        background: "linear-gradient(120deg, #8fd3fe 0%, #f3c4e8 45%, #fdb0b5 70%, #ff5555 100%)",
        backgroundAttachment: "fixed"
    });

    style("h1", {
        textAlign: "center",
        color: "#7b8aa6",
        margin: "0 0 32px"
    });

    style("h2", {
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "500",
        color: "#666",
        margin: "0 0 16px"
    });

    style(".layout", {
        display: "grid",
        maxWidth: "1100px",
        margin: "0 auto"
    });

    style("form", {
        display: "grid",
        gap: "6px"
    });

    style("label", {
        fontSize: "13px",
        color: "#555",
        marginTop: "10px"
    });

    style("input", {
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        border: "none",
        borderRadius: "6px",
        background: "#fff",
        fontSize: "15px"
    });

    style(".buttons", {
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "16px"
    });

    style(".buttons.center", { justifyContent: "center" });

    style("button", {
        padding: "8px 18px",
        border: "none",
        borderRadius: "6px",
        background: "#6b7280",
        color: "#fff",
        fontSize: "13px",
        cursor: "pointer"
    });

    // hover effect for buttons
    document.querySelectorAll("button").forEach(function (button) {
        button.addEventListener("mouseenter", function () {
            button.style.background = "#4b5563";
        });
        button.addEventListener("mouseleave", function () {
            button.style.background = "#6b7280";
        });
    });

    style(".message", {
        minHeight: "22px",
        margin: "14px 0",
        fontWeight: "600",
        textAlign: "center"
    });

    style(".empty", { textAlign: "center", color: "#555" });

    style(".table-wrap", { overflowX: "auto", marginTop: "16px" });

    style("table", {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px"
    });

    style("th", {
        padding: "7px 10px",
        textAlign: "center",
        borderBottom: "2px solid #777"
    });
}
function applyResponsive() {
    const small = window.innerWidth <= 800;

    style(".layout", {
        gridTemplateColumns: small ? "1fr" : "1fr 1fr",
        gap: small ? "32px" : "40px"
    });

    style("h1", { fontSize: small ? "22px" : "30px" });
}

window.addEventListener("resize", applyResponsive);

applyStyles();
applyResponsive();

displayWarehouse();
displayFound();