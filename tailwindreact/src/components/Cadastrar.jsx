import { useState, useEffect } from "react";

const Cadastrar = () => {
  const url = "http://localhost:3000/Clientes"; {/*Usar a mesma url que esta no postMan*/}

  const [clientes, setClientes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState(''); // Estado para armazenar o nome
  const [email, setEmail] = useState(''); // Estado para armazenar o email
  const [cidade, setCidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Pegando o res através de uma requisição http
    async function fetchData() {
      const res = await fetch(url);
      const data = await res.json(); 
      setClientes(data);
    }
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');

    if (!cargo) {
      setErro("Escolha pelo menos 1 cargo ");
      alert("Escolha pelo menos 1 cargo ");
      return;
    }

    // Verificar se o cliente já existe pelo email
    const clienteExistente = clientes.find(cliente => cliente.email === email);

    if (clienteExistente) {
      setErro("Cliente já cadastrado com este email");
      alert("Cliente já cadastrado com este email");
      return;
    }

    const novoCliente = {
      nome,
      email,
      telefone,
      cidade,
      cargo,
    };

    try {
      const res = await fetch(url, {
        method: "POST", // Usando o método POST para enviar os dados
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoCliente), // Enviando os dados como JSON
      });

      if (!res.ok) {
        throw new Error("Erro ao enviar os dados");
      }

      // Limpar os campos do formulário
      setNome("");
      setEmail("");
      setTelefone("");
      setCidade("");
      setCargo("");

      const clienteAdicionado = await res.json();
      setClientes([...clientes, clienteAdicionado]); // Atualizar o estado com o novo cliente
      alert("Cliente cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar cliente");
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 mt-11">
      <div>
        <label htmlFor="nome" className="block text-xl text-black">
          Nome:
        </label>
        <input
          type="text"
          id="nome"
          placeholder="Informe seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="w-full font-medium text-lg text-gray-800 bg-blue-300 border border-gray-400 rounded-lg"
        />

        <label htmlFor="email" className="block text-xl text-black">
          Email:
        </label>
        <input
          type="email"
          id="email"
          placeholder="Informe um email válido"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full font-medium text-lg text-gray-800 bg-blue-300 border border-gray-400 rounded-lg"
        />

        <label htmlFor="telefone" className="block text-xl">
          Telefone:
        </label>
        <input
          type="text"
          id="telefone"
          placeholder="Informe seu telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
          className="w-full font-medium text-lg text-gray-900 bg-blue-300 border border-gray-400 rounded-lg"
        />

        <label htmlFor="cidade" className="block text-xl text-black">
          Cidade:
        </label>
        <input
          type="text"
          id="cidade"
          placeholder="Informe sua cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          required
          className="w-full font-medium text-lg text-gray-900 bg-blue-300 border border-gray-400 rounded-lg"
        />

        <div className="mt-4">
          <button
            id="dropdownRadioBgHoverButton"
            onClick={toggleDropdown}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between"
            type="button"
          >
            Cargo{" "}
            <svg
              className="w-2.5 h-2.5 ml-auto"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {isOpen && (
            <div
              id="dropdownRadioBgHover"
              className="z-10 w-full bg-white divide-y divide-gray-100 rounded-lg shadow mt-2"
            >
              <ul
                className="p-3 space-y-1 text-sm text-gray-700"
                aria-labelledby="dropdownRadioBgHoverButton"
              >
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100">
                    <input
                      id="default-radio-4"
                      type="radio"
                      value="Junior"
                      name="cargo"
                      checked={cargo === "Junior"}
                      onChange={(e) => setCargo(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="default-radio-4"
                      className="w-full ms-2 text-sm font-medium text-gray-900"
                    >
                      Junior
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100">
                    <input
                      id="default-radio-5"
                      type="radio"
                      value="Pleno"
                      name="cargo"
                      checked={cargo === "Pleno"}
                      onChange={(e) => setCargo(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="default-radio-5"
                      className="w-full ms-2 text-sm font-medium text-gray-900"
                    >
                      Pleno
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100">
                    <input
                      id="default-radio-6"
                      type="radio"
                      value="Senior"
                      name="cargo"
                      checked={cargo === "Senior"}
                      onChange={(e) => setCargo(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="default-radio-6"
                      className="w-full ms-2 text-sm font-medium text-gray-900"
                    >
                      Senior
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
        {erro && <p className="text-red-500">{erro}</p>} {/* Exibir mensagem de erro */ }
        <input
          type="submit"
          value="Enviar"
          className="block w-full rounded-xl bg-green-500 mt-7 p-2 text-white"
        />
      </div>
    </form>
  );
};

export default Cadastrar;
