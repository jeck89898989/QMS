// UI management for custom object builder
export const CustomUI = {
    
    clearBuilder() {
        document.getElementById('custom-object-builder').innerHTML = '';
        document.getElementById('custom-object-title').value = '';
        document.getElementById('custom-object-description').value = '';
        const checkedRadio = document.querySelector('input[name="create-object-type"]:checked');
        if (checkedRadio) checkedRadio.checked = false;
    }
};

