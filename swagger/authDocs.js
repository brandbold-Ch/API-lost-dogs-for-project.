module.exports = {
    "/api/v2/auth/login": {
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
    }
}
