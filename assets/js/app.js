// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDD2T--fKedDwLBRTZKjY0vKmipIIS_iLw",
  authDomain: "charactergenerator-fc673.firebaseapp.com",
  databaseURL: "https://charactergenerator-fc673.firebaseio.com",
  projectId: "charactergenerator-fc673",
  storageBucket: "charactergenerator-fc673.appspot.com",
  messagingSenderId: "987916882241",
  appId: "1:987916882241:web:0805e25e9e5b2059be51c0",
  measurementId: "G-FYJ3LJ44Q1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let database = firebase.database();



// Make grid
let container = document.getElementById("container");
for(let i = 0; i < 8; i++){
  let newSubcontainer = document.createElement('div')
  newSubcontainer.className="box";
  for(let j =0; j< 8; j++){
    let newElement = document.createElement('div');
    newElement.className = "leds";
    newElement.innerHTML = `${j},${i}`;
    newSubcontainer.append(newElement);
  }
  container.append(newSubcontainer)

}

// Select grid
let leds = document.getElementsByClassName("leds");


function select(e) {
  if( e.target.classList.contains("selected")){
    e.target.classList.remove("selected");
  }else{
    e.target.classList.add("selected");
  }
}

for(let i = 0; i < leds.length ; i++) {
  leds[i].addEventListener('click', select)
}


// Save Character in firebase
document.getElementById('button').addEventListener("click", function(e){
  let selected = document.getElementsByClassName('selected');
  let array = [];
  for(let i = 0; i < selected.length; i++){
    array.push(selected[i].innerHTML)
  }
  publishCharacter(e, array);
})


function publishCharacter(e, array) {
  e.preventDefault();

  firebase.database().ref('character').push(
    array
  );
  location.reload();

}


// Load all characters
let characters = document.getElementById('characters');
firebase.database().ref('character').on('value', (snapshot) => {
  snapshot.forEach((child)=>{
    let newCharacter = document.createElement('div');
    newCharacter.className="charachter";
    for(let i = 0; i < 8; i++){
      let newRow = document.createElement('div')
      newRow.className="row";
      for(let j =0; j< 8; j++){
        

        let newBlock= document.createElement('div');
        newBlock.className = "block";
        newBlock.innerHTML = `${j},${i}`;
        if(child.val().includes(`${j},${i}`)){
          newBlock.className = "block color";
        }
        newRow.append(newBlock);
      }
      newCharacter.append(newRow);
      characters.append(newCharacter)
    }
  })

  // Selected grid
  let grids = document.getElementsByClassName("charachter");
  let c = 0;
  let howMany = grids.length;

  function getGrid(e) {
   restart()
    for(let z = 0; z< e.target.children.length; z++){
      let blocks = e.target.children[z].children;
      for(let a = 0; a< blocks.length; a++){
        if(blocks[a].className == "block color")
        for(let b = 0; b< leds.length; b++){
          if(leds[b].innerHTML == blocks[a].innerHTML){
            leds[b].classList.add("selected")
          }
         
        }
      }
    }
}

  for(let x = 0; x < grids.length ; x++) {
    grids[x].addEventListener('click', getGrid)
  }

  // Run characters
  function runnen() {
    console.log('run')
    firebase.database().ref('state/').set(
      true
    );

    document.getElementById('run').style.display = "none";
    document.getElementById('stop').style.display = "inline";
    restart()
    for(let z = 0; z< grids[c].children.length; z++){
      let blocks = grids[c].children[z].children;
      for(let a = 0; a< blocks.length; a++){
        if(blocks[a].className == "block color")
        for(let b = 0; b< leds.length; b++){
          if(leds[b].innerHTML == blocks[a].innerHTML){
            leds[b].classList.add("selected")
          }
        
        }
      }
    }
    if( c < howMany - 1 ){
      console.log(c)
      console.log(howMany)
        c++;
        setTimeout( runnen, 2000 );
    }else if (c == howMany - 1){
      c = 0;
      runnen()
    } else {
      console.log('stop')
    }
  }

  document.getElementById('run').addEventListener('click',runnen)
  document.getElementById('stop').addEventListener('click', function(){
    console.log('stoppen')
    firebase.database().ref('state/').set(
      false
    );
    location.reload();

  })

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      document.getElementById('buttons').style.display ="block"
      document.getElementById('account').style.display ="none"

    } else {
      document.getElementById('buttons').style.display ="none"
      document.getElementById('account').style.display ="block"

      runnen();
    }
  });
})


// see charachters
document.getElementById('list').addEventListener('click',function(){
  if(document.getElementById('characters').style.visibility == "visible"){
  document.getElementById('characters').style.visibility = "hidden";
  }else {
    document.getElementById('characters').style.visibility = "visible";

  }

})


// restart
function restart(){
  for(let b = 0; b< leds.length; b++){

    if( leds[b].classList.contains("selected")){
      leds[b].classList.remove("selected");
    }
  }
}
document.getElementById('restart').addEventListener('click',restart)

