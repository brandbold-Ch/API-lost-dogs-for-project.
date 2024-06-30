module.exports = {
    "/api/v3/auth/login": {
        "post": {
            "tags": [
                "Auth controllers"
            ],
            "summary": "Iniciar sesión.",
            "description": "Obtener token de autorización.",
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
                                "password": {
                                    "type": "string",
                                    "description": "Contraseña del usuario."
                                }
                            },
                            "example": {
                                "email": "example@example.com",
                                "password": "secretpassword"
                            }
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Token generado exitosamente."
                },
                "500": {
                    "description": "Error interno del servidor."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "401": {
                    "description": "Contraseña incorrecta."
                },
                "404": {
                    "description": "El usuario no existe."
                }
            }
        }
    },
    "/api/v3/auth/token/status": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Auth controllers"
            ],
            "summary": "Ver estado del token.",
            "description": "Ver si el token ya caducó.",
            "responses": {
                "200": {
                    "description": "Estado del token."
                },
                "500": {
                    "description": "Error interno del servidor."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "401": {
                    "description": "El token expiró."
                },
                "404": {
                    "description": "La entidad no existe."
                }
            }
        }
    },
    "/api/v3/auth/token/gen": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Auth controllers"
            ],
            "summary": "Generar nuevo token.",
            "description": "Generación de nuevo token.",
            "responses": {
                "200": {
                    "description": "Token nuevo generado o el token aún no caduca."
                },
                "500": {
                    "description": "Error interno del servidor."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "401": {
                    "description": "Sin permisos suficientes."
                },
                "404": {
                    "description": "La entidad no existe."
                }
            }
        }
    }
}
