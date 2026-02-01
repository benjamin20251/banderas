import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://drabigponnfztvbdxsjc.supabase.co'
const supabaseKey = 'sb_publishable_gHdyPfSabCkNEblGZI8mWg_qMnr4IKb'
const supabase = createClient(supabaseUrl, supabaseKey)

const formPersonalizado = document.getElementById('form-personalizado')
const fileInput = document.getElementById('file-personalizado')

formPersonalizado.addEventListener('submit', async (e) => {
  e.preventDefault()
  const file = fileInput.files[0]

  if (!file) return alert('Selecciona un archivo')
  
  // Validar extensión
  const ext = file.name.split('.').pop().toLowerCase()
  if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
    return alert('Solo se permiten imágenes JPG, JPEG, PNG o GIF')
  }

  // Crear un nombre único
  const timestamp = Date.now()
  const nombreArchivo = `${timestamp}-${file.name}`

  try {
    // Subir archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('personalizados')
      .upload(nombreArchivo, file, { cacheControl: '3600', upsert: false })

    if (uploadError) throw uploadError

    // Guardar registro en la tabla
    const { data, error: insertError } = await supabase
      .from('ordenes_personalizadas')
      .insert({
        archivo: nombreArchivo,
        pagado: true,       // booleano real
        fecha: new Date().toISOString()
      })

    if (insertError) throw insertError

    alert('Tu pedido personalizado se ha registrado correctamente.')
    formPersonalizado.reset()

  } catch (err) {
    console.error(err)
    alert('Error al subir tu archivo. Verifica tu conexión o los permisos en Supabase.')
  }
})
