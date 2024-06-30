const { postDocs } = require("./postDocs");
const { bulletinDocs } = require("./bulletinDocs");
const { blogDocs } = require("./blogDocs");


module.exports = {
    "/api/v3/rescuers": {
        "post": {
            "tags": [
                "Rescuer controllers"
            ],
            "summary": "Crear rescatista.",
            "description": "Creación de rescatista.",
            "requestBody": {
                "required": true,
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "Nombre del rescatista."
                                },
                                "email": {
                                    "type": "string",
                                    "description": "Email del rescatista."
                                },
                                "password": {
                                    "type": "string",
                                    "description": "Contraseña del rescatista"
                                },
                                "description": {
                                    "type": "string",
                                    "description": "Descripción de la institución."
                                },
                                "image": {
                                    "type": "string",
                                    "format": "binary",
                                    "description": "Imagen del rescatista."
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Rescatista creado correctamente."
                },
                "500": {
                    "description": "Error interno del servidor."
                },
                "400": {
                    "description": "Error del cliente."
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
                "Rescuer controllers"
            ],
            "summary": "Obener un rescatista.",
            "description": "Obtener los datos de un rescatista.",
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Rescatista no encontrado."
                },
                "200": {
                    "description": "Datos del rescatista."
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
                "Rescuer controllers"
            ],
            "summary": "Eliminar un rescatista.",
            "description": "Eliminar un usuario rescatista.",
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Rescatista no encontrado."
                },
                "204": {
                    "description": "Rescatista eliminado."
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
                "Rescuer controllers"
            ],
            "summary": "Actualizar datos de rescatista.",
            "description": "Actualizar datos de rescatista.",
            "requestBody": {
                "required": true,
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "Nombre del rescatista."
                                },
                                "social_networks": {
                                    "type": "string",
                                    "description": "Redes sociales del rescatista."
                                },
                                "description": {
                                    "type": "string",
                                    "description": "Descripción de la institución."
                                },
                                "image": {
                                    "type": "string",
                                    "format": "binary",
                                    "description": "Imagen del rescatista."
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "202": {
                    "description": "Datos de rescatista actualizados."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Rescatista no encontrado."
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
    "/api/v3/rescuers/auth": {
        "put": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Rescuer controllers"
            ],
            "summary": "Actualizar las credenciales de un rescatista.",
            "description": "Actualizar el email y contraseña de un rescatista.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/x-www-form-urlencoded": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "type": "string",
                                    "description": "Email del rescatista."
                                },
                                "new_password": {
                                    "type": "string",
                                    "description": "Nueva contraseña para el rescatista."
                                },
                                "old_password": {
                                    "type": "string",
                                    "description": "Actual contraseña del rescatista."
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "202": {
                    "description": "Credenciales modificadas."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Rescatista no encontrado."
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
    "/api/v3/rescuers/networks": {
        "delete": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Rescuer controllers"
            ],
            "summary": "Eliminar una red social.",
            "description": "Eliminar una red social de rescatista.",
            "parameters": [
                {
                    "in": "query",
                    "name": "key",
                    "description": "Nombre de la red social (key).",
                    "required": true,
                    "type": "string"
                },
                {
                    "in": "query",
                    "name": "value",
                    "description": "Usuario de la red social (value).",
                    "required": true,
                    "type": "string"
                }
            ],
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Rescatista no encontrado."
                },
                "204": {
                    "description": "Red social eliminada."
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
    "/api/v3/rescuers/image/{image_id}": {
        "delete": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Rescuer controllers"
            ],
            "summary": "Eliminar una imagen.",
            "description": "Eliminar una imagen del perfil de rescatista.",
            "parameters": [
                {
                    "in": "path",
                    "name": "image_id",
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
                    "description": "Rescatista no encontrado."
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
    "/api/v3/rescuers/posts": {
        ...postDocs("Rescuer controllers")["/api/v3/posts"]
    },
    "/api/v3/rescuers/posts/{pet_id}": {
        ...postDocs("Rescuer controllers")["/api/v3/posts/{pet_id}"]
    },
    "/api/v3/rescuers/posts/search/chrt": {
        ...postDocs("Rescuer controllers")["/api/v3/posts/search/chrt"]
    },
    "/api/v3/rescuers/posts/{pet_id}/images": {
        ...postDocs("Rescuer controllers")["/api/v3/posts/{pet_id}/images"]
    },
    "/api/v3/rescuers/posts/comment/{pet_id}": {
        ...postDocs("Rescuer controllers")["/api/v3/posts/comment/{pet_id}"]
    },
    "/api/v3/rescuers/bulletins": {
        ...bulletinDocs("Rescuer controllers")["/api/v3/bulletins"]
    },
    "/api/v3/rescuers/bulletins/{bulletin_id}": {
        ...bulletinDocs("Rescuer controllers")["/api/v3/bulletins/{bulletin_id}"]
    },
    "/api/v3/rescuers/bulletins/{bulletin_id}/images": {
        ...bulletinDocs("Rescuer controllers")["/api/v3/bulletins/{bulletin_id}/images"]
    },
    "/api/v3/rescuers/blogs": {
        ...blogDocs("Rescuer controllers")["/api/v3/blogs"]
    },
    "/api/v3/rescuers/blogs/{blog_id}": {
        ...blogDocs("Rescuer controllers")["/api/v3/blogs/{blog_id}"]
    },
    "/api/v3/rescuers/blogs/{blog_id}/images": {
        ...blogDocs("Rescuer controllers")["/api/v3/blogs/{blog_id}/images"]
    }
}
