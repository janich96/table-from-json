function loadJSON(callback) {   

    // получаем локальный JSON
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'data.json', true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            callback(xhr.responseText);
        }
    };

    xhr.send(null);  
}

function init() {
    loadJSON(function(response) {
        
        // преобразуем полученный локальный JSON
        let actual_JSON = JSON.parse(response);
        createTable(actual_JSON);
    });
}

function tableBody(table, obj) {

    // создаём тело таблицы
    for (let i = 0; i < obj.length; i++) {

        // создаём строки
        let row = table.insertRow();
        row.setAttribute('id', `row_${i}`);
        row.setAttribute('onmouseover', `editRow(${i})`);
        row.setAttribute('onmouseout', `cancelEditRow(${i})`);

        // создаём массив необходимых значений для каждой строки
        let array = [];
        array.push(obj[i].name.firstName, obj[i].name.lastName, obj[i].about, obj[i].eyeColor);

        for (let item of array) {

            // создаём ячейки
            let cell = row.insertCell();
            let text = document.createTextNode(item);

            // текст внтури ячейки оборачиваем в div,
            // чтобы было удобнее управлять размером
            let div = document.createElement('div');
            
            cell.appendChild(div);
            div.appendChild(text);
        }
    }
}

function tableHead(table) {

    // создаём шапку таблицы
    let head = ['Имя', 'Фамилия', 'Описание', 'Цвет глаз'];
    let tHead = table.createTHead();
    let row = tHead.insertRow();
    
    for (let i = 0; i < head.length; i++) {
        let th = document.createElement('th');
        let a = document.createElement('a');
        let text = document.createTextNode(head[i]);
        row.appendChild(th);
        th.appendChild(a);
        a.setAttribute('onclick', `sortTable(${i})`);
        a.appendChild(text);
    }
}

function createTable(obj) {

    // создаём таблицу
    const body = document.body;
    const table = document.createElement('table');
    body.appendChild(table);

    // сначала генерируем тело таблицы, а потом шапку, 
    // чтобы получить разграничение на thead и tbody бесплатно,
    // без создания лишних привязок
    tableBody(table, obj);
    tableHead(table);
}

// инициализируем программу
init();

function sortTable(n) {

    const table = document.getElementsByTagName('table');
    let switching = true;

    // устанавливаем сортировку по возрастанию
    let direction = 'ascending';
    let switchcount = 0;
    let rows, i, x, y, shouldSwitch;

    while (switching) {

        switching = false;
        rows = table[0].rows;

        // прогоняем цикл через все строки, кроме первой -
        // строки заголовков
        for (i = 1; i < (rows.length - 1); i++) {
            
            shouldSwitch = false;

            // берём две строки для сравнения: одна строка текущая,
            // другая - следующая
            x = rows[i].getElementsByTagName('td')[n];
            y = rows[i + 1].getElementsByTagName('td')[n];

            // в зависимости от направления сравнения (по возрастанию или по убыванию),
            // проверяем должны ли две строки поменяться местами
            if (direction === 'ascending') {

                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // если выражение истинно, отмечаем, что будет изменение, и выходим из цикла
                    shouldSwitch = true;
                    break;
                }
            } else if (direction === 'descending') {

                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // если выражение истинно, отмечаем, что будет изменение, и выходим из цикла
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            
            // делаем перестановку и отмечаем, что было изменение
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;

            // при каждом изменении прибавляем 1 к счётчику изменений
            switchcount++;

        } else {

            // если изменений не было и направление было по возрастанию,
            // то меняем направление на убывание и заново запускаем цикл while
            if (switchcount === 0 && direction === 'ascending') {
                direction = 'descending';
                switching = true;
            }
        }
    }
}

function editRow(num) {
    // при наведении курсора на строку создаём кнопку для 
    // вызова формы, в которой будем редактировать данную строку
    const table = document.getElementsByTagName('table');
    const rows = table[0].rows;
    const cell = rows[num + 1].insertCell();
    const div = document.createElement('div');
    const button = document.createElement('button');
    const text = document.createTextNode('Редактировать');

    cell.appendChild(div);
    div.appendChild(button);
    button.appendChild(text);
    cell.setAttribute('id', `btn_${num}`);
    button.setAttribute('class', `editBtn`);
    button.setAttribute('onclick', `editForm(${num})`);
}

function cancelEditRow(num) {
    // при отведении курсора от строки убираем кнопку для
    // вызова формы редактирования строки
    const el = document.getElementById(`btn_${num}`);
    el.parentNode.removeChild(el);
}

function editForm(num) {
    // создаём форму редактирования строки
    const body = document.body;
    const form = document.createElement('form');
    form.setAttribute('action', '#');
    form.setAttribute('method', 'GET');
    form.setAttribute('id', 'form');
    form.setAttribute('onsubmit', `changeForm(${num})`);

    // создаём поле "Имя"
    const name = document.createElement('input');
    name.setAttribute('type', 'text');
    name.setAttribute('name', 'name');
    name.setAttribute('id', 'inputName');
    name.setAttribute('placeholder', 'Имя');
    const labelName = document.createElement('label');
    labelName.setAttribute('for', 'name');
    const appendName = document.createTextNode('Имя');

    // создаём поле "Фамилия"
    const lastName = document.createElement('input');
    lastName.setAttribute('type', 'text');
    lastName.setAttribute('name', 'lastName');
    lastName.setAttribute('id', 'inputLastName');
    lastName.setAttribute('placeholder', 'Фамилия');
    const labelLastName = document.createElement('label');
    labelLastName.setAttribute('for', 'lastName');
    const appendLastName = document.createTextNode('Фамилия');

    // создаём поле "Описание"
    const about = document.createElement('textarea');
    about.setAttribute('name', 'about');
    about.setAttribute('id', 'inputAbout');
    about.setAttribute('placeholder', 'Описание');
    const labelAbout = document.createElement('label');
    labelAbout.setAttribute('for', 'about');
    const appendAbout = document.createTextNode('Описание');

    // создаём поле "Цвет глаз"
    const eyeColor = document.createElement('input');
    eyeColor.setAttribute('type', 'text');
    eyeColor.setAttribute('name', 'eyeColor');
    eyeColor.setAttribute('id', 'inputEyeColor');
    eyeColor.setAttribute('placeholder', 'Цвет глаз');
    const labelEyeColor = document.createElement('label');
    labelEyeColor.setAttribute('for', 'eyeColor');
    const appendEyeColor = document.createTextNode('Цвет глаз');

    // создаём кнопку "Применить"
    const apply = document.createElement('input');
    apply.setAttribute('class', 'applyBtn');
    apply.setAttribute('type', 'submit');
    apply.setAttribute('value', 'Применить');

    // создаём кнопку "Отменить"
    const cancel = document.createElement('button');
    cancel.setAttribute('class', 'cancelBtn');
    cancel.setAttribute('onclick', `cancelForm()`);
    const cancelText = document.createTextNode('Отмена');

    body.appendChild(form);

    form.appendChild(labelName);
    labelName.appendChild(appendName);
    form.appendChild(name);

    form.appendChild(labelLastName);
    labelLastName.appendChild(appendLastName);
    form.appendChild(lastName);

    form.appendChild(labelAbout);
    labelAbout.appendChild(appendAbout);
    form.appendChild(about);

    form.appendChild(labelEyeColor);
    labelEyeColor.appendChild(appendEyeColor);
    form.appendChild(eyeColor);

    form.appendChild(cancel);
    cancel.appendChild(cancelText);

    form.appendChild(apply);
}

function changeForm(num) {
    // функция, которая меняет значения из ячеек таблицы на значения из формы
    const table = document.getElementsByTagName('table');
    const row = table[0].rows[num + 1];

    // значения полей формы
    const name = document.getElementById('inputName').value;
    const lastName = document.getElementById('inputLastName').value;
    const about = document.getElementById('inputAbout').value;
    const eyeColor = document.getElementById('inputEyeColor').value;

    // значения ячеек таблицы
    const tableName = row.childNodes[0].childNodes[0];
    const tableLastName = row.childNodes[1].childNodes[0];
    const tableAbout = row.childNodes[2].childNodes[0];
    const tableEyeColor = row.childNodes[3].childNodes[0];

    // если поле заполнено, то вставляем его значение, если нет - 
    // то оставляем предыдущее значение
    if (name) {
        tableName.innerText = name;
    }

    if (lastName) {
        tableLastName.innerText = lastName;
    }

    if (about) {
        tableAbout.innerText = about;
    }
    
    if (eyeColor) {
        tableEyeColor.innerText = eyeColor;
    }

    cancelForm(row);
}

function cancelForm() {
    // убираем форму
    const body = document.body;
    const form = document.getElementById('form');
    body.removeChild(form);
}