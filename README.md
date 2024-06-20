# Curso: GraphQL Avanzado – Fullstack

## Objetivo del Repositorio
Diseñado para llevar el curso llamado "GRAPHQL AVANZADO – FULLSTACK".

## Temario

### Módulo 1: ¿Qué es Fullstack GraphQL?
- Una mirada a GraphQL
- Los conceptos de Fullstack, GraphQL, React, Apollo, base de datos Neo4j y cómo encaja todo

### Módulo 2: Pensamiento en Grafos con GraphQL
- Los datos de tu aplicación son un grafo
- Grafos en GraphQL combinando definiciones de tipos y solucionadores con Apollo Server

### Módulo 3: Grafos en la Base de Datos
- Descripción general de Neo4j
- Modelado de datos grafos con Neo4j, consideraciones sobre el modelado de datos
- Herramientas: Escritorio Neo4j, Navegador Neo4j, Cifrar
- Usando los controladores del cliente Neo4j

### Módulo 4: La Biblioteca Neo4j GraphQL
- Problemas comunes de GraphQL
- Presentamos las integraciones de bases de datos GraphQL
- La biblioteca Neo4j GraphQL
- Consultas de GraphQL, ordenamiento y paginación, consultas anidadas, filtración
- Trabajar con campos temporales, trabajar con datos espaciales
- Agregar lógica personalizada a nuestra API GraphQL
- Introspección del esquema GraphQL desde una base de datos existente

### Módulo 5: Construyendo Interfaces de Usuario con React
- Descripción general de React
- Crear aplicación de React, hooks de estado y React

### Módulo 6: GraphQL del Lado del Cliente con React y Apollo Client
- Mutaciones GraphQL
- Gestión del estado del cliente con GraphQL

### Módulo 7: Agregar Autorización y Autenticación en GraphQL: Un Enfoque Diferente
- JWT
- La directiva de esquema @auth GraphQL
- Auth0: JWT como servicio

### Módulo 8: Implementación de Nuestra Aplicación GraphQL Fullstack
- Implementación de nuestra aplicación GraphQL
- Base de datos Neo4j Aura como servicio
- Implementación de una aplicación React con Netlify Build
- GraphQL sin servidor con funciones AWS Lambda y Netlify
- Nuestro enfoque de implementación

### Módulo 9: Consideraciones Avanzadas sobre GraphQL
- Tipos abstractos de GraphQL
- Paginación con GraphQL
- Propiedades de relación
- Crear propiedades de relación
- Concluyendo Full Stack GraphQL

## Tecnologías Usadas
- Docker y Docker Compose
- GraphQL
- React
- Apollo Client y Server
- Neo4j
- Auth0
- JWT
- Netlify

## Explicación del archivo `docker-compose.yml`
Este archivo `docker-compose.yml` configura un ambiente de desarrollo completo para el curso. Contiene los siguientes servicios:

1. **dev_container**:
   - **Imagen**: Node.js 16 (basado en Debian Bullseye)
   - **Directorio de trabajo**: `/app`
   - **Volúmenes**: Monta el directorio actual en `/app`
   - **Puertos**: 
     - `3000:3000` (Aplicación React)
     - `4000:4000` (Apollo Server)
     - `8888:8888` (Netlify Dev)
   - **Comando**: Instala Node.js y las herramientas necesarias, y luego mantiene el contenedor en ejecución.

2. **neo4j**:
   - **Imagen**: Neo4j 4.3.7
   - **Puertos**: 
     - `7474:7474` (Neo4j Browser)
     - `7687:7687` (Neo4j Bolt)
   - **Variables de entorno**:
     - `NEO4J_AUTH=neo4j/test`

Ambos servicios están conectados a una red llamada `dev_network`.

## Todos los Comandos para Entrar al Contenedor y Corroborar las Versiones de las Tecnologías

```sh
# Accede al contenedor
docker exec -it dev_container sh

# Verificar Node.js y npm
node -v
npm -v

# Verificar Create React App
npx create-react-app --version

# Verificar Apollo Server
npm list -g apollo-server

# Verificar GraphQL
npm list -g graphql

# Verificar Auth0
npm list -g auth0

# Verificar Netlify CLI
netlify --version
