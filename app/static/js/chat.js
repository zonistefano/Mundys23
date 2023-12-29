let audio1 = new Audio(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/clickUp.mp3"
);
function chatOpen() {
  document.getElementById("chat-open").style.display = "none";
  document.getElementById("chat-close").style.display = "block";
  document.getElementById("chat-w").style.display = "block";
}
function chatClose() {
  document.getElementById("chat-open").style.display = "block";
  document.getElementById("chat-close").style.display = "none";
  document.getElementById("chat-w").style.display = "none";
}

//Gets the text from the input box(user)
function userResponse() {
  console.log("response");
  let userText = document.getElementById("textInput").value;

  if (userText == "") {
    alert("Please type something!");
  } else {
    document.getElementById("chat").innerHTML += `<div class="message parker">${userText}</div>`;
    let audio3 = new Audio(
      "https://prodigits.co.uk/content/ringtones/tone/2020/alert/preview/4331e9c25345461.mp3"
    );
    audio3.load();
    audio3.play();

    document.getElementById("textInput").value = "";
    var objDiv = document.getElementById("chat");
    objDiv.innerHTML += `<div class="message stark" id="typing">
    <div class="typing typing-1"></div>
    <div class="typing typing-2"></div>
    <div class="typing typing-3"></div>
  </div>`;
  objDiv.scrollTop = objDiv.scrollHeight;

    setTimeout(() => {
      adminResponse(userText);
    }, 1000);
  }
}

function adminResponse(userText) {
  fetch("/invia", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: userText }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let adviceText = data.content;
      last = document.getElementById(
        "typing"
      )
      last.innerHTML= `${adviceText}`;
      last.id = ""
      let audio3 = new Audio(
        "https://downloadwap.com/content2/mp3-ringtones/tone/2020/alert/preview/56de9c2d5169679.mp3"
      );
      audio3.load();
      audio3.play();

      var objDiv = document.getElementById("chat");
      objDiv.scrollTop = objDiv.scrollHeight;
    })
    .catch((error) => {
      console.log(error);
    });
}

//press enter on keyboard and send message
addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    const e = document.getElementById("textInput");
    if (e === document.activeElement) {
      userResponse();
    }
  }
});
