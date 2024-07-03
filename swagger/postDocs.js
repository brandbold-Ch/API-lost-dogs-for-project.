function postDocs(tags) {
    return {
        "/api/v3/posts": {
            "post": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Crear una mascota",
                "description": "Crea una nueva mascota en la base de datos.",
                "consumes": [
                    "multipart/form-data"
                ],
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "name": {
                                        "type": "string"
                                    },
                                    "specie": {
                                        "type": "string"
                                    },
                                    "gender": {
                                        "type": "string",
                                        "enum": [
                                            "Macho",
                                            "Hembra"
                                        ]
                                    },
                                    "age": {
                                        "type": "string"
                                    },
                                    "description": {
                                        "type": "string"
                                    },
                                    "size": {
                                        "type": "string",
                                        "enum": [
                                            "Chico",
                                            "Mediano",
                                            "Grande",
                                            "No aplica"
                                        ]
                                    },
                                    "breed": {
                                        "type": "string"
                                    },
                                    "lost_date": {
                                        "type": "string",
                                        "example": "2021-04-24"
                                    },
                                    "location": {
                                        "type": "string",
                                        "example": "{\"x\": 34234243223123, \"y\": 1234123422346}"
                                    },
                                    "last_seen": {
                                        "type": "string"
                                    },
                                    "owner": {
                                        "type": "boolean"
                                    },
                                    "image": {
                                        "type": "string",
                                        "format": "binary"
                                    },
                                    "images": {
                                        "type": "string",
                                        "format": "binary"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Mascota creada correctamente."
                    },
                    "500": {
                        "description": "Error interno del servidor."
                    },
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Usuario no encontrado."
                    }
                }
            },
            "get": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Obtener las mascota de un usuario",
                "description": "Obtener todas las mascotas.",
                "responses": {
                    "200": {
                        "description": "Todas las mascotas."
                    },
                    "500": {
                        "description": "Error interno del servidor."
                    },
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Usuario no encontrado."
                    }
                }
            }
        },
        "/api/v3/posts/{pet_id}": {
            "get": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Obtener una mascota",
                "description": "Obtener una ascota.",
                "parameters": [
                    {
                        "in": "path",
                        "name": "pet_id",
                        "description": "Id de la mascota.",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Datos de mascota."
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
            },
            "put": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Actualizar una mascota",
                "description": "Actualizar datos de una mascota.",
                "parameters": [
                    {
                        "in": "path",
                        "name": "pet_id",
                        "description": "Id de la mascota.",
                        "required": true,
                        "type": "string"
                    }
                ],
                "consumes": [
                    "multipart/form-data"
                ],
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "name": {
                                        "type": "string"
                                    },
                                    "specie": {
                                        "type": "string"
                                    },
                                    "gender": {
                                        "type": "string",
                                        "enum": [
                                            "Macho",
                                            "Hembra"
                                        ]
                                    },
                                    "age": {
                                        "type": "string"
                                    },
                                    "description": {
                                        "type": "string"
                                    },
                                    "size": {
                                        "type": "string",
                                        "enum": [
                                            "Chico",
                                            "Mediano",
                                            "Grande",
                                            "No aplica"
                                        ]
                                    },
                                    "breed": {
                                        "type": "string"
                                    },
                                    "lost_date": {
                                        "type": "string",
                                        "example": "2021-04-24"
                                    },
                                    "location": {
                                        "type": "string",
                                        "example": "{\"x\": 34234243223123, \"y\": 1234123422346}"
                                    },
                                    "last_seen": {
                                        "type": "string"
                                    },
                                    "owner": {
                                        "type": "boolean"
                                    },
                                    "image": {
                                        "type": "string",
                                        "format": "binary"
                                    },
                                    "images": {
                                        "type": "string",
                                        "format": "binary"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "202": {
                        "description": "Datos de mascota actualizados."
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
            },
            "delete": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Eliminar una mascota.",
                "description": "Eliminar una mascota.",
                "parameters": [
                    {
                        "in": "path",
                        "name": "pet_id",
                        "description": "Id de la mascota.",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Usuario no encontrado o Mascota no encontrada."
                    },
                    "204": {
                        "description": "Mascota eliminada."
                    },
                    "401": {
                        "description": "Sin permisos para ver esta ruta."
                    },
                    "500": {
                        "description": "Error interno del servidor."
                    }
                }
            }
        },
        "/api/v3/posts/search/chrt": {
            "get": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
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
        "/api/v3/posts/{pet_id}/images": {
            "delete": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Eliminar una imagen.",
                "description": "Eliminar una imagen de la galería de una mascota.",
                "parameters": [
                    {
                        "in": "path",
                        "name": "pet_id",
                        "description": "Id de la mascota.",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "in": "query",
                        "name": "id",
                        "description": "Id de la imagen.",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "in": "query",
                        "name": "tag",
                        "description": "Procedencia de la imagen.",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "enum": [
                                "image",
                                "images"
                            ]
                        }
                    }
                ],
                "responses": {
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Usuario no encontrado o Mascota no encontrada."
                    },
                    "204": {
                        "description": "Imagen eliminada."
                    },
                    "401": {
                        "description": "Sin permisos para ver esta ruta."
                    },
                    "500": {
                        "description": "Error interno del servidor."
                    }
                }
            }
        },
        "/api/v3/posts/comment/{pet_id}": {
            "post": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Comentar a una mascota.",
                "description": "Comentar a una mascotar.",
                "parameters": [
                    {
                        "in": "path",
                        "name": "pet_id",
                        "description": "Id de la mascota.",
                        "required": true,
                        "type": "string"
                    }
                ],
                "requestBody": {
                    "content": {
                        "text/plain": {
                            "schema": {
                                "type": "string",
                            }
                        }
                    }
                },
                "responses": {
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Usuario no encontrado o Mascota no encontrada."
                    },
                    "201": {
                        "description": "Comentario agregado."
                    },
                    "401": {
                        "description": "Sin permisos para ver esta ruta."
                    },
                    "500": {
                        "description": "Error interno del servidor."
                    }
                }
            }
        }
    }
}

module.exports = { postDocs }