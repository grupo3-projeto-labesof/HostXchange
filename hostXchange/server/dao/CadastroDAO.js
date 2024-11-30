const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cadastroUsuario = async (nome, email, password, cpf, rg, sexo, nacionalidade, passaporte) => {
  try {
    await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: password,
        cpf,
        rg,
        sexo,
        nrpassa: passaporte,
        nacional: nacionalidade,
        stusuario: 'A',  // Usuário
        tpusuario: 'V'   // Tipo de usuário padrão viajante
      }
    });
    return { success: true, message: 'Usuário cadastrado com sucesso!' };
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return { success: false, message: 'Erro ao cadastrar usuário!' };
  }
};

const cadastroHost = async (nomePropriedade, rua, numero, complemento, cidade, estado, cep, telefone, tipoPropriedade, email) => {
  try {
    const host = await prisma.contatohost.create({
      data: {
        nmprop: nomePropriedade,
        endereco: rua,
        numero,
        complem: complemento,
        cidade,
        cdestado: estado,
        nrcep: cep,
        nrtel: telefone,
        tipoProp: tipoPropriedade,
        email,
        stcadast: 'A'
      }
    });
    return { success: true, idHost: host.idctt };
  } catch (error) {
    console.error('Erro ao cadastrar host:', error);
    return { success: false, message: 'Erro ao cadastrar host!' };
  }
};

const updateTipoUsuario = async (idUsuario, idHost) => {
  try {
    await prisma.usuario.update({
      where: { idusuario: idUsuario },
      data: {
        tpusuario: 'H',
        contatoHostId: idHost
      }
    });
    return { success: true, message: 'Seu perfil foi atualizado para Host!' };
  } catch (error) {
    console.error('Erro ao atualizar tipo de usuário:', error);
    return { success: false, message: 'Erro ao atualizar tipo do usuário para Host!' };
  }
};

module.exports = { cadastroUsuario, cadastroHost, updateTipoUsuario };