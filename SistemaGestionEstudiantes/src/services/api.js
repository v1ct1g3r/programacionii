/*
  api.js
  Este archivo configura la instancia principal de Axios para realizar peticiones HTTP.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  En un proyecto real, Axios enviaría peticiones a un servidor backend (ej: node.js o python) en internet.
  Como no tenemos un servidor backend corriendo por separado, hemos configurado un "Adaptador Personalizado"
  (Custom Adapter) en Axios. Este adaptador intercepta las peticiones y en su lugar lee/escribe en el 
  almacenamiento del navegador (localStorage), simulando un retraso de red de 500 milisegundos con 'setTimeout'.
  
  ¡De esta forma el código del resto del proyecto usa Axios de manera normal y real, pero funciona offline!
*/

import axios from 'axios';

// --- DATOS SEMILLA (Seed Data) ---
// Si el localStorage está vacío, llenamos estos datos para que la app no empiece en blanco.
const inicializarDatosSemilla = () => {
  if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify([
      { id: '1', email: 'profesor@colegio.edu', nombre: 'Prof. Carlos Ortega', password: 'admin123', rol: 'Docente Principal' }
    ]));
  }

  if (!localStorage.getItem('cursos')) {
    localStorage.setItem('cursos', JSON.stringify([
      { id: '1', codigo: 'MAT101', nombre: 'Matemáticas Avanzadas', aula: 'Piso 2 - Aula A', docente: 'Prof. Carlos Ortega' },
      { id: '2', codigo: 'FIS102', nombre: 'Física Clásica', aula: 'Laboratorio de Ciencias', docente: 'Prof. Carlos Ortega' },
      { id: '3', codigo: 'PROG104', nombre: 'Programación en React', aula: 'Piso 1 - Aula de Computación', docente: 'Prof. Carlos Ortega' }
    ]));
  }

  if (!localStorage.getItem('estudiantes')) {
    localStorage.setItem('estudiantes', JSON.stringify([
      { id: '101', nombre: 'Juan Pérez', matricula: 'EST-2026-001', email: 'juan.perez@email.com', telefono: '555-0199' },
      { id: '102', nombre: 'María Gómez', matricula: 'EST-2026-002', email: 'maria.gomez@email.com', telefono: '555-0182' },
      { id: '103', nombre: 'Carlos Rodríguez', matricula: 'EST-2026-003', email: 'carlos.rod@email.com', telefono: '555-0143' }
    ]));
  }

  if (!localStorage.getItem('calificaciones')) {
    localStorage.setItem('calificaciones', JSON.stringify([
      // Notas para Juan Pérez (101)
      { id: 'g1', estudianteId: '101', cursoId: '1', nota: 8.5 },
      { id: 'g2', estudianteId: '101', cursoId: '2', nota: 9.0 },
      { id: 'g3', estudianteId: '101', cursoId: '3', nota: 7.5 },
      // Notas para María Gómez (102)
      { id: 'g4', estudianteId: '102', cursoId: '1', nota: 9.5 },
      { id: 'g5', estudianteId: '102', cursoId: '2', nota: 10.0 },
      { id: 'g6', estudianteId: '102', cursoId: '3', nota: 9.8 },
      // Notas para Carlos Rodríguez (103)
      { id: 'g7', estudianteId: '103', cursoId: '1', nota: 6.8 },
      { id: 'g8', estudianteId: '103', cursoId: '2', nota: 7.2 },
      { id: 'g9', estudianteId: '103', cursoId: '3', nota: 8.0 }
    ]));
  }
};

inicializarDatosSemilla();

// --- INSTANCIA DE AXIOS ---
const api = axios.create({
  baseURL: 'https://api.sistema-estudiantes.local/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- ADAPTADOR PERSONALIZADO PARA MOCKING ---
api.defaults.adapter = (config) => {
  return new Promise((resolve, reject) => {
    // Simulamos un retraso de red de 500ms
    setTimeout(() => {
      const { url, method, data } = config;
      const datosEnviados = data ? JSON.parse(data) : null;
      
      // Obtener colecciones actualizadas de localStorage
      const obtenerColeccion = (nombre) => JSON.parse(localStorage.getItem(nombre) || '[]');
      const guardarColeccion = (nombre, lista) => localStorage.setItem(nombre, JSON.stringify(lista));

      // Extraer parámetros de la URL
      // Ejemplo: '/estudiantes/101' -> split('/') -> ['', 'estudiantes', '101']
      const partesUrl = url.replace(config.baseURL, '').split('/').filter(Boolean);
      const recurso = partesUrl[0]; // 'estudiantes', 'cursos', 'calificaciones', 'auth'
      const idRecurso = partesUrl[1]; // el ID específico (ej: '101' o 'login')

      try {
        // ---- AUTENTICACIÓN ----
        if (recurso === 'auth') {
          if (idRecurso === 'login') {
            const usuarios = obtenerColeccion('usuarios');
            const usuarioEncontrado = usuarios.find(
              u => u.email === datosEnviados.email && u.password === datosEnviados.password
            );
            
            if (usuarioEncontrado) {
              const tokenSimulado = `token-jwt-simulado-para-${usuarioEncontrado.id}`;
              resolve({
                status: 200,
                statusText: 'OK',
                headers: {},
                config,
                data: { usuario: usuarioEncontrado, token: tokenSimulado }
              });
              return;
            } else {
              reject({
                response: {
                  status: 401,
                  statusText: 'Unauthorized',
                  data: { mensaje: 'Credenciales incorrectas. Intente nuevamente.' }
                }
              });
              return;
            }
          }
        }

        // ---- RECURSO: ESTUDIANTES ----
        if (recurso === 'estudiantes') {
          const estudiantes = obtenerColeccion('estudiantes');

          if (method === 'get') {
            if (idRecurso) {
              const estudiante = estudiantes.find(e => e.id === idRecurso);
              if (estudiante) {
                resolve({ status: 200, statusText: 'OK', headers: {}, config, data: estudiante });
              } else {
                reject({ response: { status: 404, statusText: 'Not Found', data: { mensaje: 'Estudiante no encontrado.' } } });
              }
            } else {
              resolve({ status: 200, statusText: 'OK', headers: {}, config, data: estudiantes });
            }
            return;
          }

          if (method === 'post') {
            const nuevoEstudiante = {
              ...datosEnviados,
              id: Date.now().toString(), // Generamos un ID único numérico
              matricula: `EST-2026-${Math.floor(100 + Math.random() * 900)}` // Matrícula aleatoria
            };
            estudiantes.push(nuevoEstudiante);
            guardarColeccion('estudiantes', estudiantes);
            resolve({ status: 201, statusText: 'Created', headers: {}, config, data: nuevoEstudiante });
            return;
          }

          if (method === 'put' && idRecurso) {
            const index = estudiantes.findIndex(e => e.id === idRecurso);
            if (index !== -1) {
              estudiantes[index] = { ...estudiantes[index], ...datosEnviados };
              guardarColeccion('estudiantes', estudiantes);
              resolve({ status: 200, statusText: 'OK', headers: {}, config, data: estudiantes[index] });
            } else {
              reject({ response: { status: 404, statusText: 'Not Found', data: { mensaje: 'Estudiante no encontrado.' } } });
            }
            return;
          }

          if (method === 'delete' && idRecurso) {
            const index = estudiantes.findIndex(e => e.id === idRecurso);
            if (index !== -1) {
              const estudianteEliminado = estudiantes.splice(index, 1)[0];
              guardarColeccion('estudiantes', estudiantes);

              // Eliminar también las calificaciones asociadas a este estudiante
              const calificaciones = obtenerColeccion('calificaciones');
              const calificacionesFiltradas = calificaciones.filter(c => c.estudianteId !== idRecurso);
              guardarColeccion('calificaciones', calificacionesFiltradas);

              resolve({ status: 200, statusText: 'OK', headers: {}, config, data: estudianteEliminado });
            } else {
              reject({ response: { status: 404, statusText: 'Not Found', data: { mensaje: 'Estudiante no encontrado.' } } });
            }
            return;
          }
        }

        // ---- RECURSO: CURSOS ----
        if (recurso === 'cursos') {
          const cursos = obtenerColeccion('cursos');

          if (method === 'get') {
            if (idRecurso) {
              const curso = cursos.find(c => c.id === idRecurso);
              if (curso) {
                resolve({ status: 200, statusText: 'OK', headers: {}, config, data: curso });
              } else {
                reject({ response: { status: 404, statusText: 'Not Found', data: { mensaje: 'Curso no encontrado.' } } });
              }
            } else {
              resolve({ status: 200, statusText: 'OK', headers: {}, config, data: cursos });
            }
            return;
          }
        }

        // ---- RECURSO: CALIFICACIONES ----
        if (recurso === 'calificaciones') {
          const calificaciones = obtenerColeccion('calificaciones');

          if (method === 'get') {
            // Filtrar calificaciones por curso o estudiante si vienen en los parámetros
            // Como simulamos la URL, podemos verificar parámetros simples o pasar todas
            resolve({ status: 200, statusText: 'OK', headers: {}, config, data: calificaciones });
            return;
          }

          if (method === 'post') {
            // Guardar o actualizar calificaciones
            // Si ya existe calificación para el estudiante en ese curso, la actualiza. Si no, la crea.
            const index = calificaciones.findIndex(
              c => c.estudianteId === datosEnviados.estudianteId && c.cursoId === datosEnviados.cursoId
            );

            if (index !== -1) {
              calificaciones[index].nota = parseFloat(datosEnviados.nota);
              guardarColeccion('calificaciones', calificaciones);
              resolve({ status: 200, statusText: 'OK', headers: {}, config, data: calificaciones[index] });
            } else {
              const nuevaCalificacion = {
                id: Date.now().toString(),
                estudianteId: datosEnviados.estudianteId,
                cursoId: datosEnviados.cursoId,
                nota: parseFloat(datosEnviados.nota)
              };
              calificaciones.push(nuevaCalificacion);
              guardarColeccion('calificaciones', calificaciones);
              resolve({ status: 201, statusText: 'Created', headers: {}, config, data: nuevaCalificacion });
            }
            return;
          }
        }

        // RUTA NO ENCONTRADA
        reject({
          response: {
            status: 404,
            statusText: 'Not Found',
            data: { mensaje: 'Ruta simulada no implementada en el adaptador.' }
          }
        });

      } catch (error) {
        reject({
          response: {
            status: 500,
            statusText: 'Internal Server Error',
            data: { mensaje: error.message }
          }
        });
      }
    }, 500);
  });
};

export default api;
