import pool from "../db.js"; // ✅ Importación sin destructuring


export const getOptions = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM options');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener opciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const getOption = async (req, res) => {
    try {
        const { option_id } = req.params;

        const { rows } = await pool.query('SELECT * FROM options WHERE id = $1', [option_id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Opción no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error al obtener opción:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const createOption = async (req, res) => {
    try {
        const { question_id, option_text } = req.body;

        if (!question_id || !option_text) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la pregunta y el texto de la opción son obligatorios'
            });
        }

        const questionCheck = await pool.query('SELECT * FROM questions WHERE question_id = $1', [question_id]);
        if (questionCheck.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'La pregunta asociada no existe'
            });
        }

        const { rows } = await pool.query(
            `INSERT INTO options (question_id, option_text) 
             VALUES ($1, $2) RETURNING *`,
            [question_id, option_text]
        );

        res.status(201).json({
            success: true,
            message: 'Opción creada exitosamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al crear opción:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const editOption = async (req, res) => {
    try {
        const { option_id } = req.params;
        const { option_text } = req.body;

        const { rowCount, rows } = await pool.query(
            `UPDATE options SET option_text = COALESCE($1, option_text) 
             WHERE option_id = $2 RETURNING *`,
            [option_text, option_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Opción no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Opción actualizada exitosamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar opción:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const deleteOption = async (req, res) => {
    try {
        const { option_id } = req.params;

        const { rowCount } = await pool.query(
            'DELETE FROM options WHERE id = $1',
            [option_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Opción no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Opción eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar opción:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

