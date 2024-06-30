module.exports = {
    "/api/v3/admins": {
        "post": {
            "tags": [
                "Admin controllers"
            ],
            "summary": "Crear usuario administrador.",
            "description": "Creación de usuario administrador.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/x-www-form-urlencoded": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "Nombre del administrador."
                                },
                                "lastname": {
                                    "type": "string",
                                    "description": "Apellido del administrador."
                                },
                                "email": {
                                    "type": "string",
                                    "description": "Correo electrónico del administrador."
                                },
                                "password": {
                                    "type": "string",
                                    "description": "Contraseña del administrador."
                                },
                                "token": {
                                    "type": "string",
                                    "description": "Token de acceso."
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Administrador creado correctamente."
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
    "/api/v3/admins/": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Admin controllers"
            ],
            "summary": "Obtener un administrador.",
            "description": "Obtener los datos de un administrador.",
            "responses": {
                "200": {
                    "description": "Datos del administrador."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Administrador no encontrado."
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
                "Admin controllers"
            ],
            "summary": "Eliminar administrador.",
            "description": "Eliminar usuario administrador.",
            "responses": {
                "204": {
                    "description": "Administrador eliminado."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Administrador no encontrado."
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
                "Admin controllers"
            ],
            "summary": "Actualizar datos de administrador.",
            "description": "Actualizar datos de usuario administrador.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/x-www-form-urlencoded": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "Nombre del administrador."
                                },
                                "lastname": {
                                    "type": "string",
                                    "description": "Apellido del administrador."
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "202": {
                    "description": "Datos de administrador actualizados."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Administrador no encontrado."
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
    "/api/v3/admins/auth": {
        "put": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Admin controllers"
            ],
            "summary": "Actualizar las credenciales de un administrador.",
            "description": "Actualizar el email y contraseña de un usuario administrador.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/x-www-form-urlencoded": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "type": "string",
                                    "description": "Email del administrador."
                                },
                                "new_password": {
                                    "type": "string",
                                    "description": "Nueva contraseña para el administrador."
                                },
                                "old_password": {
                                    "type": "string",
                                    "description": "Actual contraseña del administrador."
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
                    "description": "Administrador no encontrado."
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
    "/api/v3/admins/requests": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Admin controllers"
            ],
            "summary": "Obtener las solicitudes de rescatistas.",
            "description": "Obtener todas las solicitudes de rescatistas.",
            "responses": {
                "200": {
                    "description": "Todas las solicitudes."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Administrador no encontrado o Solicitud no encontrada."
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
    "/api/v3/admins/requests/{req_id}": {
        "delete": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Admin controllers"
            ],
            "summary": "Eliminar solicitud.",
            "description": "Eliminar solicitud de rescatista.",
            "parameters": [
                {
                    "in": "path",
                    "name": "req_id",
                    "description": "Id de solicitud.",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Solicitud no encontrado."
                },
                "204": {
                    "description": "Solicitud eliminado."
                },
                "401": {
                    "description": "Sin permisos para ver esta ruta."
                },
                "500": {
                    "description": "Error interno del servidor."
                }
            }
        },
        "post": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Admin controllers"
            ],
            "summary": "Acciones para solicitudes.",
            "description": "Activar, rechazar o desactivar solicitud.",
            "parameters": [
                {
                    "in": "path",
                    "name": "req_id",
                    "description": "Id de solicitud.",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "in": "query",
                    "name": "action",
                    "description": "Opción para la solicitud",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "enum": [
                            "activate",
                            "reject",
                            "disable"
                        ]
                    }
                }
            ],
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Solicitud no encontrado."
                },
                "200": {
                    "description": "Solicitud modificada."
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
    "/api/v3/admins/requests/search": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Admin controllers"
            ],
            "summary": "Filtrar solicitudes.",
            "description": "Filtro de solicitudes de rescatistas.",
            "parameters": [
                {
                    "in": "query",
                    "name": "status",
                    "description": "Opción de filtro",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "enum": [
                            "active",
                            "rejected",
                            "disabled",
                            "pending"
                        ]
                    }
                }
            ],
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Solicitud no encontrado."
                },
                "200": {
                    "description": "Solicitudes filtradas."
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
    "/api/v3/admins/rescuers": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Admin controllers"
            ],
            "summary": "Obtener todos los rescatistas.",
            "description": "Obtener todas las solicitudes.",
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "200": {
                    "description": "Todos las solicitudes."
                },
                "404": {
                    "description": "Administrador no encontrado."
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
    "/api/v3/admins/rescuers/{rescuer_id}": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Admin controllers"
            ],
            "summary": "Obener un rescatista.",
            "description": "Obtener los datos de un rescatistas.",
            "parameters": [
                {
                    "in": "path",
                    "name": "rescuer_id",
                    "description": "Id de rescatista.",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Administrador no encontrado o Rescatista no encontrado."
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
                "Admin controllers"
            ],
            "summary": "Eliminar un rescatista.",
            "description": "Eliminar un usuario rescatista.",
            "parameters": [
                {
                    "in": "path",
                    "name": "rescuer_id",
                    "description": "Id de rescatista.",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Administrador no encontrado o Rescatista no encontrado."
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
        }
    },
    "/api/v3/admins/users": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Admin controllers"
            ],
            "summary": "Obtener los usuarios.",
            "description": "Obtener todos los usuarios.",
            "responses": {
                "200": {
                    "description": "Todas los usuarios."
                },
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Administrador no encontrado."
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
    "/api/v3/admins/users/{user_id}": {
        "get": {
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "tags": [
                "Admin controllers"
            ],
            "summary": "Obener un usuario.",
            "description": "Obtener los datos de un usuario.",
            "parameters": [
                {
                    "in": "path",
                    "name": "user_id",
                    "description": "Id de rescatista.",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Administrador no encontrado o Usuario no encontrado."
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
                "Admin controllers"
            ],
            "summary": "Eliminar un usuario.",
            "description": "Eliminar un usuario.",
            "parameters": [
                {
                    "in": "path",
                    "name": "user_id",
                    "description": "Id de usuario.",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "400": {
                    "description": "Error del cliente."
                },
                "404": {
                    "description": "Administrador no encontrado o Usuario no encontrado."
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
        }
    }
}
