import { useState, useEffect } from "react";

const Home = () => {
  const url = "http://localhost:3000/clientes"; // URL da API para o arquivo JSON

  const [clientes, setClientes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [erro, setErro] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Buscar clientes existentes na primeira carga
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(url);
      const data = await res.json();
      setClientes(data);
    }
    fetchData();
  }, []);

  // Adicionar ou atualizar cliente
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cargo) {
      setErro("Escolha pelo menos 1 cargo");
      return;
    }

    if (isEditing) {
      // Atualizar cliente existente
      const updatedCliente = { id: editId, nome, email, telefone, cidade, cargo };

      const res = await fetch(`${url}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCliente),
      });

      if (res.ok) {
        setClientes(clientes.map(cliente => (cliente.id === editId ? updatedCliente : cliente)));
        resetForm();
      }
    } else {
      // Gerar ID sequencial para novo cliente
      const lastId = clientes.length > 0 ? Math.max(...clientes.map(cliente => cliente.id)) : 0;
      const newId = lastId + 1;

      const novoCliente = { id: newId, nome, email, telefone, cidade, cargo };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoCliente),
      });

      if (res.ok) {
        setClientes([...clientes, novoCliente]);
        resetForm();
      }
    }
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setCidade("");
    setCargo("");
    setIsEditing(false);
    setEditId(null);
    setErro('');
  };

  // Função para excluir cliente
  const handleDelete = async (id) => {
    const res = await fetch(`${url}/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setClientes(clientes.filter(cliente => cliente.id !== id));
    }
  };

  // Função para preencher o formulário ao editar cliente
  const handleEdit = (cliente) => {
    setNome(cliente.nome);
    setEmail(cliente.email);
    setTelefone(cliente.telefone);
    setCidade(cliente.cidade);
    setCargo(cliente.cargo);
    setIsEditing(true);
    setEditId(cliente.id);
  };

  // Dropdown toggle para cargo
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Formulário para cadastrar ou editar */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mb-8">
        <h2 className="text-2xl mb-4">{isEditing ? "Editar Cliente" : "Cadastrar Cliente"}</h2>
        
        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="telefone" className="block text-sm font-medium">Telefone:</label>
          <input
            type="text"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="cidade" className="block text-sm font-medium">Cidade:</label>
          <input
            type="text"
            id="cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={toggleDropdown}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            {cargo || "Escolha o Cargo"}
          </button>

          {isOpen && (
            <ul className="border rounded mt-2">
              {["Junior", "Pleno", "Senior"].map((opcao, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setCargo(opcao);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {opcao}
                </li>
              ))}
            </ul>
          )}
        </div>

        {erro && <p className="text-red-500">{erro}</p>}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg"
        >
          {isEditing ? "Salvar Alterações" : "Cadastrar"}
        </button>
      </form>

      {/* Listagem de clientes em cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((cliente) => (
          <div key={cliente.id} className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold">{cliente.nome}</h3>
            <p>Email: {cliente.email}</p>
            <p>Telefone: {cliente.telefone}</p>
            <p>Cidade: {cliente.cidade}</p>
            <p>Cargo: {cliente.cargo}</p>
            
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(cliente)}
                className="bg-yellow-500 text-white py-1 px-4 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => handleDelete(cliente.id)}
                className="bg-red-500 text-white py-1 px-4 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
