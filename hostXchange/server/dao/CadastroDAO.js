const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cadastroUsuario = async (nome, email, password, cpf, rg, nrpassa) => {
  try {
    await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: password, // Lembre-se de que a senha deve ser criptografada no Controller
        cpf,
        rg,
        nrpassa,
        stusuario: 'A',  // Status do usuário
        tpusuario: 'V'   // Tipo de usuário
      }
    });
    return { success: true, message: 'Usuário cadastrado com sucesso!' };
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return { success: false, message: 'Erro ao cadastrar usuário!' };
  }
};

const cadastroHost = async (nome, endereco, cddestado, cep, tel, email) => {
  try {
    const host = await prisma.contatoHost.create({
      data: {
        nmprop: nome,
        endereco,
        cdestado: cddestado,
        nrcep: cep,
        nrtel: tel,
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
    return { success: true, message: 'Tipo de usuário atualizado para Host!' };
  } catch (error) {
    console.error('Erro ao atualizar tipo de usuário:', error);
    return { success: false, message: 'Erro ao atualizar tipo de usuário!' };
  }
};

module.exports = { cadastroUsuario, cadastroHost, updateTipoUsuario };