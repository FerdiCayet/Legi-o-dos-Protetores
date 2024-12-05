const { db, admin } = require('../config/firebaseConfig.js');

// Função para deletar um usuário pelo e-mail
async function deleteUserByEmail(email) {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (!snapshot.empty) {
        snapshot.forEach(doc => {
            doc.ref.delete().then(() => {
                console.log(`Usuário com e-mail ${email} deletado com sucesso.`);
            }).catch(error => {
                console.error('Erro ao deletar usuário:', error);
            });
        });
    } else {
        console.error('Usuário não encontrado.');
    }
}

// Função para lidar com a solicitação de cadastro de novo usuário
module.exports = async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, name } = req.body;

        try {
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('email', '==', email).get();
            
            // Verifica se o e-mail já está cadastrado
            if (!snapshot.empty) {
                return res.status(400).json({ message: 'E-mail já cadastrado.' });
            }

            await usersRef.add({ email, name }); // Cadastra novo usuário

            console.log('Novo usuário:', { email, name });

            return res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
        } catch (error) {
            console.error('Error adding document:', error);
            return res.status(500).json({ message: 'Ocorreu um erro ao cadastrar o usuário. Por favor, tente novamente mais tarde...' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

// Exportando a função para deletar um usuário pelo e-mail
module.exports.deleteUserByEmail = deleteUserByEmail;