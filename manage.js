/**********************
 MANAGE PRODUCT (KIP + STOCK)
**********************/

let products = JSON.parse(localStorage.getItem("products") || "[]");
const menuBox = document.getElementById("manageMenu");

/* =====================
   INIT DATA (รองรับของเก่า)
===================== */
products.forEach(p => {
  if (typeof p.stockIn !== "number") {
    p.stockIn = p.stock || 0;
    p.sold = p.sold || 0;
    delete p.stock;
  }
});
saveProducts();

/* =====================
   RENDER
===================== */
function renderManage(){
  menuBox.innerHTML = "";

  products.forEach((p, index)=>{
    const remain = p.stockIn - p.sold;

    const div = document.createElement("div");
    div.className = "manage-card";

    div.innerHTML = `
      <img src="${p.img || ''}">

      <!-- NAME -->
      <input 
        value="${p.name || ''}" 
        placeholder="ຊື່ສິນຄ້າ"
        onchange="updateField(${index}, 'name', this.value)">

      <!-- CATEGORY -->
      <input 
        value="${p.category || ''}" 
        placeholder="📂 ໝວດສິນຄ້າ"
        onchange="updateField(${index}, 'category', this.value)">

      <!-- PRICE -->
      <input 
        type="number" 
        value="${p.price || 0}"
        placeholder="ລາຄາ (ກີບ)"
        onchange="updateField(${index}, 'price', this.value)">

      <!-- STOCK CONTROL -->
      <div class="stock-control">
        <button onclick="changeStock(${index}, -1)">➖</button>
        <b>${remain}</b>
        <button onclick="changeStock(${index}, 1)">➕</button>
      </div>

      <!-- INPUT STOCK -->
      <input 
        type="number"
        min="0"
        value="${p.stockIn}"
        placeholder="📦 Stock ເຂົ້າ"
        onchange="setStockIn(${index}, this.value)"
      >

      <small>
        📦 Stock ເຂົ້າ: ${p.stockIn} |
        🔥 ຂາຍ: ${p.sold}
      </small>

      <button style="background:#ff9800;color:#000"
        onclick="clearStockHistory(${index})">
        🔄 ລ້າງປະຫວັດ Stock
      </button>

      <button class="btn-delete"
        onclick="deleteProduct(${index})">
        🗑 ລົບສິນຄ້າ
      </button>
    `;
    menuBox.appendChild(div);
  });
}

renderManage();

/* =====================
   UPDATE FIELD
===================== */
function updateField(index, field, value){
  if(field === "price"){
    value = Number(value) || 0;
  }
  products[index][field] = value;
  saveProducts();
}

/* =====================
   STOCK + / -
===================== */
function changeStock(index, qty){
  const p = products[index];

  if(qty < 0 && (p.stockIn - p.sold) <= 0){
    alert("❌ Stock ໝົດແລ້ວ");
    return;
  }

  if(qty > 0){
    p.stockIn++;
  }else{
    p.sold++;
  }

  saveProducts();
  renderManage();
}

/* =====================
   SET STOCK BY INPUT
===================== */
function setStockIn(index, value){
  value = Number(value) || 0;
  if(value < 0) value = 0;

  products[index].stockIn = value;

  if(products[index].sold > value){
    products[index].sold = 0;
  }

  saveProducts();
  renderManage();
}

/* =====================
   CLEAR STOCK
===================== */
function clearStockHistory(index){
  if(!confirm("ລ້າງປະຫວັດ Stock ສິນຄ້ານີ້ ?")) return;
  products[index].sold = 0;
  saveProducts();
  renderManage();
}

function clearAllStockHistory(){
  if(!confirm("ລ້າງ Stock ທັງຮ້ານ ?")) return;
  products.forEach(p => p.sold = 0);
  saveProducts();
  renderManage();
}

/* =====================
   DELETE
===================== */
function deleteProduct(index){
  if(!confirm("ລົບສິນຄ້ານີ້ ?")) return;
  products.splice(index,1);
  saveProducts();
  renderManage();
}

/* =====================
   SAVE
===================== */
function saveProducts(){
  localStorage.setItem("products", JSON.stringify(products));
}