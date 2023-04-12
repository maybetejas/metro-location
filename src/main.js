import array from "./array.js";

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const wrap = document.querySelector(".image-wrapper");
const width = wrap.clientWidth;
const height = wrap.clientHeight;

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(width, height);
wrap.appendChild(renderer.domElement);

const aspectRatio = width / height;

var geometry = new THREE.CircleGeometry(0.2, 100);
geometry.scale(aspectRatio, 1.5, 1);

var material = new THREE.MeshBasicMaterial({
  color: 0x63345e,
  transparent: true,
  opacity: 0.5,
});

var circle = new THREE.Mesh(geometry, material);
circle.position.set(1000, 0, 0);
scene.add(circle);

var targetPosition = new THREE.Vector3(
  circle.position.x,
  circle.position.y,
  circle.position.z
);

var startPosition = new THREE.Vector3(
  circle.position.x,
  circle.position.y,
  circle.position.z
);

var animationStartTime = null;

var animationDuration = 1000;

const form = document.getElementById("searchInput");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchStation = document.getElementById("myInput").value;

  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (element.hasOwnProperty(searchStation)) {
      const coord = element[searchStation];
      //console.log(coord.x, coord.y, coord.z);

      targetPosition.set(coord.x, coord.y, coord.z);

      startPosition.copy(circle.position);

      animationStartTime = performance.now();
      break;
    }
  }
});

function animate(currentTime) {
  requestAnimationFrame(animate);

  if (animationStartTime !== null) {
    var elapsedTime = currentTime - animationStartTime;

    if (elapsedTime < animationDuration) {
      var interpolationFactor = elapsedTime / animationDuration;

      var newPosition = startPosition.lerp(targetPosition, interpolationFactor);
      circle.position.copy(newPosition);
    } else {
      circle.position.copy(targetPosition);
      animationStartTime = null;
    }
  }

  renderer.render(scene, camera);
}

animate();

function fillSidebar() {
  const list = document.getElementById("list");
  list.innerHTML = "";
  array.forEach((element) => {
    const name = Object.keys(element)[0];
    const listItem = document.createElement("li");
    listItem.textContent = name;
    listItem.addEventListener("click", () => {
      const coord = element[name];
      targetPosition.set(coord.x, coord.y, coord.z);
      startPosition.copy(circle.position);
      animationStartTime = performance.now();
    });
    list.appendChild(listItem);
  });
}

fillSidebar();
