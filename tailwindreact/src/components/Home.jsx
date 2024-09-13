import { useState, useEffect } from "react";

const Home = () => {
  const url = "http://localhost:3000/Clientes"; // Usar a mesma URL que está no Postman
  const [clientes, setClientes] = useState([]);
  const [editConfirmId, setEditConfirmId] = useState(null); // Estado para armazenar o ID do cliente que será editado
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // Estado para armazenar o ID do cliente que será deletado
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [erro, setErro] = useState('');

  // Buscar clientes existentes na primeira carga
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setClientes(data); // Atualiza o estado com os clientes cadastrados
      } catch (error) {
        console.error("Erro ao buscar clientes: ", error);
      }
    }
    fetchData();
  }, []);

  // Função para confirmar a edição do cliente
  const confirmEdit = async (id) => {
    const clienteExistente = clientes.find(cliente => cliente.id === id);

    // Verificar se o email já existe
    if (clientes.some((cliente) => cliente.email === email && cliente.id !== id)) {
      setErro("Email já existe. Por favor, escolha outro.");
      return;
    }

    try {
      // Atualizar os dados do cliente
      const updatedCliente = {
        ...clienteExistente,
        nome,
        email,
        cidade,
        telefone,
        cargo,
      };

      const res = await fetch(`${url}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCliente), // Enviar os novos dados como JSON
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar cliente");
      }

      const updatedClienteData = await res.json();
      setClientes(clientes.map(cliente => cliente.id === id ? updatedClienteData : cliente)); // Atualiza a lista com o cliente editado
      setEditConfirmId(null); // Reseta o estado de edição
      setErro('');
    } catch (error) {
      console.error("Erro ao editar cliente: ", error);
      setErro("Erro ao editar cliente.");
    }
  };

  // Função para mostrar a confirmação de edição
  const handleEditClick = (cliente) => {
    setNome(cliente.nome);
    setEmail(cliente.email);
    setCidade(cliente.cidade);
    setTelefone(cliente.telefone);
    setCargo(cliente.cargo);
    setEditConfirmId(cliente.id); // Define o ID do cliente que está prestes a ser editado
  };

  // Função para cancelar a edição
  const cancelEdit = () => {
    setEditConfirmId(null); // Cancela a operação de editar
    setErro('');
  };

  // Função deletar user
  const confirmDelete = async (id) => {
    try {
      await fetch(`${url}/${id}`, { method: "DELETE" });
      setClientes(clientes.filter((cliente) => cliente.id !== id)); // Remove o cliente localmente
      setDeleteConfirmId(null); // Reseta o estado de deleção
    } catch (error) {
      console.error("Erro ao deletar cliente: ", error);
    }
  };

  // Função para exibir o aviso de confirmação antes de deletar
  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id); // Define o ID do cliente que está prestes a ser deletado
  };

  // Função para cancelar a deleção
  const cancelDelete = () => {
    setDeleteConfirmId(null); // Cancela a operação de deletar
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl mb-4 text-blue-500">Lista de Clientes</h2>

      {/* Listagem de clientes em cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.length > 0 ? (
          clientes.map((cliente) => (
            <div key={cliente.id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 border border-gray-500 rounded bg-blue-300 text-center ">
                {cliente.nome}
              </h3>
              <p className="pt-3">Email: {cliente.email}</p>
              <p>Telefone: <span className="font-bold ">{cliente.telefone}</span></p>
              <p>Cidade: {cliente.cidade}</p>
              <p>Cargo: {cliente.cargo}</p>

              {/* Botões de Editar e Deletar */}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleDeleteClick(cliente.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Deletar
                </button>
                <button
                  onClick={() => handleEditClick(cliente)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Editar
                </button>
              </div>

              {/* Mostrar confirmação de deleção */}
              {deleteConfirmId === cliente.id && (
                <div className="mt-4">
                  <p className="text-blue-700 font-semibold">
                    Você realmente quer deletar?
                  </p>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => confirmDelete(cliente.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg" // Cor do botão "Sim"
                    >
                      Sim
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg" // Cor do botão "Não"
                    >
                      Não
                    </button>
                  </div>
                </div>
              )}

              {/* Mostrar confirmação de edição */}
              {editConfirmId === cliente.id && (
                <div className="mt-4">
                  <p className="text-blue-700 font-semibold">
                    Você realmente quer editar?
                  </p>
                  <div className="flex flex-col mt-2">
                    <label htmlFor="nome">Nome:</label>
                    <input
                      type="text"
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="border p-2 rounded"
                    />
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border p-2 rounded"
                    />
                    <label htmlFor="telefone">Telefone:</label>
                    <input
                      type="text"
                      id="telefone"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="border p-2 rounded"
                    />
                    <label htmlFor="cidade">Cidade:</label>
                    <input
                      type="text"
                      id="cidade"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="border p-2 rounded"
                    />
                    <label htmlFor="cargo">Cargo:</label>
                    <input
                      type="text"
                      id="cargo"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      className="border p-2 rounded"
                    />

                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={() => confirmEdit(cliente.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg" // Botão para confirmar edição
                      >
                        Sim
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg" // Botão para cancelar edição
                      >
                        Não
                      </button>
                    </div>
                    {erro && <p className="text-red-500">{erro}</p>} {/* Exibir mensagem de erro */}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Nenhum cliente cadastrado.</p> // Mensagem quando não há clientes cadastrados
        )}
      </div>
    </div>
  );
};

export default Home;
