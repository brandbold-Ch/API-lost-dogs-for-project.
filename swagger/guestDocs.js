module.exports = {
    "/api/v3/posts/search/chrt": {
        "get": {
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
    "/api/v3/posts": {
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
    "/api/v3/posts/search": {
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
    "/api/v3/bulletins": {
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
    "/api/v3/bulletins/search": {
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
    },
    "/api/v3/blogs": {
        "get": {
            "summary": "Ver todos los blogs",
            "description": "Ver todos los blogs de rescatistas",
            "tags": [
                "Blog controllers"
            ],
            "responses": {
                "200": {
                    "description": "Todos los blogs."
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
    "/api/v3/blogs/search": {
        "get": {
            "summary": "Ver blog con su dueño",
            "description": "Ver blog con su dueño",
            "tags": [
                "Blog controllers"
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
                    "description": "Blog con la info de su publicador."
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
