
const deleteCartItem = document.querySelectorAll(".cart-delete-btn")

deleteCartItem.forEach(element => {
    element.addEventListener('click', async (event) => {
        const foodId = element.dataset.item
        const deleteData = { foodId }
        try {
            const response = await fetch('/delete-cart-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deleteData)
                })
                const data = await response.json();
                
                if (data.status === 'success') {
                    alert(data.msg);
                    window.location.reload();
                }else{
                    alert(data.msg);
                }
        } catch (error) {
            console.log(error.message) 
        }
    })
})


function increment(btn) {
  const foodId = btn.parentElement.querySelector('input[name="foodId"]').getAttribute('value');
  let input = document.getElementById(foodId).value
  input = parseInt(input)+1

  let foodPrice = btn.parentElement.querySelector('input[name="foodPrice"]').getAttribute('value');
  
  if (foodId && foodPrice) {
    updateQtyInDb(btn, foodPrice, input, foodId, 1)
  }
}

function decrement(btn) {
  const foodId = btn.parentElement.querySelector('input[name="foodId"]').getAttribute('value');
  let input = document.getElementById(foodId).value
  input = parseInt(input)-1
  let foodPrice = btn.parentElement.querySelector('input[name="foodPrice"]').getAttribute('value');
  foodPrice = -1*foodPrice;

  if (foodId && foodPrice) {
    updateQtyInDb(btn, foodPrice, input, foodId, -1)
  }
}
  

async function updateQtyInDb(btn, foodPrice, qty, foodId, stat){
  try {
    const response = await fetch('/update-cart-data', {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({foodId, foodPrice, qty, stat})
    });
      const data = await response.json();

      if(data.status === "success"){
        const input = btn.parentElement.querySelector('input[type="number"]');
        input.value = data.items[0].quantity;
        const itemPrice = btn.parentElement.parentElement.querySelector('.total-price');
        itemPrice.innerText = data.items[0].total;
      }else if(data.removed === true){
        Swal.fire(
          'Removed!',
          'food removed from cart',
          'success'
        )
        setTimeout(()=>{
          location.reload();
        }, 1000)
      }else{
        throw new Error(data.msg)
      }
  } catch (error) {
    alert(error.message)
  }
}


async function checkOut(cart){
  try {
    if(cart){
      const response = await fetch("/authCheckout", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: cart,
      });
      
      const result = await response.json();
      console.log("Success:", result);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  

}







  // async function decrement(btn) {
  //   const input = btn.parentElement.querySelector('input[type="number"]');
  //   let foodId = btn.parentElement.querySelector('input[name="foodId"]').getAttribute('value');
  //   if (input && foodId) {
  //       //foodId = parseInt(foodId.value)
  //       let currentValue = parseInt(input.value);
  //     if (currentValue > 1) {
  //       currentValue--;
  //       input.value = currentValue;
  //       const value = await updateAmount(input, currentValue)
  //       updateQtyInDb(value[0], value[1], foodId, -1)
  //     }
  //   }
  // }
  

  //  async function updateAmount(input, currentValue){
  //   //alert(input)
  //   const itemContainer = input.closest('.cart-items-list');
  //   const orgPrice = itemContainer.querySelector('.org-price');
  //   const priceElement = itemContainer.querySelector('.item-price');
  //   const total = parseInt(orgPrice.innerHTML)*currentValue;
  //   priceElement.innerHTML = total
    
  //   return [orgPrice, currentValue]
  // }



  // try{
  //   alert("hello")
  //   const data = {currentValue, total}
  //   const response = await fetch ("/update-cart-data", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });
  //   const result = await response.json();
  //   alert(result)
  // } catch (error) {
  //   console.error("Error:", error);
  // }