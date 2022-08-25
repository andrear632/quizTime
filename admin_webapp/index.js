async function send(){

    var radios = document.getElementsByName("answer");
    var correct = null;

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            correct = radios[i].value;
            break;
        }
    }

    if (correct==null) {
        alert("Select a correct answer")
    }
    else {

        var qn = document.getElementById("question");
        var questionnumber = qn.value;

        if (questionnumber=="") {
            alert("Select question number")
        }
        else {
            var data = {'correct':correct, 'qn':questionnumber};
            var url = "http://localhost:3000/start";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            });
            response.json().then((data) => {
                alert(data.msg)
            })
            
        }

    }

}