const { postDocs } = require("./postDocs");
const { bulletinDocs } = require("./bulletinDocs");
const { blogDocs } = require("./blogDocs");


module.exports = {
    "/api/v3/associations": {
        /*
        "post": {
            "tags": [
                "Association controllers"
            ],
            "summary": "Crear asociación.",
            "description": "Creación de asociación.",
            "requestBody": {
                "required": true,
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "Nombre de la asociación."
                                },
                                "email": {
                                    "type": "string",
                                    "description": "Email del asociación."
                                },
                                "password": {
                                    "type": "string",
                                    "description": "Contraseña de la asociación"
                                },
                                "description": {
                                    "type": "string",
                                    "description": "Descripción de la institución."
                                },
                                "image": {
                                    "type": "string",
                                    "format": "binary",
                                    "description": "Imagen de la asociación."
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Asociación creado correctamente."
                },
                "500": {
                    "description": "Error interno del servidor."
                },
                "400": {
                    "description": "Error del cliente."
                }
            }
        },
         */
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Association controllers"
            ],
            "summary": "Obener una asociación.",
            "description": "Obtener los datos de una asociación.",
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Asociación no encontrada."
                },
                "200": {
                    "description": "Datos del asociación."
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
                "Association controllers"
            ],
            "summary": "Eliminar una asociación.",
            "description": "Eliminar un asociación.",
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Asociación no encontrado."
                },
                "204": {
                    "description": "Asociación eliminado."
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
                "Association controllers"
            ],
            "summary": "Actualizar datos de asociación.",
            "description": "Actualizar datos de asociación.",
            "requestBody": {
                "required": true,
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "Nombre de la asociación."
                                },
                                "social_networks": {
                                    "type": "string",
                                    "description": "Redes sociales de la asociación."
                                },
                                "description": {
                                    "type": "string",
                                    "description": "Descripción de la asociación."
                                },
                                "image": {
                                    "type": "string",
                                    "format": "binary",
                                    "description": "Imagen de la asociación."
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "202": {
                    "description": "Datos de asociación actualizados."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Asociación no encontrado."
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
    "/api/v3/associations/auth": {
        "put": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Association controllers"
            ],
            "summary": "Actualizar las credenciales de una asociación.",
            "description": "Actualizar el email y contraseña de una asociación.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/x-www-form-urlencoded": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "type": "string",
                                    "description": "Email de la asociación."
                                },
                                "new_password": {
                                    "type": "string",
                                    "description": "Nueva contraseña para la asociación."
                                },
                                "old_password": {
                                    "type": "string",
                                    "description": "Actual contraseña de la asociación."
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
                    "description": "Asociación no encontrada."
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
    "/api/v3/associations/networks": {
        "delete": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Association controllers"
            ],
            "summary": "Eliminar una red social.",
            "description": "Eliminar una red social de asociación.",
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
                    "description": "Asociación no encontrado."
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
    "/api/v3/associations/image/{image_id}": {
        "delete": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Association controllers"
            ],
            "summary": "Eliminar una imagen.",
            "description": "Eliminar una imagen del perfil de asociación.",
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
                    "description": "Asociación no encontrado."
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
    "/api/v3/associations/rescuers/{rescuer_id}": {
        "post": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Association controllers"
            ],
            "summary": "Agregar rescatista.",
            "description": "Agregar colaboración con rescatista.",
            "parameters": [
                {
                    "in": "path",
                    "name": "rescuer_id",
                    "description": "Id del rescatista.",
                    "required": true,
                    "type": "string"
                }
            ],
            "responses": {
                "201": {
                    "description": "Rescatista agregado correctamente."
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
    "/api/v3/associations/rescuers": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Association controllers"
            ],
            "summary": "Obtener todos los rescatistas.",
            "description": "Obtener todos los rescatistas.",
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "200": {
                    "description": "Todos las solicitudes."
                },
                "404": {
                    "description": "Asociación no encontrado."
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
    "/api/v3/associations/posts": {
        ...postDocs("Association controllers")["/api/v3/posts"]
    },
    "/api/v3/associations/posts/{pet_id}": {
        ...postDocs("Association controllers")["/api/v3/posts/{pet_id}"]
    },
    "/api/v3/associations/posts/search/chrt": {
        ...postDocs("Association controllers")["/api/v3/posts/search/chrt"]
    },
    "/api/v3/associations/posts/{pet_id}/images": {
        ...postDocs("Association controllers")["/api/v3/posts/{pet_id}/images"]
    },
    "/api/v3/associations/posts/comment/{pet_id}": {
        ...postDocs("Association controllers")["/api/v3/posts/comment/{pet_id}"]
    },
    "/api/v3/associations/bulletins": {
        ...bulletinDocs("Association controllers")["/api/v3/bulletins"]
    },
    "/api/v3/associations/bulletins/{bulletin_id}": {
        ...bulletinDocs("Association controllers")["/api/v3/bulletins/{bulletin_id}"]
    },
    "/api/v3/associations/bulletins/{bulletin_id}/images": {
        ...bulletinDocs("Association controllers")["/api/v3/bulletins/{bulletin_id}/images"]
    },
    "/api/v3/associations/blogs": {
        ...blogDocs("Association controllers")["/api/v3/blogs"]
    },
    "/api/v3/associations/blogs/{blog_id}": {
        ...blogDocs("Association controllers")["/api/v3/blogs/{blog_id}"]
    },
    "/api/v3/associations/blogs/{blog_id}/images": {
        ...blogDocs("Association controllers")["/api/v3/blogs/{blog_id}/images"]
    }
}
