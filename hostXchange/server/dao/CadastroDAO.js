const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cadastroUsuario = async (nome, email, password, cpf, rg, sexo, passaporte, nacionalidade) => {
  try {
    await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: password,
        cpf,
        rg,
        sexo: sexo,
        nrpassa: passaporte,
        nacional: nacionalidade,
        nacionali: nacionalidade,
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

const cadastroHost = async (nomePropriedade, rua, numero, complemento, cidade, estado, cep, telefone, tipoPropriedade, email, latitude, longitude) => {
  try {
    const host = await prisma.contatoHost.create({
      data: {
        nmprop   : nomePropriedade,
        endereco : rua,
        numero   : numero,
        complem  : complemento,
        cidade   : cidade,
        cdestado : estado,
        nrcep    : cep,
        nrtel    : telefone,
        tipoProp : tipoPropriedade,
        email    : email,
        stcadast : 'A',
        latitude : latitude,
        longitude: longitude
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
    const usuario = await prisma.usuario.findUnique({
      where: { idusuario: Number(idUsuario) },
    });

    if (!usuario) {
      return { success: false, message: 'Usuário não encontrado!' };
    }

    await prisma.usuario.update({
      where: { idusuario: Number(idUsuario) },
      data: {
        tpusuario: 'H',
        idhost: Number(idHost),
      },
    });

    return { success: true, message: 'Seu perfil foi atualizado para Host!' };
  } catch (error) {
    console.error('Erro ao atualizar tipo de usuário:', error);
    return { success: false, message: 'Erro ao atualizar tipo do usuário para Host!' };
  }
};

module.exports = { cadastroUsuario, cadastroHost, updateTipoUsuario };