
async function addToCart(foodData, auth){
    const btn = document.getElementById('addToCart');
    if(auth === 'false'){
        Toastify({
            text: "login to acccount",
            className: "info",
            style: {
                background: "linear-gradient(to right, #ff0000, #dd2a7f)",
            }
            }).showToast();
            setTimeout(()=>{
                window.location = "http://localhost:3000/login"
            },1000)
    }else if(auth === "true"){
        try {
            btn.innerText = "Adding to cart..."
            const response = await fetch('/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: foodData
            });
            
            const data = await response.json();
            //alert(JSON.stringify(data)); 
            const alertDiv = document.getElementById('alertResult');
            
            if (data.status === 'success') { 
                if(data.length){
                    document.getElementById('cartCounter').innerText = data.length
                }
                setTimeout(()=>{
                    btn.innerText = "Add to Cart"
                },500)
                Toastify({
                    text: data.msg,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #0b7303, #24c9a3)",
                    }
                    }).showToast();
            }
            else if (data.status === "blocked"){
                Toastify({
                    text: data.msg,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                    }
                    }).showToast();
                setTimeout(() => {
                    window.location.href = "/logout"
                }, 800);
            }
            else if (data.status === "no-user"){
                window.location.href = "/login"
            } 
            else {
                Toastify({
                    text: data.msg,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                    }
                    }).showToast();
            }
        }catch (error) {
            Toastify({
                text: error.message,
                className: "info",
                style: {
                    background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                }
                }).showToast();
        }
    }
}






