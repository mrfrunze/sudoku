window.onload = function(){
    const config = {
        size : 750,
        difficult : {
            "light" : 98,
            "low" : 50,
            "height" : 30
        }
    }
    
        //Замена в строке на подстроку
        // первый аргументпозиция элемента с которого начать
        // второй аргумент это вставить replacement на поз index
        String.prototype.replaceAt = function(index, replacement) {
            //  берем то что слева и то что српава и конкатенируем
            return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
        }
    
        function getRandomNum(min, max){
            return Math.floor(Math.random() * (max + 1 - min)+min);
        }
    
        function transposing(sudoku){
            return sudoku[0].map((col, i) => sudoku.map(row => row[i]))
        }
    
        // меняем строки местами
        function swap_rows(sudoku){
            // console.log(sudoku);
            // определяем первую строку
            let n1 = getRandomNum(0, 8);
            // вторая строка
            let n2 = 0;
            //Генерируется индекс строки основываясь на правилах построения судоку
            if(n1 < 3) n2 = getRandomNum(0, 2)
            else if(n1 < 6) n2 = getRandomNum(3, 5);
            else n2 = getRandomNum(6, 8);
            
            for(let i = 0;i < sudoku.length;i++){
                let tmp = sudoku[n2][i];
                sudoku[n2][i] = sudoku[n1][i];
                sudoku[n1][i] = tmp;
            }
            return sudoku;
        }
        
        // меняем стролбцы местами
        function swap_cols(sudoku){
            sudoku = transposing(sudoku);
            swap_rows(sudoku);
            sudoku = transposing(sudoku);
            return sudoku
        }
        function parseToStr(sudoku){
            let str = "";
            for(let i=0; i < sudoku.length; i++){
                for(let j=0; j < sudoku.length; j++){
                    str += sudoku[i][j];
                } 
            }
            return str;
        }
        // len сколько раз перемешать
        function mixSudoku(sudoku, len){
            for(let i= 0; i < len; i++){
                //с 70% шансов мешать строки
                if(getRandomNum(1, 10) < 8){
                    sudoku = swap_rows(sudoku);
                }else{
                //с 30% шансов мешать колонки
                    sudoku = swap_cols(sudoku)
                }
            }
            return sudoku;
        }    

    let myBody = [];
    let initString = "";

    
    

    let btn = document.querySelectorAll(".btn");
    // console.log(btn);

    btn.forEach(function(e){
        
        for(let i = 0; i < btn.length; i++){
            e.addEventListener('click', clickHandler, false);
        }
    });
    
    function clickHandler(e, first = false){
        let sudoku = [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [4, 5, 6, 7, 8, 9, 1, 2, 3],
                [7, 8, 9, 1, 2, 3, 4, 5, 6],
                [2, 3, 4, 5, 6, 7, 8, 9, 1],
                [5, 6, 7, 8, 9, 1, 2, 3, 4],
                [8, 9, 1, 2, 3, 4, 5, 6, 7],
                [3, 4, 5, 6, 7, 8, 9, 1, 2],
                [6, 7, 8, 9, 1, 2, 3, 4, 5],
                [9, 1, 2, 3, 4, 5, 6, 7, 8]
            ];

        sudoku = mixSudoku(sudoku, 200); //200 раз рандомно пермишать перемешать

        sudoku = parseToStr(sudoku); //Перевод из массива в строку 

        let target;
        let coef; // коофициент заданого %
        if (first) target = "light"
        else target = e.target.dataset.btn;

        if (target == "restart") {
            generateMyBody();
            return true;
        }

        coef = config.difficult[target]; // обращаемся в config
        let n = Math.floor(81 * ((100 - coef) * 0.01)); // n - сколкь ячеек занулить 100 - 30 * 0.01 = 0.7 0.7 * 81 = 56

        let nums = [];
        // заполняем от 0 до 81
        for (let j = 0; j < 81; j++) nums[j] = j;

        let dx = 0;
        // проход по сегментам
        for (let j = 0; j < n; j++) {
            // делим на три сегмента верхний средний нижний
            dx = dx % 9;
            // параметр 
            // let n1 = 100;
            //  найти число котрое находится в верхних 3-х сегментах
            while (true) {
                // ф-ция принимает мин и макс
                let num = (getRandomNum(dx, dx + 2) * 9) + getRandomNum(0, 8);
                // nums - массив индексов 
                // проверяем лижит ли сгенерированное число в массиве nums
                // indexOf(num) - возвращает позицию в nums
                if (sudoku[num] != "0") {
                    //  модифицируем наш sudoku
                    // replaceAt - первым параметром передает позицию с которой нужно начать модификацию второй параметр 0
                    // таким образом мы заменяем число на ноль
                    sudoku = sudoku.replaceAt(num, "0");
                    // в массиве [num] - мы его зануляем и повторно использовать не можем
                    nums[num] = 0;
                    break;
                }
                // n1--;
            }
            dx += 3;
        }
        initString = sudoku;
        generateMyBody();
    }
    // вызываем сиксивенно первый клик
    clickHandler(document.querySelector(".btn-1"), true)
   
    function generateMyBody() {

        let  startValue = initString
                .split('')
                .filter(x => '0123456789'.includes(x))
                // шаг 21 превратим в цифры 
                .map(x => Number(x))
                console.log(startValue);

        
        myBody = [];
    
        let idCounter = 1;
        for(let y = 0; y<9; y++){
            for(let x=0; x<9; x++){
                myBody.push({
                    id: idCounter,
                    x:x,
                    y:y,
                    number: startValue[idCounter -1], // отнимаем чтобы взять первую ячейку п позиции 0 
                    // шаг 9 добавим классы для ячеек с фокусом и без
                    selected: false,
                    supported: false,
                    // шаг 27 добавим поле не важно 
                    important: false,
                    // шаг 35
                    error: false,
                    // шаг 24  поле начала ячейки - является ли это поле началом ? startValue[idCounter -1]
                    started: startValue[idCounter -1] === 0 ? false : true,
                    s: parseInt(y / 3) * 3 + parseInt(x / 3)
                })
                idCounter++;
            }
            // console.log(myBody);
        }
        
        getHtml(config.size);
    }


    // Создадим ф-ции быстрого доступа к ячейкам и строка
    function getRow(n){
        let row = [];

        for(let i = 0; i < 9; i++){ 
            row.push(myBody[9 * n + i]); 
        }

        return row;

    }

    function getColum(n){
        let column = [];
        for (let i = 0; i < 9; i++) {
            column.push(myBody[i * 9 + n]);
        }

        return column;
    }


    function getSegment(n){
        let segment = [];

        // находми координаты x нашего сегмента
        let x = n % 3;
        // находми координаты y нашего сегмента
        let y = parseInt(n / 3);
        for (let dy = 0; dy < 3; dy++) {
            for (let dx = 0; dx < 3; dx++) {
                segment.push(myBody[
                    y * 27 + dy * 9 + x * 3 + dx
                ]);
                
            }
            
        }
        return segment;
    }

    // шаг 8 создаем ф-ции keydownHandler focusHandler blurHandler
    function keydownHandler(event, cell){
        // шаг 26 проверим если ячейка не started
        if(!cell.started){
            // шаг 15 - сделаем так что бы можно было вводить только один символ цифру!
            // console.log(event.key)
            //  сравниваем если это не одно из чисел
            if("0123456789".includes(event.key)){
                cell.number = parseInt(event.key)

                // шаг 38 удалим error со всх ячеек
                if(cell.error){
                    for(let item of myBody){
                        item.error = false
                    }
                }

                // шаг 34 сделаем невозможным повтор одинаковых цифр в одном сегменте
                // добавим в свойствах объекта error
                //  пройдем по строкам
                for(let item of getRow(cell.y)){
                    if(item === cell){
                        continue
                    }

                    if(item.number === cell.number){
                        item.error = true
                        cell.error = true
                    }
                }
                //  тожу самое для ячеек
                for(let item of getColum(cell.x)){
                    if(item === cell){
                        continue
                    }

                    if(item.number === cell.number){
                        item.error = true
                        cell.error = true
                    }
                }

                //  тожу самое для сегмента
                for(let item of getSegment(cell.s)){
                    if(item === cell){
                        continue
                    }

                    if(item.number === cell.number){
                        item.error = true
                        cell.error = true
                    }
                }
            }

            else if(["Backspace", "Delete"].includes(event.key)){
                cell.number = 0;

                // шаг 28 пройдемся по всем ячейкам и уберем important
                for(let item of myBody){
                    item.important = false;
                }

                if(cell.number){
                    for(let item of myBody){
                        // если совпадает то делаем true
                        if(item.number === cell.number){
                            item.important = true
                        }
                        
                    }
                }

            }

        }

        event.preventDefault(); // отменяет все дейсвия
        veiwUpdate();
    }

    function focusHandler(event, cell){
        // console.log("focusHandler", event, cell)
        cell.selected = true;
        // шаг 11 проходим по всем срокам 
        for(let item of getRow(cell.y)){
            item.supported = true;
        }

        // шаг 12 проходим по всем колонкам
        for(let item of getColum(cell.x)){
            item.supported = true;
        }

         // шаг 33 проходим по всем ячейкам
        if(cell.number){
            for(let item of myBody){
            if(item.number === cell.number){
                item.important = true;
            }
            }
        }
        veiwUpdate();
    }

    function blurHandler(event, cell){
        // console.log("blurHandler", event, cell)
         // шаг 14 ставим false
         cell.selected = false;
        
        // шаг 32 так как мы проходим по всем ячейкам можно удалить два цикла for
        // for(let item of getRow(cell.y)){
        //     item.supported = false
        // }

        // for(let item of getColum(cell.x)){
        //     item.supported = false
        // }

         // шаг 37 удалим error полсе снятия фокуса
        if(cell.error){
            cell.number = 0;
        }

         // шаг 31 обходим все ячейки
        for(let cell of myBody){
            cell.important = false
            cell.supported = false
            cell.error = false
        }
        //Проверка на победу
        let win = true;
        for (let item of myBody) {
            if (item.number == 0) win = false;
        }
        if (win && !cell.error) alert("Победа!!!");
        veiwUpdate();
    }

    function getHtml(size){
        let app = document.querySelector("#app").innerHTML = "";
        // шаг 6 создадим инпуты
        // item - элемент массива
        for(let item of myBody){
            let imputElement = document.createElement('input')
            imputElement.classList.add("sudoku-cell");
            imputElement.setAttribute('type', 'text');
            
            // шаг 7 прослушаем нашу ячейку
            //  нам нужен keydown focus blur 
            imputElement.addEventListener('keydown', event => keydownHandler(event, item));
            imputElement.addEventListener('focus', event => focusHandler(event, item));
            imputElement.addEventListener('blur', event => blurHandler(event, item));

            // шаг 25 проверим если ячейка started добавляем класс
            if(item.started){
                imputElement.classList.add("start-cell")
            }

            item.element = imputElement;
        }

        let div = document.createElement("div")
        // console.log(div)
        div.classList.add("sudoku-game");
        div.style.width = `${size}px`;
        div.style.height = `${size}px`;
        div.style["font-size"] = `${size/20}px`;

        app = document.querySelector("#app").append(div);
        
        // шаг 4 создаем 9 сегментов 
        for (let s = 0; s < 9; s++) {
            let segmentElement = document.createElement('div')
            segmentElement.classList.add("sudoku-segment");

            // шаг 6 пройдемся по ячейкам сегметна
            // cell - клетка судоку
            for(let cell of getSegment(s)){
                segmentElement.append(cell.element);
            }
            
            div.append(segmentElement);
        }

        div = myBody;
    
        // шаг 22 отобразим содержимое ячеек содержимое
        veiwUpdate();

        return div;

    }

    function veiwUpdate(){
        // шаг 13 проходим по всем ячейкам
        for(let cell of myBody){
            // шаг 30 удалим класс important-cell у всех ячеек
            // шаг 35 удалим класс error
            cell.element.classList.remove("error", "important-cell", "supported-cell", "selected-cell")
            // шаг 16 
            cell.element.value = cell.number ? cell.number : ''
           

            // добавим условия елси ячейка supported
            if(cell.supported){
                cell.element.classList.add("supported-cell")
            }

            if(cell.selected){
                cell.element.classList.add("selected-cell")
            }

             // шаг 29 добавим класс 
            if(cell.important){
                 cell.element.classList.add("important-cell")
             }

              // шаг 36
            if(cell.error){
                cell.element.classList.add("error")
            }
        }
    }

}

