import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import hbs from 'hbs'
import { Pool } from 'pg'
import bcrypt from'bcrypt'
import flash from 'express-flash'
import session from 'express-session'
import multer from 'multer'
import serverless from 'serverless-http';


const db = new Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5432,
  database: 'final-task-1',
  max: 20
})



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const port = 3000



// app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 1000 * 60 * 60 * 5 //5 jam
  }
}))

app.use(flash())
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  next();
});


//multer  disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/assets/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
  },
});

const upload = multer({ storage: storage })


//Daftarkan folder statis
app.use('/assets', express.static('src/assets'))


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

// Daftarkan folder partials
hbs.registerPartials(path.join(__dirname, 'src/views/partials'));

app.get('/', (req, res) => {
  res.redirect('/home')
})

app.get('/tech-upload' , checkLogin,(req,res) =>{
  const user_active = req.session.user;
res.render('tech-upload', {user_active})
})

//tampilkan detail untuk edit (techno)
app.get('/tech/:id/detail' , checkLogin, async (req,res) =>{
  let {id} = req.params
  const result = await db.query(`
    SELECT * FROM public.tech_icon WHERE id=$1`,
  [id]);
  const tech = result.rows[0]
  const user_active = req.session.user;
  res.render('tech-edit', {tech, user_active})
})

//update data (techno)
app.post('/tech/:id/detail', upload.single('image'), async (req,res) =>{
  const {id} = req.params
  const name = req.body.name
  const image = req.file ? `${req.file.filename}` : null;
  const insertResult = await db.query(
    `UPDATE public.tech_icon
     SET  icon_image = COALESCE ($1, icon_image), 
          name = $2
     WHERE id =$3;`,
    [image, name, id]
  );
  res.redirect('/dashboard')
})

//delete (techno)
app.get('/icon-tech/delete/:id', async (req, res) => {
  const { id } = req.params
  const result = await db.query('DELETE FROM public.tech_icon WHERE id = $1', [id]); 
  res.redirect('/dashboard');
});

app.get('/login', (req,res) =>{
  res.render('login')
})

app.get('/profil' , checkLogin, async (req,res) =>{
  const result4 = await db.query('SELECT * FROM public.user_app');
  const user_app = result4.rows;
  res.render('profil', {user_app});
})

app.get('/home', async (req, res) =>{
  const result1 = await db.query('SELECT * FROM public.tech_icon');
  const tech_icon = result1.rows;
  const result2 = await db.query('SELECT * FROM public.work_experience');
  const work = result2.rows;
    const work_experience = work.map(exp => {
      const start = formatMonthYearOrPresent(exp.start_date);
      const end = exp.end_date ? formatMonthYearOrPresent(exp.end_date) : 'Present';

      return {
        ...exp,
        period: `${start} - ${end}`
    };
  });
  const result3 = await db.query('SELECT * FROM public.portofolio');
  const portofolio = result3.rows;
  const result4 = await db.query('SELECT * FROM public.user_app');
  const user = result4.rows;
  const user_app= user.map( user => {
  let phone = user.link_wa; // misalnya "085334462008"

    // Ubah 08 jadi 628
    if (phone.startsWith("0")) {
      phone = "62" + phone.slice(1);
    }
    return {...user, phone}
  })

  const user_active = req.session.user;
  res.render('index', { tech_icon , work_experience, portofolio, user_app, user_active});
});

app.get('/work' , checkLogin, (req,res) =>{
  const user_active = req.session.user;
  res.render('work-form', {user_active})
})

app.get('/portofolio' , checkLogin, (req,res) =>{
  const user_active = req.session.user;
  res.render('portofolio-form', {user_active})
})

function formatMonthYearOrPresent(dateStr) {
  if (!dateStr) return 'Present';  // kalau null atau undefined dianggap masih aktif

  const date = new Date(dateStr);
  const now = new Date();

  // Jika tanggal lebih besar dari sekarang, anggap masih aktif
  if (date > now) return 'Present';

  const options = { year: 'numeric', month: 'short' };
  return date.toLocaleDateString('en-US', options);
}

//jalankan route dashboard tambah enskripsi
app.get('/dashboard', checkLogin, async (req, res) => {
  const result1 = await db.query('SELECT * FROM public.tech_icon');
  const tech_icon = result1.rows;
  const result2 = await db.query('SELECT * FROM public.work_experience');
  const work = result2.rows;
    const work_experience = work.map(exp => {
      const start = formatMonthYearOrPresent(exp.start_date);
      const end = exp.end_date ? formatMonthYearOrPresent(exp.end_date) : 'Present';

      return {
        ...exp,
        period: `${start} - ${end}`
    };
  });
  const result3 = await db.query('SELECT * FROM public.portofolio');
  const portofolio = result3.rows;
  const user_active = req.session.user;
  res.render('dashboard', { tech_icon , work_experience, portofolio, user_active});
});

 //midleware apakah user sudah login
function checkLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('error', 'Silahkan login dulu');
    res.redirect('/login');
  }
}

app.post('/tech-upload', upload.single('image_tech'), handleUploadTech )

app.post('/login', matchingData)

async function matchingData (req,res) {
let{ email, password} = req.body
const isLogin= await db.query( `SELECT * FROM user_app WHERE email= '${email}'`)

if (isLogin.rows.length === 0) {
    // Email tidak ditemukan
    req.flash('error', 'Email atau password salah');
    return res.redirect('/login');
  }

const isMatch= await bcrypt.compare(password, isLogin.rows[0].password)

if(isMatch){
  // Simpan user ke session dulu baru bisa gunakan enkripsi midleware
    req.session.user={
      id: isLogin.rows[0].id,
      name: isLogin.rows[0].name,
      image: isLogin.rows[0].image,
      email: isLogin.rows[0].email,
    }
 return res.redirect('/dashboard')
} else { req.flash('error', 'email atau password salah')
 return res.redirect('/login')
}}

//link log out
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      // Kalau error hapus session, tetap redirect ke login saja
      return res.redirect('/home');
    }
    res.redirect('/home'); // atau bisa redirect ke homepage jika mau
  });
});

// console.log(req.body)

bcrypt.hash('123456', 10).then(hash => {
  console.log(hash);
});


//upload data (techno)
async function handleUploadTech( req, res) {
  const name = req.body.name
  const image = req.file ? `${req.file.filename}` : null;
   const insertResult = await db.query(
    `INSERT INTO public.tech_icon (icon_image, name)
     VALUES ($1, $2)`,
    [image, name]
  );
  res.redirect('/dashboard')
}

//upload data (work experience)
app.post('/work', upload.single('image'), async (req,res) =>{
  let {position, company, start_date, end_date, description, tech} = req.body
  const image = req.file ? `${req.file.filename}` : null;
  const desc = Array.isArray(description)
    ? description
    : [description].filter(Boolean); // handle 1 atau lebih value
  const techno = Array.isArray(tech)
    ? tech
    : [tech].filter(Boolean); // handle 1 atau lebih value
  const result = await db.query(
    `INSERT INTO public.work_experience (position, company, start_date, end_date, description, tech, image) 
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    Returning id`,
    [position, company, start_date, end_date, desc, techno, image]
  );
  const query = 'select * from public.work_experience';
  const results = await db.query(query);
  res.redirect('/dashboard')
})

// Tampilkan data (work experience)
app.get('/work/:id/detail' , checkLogin, async (req,res) =>{
  const {id} = req.params
  const result = await db.query(`
    SELECT * FROM public.work_experience WHERE id=$1`,
  [id]);
  const project = result.rows[0]

  const work = {
    ...project,
    start_date: project.start_date ? new Date(project.start_date).toISOString().slice(0, 10) : '',
    end_date: project.end_date ? new Date(project.end_date).toISOString().slice(0, 10) : ''
  };
  const user_active = req.session.user;
  res.render('work-edit', {work, user_active})
})

//update data (work experience)
app.post('/work/:id/detail', upload.single('image'), async (req,res) =>{
  const {id} = req.params
  let {position, company, start_date, end_date, description, tech} = req.body
  const image = req.file ? `${req.file.filename}` : null;
  const desc = Array.isArray(description)
    ? description
    : [description].filter(Boolean); // handle 1 atau lebih value
  const techno = Array.isArray(tech)
    ? tech
    : [tech].filter(Boolean); // handle 1 atau lebih value
  const insertResult = await db.query(
    `UPDATE public.work_experience
     SET  position = $1,
          company = $2,
          start_date = $3,
          end_date = $4,
          description = $5,
          tech = $6,
          image = COALESCE ($7, image) 
     WHERE id =$8;`,
    [position, company, start_date, end_date, desc, techno,image, id]
  );
  res.redirect('/dashboard')
})

//delete (work experience)
app.get('/work/delete/:id', async (req, res) => {
  const { id } = req.params
  const result = await db.query('DELETE FROM public.work_experience WHERE id = $1', [id]); 
  res.redirect('/dashboard');
});

//upload data (portofolio)
app.post('/portofolio', upload.single('image'), async (req,res) =>{
  let {name, description, tech, git, demo} = req.body
  const image = req.file ? `${req.file.filename}` : null;
  const techno = Array.isArray(tech)
    ? tech
    : [tech].filter(Boolean); // handle 1 atau lebih value
  const result = await db.query(
    `INSERT INTO public.portofolio (name, description, techno, git_url, demo_url, image) 
    VALUES ($1,$2,$3,$4,$5,$6)`,
    [name, description, techno, git, demo, image]
  );
  res.redirect('/dashboard')
})

//tampikan data (portofolio)
app.get('/portofolio/:id/detail' , checkLogin, async (req,res) =>{
  const {id} = req.params
  const result = await db.query(`
    SELECT * FROM public.portofolio WHERE id=$1`,
  [id]);
  const portofolio = result.rows
  const user_active = req.session.user;
  res.render('portofolio-edit', {portofolio, user_active})
})

// update data (portofolio)
app.post('/portofolio/:id/detail', upload.single('image'), async (req,res) =>{
  const {id} = req.params
  let {name, description, tech, git, demo} = req.body
  const image = req.file ? `${req.file.filename}` : null;
  const techno = Array.isArray(tech)
    ? tech
    : [tech].filter(Boolean); // handle 1 atau lebih value
  const insertResult = await db.query(
    `UPDATE public.portofolio
     SET  name = $1,
          description = $2,
          techno = $3,
          git_url = $4,
          demo_url = $5,
          image = COALESCE ($6, image) 
     WHERE id =$7;`,
    [name, description, techno, git, demo, image, id]
  );
  res.redirect('/dashboard')
})

//delete (portofolio)
app.get('/portofolio/delete/:id', async (req, res) => {
  const { id } = req.params
  const result = await db.query('DELETE FROM public.portofolio WHERE id = $1', [id]); 
  res.redirect('/dashboard');
});

//update data (profil)
app.post('/profil', upload.single('image'), async (req,res) =>{
  let {id, email, password, name, profession, description, location, link_location, link_wa, link_cv} = req.body
  const image = req.file ? `${req.file.filename}` : null;
  let hashPassword = null;
    if (password && password.trim() !== '') {
    hashPassword = await bcrypt.hash(password, 10);
  }
  const insertResult = await db.query(
    `UPDATE public.user_app
     SET  email = $1,
          password = COALESCE ($2, password),
          name = $3,
          profession = $4,
          description = $5,
          link_location = $6,
          link_wa = $7,
          link_cv = $8,
          location = $9,
          image = COALESCE ($10, image) 
     WHERE id =$11;`,
    [email, hashPassword, name, profession, description, link_location, link_wa, link_cv, location, image, id]
  );
  res.redirect('/dashboard')
})

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}/`);
  });
}

module.exports = app;
module.exports.handler = serverless(app);