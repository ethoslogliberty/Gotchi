# 🟦 Gotchi: Azulito - Compañero Virtual con IA

**Azulito** es un avatar interactivo desarrollado en **React** que utiliza inteligencia artificial para ofrecer compañía, reflexiones y sabiduría con un toque cultural rioplatense.

![Licencia](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Groq](https://img.shields.io/badge/IA-Groq-orange)

## 🌟 Características Principales

* **Cerebro con Llama 3.3**: Integración con la API de Groq para respuestas rápidas y profundas.
* **Personalidad Rioplatense**: Dialecto enfocado en el voseo ("sos", "tenés") y un tono de mentor sereno.
* **Agente Proactivo**: Si el usuario no interactúa, Azulito toma la iniciativa para romper el silencio tras 25 segundos.
* **Voz Femenina Natural**: Implementación de `SpeechSynthesis` optimizada para español de España/Latinoamérica.
* **Interfaz Inmersiva**: Efectos de partículas, aura animada y diseño Glassmorphism con Framer Motion.
* **Memoria Contextual**: Recuerda los últimos mensajes de la conversación para mantener la coherencia.

## 🚀 Tecnologías Utilizadas

* **Frontend**: React + Vite.
* **Animaciones**: Framer Motion.
* **IA**: Groq API (Llama-3.3-70b).
* **Estilos**: CSS3 con variables personalizadas y animaciones radiales.
* **Voz**: Web Speech API.

## 🛠️ Instalación y Configuración

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/tu-usuario/nombre-del-repo.git](https://github.com/tu-usuario/nombre-del-repo.git)
    cd nombre-del-repo
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Crea un archivo `.env` en la raíz y añade tu API Key de Groq:
    ```env
    VITE_GROQ_API_KEY=tu_clave_aqui
    ```

4.  Inicia el entorno de desarrollo:
    ```bash
    npm run dev
    ```

## 🧠 Estructura del Proyecto

* `App.jsx`: Componente principal que gestiona el estado, la voz y el agente proactivo.
* `interaccion.js`: Configuración del System Prompt y lógica de conexión con Groq.
* `App.css`: Diseño visual, partículas y aura del avatar.
* `useMemory.js`: Hook personalizado para gestionar el historial de charla.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
