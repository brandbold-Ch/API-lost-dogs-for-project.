const {postDocs} = require("./postDocs");
const {bulletinDocs} = require("./bulletinDocs");
const {blogDocs} = require("./blogDocs");


module.exports = {
    "/api/v2/rescuers": {
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
    "/api/v2/rescuers/auth": {
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
    "/api/v2/rescuers/posts": {
        ...postDocs("Rescuer controllers")["/api/v2/posts"]
    },
    "/api/v2/rescuers/posts/{pet_id}": {
        ...postDocs("Rescuer controllers")["/api/v2/posts/{pet_id}"]
    },
    "/api/v2/rescuers/posts/search/chrt": {
        ...postDocs("Rescuer controllers")["/api/v2/posts/search/chrt"]
    },
    "/api/v2/rescuers/posts/{pet_id}/images": {
        ...postDocs("Rescuer controllers")["/api/v2/posts/{pet_id}/images"]
    },
    "/api/v2/rescuers/posts/comment/{pet_id}": {
        ...postDocs("Rescuer controllers")["/api/v2/posts/comment/{pet_id}"]
    },
    "/api/v2/rescuers/bulletins": {
        ...bulletinDocs("Rescuer controllers")["/api/v2/bulletins"]
    },
    "/api/v2/rescuers/bulletins/{bulletin_id}": {
        ...bulletinDocs("Rescuer controllers")["/api/v2/bulletins/{bulletin_id}"]
    },
    "/api/v2/rescuers/bulletins/{bulletin_id}/images": {
        ...bulletinDocs("Rescuer controllers")["/api/v2/bulletins/{bulletin_id}/images"]
    },
    "/api/v2/rescuers/blogs": {
        ...blogDocs("Rescuer controllers")["/api/v2/blogs"]
    },
    "/api/v2/rescuers/blogs/{blog_id}": {
        ...blogDocs("Rescuer controllers")["/api/v2/blogs/{blog_id}"]
    },
    "/api/v2/rescuers/blogs/{blog_id}/images": {
        ...blogDocs("Rescuer controllers")["/api/v2/blogs/{blog_id}/images"]
    }
}
