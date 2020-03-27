window.onload = function(){
    let btn = document.querySelector('.btn').onclick = function(e){
        e.preventDefault();

        let log = document.querySelector('#input-login').value;
        let pasw = document.querySelector('#input-pasword').value;

        if(log == "user"){
            
            if(pasw == "1234"){
                document.location.replace = "sudoku.html";
                alert("Авторизация успешна");
            }
        }
        else{
            alert("Вы ввели неправильно логин или пароль")
            document.location.href = "index.html";
        }

    }
}