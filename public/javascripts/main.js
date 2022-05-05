//---------------------------------------------------------------- Main variables used in app ---------------------------------------------------------------
var raceHidden = true;
var horseHidden = true;
var betHidden = true;
var resultsHidden = true;
var racersHiddenLeft = true;
const addToSelect = document.getElementById("raceSelect")
const colorSelect = document.getElementById("colorSelect")
var used_colors = {}
const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'brown', 'white', 'cyan', 'black', 'aqua']
var betRacesId = []
var raceInfo = {}
var betsTable = {}
var winnersInfo = {}
var objRace = {}
var max_participants = {}
var races = {}
var races_times = {}
var next_time_race = new Date().getTime();
//---------------------------------------------------------------- Main variables used in app ---------------------------------------------------------------


//---------------------------------------------------------------- Functions to show or hide cards ----------------------------------------------------------------

//---------------------------------------------------------------- Function to check if max amount of horses is already added ----------------------------------------------------------------
addToSelect.addEventListener("click", function () {
    if (racersHiddenLeft == true) {
        document.getElementsByClassName(addToSelect.options[addToSelect.selectedIndex].value)[0].style.display = "inline"
        for (const [key, val] of Object.entries(used_colors)) {
            if (key == addToSelect.options[addToSelect.selectedIndex].value) {
                for (var i = 0; i < val.length; i++) {
                    colorSelect.remove(val[i])
                }
            }
        }
        racersHiddenLeft = false
    } else {
        $('#colorSelect').find("option").remove()
        for (i = 0; i < colors.length; i++) {
            var option = document.createElement("option")
            option.text = colors[i]
            colorSelect.add(option)
        }
        document.getElementsByClassName(addToSelect.options[addToSelect.selectedIndex].value)[0].style.display = "none"
        racersHiddenLeft = true
    }

    if (used_colors[addToSelect.options[addToSelect.selectedIndex].value].length == parseInt(max_participants[addToSelect.options[addToSelect.selectedIndex].value])) {
        document.getElementsByClassName("addHorsebtn")[0].disabled = true
    } else {
        document.getElementsByClassName("addHorsebtn")[0].disabled = false
    }
})
//---------------------------------------------------------------- Function to show or hide horse adder and check if max amount of horses is already added ---------------------------------------------------------------

//---------------------------------------------------------------- Function to show or hide race adder ---------------------------------------------------------------
if (document.getElementById("showRace")) {
    document.getElementById("showRace").addEventListener('click', function () {
        if (raceHidden) {
            raceHidden = false;
            document.getElementsByClassName("makeRace")[0].style.display = "block";
            document.getElementById("showRace").innerHTML = "Hide Race"
        } else {
            document.getElementsByClassName("makeRace")[0].style.display = "none";
            document.getElementById("showRace").innerHTML = "Show Race"
            raceHidden = true;
        }
    })
}
//---------------------------------------------------------------- Function to show or hide race adder ---------------------------------------------------------------

//---------------------------------------------------------------- Function to show or hide horse adder ---------------------------------------------------------------
if (document.getElementById("showHorses")) {
    document.getElementById("showHorses").addEventListener('click', async function () {
        if (horseHidden) {
            document.getElementsByClassName("addHorse")[0].style.display = "block";
            document.getElementById("showHorses").innerHTML = "Hide Horses"
            horseHidden = false;
        } else {
            document.getElementsByClassName("addHorse")[0].style.display = "none";
            document.getElementById("showHorses").innerHTML = "Show Horses"
            horseHidden = true;
        }
    })
}
//---------------------------------------------------------------- Function to show or hide horse adder ---------------------------------------------------------------

//---------------------------------------------------------------- Function to show or hide bet adder ---------------------------------------------------------------
if (document.getElementById("betRaces")) {
    document.getElementById("betRaces").addEventListener('click', function () {
        if (betHidden) {
            betHidden = false;
            document.getElementsByClassName("makeBet")[0].style.display = "block";
            document.getElementById("betRaces").innerHTML = "Hide bet"
        } else {
            document.getElementsByClassName("makeBet")[0].style.display = "none";
            document.getElementById("betRaces").innerHTML = "Show bet"
            betHidden = true;
        }
    })
}
//---------------------------------------------------------------- Function to show or hide bet adder ---------------------------------------------------------------

//---------------------------------------------------------------- Function to show or hide results ---------------------------------------------------------------
if (document.getElementById("showResults")) {
    document.getElementById("showResults").addEventListener('click', function () {
        if (resultsHidden) {
            resultsHidden = false;
            document.getElementsByClassName("results")[0].style.display = "block";
            document.getElementById("showResults").innerHTML = "Hide Results"
        } else {
            document.getElementsByClassName("results")[0].style.display = "none";
            document.getElementById("showResults").innerHTML = "Show Results"
            resultsHidden = true;
        }
    })
}
//---------------------------------------------------------------- Function to show or hide results ---------------------------------------------------------------

//---------------------------------------------------------------- Functions to show or hide cards ----------------------------------------------------------------


//---------------------------------------------------------------- Function for ajax get call ---------------------------------------------------------------
getText = async function (url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };
    request.open("GET", url);
    request.send();
}
//---------------------------------------------------------------- Function for ajax get call ---------------------------------------------------------------

//---------------------------------------------------------------- Function to show races if not betted on yet ---------------------------------------------------------------
function raceShow(data) {
    let select = document.getElementById("race")
    for (k in JSON.parse(data)) {
        if (betRacesId.includes(k)) {
            continue
        } else {
            var option = document.createElement("option")
            option.value = k
            option.text = k
            select.add(option)
        }
    }
}
//---------------------------------------------------------------- Function to show races if not betted on yet ---------------------------------------------------------------

//---------------------------------------------------------------- Function to show horses if available --------------------------------------------------------------------------------------------------------
function horseShow(data) {
    let select = document.getElementById("horse")
    let raceSelect = document.getElementById("race")
    var selectedRace = raceSelect[0].value
    console.log("selectedRace 1")
    console.log(selectedRace)
    console.log("selectedRace 1")

    console.log()
    raceSelect.addEventListener("change",()=>{

        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
        selectedRace = raceSelect.value;
        for (k in objRace[selectedRace]) {
            console.log(objRace[selectedRace][k])
            let option = document.createElement("option")
            option.text = JSON.parse(data)[objRace[selectedRace][k]]["name"] + " " + JSON.parse(data)[objRace[selectedRace][k]]["color"]
            option.value = objRace[selectedRace][k]
            select.add(option)
    
        }
    })
    
    for (k in objRace[selectedRace]) {
        console.log(objRace[selectedRace][k].trim())
        let option = document.createElement("option")
        option.text = JSON.parse(data)[objRace[selectedRace][k]]["name"] + " " + JSON.parse(data)[objRace[selectedRace][k]]["color"]
        option.value = objRace[selectedRace][k]
        select.add(option)

    }
}
//---------------------------------------------------------------- Function to show horses if available --------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------- Function to show bets if available --------------------------------------------------------------------------------------------------------
function betShow(data) {
    let bets = JSON.parse(data)
    for (k in bets) {
        if (k != undefined) {
            betRacesId.push(bets[k]["raceId"])
        }
        betsTable[k] = bets[k]
    }
}
//---------------------------------------------------------------- Function to show bets if available --------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------- Function to get competitors in the race --------------------------------------------------------------------------------------------------------
function getAllHorseinOneRace(data) {
    let obj = JSON.parse(data)
    let raceHorses = []
    for (key in obj) {
        for (key2 in obj) {
            if (obj[key]["raceId"] == obj[key2]["raceId"]) {
                raceHorses.push(key2.toString())
                continue
            }
        }
        objRace[obj[key]["raceId"]] = raceHorses
        raceHorses = []
    }
}
//---------------------------------------------------------------- Function to get competitors in the race --------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------- Function to randomize and pick a winner --------------------------------------------------------------------------------------------------------
function winnerRandomizer(key) {
    var keys = Object.keys(objRace);
    var ans;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == key) {
            ans = objRace[key][Math.floor(Math.random() * objRace[key].length)];
            break
        }
    }
    renderResults(ans, key)
}
//---------------------------------------------------------------- Function to randomize and pick a winner --------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------- Main first init function --------------------------------------------------------------------------------------------------------------------------------------------------

function main() {
    races_populate()
    getText('/getCompetitors', getAllHorseinOneRace);

    getText('/getBets', betShow);
    setTimeout(() => {
        getText('/getRaces', raceShow)
    }, 1000)
    setTimeout(() => {
        getText('/getHorses', horseShow)
    }, 1000)
    
    allTogether()
}
//---------------------------------------------------------------- Main first init function --------------------------------------------------------------------------------------------------------------------------------------------------
$(document).ready(main())

//---------------------------------------------------------------- ??? --------------------------------------------------------------------------------------------------------------------------------------------------
function allTogether() {
    getText('/readResults', function (data) {

        let table = document.getElementById("results")
        winersNames = ""
        losers = []
        dataParse = JSON.parse(data)

        for(k in dataParse){
            let tr = document.createElement("tr")
            table.appendChild(tr)
            for (let i = 0; i < 3; i++) {
                let td = document.createElement("td")

                if (i == 0) {
                    td.innerText = k;
                    tr.appendChild(td)
                } else if (i == 1) {
                    let str = ' ';
                    for (let i = 0; i< JSON.parse(dataParse[k]["losers"]).length; i++  ) {
                        if(JSON.parse(dataParse[k]["losers"]).length == 0 ) break
                        str += "\n " + JSON.parse(dataParse[k]["losers"])[i]
                    }

                    td.innerText= str;
                    tr.appendChild(td)

                } else if (i == 2) {
                    td.innerText = dataParse[k]["winnerHorseId"];
                    tr.appendChild(td)

                }
            }

        }
    });
}
//---------------------------------------------------------------- ??? --------------------------------------------------------------------------------------------------------------------------------------------------


//---------------------------------------------------------------- Render the results --------------------------------------------------------------------------------------------------------------------------------------------------
function renderResults(winner, race) {
    var losers = []
    for (key in races) {
        if (key == race) {
            for (const [k, v] of Object.entries(objRace)) {
                if (k == race) {
                    for (var i = 0; i < v.length; i++) {
                        if (v[i] != winner) {
                            losers.push(v[i])
                        } else {
                            continue
                        }
                    }
                }
            }
            $.ajax({
                type: "POST",
                url: "/resultWrite",
                dataType: "json",
                data: {
                    "winner": winner,
                    "losers": JSON.stringify(losers),
                    "raceId": race
                },
                success: function (result) {
                    console.log("success", result)
                }
            })
        }
    }
}
//---------------------------------------------------------------- Render the results --------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------- Run the race when time has come --------------------------------------------------------------------------------------------------------------------------------------------------
function runRace() {
    winnerRandomizer(next_time_race[1])
    get_next_race()
}
//---------------------------------------------------------------- Run the race when time has come --------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------- Get the next race to run --------------------------------------------------------------------------------------------------------------------------------------------------
function get_next_race() {
    var flat = []
    let arr = Object.keys(races_times).map(function (key) {
        if (Date.parse(races_times[key]) > new Date().getTime()) {
            return [Date.parse(races_times[key]), key]
        } else {
            return [Infinity, key]
        }
    });
    var flat = flat.concat(...arr)
    const min = Math.min(...flat.filter(x => typeof x === 'number'));
    if (min == Infinity) {
        return
    }
    next_time_race = [min, flat[flat.indexOf(min) + 1]]
    if (next_time_race[0] - new Date().getTime() > 0) {
        wait()
    }
}
//---------------------------------------------------------------- Get the next race to run --------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------- Wait until time arrives to runRace--------------------------------------------------------------------------------------------------------------------------------------------------
function wait() {
    timeNow = new Date().getTime()
    offsetMillis = next_time_race[0] - timeNow;
    console.log(offsetMillis)
    console.log("time until next race: " + offsetMillis)
    setTimeout(runRace, offsetMillis);
}
//---------------------------------------------------------------- Wait until time arrives to runRace--------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------- Function to populate the competitors card--------------------------------------------------------------------------------------------------------------------------------------------------
async function races_populate() {
    await $.get("/getRaces", async function (data) {
        for (var i = 0; i < colors.length; i++) {
            var option = document.createElement("option")
            option.text = colors[i]
            colorSelect.add(option)
        }
        for (const key in data) {
            var option = document.createElement("option")
            option.text = key
            addToSelect.add(option)
            races[key] = data[key]
            max_participants[key] = data[key]["max"]
            races_times[key] = data[key]["time"]
        }
        await $.get("/getHorses", function (result) {
            const blocky = document.getElementsByClassName("form-group-horses")[0]
            for (const key in data) {
                const racers_left = parseInt(data[key]["max"])
                text = document.createElement("span")
                text.className = key
                var colores = []
                for (k in result) {
                    if (key == result[k]["raceId"]) {
                        colores.push(result[k]["color"])
                    }
                }
                used_colors[key] = colores
                text.innerHTML = racers_left - colores.length
                text.innerHTML = text.innerHTML + " slots left"
                if (addToSelect.options[addToSelect.selectedIndex].value == key) {
                    blocky.appendChild(text)
                } else {
                    text.style.display = "none"
                }
                blocky.appendChild(text)
            }
            addToSelect.click()
            wait()
        })
    })
}
//---------------------------------------------------------------- Function to populate the competitors card--------------------------------------------------------------------------------------------------------------------------------------------------