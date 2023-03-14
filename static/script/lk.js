document.getElementById("change").addEventListener("click", async () => {
    var new_login = document.getElementById("login").value;
    var new_password = document.getElementById("password").value;

    var selectedFile = document.getElementById('pic').files[0];

    var data = new FormData();

    data.append("file", selectedFile);
    data.append("login", new_login);
    data.append("password", new_password);
    var res = await fetch("http://127.0.0.1:5000/api/v1.0/onchange", {
        method: "POST",
        body: data
    });

    ret = await res.json()
    if (ret["status"] === "Картинка успешно заменена") {
        document.getElementById("form-container").innerHTML += '<b style="color: green; font-size: 20px;">' +
            ret["status"] + '</b>';
    } else {
        document.getElementById("form-container").innerHTML += '<b style="color: red; font-size: 20px;">' +
            "Что-то пошло не так :(" + '</b>';
    }
})