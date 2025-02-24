import { pool } from "../db.js";

export const getUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const { userID } = req.params;

        // Validar que userID sea un número
        if (isNaN(userID)) {
            return res.status(400).json({
                success: false,
                message: 'El userID debe ser un número válido'
            });
        }

        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userID]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};


export const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validar que name y email no estén vacíos
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'El nombre y el correo electrónico son obligatorios'
            });
        }

        // Insertar usuario y devolver los datos creados
        const { rows } = await pool.query(
            'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);

        // Manejo de errores específicos
        if (error.code === '23505') { // Código de error de PostgreSQL para valores duplicados
            return res.status(409).json({
                success: false,
                message: 'El correo electrónico ya está registrado'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userID } = req.params;

        // Validar que userID sea un número
        if (isNaN(userID)) {
            return res.status(400).json({
                success: false,
                message: 'El userID debe ser un número válido'
            });
        }

        // Intentar eliminar el usuario
        const { rowCount, rows } = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userID]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente',
            data: rows[0] // Devolvemos el usuario eliminado para confirmación
        });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};


export const editUser = async (req, res) => {
    try {
        const { userID } = req.params;
        const data = req.body;

        // Validar que userID sea un número válido
        if (isNaN(userID)) {
            return res.status(400).json({
                success: false,
                message: 'El userID debe ser un número válido'
            });
        }

        // Validar que los datos no estén vacíos
        if (!data.name || !data.email) {
            return res.status(400).json({
                success: false,
                message: 'El nombre y el correo electrónico son obligatorios'
            });
        }

        // Intentar actualizar el usuario
        const { rowCount, rows } = await pool.query(
            'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
            [data.name, data.email, userID]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
