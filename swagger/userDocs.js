const { postDocs } = require("./postDocs");


module.exports = {
    "/api/v3/users": {
        "post": {
            "tags": [
                "User controllers"
            ],
            "summary": "Crear usuario.",
            "description": "Creación de usuario.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "Nombre del usuario."
                                },
                                "lastname": {
                                    "type": "string",
                                    "description": "Apellido del usuario."
                                },
                                "phone_number": {
                                    "type": "string",
                                    "description": "Número de celular del usuario."
                                },
                                "email": {
                                    "type": "string",
                                    "description": "Correo electrónico del usuario."
                                },
                                "password": {
                                    "type": "string",
                                    "description": "Contraseña del usuario."
                                }
                            },
                            "example": {
                                "name": "John",
                                "lastname": "Doe",
                                "phone_number": "9876543210",
                                "email": "john@example.com",
                                "password": "secretpassword"
                            }
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Usuario creado correctamente."
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
                "User controllers"
            ],
            "summary": "Obener un usuario.",
            "description": "Obtener los datos de un usuario.",
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Usuario no encontrado."
                },
                "200": {
                    "description": "Datos del usuario."
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
                "User controllers"
            ],
            "summary": "Eliminar un usuario.",
            "description": "Eliminar un usuario usuario.",
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Usuario no encontrado."
                },
                "204": {
                    "description": "Usuario eliminado."
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
                "User controllers"
            ],
            "summary": "Actualizar datos de usuario.",
            "description": "Actualizar datos de usuario.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "Nombre del usuario."
                                },
                                "lastname": {
                                    "type": "string",
                                    "description": "Apellido del usuario."
                                },
                                "phone_number": {
                                    "type": "string",
                                    "description": "Número de celular del usuario."
                                },
                                "social_networks": {
                                    "type": "object",
                                    "description": "Objeto de redes sociales."
                                }
                            },
                            "example": {
                                "name": "John",
                                "lastname": "Doe",
                                "phone_number": "1234567890",
                                "social_networks": {
                                    "facebook": "john.doe",
                                    "twitter": "@john_doe"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "202": {
                    "description": "Datos de usuario actualizados."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Usuario no encontrado."
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
    "/api/v3/users/networks": {
        "delete": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "User controllers"
            ],
            "summary": "Eliminar una red social.",
            "description": "Eliminar una red social de usuario.",
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
                    "description": "Usuario no encontrado."
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
    "/api/v3/users/requests": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "User controllers"
            ],
            "summary": "Ver solicitudes.",
            "description": "Ver solicitudes pendientes.",
            "responses": {
                "201": {
                    "description": "Solicitud ."
                },
                "500": {
                    "description": "Error interno del servidor."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Solicitudes no encontradas o Usuario no encontrado."
                }
            }
        }
    },
    "/api/v3/users/requests/rescuer": {
        "post": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "User controllers"
            ],
            "summary": "Crear solcitud de rescatista.",
            "description": "Creación de solicitud para ser rescatista.",
            "responses": {
                "201": {
                    "description": "Solicitud creada correctamente."
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
    "/api/v3/users/requests/association": {
        "post": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "User controllers"
            ],
            "summary": "Crear solcitud de asociación.",
            "description": "Creación de solicitud para ser una asociación.",
            "responses": {
                "201": {
                    "description": "Solicitud creada correctamente."
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
    "/api/v3/users/auth": {
        "put": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "User controllers"
            ],
            "summary": "Actualizar las credenciales de un usuario.",
            "description": "Actualizar el email y contraseña de un usuario.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/x-www-form-urlencoded": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "type": "string",
                                    "description": "Email del usuario."
                                },
                                "new_password": {
                                    "type": "string",
                                    "description": "Nueva contraseña para el usuario."
                                },
                                "old_password": {
                                    "type": "string",
                                    "description": "Actual contraseña del usuario."
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
                    "description": "Usuario no encontrado."
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
    "/api/v3/users/posts": {
        ...postDocs("User controllers")["/api/v3/posts"]
    },
    "/api/v3/users/posts/{pet_id}": {
        ...postDocs("User controllers")["/api/v3/posts/{pet_id}"]
    },
    "/api/v3/users/posts/search/chrt": {
        ...postDocs("User controllers")["/api/v3/posts/search/chrt"]
    },
    "/api/v3/users/posts/{pet_id}/images": {
        ...postDocs("User controllers")["/api/v3/posts/{pet_id}/images"]
    },
    "/api/v3/users/posts/comment/{pet_id}": {
        ...postDocs("User controllers")["/api/v3/posts/comment/{pet_id}"]
    }
}
