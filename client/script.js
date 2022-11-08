let
    selectedCheckbox,
    submitButton = document.getElementById("submit_button");

function checkXY(input) {
    let y = input.value.trim().replace(",", ".")
    if (y === "") {
        input.setCustomValidity("Введите значение")
        return false
    } else if (!isFinite(+y)) {
        input.setCustomValidity("Значение должно быть конечным")
        return false
    } else if (+y <= -5 || +y >= 3) {
        input.setCustomValidity("Значение должно входить в диапазон (-5 ... 3)")
        return false
    }
    updateSubmitButton(true)
    return true
}

function changeR(element) {
    if (element.checked) {
        if (selectedCheckbox !== undefined) {
            selectedCheckbox.checked = false
        }
        selectedCheckbox = element
    }
    else {
        selectedCheckbox = undefined
    }
    updateSubmitButton();
}

function updateSubmitButton(xyIsCheckedAndCorrect = false) {
    if (submitButton === undefined) {
        submitButton = document.getElementById("submit_button");
    } else {
        // check x, y, z
        submitButton.disabled = !(
            selectedCheckbox !== undefined
            && (xyIsCheckedAndCorrect || checkXY(document.getElementById('X')))
            && (xyIsCheckedAndCorrect || checkXY(document.getElementById('Y')))
        );
    }
}

document.getElementById("values_selection").addEventListener("submit", e => {
    e.preventDefault(); // prevent submitting
    let xValue = document.getElementById("X").value.replace(',', '.'),
        yValue = document.getElementById("Y").value.replace(',', '.'),
        rValue = selectedCheckbox.value;
    console.log(`x = ${xValue}, y = ${yValue}, r = ${rValue}`);
    let xhr = new XMLHttpRequest();
    xhr.onloadend = () => {
        if (xhr.status === 200) {
            document.getElementById("results_table").innerHTML = xhr.response;
        } else console.log("status: ", xhr.status)
    };
    xhr.open("GET", "server/server.php?x=" + xValue + "&y=" + yValue + "&r=" + rValue);
    xhr.send();
})

document.getElementById("clear_button").addEventListener("click", e => {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.onloadend = () => {
        if (xhr.status === 200) {
            document.getElementById("results_table").innerHTML = xhr.response;
        } else console.log("status: ", xhr.status)
    };
    xhr.open("POST", "server/clear.php");
    xhr.send();
})

window.onload = function () {
    let xhr = new XMLHttpRequest();
    xhr.onloadend = () => {
        if (xhr.status === 200) {
            document.getElementById("results_table").innerHTML = xhr.response;
        } else console.log("status: ", xhr.status)
    };
    xhr.open("GET", "server/onload.php");
    xhr.send();
}
