function blogDocs(tags) {
    return {
        "/api/v3/blogs": {
            "post": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Crear blog",
                "description": "Creación de blog",
                "consumes": [
                    "multipart/form-data"
                ],
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "markdown_text": {
                                        "type": "string",
                                        "required": true
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
                        "description": "Blog creado."
                    },
                    "500": {
                        "description": "Error interno del servidor."
                    },
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Entidad no encontrado."
                    },
                    "401": {
                        "description": "Sin permisos para ver esta ruta."
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
                "summary": "Obtener blogs de un usuario",
                "description": "Obtener todos los blogs de un usuario",
                "responses": {
                    "202": {
                        "description": "Todos los blogs."
                    },
                    "500": {
                        "description": "Error interno del servidor."
                    },
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Entidad no encontrada."
                    },
                    "401": {
                        "description": "Sin permisos para ver esta ruta."
                    }
                }
            }
        },
        "/api/v3/blogs/{blog_id}": {
            "get": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Obtener un blog",
                "description": "Obtener un blog de un usuario",
                "parameters": [
                    {
                        "in": "path",
                        "name": "blog_id",
                        "description": "Id del blog.",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Blog no encontrado o Entidad no encontrado."
                    },
                    "200": {
                        "description": "Blog de usuario."
                    },
                    "401": {
                        "description": "Sin permisos para ver esta ruta."
                    },
                    "500": {
                        "description": "Error interno del servidor."
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
                "summary": "Eliminar un blog",
                "description": "Eliminar un blog",
                "parameters": [
                    {
                        "in": "path",
                        "name": "blog_id",
                        "description": "Id del blog.",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Blog no encontrado o Entidad no encontrado."
                    },
                    "204": {
                        "description": "Blog eliminado."
                    },
                    "401": {
                        "description": "Sin permisos para ver esta ruta."
                    },
                    "500": {
                        "description": "Error interno del servidor."
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
                "summary": "Actulizar un blog",
                "description": "Actualizar datos de un blog",
                "consumes": [
                    "multipart/form-data"
                ],
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "markdown_text": {
                                        "type": "string",
                                        "required": true
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
                "parameters": [
                    {
                        "in": "path",
                        "name": "blog_id",
                        "description": "Id del blog.",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Blog no encontrado."
                    },
                    "202": {
                        "description": "Blog actualizado."
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
        "/api/v3/blogs/{blog_id}/images": {
            "delete": {
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "tags": [
                    tags
                ],
                "summary": "Eliminar una imagen",
                "description": "Eliminar una imagen de un blog",
                "parameters": [
                    {
                        "in": "path",
                        "name": "blog_id",
                        "description": "Id del blog.",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "in": "query",
                        "name": "id",
                        "description": "Id de la imagen.",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "400": {
                        "description": "Error del cliente."
                    },
                    "404": {
                        "description": "Blog no encontrado."
                    },
                    "204": {
                        "description": "Imagen de blog eliminado."
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

module.exports = { blogDocs }