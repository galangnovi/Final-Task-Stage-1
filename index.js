// const btn = document.getElementById('toggleBtn');
//     const body = document.body;

//     let isDark = false;

//     btn.addEventListener('click', () => {
//       isDark = !isDark;

//       if (isDark) {
//         body.setAttribute('data-bs-theme',"dark");
//         btn.textContent = '🌙';
//       } else {
//         body.setAttribute('data-bs-theme',"light");
//         btn.textContent = '🌞';
//       }
//     });


const body = document.body;
const btn = document.getElementById('toggleBtn');

// Ambil mode tersimpan (default: dark)
let isDark = localStorage.getItem('mode') === 'dark';

// Atur tema awal saat halaman dimuat
if (isDark) {
    body.setAttribute('data-bs-theme', 'dark');
    btn.innerHTML = '<i class="bi bi-moon-fill"></i>';
} else {
    body.setAttribute('data-bs-theme', 'light');
    btn.innerHTML = '<i class="bi bi-brightness-high"></i>';
}

btn.addEventListener('click', () => {
isDark = !isDark;

if (isDark) {
    body.setAttribute('data-bs-theme', 'dark');
    btn.innerHTML = '<i class="bi bi-moon-fill"></i>';
    localStorage.setItem('mode', 'dark');
    } else {
    body.setAttribute('data-bs-theme', 'light');
    btn.innerHTML = '<i class="bi bi-brightness-high"></i>';
    localStorage.setItem('mode', 'light');
    }
}); 

const icon = document.getElementById('icon');
    let isDragging = false;
    let offsetX = 0;

    icon.addEventListener('mousedown', (e) => {
      isDragging = true;
      icon.classList.add('dragging');
      offsetX = e.clientX - icon.offsetLeft;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        icon.style.left = `${e.clientX - offsetX}px`;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        icon.classList.remove('dragging');
        icon.style.animation = 'slide 10s linear infinite';
      }
    });

    // Hentikan animasi saat klik pertama kali
    icon.addEventListener('mousedown', () => {
      icon.style.animation = 'none';
    });


let data1 = []
let data2 = []
function dataPushExperience() {
    let technoIcon = techno.map(techno=>{
        if (techno) 
        return(`<p class="icn-experience">${techno}</p>`)
    }).join("\n")
    let experiences = experience.map (experience =>{
        if (experience)
        return (`<li>${experience}</li>`)
    }).join("\n")
    let dataWork= {
        imageWork,
        nameWork,
        workLocation,
        experiences,
        technoIcon,
        duration,
    }
    data1.push(dataWork)
    changeElement1()
}

function changeElement1(){
    document.getElementById("change1").innerHTML = data1.map(data1 =>
        `<div style="display: flex; border-radius: 7px; box-shadow: 0.5px 0.5px 5px black; padding: 10px 20px 10px 20px; justify-content: space-between;">
            <div class="container-imgtools" style="width: 100px;">
                <img src="${data1.imageWork}" alt="" style="width: 80px;">
            </div>
            <div style="width: 70%;">
                <h4 style="margin-bottom: 0;">${data1.nameWork}</h4>
                <p style="color: green;font-size: small;">${workLocation}</p>
                <ul style="list-style: disc;">
                    ${data1.experiences}
                </ul>
                <div style="display: flex; gap: 10px;">
                    ${data1.technoIcon}
                </div>
            </div>
            <div> 
                <p>${data1.duration}</p> 
            </div>
            </div>
        </div>`
    ).join("") 
}


function dataPushProject() {
    let technoIconProject = technoProject.map(technoProject=>{
        if (technoProject) 
        return(`<p class="icn-experience">${technoProject}</p>`)
    }).join(" ")

    let viewGit = gitURL.map (gitURL =>{
        if (gitURL.length > 0)
        return (`<a href="${gitURL}" class="" style="text-decoration: none;">
                    <i class="bi bi-github"></i>  view on GitHub
                </a>`
        ) 
        else return ('<p><i class="bi bi-github"></i>  Private Repository</p>')
    })

    let liveDemo = demoURL.map (demoURL =>{
        if (demoURL.length > 0)
        return (`<a href="${demoURL}" class="" style="text-decoration: none;margin-left: 20px;">
                        <i class="bi bi-box-arrow-up-right"></i>  Live Demo</a>`
        ) 
        else return ('<p><i class="bi bi-box-arrow-up-right"></i>  Live Demo Unavailable</p>')
    })

    let dataProject= {
        imageProject,
        nameProject,
        deskProject,
        technoIconProject,
        viewGit,
        liveDemo,
    }
    data2.push(dataProject)
    changeElement2()
}

function changeElement2(){
    document.getElementById("change2").innerHTML = data2.map( data2 =>
        `<div class="card">
            <div class="card-frame-img">
                <img src="${data2.imageProject}" class="card-img-top" alt="...">
            </div>
            <div class="card-body">
                <h5 class="card-title">${data2.nameProject}</h5>
                <p class="card-text">${data2.deskProject}</p>
                <div style="display: flex; gap: 10px;">
                    ${data2.technoIconProject}
                </div>
                <div style="display:flex; gap:20px;">
                    ${data2.viewGit}
                    ${data2.liveDemo}
                </div>
            </div>
        </div>`
    ).join("") 
}

// let image =
// imegeWork = {"assets/img/dumbways.png"},
// nameWork = {"dumbways"},
// workLocatin = {"dumbways"},
// experience = {"none"},


// data pertama
imageWork ="assets/img/dumbways.png"
nameWork = "dumbways"
workLocation = "dumbways"
experience = ["none"]
techno = ["java","embuh"]
duration = "november only"
dataPushExperience()

imageProject = "assets/unnamed.jpg"
nameProject = "nama Saya Sendiri"
deskProject = "entah gak tau tapi saya suka makan kadang begadang"
technoProject = ["shutdown","colok saklar","ngeprint file"]
gitURL = ["sdas"]
demoURL = ["dsadas"]
dataPushProject()


imageProject = "assets/img/tailwind.png"
nameProject = "nama ngawur"
deskProject = "entah gak tau"
technoProject = ["ya","boleh"]
gitURL = ["#"]
demoURL = ["#"]
dataPushProject()

imageProject = "assets/img/tailwind.png"
nameProject = "nama ngawur"
deskProject = "entah gak tau"
technoProject = ["okelah kalau begitu","boleh"]
gitURL = [""]
demoURL = [""]
dataPushProject()

imageProject = "assets/unnamed.jpg"
nameProject = "nama Saya Sendiri"
deskProject = "entah gak tau tapi saya suka makan kadang begadang"
technoProject = ["shutdown","colok saklar","ngeprint file"]
gitURL = [""]
demoURL = ["sfsdf"]
dataPushProject()
console.log(gitURL)
console.log(demoURL)

function plusElement1() {
    document.getElementById('plus1').innerHTML +=`
    <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label">Deskripsi Pekerjaan</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="2"></textarea>
        </div>`
}

function plusElement2() {
    document.getElementById('plus2').innerHTML +=`
    <div class="mb-3" style="width: 400px;">
            <label for="exampleFormControlInput1" class="form-label">Teknologi Yang Digunakan</label>
            <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="">
        </div>`
}