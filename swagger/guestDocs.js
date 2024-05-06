module.exports = {
    "/api/v2/posts/search/chrt": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Post controllers"
            ],
            "summary": "Filtrar mascotas",
            "description": "No se puede usar en swagger ya que el query es dinámico",
            "parameters": [
                {
                    "in": "query",
                    "name": "breed",
                    "description": "Filtro",
                    "required": true,
                    "type": "string"
                }
            ],
            "responses": {
                "200": {
                    "description": "Mascotas filtradas."
                },
                "500": {
                    "description": "Error interno del servidor."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Usuario no encontrado o Mascota no encontrada."
                }
            }
        }
    },
    "/api/v2/posts": {
        "get": {
            "summary": "Ver todos las mascotas",
            "description": "Ver todas las mascotas de todos los usuarios",
            "tags": [
                "Post controllers"
            ],
            "responses": {
                "200": {
                    "description": "Todas las mascotas."
                },
                "500": {
                    "description": "Error interno del servidor."
                },
                "400": {
                    "description": "Error del cliente."
                }
            }
        }
    },
    "/api/v2/posts/search": {
        "get": {
            "summary": "Ver mascota con su dueño",
            "description": "Ver mascota con su dueño",
            "tags": [
                "Post controllers"
            ],
            "parameters": [
                {
                    "in": "query",
                    "name": "pet",
                    "required": true,
                    "type": "string"
                }
            ],
            "responses": {
                "200": {
                    "description": "Mascota con la info de su dueño."
                },
                "500": {
                    "description": "Error interno del servidor."
                },
                "400": {
                    "description": "Error del cliente."
                }
            }
        }
    },
    "/api/v2/bulletins": {
        "get": {
            "summary": "Ver todos los anuncios",
            "description": "Ver todas las anuncios de todos los rescatistas",
            "tags": [
                "Bulletin controllers"
            ],
            "responses": {
                "200": {
                    "description": "Todas los anuncios."
                },
                "500": {
                    "description": "Error interno del servidor."
                },
                "400": {
                    "description": "Error del cliente."
                }
            }
        }
    },
    "/api/v2/bulletins/search": {
        "get": {
            "summary": "Ver anuncio con su dueño",
            "description": "Ver anuncio con su dueño",
            "tags": [
                "Bulletin controllers"
            ],
            "parameters": [
                {
                    "in": "query",
                    "name": "ad",
                    "required": true,
                    "type": "string"
                }
            ],
            "responses": {
                "200": {
                    "description": "Anuncio con la info de su publicador."
                },
                "500": {
                    "description": "Error interno del servidor."
                },
                "400": {
                    "description": "Error del cliente."
                }
            }
        }
    }
}