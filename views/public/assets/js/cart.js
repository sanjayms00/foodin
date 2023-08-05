
async function addToCart(auth, foodData){


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
    }else{
        try {
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
                Swal.fire(
                    data.status,
                    data.msg,
                    'success'
                    )
                setTimeout(()=>{
                    window.location = "http://localhost:3000/cart"
                },1000)
            }else if (data.status === "no-user"){
                window.location = "http://localhost:3000/login"
            } else {
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






