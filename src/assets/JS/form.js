function plusElement1() {
    document.getElementById('plus1').insertAdjacentHTML('beforebegin',`
    <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label">Description</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="2" name="description"></textarea>
            <button type="button" onclick="hapusElement(this)" class="btn">
                <i class="bi bi-dash-circle"></i></button>
        </div>`
)}

function plusElement2() {
    document.getElementById('plus2').insertAdjacentHTML('beforebegin',`
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Technology</label>
                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="" name="tech">
            <button type="button" onclick="hapusElement(this)" class="btn">
                <i class="bi bi-dash-circle"></i></button>
        </div>`
)}

function plusElement3() {
    document.getElementById('plus3').insertAdjacentHTML('beforebegin',`<div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Technology</label>
                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="" name="tech">
                <button type="button" onclick="hapusElement(this)" class="btn">
                <i class="bi bi-dash-circle"></i></button>
            </div>`
        )}

//hapus parent tempat tombol berada
function hapusElement(button) {
    button.parentElement.remove(); 
}

