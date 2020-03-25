window.onload = function(){
    
    let initString =    `
                            0 0 0  0 0 0  0 0 0 
                            0 0 0  0 0 0  0 0 0
                            0 0 0  0 0 0  0 0 0
                            0 0 0  0 0 0  0 0 0 
                            0 0 0  0 0 0  0 0 0
                            0 0 0  0 0 0  0 0 0
                            0 0 0  0 0 0  0 0 0 
                            0 0 0  0 0 0  0 0 0
                            0 0 0  0 0 0  0 0 0
                        `;


    let btn = document.querySelectorAll(".btn");
    console.log(btn);

    let btnElemnets =  btn.forEach(function(e){
        
        for(let i = 0; i < btn.length; i++){
            e.addEventListener('click', clickHandler, false);
        }
    });
    
    function clickHandler(e){
            document.querySelector('#a8').value = 9;
            console.log(e.target.dataset);
            let target = e.target.dataset

            if(target = 'light'){
                initString =
                                `
                                    5 0 3  0 0 4  6 7 0 
                                    0 9 0  2 5 0  8 3 1
                                    0 0 2  6 0 3  0 0 9
                                    0 2 0  3 7 0  0 1 5 
                                    0 0 8  0 2 0  7 6 0
                                    3 0 0  5 6 0  0 0 0
                                    4 6 0  0 0 0  1 0 7 
                                    2 8 1  0 4 0  0 0 0
                                    0 0 5  0 9 0  0 8 0
                                `
            }
            if(e.target.dataset = 'low'){
                initString = `
                            5 6 3  9 7 4  6 7 8 
                            0 9 0  2 5 0  8 3 1
                            8 0 2  6 0 3  5 0 9
                            9 2 0  3 7 0  0 1 5 
                            0 0 8  0 2 0  7 6 0
                            3 0 0  5 6 0  4 0 0
                            4 6 0  0 0 0  1 0 7 
                            2 8 1  0 4 0  0 0 0
                            0 0 5  0 9 0  0 8 0
                        `;
            }
            if(e.target.dataset = 'height'){
                initString = `
                                5 5 3  9 5 4  6 7 5 
                                0 9 0  2 5 0  8 3 1
                                8 0 2  6 0 3  5 0 9
                                9 2 0  3 7 0  0 1 5 
                                0 0 8  0 2 0  7 6 0
                                3 0 0  5 6 0  4 0 0
                                4 6 0  0 0 0  1 0 7 
                                2 8 1  0 4 0  0 0 0
                                0 0 5  0 9 0  0 8 0
                            `;
        }

    }
   
   
    

    let  startValue = initString
            .split('')
            .filter(x => '0123456789'.includes(x))
            // шаг 21 превратим в цифры 
            .map(x => Number(x))
            console.log(startValue);

    let myBody = [];
    // console.log(myBody);
        

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
        veiwUpdate();
    }

    function getHtml(size){
        let identificator = 0;
        // шаг 6 создадим инпуты
        // item - элемент массива
        for(let item of myBody){
            let imputElement = document.createElement('input')
            imputElement.classList.add("sudoku-cell");
            imputElement.id = "a" + identificator++;
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

        let app = document.querySelector("#app").append(div);
        
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

    getHtml(750);

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

