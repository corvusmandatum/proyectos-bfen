document.addEventListener('DOMContentLoaded', function() {
    const taskMenu = document.getElementById('task-menu');
    const taskContent = document.getElementById('task-content');
    const progressToggle = document.getElementById('progress-toggle');
    const controlToggle = document.getElementById('control-toggle');

    // --- STATE ---
    let currentView = 'description'; // 'description' or 'progress'
    let selectedTask = null; // Will hold the data key of the selected task
    let selectedProjectData = null;
    let scheduleDataGlobal = null;

    // --- DATA ---
    const data =
{
    "Proyecto INDEX": {
        "Fase 1.1: Escaneo y Digitalización del Índice": {
            "Actividad 1.1.1": {
                "title": "Selección de la colección a indexar",
                "goal": "Identificar y preparar todos los libros con índices temáticos para el proceso de digitalización.",
                "description": {
                    "approach": "Revisar el acervo e identificar los libros impresos que requieren indexación de contenido.",
                    "development": "Crear un listado de control para el seguimiento de la colección seleccionada.",
                    "product": "Listado maestro de libros a digitalizar."
                }
            },
            "Actividad 1.1.2": {
                "title": "Escaneo de alta resolución de índices",
                "goal": "Crear imágenes digitales de alta calidad de los índices temáticos.",
                "description": {
                    "approach": "Utilizar escáneres planos o de cámara con configuración de alta resolución para capturar el texto.",
                    "development": "Estandarizar el formato de imagen de salida (Ej. TIFF o PNG).",
                    "product": "Archivos de imagen (.tif/.png) por cada índice temático."
                }
            },
            "Actividad 1.1.3": {
                "title": "Almacenamiento y organización de imágenes",
                "goal": "Asegurar el resguardo y fácil acceso a los archivos escaneados.",
                "description": {
                    "approach": "Establecer una estructura de carpetas jerárquica en el servidor (Ej. por Clasificación/Identificador).",
                    "development": "Realizar copias de seguridad de las imágenes digitales.",
                    "product": "Imágenes organizadas en el servidor de la biblioteca."
                }
            }
        },
        "Fase 1.2: Reconocimiento Óptico de Caracteres (OCR) y Limpieza de Datos": {
            "Actividad 1.2.1": {
                "title": "Aplicación de software OCR a las imágenes",
                "goal": "Convertir las imágenes de índice en texto editable.",
                "description": {
                    "approach": "Procesar los archivos de imagen a través del software OCR seleccionado.",
                    "development": "Ajustar la configuración de OCR para optimizar el reconocimiento de caracteres.",
                    "product": "Archivos de texto (.txt/.docx) con el contenido del índice."
                }
            },
            "Actividad 1.2.2": {
                "title": "Revisión y corrección manual del texto",
                "goal": "Eliminar errores de OCR para asegurar la precisión del índice temático.",
                "description": {
                    "approach": "Comparar manualmente el texto generado por OCR con la imagen original.",
                    "development": "Corregir erratas, formato y caracteres mal reconocidos.",
                    "product": "Archivos de texto limpios y verificados."
                }
            },
            "Actividad 1.2.3": {
                "title": "Normalización de términos y vocabulario controlado",
                "goal": "Estandarizar la terminología para facilitar la búsqueda unificada.",
                "description": {
                    "approach": "Identificar sinónimos y variaciones de términos para crear un vocabulario controlado inicial.",
                    "development": "Aplicar las reglas de normalización a todo el corpus de texto.",
                    "product": "Lista de términos normalizados aplicada a los datos."
                }
            }
        },
        "Fase 1.3: Captura, Estructura de Datos y Codificación": {
            "Actividad 1.3.1": {
                "title": "Diseño y creación de la hoja de cálculo en Google Sheets",
                "goal": "Establecer la estructura de datos final para la captura de información.",
                "description": {
                    "approach": "Diseñar columnas para: Identificador de Libro, Término Temático, Rango de Páginas, Notas de Codificación, etc.",
                    "development": "Crear la plantilla de Google Sheets con las validaciones de datos necesarias.",
                    "product": "Plantilla de Google Sheets lista para la captura."
                }
            },
            "Actividad 1.3.2": {
                "title": "Captura final de la información estructurada",
                "goal": "Ingresar los datos limpios y normalizados en la hoja de cálculo.",
                "description": {
                    "approach": "Migrar los términos temáticos y sus referencias de página al formato de Google Sheets.",
                    "development": "Asegurar que cada término esté vinculado al registro bibliográfico de origen.",
                    "product": "Hoja de cálculo poblada con el índice temático estructurado."
                }
            },
            "Actividad 1.3.3": {
                "title": "Definición e implementación del esquema de codificación",
                "goal": "Aplicar un estándar (Ej. MARC21, Dublin Core) a la nueva información temático-analítica.",
                "description": {
                    "approach": "Definir campos específicos para la extensión de metadatos del índice.",
                    "development": "Codificar un script o proceso para exportar los datos en el nuevo esquema.",
                    "product": "Reglas de codificación y script de exportación definidos."
                }
            }
        },
        "Fase 1.4: Integración y Despliegue del Catálogo Alternativo": {
            "Actividad 1.4.1": {
                "title": "Desarrollo de la interfaz alternativa de consulta",
                "goal": "Crear una plataforma que pueda consumir y mostrar los datos del Google Sheets.",
                "description": {
                    "approach": "Desarrollar una aplicación web ligera o una extensión del catálogo que lea la API de Google Sheets.",
                    "development": "Codificar la lógica de búsqueda por términos de índice temático.",
                    "product": "Interfaz de consulta web funcional."
                }
            },
            "Actividad 1.4.2": {
                "title": "Vinculación de registros y catálogo original",
                "goal": "Conectar los nuevos datos temáticos con los registros existentes en el sistema bibliotecario.",
                "description": {
                    "approach": "Utilizar el ISBN o un ID de control único para mapear el registro de Google Sheets al catálogo principal.",
                    "development": "Implementar un enlace directo desde el catálogo principal a la información temático-analítica.",
                    "product": "Conexión de datos verificada y operativa."
                }
            },
            "Actividad 1.4.3": {
                "title": "Pruebas de funcionalidad y validación de búsqueda",
                "goal": "Asegurar que los usuarios puedan buscar y encontrar temas específicos dentro de los libros.",
                "description": {
                    "approach": "Realizar pruebas unitarias y de integración de la nueva función de búsqueda.",
                    "development": "Validar que la búsqueda por índice temático arroje resultados precisos con la página exacta del libro.",
                    "product": "Reporte de pruebas de funcionalidad completadas."
                }
            }
        }
    },
    "Proyecto ENLACE": {
        "Fase 2.1: Recopilación de Información de Programas": {
            "Actividad 2.1.1": {
                "title": "Redacción y envío de oficio de solicitud de bibliografía",
                "goal": "Obtener de manera formal los listados de bibliografía por asignatura.",
                "description": {
                    "approach": "Elaborar un oficio dirigido a la dirección académica o jefes de departamento, detallando la necesidad y el objetivo del proyecto.",
                    "development": "Enviar el documento de solicitud a los departamentos correspondientes y establecer una fecha límite de respuesta.",
                    "product": "Oficio enviado y confirmación de recepción."
                }
            },
            "Actividad 2.1.2": {
                "title": "Recepción y consolidación de listados",
                "goal": "Unificar la información bibliográfica recibida de las diferentes áreas.",
                "description": {
                    "approach": "Recopilar los listados y crear una hoja de cálculo maestra para el seguimiento.",
                    "development": "Verificar que la información de cada asignatura esté completa (título, autor, edición).",
                    "product": "Base de datos preliminar de bibliografía por asignatura."
                }
            },
            "Actividad 2.1.3": {
                "title": "Normalización y validación de datos bibliográficos",
                "goal": "Estandarizar los registros para facilitar la búsqueda en el catálogo.",
                "description": {
                    "approach": "Aplicar reglas de normalización a los títulos y autores (Ej. eliminar abreviaturas o formatos inconsistentes).",
                    "development": "Validar los datos contra una fuente externa (Ej. ISBNdb) para asegurar la precisión.",
                    "product": "Listados bibliográficos limpios y normalizados."
                }
            }
        },
        "Fase 2.2: Diseño e Ingreso de Datos a la Base": {
            "Actividad 2.2.1": {
                "title": "Diseño del modelo de base de datos",
                "goal": "Crear una estructura relacional que vincule asignaturas y libros.",
                "description": {
                    "approach": "Diseñar tablas para 'Asignaturas', 'Libros Programados', 'Libros Similares' y una tabla de relación muchos a muchos.",
                    "development": "Definir las claves primarias y foráneas para la integridad referencial.",
                    "product": "Diagrama Entidad-Relación (E-R) de la base de datos."
                }
            },
            "Actividad 2.2.2": {
                "title": "Carga inicial de registros de Asignaturas y Bibliografía",
                "goal": "Poblar la base de datos con los listados normalizados.",
                "description": {
                    "approach": "Importar los datos de asignaturas y bibliografía en las tablas correspondientes.",
                    "development": "Realizar una auditoría de datos para verificar que la importación fue exitosa.",
                    "product": "Base de datos poblada con registros iniciales."
                }
            },
            "Actividad 2.2.3": {
                "title": "Creación de la relación directa Asignatura-Libro Programado",
                "goal": "Vincular cada asignatura con los títulos programados y verificar su disponibilidad en catálogo.",
                "description": {
                    "approach": "Ejecutar un script de búsqueda del título programado en el catálogo de la biblioteca.",
                    "development": "Registrar el estatus de cobertura ('Disponible', 'No Disponible') en la tabla de relación.",
                    "product": "Relaciones directas Asignatura-Libro programado creadas."
                }
            }
        },
        "Fase 2.3: Desarrollo de la Lógica de Sugerencias": {
            "Actividad 2.3.1": {
                "title": "Definición de criterios para sugerencias",
                "goal": "Establecer las reglas para recomendar títulos 'similares'.",
                "description": {
                    "approach": "Determinar los campos de metadatos relevantes para la similitud (Clasificación CDU/LC, Descriptores del Proyecto Index, Materia).",
                    "development": "Documentar las reglas y umbrales de coincidencia (Ej. 70% de coincidencia en descriptores).",
                    "product": "Documento de Criterios de Sugerencia."
                }
            },
            "Actividad 2.3.2": {
                "title": "Implementación del algoritmo de sugerencia",
                "goal": "Codificar la lógica de sistema de recomendación.",
                "description": {
                    "approach": "Desarrollar un algoritmo de recomendación basado en contenido (Content-Based Filtering) para encontrar similitudes.",
                    "development": "Realizar pruebas unitarias del algoritmo con un conjunto de datos conocido.",
                    "product": "Módulo de recomendación de títulos similares."
                }
            },
            "Actividad 2.3.3": {
                "title": "Desarrollo de la función inversa Libro-Asignaturas Afines",
                "goal": "Permitir al usuario ver qué asignaturas se benefician de un libro.",
                "description": {
                    "approach": "Utilizar la misma lógica de criterios temáticos para mapear un libro a múltiples asignaturas (inversión de la relación).",
                    "development": "Codificar la consulta inversa que busca asignaturas cuyo temario coincide con el perfil del libro.",
                    "product": "Consulta inversa optimizada y funcional."
                }
            }
        },
        "Fase 2.4: Interfaz de Consulta y Pruebas": {
            "Actividad 2.4.1": {
                "title": "Codificación de la interfaz de consulta por Asignatura",
                "goal": "Crear la vista donde el usuario selecciona una asignatura y ve los libros.",
                "description": {
                    "approach": "Diseñar una interfaz de búsqueda por nombre de asignatura con un panel de resultados.",
                    "development": "Implementar la visualización de Libros Programados y el bloque de Sugerencias.",
                    "product": "Interfaz de consulta por Asignatura (Frontend)."
                }
            },
            "Actividad 2.4.2": {
                "title": "Codificación de la interfaz de consulta por Libro",
                "goal": "Crear la vista donde el usuario puede ver la relación inversa.",
                "description": {
                    "approach": "Diseñar una vista de detalle del libro que muestre la lista de 'Asignaturas que usan este libro'.",
                    "development": "Conectar el frontend con la función inversa desarrollada en 2.3.3.",
                    "product": "Interfaz de consulta por Libro (Frontend)."
                }
            },
            "Actividad 2.4.3": {
                "title": "Pruebas de usabilidad y cobertura",
                "goal": "Validar la experiencia de usuario y la calidad de las sugerencias.",
                "description": {
                    "approach": "Realizar sesiones de prueba con un grupo focal de docentes y estudiantes.",
                    "development": "Recopilar feedback sobre la relevancia de las sugerencias y la facilidad de uso.",
                    "product": "Reporte de Pruebas de Usabilidad y Cobertura."
                }
            }
        }
    },
    "Proyecto CRECE": {
        "Fase 3.1: Planificación y Levantamiento de Requerimientos": {
            "Actividad 3.1.1": {
                "title": "Levantamiento de requerimientos funcionales del sistema",
                "goal": "Documentar todas las funciones necesarias para Adquisición, Donación y Descarte.",
                "description": {
                    "approach": "Realizar entrevistas con el personal clave (Adquisiciones, Catalogación y Dirección).",
                    "development": "Crear la especificación de requerimientos de software (SRS).",
                    "product": "Documento SRS del sistema CRECE."
                }
            },
            "Actividad 3.1.2": {
                "title": "Análisis de la información de cobertura de proyectos previos",
                "goal": "Utilizar los datos de Index y Enlace para identificar necesidades de colección.",
                "description": {
                    "approach": "Importar y analizar los reportes de 'No Disponible' del Proyecto Enlace y las áreas débiles de Index.",
                    "development": "Generar un reporte de 'Necesidades de Adquisición Prioritarias por Área Temática/Asignatura'.",
                    "product": "Reporte de Necesidades de Colección."
                }
            },
            "Actividad 3.1.3": {
                "title": "Diseño de la base de datos para inventario, proveedores y presupuestos",
                "goal": "Estructurar la persistencia de datos del nuevo sistema.",
                "description": {
                    "approach": "Diseñar las tablas para proveedores, pedidos, presupuesto, donaciones y descarte, con vínculos al inventario principal.",
                    "development": "Definir las relaciones para el manejo de transacciones de presupuesto.",
                    "product": "Modelo de datos del Sistema CRECE."
                }
            }
        },
        "Fase 3.2: Desarrollo del Módulo de Adquisiciones y Proveedores": {
            "Actividad 3.2.1": {
                "title": "Codificación de la interfaz de registro de proveedores",
                "goal": "Crear la vista para gestionar la información de los proveedores.",
                "description": {
                    "approach": "Diseñar un formulario para ingresar datos del proveedor (Contacto, Historial, Especialidad).",
                    "development": "Implementar las funciones CRUD (Crear, Leer, Actualizar, Eliminar) para los registros de proveedores.",
                    "product": "Módulo de Proveedores funcional."
                }
            },
            "Actividad 3.2.2": {
                "title": "Implementación de la función de manejo de presupuesto",
                "goal": "Permitir el seguimiento del gasto en tiempo real.",
                "description": {
                    "approach": "Integrar un sistema de contabilidad básica para registrar el presupuesto asignado y el gasto comprometido/ejecutado.",
                    "development": "Codificar alertas cuando el gasto se acerque a un umbral definido.",
                    "product": "Funcionalidad de Presupuesto operativa."
                }
            },
            "Actividad 3.2.3": {
                "title": "Integración del criterio de prioridad de adquisición",
                "goal": "Establecer una métrica objetiva para la compra de títulos.",
                "description": {
                    "approach": "Crear un campo de 'Prioridad' que se calcula automáticamente basándose en la necesidad de cobertura (3.1.2) y la demanda de usuarios.",
                    "development": "Implementar el cálculo de porcentaje de importancia para cada solicitud de adquisición.",
                    "product": "Algoritmo de Priorización de Adquisiciones."
                }
            }
        },
        "Fase 3.3: Desarrollo de Módulos de Donaciones y Descarte": {
            "Actividad 3.3.1": {
                "title": "Desarrollo del formulario y flujo de donaciones",
                "goal": "Simplificar el proceso de registro y evaluación de donativos.",
                "description": {
                    "approach": "Crear un formulario para capturar los datos del donante y los títulos propuestos.",
                    "development": "Implementar un flujo de trabajo de 'Aceptación/Rechazo' basado en la política de colección.",
                    "product": "Módulo de Donaciones funcional."
                }
            },
            "Actividad 3.3.2": {
                "title": "Implementación del módulo de descarte y evaluación",
                "goal": "Automatizar la identificación y registro de materiales para descarte.",
                "description": {
                    "approach": "Codificar criterios de descarte (Ej. antigüedad, estado, número de copias, obsolescencia).",
                    "development": "Crear un reporte que sugiera automáticamente títulos para descarte según los criterios.",
                    "product": "Módulo de Descarte funcional."
                }
            },
            "Actividad 3.3.3": {
                "title": "Conexión y verificación del inventario actualizado",
                "goal": "Asegurar que CRECE trabaje con el inventario actual y la información de los otros proyectos.",
                "description": {
                    "approach": "Establecer la conexión de la base de datos de CRECE con la base de datos del inventario principal.",
                    "development": "Verificar que la verificación de cobertura de Enlace sea visible en el proceso de adquisición.",
                    "product": "Conexión de datos en tiempo real con inventario verificada."
                }
            }
        },
        "Fase 3.4: Pruebas y Despliegue Inicial": {
            "Actividad 3.4.1": {
                "title": "Pruebas de funcionalidad con usuarios reales",
                "goal": "Validar que el sistema cumpla con los requerimientos del personal.",
                "description": {
                    "approach": "Realizar pruebas de extremo a extremo de los flujos de Adquisición, Donación y Descarte.",
                    "development": "Registrar y resolver errores o fallos detectados por el personal.",
                    "product": "Reporte de Pruebas y Corrección de Errores (Bug fixing)."
                }
            },
            "Actividad 3.4.2": {
                "title": "Capacitación del personal de la biblioteca",
                "goal": "Asegurar que los usuarios puedan utilizar el sistema eficazmente.",
                "description": {
                    "approach": "Desarrollar manuales de usuario y realizar sesiones de formación prácticas.",
                    "development": "Evaluar la comprensión y el uso del sistema por parte del personal.",
                    "product": "Manuales de usuario y registro de capacitación."
                }
            },
            "Actividad 3.4.3": {
                "title": "Puesta en producción y monitoreo inicial",
                "goal": "Lanzar el sistema para su uso diario y garantizar la estabilidad.",
                "description": {
                    "approach": "Desplegar la aplicación en el entorno de producción de la biblioteca.",
                    "development": "Monitorear la estabilidad del servidor y la base de datos durante el primer mes de uso.",
                    "product": "Sistema CRECE en Producción."
                }
            }
        }
    },
    "Proyecto FEN-IA": {
        "Fase 4.1: Definición y Configuración de Infraestructura": {
            "Actividad 4.1.1": {
                "title": "Instalación y configuración del hardware en la sala",
                "goal": "Establecer el entorno físico para la interfaz de IA.",
                "description": {
                    "approach": "Adquirir y montar la pantalla grande y el PC/servidor local necesario.",
                    "development": "Configurar la red local y los permisos de acceso de la máquina.",
                    "product": "Infraestructura física instalada en la sala."
                }
            },
            "Actividad 4.1.2": {
                "title": "Selección e instalación del modelo de IA/LLM local",
                "goal": "Poner en funcionamiento el motor de lenguaje para la interacción.",
                "description": {
                    "approach": "Investigar y seleccionar un modelo de lenguaje grande (LLM) de código abierto adecuado para la ejecución local (Ej. Llama, Mistral).",
                    "development": "Instalar el software y realizar pruebas de rendimiento del modelo en el hardware local.",
                    "product": "Modelo LLM operativo en el servidor local."
                }
            },
            "Actividad 4.1.3": {
                "title": "Desarrollo de la API local de comunicación",
                "goal": "Crear el puente de comunicación entre la interfaz de usuario y el LLM.",
                "description": {
                    "approach": "Codificar una API RESTful local que reciba las consultas de la interfaz y las pase al modelo de IA.",
                    "development": "Asegurar el manejo de errores y la velocidad de respuesta de la API.",
                    "product": "API de Interacción Local de la IA."
                }
            }
        },
        "Fase 4.2: Integración de Datos Bibliotecarios": {
            "Actividad 4.2.1": {
                "title": "Conexión de la IA a los sistemas de gestión de usuarios",
                "goal": "Permitir a la IA responder consultas personalizadas sobre el usuario.",
                "description": {
                    "approach": "Establecer un canal de lectura segura (solo lectura) a la base de datos de usuarios (Ej. Módulo de Préstamos).",
                    "development": "Implementar las consultas para 'alta', 'préstamos', y 'multas'.",
                    "product": "Conexión segura a datos de usuario operativa."
                }
            },
            "Actividad 4.2.2": {
                "title": "Integración del catálogo y datos del Proyecto Index",
                "goal": "Mejorar la capacidad de búsqueda de la IA con información detallada.",
                "description": {
                    "approach": "Indexar el catálogo bibliográfico completo y los términos del Proyecto Index en el modelo de conocimiento de la IA (RAG).",
                    "development": "Asegurar que la IA pueda responder preguntas sobre temas internos de los libros.",
                    "product": "Índice de conocimiento (Knowledge Base) para la IA."
                }
            },
            "Actividad 4.2.3": {
                "title": "Integración de las sugerencias del Proyecto Enlace",
                "goal": "Habilitar la función de recomendación de libros por asignatura o tema.",
                "description": {
                    "approach": "Integrar el módulo de sugerencias de Enlace como una herramienta que la IA puede invocar.",
                    "development": "Asegurar que la IA interprete correctamente las asignaturas mencionadas por el usuario.",
                    "product": "Funcionalidad de Recomendación por Asignatura."
                }
            }
        },
        "Fase 4.3: Desarrollo de Funcionalidades y Entrenamiento": {
            "Actividad 4.3.1": {
                "title": "Codificación de la interfaz táctil de usuario",
                "goal": "Crear una experiencia de usuario intuitiva y atractiva para la pantalla grande.",
                "description": {
                    "approach": "Diseñar una interfaz con botones de consulta rápida (Ej. 'Mi Cuenta', 'Buscar Libro', 'Recomendaciones').",
                    "development": "Implementar el reconocimiento de voz para facilitar la interacción.",
                    "product": "Interfaz de Usuario FEN-IA (Frontend) completa."
                }
            },
            "Actividad 4.3.2": {
                "title": "Programación de las prompts y la lógica de interacción",
                "goal": "Definir el comportamiento de la IA ante las preguntas de los usuarios.",
                "description": {
                    "approach": "Crear 'prompts' de sistema para guiar a la IA en sus respuestas (tono, formato, fuentes de datos).",
                    "development": "Establecer reglas para manejar consultas complejas o fuera de contexto.",
                    "product": "Lógica de Interacción (Prompt Engineering) implementada."
                }
            },
            "Actividad 4.3.3": {
                "title": "Entrenamiento/Ajuste fino del modelo de IA con políticas",
                "goal": "Personalizar la IA para que responda según las normas y el contexto de la biblioteca.",
                "description": {
                    "approach": "Ajustar el modelo (fine-tuning) utilizando un corpus de datos de políticas de préstamo, horarios y reglas de conducta.",
                    "development": "Evaluar la capacidad de la IA para manejar preguntas sobre multas o renovaciones de manera precisa.",
                    "product": "Modelo FEN-IA ajustado a las políticas de la biblioteca."
                }
            }
        },
        "Fase 4.4: Pruebas Finales y Despliegue en Sala": {
            "Actividad 4.4.1": {
                "title": "Pruebas exhaustivas de seguridad y funcionalidad",
                "goal": "Garantizar la protección de datos de usuario y la estabilidad del sistema.",
                "description": {
                    "approach": "Realizar pruebas de penetración y verificación de acceso a datos personales (solo lectura).",
                    "development": "Probar el sistema bajo carga de consultas intensivas para detectar fallos.",
                    "product": "Reporte de Pruebas de Seguridad y Estrés."
                }
            },
            "Actividad 4.4.2": {
                "title": "Pruebas de aceptación con usuarios (beta testing)",
                "goal": "Validar la utilidad y la precisión de las respuestas de la IA.",
                "description": {
                    "approach": "Invitar a un grupo de usuarios a interactuar libremente con el sistema y documentar sus consultas.",
                    "development": "Analizar las respuestas de la IA para identificar sesgos o errores de información.",
                    "product": "Feedback de usuarios y registro de interacciones."
                }
            },
            "Actividad 4.4.3": {
                "title": "Lanzamiento final y monitoreo continuo",
                "goal": "Puesta en servicio público y mantenimiento del sistema.",
                "description": {
                    "approach": "Lanzar FEN-IA en la sala de lectura de forma oficial.",
                    "development": "Establecer un proceso de monitoreo de *logs* para identificar patrones de error y nuevas necesidades de entrenamiento.",
                    "product": "Sistema FEN-IA en operación continua."
                }
            }
        }
    }
};

    // --- SCHEDULING LOGIC ---
    function calculateTaskSchedules(scheduleData) {
        const { workableDays, taskOrder, taskDurations } = scheduleData;

        const todayString = '2025-10-20';

        let workableDayIndex = workableDays.findIndex(day => day >= todayString);

        if (workableDayIndex === -1) {
            console.warn("No workable days found on or after today in schedule.json.");
            return;
        }

        const taskMap = new Map();
        Object.values(data).forEach(program => {
            Object.values(program).forEach(project => {
                Object.keys(project).forEach(taskKey => {
                    taskMap.set(taskKey, project[taskKey]);
                });
            });
        });

        taskOrder.forEach(taskKey => {
            const task = taskMap.get(taskKey);
            if (!task) return;

            const duration = taskDurations[taskKey];
            if (workableDayIndex < workableDays.length) {
                task.startDate = workableDays[workableDayIndex];
                const endIndex = workableDayIndex + duration - 1;
                task.endDate = workableDays[endIndex];
                task.workableDaysInRange = workableDays.slice(workableDayIndex, endIndex + 1);
                workableDayIndex = endIndex + 1;
            }
        });
    }


    // --- RENDER FUNCTIONS ---
    function renderMenu() {
        const menuHtml = `<ul>${Object.keys(data).map(program => `
            <li class="program">
                <span class="toggle">[+]</span> <span class="title">${program}</span>
                <ul>${Object.keys(data[program]).map(project => `
                    <li class="project" data-program="${program}" data-project="${project}">
                        <span class="toggle">[+]</span> <span class="title">${project}</span>
                        <ul>${Object.keys(data[program][project]).map(taskKey => `
                            <li class="task" data-program="${program}" data-project="${project}" data-task="${taskKey}">
                                ${taskKey}: ${data[program][project][taskKey].title}
                            </li>
                        `).join('')}</ul>
                    </li>
                `).join('')}</ul>
            </li>
        `).join('')}</ul>`;
        taskMenu.innerHTML = menuHtml;
    }

    function getProgressPercentage(itemName) {
        // Check if itemName is a program (e.g., "Proyecto INDEX")
        if (data[itemName]) {
            const programData = data[itemName];
            let programTotalPercentage = 0;
            const projectKeys = Object.keys(programData);

            projectKeys.forEach(projectKey => {
                programTotalPercentage += getProgressPercentage(projectKey);
            });

            return projectKeys.length > 0 ? Math.round(programTotalPercentage / projectKeys.length) : 0;
        }

        // Check if itemName is a project (e.g., "Fase 1.1: ...")
        for (const programKey in data) {
            if (data[programKey][itemName]) {
                const projectData = data[programKey][itemName];
                let projectTotalPercentage = 0;
                const taskKeys = Object.keys(projectData);

                taskKeys.forEach(taskKey => {
                    const taskDuration = scheduleDataGlobal.taskDurations[taskKey];
                    const taskDone = scheduleDataGlobal.taskDone[taskKey];
                    if (taskDuration !== undefined && taskDone !== undefined) {
                        const total = taskDuration + taskDone;
                        if (total > 0) {
                            projectTotalPercentage += (taskDone / total) * 100;
                        }
                    }
                });

                return taskKeys.length > 0 ? Math.round(projectTotalPercentage / taskKeys.length) : 0;
            }
        }

        return 0; // Return 0 if not found
    }

    function renderContent() {
        let taskData;
        if (selectedTask) {
            const { program, project, task } = selectedTask;
            taskData = data[program][project][task];
        } else if (selectedProjectData) {
            taskData = selectedProjectData;
        } else {
            taskContent.innerHTML = `<h1>Panel principal</h1><p>Seleccionar un proyecto</p>`;
            return;
        }

        if (currentView === 'description') {
            taskContent.classList.remove('inverted');
            displayTaskDescription(taskData);
        } else if (currentView === 'progress') { // progress view
            taskContent.classList.add('inverted');
            if (selectedTask) {
                const { program, project } = selectedTask;
                const tasks = data[program][project];
                const projectDays = [];
                for (const taskKey in tasks) {
                    const task = tasks[taskKey];
                    if (task.workableDaysInRange) {
                        projectDays.push(...task.workableDaysInRange);
                    }
                }
                displayTaskCalendar(projectDays, taskData.workableDaysInRange);
            } else {
                displayTaskCalendar(taskData.workableDaysInRange, []);
            }
        } else if (currentView === 'control') {
            taskContent.classList.remove('inverted');
            if (selectedTask) {
                const { program, project, task } = selectedTask;
                const taskData = data[program][project][task];
                let controlHtml = `<h1>${taskData.title}</h1>`;
                
                controlHtml += `<div class="control-zones">`;
        
                // Zone A: Day list
                controlHtml += `<div class="control-zone-a">`;
                if (scheduleDataGlobal.taskDurations && scheduleDataGlobal.taskDone) {
                    const taskDuration = scheduleDataGlobal.taskDurations[task];
                    const taskDone = scheduleDataGlobal.taskDone[task];
                    if (taskDuration !== undefined && taskDone !== undefined) {
                        const totalDays = taskDuration + taskDone;
                        for (let i = 1; i <= totalDays; i++) {
                            const status = (i <= taskDone) ? 'Hecho' : 'Por hacer';
                            controlHtml += `<p>Día ${i}: ${status}</p>`;
                        }
                    }
                }
                controlHtml += `</div>`;
        
                // Zone B: Calculation
                controlHtml += `<div class="control-zone-b">`;
                if (scheduleDataGlobal.taskDurations && scheduleDataGlobal.taskDone) {
                    const taskDuration = scheduleDataGlobal.taskDurations[task];
                    const taskDone = scheduleDataGlobal.taskDone[task];
                    if (taskDuration !== undefined && taskDone !== undefined) {
                        const percentage = Math.round((taskDone / (taskDuration + taskDone)) * 100);
                        controlHtml += `<div class="progress-circle" style="background: conic-gradient(#fff ${percentage}%, #000 ${percentage}%)"></div>`;
                        controlHtml += `<p class="proportion-result">${percentage}%</p>`;
                    }
                }
                controlHtml += `</div>`;
                controlHtml += `</div>`;
        
                taskContent.innerHTML = controlHtml;
            } else if (selectedProjectData) {
                const percentage = getProgressPercentage(selectedProjectData.title.replace(" Overview", ""));
                let controlHtml = `<h1>${selectedProjectData.title}</h1>`;
                controlHtml += `<div class="control-zones">`;
                controlHtml += `<div class="control-zone-b">`; // Use zone-b for the big percentage
                controlHtml += `<div class="progress-circle" style="background: conic-gradient(#fff ${percentage}%, #000 ${percentage}%)"></div>`;
                controlHtml += `<p class="proportion-result">${percentage}%</p>`;
                controlHtml += `</div>`;
                controlHtml += `</div>`;
                taskContent.innerHTML = controlHtml;
            }
        }
    }

    function displayTaskDescription(taskData) {
        taskContent.innerHTML = `
            <h1>${taskData.title}</h1>
            <h2>Objetivo</h2>
            <p>${taskData.goal}</p>
            <h2>Descripción</h2>
            <div class="description-section">
                <h3>Enfoque</h3>
                <p>${taskData.description.approach}</p>
            </div>
            <div class="description-section">
                <h3>Desarrollo</h3>
                <p>${taskData.description.development}</p>
            </div>
            <div class="description-section">
                <h3>Entregable</h3>
                <p>${taskData.description.product}</p>
            </div>`;
    }

    function displayTaskCalendar(projectDays, taskDays) {
        if ((!projectDays || projectDays.length === 0) && (!taskDays || taskDays.length === 0)) {
            taskContent.innerHTML = `<h1>No schedule</h1><p>This selection could not be scheduled with the available dates.</p>`;
            return;
        }
        
        let calendarHtml = generateYearCalendar(2025, projectDays, taskDays);
        calendarHtml += generateYearCalendar(2026, projectDays, taskDays);

        taskContent.innerHTML = `<div class="content-header"><h1>Progress</h1></div><div class="calendar-grid">${calendarHtml}</div>`;
    }

    function generateYearCalendar(year, projectDays = [], taskDays = []) {
        const months = [...Array(12).keys()];
        const projectDaysSet = new Set(projectDays);
        const taskDaysSet = new Set(taskDays);
        const todayString = new Date().toISOString().slice(0, 10);

        const calendarHtml = months.map(monthIndex => {
            if (year === 2025 && monthIndex < 9) {
                return '';
            }
            const monthName = new Date(year, monthIndex).toLocaleString('default', { month: 'long', year: 'numeric' });
            const firstDay = new Date(year, monthIndex, 1);
            const startingDay = firstDay.getDay();
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

            let table = `
                <div class="calendar-month" data-month-id="${year}-${monthIndex}">
                    <h3>${monthName}</h3>
                    <table>
                        <thead><tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr></thead>
                        <tbody><tr>
            `;

            for (let i = 0; i < startingDay; i++) {
                table += '<td></td>';
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(year, monthIndex, day);
                const dateString = currentDate.toISOString().slice(0, 10);
                const isProjectDay = projectDaysSet.has(dateString);
                const isTaskDay = taskDaysSet.has(dateString);
                const isToday = dateString === todayString;
                
                let classes = 'calendar-day';
                if (isProjectDay) classes += ' project-day';
                if (isTaskDay) classes += ' task-day';
                if (isToday) classes += ' today';

                table += `<td class="${classes}">${day}</td>`;

                if ((startingDay + day) % 7 === 0 && day < daysInMonth) {
                    table += '</tr><tr>';
                }
            }

            table += '</tr></tbody></table></div>';
            return table;
        }).join('');

        return calendarHtml;
    }


    // --- EVENT LISTENERS ---
    taskMenu.addEventListener('click', function(e) {
        const target = e.target;

        if (target.classList.contains('toggle')) {
            const parentLi = target.parentElement;
            parentLi.classList.toggle('open');
            if (parentLi.classList.contains('open')) {
                target.textContent = '[-]';
            } else {
                target.textContent = '[+]';
            }
        }

        if (target.classList.contains('title')) {
            const previouslySelected = document.querySelector('.selected');
            if (previouslySelected) {
                previouslySelected.classList.remove('selected');
            }
            target.classList.add('selected');

            const parentLi = target.parentElement;
            if (parentLi.classList.contains('project')) {
                const { program, project } = parentLi.dataset;
                const tasks = data[program][project];
                const aggregatedData = {
                    title: project,
                    goal: '',
                    description: {
                        approach: '',
                        development: '',
                        product: ''
                    },
                    workableDaysInRange: []
                };
                for (const taskKey in tasks) {
                    const task = tasks[taskKey];
                    aggregatedData.goal += task.goal + ' ';
                    aggregatedData.description.approach += task.description.approach + ' ';
                    aggregatedData.description.development += task.description.development + ' ';
                    aggregatedData.description.product += task.description.product + ' ';
                    if (task.workableDaysInRange) {
                        aggregatedData.workableDaysInRange.push(...task.workableDaysInRange);
                    }
                }
                selectedProjectData = aggregatedData;
                selectedTask = null;
                renderContent();
            } else if (parentLi.classList.contains('program')) {
                const programName = parentLi.querySelector('.title').textContent;
                const programData = data[programName];
                const aggregatedData = {
                    title: programName + " Overview",
                    goal: '',
                    description: {
                        approach: '',
                        development: '',
                        product: ''
                    },
                    workableDaysInRange: []
                };

                Object.values(programData).forEach(project => {
                    Object.values(project).forEach(task => {
                        aggregatedData.goal += task.goal + ' ';
                        aggregatedData.description.approach += task.description.approach + ' ';
                        aggregatedData.description.development += task.description.development + ' ';
                        aggregatedData.description.product += task.description.product + ' ';
                        if (task.workableDaysInRange) {
                            aggregatedData.workableDaysInRange.push(...task.workableDaysInRange);
                        }
                    });
                });
                // Remove duplicates from workableDaysInRange
                aggregatedData.workableDaysInRange = [...new Set(aggregatedData.workableDaysInRange)].sort();

                selectedProjectData = aggregatedData;
                selectedTask = null;
                renderContent();
            }
        }

        if (target.classList.contains('task')) {
            const previouslySelected = document.querySelector('.selected');
            if (previouslySelected) {
                previouslySelected.classList.remove('selected');
            }
            target.classList.add('selected');
            selectedTask = target.dataset;
            selectedProjectData = null;
            renderContent();
        }
    });

    progressToggle.addEventListener('click', function() {
        if (!selectedTask && !selectedProjectData) {
            alert("Seleccionar alguna actividad");
            return;
        }
        progressToggle.classList.toggle('active');
        controlToggle.classList.remove('active'); // Deactivate control toggle
        currentView = (currentView === 'progress') ? 'description' : 'progress';
        renderContent();

        // Scroll to the relevant month after rendering the calendar
        if (currentView === 'progress') {
            const today = new Date();
            const targetDate = new Date(today.setMonth(today.getMonth() - 3));
            const targetYear = targetDate.getFullYear();
            const targetMonthIndex = targetDate.getMonth();
            const targetId = `${targetYear}-${targetMonthIndex}`;
            const targetElement = document.querySelector(`[data-month-id="${targetId}"]`);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
        }
    });

    controlToggle.addEventListener('click', function() {
        if (!selectedTask && !selectedProjectData) {
            alert("Seleccionar alguna actividad");
            return;
        }
        controlToggle.classList.toggle('active');
        progressToggle.classList.remove('active'); // Deactivate progress toggle
        currentView = (currentView === 'control') ? 'description' : 'control';
        renderContent();
    });


    // --- INITIALIZATION ---
    function initializeApp() {
        fetch('schedule.json')
            .then(response => response.json())
            .then(scheduleData => {
                scheduleDataGlobal = scheduleData;
                calculateTaskSchedules(scheduleData);
                renderMenu();
                const topLevelMenu = taskMenu.querySelector('ul');
                if (topLevelMenu) {
                    topLevelMenu.style.display = 'block';
                }
                renderContent(); // Render initial welcome message
            })
            .catch(error => {
                console.error("Error loading schedule data:", error);
                taskContent.innerHTML = "<h1>Error</h1><p>Could not load schedule.json. Please check the file and the console for errors.</p>";
            });
    }

    initializeApp();
});
