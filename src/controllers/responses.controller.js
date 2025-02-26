import pool from "../db.js"; // ✅ Importación sin destructuring


export const getResponses = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM responses');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener respuestas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const getResponse = async (req, res) => {
    try {
        const { response_id } = req.params;

        const { rows } = await pool.query('SELECT * FROM responses WHERE id = $1', [response_id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Respuesta no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error al obtener respuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const createResponse = async (req, res) => {
    try {
        const { user_id, form_id, submitted_at } = req.body;

        if (!user_id || !form_id || !submitted_at) {
            return res.status(400).json({
                success: false,
                message: 'El ID de usuario, el ID de formulario y la fecha de envío son obligatorios'
            });
        }

        // Validar que el usuario y el formulario existan
        const userCheck = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        if (userCheck.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El usuario no existe'
            });
        }

        const formCheck = await pool.query('SELECT * FROM forms WHERE form_id = $1', [form_id]);
        if (formCheck.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El formulario no existe'
            });
        }

        const { rows } = await pool.query(
            `INSERT INTO responses (user_id, form_id, submitted_at) 
             VALUES ($1, $2, $3) RETURNING *`,
            [user_id, form_id, submitted_at]
        );

        res.status(201).json({
            success: true,
            message: 'Respuesta creada exitosamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al crear respuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const editResponse = async (req, res) => {
    try {
        const { response_id } = req.params;
        const { submitted_at } = req.body;

        const { rowCount, rows } = await pool.query(
            `UPDATE responses SET submitted_at = COALESCE($1, submitted_at) WHERE id = $2 RETURNING *`,
            [submitted_at, response_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Respuesta no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Respuesta actualizada exitosamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar respuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const deleteResponse = async (req, res) => {
    try {
        const { response_id } = req.params;

        const { rowCount } = await pool.query(
            'DELETE FROM responses WHERE id = $1',
            [response_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Respuesta no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Respuesta eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar respuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
