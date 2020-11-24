let web_api = "https://f73webapi.azurewebsites.net/api/Items";
let app_ID = 187213;
let currentMood = null;

holen();

async function schreiben(param) {
  var zahl = param.getAttribute("data-role");

  if (!(currentMood == null)) {
    await remove(currentMood.id);
  }

  let mood = {
    appId: app_ID,
    key: "",
    value: zahl
  };

  let response = await fetch(web_api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(mood)
  });
  currentMood = await response.json();
  console.log(currentMood);

  if (response.status == 201) {
    console.log("Alles ok");
  }

  document.querySelector(".currentMoodImage").src = param.src;

  holen();
}

async function holen() {
  let counterGreen = 0;
  let counterLightGreen = 0;
  let counterYellow = 0;
  let counterOrange = 0;
  let counterRed = 0;

  let response = await fetch(web_api + "/App/" + app_ID, {
    method: "GET",
    headers: {
      "Content-Typ": "application/jason"
    }
  });

  let todos = await response.json();
  console.log(todos.length + "Aufgaben empfangen");

  for (todo of todos) {
    if (todo.value == 1) {
      counterGreen = counterGreen + 1;
    }
    if (todo.value == 2) {
      counterLightGreen = counterLightGreen + 1;
    }
    if (todo.value == 3) {
      counterYellow = counterYellow + 1;
    }
    if (todo.value == 4) {
      counterOrange = counterOrange + 1;
    }
    if (todo.value == 5) {
      counterRed = counterRed + 1;
    }
  }
  createResultWidth(
    counterGreen,
    counterLightGreen,
    counterYellow,
    counterOrange,
    counterRed
  );
  //document.getElementById("result-green").innerText= counterGreen;
  document.querySelector(".result-green").innerText = counterGreen;
  document.querySelector(".result-lightgreen").innerText = counterLightGreen;
  document.querySelector(".result-yellow").innerText = counterYellow;
  document.querySelector(".result-orange").innerText = counterOrange;
  document.querySelector(".result-red").innerText = counterRed;
}

function createResultWidth(green, lightgreen, yellow, orange, red) {
  let totalCounter = green + lightgreen + yellow + orange + red;

  document.querySelector(".gesamtResult").innerHTML = "Gesamt: " + totalCounter;

  let greenWidth = (100 / totalCounter) * green;
  let lightgreenWidth = (100 / totalCounter) * lightgreen;
  let yellowWidth = (100 / totalCounter) * yellow;
  let orangeWidth = (100 / totalCounter) * orange;
  let redWidth = (100 / totalCounter) * red;

  document.querySelector(".result-green").style = "width :" + greenWidth + "%";
  document.querySelector(".result-lightgreen").style =
    "width :" + lightgreenWidth + "%";
  document.querySelector(".result-yellow").style =
    "width :" + yellowWidth + "%";
  document.querySelector(".result-orange").style =
    "width :" + orangeWidth + "%";
  document.querySelector(".result-red").style = "width :" + redWidth + "%";
}

function remove(id) {
  return fetch("https://f73webapi.azurewebsites.net/api/items/" + id, {
    method: "DELETE"
  }).then(response => {
    if (!response.ok) {
      throw new Error("Todo konnte nicht entfernt werden.");
    }
  });
}

async function removeAll() {
  let response = await fetch(web_api + "/App/" + app_ID, {
    method: "GET",
    headers: {
      "Content-Typ": "application/jason"
    }
  });
  let todos = await response.json();
  console.log(todos);

  for (let todo of todos) {
    await remove(todo.id);
  }
}

const deleteAllButton = document.querySelector(".deleteAll");
deleteAllButton.addEventListener("click", function() {
  removeAll();
});
