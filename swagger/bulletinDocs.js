function bulletinDocs(tags) {
    return {
        "/api/v3/bulletins": {
            "post": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Crear anuncio",
                "description": "Creación de anuncio",
                "consumes": [
                    "multipart/form-data"
                ],
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "title": {
                                        "type": "string",
                                        "required": true
                                    },
                                    "text": {
                                        "type": "string"
                                    },
                                    "name_company": {
                                        "type": "string"
                                    },
                                    "address": {
                                        "type": "string"
                                    },
                                    "te_number": {
                                        "type": "string",
                                        "example": "9618907654"
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
                        "description": "Anuncio creado."
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
                "summary": "Obtener anuncios.",
                "description": "Obtener todos los anuncios.",
                "responses": {
                    "200": {
                        "description": "Todos los anuncios."
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
        "/api/v3/bulletins/{bulletin_id}": {
            "get": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Obtener una anuncio",
                "description": "Obtener una anuncio.",
                "parameters": [
                    {
                        "in": "path",
                        "name": "bulletin_id",
                        "description": "Id del anuncio.",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Datos de anuncio."
                    },
                    "500": {
                        "description": "Error interno del servidor."
                    },
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Usuario no encontrado o Anuncio no encontrado."
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
                "summary": "Actualizar anuncio",
                "description": "Actualziar datos de anuncio",
                "consumes": [
                    "multipart/form-data"
                ],
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "title": {
                                        "type": "string",
                                        "required": true
                                    },
                                    "text": {
                                        "type": "string"
                                    },
                                    "name_company": {
                                        "type": "string"
                                    },
                                    "address": {
                                        "type": "string"
                                    },
                                    "te_number": {
                                        "type": "string"
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
                        "description": "Anuncio actualizado."
                    },
                    "500": {
                        "description": "Error interno del servidor."
                    },
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Usuario no encontrado o Anuncio no encontrado."
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
                "summary": "Eliminar un anuncio.",
                "description": "Eliminar un anuncio.",
                "parameters": [
                    {
                        "in": "path",
                        "name": "bulletin_id",
                        "description": "Id del anuncio.",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Usuario no encontrado o Anuncio no encontrado."
                    },
                    "204": {
                        "description": "Anuncio eliminada."
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
        "/api/v3/bulletins/{bulletin_id}/images": {
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
                "description": "Eliminar una imagen de la galería de un anuncio.",
                "parameters": [
                    {
                        "in": "path",
                        "name": "bulletin_id",
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
                        "description": "Usuario no encontrado o Anuncio no encontrada."
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
        }
    }
}

module.exports = { bulletinDocs }