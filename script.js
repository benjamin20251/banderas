import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Configuración Supabase
const supabaseUrl = 'https://drabigponnfztvbdxsjc.supabase.co'
const supabaseKey = 'sb_publishable_gHdyPfSabCkNEblGZI8mWg_qMnr4IKb'
const supabase = createClient(supabaseUrl, supabaseKey)

// Imagen principal
document.getElementById('img-principal').src =
  supabaseUrl + '/storage/v1/object/public/imagenes/banderas.jpg'

// Precios
function calcularPrecio(peso, pais){
  if(['Uruguay','Argentina','Brasil'].includes(pais)) return 100
  return 50
}

// Carrito
const carrito = []
const lista = document.getElementById('lista-carrito')
const totalSpan = document.getElementById('total')

// Render carrito
function renderCarrito(){
  lista.innerHTML = ''
  let total = 0
  carrito.forEach(p => {
    const li = document.createElement('li')
    li.textContent = `${p.productos} - $${p.precio}`
    lista.appendChild(li)
    total += p.precio
  })
  totalSpan.textContent = total
}

// Cargar productos
async function cargarProductos(){
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*')
    .eq('stock', true)

  if(error){ console.error(error); return }

  const cont = document.getElementById('productos')
  cont.innerHTML = ''

  productos.forEach(p => {
    const precio = calcularPrecio(p.peso_gramos, p.productos)

    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <h3>${p.productos}</h3>
      <p>Peso: ${p.peso_gramos} g</p>
      <p class="precio">$${precio}</p>
      <button>Agregar al carrito</button>
    `
    card.querySelector('button').onclick = () => {
      carrito.push({...p, precio})
      renderCarrito()
    }

    cont.appendChild(card)
  })
}
cargarProductos()

// Ordenar productos
document.getElementById('ordenar').onclick = async () => {
  if(carrito.length===0){ alert('Carrito vacío'); return }

  for(const p of carrito){
    await supabase.from('ordenes').insert({
      producto:p.productos,
      peso_gramos:p.peso_gramos,
      activo:true
    })
    await supabase.from('productos').update({stock:false}).eq('productos',p.productos)
  }

  alert('Pedido registrado. Contactame por WhatsApp.')
  location.reload()
}

// Botón carrito
document.getElementById('btn-carrito').onclick = ()=>{
  document.getElementById('zona-carrito').scrollIntoView({behavior:'smooth'})
}

// Personalizados
document.getElementById('form-personalizados').onsubmit = async e=>{
  e.preventDefault()
  const fileInput = document.getElementById('archivo-personalizado')
  const file = fileInput.files[0]
  if(!file) return alert('Selecciona un archivo')

  const ext = file.name.split('.').pop().toLowerCase()
  if(!['jpg','jpeg','png','gif'].includes(ext)) return alert('Solo se permiten imágenes')

  const nombre = `${Date.now()}-${file.name}`
  const { error: err } = await supabase.storage.from('personalizados').upload(nombre,file)
  if(err) return alert('Error subiendo archivo')

  await supabase.from('ordenes_personalizadas').insert({
    archivo: nombre,
    pagado:true
  })

  alert('Imagen subida y orden registrada')
  fileInput.value = ''
}
