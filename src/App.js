import React, { useState, useEffect } from 'react';
import { School, User, Phone, Mail, Save, List, Edit2, Trash2, X, Check, Search } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    nombreIE: '',
    nombreDirector: '',
    telefono: '',
    correo: ''
  });

  const [instituciones, setInstituciones] = useState([]);
  const [editando, setEditando] = useState(null);
  const [vistaActual, setVistaActual] = useState('formulario');
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const datosGuardados = localStorage.getItem('instituciones');
    if (datosGuardados) {
      setInstituciones(JSON.parse(datosGuardados));
    }
  }, []);

  useEffect(() => {
    if (instituciones.length > 0) {
      localStorage.setItem('instituciones', JSON.stringify(instituciones));
    }
  }, [instituciones]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreIE.trim()) {
      nuevosErrores.nombreIE = 'El nombre de la institución es requerido';
    }

    if (!formData.nombreDirector.trim()) {
      nuevosErrores.nombreDirector = 'El nombre del director es requerido';
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    } else if (!/^\d{9}$/.test(formData.telefono.replace(/\s/g, ''))) {
      nuevosErrores.telefono = 'Ingrese un número válido de 9 dígitos';
    }

    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      nuevosErrores.correo = 'Ingrese un correo electrónico válido';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = () => {
    if (!validarFormulario()) return;

    if (editando !== null) {
      const instituciones_actualizadas = [...instituciones];
      instituciones_actualizadas[editando] = { ...formData, id: instituciones[editando].id };
      setInstituciones(instituciones_actualizadas);
      setMensaje({ tipo: 'success', texto: '✓ Institución actualizada exitosamente' });
      setEditando(null);
    } else {
      const nuevaInstitucion = { ...formData, id: Date.now().toString() };
      setInstituciones([...instituciones, nuevaInstitucion]);
      setMensaje({ tipo: 'success', texto: '✓ Institución registrada exitosamente' });
    }

    setFormData({
      nombreIE: '',
      nombreDirector: '',
      telefono: '',
      correo: ''
    });

    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
  };

  const handleEditar = (index) => {
    setFormData(instituciones[index]);
    setEditando(index);
    setVistaActual('formulario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = (index) => {
    if (window.confirm('¿Está seguro de eliminar esta institución?')) {
      const nuevasInstituciones = instituciones.filter((_, i) => i !== index);
      setInstituciones(nuevasInstituciones);
      if (nuevasInstituciones.length === 0) {
        localStorage.removeItem('instituciones');
      }
      setMensaje({ tipo: 'success', texto: '✓ Institución eliminada' });
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
    }
  };

  const cancelarEdicion = () => {
    setFormData({
      nombreIE: '',
      nombreDirector: '',
      telefono: '',
      correo: ''
    });
    setEditando(null);
    setErrors({});
  };

  const institucionesFiltradas = instituciones.filter(ie => {
    const termino = busqueda.toLowerCase();
    return (
      ie.nombreIE.toLowerCase().includes(termino) ||
      ie.nombreDirector.toLowerCase().includes(termino) ||
      ie.telefono.includes(termino) ||
      ie.correo.toLowerCase().includes(termino)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <School className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Sistema de Registro de Instituciones Educativas Públicas UGEL 06
          </h1>
          <p className="text-gray-600">Gestione la información de las instituciones educativas</p>
        </div>

        {mensaje.texto && (
          <div className={`mb-6 p-4 rounded-lg shadow-md ${mensaje.tipo === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
            'bg-red-100 border-l-4 border-red-500 text-red-700'
            }`}>
            {mensaje.texto}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setVistaActual('formulario')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${vistaActual === 'formulario'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            <Save className="inline-block w-5 h-5 mr-2" />
            Registrar IE
          </button>

          <button
            onClick={() => setVistaActual('lista')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${vistaActual === 'lista'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            <List className="inline-block w-5 h-5 mr-2" />
            Ver Registros ({instituciones.length})
          </button>
        </div>

        {/* FORMULARIO */}
        {vistaActual === 'formulario' && (
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editando !== null ? 'Editar Institución' : 'Nueva Institución'}
            </h2>

            <div className="space-y-6">

              {/* Nombre IE */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <School className="w-4 h-4 mr-2 text-indigo-600" />
                  Nombre de la Institución Educativa
                </label>
                <input
                  type="text"
                  name="nombreIE"
                  value={formData.nombreIE}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.nombreIE ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Ej: I.E. José María Arguedas"
                />
                {errors.nombreIE && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombreIE}</p>
                )}
              </div>

              {/* Director */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-indigo-600" />
                  Nombre del Director
                </label>
                <input
                  type="text"
                  name="nombreDirector"
                  value={formData.nombreDirector}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.nombreDirector ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Ej: María González Pérez"
                />
                {errors.nombreDirector && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombreDirector}</p>
                )}
              </div>

              {/* Telefono */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Ej: 987654321"
                />
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                )}
              </div>

              {/* Correo */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.correo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Ej: director@institucion.edu.pe"
                />
                {errors.correo && (
                  <p className="mt-1 text-sm text-red-600">{errors.correo}</p>
                )}
              </div>

              {/* BOTONES */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {editando !== null ? 'Actualizar' : 'Registrar'}
                </button>

                {editando !== null && (
                  <button
                    onClick={cancelarEdicion}
                    className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancelar
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* LISTA */}
        {vistaActual === 'lista' && (
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Instituciones Registradas
            </h2>

            {/* BUSCADOR */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre de IE, director, teléfono o correo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Mostrando {institucionesFiltradas.length} de {instituciones.length} instituciones
              </p>
            </div>

            {/* LISTA DE REGISTROS */}
            {institucionesFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {busqueda ? 'No se encontraron resultados para tu búsqueda' : 'No hay instituciones registradas'}
                </p>

                {busqueda ? (
                  <button
                    onClick={() => setBusqueda('')}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Limpiar búsqueda
                  </button>
                ) : (
                  <button
                    onClick={() => setVistaActual('formulario')}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Registrar la primera institución
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {institucionesFiltradas.map((ie, index) => {
                  const indiceOriginal = instituciones.findIndex(inst => inst.id === ie.id);
                  return (
                    <div
                      key={ie.id || index}
                      className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">

                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-bold text-gray-900 flex items-center">
                            <School className="w-5 h-5 mr-2 text-indigo-600" />
                            {ie.nombreIE}
                          </h3>
                          <p className="text-gray-600 flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="font-medium">Director:</span>&nbsp;{ie.nombreDirector}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {ie.telefono}
                          </p>
                          <p className="text-gray-600 flex items-center break-all">
                            <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            {ie.correo}
                          </p>
                        </div>

                        <div className="flex sm:flex-col gap-2">
                          <button
                            onClick={() => handleEditar(indiceOriginal)}
                            className="flex-1 sm:flex-none bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                          >
                            <Edit2 className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Editar</span>
                          </button>

                          <button
                            onClick={() => handleEliminar(indiceOriginal)}
                            className="flex-1 sm:flex-none bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Eliminar</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Programador Christian J.</p>
        </div>

      </div>
    </div>
  );
}

export default App;
