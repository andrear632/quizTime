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
            document.getElementById("question").value=(parseInt(questionnumber)+1).toString()
            localStorage["lastQuestion"] = document.getElementById("question").value
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



async function end(){

            var data = {'game':'end'};
            var url = "http://localhost:3000/end";
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

            localStorage['lastQuestion'] = "1"

}


function setQN(){
    if(!localStorage.hasOwnProperty("lastQuestion")){
        localStorage["lastQuestion"] = "1"
    }
    document.getElementById("question").value = localStorage["lastQuestion"]
}