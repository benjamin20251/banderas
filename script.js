import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://drabigponnfztvbdxsjc.supabase.co'
const supabaseKey = 'sb_publishable_gHdyPfSabCkNEblGZI8mWg_qMnr4IKb'
const supabase = createClient(supabaseUrl, supabaseKey)

document.getElementById('img-principal').src = supabaseUrl + '/storage/v1/object/public/imagenes/banderas.jpg'

// Productos ejemplo
const productosData = [
  { productos:'Canada', peso_gramos:3 },
  { productos:'Mexico', peso_gramos:5 },
  { productos:'Chile', peso_gramos:5 },
  { productos:'Estados Unidos', peso_gramos:5 },
  { productos:'Argentina', peso_gramos:5 },
  { productos:'Japon', peso_gramos:4 },
  { productos:'Ucrania', peso_gramos:4 },
  { productos:'Uruguay', peso_gramos:5 },
  { productos:'Paraguay', peso_gramos:4 },
  { productos:'Jamaica', peso_gramos:5 },
  { productos:'Brasil', peso_gramos:6 },
  { productos:'Suecia', peso_gramos:5 }
]

const preciosEspeciales = ['Uruguay','Argentina','Brasil']

const cont = document.getElementById('productos')
const carrito = []
const lista = document.getElementById('lista-carrito')
const totalSpan = document.getElementById('total')

function calcularPrecio(p) {
  if(preciosEspeciales.includes(p.productos)) return 100
  return 50
}

function renderCarrito(){
  lista.innerHTML=''
  let total=0
  carrito.forEach(p=>{
    const li=document.createElement('li')
    li.textContent=`${p.productos} - $${p.precio}`
    lista.appendChild(li)
    total+=p.precio
  })
  totalSpan.textContent=total
}

// Render productos
productosData.forEach(p=>{
  const precio = calcularPrecio(p)
  const card = document.createElement('div')
  card.className='card'
  card.innerHTML=`
    <h3>${p.productos}</h3>
    <p>Peso: ${p.peso_gramos} g</p>
    <p class="precio">$${precio}</p>
    <button>Agregar al carrito</button>
  `
  card.querySelector('button').onclick=()=>{
    carrito.push({...p, precio})
    renderCarrito()
  }
  cont.appendChild(card)
})

// Ordenar
document.getElementById('ordenar').onclick=()=>{
  if(carrito.length===0){
    alert('Carrito vacío')
    return
  }
  alert('Pedido registrado. Contactame por WhatsApp para coordinar pago en efectivo.')
  carrito.length=0
  renderCarrito()
}

// Botón carrito
document.getElementById('btn-carrito').onclick=()=>{
  document.getElementById('zona-carrito').scrollIntoView({behavior:'smooth'})
}

// Personalizados: solo jpg, jpeg, gif
document.getElementById('enviar-personalizado').onclick=()=>{
  const fileInput = document.getElementById('img-personalizada')
  const file = fileInput.files[0]
  if(!file){
    alert('Selecciona una imagen')
    return
  }
  const validTypes = ['image/jpeg','image/jpg','image/gif']
  if(!validTypes.includes(file.type)){
    alert('Solo se permiten archivos JPG o GIF')
    fileInput.value=''
    return
  }
  alert('Pedido personalizado registrado. Te contactaremos por WhatsApp.')
  fileInput.value=''
}
