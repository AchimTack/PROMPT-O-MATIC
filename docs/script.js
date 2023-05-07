function updateTextField(parent, data) {
    console.log("updateTextField called with parent:", parent, "and data:", data);
    var selectedCategory = document.getElementById("categories").value;
    var result = "ROLE: " + selectedCategory + "\n";
    Array.from(parent.querySelectorAll(".subcategory")).forEach(function (subcategoryLabel) {
        var subcategoryId = subcategoryLabel.getAttribute("data-subcategory-id");
        var subcategorySelect = document.getElementById(subcategoryId);
        result += subcategoryLabel.innerText + " " + subcategorySelect.value + "";
    });
    var behaviour = data[selectedCategory]["Behaviour"];
    if (behaviour) {
        result += "\n\nBehaviour:\n" + behaviour + "\n";
    }
    var inputField = document.getElementById("inputField");
    result += "\nTASK: \n" + inputField.value + "\n";

    document.getElementById("result").value = result;
}

function createDropdowns(data, parent) {
    var categoryLabel = document.createElement("label");
    categoryLabel.innerText = "ROLE:";
    categoryLabel.className = "form-label fw-bold";
    parent.appendChild(categoryLabel);
    var categorySelect = document.createElement("select");
    categorySelect.id = "categories";
    parent.appendChild(categorySelect);
    var initialOption = document.createElement("option");
    initialOption.value = "";
    initialOption.innerText = "Please select";
    initialOption.selected = true;
    initialOption.disabled = true;
    categorySelect.appendChild(initialOption);
    Object.keys(data).forEach(function (categoryKey) {
        var option = document.createElement("option");
        option.value = categoryKey;
        option.innerText = categoryKey;
        categorySelect.appendChild(option);
    });
    categorySelect.addEventListener("change", function () {
        var selectedCategory = categorySelect.options[categorySelect.selectedIndex].value;
        var subcategories = data[selectedCategory];
        parent.innerHTML = "";
        parent.appendChild(categoryLabel);
        parent.appendChild(categorySelect);
        Object.keys(subcategories).forEach(function (subcategoryKey) {
            if (subcategoryKey !== "Behaviour") {
                var subcategoryLabel = document.createElement("label");
                subcategoryLabel.innerText = "\n" + subcategoryKey + ": ";
                subcategoryLabel.className = "subcategory";
                subcategoryLabel.setAttribute("data-subcategory-id", subcategoryKey);
                parent.appendChild(subcategoryLabel);
                var subcategorySelect = document.createElement("select");
                subcategorySelect.id = subcategoryKey;
                parent.appendChild(subcategorySelect);
                if (typeof subcategories[subcategoryKey] === "object") {
                    Object.keys(subcategories[subcategoryKey]).forEach(function (optionKey) {
                        var option = document.createElement("option");
                        option.value = optionKey;
                        option.innerText = optionKey;
                        subcategorySelect.appendChild(option);
                    });
                    subcategorySelect.addEventListener("change", function () {
                        updateTextField(parent, data);
                    });
                }
            }
        });
        updateTextField(parent, data);
    });
}

function addInputFieldEventListener(data) {
    var inputField = document.getElementById("inputField");
    inputField.addEventListener("input", function () {
        var dropdowns = document.getElementById("dropdowns");
        updateTextField(dropdowns, data);
    });
}

var xhr = new XMLHttpRequest();
xhr.open("GET", "prompts.json");
xhr.onload = function () {
    if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var parent = document.getElementById("dropdowns");
        createDropdowns(data, parent);
        addInputFieldEventListener(data);
    }
};
xhr.send();


function copyToClipboard() {
  var resultField = document.getElementById("result");
  resultField.select();
  resultField.setSelectionRange(0, 99999);
  document.execCommand("copy");
  window.open("https://chat.openai.com/", "_blank");
}

