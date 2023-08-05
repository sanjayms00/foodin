

document.getElementById('addressBook').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const addressData = {
            fullName: formData.get('fullName'),
            mobileNumber: formData.get('mobileNumber'),
            pinCode: formData.get('pinCode'),
            addressLine: formData.get('addressLine'),
            city: formData.get('city'),
            state: formData.get('state'),
            addressType: formData.get('addressType')
        };
    try {
        const response = await fetch('/save-address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
        });
        
        const data = await response.json();
        const alertDiv = document.getElementById('alertResult');
        
        if (data.status === 'success') { 
            alertDiv.classList.remove('alert-danger');
            alertDiv.classList.add('alert-success');
            alertDiv.classList.remove('d-none');
            alertDiv.innerText = data.msg;
            //page load
            setTimeout(()=>{
                        window.location = "http://localhost:3000/address-book"
                    },1000)
        } else {
            alertDiv.classList.remove('alert-success');
            alertDiv.classList.add('alert-danger');
            alertDiv.classList.remove('d-none');
            alertDiv.innerText = data.msg;
        }    
    }catch (error) {
        const alertDiv = document.getElementById('alertResult')
        alertDiv.classList.add("alert-danger")
        alertDiv.classList.remove("d-none")
        alertDiv.innerText = 'An error occurred. Please try again later.';
    }
});




const deleteCartItem = document.querySelectorAll(".delete-address")

deleteCartItem.forEach(element => {
    element.addEventListener('click', async (event) => {
        const address = element.dataset.address
        try {
            const response = await fetch('/delete-address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: address
                })
                const data = await response.json();
                // alert(JSON.stringify(data)); 
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

