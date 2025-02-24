import { pool } from "../db.js";

export const getanswerchos = async(req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM answer_choices');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener los answer: ', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
        
    }
};

export const getanswercho = async (req, res) => {
    try {
        const { answer_choice_id } = req.params;

        // Validar que answer_choice_id sea un número
        if (isNaN(answer_choice_id)) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }

        const { rows } = await pool.query('SELECT * FROM answer_choices WHERE answer_choice_id = $1', [answer_choice_id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Answer no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al answer:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const deleteanswerchos = async (req, res) => {
    try {
        const { answer_choice_id } = req.params;

        // Validar que answer_choice_id sea un número
        if (isNaN(answer_choice_id)) {
            return res.status(400).json({
                success: false,
                message: 'El answer id debe ser un número válido'
            });
        }

        // Intentar eliminar el usuario
        const { rowCount, rows } = await pool.query(
            'DELETE FROM answer_choices WHERE id = $1 RETURNING *',
            [answer_choice_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Answer no encontrado'
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

export const editanswerchoi = async (req, res) => {
    try {
        const { answer_choice_id } = req.params;
        const data = req.body;

        // Validar que answer_choice_id sea un número válido
        if (isNaN(answer_choice_id)) {
            return res.status(400).json({
                success: false,
                message: 'El answer_choice_id debe ser un número válido'
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
            'UPDATE answer_choices SET response_id = $1, question_id = $2, option_id = $3 WHERE answer_choice_id = $3 RETURNING *',
            [data.response_id, data.question_id,data.option_id, answer_choice_id]
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